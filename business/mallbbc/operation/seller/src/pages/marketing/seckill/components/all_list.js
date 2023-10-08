/*
* 秒杀活动
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    setStorage,
    sldtbaleOpeBtnText,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
//场次状态(1-未开始,2-进行中,3-已结束)
let stateTxtValue = { 1: "未开始", 2: "进行中", 3: "已结束" }
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class AllList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'promotionName',
                placeholder: `${sldComLanguage('请输入活动名称')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('活动时间')}`,
                name: 'search_activity_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('活动状态')}`,
                name: 'state',
                placeholder: `${sldComLanguage('请选择活动状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` }
                ]
            }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    dataIndex: 'promotionId',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动时间')}`,
                    dataIndex: 'startTime',
                    align: 'center',
                    width: 100,
                    render: function(text, record) {
                        return <div className={global.voucher_time_wrap}>
                            <p>{text}</p>
                            <p>~</p>
                            <p>{record.endTime}</p>
                        </div>;
                    }
                },
                {
                    title: `${sldComLanguage('活动状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 1:
                            return <DotTag type='normal'>未开始</DotTag>
                        case 2:
                            return <DotTag type='sucess'>进行中</DotTag>
                        case 3:
                            return <DotTag type='normal'>已结束</DotTag> 
                        default:
                            return ''
                        }
                    }
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {!hasAuth("seckill_unattend_add")?'--':
                                <Link to={{
                                    pathname: '/marketing/seckill_to_add',
                                    query: {
                                        id: record.promotionId
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`${sldComLanguage('参加')}`, () => this.toJoinPage(record))}
                                </Link>
                            }
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize, pageIndex:1 });
    }

  //表格拖动
  toJoinPage = (record) => {
      setStorage('join_seckill_detail', JSON.stringify(record));
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      if(params.state){
          params.states = [params.state]
          delete params['state']
      }      
      dispatch({
          type: 'promotion/get_all_seckill_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      params.pageIndex = params.current
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
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
      const { formValues } = this.state;
      if (type == 'main') {
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          params.pageIndex = params.current
          this.setState({ params });
          this.get_list(params);
      }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      //活动时间处理
      if (values.search_activity_time) {
          values.startTime = values.search_activity_time[0] ? `${values.search_activity_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_activity_time[1] ? `${values.search_activity_time[1].format(dateFormat) } 23:59:59` : '';
          delete values.search_activity_time;
      }
      for (let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, ...values, pageIndex:1 });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, pageIndex:1 });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <AuthBtn eventKey={['seckill_unattend_view']} btnAuth={btnAuth} showPage>
                  <div className={global.tableListForm}>
                      <Search
                          search_data={search_data}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          totalHeight={document.body.clientHeight - 200}
                          bordered={false}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="promotionId"
                          isCheck={false}
                          columns={columns}
                          onSelectRow={this.handleSelectRows}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          onSldHandleSeleRow={this.onSldHandleSeleRow}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize
                      />
                      {/*标准表格-end*/}
                  </Spin>
              </AuthBtn>
          </div>

      );
  }
}
