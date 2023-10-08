import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import { showMoreHelpTip, getSldEmptyH, sldComLanguage, getAuthBtn, hasAuth } from '@/utils/utils';
import global from '@/global.less';
import GoodsOnlineLists from './goods_online_lists';
import GoodsCheckLists from './goods_check_lists';
import GoodsStorageLists from './goods_storage_lists';
import GoodsOfflineLists from './goods_offline_lists';
import SldComHeader from '@/components/SldComHeader';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const goodsTip = [`${sldComLanguage('商品只有在审核通过才能正常出售。商品是否需审核可以在“商品设置”中配置。违规下架或审核失败的商品，商家只能重新编辑后才能够进行出售。在售列表搜索条件：商品名称、sku、供应商sku不能同时为空！')}`];
const checkGoodsTip = [`${sldComLanguage('在“商品设置”中，开启商品审核后，商家发布、编辑商品需要管理员审核才能正常销售。')}`, `${sldComLanguage('审核状态分为：审核通过、等待审核和审核失败三种状态，审核失败后请详细填写审核失败原因方便商家修改。')}`];
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
            tab1Auth: "view_on_sale",
            tab2Auth: "view_on_audit",
            tab3Auth: "view_on_store",
            tab4Auth: "view_offline",            
            activeTabKey: 'online',
            scroll_h: 42,
            sld_show_tip: true,//是否显示页面提示，默认显示
            updateFlag: ''//更新数据标识 online:在售商品 check 待审核 storage 仓库中 offline 违规下架
        };
    }

    componentDidMount() {
    //获取浏览器参数
        const { query ,tab2Auth,tab3Auth,tab1Auth} = this.state;
        if(hasAuth(tab1Auth)){
            this.setState({ activeTabKey: 'online' });
        }else if(hasAuth(tab2Auth)){
            this.setState({ activeTabKey: 'check' });
        }else if(hasAuth(tab3Auth)){           
            this.setState({ activeTabKey: 'storage' });
        }else{
            this.setState({ activeTabKey: 'offline' });
        }

        if (query != undefined && query.tab == 'check') {
            this.setState({ activeTabKey: 'check' });
        }
    }

  handleToggleTip = (e) => {
      let { activeTabKey,sld_show_tip } = this.state;
      this.setState({
          scroll_h: e ? (activeTabKey == 'online' ? 42 : 64) : (activeTabKey == 'online' ? 0 : -10),
          // eslint-disable-next-line react/no-access-state-in-setstate
          sld_show_tip: !sld_show_tip
      });
  };

  setUpdateFlag = (flag) => {
      this.setState({ updateFlag: flag });
  };

  onHandleTabClick = (e) => {
      let { scroll_h } = this.state;
      this.setState({ scroll_h: e == 'online' ? (scroll_h > 0 ? 42 : 0) : (scroll_h > 0 ? 64 : -10), activeTabKey: e });
  };

  render() {
      const { sld_show_tip, updateFlag, scroll_h, activeTabKey, tab1Auth, tab2Auth,tab3Auth, tab4Auth } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <SldComHeader
                  type={1}
                  title={`${sldComLanguage('商品管理')}`}//商品管理
                  handleToggleTip={this.handleToggleTip}
              />
              {getSldEmptyH(8)}
              <AuthBtn eventKey={[tab3Auth,tab4Auth, tab1Auth, tab2Auth]} btnAuth={btnAuth} showPage>

                  <Tabs type="card" activeTabKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
                      {
                          hasAuth(tab1Auth) &&
                  <TabPane tab={`${sldComLanguage('在售列表')}`} key="online">{/* 在售列表 */}
                      {showMoreHelpTip(``, goodsTip, 8, sld_show_tip)}{/*操作提示*/}
                      <GoodsOnlineLists updateFlag={updateFlag} scroll_h={scroll_h} setUpdateFlag={this.setUpdateFlag} />
                  </TabPane>
                      }
                      {
                          hasAuth(tab2Auth) &&
                  <TabPane tab={`${sldComLanguage('待审核商品')}`} key="check">
                      {showMoreHelpTip(``, checkGoodsTip, 8, sld_show_tip)}
                      <GoodsCheckLists updateFlag={updateFlag} scroll_h={scroll_h} setUpdateFlag={this.setUpdateFlag} />
                  </TabPane>
                      }
                      {
                          hasAuth(tab3Auth) &&
                  <TabPane tab={`${sldComLanguage('仓库中商品')}`} key="storage">
                      <GoodsStorageLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                  </TabPane>
                      }

                      {
                          hasAuth(tab4Auth) &&
                  <TabPane tab={`${sldComLanguage('违规下架商品')}`} key="offline">{/* 违规下架商品 */}
                      <GoodsOfflineLists updateFlag={updateFlag} setUpdateFlag={this.setUpdateFlag} />
                  </TabPane>
                      }
                  
                  </Tabs>
              </AuthBtn>

          </div>

      );
  }
}
