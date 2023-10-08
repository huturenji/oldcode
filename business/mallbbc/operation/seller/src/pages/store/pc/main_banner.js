/*
* 主轮播图设置，宽度满屏，高度457，主要用于页面分类处
* */
import { connect } from 'dva/index';
import moment from 'moment/moment';
import React, { Component, Fragment } from 'react';
import { Form, Carousel } from 'antd';
import {
    sldPopConfirmDiy,
    sldEmptyHandle2,dateTimeFormat,sldComLanguage,getStorage
} from '@/utils/utils';
import { tpl_adv_01_modal_tip} from '@/utils/util_data';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import styles from './pcdecorate.less';
import SldDiySingleImgModal from '@/components/SldDiySingleImgModal/SldDiySingleImgModal';
import diy from './diy_page.less';

let sthis = '';
// eslint-disable-next-line no-unused-vars
let getFieldDecorator_new = '';
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class MainBanner extends Component {
	cur_operate_index = '';//当前操作的轮播图位置
	
	constructor(props) {
	    super(props);
	    sthis = this;
	    const {
	        form: { getFieldDecorator }
	    } = props;
	    getFieldDecorator_new = getFieldDecorator;
	    this.state = {
	        tpl_info: props.tpl_info,
	        cur_index: '',//当前操作数据的index
	        cur_data: {},//当前操作的数据
	        tpl_adv_01_modal_tip: [],//modal框提示
	        submiting: false,//按钮loading
	        modalVisible: false,//是否展示modal
	        data: {
	            type: 'main_banner',
	            width: 1920,
	            height: 457,//高度为0的话表示不限制
	            data: [{
	                status: 1,
	                imgUrl: '',
	                imgPath: '',
	                title: '',
	                link_type: '',
	                link_value: '',
	                sort: '',
	                startTime: '',
	                endTime: ''
	            }]
	        }//装修的数据
	    };
	}

	componentDidMount() {
	    let { tpl_info } = this.state;
	    if (tpl_info.data.length > 0) {
	        let tmp_data = [];
	        for(let i = 0; i < tpl_info.data.length; i++) {
	            tmp_data.push({
	                status: tpl_info.data[i].status,
	                imgUrl: tpl_info.data[i].imgUrl,
	                imgPath: tpl_info.data[i].imgPath,
	                title: '',
	                link_type: tpl_info.data[i].link_type,
	                link_value: tpl_info.data[i].link_value,
	                sort: tpl_info.data[i].orderNo!=undefined?tpl_info.data[i].orderNo:'',
	                range_picker: [moment(tpl_info.data[i].startTime, dateTimeFormat), moment(tpl_info.data[i].endTime, dateTimeFormat)]
	            });
	        }
	        tpl_info.data = tmp_data;
	    }
	    this.setState({
	        data: tpl_info
	    });
	}

	componentWillUnmount() {

	}


	editTpl = (tip, index, type) => {
	    let { data, title } = this.state;
	    let tmp_data = {};
	    tmp_data.width = data.width;
	    tmp_data.height = data.height;
	    tmp_data.source = 'home_flash';
	    this.cur_operate_index = index;
	    if (type == 'add') {
	        title = `${sldComLanguage('添加轮播图')}`;
	        tmp_data.data = {
	            imgUrl: '',
	            imgPath: '',
	            title: '',
	            link_type: '',
	            link_value: '',
	            sort: '',
	            range_picker: []//使用时间
	        };
	    } else {
	        title = `${sldComLanguage('编辑轮播图')}`;
	        tmp_data.data = data.data[index];
	    }
	    this.setState({
	        cur_index: index,
	        cur_data: tmp_data,
	        modalVisible: true,
	        modal_tip: tip,
	        title
	    });
	};

	//轮播图操作，del 删除，start 启用，stop 禁用
	operateFlash = (indexs, type) => {
	    let { data } = this.state;
	    if (type == 'del') {
	        data.data = data.data.filter((item, index) => index != indexs);
	    } else if (type == 'start') {
	        for(let i = 0; i < data.data.length; i++) {
	            if (i == indexs) {
	                data.data[i].status = 1;
	                break;
	            }
	        }
	    } else if (type == 'stop') {
	        for(let i = 0; i < data.data.length; i++) {
	            if (i == indexs) {
	                data.data[i].status = 2;
	                break;
	            }
	        }
	    }
	    this.save(data);
	};

	sldHandleConfirm = (val) => {
	    let { data } = this.state;
	    if (this.cur_operate_index !== '') {
	        //严格不等于防止把下表为0的数据过滤掉
	        for(let i = 0; i < data.data.length; i++) {
	            if (i == this.cur_operate_index) {
	                val.status = data.data[i].status;
	                data.data[i] = val;
	            }
	        }
	    } else {
	        data.data.push({ ...val, status: 1 });
	    }
	    this.save(data);
	};

	//数据处理并保存
	save = (data) => {
	    let tmp_data = [];
	    if (data.data.length > 0) {
	        for(let i = 0; i < data.data.length; i++) {
	            tmp_data[i] = {...data.data[i]};
	            if (data.data[i].range_picker) {
	                tmp_data[i].startTime = data.data[i].range_picker[0] ? data.data[i].range_picker[0].format(dateTimeFormat) : '';
	                tmp_data[i].endTime = data.data[i].range_picker[1] ? data.data[i].range_picker[1].format(dateTimeFormat) : '';
	                delete tmp_data[i].range_picker;
	            }
	        }
	    }
	    let data_new = {...data};
	    data_new.data = tmp_data
	    this.setState({
	        modalVisible: false
	    }, () => {
	        this.props.save_tpl_data(data_new, sthis.refs.wrap_html.innerHTML);
	    });
	};

	sldHandleCancle = () => {
	    this.setState({ modalVisible: false });
	};

	render() {
	    const { data, submiting, modalVisible, modal_tip, cur_data, title } = this.state;
	    // eslint-disable-next-line no-unused-expressions
	    sldEmptyHandle2(getStorage('pc_diy_tpl')) != '' ? JSON.parse(getStorage('pc_diy_tpl')) : '';
	    return (
	        <Fragment>
	            {data.data.length > 0 &&
				<Carousel autoplay>
				    {data.data.map((item, index) => (
				        <div key={index} className={`${styles.adv_01_wrap}`}>
				            <img className={styles.adv_01_img} src={item.imgUrl} />
				            <div className={styles.sld_mask}>
				                {/*添加轮播图*/}
				                <span
				                    className={`${styles.btn_common} ${styles.add}`}
								      onClick={() => this.editTpl(tpl_adv_01_modal_tip(),'', 'add')}
				                >{sldComLanguage('添加')}</span>
				                {item.status == 2 && sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定启用该轮播图？')}`, () => this.operateFlash(index, 'start'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
				                    <span className={`${styles.btn_common} ${styles.enable}`}>{sldComLanguage('启用')}</span>)}
				                {item.status == 1 && sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定停用该轮播图？')}`, () => this.operateFlash(index, 'stop'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
				                    <span className={`${styles.btn_common} ${styles.enable}`}>{sldComLanguage('禁用')}</span>)}
				                <span
				                    className={`${styles.btn_common} ${styles.edit}`}
									  onClick={() => this.editTpl(tpl_adv_01_modal_tip(), index, 'edit')}
				                >{sldComLanguage('编辑')}</span>
				                {/*删除后不可恢复，是否确定删除？*/}
				                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateFlash(index, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
				                    <span className={`${styles.btn_common} ${styles.del}`}>{sldComLanguage('删除')}</span>)}
				            </div>
				        </div>
				    ))}
				</Carousel>
	            }

	            {data.data.length == 0
	                ? <div ref="wrap_html">
	                    <div className={diy.main_banner}>
	                        <div className={styles.sld_mask}>
	                            {/*添加轮播图*/}
	                            <span
	                                className={`${styles.btn_common} ${styles.add}`}
	                                onClick={() => this.editTpl(tpl_adv_01_modal_tip(),'', 'add')}
	                                style={{right:5}}
	                            >{sldComLanguage('添加')}</span></div>
	                    </div>
	                </div>
	                : <div ref="wrap_html" style={{ opacity: 0 }}>
	                    <div className={diy.main_banner}>
	                        <img src={data.data[0].imgUrl} />
	                    </div>
	                </div>
	            }

	            <SldDiySingleImgModal
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
	        </Fragment>
	    );
	}
}
