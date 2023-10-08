import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Radio, Tooltip as TooltipAntd, Spin, Select } from 'antd';
import moment from 'moment';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import {
    sldLlineRtextAddGoodsAddMargin,
    failTip,
    sldComLanguage, getSldHorLineBgColor, sldSvgIcon, formatNum, getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import SldScrollbars from '@/components/SldScrollbars';
import SldStatDate from '@/components/SldStatDate';
import FlowOther from './flow_other';
import AuthBtn from '@/components/AuthBtn';

const { Option } = Select;
let btnAuth = getAuthBtn();

TweenOne.plugins.push(Children);
@connect(({ statistics }) => ({
    statistics
}))
@Form.create()

export default class StatisticsFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadedFlag: false,//顶部数据是否加载完成
            overViewLoading: false,//总览数据loading
            flowOverviewData: [
                {
                    children: [
                        {
                            label: `${sldComLanguage('访问人数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，商城所有访问页面的去重人数总和')}`,
                            mapValue: 'visitorNum',
                            mapDifferentValue: 'previousVisitorNum'
                        },
                        {
                            label: `${sldComLanguage('访问次数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，商城所有页面被访问的次数总和')}`,
                            mapValue: 'viewNum',
                            mapDifferentValue: 'previousViewNum'
                        },
                        {
                            label: `${sldComLanguage('新访问人数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，首次在商城发生浏览行为的人数')}`,
                            mapValue: 'newVisitorNum',
                            mapDifferentValue: 'previousNewVisitorNum'
                        }
                    ]
                },
                // {
                //     children: [
                //         {
                //             label: `${sldComLanguage('分享人数')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，分享过商城页面的用户人数（去重）')}`,
                //             mapValue: 'visitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享次数')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，分享商城的总次数')}`,
                //             mapValue: 'viewNum',
                //             mapDifferentValue: 'previousViewNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享页面数')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，分享过的页面路径数量（去重）')}`,
                //             mapValue: 'newVisitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享访问人数')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，通过分享场景，访问小程序/APP的用户数量（去重）')}`,
                //             mapValue: 'newVisitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享打开次数')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，通过分享场景，打开小程序/APP的总人次')}`,
                //             mapValue: 'newVisitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         }
                //     ]
                // },
                // {
                //     children: [
                //         {
                //             label: `${sldComLanguage('分享受访页面数')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，通过分享场景，打开小程序/APP时访问到的页面路径数量（去重）。同时，此处仅统计入口页数据。')}`,
                //             mapValue: 'visitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享渗透率')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，分享人数/访问人数，即有多少比例的用户会有分享行为。')}`,
                //             mapValue: 'viewNum',
                //             mapDifferentValue: 'previousViewNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享引流比(人数)')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，分享访问人数/分享人数，即每有1个用户发起分享，可以带来多少访问用户')}`,
                //             mapValue: 'newVisitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         },
                //         {
                //             label: `${sldComLanguage('分享引流比(次数)')}`,
                //             num: '',
                //             differenceNum: '',
                //             isUp: false,
                //             tip: `${sldComLanguage('统计时间内，分享打开次数/分享次数，即每有1次分享行为，可以带来多少APP打开/访问')}`,
                //             mapValue: 'newVisitorNum',
                //             mapDifferentValue: 'previousNewVisitorNum'
                //         }
                //     ]
                // }                
                {
                    children: [
                        {
                            label: `${sldComLanguage('下单人数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，全平台成功提交订单的去重人数总和')}`,
                            mapValue: 'orderSubmitMemberNum',
                            mapDifferentValue: 'previousOrderSubmitMemberNum'
                        },
                        {
                            label: `${sldComLanguage('下单数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，全平台用户成功提交订单的笔数总和')}`,
                            mapValue: 'orderSubmitNum',
                            mapDifferentValue: 'previousOrderSubmitNum'
                        }
                    ]
                },
                {
                    children: [
                        {
                            label: `${sldComLanguage('支付人数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，全平台成功付款的去重人数总和')}`,
                            mapValue: 'orderPayMemberNum',
                            mapDifferentValue: 'previousOrderPayMemberNum'
                        },
                        {
                            label: `${sldComLanguage('支付订单数')}`,
                            num: '',
                            differenceNum: '',
                            isUp: false,
                            tip: `${sldComLanguage('统计时间内，全平台用户成功支付的订单数量总和')}`,
                            mapValue: 'orderPayNum',
                            mapDifferentValue: 'previousOrderPayNum'
                        }

                    ]
                }
            ],
            curFlowOverview: 'all',//交易总览的终端类型，默认为all 全部
            tradeOverviewParams: {
                startTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 00:00:00`),
                endTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`)
            },
            chartsInfoData: {},
            channelList:[
                {
                    channelId: "all",
                    channelName: "全部渠道"
                }
            ]
        };
    }

    componentDidMount() {
        this.get_channel_list()
        this.getTradeOverview();
    }

    //获取数据列表
    get_channel_list = () => {
        let params = { pageSize: 100,pageNum:1 }
        // this.setState({ overViewLoading: true });
        const { dispatch } = this.props;
        console.log(111,params)
        dispatch({
            type: 'project/operation_list',
            payload: { ...params },
            callback: (res) => {
                // this.setState({ overViewLoading: false });
                if (res.state == 200) {
                    if (params.pageNum > 1 && res.data.channelInfos.length == 0 && this.state.params.pageNum > 1) {
                        params.pageNum = params.pageNum - 1;
                        this.get_channel_list(params);
                    } else {
                        const { channelList } = this.state;
                        let chaneleArr = JSON.parse(JSON.stringify(channelList))
                        chaneleArr.splice(chaneleArr.length,0,...res.data.channelInfos)

                        this.setState({
                            channelList: chaneleArr
                        });
                    }
                }else {
                    failTip(res.msg);
                }
            }
        });
    };

  //tab切换事件
  handleChangeTab = (e, type) => {
      this.setState({ [type]: e }, () => {
          //   this.setState({ [type]: e.target.value }, () => {
          if (type == 'curFlowOverview') {
              this.getTradeOverview();
          }
      });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
      let { tradeOverviewParams } = this.state;
      let _this = this;
      if (index == '_trade_over_view') {
      //交易总览的时间筛选
          tradeOverviewParams = { ...tradeOverviewParams, ...date };
          this.setState({ tradeOverviewParams }, () => {
              _this.getTradeOverview();
          });
      }
  };

  //获取交易总览的数据
  getTradeOverview = () => {
      const { dispatch } = this.props;
      const { flowOverviewData, tradeOverviewParams, curFlowOverview, chartsInfoData } = this.state;
      let params = { ...tradeOverviewParams };
      if (curFlowOverview != 'all') {
          params.terminalType = curFlowOverview;
          params.channelId = curFlowOverview;          
      }
      this.setState({ overViewLoading: true });
      dispatch({
          type: 'statistics/get_analysis_flow_overviewByChannel',
          payload: params,
          callback: (res) => {
              if (res.state === 200) {
                  chartsInfoData.pvPayRate = res.data.pvPayRate || '--';
                  chartsInfoData.pvSubmitRate = res.data.pvSubmitRate || '--';
                  chartsInfoData.submitPayRate = res.data.submitPayRate || '--';
                  flowOverviewData.forEach((item) => {
                      item.children.forEach((item2) => {
                          if (res.data[item2.mapDifferentValue] && res.data[item2.mapDifferentValue].indexOf('-') != 0) {
                              //上涨
                              item2['differenceNum'] = `+${ res.data[item2.mapDifferentValue]}`;
                              item2.isUp = true;
                          } else {
                              //下降
                              item2['differenceNum'] = res.data[item2.mapDifferentValue];
                              item2.isUp = false;
                          }
                          item2['num'] = item2.isMoney ? parseFloat(res.data[item2.mapValue]).toFixed(2) : res.data[item2.mapValue];
                      });
                  });
                  this.setState({ flowOverviewData, chartsInfoData });
              }
              this.setState({ overViewLoading: false, loadedFlag: true });
          }
      });
  };

  render() {
      const { chartsInfoData, overViewLoading, flowOverviewData, curFlowOverview, loadedFlag, channelList } = this.state;
      return (
          <div
              className={`${stat.trade_stat} ${stat.stat_part}`}
              style={{ flex: 1, overflow: 'auto' }}
          >
              <AuthBtn eventKey={['view_flow']} btnAuth={btnAuth} showPage>
                  <SldScrollbars
                      autoHeight
                      autoHeightMin={100}
                      autoHeightMax={document.body.clientHeight - 60}
                  >
                      <div className={`${stat.label_panel} ${global.flex_row_start_center}`}>
                          {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('流量总览')}`, 10, 0, 0)}
                          <div style={{ marginLeft: 10 }}>
                              <SldStatDate
                                  idIndex="_trade_over_view"
                                  updateSelectDate={(date) => this.updateSelectDate(date, '_trade_over_view')}
                              />
                          </div>
                      </div>
                      {getSldHorLineBgColor(1, 'rgba(216, 216, 216, .5)')}
                      <div className={`${stat.change_trend_radio}`} style={{ marginLeft: 25, marginTop: 15, marginBottom: 15 }}>
                          <span>{sldComLanguage('筛选项：')}</span>
                          {/* <Radio.Group
                              size="small"
                              onChange={(e) => this.handleChangeTab(e, 'curFlowOverview')}
                              defaultValue={curFlowOverview}
                          >
                              <Radio.Button value="all">{sldComLanguage('全部')}</Radio.Button>
                              <Radio.Button value="android">{sldComLanguage('Android')}</Radio.Button>
                              <Radio.Button value="ios">{sldComLanguage('IOS')}</Radio.Button>
                              <Radio.Button value="pc">{sldComLanguage('PC')}</Radio.Button>
                              <Radio.Button value="xcx">{sldComLanguage('微信小程序')}</Radio.Button>
                              <Radio.Button value="h5">{sldComLanguage('H5')}</Radio.Button>
                          </Radio.Group> */}
                          <Select
                              size="small"
                              defaultValue={curFlowOverview}
                              style={{ width: 120 }}
                              onSelect={(e) => this.handleChangeTab(e, 'curFlowOverview')}
                          >
                              {channelList.map(channel => (
                                  <Option key={channel.channelId} value={channel.channelId}>{channel.channelName}</Option>
                              ))}
                          </Select>                          
                      </div>
                      <Spin spinning={overViewLoading}>
                          <div className={`${stat.preview_stat_panel}`}>
                              <div className={`${stat.charts_panel} ${stat.funnel}`}>
                                  <div className={stat.part}>
                                      <div className={global.flex_column_center_center}>
                                          <div className={stat.center_item_top}>
                                              <div className={`${stat.top_content} ${global.flex_row_center_center}`}>
                                                  <img className={stat.funnel_center_img} src={require('@/assets/img/statistics/charts_li_icon-3.png')} alt='' />
                                                  <span className={stat.funnel_center_img_desc}>{sldComLanguage('访问')}</span>
                                              </div>
                                          </div>
                                          <div className={stat.center_item_center}>
                                              <div className={`${stat.center_content} ${global.flex_row_center_center}`}>
                                                  <img className={stat.funnel_center_img} src={require('@/assets/img/statistics/charts_li_icon-2.png')} alt='' />
                                                  <span className={stat.funnel_center_img_desc}>{sldComLanguage('下单')}</span>
                                              </div>
                                          </div>
                                          <div className={stat.center_item_bottom}>
                                              <div className={`${stat.bottom_content} ${global.flex_row_center_center}`}>
                                                  <img className={stat.funnel_center_img} src={require('@/assets/img/statistics/charts_li_icon-1.png')} alt='' />
                                                  <span className={stat.funnel_center_img_desc}>{sldComLanguage('支付')}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <div className={stat.left_top_line} />
                                      <div className={stat.left_bottom_line} />
                                      <div className={stat.right_line} />
                                      <div className={stat.left_top_content}>
                                          <p className={stat.side_content_desc}>{sldComLanguage('访问-下单转化率')}</p>
                                          <p className={stat.side_content_desc}>{chartsInfoData.pvSubmitRate || '--'}</p>
                                      </div>
                                      <div className={stat.left_bottom_content}>
                                          <p className={stat.side_content_desc}>{sldComLanguage('下单-支付转化率')}</p>
                                          <p className={stat.side_content_desc}>{chartsInfoData.submitPayRate || '--'}</p>
                                      </div>
                                      <div className={stat.right_content}>
                                          <p className={stat.side_content_desc}>{sldComLanguage('访问-支付转化率')}</p>
                                          <p className={stat.side_content_desc}>{chartsInfoData.pvPayRate || '--'}</p>
                                      </div>
                                  </div>
                              </div>
                              {flowOverviewData.map((item2, index2) => (
                                  <div key={index2} className={`${stat.stat_item}`}>
                                      <ul className={`${global.flex_row_start_center}`}>
                                          {item2.children.map((item, index) => (
                                              <li key={index}>
                                                  <div className={`${stat.up_label} ${global.flex_row_start_center}`}>
                                                      <span>{item.label}</span>
                                                      <TooltipAntd placement="right" title={item.tip}>
                                                          <img src={require('@/assets/img/statistics/pv_icon.png')} alt='' />
                                                      </TooltipAntd>
                                                  </div>
                                                  <div
                                                      style={{ marginLeft: item.isMoney ? '-6px' : '' }}
                                                      className={`${stat.num}`}
                                                      title={item.num}
                                                  >
                                                      {loadedFlag && (
                                                          item.num > 10000
                                                              ? formatNum(item.num, item.isMoney ? 2 : 0)
                                                              : <TweenOne animation={{
                                                                  Children: {
                                                                      value: item.num, floatLength: item.isMoney ? 2 : 0,
                                                                      formatMoney: true
                                                                  },
                                                                  duration: 1000
                                                              }}
                                                              />
                                                      )}
                                                  </div>
                                                  <div className={`${stat.down_difference}`}>
                                                      <span className={`${stat.label}`}>{sldComLanguage('较上期')}</span>
                                                      {item.differenceNum ? (
                                                          <div>
                                                              <span style={{ color: item.isUp ? '#52C41A' : '#C41A1A' }} className={`${stat.difference_num}`}>
                                                                  {item.differenceNum}
                                                              </span>
                                                              <span className={`${stat.custom_svg_iconfont}`}>
                                                                  {sldSvgIcon(item.isUp ? '#52C41A' : '#C41A1A', 16, 16, item.isUp ? 'shangsheng' : 'xiajiang')}
                                                              </span>
                                                          </div>)
                                                          : (
                                                              <span>--</span>)
                                                      }
                                                  </div>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              ))}
                          </div>
                      </Spin>
                      <FlowOther channelList={channelList} />
                  </SldScrollbars>
              </AuthBtn>
          </div>
      );
  }
}
