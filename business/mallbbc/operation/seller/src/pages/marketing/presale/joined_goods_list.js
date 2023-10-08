/*
* 预售活动商品列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    failTip,
    sucTip,
    getTableNum,
    sldComLanguage,
    sldHandlePaginationData,
    dragSldTableColumn,
    sldtbaleOpeBtnText,
    sldIconBtnBg,
    sldLlineRtextAddGoods,
    list_com_page_size_10,
    getSldListGoodsImg80,
    sldPopConfirmDiy
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
const formItemLayoutModal = {
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 18
    }
};
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class SeckillGoodsLists extends Component {
  goods_spec_columns = [
      {
          title: '',
          dataIndex: 'presellId',
          align: 'center',
          width: 60,
          render: (text, record, index) => index + 1
      },
      {
          title: `${sldComLanguage('SKU规格')}`,
          dataIndex: 'specValues',
          align: 'center',
          width: 200,
          render: (text) => <div style={{ width: 200, wordBreak: 'normal', wordWrap: 'break-word' }}>{text ? text : `${sldComLanguage('默认')}`}</div>
      },
      {
          title: `${sldComLanguage('原价(￥)')}`,
          dataIndex: 'productPrice',
          align: 'center',
          width: 110
      },
      {
          title: `${sldComLanguage('商品库存')}`,
          dataIndex: 'stock',
          align: 'center',
          width: 100
      },
      {
          title: `${sldComLanguage('预售价(￥)')}`,
          dataIndex: 'presellPrice',
          align: 'center',
          width: 110
      },
      {
          title: `${sldComLanguage('预售定金(￥)')}`,
          dataIndex: 'firstMoney',
          align: 'center',
          width: 100
      },
      {
          title: `${sldComLanguage('预售库存')}`,
          dataIndex: 'presellStock',
          align: 'center',
          width: 100
      },
      {
          title: `${sldComLanguage('定金膨胀(￥)')}`,
          dataIndex: 'firstExpand',
          align: 'center',
          width: 100
      }
  ];

goods_spec_columns_all = [
    {
        title: '',
        dataIndex: 'presellId',
        align: 'center',
        width: 60,
        render: (text, record, index) => index + 1
    },
    {
        title: `${sldComLanguage('SKU规格')}`,
        dataIndex: 'specValues',
        align: 'center',
        width: 200,
        render: (text) => <div style={{ width: 200, wordBreak: 'normal', wordWrap: 'break-word' }}>{text ? text : `${sldComLanguage('默认')}`}</div>
    },
    {
        title: `${sldComLanguage('原价(￥)')}`,
        dataIndex: 'productPrice',
        align: 'center',
        width: 110
    },
    {
        title: `${sldComLanguage('商品库存')}`,
        dataIndex: 'stock',
        align: 'center',
        width: 100
    },
    {
        title: `${sldComLanguage('预售价(￥)')}`,
        dataIndex: 'presellPrice',
        align: 'center',
        width: 110
    },
    {
        title: `${sldComLanguage('预售库存')}`,
        dataIndex: 'presellStock',
        align: 'center',
        width: 100
    }
];

constructor(props) {
    super(props);
    this.state = {
        query: props.location.query,
        search_con: '',
        initLoading: false,
        submiting: false,
        modalVisible: false,
        data: {},//列表数据
        selectedRows: [],
        selectedRowKeys: [],//selectedRows的key
        title: '',
        type: 'add',//'add'新增  'edit'编辑
        params: { pageSize: pageSize },//搜索条件
        formValues: {},//搜索条件
        search_data: [{
            type: 'input',
            label: `${sldComLanguage('商品名称')}`,
            name: 'goodsName',
            placeholder: `${sldComLanguage('请输入商品名称')}`
        }],
        columns: [
            {
                title: '',
                dataIndex: 'goodsId',
                align: 'center',
                width: 55,
                render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
            },
            {
                title: `${sldComLanguage('商品信息')}`,
                dataIndex: 'goodsImage',
                align: 'center',
                width: 250,
                render: (text, record) => <div className={`${global.goods_info} ${global.com_flex_row_flex_start}`}>
                    <div className={global.goods_img}>{getSldListGoodsImg80(text)}</div>
                    <div className={`${global.com_flex_column_space_between} ${global.goods_detail}`}>
                        <span className={global.goods_name}>
                            {record.goodsName}
                        </span>
                    </div>
                </div>
            },
            {
                title: `${sldComLanguage('原价(￥)')}`,
                dataIndex: 'productPrice',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('预售价(￥)')}`,
                dataIndex: 'presellPrice',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('预售库存')}`,
                dataIndex: 'presellStock',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('已售件数')}`,
                dataIndex: 'saleNum',
                align: 'center',
                width: 100
            },
            {
                title: `${sldComLanguage('操作')}`,
                align: 'center',
                width: 100,
                render: (text, record) => (
                    <Fragment>
                        {sldtbaleOpeBtnText(`${sldComLanguage('查看规格')}`, () => this.viewSpec(record))}
                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除？')}`, () => this.operate(record,'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                            sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                    </Fragment>
                )
            }
        ],
        operateData: [],//查看规格数据
        view_spec_data: [{
            type: 'scroll_table',
            name: '',
            label: ``,
            width: 880,
            content: '',
            data: [],
            columns:  props.location.query.type==1?this.goods_spec_columns:this.goods_spec_columns_all,
            rowKey: 'presellGoodsId'
        }]//查看规格
    };
}

componentDidMount() {
    this.get_list({ pageSize: pageSize });
}
  
operate = (record) => {
    const { params, query } = this.state;
    const { dispatch } = this.props;
    let param_data = {};
    param_data.goodsId = record.goodsId
    param_data.presellId = query.id
    this.setState({ submiting: true });
    dispatch({
        type: 'promotion/del_presale_goods',
        payload: param_data,
        callback: (res) => {
            if (res.state == 200) {
                sucTip(res.msg);
                this.get_list(params);
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

  // 查看规格
  viewSpec = (val) => {
      let { operateData, view_spec_data, query } = this.state;
      operateData = JSON.parse(JSON.stringify(view_spec_data));
      operateData[0].columns = query.type==1?this.goods_spec_columns:this.goods_spec_columns_all;
      operateData[0].data = val.productList;
      this.setState({
          modalVisible: true,
          operateData
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { query } = this.state;
      dispatch({
          type: 'promotion/get_presale_joined_goods_lists',
          payload: { ...params, presellId: query.id },
          callback: (res) => {
              this.setState({ initLoading: false });
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


  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      for (let i in values) {
          if (values[i] == '') {
              delete values[i]
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
      const { selectedRows, columns, initLoading, data, search_data, modalVisible, operateData } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('活动商品')}`)}
                  {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
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
                      totalHeight={document.body.clientHeight - 155-15}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="goodsId"
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

              { /*新增/编辑对话框-start*/}
              <SldModal
                  width={900}
                  title={`${sldComLanguage('商品SKU')}`}
                  submiting={false}
                  modalVisible={modalVisible}
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={operateData}
                  show_foot={false}
              />
              { /*新增/编辑对话框-end*/}

          </div>

      );
  }
}
