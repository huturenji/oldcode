import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import ApplyDetail from './components/apply_detail';
import ApplyCategory from './components/apply_category';
import ApplyOpenTime from './components/apply_open_time';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1'
        };
    }

    componentDidMount() {
        if(this.props.location.query.tab!=undefined&&this.props.location.query.tab){
            this.setState({activeKey:this.props.location.query.tab})
        }
        //支付回调的话需要显示在申请续签页面
        if(document.location.href.indexOf('out_trade_no')>-1){
            this.setState({activeKey:'2'})
        }
    }

  onHandleTabClick = (e) => {
      this.setState({activeKey:e})
  }

  render() {
      const {activeKey} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["info_store_view","info_renew_view","info_bindCate_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('商品信息管理')}`, 0, 0, 10)}
                  <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                      <TabPane tab={`${sldComLanguage('店铺信息')}`} key="1">
                          <ApplyDetail />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('申请续签')}`} key="2">
                          <ApplyOpenTime />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('经营类目')}`} key="3">
                          <ApplyCategory />
                      </TabPane>
                  </Tabs>
              </AuthBtn>
          </div>

      );
  }
}
