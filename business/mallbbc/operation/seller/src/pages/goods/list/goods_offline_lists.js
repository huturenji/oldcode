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
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldIconBtn,
    formItemLayoutModal,
    getSldListGoodsImg80,
    list_com_page_more,
    getStorage,
    getAuthBtn,
    sldPopConfirm
} from '@/utils/utils';
import global from '@/global.less';
import styles from '../product.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const storeId = getStorage('storeId');
const goodsSource = getStorage('goodsSource'); //货品来源：1-接入；2-手工发布；3-接入&手工
let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class GoodsOfflineLists extends Component {

  goods_spec_columns = [
      {
          title: ' ',
          dataIndex: 'productId',
          align: 'center',
          width: 30,
          render: (text, record, index) => index + 1
      },
      {
          title: `${sldComLanguage('商品规格')}`,//商品规格
          dataIndex: 'specValues',
          align: 'center',
          width: 200,
          render: (text) => <div style={{width:200,wordBreak:'normal',wordWrap:'break-word'}}>{text}</div>
      },
      {
          title: `${sldComLanguage('价格(元)')}`,
          dataIndex: 'productPrice',
          align: 'center',
          width: 110
      },
      {
          title: `${sldComLanguage('库存')}`,
          dataIndex: 'productStock',
          align: 'center',
          width: 100,
          render: (text, record) => <span style={{color:record.warning?'#FF490A':'#696969',fontWeight:record.warning?'700':'500'}}>{text}</span>
      },
      {
          title: `${sldComLanguage('货号')}`,
          dataIndex: 'productCode',
          align: 'center',
          width: 120,
          render: (text) => text?text:'--'
      },
      {
          title: `${sldComLanguage('条形码')}`,
          dataIndex: 'barCode',
          align: 'center',
          width: 120,
          render: (text) => text?text:'--'
      }
  ];

  constructor(props) {
      super(props);
      this.state = {
          search_height:0,
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
              label: `${sldComLanguage('商品名称/sku')}`,
              name: 'keyword',
              placeholder: `${sldComLanguage('请输入商品名称/sku')}`
          },
          //   {
          //     type: 'input',
          //     label: `${sldComLanguage('货号spu')}`,
          //     name: 'goodsCode',
          //     placeholder: `${sldComLanguage('请输入货号spu')}`,
          //   },
          //   {
          //     type: 'input',
          //     label: `${sldComLanguage('条形码')}`,
          //     name: 'barCode',
          //     placeholder: `${sldComLanguage('请输入商品条形码')}`,
          //   },
          {
              type: 'tree_select',
              label: `${sldComLanguage('店铺分类')}`,
              name: 'storeCategoryId',
              placeholder: `${sldComLanguage('请选择店铺分类')}`,
              data: []
          }],
          view_spec_data: [{
              type: 'scroll_table',
              name: '',
              label: ``,
              width: 680,
              content: '',
              data: [],
              columns: this.goods_spec_columns,
              rowKey: 'productId'
          }],//查看规格
          formValues: {},//搜索条件
          //   addData:[{
          //     type: 'select',
          //     label: `${sldComLanguage('顶部版式')}`,
          //     name: 'topTemplateId',
          //     placeholder: `${sldComLanguage('请选择顶部关联版式')}`,
          //     sel_data: [],
          //     sele_key: 'templateId',
          //     sele_name: 'templateName',
          //     diy: true,
          //   },{
          //     type: 'select',
          //     label: `${sldComLanguage('底部版式')}`,
          //     name: 'bottomTemplateId',
          //     placeholder: `${sldComLanguage('请选择底部关联版式')}`,
          //     sel_data: [],
          //     sele_key: 'templateId',
          //     sele_name: 'templateName',
          //     diy: true,
          //   }],//设置关联版式的数据
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
                  render: (text, record) => <div className={`${styles.goods_info} ${global.com_flex_row_flex_start}`}>
                      <div className={styles.goods_img}>{getSldListGoodsImg80(text)}</div>
                      <div className={`${global.com_flex_column_space_between} ${styles.goods_detail}`}>
                          <span className={styles.goods_name}>
                              {record.skuName}
                          </span>
                          <span className={styles.goods_brief}>
                              {record.cidPath}
                          </span>
                          <span className={styles.goods_brief}>
                              {sldComLanguage('所属店铺：')}{record.storeName}
                          </span>
                      </div>
                  </div>
              },
              // {
              //   title: `${sldComLanguage('店铺分类')}`,
              //   dataIndex: 'storeInnerLabelList',
              //   align: 'center',
              //   width: 150,
              //   render: (text, record, index) => {
              //     return <div className={`${global.flex_column_center_center}`}>
              //       {text!=undefined&&text.length>0
              //         ?<Fragment>
              //           {text.map((item,index)=>{
              //             return <div key={index}>
              //               {item}
              //             </div>
              //           })}
              //         </Fragment>
              //         :'--'
              //       }
              //     </div>;
              //   },
              // },
              {
                  title: `${sldComLanguage('商品价格')}`,
                  dataIndex: 'salePrice',
                  align: 'center',
                  width: 100
              },
              // {
              //   title: `${sldComLanguage('商品库存')}`,
              //   dataIndex: 'goodsStock',
              //   align: 'center',
              //   width: 100,
              // },
              {
                  title: `${sldComLanguage('违规原因')}`,
                  dataIndex: 'offLineReason',
                  align: 'center',
                  width: 150,
                  render: (text, record) =>(text?text:'')+(record.offlineComment?(`,${record.offlineComment}`):'')
              },
              {
                  title: `${sldComLanguage('操作')}`,
                  align: 'center',
                  
                  width: 0,
                  render: (text, record) => (
                      <Fragment>
                          <AuthBtn eventKey={[`goods_list_offLine_edit`]} btnAuth={btnAuth}>
                              {goodsSource==1 && sldtbaleOpeBtnText(`${sldComLanguage('再次上架')}`, () => this.putGoods(record.sku))}
                          </AuthBtn>
                          {/* {sldtbaleOpeBtnText(`${sldComLanguage('查看规格')}`, () => this.viewSpec(record))} */}
                          {/* <span className={global.splitLine} /> */}
                          {
                              (goodsSource==2 || goodsSource==3) &&
                              <Link to={{
                                  pathname: '/goods/goods_list_to_add',
                                  query: {
                                      id: record.spu
                                  }
                              }}
                              >
                                  <AuthBtn eventKey={[`goods_list_offLine_edit`]} btnAuth={btnAuth}>
                                      {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => null)}
                                  </AuthBtn>
                              </Link>
                          }
                      </Fragment>
                  )
              }
          ]
      };
  }
  

  componentDidMount() {
      this.get_list({ pageSize: pageSize });
      this.getStoreCat();//获取店铺分类
      this.resize();
      window.addEventListener('resize', this.resize);
  }

  componentWillReceiveProps(nextProps) {
      if(nextProps.updateFlag == 'offline'){
          this.get_list({ pageSize: pageSize });
      }
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

  //获取店铺分类
  getStoreCat = () => {
      const { dispatch } = this.props;
      let { search_data } = this.state;
      let dis_type = 'product/get_store_category_list';
      let payload = { pageSize: list_com_page_more };
      dispatch({
          type: dis_type,
          payload: payload,
          callback: (res) => {
              if (res.state == 200 && res.data) {
                  let tmp_data = search_data.filter(item => item.name == 'storeCategoryId')[0];
                  for(let i = 0; i < res.data.length; i++) {
                      res.data[i].key = res.data[i].innerLabelId;
                      res.data[i].value = res.data[i].innerLabelId;
                      res.data[i].title = res.data[i].innerLabelName;
                      if (res.data[i].children != null && res.data[i].children.length > 0) {
                          res.data[i].children.forEach(item => {
                              item.key = item.innerLabelId;
                              item.value = item.innerLabelId;
                              item.title = item.innerLabelName;
                          });
                      }
                  }
                  tmp_data.data = res.data;
                  this.setState({ search_data });
              }
          }
      });
  };


  //设置关联版式
  setTemplate = () => {
      let {addData} = this.state;
      this.setState({
          operateData: JSON.parse(JSON.stringify(addData)),
          title:`${sldComLanguage('设置关联版式')}`,
          modal_width: 500,
          modalVisible: true,
          type: 'template',
          show_foot: true
      })
  }

  sldHandleConfirm = (val) => {
      const { selectedRowKeys } = this.state;
      val.goodsIds = selectedRowKeys.join(',');
      if(val.topTemplateId == undefined&&val.bottomTemplateId == undefined){
          failTip(`${sldComLanguage('请至少选择一个模版')}`);
          return false;
      }
      this.operateGoods(val,'template');
  };

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
          modal_width:700,
          operateData
      });
  };

  //上架商品
  putGoods = (ids,type=1) => {
      const { params,formValues } = this.state;
      const { dispatch } = this.props;
      this.operate_ids = ids;
      let val = {}
      if(type==2){
          let tempIDArr = this.operate_ids.split(",");
          val.skus = tempIDArr;
      }else{
          val.skus = [];
          val.skus.push(
              this.operate_ids,
          )
      }
      let param_data = {};
      let dis_type = 'product/put_goods';
      param_data = val;
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({...formValues,...params});
                  this.setState({
                      selectedRows: [],
                      selectedRowKeys: []
                  })
              } else {
                  failTip(res.msg);
              }
          }
      });
  }

  //商品操作
  operateGoods = (id, type) => {
      this.setState({submiting:true});
      const { params } = this.state;
      const { dispatch } = this.props;
      let param_data = {};
      let dis_type = '';
      if (type == 'lockup') {
          dis_type = 'product/lockup_goods';
          param_data = id;
      } else if (type == 'recommend') {
          dis_type = 'product/set_goods_recommend';
          param_data = id
      } else if (type == 'del') {
          dis_type = 'product/del_goods';
          param_data = id
      } else if (type == 'template') {
          dis_type = 'product/set_related_template';
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
          type: 'product/get_offLine_goods_lists',
          payload: { ...params,pageIndex:(params.current || 1),storeId:storeId },
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

  //搜索事件
  search = (data) => {
      const values = { ...data };
      for(let i in values) {
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
      const { selectedRows, selectedRowKeys, search_data, columns, initLoading, data, modalVisible,operateData,title,modal_width,show_foot,submiting, search_height } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1,padding:0 }}>
              <div className={global.tableListForm} ref="search_part">
                  <Search
                      search_data={search_data}
                      seaSubmit={(data1) => this.search(data1)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              {/*公共功能条-start*/}
              <div className={global.operate_bg}>
                  <AuthBtn eventKey={[`goods_list_offLine_edit`]} btnAuth={btnAuth}>
                      {goodsSource==1 && (selectedRowKeys.length == 0 ? sldIconBtn(() => {
                          failTip(`${sldComLanguage(`${sldComLanguage('请先选中数据')}`)}`);//请先选中数据
                          //确认下架选中的商品吗？
                      }, `${sldComLanguage('批量再次上架')}`, 7, 0, 15, 15, 3, 'ziyuan31', '#f9a006') : sldIconBtn(() => this.putGoods(selectedRowKeys.join(','),2), `${sldComLanguage('批量再次上架')}`, 7, 0, 15, 15, 3, 'ziyuan31', '#f9a006'))}
                  </AuthBtn>

                  {/* {(goodsSource==2 || goodsSource==3) && (selectedRowKeys.length == 0 ? sldIconBtn(() => {
                      failTip(`${sldComLanguage('请先选中数据')}`);
                      //确认删除选中的商品吗？
                  }, `${sldComLanguage('删除')}`, 7, 0, 15, 15, 3, 'piliangshanchu', '#F21414') : sldPopConfirm('leftBottom', `${sldComLanguage('确认删除选中的商品吗？')}`, () => this.operateGoods({skus:selectedRowKeys}, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('删除')}`, 7, 0, 15, 15, 3, 'piliangshanchu', '#F21414'), 0, 0, '#F21414'))} */}
              </div>
              {/*公共功能条-end*/}
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      totalHeight={document.body.clientHeight - 190 - search_height - 15}
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="sku"
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
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
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
