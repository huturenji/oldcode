/*
* 天天专场活动 列表页
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
    isEmpty,
    getAuthBtn,
    failTip,hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import _styles from '../index.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class AllList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false, // 接口loading
            data: {}, //列表数据

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
                label: `${sldComLanguage('专场日期')}`,
                name: 'activity_date',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            },{
                type: 'select',
                label: `${sldComLanguage('活动状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择活动状态')}`,
                initialValue:'',
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` }
                ]
            }],
            formValues: {states:[1,2]},//搜索条件
            columns: [
                {
                    title: '专场名称',
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '专场日期',
                    dataIndex: 'promotionTime',
                    align: 'center',
                    width: 100,
                    render: (_, record)=> <span>{record.promotionTime}</span>
                    
                },
                {
                    title: '专场状态',
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
                            {!hasAuth('buy_everyday_unattend_add')?'--':
                                <Link to={{
                                    pathname: '/marketing/buy_everyday_add',
                                    query: {
                                        id: record.promotionId,
                                        promotionName:record.promotionName,
                                        promotionTime:record.promotionTime,
                                        state:record.state
                                    }
                                }}
                                >
                                    <span className={`${_styles['operation_text']}`}>参加</span>
                                </Link>}
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        const {formValues} = this.state
        this.get_list({ pageSize: pageSize,...formValues });
    }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      params.pageIndex = params.current || 1
      dispatch({
          type: 'promotion/get_buyEveryday_list',
          payload: { ...params }, // 1-未开始,2-进行中,3-已结束
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
      if (values.activity_date) {
          values.startTimeStr = values.activity_date[0] ? `${values.activity_date[0].format(dateFormat) }` : '';
          values.endTimeStr = values.activity_date[1] ? `${values.activity_date[1].format(dateFormat) }` : '';
          delete values.activity_date;
      }
      for (let i in values) {
          if (values[i] == '' || values[i]==undefined) {
              delete values[i];
          }
      }
      if(values.states){
          values.states = [values.states]
      }
      if(isEmpty(values.states)){
          values.states = [1,2]
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
          formValues: {states:[1,2]},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize,states:[1,2] });
  };

  getDate = (date)=>{
      if(isEmpty(date)){
          return ''
      }
      let dateArr = date.split(' ')
      return dateArr[0]
  }

  render() {
      const { selectedRows, search_data, columns, initLoading, data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <AuthBtn eventKey={['buy_everyday_unattend_view']} btnAuth={btnAuth} showPage>
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
