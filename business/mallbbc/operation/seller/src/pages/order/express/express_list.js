import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
    sldIconBtn,
    failTip,
    sucTip,
    list_com_page_size_10,
    formItemLayoutModal,
    sldHandlePaginationData,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    sldPopConfirmDiy,
    sldtbaleOpeBtnText,getAuthBtn,hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ express }) => ({
    express
}))
@Form.create()
export default class ExpressList extends Component {
    cur_sel_data = [];//选择的物流公司

    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            submiting: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            addData: [{
                type: 'checkboxgroup',
                label: `${sldComLanguage('选择物流')}`,
                name: 'sel_express',
                placeholder: `${sldComLanguage('请选择物流')}`,
                initialValue: '',
                sldOptions:[],
                operate_obj: 'search_express',
                sldCheckShop:this.sldCheckExpress,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请选择物流公司')}`
                }]
            }
            ],//modal框的数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('物流名称')}`,
                name: 'expressName',
                placeholder: `${sldComLanguage('请输入物流名称')}`
            }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    dataIndex: 'bindId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('物流名称')}`,
                    dataIndex: 'expressName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('显示状态')}`,
                    dataIndex: 'expressState',
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Switch
                            disabled={!hasAuth('express_open')}
                            onChange={(checked) => this.operateExpress({
                                bindId: record.bindId,
                                expressState: checked ? 1 : 0
                            }, 'switch')}
                            checked={text == 1 ? true : false}
                            valuepropname="checked" 
                        />
                    )
                },
                {
                    title: `${sldComLanguage('添加时间')}`,
                    dataIndex: 'createTime',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn btnAuth={btnAuth} eventKey={["express_delete"]} showPage>
                                {
                                    sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateExpress(record.bindId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))
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
    }


  //物流操作 type:switch 开关  del删除
  operateExpress = (id, type) => {
      this.setState({ submiting: true });
      const { params,formValues } = this.state;
      const { dispatch } = this.props;
      let dis_type = '';
      let param_data = {};
      if (type == 'del') {
          dis_type = 'express/del_express';
          param_data.bindId = id;
      } else if (type == 'switch') {
          dis_type = 'express/switch_express';
          param_data = id;
      }
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.setState({
                      modalVisible: false
                  });
                  this.get_list({...params,...formValues});
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //添加物流公司
  addExpress = () => {
      let { addData } = this.state;
      //获取可选择的物流公司
      this.props.dispatch({
          type: 'express/get_system_express_list',
          payload: {pageSize:pageSize},
          callback: (res) => {
              if (res.state == 200) {
                  if(res.data.length>0){
                      addData[0].sldOptions = [];
                      res.data.forEach(item=>{
                          addData[0].sldOptions.push({label:item.expressName,value:item.expressId});
                      });
                  }
                  this.setState({ modalVisible: true, type: 'add', title: `${sldComLanguage('添加物流公司')}`, addData: addData });
                  this.cur_sel_data = [];
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  sldCheckExpress = (data) => {
      this.cur_sel_data = data;
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'express/get_seller_express_lists',
          payload: params,
          callback: (res) => {
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
              }
              this.setState({ initLoading: false });
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

  //表格列拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  sldHandleConfirm = () => {
      const { dispatch } = this.props;
      let _this = this;
      if(_this.cur_sel_data == 0){
          failTip(`${sldComLanguage('请选择物流公司')}`);
          return;
      }
      this.setState({ submiting: true });
      dispatch({
          type: 'express/add_express',
          payload: { expressIds: _this.cur_sel_data.join(',')},
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  _this.get_list({ pageSize: pageSize });
                  this.setState({
                      modalVisible: false,
                      formValues: {}
                  });
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
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


  render() {
      const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, search_data, scrToBottom } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1,padding:0 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["express_view"]} showPage>
                  <div className={global.tableListForm}>
                      <Search
                          search_data={search_data}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  <AuthBtn btnAuth={btnAuth} eventKey={["express_add"]} showPage>
                      <div className={global.operate_bg}>
                          {sldIconBtn(() => this.addExpress(), `${sldComLanguage('添加物流公司')}`, 7, 7)}
                      </div>
                  </AuthBtn>
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="bindId"
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
                  {/*新增/编辑对话框-start*/}
                  <SldModal
                      scrToBottom={scrToBottom}
                      title={title}
                      submiting={submiting}
                      width={700}
                      modalVisible={modalVisible}
                      sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                      sldHandleCancle={this.sldHandleCancle}
                      formItemLayoutModal={formItemLayoutModal}
                      content={addData}
                  />
                  {/*新增/编辑对话框-end*/}
              </AuthBtn>

          </div>

      );
  }
}
