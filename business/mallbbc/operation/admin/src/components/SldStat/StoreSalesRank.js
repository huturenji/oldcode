/*
* 统计里通用的店铺销售排行TOP10
* @zjf-2021-06-30
* */
import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import { sldLlineRtextAddGoodsAddMargin, sldComLanguage, noDataPlaceholder } from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';

@connect(({ common }) => ({
    common
}))
@Form.create()

export default class StoreSalesRank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,//页面加载状态
            storeSalesColumns: [
                {
                    'title': '序号', 'dataIndex': 'storeId', 'align': 'center', 'width': 35,
                    render: (text, record, index) => index + 1
                },
                {
                    'title': '店铺名称', 'dataIndex': 'storeName', 'align': 'center', 'width': 100,
                    render: (text) => <span style={{ color: '#FF701E', fontSize: '13px'}} title={text}>{text}</span>
                },
                {
                    'title': '销售额', 'dataIndex': 'orderPayAmount', 'align': 'center', 'width': 100, 'sorter': true,
                    defaultSortOrder: 'descend',
                    sortDirections: ['descend'],
                    render: (text) => `¥${text.toFixed(2)}`
                },
                {
                    'title': '支付订单数',
                    'dataIndex': 'orderPayNum',
                    'align': 'center',
                    'width': 100,
                    'sorter': true,
                    sortDirections: ['descend']
                }],//店铺销售排行-TOP10表格列设置
            StoreSalesRankData: { list: [], pagination: {} },//店铺销售排行-TOP10表格数据
            storeSalesRankParams: {
                startTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 00:00:00`),
                endTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`)
            }
        };
    }

    componentDidMount() {
        this.getStoreSalesRank();
    }

  //获取店铺销售排行TOP10
  getStoreSalesRank = () => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      let { storeSalesRankParams, StoreSalesRankData } = this.state;
      dispatch({
          type: 'project/get_store_sales_rank',
          payload: storeSalesRankParams,
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  StoreSalesRankData.list = res.data;
                  this.setState({
                      StoreSalesRankData
                  });
              }
          }
      });
  };

  updateSelectDate = (date) => {
      let { storeSalesRankParams } = this.state;
      storeSalesRankParams = { ...storeSalesRankParams, ...date };
      let _this = this;
      this.setState({
          storeSalesRankParams
      }, () => {
          _this.getStoreSalesRank();
      });
  };

  //分页及排序事件
  handleTablePagination = (pagination, filtersArg, sorter) => {
      let { storeSalesRankParams } = this.state;
      if (sorter.field == undefined) {
          return false;
      } if (sorter.field == 'orderPayAmount') {
      //销售额由高到低排序
          storeSalesRankParams.sort = 1;
      } else if (sorter.field == 'orderPayNum') {
      //销量由高到低排序
          storeSalesRankParams.sort = 2;
      }
      let _this = this;
      this.setState({
          storeSalesRankParams
      }, () => {
          _this.getStoreSalesRank();
      });
  };

  render() {
      const { storeSalesColumns, StoreSalesRankData, initLoading } = this.state;
      return (
          <div style={{ marginTop: '10px' }} className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('店铺销售排行 - TOP10')}`, 10, 0, 0)}
                  <SldStatDate
                      idIndex="_store_sales"
                      updateSelectDate={(date) => this.updateSelectDate(date, '_store_sales')}
                  />
              </div>
              <Spin spinning={initLoading}>
                  <div className={`${stat.table_main} ${stat.stat_common_table}`}>
                      {(!StoreSalesRankData || !StoreSalesRankData.list || !StoreSalesRankData.list.length)? noDataPlaceholder():<StandardTable
                          rowKey="storeId"
                          data={StoreSalesRankData}
                          isColumnResize={false}
                          columns={storeSalesColumns}
                          sldpagination={false}
                          border={false}
                          showScrollbar={false}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      />}
                  </div>
              </Spin>
          </div>
      );
  }
}
