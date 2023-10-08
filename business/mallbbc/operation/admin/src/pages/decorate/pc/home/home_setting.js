/*
* 首页轮播图设置
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
    failTip,
    sucTip,
    sldEmptyHandle2,
    sldComLanguage
} from '@/utils/utils';
import { pc_home_modal_tip } from '@/utils/util_data';
import global from '@/global.less';
import styles from '../pcdecorate.less';
import SldHomeSetting from '@/components/SldHomeSetting/SldHomeSetting';
import SldComHeader from '@/components/SldComHeader';

// eslint-disable-next-line no-unused-vars
let getFieldDecorator_new = '';
@connect(({ pc_home }) => ({
    pc_home
}))
@Form.create()
export default class HomeSetting extends Component {
    cur_flash_id = '';

	//当前操作的轮播图id
	modal_adv_id = '';//开屏图的id
    
	constructor(props) {
	    super(props);
	    const {
	        form: { getFieldDecorator }
	    } = props;
	    getFieldDecorator_new = getFieldDecorator;
	    this.state = {
	        cur_index: '',//当前操作数据的index
	        cur_data: {},//当前操作的数据
	        tpl_adv_01_modal_tip: [],//modal框提示
	        submiting: false,//按钮loading
	        modalVisible: false,//是否展示modal
	        modal_adv_data: {
	            type: 'home_modal_adv',
	            width: 500,
	            height: 320,
	            data: {}
	        },//首页开屏幕图设置
	        data: {
	            type: 'single_img',
	            width: 1920,
	            height: 457,//高度为0的话表示不限制
	            data: []
	        }//装修的数据

	    };
	}

	componentDidMount() {
	    let { getChild } = this.props
	    getChild('homeSetting', this)
	    this.get_modal_adv();
	}

	componentWillUnmount() {}

	channelChange = () => {
	    this.get_modal_adv();
	}

	get_modal_adv = () => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'pc_home/get_modal_adv',
	        callback: (res) => {
	            if (res.state == 200 && res.data) {
	                this.modal_adv_id = res.data.advId;
	                this.cur_flash_id = '';
	                this.editModaldv(JSON.parse(res.data.data));
	            }
	        }
	    });
	};


	//设置首页开屏图事件
	editModaldv = (res) => {
	    let { modal_adv_data } = this.state;
	    let tmp_data = {};
	    tmp_data.width = modal_adv_data.width;
	    tmp_data.height = modal_adv_data.height;
	    tmp_data.source = 'home_modal_adv';
	    tmp_data.data = {
	        imgUrl: sldEmptyHandle2(res.imgUrl),
	        imgPath: sldEmptyHandle2(res.imgPath),
	        title: '',
	        link_type: sldEmptyHandle2(res.link_type),
	        link_value: sldEmptyHandle2(res.link_value),
	        show_switch: sldEmptyHandle2(res.show_switch),//弹出广告开关
	        show_radio_sele: sldEmptyHandle2(res.show_radio_sele)//弹出方式，one只有一次 more多次
	    };
	    this.setState({
	        cur_data: tmp_data,
	        modalVisible: true,
	        modal_tip: pc_home_modal_tip(),
	        title: `${sldComLanguage('设置首页开屏图')}`//设置首页开屏图
	    });

	};

	//保存开屏设置
	save_modal_adv = (val) => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'pc_home/save_modal_adv',
	        payload: { data: JSON.stringify(val), advId: this.modal_adv_id },
	        callback: (res) => {
	            if (res.state == 200) {
	                sucTip(res.msg);
	            } else {
	                failTip(res.msg);
	            }
	        }
	    });
	};

	sldHandleConfirm = (val) => {
	    if (this.modal_adv_id != '') {
	        //保存开屏图设置
	        let {cur_data} = this.state;
	        cur_data.data = val;
	        this.setState({cur_data})
	        this.save_modal_adv(val);
	    }
	};

	sldHandleCancle = () => {
	    this.setState({ modalVisible: false });
	};

	render() {
	    const { submiting, modalVisible, modal_tip, cur_data, title } = this.state;
	    return (
	        <div className={`${global.common_page} ${styles.allow_show_edit}`}>
	            <SldComHeader
	                type={2}
	                title={sldComLanguage('首页开屏图设置')}//首页开屏图设置
	                tip_title={sldComLanguage('操作提示')}
	                tip_data={pc_home_modal_tip()}
	            />
	            <SldHomeSetting
	                width={1000}
	                title={title}
	                sldSeleSingleRow
	                submiting={submiting}
	                modalVisible={modalVisible}
	                sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
	                sldHandleCancle={this.sldHandleCancle}
	                content={cur_data}
	                modal_tip={modal_tip}
	            />
	        </div>

	    );
	}
}
