/*
* 已参加的天天专场活动
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
    failTip,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import _styles from '../index.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class JoinedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false, // 接口loading
            data: {},//列表数据

            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key

            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: '专场名称',
                name: 'keyword',
                placeholder: '请输入专场名称'
            }, {
                type: 'rangepicker',
                label: '专场日期',
                name: 'search_activity_time',
                placeholder1: '开始时间',
                placeholder2: '结束时间'
            }, {
                type: 'select',
                label: '专场状态',
                name: 'states',
                mode:'multiple',
                width:250,
                initialValue:[1,2,3],
                placeholder: '请选择专场状态',
                sel_data: [
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` },
                    { key: 3, name: `${sldComLanguage('已结束')}` }
                ]
            }],
            formValues: {
                states:[1,2,3]
            },//搜索条件
            columns: [
                {
                    title: `${sldComLanguage('专场名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('专场日期')}`,
                    dataIndex: 'promotionTime',
                    align: 'center',
                    width: 100,
                    render: function(text) {
                        return <span>{text}</span>
                    }
                },
                {
                    title: `${sldComLanguage('专场状态')}`,
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
                            return <DotTag type='normal'>已结束</DotTag>
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
                                pathname: '/marketing/buy_everyday_joined_goods',
                                query: {
                                    id: record.promotionId,
                                    promotionName:record.promotionName,
                                    promotionTime:record.promotionTime,
                                    state:record.state,
                                    verifyState:2//已参加专场->传2
                                }
                            }}
                            >
                                <span className={`${_styles['operation_text']}`}>详情</span>
                            </Link>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize,states:[1,2,3] });
    }

  //退出活动
  quitActivity = (item) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/quit_seckill_activit_good',
          payload: { seckillId:item.seckillId},
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {   
                  failTip('退出成功')
                  this.get_list({ pageSize: pageSize });
              }else{
                  failTip(res.msg)
              }
          }
      });
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      params.pageIndex = params.current || 1
      dispatch({
          type: 'promotion/get_list_attend',
          payload: {...params},
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
              }else{
                  failTip(res.msg)
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
      //活动日期处理
      if (values.search_activity_time) {
          values.startTimeStr = values.search_activity_time[0] ? `${values.search_activity_time[0].format(dateFormat) }` : '';
          values.endTimeStr = values.search_activity_time[1] ? `${values.search_activity_time[1].format(dateFormat) }` : '';
          delete values.search_activity_time;
      }
      for (let i in values) {
          if (values[i] == ''||values[i] == undefined) {
              delete values[i];
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {
              states:[1,2,3]
          },
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize,states:[1,2,3] });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <AuthBtn eventKey={['buy_everyday_attend_view']} btnAuth={btnAuth} showPage>
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
                          totalHeight={document.body.clientHeight - 360}
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
