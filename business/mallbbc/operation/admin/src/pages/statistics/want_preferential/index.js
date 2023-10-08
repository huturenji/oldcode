import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { getSldEmptyH, sldLlineRtextAddGoodsAddMargin, sldComLanguage, getAuthBtn, hasAuth } from '@/utils/utils';
import global from '@/global.less';
import WantPreferentialUser from './want_preferential_user';
import WantPreferentialSku from './want_preferential_sku';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();

const TabPane = Tabs.TabPane;
@connect(({ seckill }) => ({
    seckill
}))
@Form.create()
export default class Lists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth: "view_want_pref_by_user",
            tab2Auth: "view_want_pref_by_sku"
        };
    }

    componentDidMount() {
        const { tab1Auth } = this.state;
        if (hasAuth(tab1Auth)) {
            this.setState({ activeKey: '1' });
        } else {
            this.setState({ activeKey: '2' });
        }
    }

    onHandleTabClick = (e) => {
        this.setState({activeKey:e})
    }
    
    render() {
        const { activeKey, tab1Auth, tab2Auth } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('要优惠统计')}`, 0)}
                {getSldEmptyH(8)}
                <AuthBtn eventKey={[tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>

                    <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                        {hasAuth(tab1Auth) &&
                            <TabPane tab={`${sldComLanguage('按用户维度')}`} key="1">{/* 秒杀活动 */}
                                <WantPreferentialUser />
                            </TabPane>
                        }
                        {hasAuth(tab2Auth) &&
                            <TabPane tab={`${sldComLanguage('按sku维度')}`} key="2">{/*秒杀标签 */}
                                <WantPreferentialSku />
                            </TabPane>
                        }
                    </Tabs>

                </AuthBtn>

            </div>

        );
    }
}
