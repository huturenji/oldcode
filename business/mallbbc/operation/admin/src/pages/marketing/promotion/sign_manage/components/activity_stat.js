/*
* 活动签到统计
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    sldHandlePaginationData,
    sldtbaleOpeBtnText
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import ViewModal from './view_modal';
import Search from '@/components/Search/Search';
import { query } from '@/services/user';
let pageSize = list_com_page_size_10;
@connect(({ sign_manage }) => ({
    sign_manage
}))
@Form.create()
export default class ActivityStat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: props.queryparams,
            modalVisible:false,
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            formValues: {signActivityId:props.queryparams.id},//搜索条件
            record:null, // 当前查看的数据
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: '企业',
                    dataIndex: 'companyName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '会员名',
                    dataIndex: 'memberName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '手机号',
                    dataIndex: 'memberMobile',
                    align: 'center',
                    width: 100
                },
                {
                    title: '会员昵称',
                    dataIndex: 'memberNickName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '第一次签到时间',
                    dataIndex: 'firstSignDate',
                    align: 'center',
                    width: 200
                },
                {
                    title: '最近一次签到时间',
                    dataIndex: 'endSignType',
                    align: 'center',
                    width: 200
                },
                {
                    title: '最近一次连续签到天数',
                    dataIndex: 'continueNum',
                    align: 'center',
                    width: 200
                },
                {
                    title: '累计签到总次数',
                    dataIndex: 'count',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (record) => (
                        <Fragment>
                            {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.showModal(record) )}
                        </Fragment>
                    )
                }
            ],
            search_data: [
                {
                    type: 'input',
                    label: `${sldComLanguage('会员名')}`,
                    name: 'memberName',
                    placeholder: `${sldComLanguage('请输入会员名')}`
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('手机号')}`,
                    name: 'memberMobile',
                    placeholder: `${sldComLanguage('请输入手机号')}`
                }
            ]
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined) {
            this.get_list({ pageSize: pageSize,current:1, signActivityId:query.id });
        }
    }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'sign_manage/getStatisticsList',
          payload: { ...params },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list(params);
                  } else {
                      res.data.list.forEach((item)=>{
                          item.key = `${item.memberId}${item.companyId}`
                      })
                      this.setState({
                          data: res.data
                      });
                  }
              }
          }
      });
  };

  showModal = (record)=>{
      this.setState({
          record,
          modalVisible:true
      })
  }

  cancleModal = ()=>{
      this.setState({
          record:null,
          modalVisible:false
      })
  }

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
    const param = {}
    Object.keys(data).forEach(key => {
        if(data[key]){
            param[key] = data[key];
        }
    })
    this.get_list({ pageSize: pageSize, current:1, ...param , signActivityId: this.state.query.id });
  }

  //搜索条件置为空
  seaReset = () => {
    this.get_list({ pageSize: pageSize, current:1, signActivityId: this.state.query.id });
  }

  render() {
      const { query ,selectedRows, columns, initLoading, data,modalVisible,record, search_data } = this.state;

      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <div className={global.tableListForm} ref="search_part">
                <Search
                    search_data={search_data}
                    seaSubmit={(data) => this.search(data)}
                    seaReset={() => this.seaReset()}
                    showLessCount={5}
                />
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="key"
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
              {
                  modalVisible && 
                <ViewModal 
                    modalVisible={modalVisible}
                    cancle={this.cancleModal}
                    record={record}
                    signActivityId={query.id}
                />
              }
          </div>
      );
  }
}
