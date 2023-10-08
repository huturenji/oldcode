import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, getAuthBtn, hasAuth} from '@/utils/utils';
import global from '@/global.less';
import EvaluateGoods from './components/evaluate_goods';
import EvaluateStore from './components/evaluate_store';
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
            tab1Auth: "view_goods_comment",
            tab2Auth: "view_store_comment",
            sld_show_tip:true//是否显示页面提示，默认显示
        };
    }

    componentDidMount() {
        const { tab1Auth } = this.state;
        if(hasAuth(tab1Auth)){
            this.setState({ activeTabKey: '1' });
        }else {
            this.setState({ activeTabKey: '2' });
        }
    }

  //tab设置
  changeSldTab = (key) => {
      this.setState({
          activeTabKey: key
      }, () => {
      });
  };

  render() {
      const { activeTabKey, tab1Auth, tab2Auth } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('评价管理')}`, 0, 0, 10)}{/*评价管理*/}
              <AuthBtn eventKey={[tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>

                  <Tabs type="card" activeKey={activeTabKey} animated={false} onChange={(key) => this.changeSldTab(key)}>
                      {hasAuth(tab1Auth) &&
                  <TabPane
                      tab={`${sldComLanguage('商品评价')}`
                      }
                      key="1"
                  >{/* 商品评价 */}
                      <EvaluateGoods />
                  </TabPane>
                      }
                      {hasAuth(tab2Auth) &&
                  <TabPane
                      tab={`${sldComLanguage('店铺评价')}`
                      }
                      key="2"
                  >{/* 店铺评价 */}
                      <EvaluateStore />
                  </TabPane>
                      }
                  </Tabs>

              </AuthBtn>

          </div>
      );
  }
}
