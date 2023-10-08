import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { getSldEmptyH,sldLlineRtextAddGoodsAddMargin,sldComLanguage, getAuthBtn, hasAuth } from '@/utils/utils';
import global from '@/global.less';
import PresaleLists from './components/presale_lists';
import PresaleListsAll from './components/presale_lists_all';
import LabelLists from './components/label_lists';
import Setting from './components/setting';
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
            tab1Auth:"view_part_presale",
            tab2Auth:"view_full_presale",
            tab3Auth:"view_presale_lab",
            tab4Auth:"view_presale_set"
        };
    }

    componentDidMount() {
    }

    render() {
        const {tab1Auth, tab2Auth, tab3Auth, tab4Auth} = this.state
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', '预售', 0)}
                {getSldEmptyH(8)}
                <AuthBtn eventKey={[tab1Auth,tab2Auth,tab3Auth,tab4Auth]} btnAuth={btnAuth} showPage>

                    <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
                        {hasAuth(tab1Auth) &&
                    <TabPane tab={sldComLanguage('定金预售')} key="1">
                        <PresaleLists />
                    </TabPane>
                        }
                        {hasAuth(tab2Auth) &&
                    <TabPane tab={sldComLanguage('全款预售')} key="2">
                        <PresaleListsAll />
                    </TabPane>
                        }
                        {hasAuth(tab3Auth) &&
                    <TabPane tab={sldComLanguage('活动标签')} key="3">
                        <LabelLists />
                    </TabPane>
                        }
                        {hasAuth(tab4Auth) &&
                    <TabPane tab={sldComLanguage('预售设置')} key="4">
                        <Setting />
                    </TabPane>
                        }
                    </Tabs>

                </AuthBtn>

            </div>
        );
    }
}
