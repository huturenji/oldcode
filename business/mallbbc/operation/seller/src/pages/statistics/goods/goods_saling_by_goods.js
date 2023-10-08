//商品动销报表模块-按商品统计
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Tooltip } from 'antd';
import {
    sldComLanguage,
    list_com_page_size_10,
    sldHandlePaginationDataStat,
    dragSldTableColumn,
    getTableNum,
    sldSvgIcon
} from '@/utils/utils';
import {
    statDateSearchParams
} from '@/utils/util_data';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StandardTable from '@/components/StandardTable';
import SldStatDate from '@/components/SldStatDate';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_10;
@connect(({ statistics }) => ({
    statistics
}))
@Form.create()

export default class StatisticsReportGoodsSalingByGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            data: {},//列表数据
            params: {
                ...statDateSearchParams(),
                pageSize: pageSize
            },
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('商品名称')}`
            }
            ],
            columns: [
                {
                    title: '序号',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('商品名称')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 100,
                    render: (text) => <span title={text}>{text}</span>
                },
                {
                    title: `${sldComLanguage('支付金额')}`,
                    dataIndex: 'saleAmount',
                    align: 'center',
                    sorter: true,
                    width: 100,
                    render: (text) => `¥${text.toFixed(2)}`
                },
                {
                    title: `${sldComLanguage('下单金额')}`,
                    dataIndex: 'orderSubmitAmount',
                    align: 'center',
                    sorter: true,
                    width: 100,
                    render: (text) => `¥${text.toFixed(2)}`
                },
                {
                    title: `${sldComLanguage('支付订单数')}`,
                    dataIndex: 'orderPayNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('下单数')}`,
                    dataIndex: 'orderSubmitNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('访客数')}`,
                    dataIndex: 'visitorNum',
                    align: 'center',
                    sorter: true,
                    width: 100,
                    defaultSortOrder: 'descend'
                },
                {
                    title: `${sldComLanguage('浏览量')}`,
                    dataIndex: 'viewNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('收藏人数')}`,
                    dataIndex: 'collectionNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('加购人数')}`,
                    dataIndex: 'addCartMemberNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('销量')}`,
                    dataIndex: 'saleNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: <div style={{ position: 'relative' }}>
                        <span style={{ marginRight: 17 }}>{sldComLanguage('下单转化率')}</span>
                        <Tooltip placement="bottomLeft" title={`${sldComLanguage('访客-下单转化率：统计时间内，下单人数/店铺访客数')}`}>
                            <div style={{ right: 0, top: 2, position: 'absolute' }}>{sldSvgIcon('#bfbbba', 14, 14, 'wen')}</div>
                        </Tooltip>
                    </div>,
                    dataIndex: 'pvSubmitRate',
                    align: 'center',
                    sorter: true,
                    width: 120
                },
                {
                    title: `${sldComLanguage('退单数')}`,
                    dataIndex: 'returnNum',
                    align: 'center',
                    sorter: true,
                    width: 100
                },
                {
                    title: `${sldComLanguage('退单金额')}`,
                    dataIndex: 'returnAmount',
                    align: 'center',
                    sorter: true,
                    width: 100,
                    render: (text) => `¥${text.toFixed(2)}`
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
          type: 'statistics/get_goods_saling_report_by_goods_lists',
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
          const temp = sldHandlePaginationDataStat(pagination, filtersArg, sorter, formValues, 1, pageSize);
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

  //搜索事件
  search = (data) => {
      const values = { ...data };
      this.setState({
          formValues: values
      });
      let cur_params = { ...this.state.params, ...values, current: 1 };
      this.props.updateExportParam(cur_params);
      this.get_list(cur_params);
  };

  //搜索重置事件
  seaReset = () => {
      let { params } = this.state;
      delete params.skuName;
      delete params.current;
      //搜索条件置为空
      this.setState({
          formValues: {},
          data: {},
          params: params
      });
      this.get_list(params);
  };

  render() {
      const { search_data, columns, selectedRows, data, initLoading } = this.state;
      return (
          <div className={`${stat.stat_common_table}`}>
              <div className={`${global.flex_row_between_center}`} style={{ margin: '10px 0' }}>
                  <SldStatDate
                      idIndex="_report_goods_saling_by_goods"
                      updateSelectDate={(date) => this.updateSelectDate(date, '_report_goods_saling_by_goods')}
                  />
              </div>
              <div className={global.tableListForm} ref="search_part" style={{ marginRight: 10 }}>
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="sku"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      onSldHandleSeleRow={this.onSldHandleSeleRow}
                      resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                      isColumnResize={false}
                      border={false}
                      scroll={{ x: 1355 }}
                  />
                  {/*标准表格-end*/}
              </Spin>
          </div>
      );
  }
}
