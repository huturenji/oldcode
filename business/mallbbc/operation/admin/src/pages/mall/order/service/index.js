import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tabs } from 'antd';
import {
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import AfterSalesLists from './components/aftersales_lists';
import ExchangeLists from './components/exchange_lists';
import RepairLists from './components/repair_lists';
import AftersalesCheckLists from './components/aftersales_check_lists';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sld_show_tip: true,//是否显示页面提示，默认显示
            submitting: false,//提交按钮加载状态
            initLoading: false,//页面初始化加载状态
            tab1Auth: "view_return_goods",
            tab2Auth: "view_exchange_goods",
            tab3Auth: "view_repair",
            tab4Auth: "view_refund_audit",    
            activeTabKey: '1',
            updateFlag:''//更新数据标识 1:售后列表 2 退款审核
        };
    }

    componentDidMount() {
        const { tab2Auth,tab3Auth,tab1Auth} = this.state;
        if(hasAuth(tab1Auth)){
            this.setState({ activeTabKey: '1' });
        }else if(hasAuth(tab2Auth)){
            this.setState({ activeTabKey: '2' });
        }else if(hasAuth(tab3Auth)){           
            this.setState({ activeTabKey: '3' });
        }else{
            this.setState({ activeTabKey: '4' });
        }
    }

    componentWillUnmount() {

    }

  setUpdateFlag = (flag) => {
      this.setState({updateFlag:flag})
  }

  //tab设置
  changeSldTab = (key) => {
      this.setState({
          activeTabKey: key
      }, () => {
      });
  };

  render() {
      const { initLoading, activeTabKey,updateFlag,tab3Auth,tab4Auth, tab1Auth, tab2Auth } = this.state;
      return (
          <Spin spinning={initLoading}>
              <div className={global.common_page}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('售后管理')}`, 0, 0, 10)}{/*售后管理*/}
                  <AuthBtn eventKey={[tab3Auth,tab4Auth, tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>

                      <Tabs activeKey={activeTabKey} onChange={(key) => this.changeSldTab(key)} type="card">
                          { hasAuth(tab1Auth) &&
                      <TabPane tab={`${sldComLanguage('退货')}`} key="1">{/*退货退款*/}
                          <AfterSalesLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                      </TabPane>
                          }
                          { hasAuth(tab2Auth) &&
                      <TabPane tab={`${sldComLanguage('换货')}`} key="2">{/*换货*/}
                          <ExchangeLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                      </TabPane>
                          }
                          { hasAuth(tab3Auth) &&
                      <TabPane tab={`${sldComLanguage('维修')}`} key="3">{/*维修*/}
                          <RepairLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                      </TabPane>
                          }
                          { hasAuth(tab4Auth) &&
                      <TabPane tab={`${sldComLanguage('退款审核')}`} key="4">{/*退款审核*/}
                          <AftersalesCheckLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                      </TabPane>
                          }
                      </Tabs>

                  </AuthBtn>
              </div>
          </Spin>
      );
  }
}
