import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Radio } from 'antd';
import { sldLlineRtextAddMargin, sldComLanguage, noDataPlaceholder } from '@/utils/utils';
import { statDateSearchParams } from '@/utils/util_data';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import SldStatDate from '@/components/SldStatDate';
import LineArea from '@/components/SldStatBizcharts/LineArea';

@connect(({ common }) => ({
    common
}))
@Form.create()

export default class GoodsSalesTrendTop extends Component {

  goodsSalesTendLineColor = ['city', 'rgba(2, 137, 255, 1)-rgba(236, 140, 100, 1)-rgba(62, 207, 250, 1)-rgba(138, 125, 250, 1)-rgba(124, 140, 168, 1)-rgba(248, 201, 78, 1)-rgba(30, 135, 240, 1)-rgba(224, 224, 224, 1)-rgba(246, 91, 91, 1)-rgba(38, 172, 106, 1)'];

  //商品动销趋势图表的line颜色
  goodsSalesTendAreaColor = ['city',
      [
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)',
          'l(90) 0:rgba(30, 135, 240, 0) 0.5:rgba(30, 135, 240, 0) 1:rgba(30, 135, 240, 0)'
      ]
  ];//商品动销趋势图表的area颜色

  constructor(props) {
      super(props);
      this.state = {
          goodsSalesTendLoading: false,//商品动销趋势模块loading
          goodsSalesTrendRandParams: statDateSearchParams(),//商品动销趋势的筛选条件
          goodsSalesTendData: [],//商品销售变化趋势-TOP10(销量数据)
          goodsSalesTendAmountData: [],//商品销售变化趋势-TOP10(销售额数据)
          goodsSalesTendAllData: [],//商品动销趋势全部数据
          curGoodsSalesTendDataTopActive: 'amount'//商品销售变化趋势-TOP10当前tab amount-销售额 sales-销量
      };
  }

  componentDidMount() {
      this.getGoodsSalesTendRandData();
  }

  //获取商品动销趋势数据
  getGoodsSalesTendRandData = () => {
      this.setState({ goodsSalesTendLoading: true });
      const { dispatch } = this.props;
      let { goodsSalesTrendRandParams } = this.state;
      let goodsSalesTendData = [];
      let goodsSalesTendAmountData = [];
      dispatch({
          type: 'common/get_goods_sales_trend_top',
          payload: goodsSalesTrendRandParams,
          callback: (res) => {
              this.setState({ goodsSalesTendLoading: false });
              if (res.state == 200) {
                  if (res.data.length > 0) {
                      res.data.forEach(item => {
                          item.goodsList.forEach(child => {
                              goodsSalesTendData.push({
                                  month: item.statsTime,
                                  city: child.skuName,
                                  temperature: child.saleNum
                              });
                              goodsSalesTendAmountData.push({
                                  month: item.statsTime,
                                  city: child.skuName,
                                  temperature: child.saleAmount
                              });
                          });
                      });
                  }
                  this.setState({
                      goodsSalesTendData,
                      goodsSalesTendAmountData
                  });
              }
          }
      });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date, index) => {
      let { goodsSalesTrendRandParams } = this.state;
      let _this = this;
      if (index == '_goods_sales_rand') {
      //商品动销趋势的时间筛选
          goodsSalesTrendRandParams = { ...goodsSalesTrendRandParams, ...date };
          this.setState({ goodsSalesTrendRandParams }, () => {
              _this.getGoodsSalesTendRandData();
          });
      }
  };

  //销售额、销量切换事件
  handleChangeTab = (e) => {
      this.setState({ curGoodsSalesTendDataTopActive: e.target.value });
  };

  render() {
      const { goodsSalesTendLoading, goodsSalesTendData, curGoodsSalesTendDataTopActive, goodsSalesTendAmountData } = this.state;
      return (
          <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                  <div className={`${global.flex_row_start_center}`}>
                      {sldLlineRtextAddMargin('#FA6F1E', `${sldComLanguage('商品销售趋势TOP10')}`, 10, 0, 0)}
                      <div style={{ marginLeft: 10 }}>
                          <Radio.Group
                              size="small"
                              onChange={(e) => this.handleChangeTab(e)}
                              defaultValue={curGoodsSalesTendDataTopActive}
                          >
                              <Radio.Button value="amount">销售额</Radio.Button>
                              <Radio.Button value="sales">销量</Radio.Button>
                          </Radio.Group>
                      </div>
                  </div>
                  <SldStatDate
                      idIndex="_goods_sales_rand"
                      updateSelectDate={(date) => this.updateSelectDate(date, '_goods_sales_rand')}
                  />
              </div>
              <Spin spinning={goodsSalesTendLoading}>
                  <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, height: 498, background: '#fff' }}>
                      {curGoodsSalesTendDataTopActive == 'amount' &&
            <Fragment>
                {goodsSalesTendAmountData.length > 0
                    ? <LineArea
                        data={goodsSalesTendAmountData}
                        lineColor={this.goodsSalesTendLineColor}
                        areaColor={this.goodsSalesTendAreaColor}
                        unit="¥" 
                    />
                    : noDataPlaceholder()
                }
            </Fragment>
                      }
                      {curGoodsSalesTendDataTopActive == 'sales' &&
            <Fragment>
                {goodsSalesTendData.length > 0
                    ? <LineArea
                        data={goodsSalesTendData}
                        lineColor={this.goodsSalesTendLineColor}
                        areaColor={this.goodsSalesTendAreaColor}
                    />
                    : noDataPlaceholder()
                }
            </Fragment>
                      }
                  </div>
              </Spin>
          </div>
      );
  }
}
