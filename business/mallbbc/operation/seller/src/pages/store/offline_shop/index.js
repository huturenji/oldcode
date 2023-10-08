import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import Link from 'umi/link';
import { Form, Spin } from 'antd';
import {
    failTip,
    sucTip,
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldPopConfirmDiy,
    getAuthBtn,
    sldIconBtn,
    sldLlineRtextAddGoodsAddMargin
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import router from 'umi/router';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ store }) => ({
    store
}))
@Form.create()
export default class MsgLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            params: { pageSize: pageSize },//搜索条件
            search_data: [
                {
                    type: 'input',
                    label: '关键字',
                    name: 'name',
                    placeholder: '请输入门店名称'
                }, 
                {
                    type: 'select',
                    label: '门店状态',
                    name: 'state',
                    placeholder: '请选择门店状态',
                    sel_data: [
                        { key: '', name: `${sldComLanguage('全部')}` },
                        { key: '1', name: `${sldComLanguage('已启用')}` },
                        { key: '-1', name: `${sldComLanguage('已停用')}` }
                    ]
                }],
            formValues: {},//搜索条件
            columns: [
                {
                    title: '门店ID',
                    dataIndex: 'id',
                    align: 'center',
                    width: 200
                },
                {
                    title:'门店名称',
                    dataIndex: 'shopName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '门店地址',
                    dataIndex: 'address',
                    align: 'center',
                    width: 100
                },
                {
                    title: '门店状态',
                    dataIndex: 'state',
                    align: 'center',
                    width: 150,
                    render: (text) => {
                        switch(text) {
                        case 1:
                            return <DotTag type='sucess'>已启用</DotTag>
                        case -1:
                            return <DotTag type='failed'>已停用</DotTag>
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
                            {
                                <AuthBtn btnAuth={btnAuth} eventKey={["offline_shop_edit"]}>
                                    <Fragment>
                                        {sldPopConfirmDiy('leftBottom', `是否确定${record.state==1?'停用':'启用'}`, () => this.operate(record), '确定', '取消',
                                            sldtbaleOpeBtnText(`${record.state==1?'停用':'启用'}`, () => null))}
                                    </Fragment>
                                </AuthBtn>
                                
                            }

                            {/* 启用可以查看 */}
                            {
                                record.state==1 && 
                                <Link to={{
                                    pathname: '/store/offline_shop_view',
                                    query: {
                                        id: record.id
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`查看`, () => null)}
                                </Link>
                            }
                            {/* 停用可以编辑 */}
                            <AuthBtn btnAuth={btnAuth} eventKey={["offline_shop_edit"]}>
                                {
                                    record.state==-1 && 
                                <Link to={{
                                    pathname: '/store/offline_shop_add',
                                    query: {
                                        id: record.id
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`编辑`, () => null)}
                                </Link>
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

  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'offline_shop/get_offlineShop_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if ((res.data.list == null || res.data.list.length == 0) && this.state.params.current > 1) {
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

  operate = (record) => {
      const {id,state} = record
      const { params } = this.state;
      const { dispatch } = this.props;
      let param_data = {id,state:state==1?-1:1};
      this.setState({ initLoading: true });
      dispatch({
          type: 'offline_shop/change_state',
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
              } else {
                  failTip(res.msg);
              }
              this.setState({initLoading : false });
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

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["offline_shop_view"]} showPage>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', '门店管理', 0, 0, 10)}
                  <div className={global.tableListForm}>
                      <Search
                          search_data={search_data}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  {/*公共功能条-start*/}
                  <AuthBtn btnAuth={btnAuth} eventKey={["offline_shop_add"]}>
                      <div className={global.operate_bg}>
                          <Link to={{
                              pathname: '/store/offline_shop_add'
                          }}
                          >
                              {
                                  sldIconBtn(() => null, `${sldComLanguage('新增门店')}`, 7, 0, 12, 12, 3, 'fabu1', '#08A9B7')
                              }
                          </Link>
                      </div>
                  </AuthBtn>
                  {/*公共功能条-end*/}
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          totalHeight={document.body.clientHeight - 200}
                          bordered={false}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="id"
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
