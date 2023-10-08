import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoods,sldIconBtnBg } from '@/utils/utils';
import global from '@/global.less';
import View from './components/view';
import ActivityStat from './components/activity_stat';


const TabPane = Tabs.TabPane;
@connect(({ sign_manage }) => ({
    sign_manage
}))
@Form.create()
export default class SignStat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query
        };
    }

    componentDidMount() {
    }

    render() {
        const { query } = this.state;
        return (
            <div className={global.common_page} style={{ flex: 1 }}>
                <div className={global.flex_com_space_between}>
                    {sldLlineRtextAddGoods('#FA6F1E', `签到活动详情`)}
                    {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `返回上级页面`, '#fff', 7, 0, 15, 15, 5)}
                </div>
                <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
                    <TabPane tab="活动详情" key="1">
                        <View queryparams={query} />
                    </TabPane>
                    <TabPane tab="签到记录" key="2">
                        <ActivityStat queryparams={query} />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
