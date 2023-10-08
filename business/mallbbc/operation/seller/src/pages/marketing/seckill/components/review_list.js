/*
* 活动审核列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    isNotEmpty,
    isEmpty,
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
let verifyStateValue = { 0: "待店铺审核", 1: "待平台审核", 2: "审核通过",3:"审核拒绝" }
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class ReviewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'keyword',
                placeholder: `${sldComLanguage('请输入活动名称')}`
            }, {
                type: 'rangepicker',
                label: '活动日期',
                name: 'search_activity_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, 
            {
                type: 'select',
                label: '场次状态',
                name: 'state',
                placeholder: '请选择场次状态',
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` }
                ]
            },
            {
                type: 'select',
                label: '商品审核状态',
                name: 'verifyState',
                placeholder: '请选择商品审核状态',
                sel_data: [
                    { key: 0, name: '待店铺审核' },
                    { key: 3, name: '审核拒绝' }
                ]
            }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动时间')}`,
                    dataIndex: 'stageTime',
                    align: 'center',
                    width: 100
                },
                {
                    title: '活动场次',
                    dataIndex: 'stageAliar',
                    align: 'center',
                    width: 100
                },
                {
                    title: '场次状态',
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
                    title: '商品审核状态',
                    dataIndex: 'verifyState',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 0:
                            return <DotTag type='pending'>待店铺审核</DotTag>
                        case 1:
                            return <DotTag type='pending'>待平台审核</DotTag>
                        case 2:
                            return <DotTag type='sucess'>审核通过</DotTag>
                        case 3:
                            return <DotTag type='failed'>审核拒绝</DotTag> 
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
                            <Link to={{
                                pathname: '/marketing/seckill_to_review',
                                query: {
                                    promotionId:record.promotionId,
                                    stageId: record.stageId,
                                    promotionName:record.promotionName,
                                    stageTime:record.stageTime,
                                    stageAliar:record.stageAliar,
                                    verifyState:record.verifyState,
                                    type:'view'
                                }
                            }}
                            >
                                {sldtbaleOpeBtnText('查看', () => null)}
                            </Link>
                            <AuthBtn eventKey={['seckill_audit_edit']} btnAuth={btnAuth}>
                                <Link to={{
                                    pathname: '/marketing/seckill_to_edit',
                                    query: {
                                        promotionId:record.promotionId,
                                        stageId: record.stageId,
                                        promotionName:record.promotionName,
                                        stageTime:record.stageTime,
                                        stageAliar:record.stageAliar,
                                        verifyState:record.verifyState,
                                        type:'edit'
                                    }
                                }}
                                >
                                    {(record.verifyState==3 && record.state ==1) && sldtbaleOpeBtnText('编辑', () => null)}
                                </Link>
                            </AuthBtn>
                            {
                                record.verifyState==0 && hasAuth("seckill_audit_audit")&&
                                <Link to={{
                                    pathname: '/marketing/seckill_to_review',
                                    query: {
                                        promotionId:record.promotionId,
                                        stageId: record.stageId,
                                        promotionName:record.promotionName,
                                        stageTime:record.stageTime,
                                        stageAliar:record.stageAliar,
                                        verifyState:record.verifyState,
                                        type:'audit'
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText('审核', () => null)}
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

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      if(isNotEmpty(params.verifyState)){
          params.verifyStates = [params.verifyState]
          delete params['verifyState']
      }
      if(params.state){
          params.states = [params.state]
          delete params['state']
      }           
      dispatch({
          type: 'promotion/listAuditSeckillStage',
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
          if (isEmpty(values[i])) {
              delete values[i];
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize , pageIndex:1}
      });
      this.get_list({ pageSize: pageSize, ...values , pageIndex:1});
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
              <AuthBtn eventKey={['seckill_audit_view']} btnAuth={btnAuth} showPage>
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
