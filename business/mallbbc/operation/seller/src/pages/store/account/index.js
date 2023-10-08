import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import AccountGroup from './group';
import AccountMember from './member';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class StoreAccountIndex extends Component {
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
    }

  onHandleTabClick = (e) => {
      this.setState({activeKey:e})
  }

  render() {
      const {activeKey} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["account_group_view","account_roles_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('账号管理')}`, 0, 0, 10)}
                  <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                      <TabPane tab={`${sldComLanguage('权限组')}`} key="1">
                          <AccountGroup />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('子账号管理')}`} key="2">
                          <AccountMember />
                      </TabPane>
                  </Tabs>
              </AuthBtn>
          </div>
      );
  }
}
