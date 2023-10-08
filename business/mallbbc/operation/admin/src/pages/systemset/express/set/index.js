import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
    failTip,
    sucTip,
    getSldEmptyH,
    sldComLanguage,
    showMoreHelpTip,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import {
    sld_need_update_setting,
    sld_config_save_btn
} from '@/utils/util_data';
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
export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sld_show_tip:true,//是否显示页面提示，默认显示
            kdn_flag: false,
            submitting: false,//提交按钮加载状态
            initLoading: false,//页面初始化加载状态
            kdn_set_data: [],
            activeTabKey: '1'
        };
    }

    componentDidMount() {
        this.get_info();
    }

    componentWillUnmount() {

    }

	//获取配置信息
	get_info = () => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    let { kdn_flag, kdn_set_data} = this.state;
	    let dis_type = 'project/getSetting';
	    dispatch({
	        type: dis_type,
	        payload:{str:'express_apikey,express_ebusinessid'},
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                kdn_flag = true;
	                for(let i=0; i<res.data.length; i++ ){
	                    if(res.data[i].name == 'express_apikey'||res.data[i].name == 'express_ebusinessid'){
	                        kdn_set_data.push({
	                            type: 'input',
	                            label: res.data[i].title,
	                            extra: res.data[i].description,
	                            name: res.data[i].name,
	                            placeholder: '',
	                            initialValue: res.data[i].value
	                        });
	                    }
	                }
	                kdn_set_data.push(sld_config_save_btn);
	                this.setState({
	                    kdn_set_data,
	                    kdn_flag
	                });
	            }
	        }
	    });
	};

	//保存事件
	handleSubmit = (values) => {
	    this.setState({ submitting: true });
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'project/saveSetting',
	        payload: values,
	        callback: (res) => {
	            if (res.state == 200) {
	                sucTip(res.msg);
	            } else {
	                failTip(res.msg);
	            }
	            this.setState({ submitting: false });
	        }
	    });
	};

	//tab设置
	changeSldTab = (key) => {
	    this.setState({
	        activeTabKey: key
	    });
	};

	handleToggleTip = () => {
	    let {sld_show_tip} = this.state
	    this.setState({
	        sld_show_tip:!sld_show_tip
	    });
	}

	render() {
	    const { submitting, initLoading, activeTabKey, kdn_set_data, kdn_flag,sld_show_tip } = this.state;
	    return (
	        <Spin spinning={initLoading}>
	            <div className={global.common_page}>
	                <SldComHeader
	                    type={1}
	                    title={`${sldComLanguage('物流设置')}`}
	                    handleToggleTip={()=>this.handleToggleTip()}
	                />
	                {getSldEmptyH(10)}
	                <AuthBtn eventKey={["view_express_set"]} btnAuth={btnAuth} showPage>

	                <Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
	                    <TabPane tab={sldComLanguage('快递鸟配置')} key="1">
	                        {showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
	                        {getSldEmptyH(8)}
	                        <div className={`${global.flex_com_column}`}>
	                            {kdn_flag == 1 &&
								<SldTableEdit
								    submiting={submitting}
								    width={1000}
								    data={kdn_set_data}
								    handleSubmit={this.handleSubmit}
								    noSaveBtnAuth={!hasAuth('edit_express_set')}
								/>
	                            }
	                        </div>
	                    </TabPane>
	                </Tabs>

	                </AuthBtn>
	            </div>
	        </Spin>
	    );
	}
}
