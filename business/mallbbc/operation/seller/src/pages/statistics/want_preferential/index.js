import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { getSldEmptyH, sldLlineRtextAddGoodsAddMargin, sldComLanguage ,getAuthBtn} from '@/utils/utils';
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
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                <AuthBtn btnAuth={btnAuth} eventKey={["want_preferential_view"]} showPage>
                    {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('要优惠统计')}`, 0)}
                    {getSldEmptyH(8)}
                    <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
                        <TabPane tab={`${sldComLanguage('按用户维度')}`} key="1">{/* 秒杀活动 */}
                            <WantPreferentialUser />
                        </TabPane>
                        <TabPane tab={`${sldComLanguage('按sku维度')}`} key="2">{/*秒杀标签 */}
                            <WantPreferentialSku />
                        </TabPane>
                    </Tabs>

                </AuthBtn>

            </div>

        );
    }
}
