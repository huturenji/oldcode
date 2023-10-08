/* eslint-disable import/extensions */
/*
* 装修页面
* */
import { connect } from 'dva/index';
import Link from 'umi/link';
import router from 'umi/router';
import React, { Component, Fragment } from 'react';
import { Form ,Button,Upload,message} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import {
    failTip,
    sucTip,
    getSldEmptyH,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    getSldHorLine,
    sldComLanguage,
    isEmpty,
    setSession,
    sldPopConfirmDiy
} from '@/utils/utils';
import mdiy from './mdecorate.less';
import global from '@/global.less';
import MDiyItem from '@/components/Decorate';
import MDiyItemEdit from '@/components/Decorate/index-edit';
import ALibbSvg from '@/components/ALibbSvg';
import AddItemModal from './edit-comp';
import {constructCompData} from '@/components/Decorate/common/renderComponent'
import PreviewIframe from '@/components/Decorate/common/preview-iframe/index'
import IndexDbClass from '@/utils/indexLocalDatabase';

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const indexdb = new IndexDbClass('adminDB','store');

// eslint-disable-next-line no-shadow
@connect(({ mdecorate, pc_home, project,global }) => ({
    mdecorate,
    pc_home,
    project,
    global
}))
@Form.create()

export default class Edit_diy_page extends Component {
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    decorateDataCacheTimer = null;// 存储定时器

    constructor(props) {
        super(props);
        this.index = 0;//添加的模块数量
        this.state = {
            menu_data: [],//左侧菜单数据
            query: {},
            items: getItems(10),
            selected: [],
            childrenFlag:false,//是否渲染嵌套组建的开关
            select_data: {},//选中的当前数据
            refresh_center_flag: 0,//中间组件是否刷新标示
            refresh_right_flag: 0,//右面组件是否刷新标示
            cat_nav: [],
            special_select_data: {},//选中的不可拖动的数据
            editData: {},
            editFlag:false, //编辑模板渲染子组件还是父组件的开关
            showIframe:false,
            iframeUrl:'',
            decoParams:[],
            decoType:''
        };
    }

    componentDidMount() {
        this.setState({
            query:this.props.query
        },()=>{
            this.get_diy_menu();
            this.get_diy_page_detial(this.state.query.id);
        })
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
        
        // 三十秒开始定时缓存装修数据
        this.startCacheDecorateData();
    }


    componentWillUnmount(){
        // 清除挂载的定时器
        this.clearDecorateDataCacheTimer()
    }

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;
        let { selected, menu_data,select_data } = this.state;
        // dropped outside the list
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            //子组件排序
            if(source.droppableId == 'droppableChildren'){
                select_data.children[select_data.tempCurrChildrenKey] = reorder(
                    select_data.children?.[select_data.tempCurrChildrenKey],
                    source.index,
                    destination.index,
                );
                //修改对象引用，防止数组浅比较导致setState无效
                let index = selected.findIndex(obj => obj.id == select_data.id)
                selected[index] = {...select_data}
                this.setState({selected});
                return;
            }
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index,
            );
            selected = items
            this.setState({selected});
        } else {
            if(destination.droppableId === 'droppable2'&&source.droppableId == 'droppable'){
                let con = constructCompData({id: ++this.index, name: result.draggableId, menuData: menu_data.filter(item => item.name == result.draggableId)[0]});
                selected.splice(destination.index, 0, con);
                this.setState({
                    items: result.droppable,
                    selected,
                    childrenFlag:false
                });
                selected.forEach((e)=>{
                    setSession(`${e.name}_${e.id}`,true)
                })
            }else if(destination.droppableId === 'droppableChildren'&&source.droppableId == 'droppable'){
                let con = constructCompData({id: new Date().getTime(), name: result.draggableId, menuData: menu_data.filter(item => item.name == result.draggableId)[0]});
                con.props.isChildren = true//表示当前组件是子组件
                con.temp = true;//表示刚拖拽还未初始化
                if(!select_data.children){
                    failTip('请先选择嵌套组件')
                    return;
                }
                select_data.children[select_data.tempCurrChildrenKey].splice(destination.index, 0, con);
                select_data = {...select_data, children: select_data.children};
                this.handleCurSelData(select_data)
                select_data.children[select_data.tempCurrChildrenKey].forEach((e)=>{
                    setSession(`${e.name}_${e.id}`,true)
                })
            }else{
                return
            }
        }
        let data = JSON.parse(JSON.stringify(selected))
        this.setState({ decoParams:data })
    };

    //获取装修菜单
    get_diy_menu = () => {
        const { dispatch } = this.props;
        const { query } = this.state;
        dispatch({
            type: 'mdecorate/get_m_diy_menu',
            payload: { isEnable: 1, apply: query.type },//获取首页可用的菜单
            callback: (res) => {
                if (res.state == 200) {
                    let tmp_data = res.data
                    tmp_data.forEach(item => {
                        item.id = item.name;
                    });
                    this.setState({ menu_data: tmp_data });
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    //获取装修的详情
    get_diy_page_detial = (id) => {
        const { dispatch } = this.props;
        let { selected, query } = this.state;
        dispatch({
            type: 'mdecorate/get_diy_page_detail',
            payload: { decoId: id, channelId: query.channelId },
            callback: (res) => {
                if (res.state == 200) {
                    //空处理
                    if (res.data.data) {
                        let tmp_data = JSON.parse(res.data.data);  
                        if(!tmp_data.some(item => item.name == 'titlebar')){
                            selected = tmp_data.unshift({
                                "id":98,
                                "name":"titlebar",
                                "type":"page",
                                "props": {
                                    "is_show":true,
                                    "admin_text":"页面导航栏",
                                    "admin_icon":"titlebar"
                                },
                                "data":[{
                                    "showBack":true,
                                    "suspend":false,
                                    "background":"white",
                                    "opacity":"100",
                                    "themeMode":"dark",
                                    "color":"black",
                                    "showTitle":true
                                }]
                            })
                        }
                        if(!tmp_data.some(item => item.name == 'statusbar')){
                            selected = tmp_data.unshift({
                                "id":99,
                                "name":"statusbar",
                                "type":"page",
                                "props": {
                                    "is_show":true,
                                    "admin_text":"状态栏",
                                    "admin_icon":"statusbar"
                                },
                                "data":[{
                                    "suspend":false,
                                    "background":"white",
                                    "opacity":"100",
                                    "themeMode":"dark",
                                    "contentFillTop":true
                                }]
                            })
                        }       
                        for (let i=0; i<tmp_data.length; i++) {
                            this.index++;
                            tmp_data[i].id = this.index;
                        }
                        selected = tmp_data;
                    } else {
                        selected = [
                            {
                                "id":1,
                                "name":"statusbar",
                                "type":"page",
                                "props": {
                                    "is_show":true,
                                    "admin_text":"状态栏",
                                    "admin_icon":"statusbar"
                                },
                                "data":[{
                                    "suspend":false,
                                    "background":"white",
                                    "opacity":"100",
                                    "themeMode":"dark",
                                    "contentFillTop":true
                                }]
                            },
                            {
                                "id":2,
                                "name":"titlebar",
                                "type":"page",
                                "props": {
                                    "is_show":true,
                                    "admin_text":"页面导航栏",
                                    "admin_icon":"titlebar"
                                },
                                "data":[{
                                    "showBack":true,
                                    "suspend":false,
                                    "background":"white",
                                    "opacity":"100",
                                    "themeMode":"dark",
                                    "color":"black",
                                    "showTitle":true
                                }]
                            }
                        ];
                        for (let i=0; i<selected.length; i++) {
                            this.index++;
                            selected[i].id = this.index;
                        }
                    }
                    query.name = res.data.name;
                    this.setState({ selected });
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    /**
     * 子组件排序、删除等操作
     */
    updateEditData = (children) => {
        let { selected, select_data } = this.state;
        select_data.children[select_data.tempCurrChildrenKey] = [...children]
        let index = selected.findIndex(obj => obj.id == select_data.id)
        selected[index] = {...select_data}
        this.setState({
            selected,
            select_data: {...select_data, children: select_data.children},
            // eslint-disable-next-line react/no-access-state-in-setstate
            refresh_center_flag: ++this.state.refresh_center_flag
        })
    }

    //处理当前选中的数据
    //changedData当前选中的数据处理后的数据   allData中间组件的所有组件  selData当前选中的数据处理前的数据
    handleCurSelData = (changedData, allData = this.state.selected, selData = this.state.select_data,type) => {
        let { select_data, selected } = this.state
        if(selData?.props?.isChildren){
            if(!type){//判断试往子组件模板拖组件还是其他操作
                select_data.children[selData.tempCurrChildrenKey].push(changedData)
            }
            this.setState({
                select_data: select_data,
                editData:selData,
                // eslint-disable-next-line react/no-access-state-in-setstate
                refresh_center_flag: ++this.state.refresh_center_flag
            })
        }else{
            if(changedData?.props?.isChildren){
                let data = JSON.parse(JSON.stringify(changedData))//深拷贝一次，防止数组浅比较导致setState无效
                if(!isEmpty(select_data.children)&&!!select_data.children){
                    let index = select_data?.children[select_data.tempCurrChildrenKey].findIndex(item=>item.id == data.id)
                    select_data.children[select_data.tempCurrChildrenKey][index] = data
                }
                this.setState({
                    select_data:select_data,
                    selected:allData,
                    editData:data
                })
            }else{
                if(!!changedData){
                    if(selData.id === changedData.id){//当选中的数据为侧边导航栏，并向父组件拖拽组件时，此时selData为offcanvas  changedData为拖拽的组件 此时不应该做合并，作此判断
                        selData = { ...selData, ...changedData }
                    }else{
                        selData = { ...changedData }
                    }
                    //临时拖拽的数据，不处理
                    if(selData.temp){
                        return;
                    }
                    const SPLIT = '_';
                    let ids = selData.id.toString().split(SPLIT);//嵌套组件的id结构为1_2_3
                    //递归遍历寻找selData.id对应的子组件对象。idIndex实际是一个游标，每向下寻找一层，游标就向右一次
                    const updateChild = (children, idIndex) => {
                        for(let i=0; i<children.length; i++){
                            let child = children[i];
                            //游标到最右侧了，或没有子组件时，使用当前组件匹配
                            if( idIndex == ids.length-1
                                || (!child.children || Object.keys(child.children).length == 0)){
                                if(child.id == ids.slice(0, idIndex+1).join(SPLIT)){
                                    children[i] = selData;
                                    return true
                                }
                            }else{
                                //游标右移，向下一层去寻找目标对象
                                ++idIndex;
                                // eslint-disable-next-line compat/compat
                                return Object.values(child.children).some(_child => updateChild(_child, idIndex))
                            }
                        }
                        return false;
                    }
                    updateChild(allData, 0);

                }
                selected = allData
                this.setState({
                    select_data: selData,
                    selected,
                    // eslint-disable-next-line react/no-access-state-in-setstate
                    refresh_center_flag: ++this.state.refresh_center_flag
                });
            }
            
        }

        let data = JSON.parse(JSON.stringify(selected))
        this.setState({ decoParams:data })
    };

    //改变渲染嵌套组件开关的方法
    changeChildrenFlag = (flag)=>{
        this.setState({
            childrenFlag:flag
        })
    }

    //改变编辑模板开关的方法
    changeEditFlag = (flag)=>{
        this.setState({
            editFlag:flag
        })
    }

    changeIframe = (flag) => {
        this.setState({
            showIframe:flag
        })
    }

    //预览事件
    showPreview = () => {
        const { showIframe,selected,query } = this.state;
        if (!showIframe) {
            let data = JSON.parse(JSON.stringify(selected))
            this.setState({ showIframe: true,decoParams:data,decoType:query.type })
        }
    }

    //保存装修事件
    saveMDiyData = async ()=>{
        // 如果缓存定时器为开启状态，则首先关闭
        this.clearDecorateDataCacheTimer();

        const { selected, query } = this.state;
        let { dispatch } = this.props;
        let params = {};
        params.decoId = query.id;
        params.type = query.type;
        params.channelId = query.channelId;
        params.name = query.name;
        let tar_data = [...selected];
        params.data = JSON.stringify(tar_data)
        dispatch({
            type: 'mdecorate/edit_m_diy_page',
            payload: params,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    //2s之后返回上一页
                    setTimeout(() => {
                        router.push(`/decorate_m/lists?type=${query.type}&channelId=${query.channelId}`);
                    }, 2000);
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    // 显示新增
    showAddModal = ()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'mdecorate/setParams',
            payload: {
                records:null,
                modalType:1,
                addItemModalVisible: true
            }
        })
    }

    //显示编辑
    editItem = (record)=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'mdecorate/setParams',
            payload: {
                records:record,
                modalType:2,
                addItemModalVisible: true
            }
        })
    }

    //导出模板
    downloadData = ()=>{
        const { selected,query } = this.state;
        var export_blob = new Blob([JSON.stringify(selected)]);
        const Zip = new JSZip();
        Zip.file("index.txt", export_blob);
        Zip.generateAsync({type:"blob"}).then((files) => {
            FileSaver.saveAs(files , `${query.name}.zip`);//后缀名为tar、zip都可
        })
    }

    beforeUploadFun = (file,fileList)=>{
        //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
        // this.uploading = true
        fileList = fileList.slice(-1);
        const isZip = file.name.split('.')[file.name.split('.').length-1] === 'zip';
        if (!isZip) {
            message.error('请上传zip文件!');
            return false
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件需小于10MB!');
            return false
        }
        const f = fileList[0];
        this.uploadData(f)
    }

    //导入模板
    uploadData = (zip)=>{
        let that =this
        var new_zip = new JSZip();
        new_zip.loadAsync(zip).then(() => {
            // 你现在已经有加载的zip中包含的每个文件
            if(!!new_zip.file("index.txt")){
                new_zip.file("index.txt").async("string").then(content => {
                    //得到我们需要的JSON文件内容
                    let selected = JSON.parse(content)
                    that.index = selected&&selected.length>=0 ? selected.length:0
                    that.setState({ selected: selected});
                });
            }else{
                message.error('zip文件中必须包含index.txt!');
                return false
            }
            // that.uploading = false
        });
    }
  
    // eslint-disable-next-line react/sort-comp
    upProps = {
        name: 'file', //发到后台的文件参数名
        // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
        headers: { Authorization: 'SID' }, // 
        showUploadList: false,
        beforeUpload: this.beforeUploadFun
    }

    renderEdit = (data)=>{
        let con = ''
        con = <div className={mdiy.right_wrap} style={{flex:1}}>
            <Fragment>
                <div className={`${global.flex_com_row_start_center} ${mdiy.r_title}`}>
                    <ALibbSvg fill="#FC701E" width={22} height={22} type={data.props ? data.props.admin_icon : ''} />
                    <span className={mdiy.r_title_text}>{data.props?.admin_text}{sldComLanguage('设置')}</span>
                </div>
                <Scrollbars autoHide>
                    <MDiyItemEdit handleCurSelData={this.handleCurSelData} select_data={data} />
                    {getSldEmptyH(160)}
                </Scrollbars>
            </Fragment>
        </div>
        return con
    }
    
    // 开始缓存装修数据
    startCacheDecorateData = ()=>{
        sucTip('定时缓存装修数据功能已开启')
        this.decorateDataCacheTimer = setInterval(()=>{
            // 存储到浏览器数据库
            this.addOrUpdateDecorateCacheData(this.state.selected)
        },30000)
    }
    
    // 清空缓存定时器
    clearDecorateDataCacheTimer = ()=>{
        this.decorateDataCacheTimer && clearInterval(this.decorateDataCacheTimer);
    }

    /**
     * 导入缓存的装修数据
     */
    importCacheData = async ()=>{
        const db = await indexdb.openDb();
        const res = await indexdb.getStoreData(db,'decorate');
        if(res){
            this.setState({
                selected:JSON.parse(res.decorateData)
            },()=>{
                indexdb.closeDb(db);
                sucTip('导入成功！')
            })
        }else {
            failTip('缓存数据不存在，导入失败！')
        }
    }
    
    // 新增或修改装修缓存数据
    addOrUpdateDecorateCacheData = (data)=>{
        (async function(){
            const db = await indexdb.openDb();
            const res = await indexdb.getStoreData(db,'decorate')
            const decorate = {
                type:'decorate',
                decorateData:JSON.stringify(data)
            }
            if(!res){
                // eslint-disable-next-line no-unused-vars
                const addResult = await indexdb.addStoreData(db,decorate);
            } else {
                // eslint-disable-next-line no-unused-vars
                const updateResult = await indexdb.updateStoreData(db,decorate);
            }
            indexdb.closeDb(db)

        })()
    }

    render() {
        const { select_data, refresh_center_flag, selected, menu_data, query,editData,childrenFlag,editFlag,showIframe,decoParams,decoType } = this.state;
        const { mdecorate } = this.props;
        const { addItemModalVisible } = mdecorate
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <div className={global.flex_com_space_between} style={{ margin: 10 }}>
                    {sldLlineRtextAddGoods('#FA6F1E', query.name)}
                    <Button onClick={()=>{this.showAddModal()}}>新增组件</Button>
                    <Button onClick={()=>{this.downloadData()}}>导出装修数据</Button>
                    <Upload {...this.upProps}>
                        <Button>导入装修数据</Button>
                    </Upload>
                    {
                        sldPopConfirmDiy('bottom','是否导入缓存的装修数据？',()=>{
                            this.importCacheData()
                        },'确定','取消',<Button>
                            导入缓存的装修数据
                        </Button>)
                    }
                    <Link to={{ pathname: `/diy_document` }} target="_blank">
                        装修组件说明文档
                    </Link>
                    {sldIconBtnBg(() => router.push(`/decorate_m/lists?type=${query.type}&channelId=${query.channelId}`), 'ziyuan24', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0,14,14,3)}
                </div>
                {getSldHorLine(1)}
                <div className={`${mdiy.decoheight}`} style={{ overflowX:'scroll',minWidth:1100,overflowY:'hidden' }}>
                    <div className={global.flex_row_between_start} style={{ height: '100%' ,width:1730}}>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable isDropDisabled droppableId="droppable">
                                {/* eslint-disable-next-line no-unused-vars */}
                                {(provided, snapshot) => (
                                    <Scrollbars style={{ width: 220 }}>
                                        <div className={`${mdiy.left_wrap} ${global.flex_com_row_start_start}`} style={{ flexWrap: 'wrap' }} ref={provided.innerRef}>
                                            {menu_data.map((item, index) => (
                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                    {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                                    {(provided, snapshot) => <div className={`${mdiy.item}  ${global.flex_com_column_center_center}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={()=>this.editItem(item)}>
                                                        <div className={`${mdiy.image_wrap} ${global.flex_row_center_center}`}>
                                                            <ALibbSvg fill="#FC701E" width={40} height={40} type={item.icon} />
                                                        </div>
                                                        <span style={{color:'#333'}}>{item.showName}</span>
                                                    </div>}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </Scrollbars>
                                )}
                            </Droppable>
                            <Scrollbars style={{ width:450 ,overflowX:'hidden' }}>
                                <div className={`${mdiy.center_wrap} ${global.flex_row_center_center}`}>
                                    <Scrollbars className={`${mdiy.center_scroller} ${global.flex_row_center_center}`}>
                                        <div className={`${global.flex_row_center_center}`}>
                                            <Droppable droppableId="droppable2" overflow="auto">
                                                {/* eslint-disable-next-line no-unused-vars */}
                                                {(provided, snapshot) => (
                                                    <div className={`${mdiy.center_con_border}`}>
                                                        <div className={mdiy.center_con} ref={provided.innerRef}>
                                                            {selected.map((item, index) => (
                                                                <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={item.name=="background"?true:false}>
                                                                    {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                                                    {(provided, snapshot) => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                            <MDiyItem
                                                                                data={item}
                                                                                handleCurSelData={this.handleCurSelData}
                                                                                select_data={select_data}
                                                                                selected={selected}
                                                                                changeChildrenFlag={this.changeChildrenFlag}
                                                                                changeEditFlag={this.changeEditFlag}
                                                                                refresh_center_flag={refresh_center_flag}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                            {selected.findIndex(item=>item.name=='cart')>-1&&<div style={{width:50,height:50,position:'absolute',right:selected.find(item=>item.name=='cart').cartPlaces=='left'?285:27,top:'85%'}}>
                                                                <img src={selected.find(item=>item.name=='cart').img?selected.find(item=>item.name=='cart').img:require('@/assets/img/decorate/btn_common_shopping.svg')} style={{width:50,height:50}} />
                                                            </div>}
                                                        </div>
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </Scrollbars>
                                </div>
                                {getSldEmptyH(30)}
                            </Scrollbars>
                            {childrenFlag&&<Scrollbars style={{ width:350,overflowX:'heidden' }}>
                                <div className={`${mdiy.center_wrap} ${global.flex_row_center_center}`}>
                                    <Scrollbars className={`${mdiy.center_scroller} ${global.flex_row_center_center}`}>
                                        <div className={`${global.flex_cloumn_center_center}`}>
                                            <div>将最左侧的组件拖动到此模块，即为点击的分类的子组件</div>
                                            <div>点击此区域的组件，即可设置子组件的属性</div>
                                            <Droppable droppableId="droppableChildren" overflow="auto">
                                                {/* eslint-disable-next-line no-unused-vars */}
                                                {(provided, snapshot) => (
                                                    <div className={`${mdiy.center_con_border}`}>
                                                        <div className={`${mdiy.center_con} ${mdiy.center_con_custom}`} ref={provided.innerRef}>
                                                            {select_data?.children?.[select_data.tempCurrChildrenKey]?.map((item, index) => (
                                                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                    {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                                                    {(provided, snapshot) => (
                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                            <MDiyItem
                                                                                data={item}
                                                                                changeEditFlag={this.changeEditFlag}
                                                                                isChildren={item.props.isChildren}
                                                                                handleCurSelData={this.handleCurSelData}
                                                                                updateEditData={this.updateEditData}
                                                                                select_data={editData}
                                                                                selected={select_data?.children[select_data.tempCurrChildrenKey]}
                                                                                refresh_center_flag={refresh_center_flag}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                            {provided.placeholder}
                                                        </div>
                                                    </div>
                                                )}
                                            </Droppable>
                                        </div>
                                    </Scrollbars>
                                </div>
                                {getSldEmptyH(30)}
                            </Scrollbars>}
                            { showIframe &&<PreviewIframe decoParams={decoParams} decoType={decoType} changeIframe={this.changeIframe}></PreviewIframe>}
                        </DragDropContext>
                    
                        {this.renderEdit(editFlag?editData:select_data)}
                    
                        <div className={mdiy.m_diy_bottom_wrap} style={{ position: 'fixed',left:this.props.global.collapsed?90:160 }}>
                            <div onClick={() => this.saveMDiyData()} className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                                {sldComLanguage('保存装修')}
                            </div>
                            <div style={{marginLeft:20}} onClick={() => this.showPreview()} className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}>
                            预览
                            </div>
                        </div>
                    </div>
                </div>
                
                {addItemModalVisible && <AddItemModal upMenuList={this.get_diy_menu} />}
            </div>
        );
    }
}
