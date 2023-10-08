/*
* 装修选择商品、值播、短视频 组件
* 
* */
import React, { Component } from 'react';
import {
    Upload
} from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { apiUrl } from '@/utils/sldconfig.js';
import {
    sldBeforeUpload,
    getLocalStorageStingVal
} from '@/utils/utils';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import SldSelMoreLeftRightLive from '@/components/SldSelMoreLeftRightLive';
import SldSelMoreLeftRight from '@/components/SldSelMoreLeftRight';
import SldSelGoodsPool from '@/components/SldSelGoodsPool';
import styles from '../../common/css/index-edit.less';
import global from '@/global.less';
import ALibbSvg from '@/components/ALibbSvg';

export default class SnGoodsPicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisibleGoods:false,
            modalVisibleLive:false,
            modalVisibleVideo:false,
            goodsText:'展示更多商品',
            showMoreGoods:false,
            data:{
                goods:{
                    title:'商品添加:',
                    info:'商品信息',
                    num:'价格',
                    id:'sku',
                    modeFlag:'modalVisibleGoods'
                },
                live:{
                    title:'直播添加:',
                    info:'直播信息',
                    num:'播放量',
                    id:'liveId',
                    modeFlag:'modalVisibleLive'
                },
                video:{
                    title:'视频添加:',
                    info:'短视频信息',
                    num:'播放量',
                    id:'videoId',
                    modeFlag:'modalVisibleVideo'
                },
                goodsPool:{
                    title:'自定义商品池添加:',
                    modeFlag:'modalVisibleGoodsPool'
                }
            }
        };
    }

    componentDidMount() {
        let { max = 100000, min = 0, value } = this.props
        value = value==undefined?{}:value
        value.max_num = max
        value.min_num = min
    }

    showMoreGoods=()=>{
        let {showMoreGoods,goodsText} = this.state
        if(goodsText==='展示更多商品'){
            goodsText='隐藏更多商品'
        }else{
            goodsText='展示更多商品'
        }
        this.setState({
            showMoreGoods:!showMoreGoods,
            goodsText
        })
    }

    /**
     * 在选中的商品列表初始化完成后，立即获取所有图片的主色，并生成图片之间的颜色渐变数值集合
     */
    /**
     * 利用canvas获取图片的平均色（主色）
     * @param {*} imgdata 
     * @param {*} url 
     */
    getImageColor=(imgdata,url) =>new Promise((res) => {
        let that = this
        let canvas = document.createElement('canvas'); //利用canvas获取图片的主色
        let img = document.createElement('img'); //创建一个图片标签
        img.setAttribute("src",url)
        // img.setAttribute("width","50")
        // img.setAttribute("height","50")
        img.setAttribute("width",imgdata.width||"50")
        img.setAttribute("height",imgdata.height||"50")
        img.setAttribute("crossOrigin","anonymous")
        var r=0,g=0,b=0;
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext("2d");
        var data;
        img.onload = function(){
            context.drawImage(img, 0, 0);
            data = context.getImageData(0, 0, img.width, img.height).data;
            // 取所有像素的平均值
            for (var row = 0; row < img.height; row++) {
                for (var col = 0; col < img.width; col++) {
                    r += data[((img.width * row) + col) * 4];
                    g += data[((img.width * row) + col) * 4 + 1];
                    b += data[((img.width * row) + col) * 4 + 2];
                }
            }
            // 求取平均值
            r /= (img.width * img.height);
            g /= (img.width * img.height);
            b /= (img.width * img.height);
            // 将最终的值取整
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);
            that.setState({ imgColor: `rgb(${r},${g},${b})` });
            res(`rgb(${r},${g},${b})`)
        }
    })

    //关闭模态框事件
    sldHandleCancle = () => {
        let {data} = this.state
        let {type} = this.props
        this.setState({
            [data[type].modeFlag]:false
        })
    };

    //选择商品事件
    selMoreGoods = () => {
        let {data} = this.state
        let {type} = this.props
        this.setState({
            [data[type].modeFlag]:true
        })
    };

    //商品/直播/短视频多选-回调事件
    callBackFun = (selectedRows, selectedRowKeys) => {
        let { value,onchange,type } = this.props;
        value = value==undefined?{}:value
        value.ids = JSON.parse(JSON.stringify(selectedRowKeys));
        value.info = JSON.parse(JSON.stringify(selectedRows));
        if(type==='goods'){
            value.info.forEach((item)=>{
                this.getImageColor(item,item.mainImage).then(imgColor =>{
                    item.imgColor = imgColor
                })
            })
        }
        onchange(value)
        this.sldHandleCancle();
    };

    //选择商品池多选-回调事件
    selGoodsPool = (selectedGoodsPool, selectedGoodsGroup) => {
        let { value,onchange } = this.props;
        value.goodsGroup = JSON.parse(JSON.stringify(selectedGoodsGroup));
        value.goodsPool = JSON.parse(JSON.stringify(selectedGoodsPool));
        onchange(value)
        this.sldHandleCancle();
    };

    // 上传商品大图
    uploadImg = (info, sku) => {
        const { value,onchange } = this.props;
        let img_data = info.file.response;
        if (info.file.status === 'done') {
            value.info.forEach((temp) => {
                if (temp.sku == sku) {
                    temp["uploadImage"] = img_data.data.url
                    this.getImageColor(img_data.data, temp.uploadImage).then(imgColor => {
                        temp.imgColor = imgColor
                    })
                    return temp
                }
            })
        }
        onchange(value)
    }

    // 删除单个商品/直播/短视频
    delItem = (id) => {
        const { value,onchange,type } = this.props;
        let {data} = this.state
        value.ids = value.ids.filter(item => item != id);
        value.info = value.info.filter(item => item[data[type].id] != id);
        onchange(value)
    };

    // 删除单个商品/直播/短视频
    topItem = (id) => {
        const { value,onchange,type } = this.props;
        let {data} = this.state
        value.ids.forEach((item,index) => {
            if(item == id){
                value.ids.unshift(value.ids.splice(index , 1)[0]);
            }
        })
        value.info.forEach((item,index) => {
            if(item[data[type].id] == id){
                value.info.unshift(value.info.splice(index , 1)[0]);
            }
        })
        onchange(value)
    };

    // 拖拽结束事件
    onDragEndTuijian = result => {
        const { source, destination } = result;
        const { value,onchange } = this.props;
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            let sourceIndex = source.index;
            let destinationIndex = destination.index;
            if (sourceIndex == destinationIndex) {
                return;
            }
            let item = JSON.parse(JSON.stringify(value));
            //更新ids
            let [draggedItemId] = item.ids.splice(sourceIndex, 1);
            item.ids.splice(destinationIndex, 0, draggedItemId);
            //更新info
            let [draggedItemInfo] = item.info.splice(sourceIndex, 1);
            item.info.splice(destinationIndex, 0, draggedItemInfo);
            onchange(item);
        }
    }

    render() {
        const { style, label, type, value, max, min } = this.props
        const extra = { ...value, max_num: max, min_num: min }

        let {modalVisibleGoods,modalVisibleGoodsPool,modalVisibleLive,modalVisibleVideo,showMoreGoods,goodsText,data} = this.state
        return (     
            <div style={style}>
                <div style={{marginRight:10}}>{label}</div>
                <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                    <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                        <span className={`${styles.required}`}>*</span>
                        <span className={`${styles.title}`}>{data[type].title}</span>
                        <a
                            href="javascript:void(0)"
                            className={`${styles.add_svideo_btn}`}
                            onClick={() => this.selMoreGoods()}
                        >+ 添加</a>
                    </div>

                    {value?.info&&value.info.length > 0 &&type!='goodsPool'&&
                        <div>
                            <div className={`${styles.selected_svideo_list_title}`}>
                                <span style={{ width: 50 }}>序号</span>
                                <span style={{ width: 176 }}>{data[type].info}</span>
                                <span style={{ width: 80 }}>{data[type].num}</span>
                                <span style={{ width: 50 }}>操作</span>
                            </div>

                            <DragDropContext onDragEnd={this.onDragEndTuijian}>
                                <Droppable droppableId="droppableTuijian" type="tuijianGoods">
                                    {/* eslint-disable-next-line no-unused-vars */}
                                    {(provided, snapshot) => (
                                        <div
                                            className={`${styles.selected_svideo_list}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            {value.info.map((svideo_item, svideo_index) => (
                                                <Draggable
                                                    key={svideo_item.sku}
                                                    draggableId={svideo_item.sku}
                                                    index={svideo_index}
                                                >
                                                    {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {type == 'goods'&&<div>
                                                                {svideo_index<5&&<div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                                                    <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                                                    <div className={`${styles.svideo_info} ${global.flex_row_start_center}`} style={{width:176}}>
                                                                        <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                                                            <Upload
                                                                                style={{ width: '100%', display: 'inline-block' }}
                                                                                withCredentials
                                                                                beforeUpload={sldBeforeUpload}
                                                                                accept=".gif, .jpeg, .png,.jpg,"
                                                                                showUploadList={false}
                                                                                name="file"
                                                                                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                                                                onChange={(info) => this.uploadImg(info, svideo_item.sku,)}
                                                                                headers={{
                                                                                    Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}`
                                                                                }}
                                                                            >
                                                                                {/* todo 手动上传图片兼容代码 */}
                                                                                <img style={{ width: '50px', height: '50px' }} src={svideo_item.uploadImage || svideo_item.uploadmage || svideo_item.imgUrl || svideo_item.mainImage} />
                                                                            </Upload>
                                                                        </div>
                                                                        <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                                                            <span className={styles.video_name}>{svideo_item.skuName}</span>
                                                                        </div>
                                                                    </div>
                                                                    <span style={{ width: 80 }}>{svideo_item.showPrice || svideo_item.salePrice * 1}</span>
                                                                    <div className={`${styles.operate} ${global.flex_row_center_center}`}>
                                                                        <span onClick={() => this.delItem(svideo_item.sku)}>
                                                                            <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                                                        </span>
                                                                        <span onClick={() => this.topItem(svideo_item.sku)}>
                                                                            <ALibbSvg fill="#2d2d2d" width={18} height={18} type="zhiding" />
                                                                        </span>
                                                                    </div>
                                                                </div>}
                                                                {svideo_index==5&&<div style={{backgroundColor:'#F8F8F8',textAlign:'center',width:356}} onClick={()=>{this.showMoreGoods()}}>{goodsText}</div>}
                                                                {(svideo_index>=5&&showMoreGoods)&&<div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                                                    <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                                                    <div className={`${styles.svideo_info} ${global.flex_row_start_center}`} style={{width:176}}>
                                                                        <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                                                            <Upload
                                                                                style={{ width: '100%', display: 'inline-block' }}
                                                                                withCredentials
                                                                                beforeUpload={sldBeforeUpload}
                                                                                accept=".gif, .jpeg, .png,.jpg,"
                                                                                showUploadList={false}
                                                                                name="file"
                                                                                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                                                                onChange={(info) => this.uploadImg(info, svideo_item.sku)}
                                                                                headers={{
                                                                                    Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}`
                                                                                }}
                                                                            >
                                                                                <img style={{ width: '50px', height: '50px' }} src={!!svideo_item.uploadImage ? svideo_item.uploadImage : svideo_item.mainImage} />
                                                                            </Upload>
                                                                        </div>
                                                                        <div className={`${styles.right} ${global.flex_column_start_start}`} style={{width:140}}>
                                                                            <span className={styles.video_name}>{svideo_item.skuName}</span>
                                                                        </div>
                                                                    </div>
                                                                    <span style={{ width: 80 }}>{svideo_item.showPrice || svideo_item.salePrice * 1}</span>
                                                                    <div className={`${styles.operate} ${global.flex_row_center_center}`}>
                                                                        <span onClick={() => this.delItem(svideo_item.sku)}>
                                                                            <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                                                        </span>
                                                                        <span onClick={() => this.topItem(svideo_item.sku)}>
                                                                            <ALibbSvg fill="#2d2d2d" width={18} height={18} type="zhiding" />
                                                                        </span>
                                                                    </div>
                                                                </div>}
                                                            </div>}
                                                            {type == 'live'&&<div>
                                                                <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                                                <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                                                    <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                                                        <img src={svideo_item.liveCover} />
                                                                        <div className={`${styles.play_icon}`}>
                                                                            <ALibbSvg fill="#fff" width={22} height={22} type="bofang11" />
                                                                        </div>
                                                                    </div>
                                                                    <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                                                        <span className={styles.video_name}>{svideo_item.liveName}</span>
                                                                        <span className={styles.video_label}>{svideo_item.labelName}</span>
                                                                    </div>
                                                                </div>
                                                                <span style={{ width: 80 }}>{svideo_item.viewingNum}</span>
                                                                <div
                                                                    onClick={() => this.delItem(svideo_item.liveId)}
                                                                    className={`${styles.operate} ${global.flex_row_center_center}`}
                                                                >
                                                                    <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                                                </div>
                                                            </div>}
                                                            {type == 'video'&&<div>
                                                                <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                                                <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                                                    <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                                                        <img src={svideo_item.videoImage} />
                                                                        <div className={`${styles.play_icon}`}>
                                                                            <ALibbSvg fill="#fff" width={22} height={22} type="bofang11" />
                                                                        </div>
                                                                    </div>
                                                                    <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                                                        <span className={styles.video_name}>{svideo_item.videoName}</span>
                                                                        <span className={styles.video_label}>{svideo_item.labelName}</span>
                                                                    </div>
                                                                </div>
                                                                <span style={{ width: 80 }}>{svideo_item.click_num}</span>
                                                                <div
                                                                    onClick={() => this.delItem(svideo_item.videoId)}
                                                                    className={`${styles.operate} ${global.flex_row_center_center}`}
                                                                >
                                                                    <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                                                </div>
                                                            </div>}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    }
                    {type=='goodsPool'&&<div className={`${global.flex_column_start_start}`} style={{padding:10,width:'100%'}}>
                        <div style={{marginBottom:10}}>已选商品池：</div>
                        {value?.goodsPool?.productPoolName&&<div style={{marginBottom:5,borderBottom:'1px solid #999',width:'100%'}}>
                            {value.goodsPool?.productPoolName}（{value.goodsPool?.productPoolId}）
                        </div>}
                        <div style={{marginBottom:10}}>已选分组：</div>
                        {value?.goodsGroup&&value.goodsGroup.length>0&&
                            <div>
                                {value.goodsGroup.map((item)=>(
                                    <div style={{marginBottom:5}}>
                                        {item.groupName}（{item.groupId}）
                                    </div>
                                ))}
                            </div>
                        }
                    </div>}
                </div>
                {/*商品多选的modal框-start onlyPartInfo选择商品时只需要部分信息*/}
                <SldSelMoreLeftRightGoods
                    selectedRows={value?.info}
                    selectedRowKeys={value?.ids}
                    modalVisible={modalVisibleGoods}
                    width={1000}
                    height={document.body.clientHeight - 400}
                    sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                    seleSvideo={this.callBackFun}
                    onlyPartInfo
                    title='选择商品(最少选择1个)'
                    extra={extra}
                />
                {/*商品多选的modal框-end*/}

                {/*直播多选的modal框-start*/}
                <SldSelMoreLeftRightLive
                    selectedRows={value?.info}
                    selectedRowKeys={value?.ids}
                    modalVisible={modalVisibleLive}
                    width={1000}
                    height={document.body.clientHeight - 400}
                    sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                    seleSvideo={this.callBackFun}
                    title=''
                    extra={extra}
                />
                {/*直播多选的modal框-end*/}

                {/*短视频多选的modal框-start*/}
                <SldSelMoreLeftRight
                    selectedRows={value?.info}
                    selectedRowKeys={value?.ids}
                    modalVisible={modalVisibleVideo}
                    width={1000}
                    height={document.body.clientHeight - 400}
                    sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                    seleSvideo={this.callBackFun}
                    title=''
                    extra={extra}
                />

                {/*商品池多选的modal框-start*/}
                <SldSelGoodsPool
                    selectedGoodsPool={value?.goodsPool}
                    selectedGoodsGroup={value?.goodsGroup}
                    modalVisible={modalVisibleGoodsPool}
                    width={1000}
                    height={document.body.clientHeight - 400}
                    sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                    seleSvideo={this.selGoodsPool}
                    title=''
                    extra={extra}
                />
            </div>
        );
    }
}
