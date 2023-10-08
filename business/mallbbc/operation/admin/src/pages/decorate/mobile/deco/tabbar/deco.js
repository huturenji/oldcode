import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Input, Spin , Radio, Upload, Modal, Button, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Scrollbars } from 'react-custom-scrollbars';
import { SketchPicker } from 'react-color';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import {
    failTip,
    sucTip,
    getSldEmptyH,
    sldBeforeUpload,
    sldSvgIcon,
    getLocalStorageStingVal,
    getAuthBtn
} from '@/utils/utils';
import {
    diy_tabbar_link_type
} from '@/utils/util_data';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import { apiUrl } from '@/utils/sldconfig.js';
import ALibbSvg from '@/components/ALibbSvg';
import mdiy from './deco.less';
import SnUrlPicker from '@/components/Decorate/components/sn-url-picker/index.js';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const FormItem = Form.Item;
// tabbar占位数据
const globalConfigDefault = {
    tabbarConfig: {
        color: "#000000", //tab 上的文字默认颜色
        selectedColor: "#ff0000",// tab 上的文字选中时的颜色
        fontSize: "", //文字默认大小
        backgroundColor: "#ffffff",//tab 的背景色
        spacing: "",//图标和文字的间距
        backdropFilterBlur:"",//背景高斯模糊
        visible: true,//是否展示tabbar
        borderDisplay:true,//是否展示边框
        borderColor:"#ffffff",//边框的颜色
        borderWidth:"1px",//边框的宽度
        list: [
            {
                pagePath: '',//一期为mobile路由
                text: 'tab1',//tab上按钮文字
                iconPath: '',//图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px
                selectedIconPath: '',//图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px
                visible: true,//该项是否显示，默认显示
                iconWidth: '',//图标默认宽度
                iconHeight: '',// 图标默认高度
                topicId: '', //页面为装修组成需要设置
                url_type:'',
                info:{}
            },
            {
                pagePath: '',//一期为mobile路由
                text: 'tab2',//tab上按钮文字
                iconPath: '',//图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px
                selectedIconPath: '',//图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px
                visible: true,//该项是否显示，默认显示
                iconWidth: '',//图标默认宽度
                iconHeight: '',// 图标默认高度
                topicId: '', //页面为装修组成需要设置
                url_type:'',
                info:{}
            }
        ]
    }
};

// eslint-disable-next-line no-shadow
@connect(({ product, global }) => ({
    product, global
}))
@Form.create()
export default class Tabbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 渠道详情
            isData: false, // 渠道是否有数据
            isTabbar: false, // 渠道是否有tabbar装修数据
            detail: {
                decoId: ''
            },
            showLoading: true,
            delModalVisible: false,
            diy_page_lists: [],
            showColorPicker1: false, //是否展示颜色选择器，默认不展示
            showColorPicker2: false, //是否展示颜色选择器，默认不展示
            showColorPicker3: false, //是否展示颜色选择器，默认不展示
            showColorPicker4: false, //是否展示颜色选择器，默认不展示
            isTabbarChange: false // 是否修改了默认tabbar数据
        };
    }

    componentDidMount() {
        let { getChild } = this.props
        getChild('tabbar', this)
    }

    channelChange = () => {
        let { detail } = this.state
        this.setState({ detail })
        this.getDetail();
    }

    // 根据渠道下的tabbar装修数据
    getDetail = () => {
        let { detail } = this.state;
        const { dispatch, id } = this.props;

        dispatch({
            type: 'mdecorate/get_diy_page_lists',
            payload: { pageSize: 1, type: 'tabbar', channelId: id },
            callback: (res) => {
                this.setState({ showLoading: false });
                if (res.state == 200) {
                    if(res.data.list.length > 0) {
                        let isTabbar = Boolean(res.data.list[0].data)
                        detail.decoId = res.data.list[0].decoId
                        detail.globalConfig = res.data.list[0].data ? JSON.parse(res.data.list[0].data) : JSON.parse(JSON.stringify(globalConfigDefault))
                        detail.globalConfig.tabbarConfig.list.forEach(item => {
                            if(!item.info){
                                item.info = {}
                                if(!!item.topicId&&item.topicId!==''){
                                    item.url_type = 'topic'
                                    item.info.decoId = item.topicId
                                    item.info.name = !!item.info.name?item.info.name:''
                                }else{
                                    item.url_type = ''
                                }
                            }
                        })
                        this.setState({ detail, isTabbar, isData: true, isTabbarChange: !!res.data.list[0].data });
                    } else {
                        // 无数据
                        detail.globalConfig = JSON.parse(JSON.stringify(globalConfigDefault))
                        this.setState({ detail, isTabbar: false, isData: false, isTabbarChange: false });
                    }
                }
            }
        });
    };

    //保存并新增事件
    handleSaveAllData = () => {
        const { dispatch, id } = this.props;
        let { detail, isData, isTabbarChange } = this.state

        if(!isTabbarChange) { return }

        if(isData) {
            this.saveDiyPage(detail.decoId)
            return
        }

        let uuid = Math.round(Math.random() * 100000000)
        let query = {
            name: `tabbar${uuid}`,
            type: 'tabbar',
            channelId: id,
            decoId: uuid
        }

        dispatch({
            type: 'mdecorate/add_m_diy_page',
            payload: query,
            callback: (res) => {
                if (res.state == 200) {
                    this.saveDiyPage(uuid)
                } else {
                    res.msg === '页面ID已存在，请更换ID' && this.handleSaveAllData()
                }
            }
        })
    };

    // 保存装修
    saveDiyPage = (decoId, isClear) => {
        const { dispatch, id } = this.props;
        let { detail } = this.state
        let query = {
            decoId: decoId,
            channelId: id,
            data: isClear ? null : JSON.stringify(detail.globalConfig)
        }

        dispatch({
            type: 'mdecorate/edit_m_diy_page',
            payload: query,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.getDetail();
                } else {
                    failTip(res.msg);
                }
                isClear && this.setState({delModalVisible: false})
            }
        })
    }

    //添加tabbar的item
    addTab = () => {
        let { detail } = this.state;
        let list = detail.globalConfig.tabbarConfig.list
        if (!!list && list.length >= 5) {
            failTip('最多添加5个Tab');
            return false;
        }
        list.push({
            pagePath: '',//一期为mobile路由
            text: 'tab',//tab上按钮文字
            iconPath: '',//图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px
            selectedIconPath: '',//图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px
            visible: true,//该项是否显示，默认显示
            iconWidth: '',//图标默认宽度
            iconHeight: '',// 图标默认高度
            topicId: '' //页面为装修组成需要设置
        });
        this.setState({
            detail
        }, () => { this.checkTabbarChange() });
    };

    //删除tabbar的item
    delTab = (index) => {
        let { detail } = this.state;
        let list = detail.globalConfig.tabbarConfig.list
        if (!!list && list.length <= 2) {
            failTip('最少需要2个Tab');
            return false;
        }
        if (index >= 0) {
            list.splice(index, '1');
            detail.globalConfig.tabbarConfig.selectedIndex = -1
        }
        this.setState({
            detail
        }, () => { this.checkTabbarChange() });

    };

    setTab = (index) => {
        let { detail } = this.state;
        let tabbarConfig = detail.globalConfig.tabbarConfig
        tabbarConfig['selectedIndex'] = index
        this.setState({
            detail
        });
    };

    //上传图片
    uploadChange = (info, index, type) => {
        let { detail } = this.state;
        let list = detail.globalConfig.tabbarConfig.list
        let item = list[index]
        if (info.file.status != undefined && info.file.status != 'error' && info.file.status == 'done') {
            if (info.file.size != undefined && info.file.size > 1024 * 40) {
                failTip(`${'上传文件过大，请上传小于'}${ 40 }${'kb的图片'}`);
                return false;
            }
            item[type] = info.file.response.data.url
            
        }
        this.setState({ detail }, () => { this.checkTabbarChange() });
    };

    onTabChange = (parentkey, key, val, index) => {
        let { detail } = this.state;
        let globalConfig = detail.globalConfig
        if (typeof index != 'undefined') {
            globalConfig[parentkey]['list'][index][key] = val
        } else {
            globalConfig[parentkey][key] = val
        }

        this.setState({
            detail
        }, () => { this.checkTabbarChange() });
    }

    onTopicChange = (parentkey, val, index) => {
        let { detail } = this.state;
        let globalConfig = detail.globalConfig
        globalConfig[parentkey]['list'][index] = val
        if(globalConfig[parentkey]['list'][index].url_type == ''){//选择无的操作
            globalConfig[parentkey]['list'][index].topicId = ''
        }else{
            globalConfig[parentkey]['list'][index].topicId = val.info.decoId
        }
        this.setState({
            detail
        }, () => { this.checkTabbarChange() });
    }

    colorChange = (e, type) => {
        let { detail } = this.state;
        let globalConfig = detail.globalConfig
        globalConfig['tabbarConfig'][type] = e.hex

        this.setState({
            detail
        }, () => { this.checkTabbarChange() });
    }

    //是否显示取色器
    showColorPicker = (type, flag) => {
        this.setState({
            [type]: flag
        });
    };

    // 清除tabbar装修
    deleteOk = () => {
        let { detail } = this.state
        this.saveDiyPage(detail.decoId, true)
    }
    
    // 拖拽结束事件
    onDragEndTabbar = result => {
        let { detail } = this.state;
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            let sourceIndex = source.index;
            let destinationIndex = destination.index;
            if (sourceIndex == destinationIndex) {
                return;
            }
            let list = JSON.parse(JSON.stringify(detail.globalConfig.tabbarConfig.list));

            //更新tabitem
            let [draggedItemId] = list.splice(sourceIndex, 1);
            list.splice(destinationIndex, 0, draggedItemId);
            detail.globalConfig.tabbarConfig.list = list;
            this.setState({
                detail
            });
        }
    }

    renderImportBox = () => {
        const upProps = {
            name: 'file', //发到后台的文件参数名
            headers: { Authorization: 'SID' }, // 
            showUploadList: false,
            accept: '.zip',
            beforeUpload: this.beforeUploadFun
        }

        return (
            <div style={{ textAlign: 'right' }}>
                <AuthBtn eventKey={['import_tabbar_deco']} btnAuth={btnAuth}>
                    <Upload {...upProps}>
                        <Button style={{marginLeft: '10px'}} type="primary">导入tabbar装修</Button>
                    </Upload>
                </AuthBtn>
                <AuthBtn eventKey={['export_tabbar_deco']} btnAuth={btnAuth}>
                    <Button style={{marginLeft: '10px'}} type="primary" onClick={() => this.exportPage()}>导出</Button>
                </AuthBtn>
            </div>
        )
    }

    exportPage = () => {
        const { detail } = this.state;
        const { channel } = this.props
        let globalConfig = detail.globalConfig
        var export_blob = new Blob([JSON.stringify(globalConfig)]);

        const Zip = new JSZip();
        Zip.file("index.txt", export_blob);
        Zip.generateAsync({type:"blob"}).then((files) => {
            FileSaver.saveAs(files , `${channel.value}tabbar装修数据.zip`); //后缀名为tar、zip都可
        })
    }

    beforeUploadFun = (file, fileList) => {
        const { detail } = this.state;

        fileList = fileList.slice(-1);
        const isZip = file.name.split('.')[file.name.split('.').length - 1] === 'zip';
        if (!isZip) {
            message.error('请上传zip文件!');
            return false
        }
        let new_zip = new JSZip();
        new_zip.loadAsync(fileList[0]).then(() => {
            // 你现在已经有加载的zip中包含的每个文件
            if(!!new_zip.file("index.txt")){
                new_zip.file("index.txt").async("string").then(content => {
                    // 得到我们需要的JSON文件内容
                    try {
                        let data = JSON.parse(content)
                        detail.globalConfig = data
                        this.setState({ detail }, () => { this.checkTabbarChange() })
                    } catch (error) {
                        message.error('数据格式不正确!');
                    }
                });
            } else {
                message.error('zip文件中必须包含index.txt!');
                return false
            }
        });
    }

    // 检测是默认tabbar配置是否修改，修改了才出现保存按钮
    checkTabbarChange = () => {
        let { detail } = this.state
        let tabbarConfig = JSON.parse(JSON.stringify(detail.globalConfig.tabbarConfig))
        delete tabbarConfig.selectedIndex
        let isChange = !(JSON.stringify(tabbarConfig) == JSON.stringify(globalConfigDefault.tabbarConfig))
        this.setState({ isTabbarChange: isChange })
    }

    render() {
        const { detail, showLoading, delModalVisible, showColorPicker1, showColorPicker2, showColorPicker3, showColorPicker4, isTabbar, isTabbarChange } = this.state;
        let globalConfig = detail.globalConfig
        return (
            <Spin spinning={showLoading}>
                { this.renderImportBox() }
                <Scrollbars style={{ height: `${document.body.clientHeight - 300}px` }}>
                    <div
                        className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page_20}`}
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                    >
                        <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                            <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Form layout="inline">
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                <span style={{ color: '#FF1515' }} />移动端底部导航栏
                                            </div>
                                            {!!detail.globalConfig &&
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 300 }}
                                                    >
                                                        <div className={`${mdiy.wrap_box} `}>
                                                            <div className={`${mdiy.center_wrap} `}>
                                                                <div className={`${mdiy.add_btn} `} onClick={() => this.addTab()}>
                                                                    + 添加tab
                                                                </div>
                                                                <div className={`${mdiy.tab_tips} `}>提示：可拖拽调整顺序</div>
                                                                <div className={`${mdiy.center_scroller} `}>
                                                                    <img className={`${mdiy.status_bar}`} src={require('@/assets/img/decorate/tabbar/m_top_status_bar.png')} />
                                                                    
                                                                    <DragDropContext onDragEnd={this.onDragEndTabbar}>
                                                                        <Droppable droppableId="droppableTabbar" type="tabbar" direction="horizontal">
                                                                            {/* eslint-disable-next-line no-unused-vars */}
                                                                            {(provided, snapshot) => (
                                                                                <div
                                                                                    className={`${mdiy.tabbar}`}
                                                                                    style={{
                                                                                        color: globalConfig.tabbarConfig.color ? globalConfig.tabbarConfig.color : "#222",
                                                                                        height: globalConfig.tabbarConfig.height ? `${globalConfig.tabbarConfig.height}` : "54px",
                                                                                        backgroundColor: globalConfig.tabbarConfig.backgroundColor ? globalConfig.tabbarConfig.backgroundColor : "#fff",
                                                                                        fontSize: globalConfig.tabbarConfig.fontSize ? `${globalConfig.tabbarConfig.fontSize}` : "12px",
                                                                                        backdropFilter: globalConfig.tabbarConfig.backdropFilterBlur?`blur(${globalConfig.tabbarConfig.backdropFilterBlur})`:'0',
                                                                                        borderTopStyle: globalConfig.tabbarConfig.borderDisplay ? "solid" : "none",
                                                                                        borderTopColor: globalConfig.tabbarConfig.borderColor ? globalConfig.tabbarConfig.borderColor : "#fff",
                                                                                        borderTopWidth: globalConfig.tabbarConfig.borderWidth ? globalConfig.tabbarConfig.borderWidth : "1px"
                                                                                    }}
                                                                                    ref={provided.innerRef}
                                                                                    {...provided.draggableProps}
                                                                                >
                                                                                    {
                                                                                        globalConfig && globalConfig.tabbarConfig.list.length > 0 && globalConfig.tabbarConfig.list.map((item, index) =>
                                                                                            <Draggable
                                                                                                key={`droppableTabbar${index}`}
                                                                                                draggableId={`droppableTabbar${index}`}
                                                                                                index={index}
                                                                                            >
                                                                                                {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                                                                                {(provided, snapshot) => (
                                                                                                    <div
                                                                                                        className={`${mdiy.tabbar_item}`}
                                                                                                        onClick={() => this.setTab(index)}
                                                                                                        key={index}
                                                                                                        ref={provided.innerRef}
                                                                                                        {...provided.draggableProps}
                                                                                                        {...provided.dragHandleProps}
                                                                                                    >
                                                                                                        {item.iconPath?<img
                                                                                                            src={globalConfig.tabbarConfig.selectedIndex == index ? item.selectedIconPath : item.iconPath}
                                                                                                            style={{
                                                                                                                width: item.iconWidth ? `${item.iconWidth}` : "30px",
                                                                                                                height: item.iconHeight ? `${item.iconHeight}` : "30px"
                                                                                                            }}
                                                                                                        />:sldSvgIcon('#222', 25, 25, 'add-sy')}
                                                                                                        <div
                                                                                                            style={{
                                                                                                                color: globalConfig.tabbarConfig.selectedIndex == index ? globalConfig.tabbarConfig.selectedColor : globalConfig.tabbarConfig.color,
                                                                                                                marginTop: globalConfig.tabbarConfig.spacing ? `${globalConfig.tabbarConfig.spacing}` : "-3px",
                                                                                                                lineHeight: '1'
                                                                                                            }}
                                                                                                        >{item.text}</div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </Draggable>

                                                                                        )
                                                                                    }
                                                                                    {provided.placeholder}
                                                                                </div>
                                                                            )}
                                                                        </Droppable>
                                                                    </DragDropContext>
                                                                </div>
                                                            </div>
                                                            <div className={`${mdiy.right_wrap} `}>
                                                                <div className={`${global.flex_com_row_start_center} ${mdiy.r_title}`}>
                                                                    <ALibbSvg fill="#FC701E" width={22} height={22} type='ziyuan15' />
                                                                    <span className={mdiy.r_title_text}>tabbar设置</span>
                                                                </div>
                                                                <Scrollbars style={{ height: '600px' }}>
                                                                    <Fragment>
                                                                        <div className={`${mdiy.two_part}`}>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>是否展示Tabbar</div>
                                                                                <FormItem>
                                                                                    <Radio.Group defaultValue={globalConfig.tabbarConfig.visible} onChange={(e) => this.onTabChange('tabbarConfig', 'visible', e.target.value)}>
                                                                                        <Radio value>是</Radio>
                                                                                        <Radio value={false}>否</Radio>
                                                                                    </Radio.Group>
                                                                                </FormItem>
                                                                            </div>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>默认文字颜色</div>
                                                                                <FormItem>
                                                                                    <div onClick={() => this.showColorPicker('showColorPicker1', true)}>
                                                                                        <Input
                                                                                            onChange={(e) => this.onTabChange('tabbarConfig', 'color', e.target.value)}
                                                                                            style={{backgroundColor: globalConfig.tabbarConfig.color, "cursor": "pointer"}}
                                                                                            value={globalConfig.tabbarConfig.color}
                                                                                        />
                                                                                    </div>

                                                                                    {showColorPicker1 && (
                                                                                        <div className={mdiy.color_picker_wrap}>
                                                                                            <div
                                                                                                className={mdiy.color_picker_mask}
                                                                                                onClick={() => this.showColorPicker('showColorPicker1', false)}
                                                                                            />
                                                                                            <SketchPicker
                                                                                                color={globalConfig.tabbarConfig.color}
                                                                                                onChangeComplete={(e) => this.colorChange(e, 'color')}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </FormItem>
                                                                            </div> 
                                                                        </div>
                                                                        <div className={`${mdiy.two_part}`}>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>选中文字颜色</div>
                                                                                <FormItem>
                                                                                    <div onClick={() => this.showColorPicker('showColorPicker2', true)}>
                                                                                        <Input
                                                                                            onChange={(e) => this.onTabChange('tabbarConfig', 'selectedColor', e.target.value)}
                                                                                            style={{backgroundColor: globalConfig.tabbarConfig.selectedColor, "cursor": "pointer"}}
                                                                                            value={globalConfig.tabbarConfig.selectedColor}
                                                                                        />
                                                                                    </div>
                                                                                    {showColorPicker2 && (
                                                                                        <div className={mdiy.color_picker_wrap}>
                                                                                            <div
                                                                                                className={mdiy.color_picker_mask}
                                                                                                onClick={() => this.showColorPicker('showColorPicker2', false)}
                                                                                            />
                                                                                            <SketchPicker
                                                                                                color={globalConfig.tabbarConfig.selectedColor}
                                                                                                onChangeComplete={(e) => this.colorChange(e, 'selectedColor')}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </FormItem>
                                                                            </div>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>文字默认大小</div>
                                                                                <FormItem>
                                                                                    <Input
                                                                                        onChange={(e) => this.onTabChange('tabbarConfig', 'fontSize', e.target.value)}
                                                                                        value={globalConfig.tabbarConfig.fontSize}
                                                                                        placeholder={`${('12px')}`}
                                                                                    />
                                                                                </FormItem>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`${mdiy.two_part}`}>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>Tabbar背景色</div>
                                                                                <FormItem>
                                                                                    <div onClick={() => this.showColorPicker('showColorPicker3', true)}>
                                                                                        <Input
                                                                                            onChange={(e) => this.onTabChange('tabbarConfig', 'backgroundColor', e.target.value)}
                                                                                            style={{backgroundColor: globalConfig.tabbarConfig.backgroundColor, "cursor": "pointer"}}
                                                                                            value={globalConfig.tabbarConfig.backgroundColor}
                                                                                        />
                                                                                    </div>
                                                                                    {showColorPicker3 && (
                                                                                        <div className={mdiy.color_picker_wrap}>
                                                                                            <div
                                                                                                className={mdiy.color_picker_mask}
                                                                                                onClick={() => this.showColorPicker('showColorPicker3', false)}
                                                                                            />
                                                                                            <SketchPicker
                                                                                                color={globalConfig.tabbarConfig.backgroundColor}
                                                                                                onChangeComplete={(e) => this.colorChange(e, 'backgroundColor')}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </FormItem>
                                                                            </div>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>图标和文字间距</div>
                                                                                <FormItem>
                                                                                    <Input
                                                                                        onChange={(e) => this.onTabChange('tabbarConfig', 'spacing', e.target.value)}
                                                                                        value={globalConfig.tabbarConfig.spacing}
                                                                                        placeholder={`${('-3px')}`}
                                                                                    />
                                                                                </FormItem>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`${mdiy.two_part}`}>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>tabbar高度</div>
                                                                                <FormItem>
                                                                                    <Input
                                                                                        onChange={(e) => this.onTabChange('tabbarConfig', 'height', e.target.value)}
                                                                                        value={globalConfig.tabbarConfig.height}
                                                                                        placeholder={`${('54px')}`}
                                                                                    />
                                                                                </FormItem>
                                                                            </div>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>背景高斯模糊</div>
                                                                                <FormItem>
                                                                                    <Input
                                                                                        onChange={(e) => this.onTabChange('tabbarConfig', 'backdropFilterBlur', e.target.value)}
                                                                                        value={globalConfig.tabbarConfig.backdropFilterBlur}
                                                                                        placeholder={`${('5px')}`}
                                                                                    />
                                                                                </FormItem>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`${mdiy.two_part}`}>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>是否展示边框</div>
                                                                                <FormItem>
                                                                                    <Radio.Group defaultValue={globalConfig.tabbarConfig.borderDisplay} onChange={(e) => this.onTabChange('tabbarConfig', 'borderDisplay', e.target.value)}>
                                                                                        <Radio value>是</Radio>
                                                                                        <Radio value={false}>否</Radio>
                                                                                    </Radio.Group>
                                                                                </FormItem>
                                                                            </div>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>上边框颜色</div>
                                                                                <FormItem>
                                                                                    <div onClick={() => this.showColorPicker('showColorPicker4', true)}>
                                                                                        <Input
                                                                                            onChange={(e) => this.onTabChange('tabbarConfig', 'borderColor', e.target.value)}
                                                                                            style={{backgroundColor: globalConfig.tabbarConfig.borderColor, "cursor": "pointer"}}
                                                                                            value={globalConfig.tabbarConfig.borderColor}
                                                                                        />
                                                                                    </div>

                                                                                    {showColorPicker4 && (
                                                                                        <div className={mdiy.color_picker_wrap}>
                                                                                            <div
                                                                                                className={mdiy.color_picker_mask}
                                                                                                onClick={() => this.showColorPicker('showColorPicker4', false)}
                                                                                            />
                                                                                            <SketchPicker
                                                                                                color={globalConfig.tabbarConfig.borderColor}
                                                                                                onChangeComplete={(e) => this.colorChange(e, 'borderColor')}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </FormItem>
                                                                            </div> 
                                                                        </div>
                                                                        <div className={`${mdiy.two_part}`}>
                                                                            <div className={`${mdiy.sub_part}`}>
                                                                                <div className={`${mdiy.subtitle}`}>上边框宽度</div>
                                                                                <FormItem>
                                                                                    <Input
                                                                                        onChange={(e) => this.onTabChange('tabbarConfig', 'borderWidth', e.target.value)}
                                                                                        value={globalConfig.tabbarConfig.borderWidth}
                                                                                        placeholder={`${('1px')}`}
                                                                                    />
                                                                                </FormItem>
                                                                            </div>
                                                                        </div>
                                                                    </Fragment>
                                                                    {
                                                                        detail.globalConfig.tabbarConfig.list.length > 0 && detail.globalConfig.tabbarConfig.list.map((item, index) =>
                                                                            index == detail.globalConfig.tabbarConfig.selectedIndex ?
                                                                                <Fragment key={index}><div className={mdiy.tab_detail}>
                                                                                    <div className={mdiy.tab_tittle}>{item.text}</div>
                                                                                    <div className={mdiy.del_btn} onClick={() => this.delTab(detail.globalConfig.tabbarConfig.selectedIndex)}>
                                                                                        {sldSvgIcon('#666', 20, 20, 'qingchu')}</div>

                                                                                    <div className={`${mdiy.sub_part}`}>
                                                                                        <div className={`${mdiy.subtitle}`}>显示的文字</div>
                                                                                        <FormItem key="text" label="">
                                                                                            <Input
                                                                                                onChange={(e) => this.onTabChange('tabbarConfig', 'text', e.target.value, index)}
                                                                                                value={item.text}
                                                                                                placeholder={`${('tab')}`}
                                                                                            />
                                                                                        </FormItem>
                                                                                    </div>
                                                                                    <div className={`${mdiy.sub_part}`}>
                                                                                        <div className={`${mdiy.subtitle}`}>路由地址</div>
                                                                                        <FormItem key="pagePath" label="">
                                                                                            <Input
                                                                                                onChange={(e) => this.onTabChange('tabbarConfig', 'pagePath', e.target.value, index)}
                                                                                                value={item.pagePath}
                                                                                                placeholder={`${('例如：/pages/tabbar/famousmall')}`}
                                                                                                style={{ width: '300px' }}
                                                                                            />
                                                                                        </FormItem>
                                                                                    </div>
                                                                                    <div className={`${mdiy.sub_part}`}>
                                                                                        <div className={`${mdiy.subtitle}`}>默认icon图标</div>
                                                                                        <Upload
                                                                                            withCredentials
                                                                                            beforeUpload={sldBeforeUpload}
                                                                                            accept=".gif, .jpeg, .png,.jpg,.svg"
                                                                                            showUploadList={false}
                                                                                            name="file"
                                                                                            action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                                                                            onChange={(info) => this.uploadChange(info, index, 'iconPath')}
                                                                                            headers={{
                                                                                                Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}`
                                                                                            }}
                                                                                        >
                                                                                            {item.iconPath
                                                                                                ? <img className={`${mdiy.subimg}`} src={item.iconPath} />
                                                                                                : sldSvgIcon('#FC701E', 40, 40, 'ziyuan110')
                                                                                            }
                                                                                        </Upload>
                                                                                        <span style={{ marginLeft: '10px' }}>图片路径，icon 大小限制为40kb，建议尺寸为 30px * 30px</span>
                                                                                    </div>
                                                                                    <div className={`${mdiy.sub_part}`}>
                                                                                        <div className={`${mdiy.subtitle}`}>选中icon图标</div>
                                                                                        <Upload
                                                                                            withCredentials
                                                                                            beforeUpload={sldBeforeUpload}
                                                                                            accept=".gif, .jpeg, .png,.jpg,.svg"
                                                                                            showUploadList={false}
                                                                                            name="file"
                                                                                            action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                                                                            onChange={(info) => this.uploadChange(info, index, 'selectedIconPath')}
                                                                                            headers={{
                                                                                                Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}`
                                                                                            }}
                                                                                        >
                                                                                            {item.selectedIconPath
                                                                                                ? <img className={`${mdiy.subimg}`} src={item.selectedIconPath} />
                                                                                                : sldSvgIcon('#FC701E', 40, 40, 'ziyuan110')
                                                                                            }
                                                                                        </Upload>
                                                                                        <span style={{ marginLeft: '10px' }}>图片路径，icon 大小限制为40kb，建议尺寸为 30px * 30px</span>
                                                                                    </div>
                                                                                    <div className={`${mdiy.sub_part}`}>
                                                                                        <div className={`${mdiy.subtitle}`}>是否展示此Tab</div>
                                                                                        <FormItem key="visible" label="">
                                                                                            <Radio.Group
                                                                                                onChange={(e) => this.onTabChange('tabbarConfig', 'visible', e.target.value, index)}
                                                                                                defaultValue={item.visible}
                                                                                            >
                                                                                                <Radio value>是</Radio>
                                                                                                <Radio value={false}>否</Radio>
                                                                                            </Radio.Group>
                                                                                        </FormItem>
                                                                                    </div>
                                                                                    <div className={`${mdiy.two_part}`}>
                                                                                        <div className={`${mdiy.sub_part}`}>
                                                                                            <div className={`${mdiy.subtitle}`}>图标默认宽度</div>
                                                                                            <FormItem key="iconWidth">
                                                                                                <Input
                                                                                                    onChange={(e) => this.onTabChange('tabbarConfig', 'iconWidth', e.target.value, index)}
                                                                                                    value={item.iconWidth}
                                                                                                    placeholder={`${('30px')}`}
                                                                                                />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                        <div className={`${mdiy.sub_part}`}>
                                                                                            <div className={`${mdiy.subtitle}`}>图标默认高度</div>
                                                                                            <FormItem key="nav_style_set" label="">
                                                                                                <Input
                                                                                                    onChange={(e) => this.onTabChange('tabbarConfig', 'iconHeight', e.target.value, index)}
                                                                                                    value={item.iconHeight}
                                                                                                    placeholder={`${('30px')}`}
                                                                                                />
                                                                                            </FormItem>
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className={`${mdiy.sub_part}`}>
                                                                                        <div className={`${mdiy.subtitle}`}>设置专题页</div>
                                                                                        <FormItem>
                                                                                            <SnUrlPicker
                                                                                                value={{...item}}
                                                                                                options={diy_tabbar_link_type()}
                                                                                                onchange={(params)=>{this.onTopicChange('tabbarConfig', params, index)}}
                                                                                            />
                                                                                        </FormItem>
                                                                                    </div>
                                                                                    {getSldEmptyH(10)}
                                                                                </div></Fragment> : ''
                                                                        )
                                                                    }
                                                                </Scrollbars>
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                </div>
                                            }
                                        </div>

                                        <div
                                            className={global.m_diy_bottom_wrap}
                                            style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                                        >
                                            <AuthBtn eventKey={['add_tabbar_deco']} btnAuth={btnAuth}>
                                                <div
                                                    onClick={this.handleSaveAllData}
                                                    className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel} ${isTabbarChange ? '' : global.add_goods_bottom_btn_disabled}`}
                                                >
                                                保存
                                                </div>

                                            </AuthBtn>
                                            <AuthBtn eventKey={['delete_tabbar_deco']} btnAuth={btnAuth}>

                                                {isTabbar && (<div
                                                    style={{'marginLeft': '20px','backgroundColor': 'red', "width": '120px'}}
                                                    onClick={() => this.setState({ delModalVisible: true })}
                                                    className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                                                >
                                                清除tabbar装修
                                                </div>)}
                                            </AuthBtn>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Scrollbars>

                <Modal title="提示" visible={delModalVisible} onOk={this.deleteOk} onCancel={() => this.setState({ delModalVisible: false })}>
                    <div style={{"margin": '30px 0 30px 15px',"fontSize": '16px'}}>是否确认清除装修数据？</div>
                </Modal>
            </Spin>
        );
    }
}
