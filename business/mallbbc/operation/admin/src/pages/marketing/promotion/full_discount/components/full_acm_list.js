/*
* 满优惠——满N元减
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Modal } from 'antd';
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
    sldPopConfirmDiy,
    isEmpty,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import AddFullAcm from './add_full_acm';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let initState = [1,3,4,5,9]
@connect(({ full_discount }) => ({
    full_discount
}))
@Form.create()
export default class FullAcmList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_height:0,
            curDataId: '',//当前操作的id
            modalVisibleDetail: false,
            initLoading: false,
            submiting: false,
            modalVisible: false,//是否显示规格弹框
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: `${sldComLanguage('满减规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [
                {
                    type: 'input',
                    label: `${sldComLanguage('店铺名称')}`,
                    name: 'storeName',
                    placeholder: `${sldComLanguage('请输入店铺名称')}`
                },
                {
                    type: 'input',
                    label: `${sldComLanguage('活动名称')}`,
                    name: 'fullName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`
                }, {
                    type: 'rangepicker',
                    label: `${sldComLanguage('活动时间')}`,
                    name: 'search_activity_time',
                    placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
                    placeholder2: `${sldComLanguage('结束时间')}`//结束时间
                }, {
                    type: 'select',
                    label: `${sldComLanguage('活动状态')}`,
                    name: 'stateList',
                    placeholder: `${sldComLanguage('请选择活动状态')}`,
                    sel_data: [
                        { key: '1', name: `${sldComLanguage('待发布')}` },
                        { key: '9', name: `${sldComLanguage('未开始')}` },
                        { key: '3', name: `${sldComLanguage('进行中')}` },
                        { key: '5', name: `${sldComLanguage('已失效')}` },
                        { key: '4', name: `${sldComLanguage('已结束')}` }
                    ]
                }],
            formValues: {stateList:initState},//搜索条件
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 100
                }, {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'fullName',
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
                    title: `${sldComLanguage('适用商品')}`,
                    dataIndex: 'useTypeValue',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 1:
                            return <DotTag type='pending'>待发布</DotTag>
                        case 3:
                            return <DotTag type='sucess'>进行中</DotTag>
                        case 4:
                            return <DotTag type='normal'>已结束</DotTag>
                        case 5:
                            return <DotTag type='normal'>已失效</DotTag>
                        case 9:
                            return <DotTag type='normal'>未开始</DotTag> 
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
                            {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.view(record.fullId))}
                            {/* 只有未开始、进行中的才可以失效 */}
                            <AuthBtn eventKey={['invalid_full_acm']} btnAuth={btnAuth}>
                                {
                                    (record.state == 9 || record.state == 3) &&
                                <Fragment>
                                    <span className={global.splitLine} />
                                    {sldPopConfirmDiy('leftBottom', `${sldComLanguage('失效后不可恢复，是否确定失效？')}`, () => this.operate(record.fullId, 'invalid'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('失效')}`, () => null))}
                                </Fragment>
                                }
                            </AuthBtn>
                            {/* 只有待发布、已失效、已结束的才可以删除 */}
                            <AuthBtn eventKey={['delete_full_acm']} btnAuth={btnAuth}>
                                {
                                    (record.state == 1 || record.state == 4 || record.state == 5) &&
                                <Fragment>
                                    <span className={global.splitLine} />
                                    {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operate(record.fullId,'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
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
        this.get_list({ pageSize: pageSize, ...this.state.formValues });
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () =>{
      const {search_height} = this.state;
      if(this.refs.search_part!=undefined){
          if(this.refs.search_part.clientHeight != search_height){
              this.setState({search_height:this.refs.search_part.clientHeight})
          }
      }
  }

  // 查看详情
  view = (id) => {
      this.setState({
          modalVisibleDetail: true,
          curDataId: id
      });
  };

  //满减操作  type: invalid 失效  del 删除
  operate = (id, type) => {
      const { params } = this.state;
      const { dispatch } = this.props;
      let param_data = {};
      let dis_type = '';
      if (type == 'invalid') {
          dis_type = 'full_discount/invalid_full_acm';
          param_data.fullId = id;
      } else if (type == 'del') {
          dis_type = 'full_discount/del_full_acm';
          param_data.fullId = id;
      } else if (type == 'publish') {
          dis_type = 'full_discount/publish_full_acm';
          param_data.fullId = id;
      }
      this.setState({ submiting: true });
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({...params, ...this.state.formValues});
                  this.setState({
                      modalVisible: false
                  });
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
          type: 'full_discount/get_full_acm_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list({...params, ...this.state.formValues});
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
      if(isEmpty(values.stateList)){
          values.stateList = initState
      }else{
          values.stateList = [Number(values.stateList)]
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
          formValues: {stateList:initState},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize,stateList:initState });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false, modalVisibleDetail: false });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data, modalVisibleDetail, curDataId, search_height } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <div className={global.tableListForm} ref="search_part">
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      totalHeight={document.body.clientHeight-150-search_height-20}
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="fullId"
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

              <Modal
                  destroyOnClose
                  maskClosable={false}
                  title={`${sldComLanguage('查看详情')}`}
                  zIndex={999}
                  width={1000}
                  onCancel={this.sldHandleCancle}
                  footer={null}
                  visible={modalVisibleDetail}
              >
                  <AddFullAcm id={curDataId} />
              </Modal>

          </div>

      );
  }
}
