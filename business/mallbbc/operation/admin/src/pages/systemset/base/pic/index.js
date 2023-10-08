import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import { failTip, sucTip, getSldEmptyH,sldComLanguage,showMoreHelpTip, getAuthBtn, hasAuth
} from '@/utils/utils';
import { sld_need_update_setting,sld_config_save_btn
} from '@/utils/util_data';
import { apiUrl } from '@/utils/sldconfig.js';
import SldTableEdit from '@/components/SldTableEdit/SldTableEdit';
import global from '@/global.less';
import SldComHeader from '@/components/SldComHeader';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;

@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()
export default class PicSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sld_show_tip:true,//是否显示页面提示，默认显示
            base_pic_flag: false,
            default_pic_flag: false,
            submitting: false,//提交按钮加载状态
            initLoading: false,//页面初始化加载状态
            base_pic_data: [],
            default_pic_data: [],
            activeTabKey: '1',
            tab1Auth: "view_main_img",
            tab2Auth: "view_default_img"
        };
    }

    componentDidMount() {
        this.get_set_info();
    }

    componentWillUnmount() {

    }

	//获取配置信息
	get_set_info = () => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    let { activeTabKey, base_pic_flag, default_pic_flag, base_pic_data, default_pic_data } = this.state;
	    let dis_type = '';
	    if (activeTabKey == 1) {
	        dis_type = 'sldsetting/get_base_pic';
	    } else if (activeTabKey == 2) {
	        dis_type = 'sldsetting/get_default_pic';
	    }
	    dispatch({
	        type: dis_type,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                if (activeTabKey == 1) {
	                    base_pic_flag = true;
	                    base_pic_data = [];
	                    for (let i = 0; i < res.data.length; i++) {
	                        let fileList = [];
	                        let tmp_data = {};
	                        tmp_data.uid = new Date();
	                        tmp_data.name = res.data[i].value;
	                        tmp_data.status = 'done';
	                        tmp_data.url = res.data[i].imageUrl;
	                        fileList.push(tmp_data);
	                        base_pic_data.push({
	                            type: 'upload_img_upload',
	                            label: res.data[i].title,
	                            name: res.data[i].name,
	                            extra: res.data[i].description,
	                            fileList: fileList,
	                            upload_name: 'file',
	                            upload_url: `${apiUrl }v3/oss/common/upload?source=setting`,
	                            uploadPreview: this.uploadImgPre,
	                            uploadChange: (info) => this.uploadImg(info, res.data[i].name, 'base_pic'),
	                            initialValue: '',
	                            img_succ_info: { path: res.data[i].value }
	                        });
	                    }

	                } else if (activeTabKey == 2) {
	                    default_pic_flag = true;
	                    default_pic_data = [];
	                    for (let i = 0; i < res.data.length; i++) {
	                        let fileList = [];
	                        let tmp_data = {};
	                        tmp_data.uid = new Date();
	                        tmp_data.name = res.data[i].value;
	                        tmp_data.status = 'done';
	                        tmp_data.url = res.data[i].imageUrl;
	                        fileList.push(tmp_data);
	                        default_pic_data.push({
	                            type: 'upload_img_upload',
	                            label: res.data[i].title,
	                            name: res.data[i].name,
	                            extra: res.data[i].description,
	                            fileList: fileList,
	                            upload_name: 'file',
	                            upload_url: `${apiUrl }v3/oss/common/upload?source=setting`,
	                            uploadPreview: this.uploadImgPre,
	                            uploadChange: (info) => this.uploadImg(info, res.data[i].name, 'default_pic'),
	                            initialValue: '',
	                            img_succ_info: { path: res.data[i].value }
	                        });
	                    }
	                    if (default_pic_data.length > 0) {
	                        default_pic_data.push(sld_config_save_btn);
	                    }
	                }
	                this.setState({ base_pic_flag, default_pic_flag, base_pic_data, default_pic_data });
	            }
	        }
	    });
	};

	//预览图片
	uploadImgPre = (info) => {
	    this.viewImg(true, info.name);
	};

	//上传图片 dataType:用于区分更改那个数据
	uploadImg = (info, type, dataType) => {
	    let { base_pic_data, default_pic_data } = this.state;
	    if(info.file.status!=undefined&&info.file.status!='error') {
	        if (dataType == 'base_pic') {
	            for (let i = 0; i < base_pic_data.length; i++) {
	                if (base_pic_data[i].name == type) {
	                    base_pic_data[i].fileList = info.fileList;
	                    base_pic_data[i].img_succ_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
	                }
	            }
	        } else {
	            for (let i = 0; i < default_pic_data.length; i++) {
	                if (default_pic_data[i].name == type) {
	                    default_pic_data[i].fileList = info.fileList;
	                    default_pic_data[i].img_succ_info = (info.file.response != undefined && info.fileList.length > 0 && info.file.response.data != undefined) ? info.file.response.data : [];
	                }
	            }
	        }
	        this.setState({ base_pic_data, default_pic_data });
	    }
	};

	//保存事件
	handleSubmit = (values, data = []) => {
	    this.setState({ submitting: true });
	    const { dispatch } = this.props;
	    let dis_type = 'project/saveSetting';
	    let param = {};
	    for (let i = 0; i < data.length; i++) {
	        param[data[i].name] = data[i].img_succ_info != undefined && data[i].img_succ_info.path != undefined ? data[i].img_succ_info.path : '';
	        delete param.button;
	    }
	    dispatch({
	        type: dis_type,
	        payload: param,
	        callback: (res) => {
	            this.setState({ submitting: false });
	            if (res.state == 200) {
	                sucTip(res.msg);
	            } else {
	                failTip(res.msg);
	            }
	        }
	    });
	};

	//tab设置
	changeSldTab = (key) => {
	    this.setState({
	        activeTabKey: key
	    }, () => {
	        this.get_set_info();
	    });
	};

	handleToggleTip = () => {
	    let {sld_show_tip} = this.state
	    this.setState({
	        sld_show_tip:!sld_show_tip
	    });
	}

	render() {
	    const { submitting, initLoading, base_pic_data, default_pic_data, default_pic_flag, base_pic_flag,sld_show_tip, tab1Auth, tab2Auth} = this.state;
	    return (
	        <Spin spinning={initLoading}>
	            <div className={global.common_page}>
	                <SldComHeader
	                    type={1}
	                    title={`${sldComLanguage('基本设置')}`}
	                    handleToggleTip={()=>this.handleToggleTip()}
	                />
	                {getSldEmptyH(10)}
	                <AuthBtn eventKey={[tab1Auth,tab2Auth]} btnAuth={btnAuth} showPage>
	                <Tabs onChange={(key) => this.changeSldTab(key)} type="card">
	                        {
	                            hasAuth(tab1Auth) && 
	                    <TabPane tab={sldComLanguage('基本图片')} key="1">
	                        {showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
	                        {getSldEmptyH(8)}
	                        <div className={`${global.flex_com_column}`}>
	                            {base_pic_flag == 1 &&
								<SldTableEdit
								    submiting={submitting}
								    width={1000}
								    data={base_pic_data}
								    need_data
								    handleSubmit={this.handleSubmit}
								    btn_fixed_bottom
								    scroll_h={260}
								    noSaveBtnAuth={!hasAuth('edit_main_img')}
								/>
	                            }
	                        </div>
	                    </TabPane>
	                        }

	                        {
	                            hasAuth(tab2Auth) && 
	                    <TabPane tab={sldComLanguage('默认图片')} key="2">
	                        {showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
	                        {getSldEmptyH(8)}
	                        <div className={`${global.flex_com_column}`}>
	                            {default_pic_flag == 1 &&
								<SldTableEdit
								    submiting={submitting}
								    width={1000}
								    data={default_pic_data}
								    need_data
								    handleSubmit={this.handleSubmit}
								    btn_fixed_bottom
								    noSaveBtnAuth={!hasAuth('edit_default_img')}
								/>}
	                        </div>
	                    </TabPane>
	                        }
	                </Tabs>

	                </AuthBtn>
	            </div>
	        </Spin>
	    );
	}
}
