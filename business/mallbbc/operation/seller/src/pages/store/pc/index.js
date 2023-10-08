import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import DiyLists from './diy_lists';
import TplLists from './tpl_lists';
import InstanceTemplateLists from './instance_template_lists';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class StorePCDiyIndex extends Component {
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
              <AuthBtn btnAuth={btnAuth} eventKey={["template_view","instantiate_view","decorate_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('PC装修')}`, 0, 0, 10)}
                  <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                      <TabPane tab={`${sldComLanguage('模板列表')}`} key="1">
                          <TplLists />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('实例化模板')}`} key="2">
                          <InstanceTemplateLists />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('首页装修')}`} key="3">
                          <DiyLists />
                      </TabPane>
                  </Tabs>
              </AuthBtn>
          </div>
      );
  }
}
