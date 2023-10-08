import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage,hasAuth,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import GoodsOnlineLists from './goods_online_lists';
import GoodsOfflineLists from './goods_offline_lists';
// import GoodsCheckLists from './goods_check_lists';
// import GoodsStorageLists from './goods_storage_lists';
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
            activeKey: '1',
            updateFlag:''
        };
    }

    componentDidMount() {
        if(this.props.location.query.tab!=undefined&&this.props.location.query.tab){
            this.setState({activeKey:this.props.location.query.tab})
        }
    }

  setUpdateFlag = (flag) => {
      this.setState({ updateFlag: flag });
  };

  onHandleTabClick = (e) => {
      this.setState({activeKey:e})
  }

  render() {
      const {activeKey,updateFlag} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["goods_list_offLine_view","goods_list_onLine_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('商品管理')}`, 0, 0, 10)}
                  <Tabs type="card" activeKey={activeKey} animated={false} onTabClick={this.onHandleTabClick}>
                      {hasAuth('goods_list_onLine_view')&&
                          <TabPane tab={`${sldComLanguage('在售商品')}`} key="1">{/* 在售商品 */}
                              <GoodsOnlineLists setUpdateFlag={this.setUpdateFlag} />
                          </TabPane>

                      }
                      {/*<TabPane tab={`${sldComLanguage('仓库中商品')}`} key="2">*/}
                      {/*  <GoodsStorageLists/>*/}
                      {/*</TabPane>*/}
                      {/*<TabPane tab={`${sldComLanguage('待审核商品')}`} key="3">*/}
                      {/*  <GoodsCheckLists/>*/}
                      {/*</TabPane>*/}
                      {hasAuth('goods_list_offLine_view')&&
                          <TabPane tab={`${sldComLanguage('违规下架商品')}`} key="4">
                              <GoodsOfflineLists setUpdateFlag={this.setUpdateFlag} updateFlag={updateFlag} />
                          </TabPane>
                      }
                  </Tabs>
              </AuthBtn>


          </div>

      );
  }
}
