/*
* 已参加的一起买活动
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
    sldtbaleOpeBtnText,
    sldPopConfirmDiy,
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

            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'promotionName',
                placeholder: `${sldComLanguage('请输入活动名称')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('活动日期')}`,
                name: 'activity_date',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, {
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [1, 2],                
                label: `${sldComLanguage('活动状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择活动状态')}`,
                sel_data: [
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` },
                    { key: 3, name: `${sldComLanguage('已结束')}` }
                ]
            }],
            formValues: {states: [1, 2]},//搜索条件
            columns: [
                {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动日期')}`,
                    dataIndex: 'startTime',
                    align: 'center',
                    width: 100,
                    render: function(_, record) {
                        return <span>{record.startTime}～{record.endTime}</span>
                    }
                },
                {
                    title: `${sldComLanguage('活动场次')}`,
                    dataIndex: 'stageHourTimeList',
                    align: 'center',
                    width: 100,
                    render: (text)=><div>{text.join(',')}</div>
                },
                {
                    title: `${sldComLanguage('场次时长')}`,
                    dataIndex: 'duration',
                    align: 'center',
                    width: 100,
                    render: (text)=><div>{text}小时</div>
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
                                pathname: '/marketing/together_buy_joined_goods',
                                query: {
                                    id: record.promotionId,                                    
                                    verifyState:2//已参加专场->传2
                                }
                            }}
                            >
                                <span className={`${_styles['operation_text']}`}>查看</span>
                            </Link>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        //初始化取值，需要state [1, 2]
        this.get_list({ pageSize: pageSize, pageIndex:1, ...this.state.formValues });
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
                  this.get_list({ pageSize: pageSize, pageIndex:1 });
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
      params.current = params.current || 1
      dispatch({
          type: 'promotion/get_buyTogether_list',
          payload: {...params,attendState:1 },
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
      //活动日期处理
      if (values.search_activity_time) {
          values.startTime = values.search_activity_time[0] ? `${values.search_activity_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_activity_time[1] ? `${values.search_activity_time[1].format(dateFormat) } 23:59:59` : '';
          delete values.search_activity_time;
      }
      for (let i in values) {
          if (values[i] == ''||values[i] == undefined) {
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
          formValues: {states: [1, 2]},
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, pageIndex:1,states: [1, 2] });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <AuthBtn eventKey={['together_buy_attend_view']} btnAuth={btnAuth} showPage>
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
