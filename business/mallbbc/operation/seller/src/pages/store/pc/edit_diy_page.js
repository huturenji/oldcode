/*
* 装修页面
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Carousel, Icon } from 'antd';
import {
    failTip,
    sucTip,
    formItemLayoutModal,
    getSldEmptyH,
    list_com_page_more,
    sldSvgIcon,
    sldComLanguage
} from '@/utils/utils';
import global from '@/global.less';
import SldSeleTpl from '@/components/SldSeleTpl/SldSeleTpl';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import diy from './diy_page.less';
import EditDdiyPageHead from './edit_diy_page_head';

// eslint-disable-next-line no-unused-vars
let getFieldDecorator_new = '';
//  将拖拽后位置的数据删除然后添加到拖拽前的位置上
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    margin: `0 0 ${grid}px 0`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // change background colour if dragging
    background: isDragging ? '#fff' : '#fff',
    opacity: isDragging ? 0.5 : 1,
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: isDragging ? '#7abfe8' : '#fff',
    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? '#cfe2f9' : '#fff',
    width: 1220,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: isDraggingOver ? '#ecf0f5' : '#fff'

});
@connect(({ product }) => ({
    product
}))
@Form.create()

export default class Edit_diy_page extends Component {
	sele_banner_instance_id = '';

	//选择的实例化模板id
	position = '';

	//添加模板的位置，top 当前模板的顶部，bottom 当前模板的底部
	id = '';//当前模板的id
	
	constructor(props) {
	    super(props);
	    const {
	        form: { getFieldDecorator }
	    } = props;
	    getFieldDecorator_new = getFieldDecorator;
	    this.state = {
	        cur_tpl_type: '',//当前操作模式,main_banner:页面主轮播图，floor：楼层，main_nav:主导航
	        is_edit_flag: false,//当前页面是否执行过操作
	        swiper_data: [],//选择的页面主轮播的数据
	        curData: {},//当前页面数据
	        query: props.location.query,
	        submiting: false,
	        modalVisible: false,
	        diy_page_data: {},
	        data: []//装修数据
	    };
	}

	componentDidMount() {
	    const { query } = this.state;
	    if (query.id != undefined && query.id > 0) {
	        this.get_diy_page_detial(query.id);
	    }
	    this.get_tpl_type_list();
	}

	componentWillUnmount() {

	}

	//获取所有模板类型列表
	get_tpl_type_list = () => {
	    const { dispatch } = this.props;
	    let { addData } = this.state;
	    dispatch({
	        type: 'pc_home/get_tpl_type_list',
	        callback: (res) => {
	            if (res.state == 200) {
	                for(let i=0;i<addData.length;i++) {
	                    if (addData[i].type == 'sele_instance_tpl') {
	                        res.data = res.data.filter(item => item.type != 'main_banner' && item.type != 'top_com_nav');
	                        addData[i].data_left = res.data;
	                        addData[i].activeKey = res.data[0].type;
	                        break;
	                    }
	                }
	                this.setState({ addData }, () => {
	                    this.get_tpl_instance_list(res.data[0].type);
	                });
	            }
	        }
	    });
	};

	//装修模板切换
	handleTabChange = (val) => {
	    let { addData } = this.state;
	    addData.forEach((item) => {
	        if (item.type == 'sele_instance_tpl') {
	            item.activeKey = val;
	        }
	    });
	    this.setState({ addData });
	    this.get_tpl_instance_list(val);
	};

	//装修模板的选择
	handle_sele_tpl = (val) => {
	    let { addData } = this.state;
	    addData.forEach((item) => {
	        if (item.type == 'sele_instance_tpl') {
	            item.sele_tpl_info = val;
	        }
	    });
	    this.setState({ addData });
	};

	sldHandleCancle = () => {
	    this.setState({ modalVisible: false });
	};

	sldHandleConfirm = (val = []) => {
	    let { data, swiper_data, cur_tpl_type } = this.state;
	    if (cur_tpl_type == 'main_banner') {
	        //轮播图处理
	        swiper_data = JSON.parse(val[0].json).data;
	        this.sele_banner_instance_id = val[0].dataId;
	    } else {
	        for ( let i = 0; i < val.length; i++) {
	            //楼层模板处理
	            let tmp_tpl = { key: val[i].dataId, html: val[i].html, id: data.length + 1 };
	            if (this.id != '') {
	                // eslint-disable-next-line no-shadow
	                for (let i = 0; i < data.length; i++) {
	                    if (data[i].id == this.id) {
	                        if (this.position == 'top') {
	                            data.splice(i, 0, { ...tmp_tpl, id: i + 1 });
	                            data[i + 1].id = i + 2;
	                        } else {
	                            data.splice(i + 1, 0, { ...tmp_tpl, id: i + 2 });
	                        }
	                        break;
	                    }
	                }
	                data.forEach((item, index) => {
	                    item.id = index + 1;
	                });
	            } else {
	                //并将数据追加到装修里面,并将页面滚动到最底部
	                data.push(tmp_tpl);
	            }
	        }
	    }
	    this.setState({ data, modalVisible: false, is_edit_flag: true, swiper_data });
	};

	//删除实例化模板
	del_instance = (id) => {
	    let { data } = this.state;
	    data = data.filter(item => item.id != id);
	    for(let i = 0; i < data.length; i++) {
	        data[i].id = i + 1;
	    }
	    this.setState({ data, is_edit_flag: true });
	};

	onDragEnd = (result) => {
	    // 拖出范围外
	    if (!result.destination) {
	        return;
	    }
	    const data = reorder(
	        // eslint-disable-next-line react/no-access-state-in-setstate
	        this.state.data,
	        result.source.index,
	        result.destination.index,
	    );

	    this.setState({ data, is_edit_flag: true });
	};

	//获取所有开启状态的实例化模板列表  tpl_type 模版类型  mode_type：single 只从一种模板中选择
	get_tpl_instance_list = (tpl_type, mode_type = '') => {
	    const { dispatch } = this.props;
	    let { addData, modalVisible } = this.state;
	    dispatch({
	        type: 'pc_home/get_tpl_instance_list_allow_use',
	        payload: { tplType: tpl_type, pageSize: list_com_page_more,isEnable:1 },
	        callback: (res) => {
	            for(let i = 0; i < addData.length; i++) {
	                if (addData[i].type == 'sele_instance_tpl') {
	                    addData[i].data_right = [];
	                    if (mode_type == 'single') {
	                        modalVisible = true;
	                        addData[i].show_left = false;
	                    } else {
	                        addData[i].show_left = true;
	                    }
	                    if (res.state == 200) {
	                        addData[i].data_right = res.data.list;
	                    }
	                    break;
	                }
	            }
	            this.setState({ addData, cur_tpl_type: mode_type, modalVisible: modalVisible });
	        }
	    });
	};


	//获取装修页面数据
	get_diy_page_detial = (id) => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'pc_home/get_diy_page_detial',
	        payload: { decoId: id },
	        callback: (res) => {
	            if (res.state == 200) {
	                let tmp = res.data.tplData?res.data.tplData:[];
	                if(tmp.length>0){
	                    tmp.forEach((val, key) => {
	                        val.key = val.id;
	                        val.id = key + 1;
	                    });
	                }
	                this.sele_banner_instance_id = !res.data.masterBannerData ? '' : res.data.masterBannerData.id;
	                this.setState({
	                    data: tmp, //楼层数据
	                    curData: res.data,
	                    swiper_data: !res.data.masterBannerData ? [] : JSON.parse(res.data.masterBannerData.json).data//轮播图数据
	                });
	            }
	        }
	    });
	};


	//添加模板
	addTplData = (position = '', id = '', type = 'floor') => {
	    this.position = position;
	    this.id = id;
	    this.setState({ modalVisible: true, cur_tpl_type: type });
	};

	//保存装修数据
	save_diy_page_data = () => {
	    const { data, curData, is_edit_flag } = this.state;
	    if (is_edit_flag) {
	        if (this.sele_banner_instance_id == '') {
	            failTip(`${sldComLanguage('请选择主轮播图模板')}`);
	            return false;
	        }
	        let param = {};
	        param.decoId = curData.decoId;
	        let diy_tpl_ids = [];
	        for(let i = 0; i < data.length; i++) {
	            diy_tpl_ids.push(data[i].key);
	        }
	        param.rankedTplDataIds = diy_tpl_ids.join(',');
	        param.masterBannerId = this.sele_banner_instance_id;//主轮播图实例化模板id
	        const { dispatch } = this.props;
	        dispatch({
	            type: 'pc_home/save_diy_page_data',
	            payload: param,
	            callback: (res) => {
	                if (res.state == 200) {
	                    sucTip(res.msg);
	                } else {
	                    failTip(res.msg);
	                }
	            }
	        });
	    }
	};

	render() {
	    const { data, submiting, modalVisible, swiper_data, is_edit_flag, cur_tpl_type } = this.state;
	    return (
	        <div
	            ref={(el) => {
	                this.messagesEnd = el;
	            }}
	            className={` ${diy.allow_show_sld_mask}`}
				 style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
	        >
	            <div className={diy.add_floor_fixed} style={{ bottom: 120 }}>
	                <div className={`${diy.com_btn} ${diy.add_floor_btn}`} onClick={() => this.addTplData()}>
	                    <Icon type="plus-circle" /> {sldComLanguage('添加楼层')}
	                </div>
	            </div>
	            <div ref="wrap_top" className={global.flex_com_column}>
	                <EditDdiyPageHead />
	            </div>
	            <div style={{ position: 'relative' }}>
	                <a className={diy.sld_mask} onClick={() => this.addTplData('', '', 'main_banner')}>
	                    <span style={{right:'50%',marginRight:-550}}>{sldComLanguage('选择主轮播模板')}</span>
	                </a>
	                {swiper_data.length > 0 &&
					<Carousel autoplay>
					    {swiper_data.map((item, index) => (
					        <div className={diy.swiper_wrap} key={index}><img src={item.imgUrl} /></div>
					    ))}
					</Carousel>
	                }
	                {swiper_data.length == 0 &&
					<div className={diy.swiper_wrap} style={{width:'auto'}} />
	                }
	            </div>
	            <div className={`${global.flex_com_column}`}>
	                <DragDropContext onDragEnd={this.onDragEnd}>
	                    <Droppable droppableId="droppable">
	                        {(provided, snapshot) => (
	                            <div
	                                {...provided.droppableProps}
	                                ref={provided.innerRef}
	                                style={getListStyle(snapshot.isDraggingOver)}
	                            >
	                                {data.map((item, index) => (
	                                    <Draggable key={item.id} draggableId={item.id} index={index}>
	                                        {/* eslint-disable-next-line no-shadow */}
	                                        {(provided, snapshot) => (
	                                            <div
	                                                ref={provided.innerRef}
	                                                {...provided.draggableProps}
	                                                {...provided.dragHandleProps}
	                                                style={getItemStyle(
	                                                    snapshot.isDragging,
	                                                    provided.draggableProps.style,
	                                                )}
	                                            >
	                                                <div style={{ position: 'relative' }}>
	                                                    {/* eslint-disable-next-line react/no-danger */}
	                                                    <div dangerouslySetInnerHTML={{ __html: item.html }} />
	                                                    <div className={diy.sld_mask}>
	                                                        <a
	                                                            className={diy.top_add}
															   onClick={() => this.addTplData('top', item.id)}
	                                                        >{sldSvgIcon('#FA6F1E', 16, 16, 'jia')}</a>
	                                                        <a
	                                                            className={diy.bottom_add}
															   onClick={() => this.addTplData('bottom', item.id)}
	                                                        >{sldSvgIcon('#FA6F1E', 16, 16, 'jia')}</a>
	                                                        <span onClick={() => this.del_instance(item.id)}>{sldComLanguage('删除')}</span>
	                                                    </div>
	                                                </div>
	                                            </div>
	                                        )}
	                                    </Draggable>
	                                ))}
	                                {provided.placeholder}
	                            </div>
	                        )}
	                    </Droppable>
	                </DragDropContext>
	                {getSldEmptyH(50)}
	            </div>
	            {/*新增/编辑对话框-start*/}
	            <SldSeleTpl
	                width={1000}
	                title={`${sldComLanguage('选择装修模板')}`}
	                sldSeleSingleRow
	                submiting={submiting}
	                modalVisible={modalVisible}
	                sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
	                sldHandleCancle={this.sldHandleCancle}
	                formItemLayoutModal={formItemLayoutModal}
	                sele_type={cur_tpl_type}
	            />
	            {/*新增/编辑对话框-end*/}
	            {getSldEmptyH(20)}
	            <div
	                className={global.m_diy_bottom_wrap}
	                style={{ position: 'fixed', left: 0 ,right:0 }}
	            >
	                <div
	                    onClick={() => this.props.form.submit(this.save_diy_page_data)}
	                    className={`${global.add_goods_bottom_btn} ${is_edit_flag?global.add_goods_bottom_btn_sel:global.add_goods_bottom_btn_forbidden}`}
	                >
	                    {sldComLanguage('保 存')}
	                </div>
	            </div>
	        </div>
	    );
	}
}
