/*
* 商品管理——在售商品
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
    sldPopConfirm,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldIconBtn,
    formItemLayoutModal,
    getSldListGoodsImg80
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

let pageSize = list_com_page_size_10;
@connect(({ point }) => ({
    point
}))
@Form.create()
export default class GoodsOfflineLists extends Component {
    goods_spec_columns = [
        {
            title: ' ',
            dataIndex: 'integralProductId',
            align: 'center',
            width: 30,
            render: (text, record, index) => index + 1
        },
        {
            title: `${sldComLanguage('商品规格')}`,
            dataIndex: 'specValues',
            align: 'center',
            width: 150,
            render: (text) => <div style={{ width: 200, wordBreak: 'normal', wordWrap: 'break-word' }}>{text}</div>
        },
        {
            title: `${sldComLanguage('价格(元)')}`,
            dataIndex: 'cashPrice',
            align: 'center',
            width: 150,
            render: (text, record) => `${record.integralPrice}${sldComLanguage('积分')}${text ? (` + ¥${ text}`) : ''}`
        },
        {
            title: `${sldComLanguage('库存')}`,
            dataIndex: 'productStock',
            align: 'center',
            width: 100,
            render: (text, record) => <span style={{
                color: record.warning ? '#FF490A' : '#696969',
                fontWeight: record.warning ? '700' : '500'
            }}
            >{text}</span>
        },
        {
            title: `${sldComLanguage('货号')}`,//货号
            dataIndex: 'productCode',
            align: 'center',
            width: 120
        },
        {
            title: `${sldComLanguage('条形码')}`,//条形码
            dataIndex: 'barCode',
            align: 'center',
            width: 120
        }
    ];

    constructor(props) {
        super(props);
        this.state = {
            modal_width:700,
            modalVisibleDetail: false,
            initLoading: false,
            submiting: false,
            show_foot: false,
            modalVisible: false,//是否显示规格弹框
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: `${sldComLanguage('商品规格')}`,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'goodsName',
                placeholder: `${sldComLanguage('请输入商品名称')}`
            },{
                type: 'input',
                label: `${sldComLanguage('商品货号')}`,
                name: 'goodsCode',
                placeholder: `${sldComLanguage('请输入商品货号')}`
            },{
                type: 'input',
                label: `${sldComLanguage('条形码')}`,
                name: 'barCode',
                placeholder: `${sldComLanguage('请输入商品条形码')}`
            }],
            view_spec_data: [{
                type: 'scroll_table',
                name: '',
                label: ``,
                width: 780,
                content: '',
                data: [],
                columns: this.goods_spec_columns,
                rowKey: 'integralProductId'
            }],//查看规格
            formValues: {},//搜索条件
            operateData: [],
            columns: [
                {
                    title: ' ',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('商品信息')}`,
                    dataIndex: 'mainImage',
                    align: 'center',
                    width: 250,
                    render: (text, record) => <div className={`${global.goods_info} ${global.com_flex_row_flex_start}`}>
                        <div className={global.goods_img}>{getSldListGoodsImg80(text)}</div>
                        <div className={`${global.com_flex_column_space_between} ${global.goods_detail}`}>
                            <span className={global.goods_name}>
                                {record.goodsName}
                            </span>
                            <span className={global.goods_brief}>
                                {record.goodsBrief}
                            </span>
                        </div>
                    </div>
                },
                {
                    title: `${sldComLanguage('商品价格')}`,
                    dataIndex: 'cashPrice',
                    align: 'center',
                    width: 100,
                    render: (text, record) => `${record.integralPrice}${sldComLanguage('积分')}${text ? (` + ¥${ text}`) : ''}`
                },
                {
                    title: `${sldComLanguage('商品库存')}`,
                    dataIndex: 'goodsStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('违规原因')}`,
                    dataIndex: 'offlineReason',
                    align: 'center',
                    width: 150,
                    render: (text, record) =>(text?text:'')+(record.offlineComment?(`,${record.offlineComment}`):'')
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {sldtbaleOpeBtnText(`${sldComLanguage('查看规格')}`, () => this.viewSpec(record))}
                            <span className={global.splitLine} />
                            <Link to={{
                                pathname: '/point/goods_list_to_add',
                                query: {
                                    id: record.integralGoodsId
                                }
                            }}
                            >
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                            </Link>
                        </Fragment>
                    )
                }
            ]
        };
    }


    componentDidMount() {
        this.get_list({ pageSize: pageSize });
    }

  // 查看规格
  viewSpec = (val) => {
      let { view_spec_data,operateData } = this.state;
      operateData = JSON.parse(JSON.stringify(view_spec_data));
      operateData[0].columns = this.goods_spec_columns;
      operateData[0].data = val.productList;
      this.setState({
          modalVisible: true,
          show_foot:false,
          title:`${sldComLanguage('查看规格')}`,
          modal_width:800,
          operateData
      });
  };

  //商品操作
  operateGoods = (id, type) => {
      this.setState({submiting:true});
      const { params } = this.state;
      const { dispatch } = this.props;
      let param_data = {};
      let dis_type = '';
      if (type == 'del') {
          dis_type = 'point/del_goods';
          param_data = id
      }
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              this.setState({submiting:false});
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
                  this.setState({
                      selectedRows: [],
                      selectedRowKeys: [],
                      modalVisible:false
                  })
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'point/get_goods_lists',
          payload: { ...params, state: 6 },
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
      for(let i in values){
          if(values[i] == ''){
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

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  render() {
      const { selectedRows, selectedRowKeys, search_data, columns, initLoading, data, modalVisible,operateData,title,modal_width,show_foot,submiting } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1,paddingTop:0 }}>
              <div className={global.tableListForm}>
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              {/*公共功能条-start*/}
              <div className={global.operate_bg}>
                  {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                      failTip(`${sldComLanguage('请先选中数据')}`);
                      //确认删除选中的商品吗？
                  }, `${sldComLanguage('删除')}`, 7, 0, 15, 15, 3, 'piliangshanchu', '#F21414') : sldPopConfirm('leftBottom', `${sldComLanguage('确认删除选中的商品吗？')}`, () => this.operateGoods({integralGoodsIds:selectedRowKeys.join(',')}, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('删除')}`, 7, 0, 15, 15, 3, 'piliangshanchu', '#F21414'), 0, 0, '#F21414')}
              </div>
              {/*公共功能条-end*/}
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      totalHeight={document.body.clientHeight- 240}
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="integralGoodsId"
                      isCheck
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
                  width={modal_width}
                  title={title}
                  submiting={submiting}
                  modalVisible={modalVisible}
                  sldHandleConfirm={null}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={operateData}
                  show_foot={show_foot}
              />
              { /*新增/编辑对话框-end*/}
          </div>

      );
  }
}
