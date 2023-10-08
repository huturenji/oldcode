import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
// import RefundLists from './refund_lists';
import ReturnLists from './components/return_lists';
import ExchangeLists from './components/exchange_lists';
import RepairLists from './components/repair_lists';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class OrderServiceIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1'
        };
    }

    componentDidMount() {
        if(this.props.location.query.tab!=undefined&&this.props.location.query.tab){
            this.setState({activeKey:`${this.props.location.query.tab}`})
        }
    }

  onHandleTabClick = (e) => {
      this.setState({activeKey:e})
  }

  render() {
      const {activeKey} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["service_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('售后管理')}`, 0, 0, 10)}
                  <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                      {/* <TabPane tab={`${sldComLanguage('仅退款')}`} key="1">
                <RefundLists/>
              </TabPane> */}
                      <TabPane tab={`${sldComLanguage('退货')}`} key="1">
                          <ReturnLists />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('换货')}`} key="2">
                          <ExchangeLists />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('维修')}`} key="4">
                          <RepairLists />
                      </TabPane>
                  </Tabs>
              </AuthBtn>
          </div>
      );
  }
}
