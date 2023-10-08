import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin ,sldComLanguage, getAuthBtn, hasAuth } from '@/utils/utils';
import global from '@/global.less';
import SettledStoreListData from './components/settled_store_list_data';
import ApplyStoreList from './components/apply_store_list';
import ApplyCategoryList from './components/apply_category_list';
import SettledStoreListWillExpiredData from './components/settled_store_list_will_expired_data';
import SettledStoreReNewList from './components/settled_store_renew_list';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class GoodsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            tab1Auth: "view_settle_store",
            tab2Auth: "view_expiry",
            tab3Auth: "view_audit_settle_store",
            tab4Auth: "view_store_renew",    
            tab5Auth: "view_cate_audit", 
            activeTabKey: '1',
            sld_show_tip:true,//是否显示页面提示，默认显示
            updateFlag:''//更新数据标识 1:入驻店铺列表 2 临效期店铺 3 入驻审核 4 续签管理 5 经营类目审核
        };
    }

    componentDidMount() {
    //获取浏览器参数
        const {query,tab2Auth,tab3Auth,tab1Auth,tab4Auth} = this.state;
        if(hasAuth(tab1Auth)){
            this.setState({ activeTabKey: '1' });
        }else if(hasAuth(tab2Auth)){
            this.setState({ activeTabKey: '2' });
        }else if(hasAuth(tab3Auth)){           
            this.setState({ activeTabKey: '3' });
        }else if(hasAuth(tab4Auth)){           
            this.setState({ activeTabKey: '4' });            
        }else{
            this.setState({ activeTabKey: '5' });
        }

        if(query!=undefined&&query.tab == 'check'){
            this.setState({activeTabKey:'3'})
        }
    }

  setUpdateFlag = (flag) => {
      this.setState({updateFlag:flag})
  }

  handleToggleTip = () => {
      let {sld_show_tip} = this.state
      this.setState({
          sld_show_tip:!sld_show_tip
      });
  }

  //tab设置
  onHandleTabClick = (key) => {
      this.setState({
          activeTabKey: key
      });
  };

  render() {
      const {updateFlag,activeTabKey,tab3Auth,tab4Auth, tab1Auth, tab2Auth, tab5Auth} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('入驻店铺管理')}`, 0, 0, 5)}
              <AuthBtn eventKey={[tab3Auth,tab4Auth, tab1Auth, tab2Auth,tab5Auth]} btnAuth={btnAuth} showPage>
                  <Tabs type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
                      {
                          hasAuth(tab1Auth) &&
                  <TabPane tab={`${sldComLanguage('入驻店铺列表')}`} key="1">
                      <SettledStoreListData updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                  </TabPane>
                      }
                      {
                          hasAuth(tab2Auth) &&
                  <TabPane tab={`${sldComLanguage('临效期店铺')}`} key="2">
                      <SettledStoreListWillExpiredData />
                  </TabPane>
                      }
                      { hasAuth(tab3Auth) &&
                  <TabPane tab={`${sldComLanguage('入驻审核')}`} key="3">
                      <ApplyStoreList />
                  </TabPane>
                      }
                      { hasAuth(tab4Auth) &&
                  <TabPane tab={`${sldComLanguage('续签管理')}`} key="4">
                      <SettledStoreReNewList />
                  </TabPane>
                      }
                      { hasAuth(tab5Auth) &&
                  <TabPane tab={`${sldComLanguage('经营类目审核')}`} key="5">
                      <ApplyCategoryList updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                  </TabPane>
                      }
                  </Tabs>
              </AuthBtn>
          </div>
      );
  }
}
