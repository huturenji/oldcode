import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage, sldLlineRtextAddGoodsAddMargin, getSession, removeSession, getAuthBtn, hasAuth } from '@/utils/utils';
import global from '@/global.less';
import Setting from './components/setting';
import RedPacketList from './components/red_packet_list';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class RedPacketHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth:"view_redpacket",
            tab2Auth:"view_redpacket_set",
            tabActiveKey:"1"//动态设置Tab选中值
        };
    }

    componentDidMount() {
        const {tab1Auth } = this.state;
        if(hasAuth(tab1Auth)){
            this.setState({tabActiveKey: '1'});
        }else{
            this.setState({tabActiveKey: '2'});
        }

        //从优惠券详情返回来的，默认选中Tab2
        if(getSession('redpacket_detail_back')){
            removeSession('redpacket_detail_back')
            this.setState({tabActiveKey: '1'});
        }
    }
  
  onchagetab = (key)=>{
      this.setState({tabActiveKey: key});
  }

  render() {
      const {tabActiveKey,tab1Auth,tab2Auth } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('红包')}`, 0, 0, 10)}
              <AuthBtn eventKey={[tab1Auth,tab2Auth]} btnAuth={btnAuth} showPage>

                  <Tabs type="card" activeKey={tabActiveKey} animated={false} onChange={this.onchagetab} onTabClick={this.onHandleTabClick}>
                      {hasAuth(tab1Auth) &&
                  <TabPane tab={`${sldComLanguage('红包活动')}`} key="1">
                      <RedPacketList />
                  </TabPane>
                      }
                      {hasAuth(tab2Auth) &&
                  <TabPane tab={`${sldComLanguage('红包设置')}`} key="2">
                      <Setting />
                  </TabPane>
                      }
                  </Tabs>

              </AuthBtn>

          </div>

      );
  }
}
