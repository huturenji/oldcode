import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Empty, Form, Tabs } from 'antd';
import { sldLlineRtextAddGoodsAddMargin,sldComLanguage,getSldEmptyH,getSession,removeSession,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import ALLList from './components/all_list';
import JoinedList from './components/joined_list';
import ReviewList from './components/review_list';
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
            isFirstLoading:true,
            enableFlag:0,//秒杀活动开关
            tabActiveKey: '1'
        };
    }

    componentDidMount() {
    //从优惠券详情返回来的，默认选中Tab2
        if(getSession('seckill_detail_back')){
            let active = getSession('seckill_detail_back')
            removeSession('seckill_detail_back')
            this.setState({tabActiveKey: active});
        }    
        this.getSetting();
    }

  onHandleTabClick = (e) => {
      this.setState({tabActiveKey:e})
  }

  //获取系统配置(秒杀活动是否开启)
  getSetting = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'common/getSetting',
          payload: {str:'seckill_is_enable'},
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({enableFlag:res.data[0].value,isFirstLoading:false})
              }
          }
      });
  };

  render() {
      const {isFirstLoading,enableFlag,tabActiveKey} = this.state;
      return (
          <AuthBtn eventKey={['seckill_unattend_view','seckill_attend_view','seckill_audit_view']} btnAuth={btnAuth} showPage>
              <div className={global.common_page} style={{ flex: 1 }}>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('秒杀活动管理')}`, 0, 0, 10)}
                  {
                      enableFlag == 1&&!isFirstLoading&&
                        <Tabs type="card" activeKey={tabActiveKey} animated={false} onTabClick={this.onHandleTabClick}>
                            <TabPane tab={`${sldComLanguage('秒杀活动')}`} key="1">
                                <ALLList />
                            </TabPane>
                            <TabPane tab={`${sldComLanguage('已参加活动')}`} key="4">
                                <JoinedList />
                            </TabPane>
                            <TabPane tab="活动审核" key="5">
                                <ReviewList />
                            </TabPane>
                        </Tabs>
                  }
                  {
                      enableFlag != 1&&!isFirstLoading&&
                        <Fragment>
                            {getSldEmptyH(150)}
                            <Empty
                                image={require('@/assets/moudle_disable.png')}
                                imageStyle={{
                                    height: 80
                                }}
                                description={
                                    <span>{sldComLanguage('秒杀活动模块暂未开启')}</span>
                                }
                            />
                        </Fragment>
                  }
              </div>
          </AuthBtn>
      );
  }
}
