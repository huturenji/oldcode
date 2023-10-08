import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
    sldLlineRtextAddGoodsAddMargin,
    getSldEmptyH, sldComLanguage,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import VendorMsgTplList from './vendor_msg_tpl_list';
import MemberMsgTplList from './member_msg_tpl_list';
import ImportMsgTplList from './import_msg_tpl_list';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()
export default class MsgTpl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth: "view_member_tpl",
            tab2Auth: "view_store_tpl",
            tab3Auth: "view_import_tpl",
            sld_show_tip: true,//是否显示页面提示，默认显示
            submitting: false,//提交按钮加载状态
            initLoading: false,//页面初始化加载状态
            activeTabKey: 'member',//默认会员消息模板
            noticeType: 'single'//消息模板类型
        };
        this.memberRef = null
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    //tab设置
    changeSldTab = (key) => {
        this.setState({
            activeTabKey: key
        }, () => {
        });
    };

    reGetList = () => {
        this.memberRef.get_list()
    }

    getChildren = (ref) => {
        this.memberRef = ref
    }

    render() {
        const { initLoading, noticeType, tab1Auth, tab2Auth, tab3Auth } = this.state;
        return (
            <Spin spinning={initLoading}>
                <div className={global.common_page}>
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('消息模板管理')}`, 0, 0, 10)}
                    <AuthBtn eventKey={[tab1Auth, tab2Auth, tab3Auth]} btnAuth={btnAuth} showPage>

                        <Tabs onChange={(key) => this.changeSldTab(key)} type="card">
                            {
                                hasAuth(tab1Auth) &&
                                <TabPane tab={`${sldComLanguage('会员消息模板')}`} key="member">
                                    {getSldEmptyH(8)}
                                    <MemberMsgTplList noticeType={noticeType} onRef={this.getChildren} />
                                </TabPane>
                            }
                            {
                                hasAuth(tab2Auth) &&
                                <TabPane tab={`${sldComLanguage('商户消息模板')}`} key="system">
                                    {getSldEmptyH(8)}
                                    <VendorMsgTplList tpl={2} />
                                </TabPane>
                            }
                            {
                                hasAuth(tab3Auth) &&
                                <TabPane tab={`${sldComLanguage('消息模板导入')}`} key="importmsg">
                                    {getSldEmptyH(8)}
                                    <ImportMsgTplList tpl={3} noticeType={noticeType} reGetList={this.reGetList} />
                                </TabPane>
                            }
                        </Tabs>

                    </AuthBtn>
                </div>
            </Spin>
        );
    }
}
