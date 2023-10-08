import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch, Tabs } from 'antd';
import {
    failTip,
    sucTip,
    formItemLayoutModal,
    sldComLanguage,
    sldtbaleOpeBtnText,
    showMoreHelpTip,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import { sld_need_update_setting } from '@/utils/util_data';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import { getSldEmptyH } from '../../../../utils/utils';
import SldComHeader from '@/components/SldComHeader';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;

@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()
export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth: "view_pc_pay",
            tab2Auth: "view_mobie_pay",
            sld_show_tip:true,//是否显示页面提示，默认显示
            submiting: false,//提交按钮加载状态
            modalVisible: false,
            initLoading: false,//页面初始化加载状态
            mobile_data: {},
            curData: {},//当前编辑的对象信息
            pc_data: {},
            activeTabKey: '1',
            columns: [
                {
                    title: ' ',
                    dataIndex: 'id',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => index + 1
                },
                {
                    title: `${sldComLanguage('支付方式')}`,//支付方式
                    dataIndex: 'payment',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('启用状态')}`,//启用状态
                    dataIndex: 'value',
                    align: 'center',
                    width: 150,
                    render: (text, record) => <Switch
                        disabled={this.getBtnAuthSwitch()}
                        checked={text == 1 ? true : false}
									   onChange={(val) => this.handleSetEnable(record.name, val)}
                    />
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={this.getBtnAuthEdit()} btnAuth={btnAuth}>
                                {(record.name == 'balance_pay_is_enable_pc' || record.name == 'balance_pay_is_enable_h5') ?
                                    <span className={global.disableOperate}>--</span> :
                                    sldtbaleOpeBtnText(sldComLanguage('编辑'), () => this.editData(record))/*编辑*/
                                }
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ],
            title: '',
            addData: []//modal框的数据
        };
    }

    componentDidMount() {
		 btnAuth = getAuthBtn();
        this.get_pay_info('pc');
        this.get_pay_info('mobile');
    }

    componentWillUnmount() {

    }

	//获取支付配置信息
	editData = (val) => {
	    const { dispatch } = this.props;
	    let { addData, title } = this.state;
	    let dis_type = '';
	    addData = [];
	    if (val.name == 'alipay_is_enable_pc') {
	        //PC支付宝
	        dis_type = 'sldsetting/get_pc_alipay_info';
	    } else if (val.name == 'wxpay_is_enable_pc') {
	        //PC微信支付
	        dis_type = 'sldsetting/get_pc_weixin_info';
	    } else if (val.name == 'alipay_is_enable_h5') {
	        //支付宝移动支付
	        dis_type = 'sldsetting/get_alipay_mobile';
	    } else if (val.name == 'wxpay_is_enable_miniapp') {
	        //微信小程序支付
	        dis_type = 'sldsetting/get_wxpay_miniapp';
	    } else if (val.name == 'wxpay_is_enable_app') {
	        //微信app支付
	        dis_type = 'sldsetting/get_wxpay_app';
	    } else if (val.name == 'wxpay_is_enable_h5') {
	        //微信h5支付
	        dis_type = 'sldsetting/get_wxpay_h5';
	    }
	    title = `${sldComLanguage('编辑')}${ val.payment }${sldComLanguage('信息')}`;
	    dispatch({
	        type: dis_type,
	        callback: (res) => {
	            if (res.state == 200) {
	                for (let i = 0; i < res.data.length; i++) {
	                    if (res.data[i].type == 1) {
	                        addData.push({
	                            type: 'input',
	                            label: res.data[i].title,
	                            name: res.data[i].name,
	                            extra: res.data[i].description,
	                            placeholder: `${sldComLanguage('请输入')}${res.data[i].title}`,
	                            initialValue: res.data[i].value,
	                            maxLength: 50000, //目前该限制是用来解决 支付宝和微信配置公私钥的时候，限制字符250的问题
	                            rules: [{
	                                required: true,
                  					whitespace: true,
	                                message: `${sldComLanguage('该项必填')}`
	                            }]
	                        });
	                    }
	                }
	                this.setState({ addData, modalVisible: true, title, curData: val });
	            } else {
	                failTip(res.msg);
	            }
	        }
	    });

	};

	//获取支付列表
	get_pay_info = (type) => {
	    const { dispatch } = this.props;
	    let { mobile_data, pc_data } = this.state;
	    let dis_type = '';
	    if (type == 'pc') {
	        dis_type = 'sldsetting/get_pc_pay_info';
	    } else if (type == 'mobile') {
	        dis_type = 'sldsetting/get_mobile_pay_info';
	    }
	    dispatch({
	        type: dis_type,
	        callback: (res) => {
	            if (res.state == 200) {
	                if (type == 'pc') {
	                    pc_data.list = res.data;
	                } else if (type == 'mobile') {
	                    mobile_data.list = res.data;
	                }
	                this.setState({ mobile_data, pc_data });
	            }
	        }
	    });
	};

	//是否启用
	handleSetEnable = (name, val) => {
	    let { activeTabKey, pc_data, mobile_data } = this.state;
	    const { dispatch } = this.props;
	    this.setState({ initLoading: true });
	    dispatch({
	        type: 'project/saveSetting',
	        payload: {[name]:val ? 1 : 0 },
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                sucTip(res.msg);
	                if (activeTabKey == 1) {
	                    pc_data.list.forEach(item => {
	                        if (item.name == name) {
	                            item.value = val ? 1 : 0;
	                        }
	                    });
	                } else {
	                    mobile_data.list.forEach(item => {
	                        if (item.name == name) {
	                            item.value = val ? 1 : 0;
	                        }
	                    });
	                }
	                this.setState({ pc_data, mobile_data });
	            } else {
	                failTip(res.msg);
	            }
	        }
	    });
	};

	sldHandleCancle = () => {
	    this.setState({ modalVisible: false });
	};

	sldHandleConfirm = (val) => {
	    const { dispatch } = this.props;
	    this.setState({ submiting: true });
	    dispatch({
	        type: 'project/saveSetting',
	        payload: val,
	        callback: (res) => {
	            if (res.state == 200) {
	                sucTip(res.msg);
	                this.setState({
	                    modalVisible: false
	                });
	            } else {
	                failTip(res.msg);
	            }
	            this.setState({ submiting: false });
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


	getBtnAuthSwitch = () =>{
	    const {activeTabKey} = this.state
	    return	activeTabKey == '1' && !hasAuth('switch_pc_pay') || activeTabKey == '2' && !hasAuth('switch_mobie_pay')
	}

	getBtnAuthEdit = () =>{
	    const {activeTabKey} = this.state
	    return activeTabKey == '1' ? ['edit_pc_pay'] : ['edit_mobie_pay']
		
	}

	render() {
	    const { submiting, initLoading, mobile_data, pc_data, columns, title, modalVisible, addData,sld_show_tip, tab1Auth,tab2Auth } = this.state;
	    return (

	        <div className={global.common_page}>
	            <SldComHeader
	                type={1}
	                title={`${sldComLanguage('支付设置')}`}
	                handleToggleTip={()=>this.handleToggleTip()}
	            />
	            {getSldEmptyH(10)}
	            <AuthBtn eventKey={[tab1Auth,tab2Auth]} btnAuth={btnAuth} showPage>
	            <Spin spinning={initLoading}>
	                <Tabs onChange={(key) => this.changeSldTab(key)} type="card">
	                        {
	                            hasAuth(tab1Auth) && 
	                    <TabPane tab={sldComLanguage('PC支付')} key="1">
	                        {showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
	                        {getSldEmptyH(8)}
	                        <StandardTable
	                            sldpagination={false}
	                            selectedRows={[]}
	                            data={pc_data}
	                            rowKey="payment"
	                            isCheck={false}
	                            columns={columns}
	                            onSelectRow={this.handleSelectRows}
	                            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'bottom')}
	                            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
	                            isColumnResize
	                        />
	                    </TabPane>
	                        }
	                        {
	                            hasAuth(tab2Auth) &&
	                    <TabPane tab={sldComLanguage('移动端支付')} key="2">
	                        {showMoreHelpTip(``, sld_need_update_setting(),8,sld_show_tip)}{/*操作提示*/}
	                        {getSldEmptyH(8)}
	                        <StandardTable
	                            sldpagination={false}
	                            selectedRows={[]}
	                            data={mobile_data}
	                            rowKey="payment"
	                            isCheck={false}
	                            columns={columns}
	                            onSelectRow={this.handleSelectRows}
	                            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'bottom')}
	                            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
	                            isColumnResize
	                        />
	                    </TabPane>
	                        }
	                </Tabs>
	            </Spin>

	            </AuthBtn>
	            {/*新增/编辑对话框-start*/}
	            <SldModal
	                title={title}
	                submiting={submiting}
	                width={600}
	                modalVisible={modalVisible}
	                sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
	                sldHandleCancle={this.sldHandleCancle}
	                formItemLayoutModal={formItemLayoutModal}
	                content={addData}
	            />
	            {/*新增/编辑对话框-end*/}
	        </div>

	    );
	}
}
