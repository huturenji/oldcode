//会员报表模块-按天统计
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
    sldComLanguage,
    list_com_page_size_10,
    sldHandlePaginationDataStat,
    dragSldTableColumn
} from '@/utils/utils';
import {
    statDateSearchParams
} from '@/utils/util_data';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';

let pageSize = list_com_page_size_10;
@connect(({ statistics }) => ({
    statistics
}))
@Form.create()

export default class StatisticsReportMemberByDay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            data: {},//列表数据
            params: {
                ...statDateSearchParams(),
                pageSize: pageSize
            },
            columns: [
                {
                    title: `${sldComLanguage('时间')}`,
                    dataIndex: 'statsTime',
                    align: 'center',
                    sorter: true,
                    width: 80,
                    defaultSortOrder: 'descend'
                },
                {
                    title: `${sldComLanguage('新增用户数')}`,
                    dataIndex: 'newMemberNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('店铺访客数')}`,
                    dataIndex: 'visitorNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('下单人数')}`,
                    dataIndex: 'orderSubmitMemberNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('支付人数')}`,
                    dataIndex: 'orderPayMemberNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('关注店铺人数')}`,
                    dataIndex: 'collectionStoreNum',
                    align: 'center',
                    sorter: true,
                    width: 120
                }
            ]
        };
    }

    componentDidMount() {
    //父组件有注册函数，把自己赋值给父组件
        this.props.onRef && this.props.onRef(this)
        this.get_list(this.state.params);
    }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'statistics/get_member_report_by_day_lists',
          payload: params,
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  this.setState({
                      data: res.data
                  });
              }
          }
      });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      let { formValues, params } = this.state;
      if (type == 'main') {
          const temp = sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues, 2, pageSize);
          pageSize = params.pageSize;
          params = { ...params, ...temp };
          this.setState({ params });
          this.get_list(params);
      }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //时间筛选器返回的时间数据
  updateSelectDate = (date) => {
      let { params } = this.state;
      params = { ...params, ...date, current:1 };
      this.get_list(params);
      this.props.updateExportParam(params);
      this.setState({ params });
  };

  render() {
      const { columns, selectedRows, data, initLoading } = this.state;
      return (
          <div className={`${stat.stat_common_table}`}>
              <div className={`${global.flex_row_between_center}`} style={{ margin: '10px 0' }}>
                  <SldStatDate
                      idIndex="_report_flow_by_day"
                      updateSelectDate={(date) => this.updateSelectDate(date, '_report_flow_by_day')}
                  />
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="statsTime"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      onSldHandleSeleRow={this.onSldHandleSeleRow}
                      resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                      isColumnResize={false}
                      border={false}
                      showScrollbar={false}
                  />
                  {/*标准表格-end*/}
              </Spin>
          </div>
      );
  }
}
