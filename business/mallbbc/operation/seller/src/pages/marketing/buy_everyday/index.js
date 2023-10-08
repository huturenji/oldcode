import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Empty, Form, Tabs } from 'antd';
import { sldLlineRtextAddMargin,sldComLanguage,getSldEmptyH,getSession,removeSession,getAuthBtn } from '@/utils/utils';
import global from '@/global.less';
import _styles from './index.less';
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
            enableFlag:1, //一起买活动开关，默认开启
            tabActiveKey: '1'
        };
    }

    componentDidMount() {
        if(getSession('togetherBuy_detail_back')){
            let active = getSession('togetherBuy_detail_back')
            removeSession('togetherBuy_detail_back')
            this.setState({tabActiveKey: active});
        } 
        // this.getSetting();   一起买开关暂时没有配置
    }

    onHandleTabClick = (e) => {
        this.setState({tabActiveKey:e})
    }

    //获取系统配置(一起买活动是否开启，一起买开关暂时没有配置，预留)
    //   getSetting = () => {
    //       const { dispatch } = this.props;
    //       dispatch({
    //           type: 'common/getSetting',
    //           payload: {str:'group_buy_is_enable'},
    //           callback: (res) => {
    //               if (res.state == 200) {
    //                   this.setState({enableFlag:res.data[0].value})
    //               }
    //           }
    //       });
    //   };

    render() {
        const {enableFlag,tabActiveKey} = this.state;
        return (
            <AuthBtn eventKey={['buy_everyday_unattend_view','buy_everyday_attend_view','buy_everyday_audit_view']} btnAuth={btnAuth} showPage>
                <div className={global.common_page} style={{ flex: 1 }}>
                    {sldLlineRtextAddMargin('#FA6F1E', `${sldComLanguage('天天专场')}`, 0, 0, 10)}
                    {/* <div className={`${_styles['attention']}`}>
                    <div className={`${_styles['attention_item']}`}>1、一起买是一种由平台发起的团购活动，商户提供参与活动的商品，用户以团购价购买活动商品；</div>
                    <div className={`${_styles['attention_item']}`}>2、每款商品在每个活动场次中有且仅有 1 个团购，场次开始时用户可以随时购买商品加入团购，或取消订单退出团购，待场次结束时根据最终团购件数是否达到实际成团件数判断团购成功或失败，成功则发货，失败则原路退回实付款项；</div>
                    <div className={`${_styles['attention_item']}`}>3、每款商品可以同时参加多个一起买活动，但相同活动日期内只能参加其中一个活动场次，且该活动日期内其不可再参与其他活动（如秒杀活动）；</div>
                    <div className={`${_styles['attention_item']}`}>4、用户购买一起买商品的待付款订单，订单生成后15分钟内未完成支付的由系统自动取消该订单；</div>
                </div> */}
                    {
                        enableFlag == 1&&
                    <Tabs type="card" activeKey={tabActiveKey} animated={false} onTabClick={this.onHandleTabClick}>
                        <TabPane tab={`${sldComLanguage('天天专场')}`} key="1">
                            <ALLList />
                        </TabPane>
                        <TabPane tab={`${sldComLanguage('已参加专场')}`} key="2">
                            <JoinedList />
                        </TabPane>
                        <TabPane tab={`${sldComLanguage('活动审核')}`} key="3">
                            <ReviewList />
                        </TabPane>                        
                    </Tabs>
                    }
                    {
                        enableFlag == 2&&
                    <Fragment>
                        {getSldEmptyH(150)}
                        <Empty
                            image={require('@/assets/moudle_disable.png')}
                            imageStyle={{
                                height: 80
                            }}
                            description={
                                <span>{sldComLanguage('天天专场活动模块暂未开启')}</span>
                            }
                        />
                    </Fragment>
                    }
                </div>
            </AuthBtn>
        );
    }
}
