import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldComLanguage, getSldEmptyH, sldLlineRtextAddGoodsAddMargin, getAuthBtn, hasAuth } from '@/utils/utils';
import global from '@/global.less';
import FullAcmList from './components/full_acm_list';
import FullAsmList from './components/full_asm_list';
import FullAldList from './components/full_ald_list';
import FullNldList from './components/full_nld_list';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class Discount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab1Auth:"view_full_acm",
            tab2Auth:"view_full_asm",
            tab3Auth:"view_full_ald",
            tab4Auth:"view_full_nld",
            activeKey: '1'
        };
    }

    componentDidMount() {
        const {tab1Auth,tab2Auth,tab3Auth} = this.state;
        if(hasAuth(tab1Auth)){
            this.setState({activeKey: '1'});
        }else if(hasAuth(tab2Auth)){
            this.setState({activeKey: '2'});
        }else if(hasAuth(tab3Auth)){           
            this.setState({activeKey: '3'});
        }else{
            this.setState({activeKey: '4'});
        }

        if(this.props.location.query.tab!=undefined&&this.props.location.query.tab){
            this.setState({activeKey:this.props.location.query.tab})
        }
    }

  onHandleTabClick = (e) => {
      this.setState({activeKey:e})
  }

  render() {
      const {activeKey,tab1Auth,tab2Auth,tab3Auth,tab4Auth} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('满优惠活动')}`, 0, 0, 10)}{/*满优惠活动*/}
              {getSldEmptyH(8)}
              <AuthBtn eventKey={[tab1Auth,tab2Auth,tab3Auth,tab4Auth]} btnAuth={btnAuth} showPage>

                  <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                      {hasAuth(tab1Auth) &&
                  <TabPane tab={`${sldComLanguage('每满减')}`} key="1">{/* 满减 */}
                      <FullAcmList />
                  </TabPane>
                      }
                      {
                          hasAuth(tab2Auth) &&
                  <TabPane tab={`${sldComLanguage('阶梯满减')}`} key="2">{/*阶梯满减 */}
                      <FullAsmList />
                  </TabPane>
                      }
                      {hasAuth(tab3Auth) &&
                  <TabPane tab={`${sldComLanguage('满N元折扣')}`} key="3">{/*满N元折扣 */}
                      <FullAldList />
                  </TabPane>
                      }
                      {
                          hasAuth(tab4Auth) &&
                  <TabPane tab={`${sldComLanguage('满N件折扣')}`} key="4">{/*满N件折扣 */}
                      <FullNldList />
                  </TabPane>
                      }
                  </Tabs>
              </AuthBtn>

          </div>

      );
  }
}
