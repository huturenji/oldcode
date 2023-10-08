import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage, sldLlineRtextAddGoodsAddMargin,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import EvaluateGoods from './evaluate_goods';
import EvaluateStore from './evaluate_store';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class Evaluation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sld_show_tip: true//是否显示页面提示，默认显示
        };
    }

    componentDidMount() {
    }

  handleToggleTip = () => {
      let {sld_show_tip} = this.state
      this.setState({
          sld_show_tip: !sld_show_tip
      });
  };

  render() {
      return (
          <div className={global.common_page} style={{ flex: 1}}>
              <AuthBtn btnAuth={btnAuth} eventKey={["evaluation_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('评价管理')}`, 0, 0, 10)}
                  <Tabs type="card" defaultActiveKey="1" animated={false} onTabClick={this.onHandleTabClick}>
                      <TabPane tab={`${sldComLanguage('商品评价')}`} key="1">
                          <EvaluateGoods />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('店铺评价')}`} key="2">
                          <EvaluateStore />
                      </TabPane>
                  </Tabs>

              </AuthBtn>
          </div>

      );
  }
}
