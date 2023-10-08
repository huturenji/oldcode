import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
    sldLlineRtextAddGoodsAddMargin,
    getSldEmptyH, sldComLanguage, getAuthBtn, hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import AdvertList from './advert_list';
import MemberMsgTplList from '../msg/member_msg_tpl_list';
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
            tab1Auth: "view_adv_push",
            tab2Auth: "view_push_all",
            sld_show_tip: true,//是否显示页面提示，默认显示
            submitting: false,//提交按钮加载状态
            initLoading: false,//页面初始化加载状态
            activeTabKey: 'advert',//默认会员消息模板
            noticeType: 'multiple'//消息模板类型
        };
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

    getChildren = (ref) => {
        this.memberRef = ref
    }

    render() {
        const { initLoading, noticeType, tab1Auth, tab2Auth } = this.state;
        return (
            <Spin spinning={initLoading}>
                <div className={global.common_page}>
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('广告推送管理')}`, 0, 0, 10)}
                    <AuthBtn eventKey={[tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>
                        <Tabs onChange={(key) => this.changeSldTab(key)} type="card">
                            {
                                hasAuth(tab1Auth) &&
                                <TabPane tab={`${sldComLanguage('广告推送')}`} key="advert">
                                    {getSldEmptyH(8)}
                                    <AdvertList />
                                </TabPane>
                            }
                            {
                                hasAuth(tab2Auth) &&

                                <TabPane tab={`${sldComLanguage('全员推送管理')}`} key="member">
                                    {getSldEmptyH(8)}
                                    <MemberMsgTplList noticeType={noticeType} onRef={this.getChildren} />
                                </TabPane>
                            }
                        </Tabs>

                    </AuthBtn>
                </div>
            </Spin>
        );
    }
}
