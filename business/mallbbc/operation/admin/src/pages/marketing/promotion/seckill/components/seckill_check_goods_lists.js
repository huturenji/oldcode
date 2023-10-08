/*
* 秒杀活动待审核商品列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldIconBtn,
    sldPopConfirmDiy,
    getSldListGoodsImg80,
    formItemLayoutModal,
    list_com_page_more,
    sucTip,
    failTip,
    sldPopConfirm,
    isEmpty,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
//场次状态(审核状态:1-待审核,3-审核拒绝)
let verifyStateValue = { 0: "待店铺审核", 1: "待平台审核", 2: "审核通过",3:"审核拒绝" }
@connect(({ seckill }) => ({
    seckill
}))
@Form.create()
export default class SeckillCheckGoodsLists extends Component {
    goods_spec_columns = [
        {
            title: ' ',
            dataIndex: 'productId',
            align: 'center',
            width: 30,
            render: (text, record, index) => index + 1
        },
        {
            title: `${sldComLanguage('商品规格')}`,
            dataIndex: 'specValues',
            align: 'center',
            width: 200,
            render: (text) => <div style={{ width: 200, wordBreak: 'normal', wordWrap: 'break-word' }}>{text ? text : '默认'}</div>
        },
        {
            title: `${sldComLanguage('销售价(元)')}`,
            dataIndex: 'salePrice',
            align: 'center',
            width: 110
        },
        {
            title: `${sldComLanguage('商品库存')}`,
            dataIndex: 'skuStock',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('秒杀价(元)')}`,
            dataIndex: 'promotionPrice',
            align: 'center',
            width: 110
        },
        {
            title: `${sldComLanguage('秒杀库存')}`,
            dataIndex: 'promotionStock',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('限购数量')}`,
            dataIndex: 'upperLimit',
            align: 'center',
            width: 100,
            render: (text) => <div>{text?text:`${sldComLanguage('不限购')}`}</div>
        }
    ];
  
    cur_operate_data = {};//拒绝操作的参数
    
    constructor(props) {
        super(props);
        this.state = {
            modal_width: 500,
            modal_title: '',//modal弹框标题
            search_con: '',
            show_foot: false,
            initLoading: false,
            submiting: false,
            modalVisible: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            formValues: {verifyStates:[1,3]},//搜索条件
            refuseData: [{
                type: 'textarea',
                label: `${sldComLanguage('拒绝理由')}`,
                extra: `${sldComLanguage('最多输入100字')}`,
                name: 'rejectReason',
                placeholder: `${sldComLanguage('请输入拒绝理由')}`,
                initialValue: '',
                maxLength: 100,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入拒绝理由')}`
                }]
            }],//拒绝理由数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('店铺名称')}`,
                name: 'storeName',
                placeholder: `${sldComLanguage('请输入店铺名称')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入商品名称')}`
            }, {
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [1, 3], 
                label: `${sldComLanguage('审核状态')}`,
                name: 'verifyStates',
                placeholder: `${sldComLanguage('请选审核状态')}`,
                sel_data: [
                    { key: 1, name: '待平台审核' },
                    { key: 3, name: '审核拒绝' }
                ]
            }],
            columns: [
                {
                    title: ' ',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('商品图片')}`,
                    dataIndex: 'mainImage',
                    align: 'center',
                    width: 100,
                    render: (text) => getSldListGoodsImg80(text)
                },
                {
                    title: `${sldComLanguage('商品名称')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 100
                }, {
                    title: `${sldComLanguage('活动标签')}`,
                    dataIndex: 'labelName',
                    align: 'center',
                    width: 100
                }, {
                    title: `${sldComLanguage('参加场次')}`,
                    dataIndex: 'stageName',
                    align: 'center',
                    width: 100
                }, {
                    title: `${sldComLanguage('审核状态')}`,
                    dataIndex: 'verifyState',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 0:
                            return <DotTag type='pending'>待店铺审核</DotTag>
                        case 1:
                            return <DotTag type='pending'>待平台审核</DotTag>
                        case 2:
                            return <DotTag type='sucess'>审核通过</DotTag>
                        case 3:
                            return <DotTag type='failed'>审核拒绝</DotTag> 
                        default:
                            return ''
                        }
                    }
                }, {
                    title: `${sldComLanguage('拒绝理由')}`,
                    dataIndex: 'remark',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={["view_seckill"]} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('查看SKU')}`, () => this.viewSpec(record))}
                            </AuthBtn>
                            

                            {
                                record.verifyState != 3 &&
                                <Fragment>
                                    <AuthBtn eventKey={["audit_seckill_goods"]} btnAuth={btnAuth}>
                                        {/* 审核通过 */}
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('确定审核通过该商品吗')}`, () => this.operate({
                                            promotionIdBindProductIds:[record.productId],
                                            verifyState: 2
                                        }, 'pass'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('审核通过')}`, () => null))}
                                        {/* 审核拒绝 */}
                                        {sldtbaleOpeBtnText(`${sldComLanguage('审核拒绝')}`, () => this.refuse({
                                            promotionIdBindProductIds:[record.productId]
                                        }, 'single'))}
                                    </AuthBtn>
                                    
                                </Fragment>
                            }

                            {/*只有审核拒绝才可以删除*/}
                            {
                                record.verifyState == 3 &&
                                <Fragment>
                                    <AuthBtn eventKey={["delete_seckill_goods"]} btnAuth={btnAuth}>
                                        {
                                            sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate([record.productId], 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))
                                        }
                                    </AuthBtn>
                                </Fragment>
                            }
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
                columns: this.goods_spec_columns,
                rowKey: 'productId'
            }]//查看规格
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize, pageIndex:1,...this.state.formValues });
    }

  //审核拒绝 type:single 单个拒绝 more 批量拒绝
  refuse = (val, type) => {
      if (type == 'single') {
          this.cur_operate_data = val;
      } else {
          let findIndex = val.findIndex(item=>item.verifyState == 3)
          //列表上有2类商品，未审核的、审核失败的。 审核失败的 不让操作 审核。
          if(findIndex !=-1){
              failTip("请取消勾选审核失败的商品")
              return
          }        
          let param = {};
          param.promotionIdBindProductIds = [];
          val.forEach((item) => {
              param.promotionIdBindProductIds.push(item.productId);
          });
          this.cur_operate_data = param;
      }
      this.cur_operate_data.verifyState = 3;
      let { operateData, refuseData } = this.state;
      operateData = JSON.parse(JSON.stringify(refuseData));
      this.setState({
          modalVisible: true,
          operateData,
          modal_title: `${sldComLanguage('拒绝理由')}`,
          modal_width: 500,
          show_foot: true
      });
  };

  sldHandleConfirm = (val) => {
      this.cur_operate_data.rejectReason = val.rejectReason;
      this.operate(this.cur_operate_data, 'refuse');
  };

  //批量审核通过数据处理
  batchPassData = () => {
      const { selectedRows } = this.state;
      let findIndex = selectedRows.findIndex(item=>item.verifyState == 3)
      //列表上有2类商品，未审核的、审核失败的。 审核失败的 不让操作 审核成功。
      if(findIndex !=-1){
          failTip("请取消勾选审核失败的商品")
          return
      }
      let param = {};
      param.promotionIdBindProductIds = [];
      selectedRows.forEach((item) => {
          param.promotionIdBindProductIds.push(item.productId);
      });
      param.verifyState = 2;
      this.operate(param, 'pass');
  };

  //活动操作  del：删除 pass: 审核通过 refuse: 拒绝
  operate = (id, type) => {
      this.setState({ initLoading: true });
      const { params, formValues } = this.state;
      const { dispatch } = this.props;
      let dis_type = '';
      let param_data = {};
      if (type == 'del') {
          dis_type = 'seckill/del_goods';
          param_data.ids = id;
      } else if (type == 'pass' || type == 'refuse') {
          dis_type = 'seckill/check_goods';
          param_data = id;
      }
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.setState({
                      modalVisible: false,
                      selectedRows: [],
                      selectedRowKeys: []
                  });
                  this.cur_operate_data = {};
                  this.get_list({...params, ...formValues});
              } else {
                  failTip(res.msg);
                  this.setState({ initLoading: false });
              }
          }
      });
  };

  // 查看规格
  viewSpec = (val) => {
      const { dispatch } = this.props;
      let { operateData, view_spec_data } = this.state;
      //   dispatch({
      //       type: 'seckill/get_seckill_goods_sku_lists',
      //       payload: { pageSize: list_com_page_more, sku: val.sku, stageId: val.stageId,stageSkuId:val.stageSkuId },
      //       callback: (res) => {
      //           if (res.state == 200) {
      //               operateData = JSON.parse(JSON.stringify(view_spec_data));
      //               operateData[0].columns = this.goods_spec_columns;
      //               operateData[0].data = res.data.list;
      //               this.setState({
      //                   modalVisible: true,
      //                   operateData,
      //                   modal_title: `${sldComLanguage('查看商品SKU')}`,
      //                   modal_width: 900,
      //                   show_foot: false
      //               });
      //           } else {
      //               failTip(res.msg);
      //               return false;
      //           }
      //       }
      //   });
      operateData = JSON.parse(JSON.stringify(view_spec_data));
      operateData[0].columns = this.goods_spec_columns;
      operateData[0].data = [val];
      this.setState({
          modalVisible: true,
          operateData,
          modal_title: `${sldComLanguage('查看商品SKU')}`,
          modal_width: 900,
          show_foot: false
      });      
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'seckill/get_seckill_goods_lists',
          payload: { ...params, promotionId: this.props.query },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.setState({
                          // eslint-disable-next-line react/no-access-state-in-setstate
                          ...this.state.params,
                          current:params.current,
                          pageIndex:params.current
                      })
                      params.pageIndex = params.current 
                      this.get_list(params);
                  } else {
                      if (res.data.list.length > 0) {
                          res.data.list.forEach((item, index) => {
                              item.key = index;
                          });
                      }
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


  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      for (let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      if(isEmpty(values.verifyStates)){
          values.verifyStates = [1,3]
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize, pageIndex:1 }
      });
      //清空勾选的缓存数据
      this.setState({
          selectedRows: [],
          selectedRowKeys: []
      });
      this.cur_operate_data = {};    

      this.get_list({ pageSize: pageSize, ...values, pageIndex:1 });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {verifyStates:[1,3]},
          params: { pageSize: pageSize, pageIndex:1 }
      });
      //清空勾选的缓存数据
      this.setState({
          selectedRows: [],
          selectedRowKeys: []
      });
      this.cur_operate_data = {};   

      this.get_list({ pageSize: pageSize, pageIndex:1,verifyStates:[1,3] });
  };

  moreDel = (selectedRows)=>{
      let stageSkuIds = []
      selectedRows.forEach((item)=>{
          if(item.verifyState == 3){
              stageSkuIds.push(item.productId)
          }
      })
      if(stageSkuIds.length>0){
          this.operate(stageSkuIds, 'del')
      }else{
          failTip('请先选择审核拒绝的数据') 
      }
  }

  render() {
      const { selectedRows, columns, initLoading, data, search_data, modalVisible, operateData, submiting, modal_title, modal_width, show_foot, selectedRowKeys } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <div className={global.tableListForm}>
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              {/*公共功能条-start*/}
              <div
                  className={global.operate_bg}
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <AuthBtn eventKey={["audit_seckill_goods"]} btnAuth={btnAuth}>
                          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                              failTip(`${sldComLanguage('请先选中数据')}`);
                          //确认审核通过选中的商品吗？
                          }, `审核通过`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a') : sldPopConfirm('leftBottom', `${sldComLanguage('确认审核通过选中的商品吗？')}`, () => this.batchPassData(), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`, sldIconBtn(null, `${sldComLanguage('审核通过')}`, 7, 0, 19, 19, 3, 'shenhetongguo', '#0fb39a'), 0, 0, '#0fb39a')}

                          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                              failTip(`${sldComLanguage('请先选中数据')}`);
                          //确认审核拒绝选中的商品吗？
                          }, `审核拒绝`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920') : sldIconBtn(() => this.refuse(selectedRows, 'more'), `${sldComLanguage('审核拒绝')}`, 7, 0, 15, 15, 3, 'shenhejujue', '#fa0920')}
                      </AuthBtn>
                      <AuthBtn eventKey={["delete_seckill_goods"]} btnAuth={btnAuth}>
                          {selectedRowKeys.length == 0 ? sldIconBtn(() => {
                              failTip(`${sldComLanguage('请先选中数据')}`);
                          //确认审核拒绝选中的商品吗？
                          }, `批量删除`, 7, 0, 15, 15, 3, 'shanchu4', '#fa0920') : sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`,() => this.moreDel(selectedRows), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                              sldIconBtn(() => null, `${sldComLanguage('批量删除')}`, 7, 0, 15, 15, 3, 'shanchu4', '#fa0920'))}
                      </AuthBtn>
                      
                  </div>
              </div>
              {/*公共功能条-end*/}
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="key"
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
                  title={modal_title}
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
