import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin } from 'antd';
import {
    dragSldTableColumn,
    sldHandlePaginationData,
    list_com_page_size_10,
    sldComLanguage,
    dateFormat,
    getTableNum,
    getSldListGoodsImg80,
    sldtbaleOpeBtnText,
    failTip,
    formItemLayoutModal,
    deepCopy
} from '@/utils/utils';
import global from '@/global.less';
import order from '../../order.less';
import Search from '@/components/Search/Search';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';

let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-unused-vars
let comm_cur_page = 1;//当前页数
// eslint-disable-next-line no-shadow
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class RepairLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_height:0,
            preview_img: '',//预览的图片
            preview_alt_con: '', //预览图片的title，鼠标悬浮展示的内容
            show_preview_modal: false,//预览图片modal 是否展示
            loading: false,
            submiting: false,
            modalVisible: false,
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('订单号')}`,//订单号
                name: 'orderSn',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('订单号')}`//请输入订单号
            }, {
                type: 'input',
                label: `${sldComLanguage('售后编号')}`,//售后编号
                name: 'afsSn',
                placeholder: `${sldComLanguage('请输入售后编号')}`//请输入售后编号
            }, {
                type: 'input',
                label: `${sldComLanguage('会员名')}`,//会员名
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名')}`//请输入会员名
            }, {
                type: 'input',
                label: `${sldComLanguage('店铺名称')}`,//店铺名称
                name: 'storeName',
                placeholder: `${sldComLanguage('请输入店铺名称')}`//请输入店铺名称
            }, {
                type: 'select',
                label: `${sldComLanguage('退款方式')}`,
                name: 'returnType',
                placeholder: `${sldComLanguage('请选择退款方式')}`,//请选择退款方式
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name:  `${sldComLanguage('仅退款')}`},
                    { key: '2', name:  `${sldComLanguage('退货退款')}`}
                ]
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('申请时间')}`,
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
                placeholder2: `${sldComLanguage('结束时间')}`//结束时间
            },
            {
                type: 'select',
                label: `${sldComLanguage('售后状态')}`,
                name: 'state',
                placeholder: `${sldComLanguage('请选择售后状态')}`,//请选择售后状态
                sel_data: [
                    { key: '', name:  `${sldComLanguage('全部')}`},
                    { key: '100', name:  `${sldComLanguage('待商家审核')}`},
                    { key: '201', name: `${sldComLanguage('待返件')}` },
                    { key: '102', name:  `${sldComLanguage('待商家收货')}`},
                    { key: '202', name: `${sldComLanguage('售后关闭')}` },
                    { key: '203', name:  `${sldComLanguage('待平台处理')}`},
                    { key: '300', name: `${sldComLanguage('售后成功')}` }
                ]
            }
            ],
            formValues: {},//搜索条件
            operateData: [], // 模态框内容
            detailData: [{
                type: 'show_content',
                name: 'afsSn',
                label: `${sldComLanguage('售后编号')}`,//售后编号
                content: ''
            }, {
                type: 'show_content',
                name: 'orderSn',
                label: `${sldComLanguage('订单号')}`,//订单号
                content: ''
            }, {
                type: 'show_content',
                name: 'stateValue',
                label: `${sldComLanguage('售后状态')}`,//售后状态
                content: ''
            }, {
                type: 'show_content',
                name: 'skuName',
                label: `${sldComLanguage('申请商品')}`,//申请商品
                content: ''
            }, {
                type: 'show_content',
                name: 'afsNum',
                label: `${sldComLanguage('维修数量')}`,//维修数量
                content: ''
            }, {
                type: 'show_content',
                name: 'memberName',
                label: `${sldComLanguage('会员名')}`,//会员名
                content: ''
            }, {
                type: 'show_content',
                name: 'applyReasonContent',
                label: `${sldComLanguage('维修原因')}`,//维修原因
                content: ''
            }, {
                type: 'show_img_more',
                name: 'applyImageList',
                label: `${sldComLanguage('售后凭证')}`,//售后凭证
                content: [],
                width: 75,
                height: 75,
                preView: this.viewImg
            }, {
                type: 'show_content_map',
                name: 'returnLogList',
                label: `${sldComLanguage('售后明细')}`,//售后明细
                content: []
            }],//额外展开的信息
            supply_info:[
                {
                    type: 'show_content',
                    name: 'orderId',
                    label: `${sldComLanguage('供应商订单号')}`,
                    content: ''
                },
                {
                    type: 'show_content',
                    name: 'afsServiceId',
                    label: `${sldComLanguage('供应商售后单号')}`,
                    content: ''
                },
                {
                    type: 'show_content',
                    name: 'afsApplyTime',
                    label: `${sldComLanguage('申请时间')}`,
                    content: ''
                },
                {
                    type: 'show_content',
                    name: 'afsServiceStepName',
                    label: `${sldComLanguage('供应商处理环节')}`,
                    content: ''
                },
                {
                    type: 'show_content',
                    name: 'processResultName',
                    label: `${sldComLanguage('供应商处理结果')}`,
                    content: ''
                }
            ],
            columns: [{
                title: '',
                dataIndex: 'afsSn',
                align: 'center',
                width: 55,
                render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
            }, {
                title: `${sldComLanguage('商品信息')}`,//商品信息
                dataIndex: 'mainImage',
                align: 'center',
                width: 200,
                render: (text, record) => <div className={`${order.goods_info} ${global.com_flex_row_flex_start}`}>
                    <div className={order.goods_img}>{getSldListGoodsImg80(text)}</div>
                    <div className={`${global.com_flex_column_space_between} ${order.goods_detail}`}>
                        <span className={order.goods_name}>
                            {record.skuName}
                        </span>
                        <span className={order.goods_brief}>
                            {sldComLanguage('订单编号')}：{record.orderSn}
                        </span>
                        <span className={order.goods_brief}>
                            {sldComLanguage('售后编号')}：{record.afsSn}
                        </span>
                    </div>
                </div>
            },{
                title: `${sldComLanguage('店铺名称')}`,
                dataIndex: 'storeName',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('会员名')}`,
                dataIndex: 'memberName',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('售后状态')}`,
                dataIndex: 'stateValue',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('申请时间')}`,
                dataIndex: 'applyTime',
                align: 'center',
                width: 100
            }, {
                title: `${sldComLanguage('操作')}`,//操作
                align: 'center',
                width: 100,
                render: (text, record) => sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.get_detail(record))
            }]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.updateFlag == '1'){
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

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'order/get_refund_list',
          payload: { ...params,afsType:4 },
          callback: (res) => {
              this.setState({ loading: false });
              this.props.setUpdateFlag('');
              if (res.state == 200) {
                  if (params.current > 1 && res.data.list.length == 0 && this.state.params.current > 1) {
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

  //获取售后单详情
  get_detail = (val) => {
      this.setState({ loading: true });
      let { detailData, title,operateData, supply_info } = this.state;
      const { dispatch } = this.props;
      // 用于展示的模态框内容需每次进来要备份detailData,因为直接操作detailData会动态的增加内容,会导致detailData的内容重复越来越多
      operateData = deepCopy(detailData)
      let operateSupply_info = JSON.parse(JSON.stringify(supply_info));
      dispatch({
          type: 'order/get_refund_detail',
          payload: { afsSn: val.afsSn },
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  const { supplierOrderSn,spDetail } = res.data
                  operateData = operateData.filter(item=>item.name != 'platformRemark');
                  for (let i = 0;i<operateData.length;i++) {
                      if (operateData[i].name != 'show_subtitle') {
                          if(operateData[i].name == 'applyReasonContent'){
                              operateData[i].content = res.data[operateData[i].name]+(res.data.afsDescription?(`,${res.data.afsDescription}`):'');
                          }else{
                              if(operateData[i].name == 'stateValue'){
                                  if(res.data.state == 300&&res.data.platformRemark){
                                      operateData.splice(i+1,0,{
                                          type: 'show_content',
                                          name: 'platformRemark',
                                          label: `${sldComLanguage('平台审核备注')}`,
                                          content: res.data.platformRemark
                                      });
                                  }
                              }
                              operateData[i].content = res.data[operateData[i].name];
                          }
                      }
                  }
                  // 如果供应商存在 要在下面加上供应商信息
                  if(supplierOrderSn&&spDetail){
                      operateSupply_info.forEach((item)=>{
                          item.content = spDetail[item.name]
                      })
                      if(spDetail.serviceTrackInfoDTOs && spDetail.serviceTrackInfoDTOs.length>0){
                          operateSupply_info.push({
                              type: 'timeline_info',
                              label: `${sldComLanguage('进度条')}`,
                              content: {
                                  name:'供应商处理流程',
                                  infoList:spDetail.serviceTrackInfoDTOs
                              }
                          })
                      }
                      operateData = operateData.concat(operateSupply_info)
                  }
          

                  title = `${sldComLanguage('维修详情')}`;
                  this.setState({ operateData, modalVisible: true, title });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      if (type == 'main') {
          const { formValues } = this.state;
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          comm_cur_page = pagination.current;
          pageSize = params.pageSize;
          this.setState({
              params: params
          });
          this.get_list(params);
      }
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      //时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_create_time = '';
      }
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

  //搜索点击
  moreSearchToggle = () => {
      const {search_height} = this.state;
      if(this.refs.search_part!=undefined){
          if(this.refs.search_part.clientHeight != search_height){
              this.setState({search_height:this.refs.search_part.clientHeight})
          }
      }
  }

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
      this.setState({
          preview_img: img,
          preview_alt_con: text,
          show_preview_modal: flag
      });
  };

  render() {
      const { search_data, data, loading, columns, operateData, submiting, modalVisible, title, preview_img, show_preview_modal, preview_alt_con, search_height } = this.state;
      return (
          <div style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}>
              <div>
                  <div className={global.tableListForm} ref="search_part">
                      <Search
                          search_data={search_data}
                          moreSearchToggle={() => this.moreSearchToggle()}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>

                  <Spin spinning={loading}>
                      <StandardTable
                          totalHeight={document.body.clientHeight - 135-search_height-15}
                          data={data}
                          rowKey="afsSn"
                          isCheck={false}
                          columns={columns}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize
                          showMarkColor
                      />
                  </Spin>

              </div>
              {/*新增/编辑对话框-start*/}
              <SldModal
                  title={title}
                  submiting={submiting}
                  width={600}
                  modalVisible={modalVisible}
                  sldHandleConfirm={null}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={operateData}
                  show_foot={false}
              />
              {/*新增/编辑对话框-end*/}
              {/*图片预览-start*/}
              <SldPreviewImg
                  img={preview_img}
                  show_preview_modal={show_preview_modal}
                  modal_width={600}
                  preview_alt_con={preview_alt_con}
                  closePreviewModal={() => this.viewImg(false)}
              />
              {/*图片预览-end*/}
          </div>

      );
  }
}
