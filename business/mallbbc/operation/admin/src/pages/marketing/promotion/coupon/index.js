import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage, sldLlineRtextAddGoodsAddMargin, getSession, removeSession ,getAuthBtn, hasAuth} from '@/utils/utils';
import global from '@/global.less';
import Setting from './components/setting';
import SystemLists from './components/system_lists';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth:"view_coupon_set",
            tab2Auth:"view_coupon",
            tabActiveKey:"1"//动态设置Tab选中值
        };
    }

    componentDidMount() {
        const {tab1Auth} = this.state
        //从优惠券详情返回来的，默认选中Tab2
        if(getSession('coupon_detail_back')){
            removeSession('coupon_detail_back')
            this.setState({tabActiveKey: '2'});
        }else if(!hasAuth(tab1Auth)){
            //没有 优惠券设置 的 权限码，那默认选中2
            this.setState({tabActiveKey: '2'});
        }
    }
  
  onchagetab = (key)=>{
      this.setState({tabActiveKey: key});
  }

  render() {
      const {tabActiveKey, tab1Auth, tab2Auth} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('优惠券管理')}`, 0, 0, 10)}
              <AuthBtn eventKey={[tab1Auth,tab2Auth]} btnAuth={btnAuth} showPage>
                  <Tabs type="card" activeKey={tabActiveKey} animated={false} onChange={this.onchagetab} onTabClick={this.onHandleTabClick}>
                      {
                          hasAuth(tab1Auth) &&
                        <TabPane tab={`${sldComLanguage('优惠券设置')}`} key="1">
                            <Setting />
                        </TabPane>
                      }                      

                      {
                          hasAuth(tab2Auth) &&
                        <TabPane tab={`${sldComLanguage('平台优惠券')}`} key="2">
                            <SystemLists />
                        </TabPane>
                      }
                  </Tabs>
              </AuthBtn>

          </div>

      );
  }
}
