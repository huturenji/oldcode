import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import {
    sldLlineRtextAddGoodsAddMargin,
    getSldEmptyH,
    getAuthBtn,
    hasAuth,
    sldComLanguage
} from '@/utils/utils';
import global from '@/global.less';
import ImportAdmin from './admin';
import ImportSeller from './seller';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;

@Form.create()
export default class AuthConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth: "/importAdminAuth",
            tab2Auth: "/importSellerAuth",
            activeTabKey: null//默认会员消息模板
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

    render() {
        const { tab1Auth, tab2Auth } = this.state;
        return (
            <div className={global.common_page}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('权限导入')}`, 0, 0, 10)}
                <AuthBtn eventKey={[`view${tab1Auth}`, `view${tab2Auth}`, tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>
                    <Tabs onChange={(key) => this.changeSldTab(key)} type="card">
                        {
                            hasAuth(tab1Auth) &&
                            <TabPane tab={`${sldComLanguage('平台端导入')}`} key="admin">
                                {getSldEmptyH(8)}
                                <ImportAdmin />
                            </TabPane>
                        }

                        {
                            hasAuth(tab2Auth) &&
                            <TabPane tab={`${sldComLanguage('商户端导入')}`} key="seller">
                                {getSldEmptyH(8)}
                                <ImportSeller />
                            </TabPane>
                        }
                    </Tabs>
                </AuthBtn>
            </div>
        );
    }
}
