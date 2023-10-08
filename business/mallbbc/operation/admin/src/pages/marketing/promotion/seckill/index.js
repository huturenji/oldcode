import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { getSldEmptyH, sldLlineRtextAddGoodsAddMargin, sldComLanguage,getAuthBtn,hasAuth } from '@/utils/utils';
import global from '@/global.less';
import SeckillLists from './components/seckill_lists';
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
            tab1Auth:"view_seckill",
            tab2Auth:"view_seckill_label",
            tab3Auth:"view_seckill_set"
        };
    }

    componentDidMount() {
    }

    render() {
        const {tab1Auth, tab2Auth, tab3Auth} = this.state
        return (
            <AuthBtn eventKey={[tab1Auth,tab2Auth,tab3Auth]} btnAuth={btnAuth} showPage>
                <div className={global.common_page} style={{ flex: 1 }}>
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('秒杀活动')}`, 0)}
                    {getSldEmptyH(8)}
                    <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
                        { 
                            hasAuth(tab1Auth) &&
                            <TabPane tab={`${sldComLanguage('秒杀活动')}`} key="1">{/* 秒杀活动 */}
                                <SeckillLists />
                            </TabPane>                            
                        }

                        {
                            hasAuth(tab2Auth) &&
 
                            <TabPane tab={`${sldComLanguage('秒杀标签')}`} key="2">{/*秒杀标签 */}
                                <LabelLists />
                            </TabPane>                        
                        }

                        {
                            hasAuth(tab3Auth) &&

                            <TabPane tab={`${sldComLanguage('秒杀设置')}`} key="3">{/*秒杀设置 */}
                                <Setting />
                            </TabPane>                        
                        }
                       
                    </Tabs>

                </div>
            </AuthBtn>
        );
    }
}
