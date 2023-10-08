/*
* 签到活动列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import {
    failTip,
    sucTip,
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldIconBtn,
    sldPopConfirmDiy,
    getAuthBtn,
    sldLlineRtextAddGoodsAddMargin
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ sign_manage }) => ({
    sign_manage
}))
@Form.create()
export default class SignList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_height: 0,
            initLoading: false,
            submiting: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [
                {
                    type: 'input',
                    label: `${sldComLanguage('活动名称')}`,
                    name: 'signActivityName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`
                },
                {
                    type: 'rangepicker',
                    label: `活动日期`,
                    name: 'search_activity_time',
                    placeholder1: `${sldComLanguage('开始时间')}`,
                    placeholder2: `${sldComLanguage('结束时间')}`
                },
                {
                    type: 'select',
                    mode: "multiple",
                    width: 250,
                    label: `${sldComLanguage('活动状态')}`,
                    name: 'stateList',
                    placeholder: `${sldComLanguage('请选择活动状态')}`,
                    sel_data: [
                        { key: '1', name: `待审核` },
                        { key: '2', name: `审核拒绝` },
                        { key: '4', name: `未开始` },
                        { key: '5', name: `进行中` },
                        { key: '6', name: `已结束` },
                        { key: '7', name: `已失效` }
                    ]
                }
            ],
            formValues: {},//搜索条件
            columns: [
                {
                    title: '序号',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: '活动ID',
                    dataIndex: 'signActivityId',
                    align: 'center',
                    width: 150
                },
                {
                    title: '活动名称',
                    dataIndex: 'signActivityName',
                    align: 'center',
                    width: 150
                },
                {
                    title: '活动日期',
                    dataIndex: 'startTime',
                    align: 'center',
                    width: 150,
                    render: (text, record) => `${record.startTime}~${record.endTime}`
                },
                {
                    title: `${sldComLanguage('活动状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 1:
                            return <DotTag type='pending'>待审核</DotTag>
                        case 2:
                            return <DotTag type='failed'>审核拒绝</DotTag>
                        case 4:
                            return <DotTag type='normal'>未开始</DotTag>
                        case 5:
                            return <DotTag type='sucess'>进行中</DotTag>
                        case 6:
                            return <DotTag type='normal'>已结束</DotTag> 
                        case 7:
                            return <DotTag type='normal'>已失效</DotTag>     
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
                            <AuthBtn eventKey={['view_sign']} btnAuth={btnAuth}>
                                <Link to={{
                                    pathname: '/marketing_promotion/sign_to_detail',
                                    query: {
                                        id: record.signActivityId,
                                        tar: 'view'
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
                                </Link>
                            </AuthBtn>
                            {/* 只有待审核的才可以审核 */}
                            <AuthBtn eventKey={['audit_sign']} btnAuth={btnAuth}>
                                {
                                    record.state==1 && 
                                    <Link to={{
                                        pathname: '/marketing_promotion/sign_to_detail',
                                        query: {
                                            id: record.signActivityId,
                                            tar: 'audit'
                                        }
                                    }}
                                    >
                                        {sldtbaleOpeBtnText('审核', () => null)}
                                    </Link>
                                }
                            </AuthBtn>
                            
                            {/* 只有审核拒绝的才可以编辑 */}
                            <AuthBtn eventKey={['edit_sign']} btnAuth={btnAuth}>
                                {
                                    (record.state == 2) &&
                                    <Fragment>
                                        <Link to={{
                                            pathname: '/marketing_promotion/sign_to_add',
                                            query: {
                                                id: record.signActivityId,
                                                tar: 'edit'
                                            }
                                        }}
                                        >
                                            {sldtbaleOpeBtnText('编辑', () => null)}
                                        </Link>
                                    </Fragment>
                                }
                            </AuthBtn>

                            {/* 只有未开始、进行中的才可以失效 */}
                            <AuthBtn eventKey={['invalid_sign']} btnAuth={btnAuth}>
                                {
                                    (record.state == 4||record.state == 5)&&
                                <Fragment>
                                    {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定失效该活动吗？')}`, () => this.operate(record.signActivityId, 'invalid'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('失效')}`, () => null))}
                                </Fragment>
                                }
                            </AuthBtn>
                            
                            {/* 只有 待审核、审核拒绝  已失效、已结束 的才可以删除 */}
                            <AuthBtn eventKey={['delete_sign']} btnAuth={btnAuth}>
                                {
                                    ( [1,2,6,7].includes(record.state))&&
                                    <Fragment>
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}？`, () => this.operate(record.signActivityId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                                    </Fragment>
                                }
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () => {
      const { search_height } = this.state;
      if (this.refs.search_part != undefined) {
          if (this.refs.search_part.clientHeight != search_height) {
              this.setState({ search_height: this.refs.search_part.clientHeight });
          }
      }
  };

  //签到操作  type: invalid 失效  del 删除
  operate = (id, type) => {
      const { params } = this.state;
      const { dispatch } = this.props;
      let param_data = {};
      let dis_type = '';
      if (type == 'invalid') {
          dis_type = 'sign_manage/invalid';
          param_data.signActivityId = id;
      } else if (type == 'del') {
          dis_type = 'sign_manage/del';
          param_data.signActivityId = id;
      }
      this.setState({ submiting: true });
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'sign_manage/get_lists',
          payload: { ...params, systemType: 'seller' },
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
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize });
  };

  //搜索点击
  moreSearchToggle = () => {
      const { search_height } = this.state;
      if (this.refs.search_part != undefined) {
          if (this.refs.search_part.clientHeight != search_height) {
              this.setState({ search_height: this.refs.search_part.clientHeight });
          }
      }
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data, search_height } = this.state;
      return (
          <AuthBtn eventKey={['view_sign']} btnAuth={btnAuth} showPage>
              <div className={global.common_page} style={{ flex: 1 }}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('签到活动')}`, 0, 0, 10)}
                  <div className={global.tableListForm} ref="search_part">
                      <Search
                          search_data={search_data}
                          moreSearchToggle={() => this.moreSearchToggle()}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  {/*公共功能条-start*/}
                  <div className={global.operate_bg}>
                      <AuthBtn eventKey={['add_sign']} btnAuth={btnAuth}>
                          <Link to={{
                              pathname: '/marketing_promotion/sign_to_add'
                          }}
                          >
                              {sldIconBtn(() => null, `${sldComLanguage('新建签到活动')}`, 7, 0, 14, 14, 3, 'fabu1', '#FA6F1E')}
                          </Link>
                      </AuthBtn>
                  </div>
                  {/*公共功能条-end*/}
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          totalHeight={document.body.clientHeight - 100 - search_height - 80}
                          bordered={false}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="signActivityId"
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
              </div>
          </AuthBtn>
      );
  }
}
