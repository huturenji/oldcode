//退款详情
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Modal, Table,Timeline,InputNumber,Input,Select,Button } from 'antd';
import Link from 'umi/link';
import {
    sldCommonTitle,
    list_com_page_size_10,
    sldLlineRtextAddGoods,
    getSldHorLine,
    sldIconBtnBg,
    getSldListGoodsImg80,
    sucTip,
    failTip,
    formItemLayoutModal,
    list_com_page_more,
    getSldEmptyH,
    enumPickType,
    sldComLanguage,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import { Scrollbars } from 'react-custom-scrollbars';
import StandardTable from '@/components/StandardTable';
import order from './order.less';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const { Option } = Select;
const { TextArea } = Input;
const FormItem = Form.Item;

const afsTypeEnum = {
    "1":'退货',
    "2":'换货',
    "4":'维修'
}
const state_color = {
    default:'#999999',
    current:'#FF711E',
    pass:'rgba(255, 109, 31, .6)'
}
const time_color = {
    default:'rgba(153, 153, 153, .5)',
    current:'#FF711E',
    pass:'rgba(255, 109, 31, .5)'
}
const line_color = {
    default:'#eee',
    current:'#FF711E',
    pass:'rgba(255, 109, 31, .3)'
}
let pageSize = list_com_page_size_10;
let afsTypeText = '';
let agreeLock = false; // 客服审核锁
@connect(({ service }) => ({
    service
}))
@Form.create()
export default class AfterSalesDetail extends Component {
    columns_order_goods = [
        {
            title: ' ',
            align: 'center',
            width: 30,
            render: (text, record, index) => index * 1 + 1
        },
        {
            title: `${sldComLanguage('商品信息')}`,
            dataIndex: 'mainImage',
            align: 'center',
            width: 500,
            render: (text, record) => <div className={`${order.goods_info} ${global.com_flex_row_flex_start}`}>
                <div className={order.goods_img}>{getSldListGoodsImg80(text)}</div>
                <div className={`${global.com_flex_column_space_between} ${order.goods_detail}`}>
                    <span className={order.goods_name} style={{ marginTop: 6, width: 380 }} title={record.skuName}>
                        {record.skuName}
                    </span>
                    <span className={order.goods_brief} title={record.specValue}>
                        {record.specValues}
                    </span>
                </div>
            </div>
        },
        {
            title: `${sldComLanguage('商品单价(元)')}`,
            dataIndex: 'productShowPrice',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage(`${afsTypeText}数量`)}`,
            dataIndex: 'afsNum',
            align: 'center',
            width: 100
        }, {
            title: `${sldComLanguage('退款金额(元)')}`,
            dataIndex: 'returnMoneyAmount',
            align: 'center',
            width: 100
        }
    ];//订单商品表头

    constructor(props) {
        super(props);
        let locationAfsType = props.location.query.afsType
        afsTypeText = afsTypeEnum[locationAfsType]; //售后类型
        const order_data = [
            {
                type: 'show_text',
                label: `${sldComLanguage('订单号')}`,
                name: 'orderSn',
                extra: ``,
                item_height: 42,
                text: ``
            }, 
            {
                type: 'show_text',
                label: `${sldComLanguage('售后编号')}`,
                name: 'afsSn',
                extra: ``,
                item_height: 42,
                text: ``
            }, 
            {
                type: 'show_text',
                label: `${sldComLanguage('退款金额(元)')}`,
                name: 'returnMoneyAmount',
                extra: ``,
                item_height: 42,
                text: ``
            }, 
            {
                type: 'show_text',
                label: `${sldComLanguage(`${afsTypeText}原因`)}`,
                name: 'applyReasonContent',
                extra: ``,
                item_height: 42,
                text: ``
            }, 
            {
                type: 'show_text',
                label: `${sldComLanguage('售后类型')}`,
                name: 'afsTypeValue',
                extra: ``,
                item_height: 42,
                text: ``
            }, 
            {
                type: 'show_text',
                label: `${sldComLanguage('会员')}`,
                name: 'memberName',
                extra: ``,
                item_height: 42,
                text: ``
            }, 
            {
                type: 'show_text1',
                label: `${sldComLanguage(`${afsTypeText}说明`)}`,
                name: 'afsDescription',
                extra: ``,
                item_height: 42,
                text: ``
            },
            {
                type: 'show_text',
                label: `商品退回`,
                name: 'pickWareMethod',
                extra: ``,
                item_height: 42,
                text: ``
            }
        ];
        // 换货,维修的表格和售后信息去掉金额项
        if(locationAfsType==2||locationAfsType==4){
            this.columns_order_goods.splice(-1)
            order_data.splice(2,1)
        }
        console.log(this.state)

        this.state = {
            show_preview_modal: false,//预览图片modal框是否展示
            preview_img: '',//预览图片
            preview_alt_con: '',//预览图片内容
            modal_width: 700,//modal框的宽度
            show_foot: true,//是否展示modal框的底部操作按钮
            title: '',//modal框title
            submiting: false,
            modalVisible: false,
            query: props.location.query,
            afsTypeText:afsTypeText, // 售后类型
            params: { pageSize: pageSize },//搜索条件
            order_return_img_data: [{
                type: 'show_goods_img_more',
                label: `${sldComLanguage('售后凭证')}`,
                name: 'imgMore',
                extra: ``,
                item_height: 140,
                data: [],
                preView: this.preView
            }],//退款凭证信息数据
            order_return_data: order_data ,//订单信息
            supply_info:[
                {
                    type: 'show_text',
                    label: `${sldComLanguage('供应商订单号')}`,
                    name: 'orderId',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage('供应商售后单号')}`,
                    name: 'afsServiceId',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage('申请时间')}`,
                    name: 'afsApplyTime',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage(' 供应商处理环节')}`,
                    name: 'afsServiceStepName',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage(' 供应商处理结果')}`,
                    name: 'processResultName',
                    extra: ``,
                    item_height: 42,
                    text: ``
                }

            ],// 供应商信息
            sp_return_info:[
                {
                    type: 'show_text',
                    label: `${sldComLanguage('售后单的实付金额')}`,
                    name: 'payAmount',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage('结算价')}`,
                    name: 'spSettleAmount',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage('供应商退款')}`,
                    name: 'spRefundAmount',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage('退款')}`,
                    name: 'refundAmount',
                    extra: ``,
                    item_height: 42,
                    text: ``
                },
                {
                    type: 'show_text',
                    label: `${sldComLanguage('供应商退款时间')}`,
                    name: 'spRefundTime',
                    extra: ``,
                    item_height: 42,
                    text: ``
                }

            ],// 供应商退款信息
            goods_detail_data: {},//商品详情数据
            operateData: [],//modal框数据
            return_progress_data: [],//退货进度数据
            goods_InfoColumon: [{
                title: '商品信息',
                dataIndex: 'goodsImage',
                align: 'left',
                render: (text, record) => <div className={`${order.goods_info1} ${global.com_flex_row_flex_start}`}>
                    <div className={order.goods_img}>{getSldListGoodsImg80(text)}</div>
                    <div className={`${global.com_flex_column_space_between} ${order.goods_detail}`}>
                        <span className={order.goods_name}>
                            {record.skuName}
                        </span>
                    </div>
                </div>
            }, {
                title: `${sldComLanguage('商品单价')}`,
                dataIndex: 'productCode',
                align: 'center'
            }, {
                title: `${sldComLanguage('退款数量')}`,
                dataIndex: 'afsNum',
                align: 'center'
            }, {
                title: `${sldComLanguage('退款金额(元)')}`,
                dataIndex: 'returnAmount',
                align: 'center'
            }], //商品信息
            addressList: [], //地址列表
            isagress: false,
            islocalModalVisible: false,
            selectedRowKeys: [],
            addressColu: [{
                title: `${sldComLanguage('请选择收货地址')}`,
                dataIndex: 'areaInfo',
                align: 'left',
                render: (text, record) => <div>
                    <span>{text}</span><span>{record.address}</span>
                </div>
            }],
            reutrnType: 0,
            isflowVisible: false,
            expressModalVisible:false,
            expressList:[],
            progressWidth:0
        };
    }


    componentDidMount() {
        const { query } = this.state;
        this.get_address_list({ pageSize: list_com_page_more });
        this.get_return_detail(query.afsSn);
        this.get_express_list();
        this.setState({progressWidth:this.progress.clientWidth})
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () =>{
      if(this.progress){
          console.log(this.progress.clientWidth)
          this.setState({progressWidth:this.progress.clientWidth})
      }
  }

  //预览图片
  preView = (flag, info) => {
      this.viewImg(flag, info);
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
      this.setState({
          preview_img: img,
          preview_alt_con: text,
          show_preview_modal: flag
      });
  };

  //获取买家退货地址
  get_address_list = (params) => {
      const { dispatch } = this.props;
      let { selectedRowKeys } = this.state;
      dispatch({
          type: 'service/get_return_address_lists',
          payload: { ...params, type: 2 },
          callback: res => {
              if (res.state == 200) {
                  //设置默认选中的数据
                  for(let i=0;i<res.data.list.length;i++){
                      if (res.data.list[i].isDefault == 1) {
                          selectedRowKeys = [res.data.list[i].addressId];
                          break;
                      }
                  }
                  this.setState({
                      addressList: res.data.list,
                      selectedRowKeys
                  });
              }
          }
      });
  };

  // 获取物流公司
  get_express_list = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'service/getExpressList',
          payload: { pageSize:1000},
          callback: res => {
              if (res.state == 200) {
                  this.setState({
                      expressList: res.data.list
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  showExpress = () => {
      this.setState({
          expressModalVisible:true
      });
  }

  closeExpress = ()=>{
      this.setState({
          expressModalVisible:false
      });
  }

  //获取退货详情
  get_return_detail = (id) => {
      const { dispatch } = this.props;
      let { order_return_data, goods_detail_data, return_progress_data, order_return_img_data,supply_info,sp_return_info } = this.state;
      dispatch({
          type: 'service/get_refund_detail',
          payload: { afsSn: id },
          callback: async (res) => {
              if (res.state == 200) {
                  goods_detail_data = res.data;
                  goods_detail_data.returnType = 2;
                 
                  //订单信息
                  // for (let reagent in order_return_data) {change by wbb
                  for(let reagent=0;reagent<order_return_data.length;reagent++){
                      if(order_return_data[reagent].name=='pickWareMethod'){
                          let value = goods_detail_data[order_return_data[reagent].name]
                          let text = '--'
                          if(value==enumPickType.pickUp){
                              text = '上门取件'
                          }else if(value==enumPickType.mail){
                              text = '客户邮寄'
                          }else if(value==enumPickType.send){
                              text = '客户送货'
                          }
                          order_return_data[reagent].text = text
                      }else{
                          order_return_data[reagent].text = goods_detail_data[order_return_data[reagent].name];
                      }
                  }

                  // 供应商信息
                  if(goods_detail_data.supplierOrderSn&&goods_detail_data.spDetail){
                      supply_info.forEach((item)=>{
                          item.text = goods_detail_data.spDetail[item.name]
                      })
                  }
                  // 供应商退款信息
                  if(goods_detail_data.supplierOrderSn&&goods_detail_data.refundExtendsInfo){
                      sp_return_info.forEach((item)=>{
                          item.text = (goods_detail_data.refundExtendsInfo[item.name]!=null) ? goods_detail_data.refundExtendsInfo[item.name]:'--'
                      })
                  }
                  order_return_img_data[0].data = [];//清空数据，防止操作完成之后数据追加
                  if (res.data.applyImageList.length > 0) {
                      res.data.applyImageList.forEach(item => {
                          order_return_img_data[0].data.push({ imageUrl: item });
                      });
                  }
                  // 处理售后流程, 加上图标
                  goods_detail_data.afsLogList && goods_detail_data.afsLogList.forEach(element => {
                      let img = null
                      try {
                          if(element.icon=='apply'){
                              // eslint-disable-next-line import/no-dynamic-require
                              img = require(`@/assets/return/${element.icon}_${goods_detail_data.afsType}_${element.state}.png`);
                          }else{
                              // eslint-disable-next-line import/no-dynamic-require
                              img = require(`@/assets/return/${element.icon}_${element.state}.png`);
                          }
                      } catch (error) {
                          img = require(`@/assets/return/default.png`);
                      }
                      return element.img = img
          
                  });
                  return_progress_data = res.data.afsLogList||[];

                  this.setState({
                      loading: false,
                      order_return_data,//订单信息
                      supply_info, //供应商信息
                      sp_return_info, //供应商退款信息
                      goods_detail_data,
                      return_progress_data,
                      order_return_img_data
                  });
              }
          }
      });
  };

  subExpress = () => {
      const { dispatch,form } = this.props;
      const { validateFieldsAndScroll } =form;
      const { goods_detail_data,expressList } = this.state;
      const { afsSn } = goods_detail_data;
      let params = {
          afsSn
      };

      validateFieldsAndScroll((err, values) => {
          if (!err) {
              const {expressCode,deliveryNumber} = values
              console.log(expressList)
              expressList.forEach((item)=>{
                  if(item.expressCode == expressCode ){
                      params.expressName = item.expressName;
                      params.expressCode = item.expressCode;
                  }
              })
              params.deliveryNumber = deliveryNumber;
              console.log(params)
          }
      });
      dispatch({
          type: 'service/submitMaintainExpress',
          payload: params,
          callback: res => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.setState({
                      expressModalVisible:false
                  });
                  this.get_return_detail(afsSn);
              } else {
                  this.setState({
                      expressModalVisible:false
                  });
                  failTip(res.msg);
              }
          }
      })
  };

  //同意退货
  agreeReturn = (type, returntype) => {
      // eslint-disable-next-line no-shadow
      const { goods_detail_data, modalVisible, islocalModalVisible,query,afsTypeText } = this.state;
      let operate = [];
      let agressNum = 0, isunlocal = false;
      if (type == 'agreegoods') {
          operate.push({
              type: 'show_content',
              label: `${sldComLanguage('退款方式')}`,
              content: goods_detail_data.returnTypeValue
          });
          operate.push({
              type: 'show_content',
              label: `${sldComLanguage('退款金额(元)')}`,
              content: `${goods_detail_data.returnMoneyAmount }${sldComLanguage('元')}`
          });
          operate.push({
              type: 'onlytxt',
              label: '',
              content: `*${ goods_detail_data.returnMethod}`,
              fontSize: '12px',
              fontColor: 'rgba(255, 109, 31, 0.8)',
              right: 18,
              bgcColor: '#fff'
          });
          agressNum = 1;
          isunlocal = true;
      } else if (type == 'refusegoods') {
          if(query.afsType==1){
              operate.push({
                  type: 'show_content',
                  label: `${sldComLanguage('退款方式')}`,
                  content: goods_detail_data.returnTypeValue
              });
              operate.push({
                  type: 'show_content',
                  label: `${sldComLanguage('退款金额(元)')}`,
                  content: goods_detail_data.returnMoneyAmount
              });
          }
          operate.push({
              type: 'textarea',
              label: `${sldComLanguage('拒绝理由')}`,
              name: 'remark',
              placeholder: `${sldComLanguage('请输入拒绝理由，最多20个字')}`,
              initialValue: '',
              maxLength: 20,
              rules: [{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入拒绝理由')}`
              }]
          });
          agressNum = 0;
          isunlocal = true;
      } else if (type == 'agreelocal') {

          isunlocal = false;
      }
      console.log(111,operate)
      this.setState({
          title: `${sldComLanguage(`处理${afsTypeText}申请`)}`,
          modalVisible: isunlocal && !modalVisible,
          islocalModalVisible: !isunlocal && !islocalModalVisible,
          operateData: operate,
          isagress: agressNum == 1 ? true : false,
          returnType: returntype,
          show_foot:true
      });


  };


  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  // 根据 returnType 的值判断 仅退款 或 退货退款 调接口
  sldHandleConfirm = (val) => {
      const { dispatch } = this.props;
      const { query, isagress, modalVisible, returnType } = this.state;
      if (returnType == 1 || (returnType == 2 && !isagress)) {
          let params = {};
          params.afsSn = query.afsSn;
          params.isPass = isagress;
          params.remark = val.remark != undefined ? val.remark : '';
          dispatch({
              type: 'service/confirm_return',
              payload: params,
              callback: res => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      this.setState({
                          modalVisible: !modalVisible
                      });
                      this.get_return_detail(query.afsSn);
                  } else {
                      failTip(res.msg);
                  }
              }
          });
      } else if (returnType == 2 && isagress) {
          let params = {};
          params.afsSn = query.afsSn;
          params.isReceive = true;
          dispatch({
              type: 'service/confirm_receive',
              payload: params,
              callback: res => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      this.setState({
                          modalVisible: !modalVisible
                      });
                      this.get_return_detail(query.afsSn);
                  } else {
                      failTip(res.msg);
                  }
              }
          });
      }
  };

  //查看物流
  checkFlow = (type) => {
      const { goods_detail_data, modalVisible } = this.state;
      const { dispatch } = this.props;
      // 1 寄件包裹的物流（如客户发货后的物流）
      // 2. 收件包裹的物流（如京东维修后返件的物流）
      dispatch({
          type: 'service/get_return_flow',
          payload: { afsSn: goods_detail_data.afsSn,type},
          callback: res => {
              if (res.state == 200) {
                  let operateData = [];
                  operateData.push({
                      type: 'show_express',
                      content: res.data
                  });
                  this.setState({
                      title: `${sldComLanguage('查看物流')}`,
                      modalVisible: !modalVisible,
                      operateData: operateData,
                      show_foot:false
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //退货退款 申请发地址
  sldConfirm = () => {
      const { dispatch,form } = this.props;
      const { validateFieldsAndScroll } =form;
      const { selectedRowKeys, query, islocalModalVisible, goods_detail_data } = this.state;
      const { supplierOrderSn } = goods_detail_data;
      let params = {};
      params.afsSn = query.afsSn;
      params.isPass = true;
    
      if(query.afsType==1){
      // 如果供应商不存在,则需要发送地址
          if(!supplierOrderSn){
              if(selectedRowKeys.length==0){
                  failTip('请选择地址!') 
                  return false
              }
              params.storeAddressId = selectedRowKeys[0];
          }
          validateFieldsAndScroll((err, values) => {
              if (!err) {
                  params.remark = values.remark
                  params.returnAmount = values.returnAmount
              }
          });
          // eslint-disable-next-line no-restricted-globals
          if( isNaN(parseInt(params.returnAmount)) ){
              return false
          }
      }
      if(!agreeLock){
      // 关锁
          agreeLock = true
          dispatch({
              type: 'service/confirm_return',
              payload: params,
              callback: res => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      this.setState({
                          islocalModalVisible: !islocalModalVisible
                      });
                      this.get_return_detail(query.afsSn);
                  } else {
                      this.setState({
                          islocalModalVisible: !islocalModalVisible
                      });
                      failTip(res.msg);
                  }
                  // 开锁
                  setTimeout(() => {
                      agreeLock = false;
                  }, 100);
              }
          })
      }else{
          failTip('请勿重复提交!')
      }
  };

  onhandleModalVisible = () => {
      this.setState({
          islocalModalVisible: false,
          isflowVisible: false
      });
  };

  onSelectChange = selectedRowKeys => {
      this.setState({ selectedRowKeys });
  };


  render() {
      const { form } = this.props;
      const { getFieldDecorator } =form;
      // eslint-disable-next-line no-shadow
      const { order_return_data,supply_info,sp_return_info, goods_detail_data, submiting, modalVisible, islocalModalVisible, operateData, title, show_foot, modal_width, return_progress_data, selectedRowKeys, addressList, addressColu, order_return_img_data, preview_img, show_preview_modal, preview_alt_con,afsTypeText,query,expressModalVisible,expressList,progressWidth } = this.state;
      const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange
      };
      const { spDetail } = goods_detail_data
      const {afsType} = query
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <AuthBtn btnAuth={btnAuth} eventKey={["service_view"]} showPage>
                  <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                      {sldLlineRtextAddGoods('#69A2F2', `${sldComLanguage(`${afsTypeText}详情`)}`)}
                      <Link to={{
                          pathname: '/order/service',
                          query: {
                              tab:afsType
                          }
                      }}
                      >{sldIconBtnBg(() =>{}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}</Link>
                  </div>
                  {getSldHorLine(1)}
                  <Scrollbars
                      autoHeight
                      autoHeightMin={100}
                      autoHeightMax={document.body.clientHeight - 108}
                  >
                      <div className={`${global.flex_row_center_start} ${order.progress}`} style={{transform:`${215*return_progress_data.length>progressWidth?`scale(calc(${progressWidth} / (${215*return_progress_data.length})))`:''}`}} ref={dom=>{this.progress = dom}}>
                          {return_progress_data.map((item, index) => <div key={index} className={`${global.flex_column_start_center} ${order.item}`}>
                              <div className={`${order.top} ${global.flex_row_center_center}`}>
                                  <span className={`${order.left_line}`} style={{ borderColor: line_color[item.state] }} /><img
                                      src={item.img}
                                  /><span className={`${order.right_line}`} style={{ borderColor: line_color[item.state] }} />
                              </div>
                              <span className={`${order.state}`} style={{ color: state_color[item.state] }}>{item.desc}</span>
                              <span className={`${order.time}`} style={{ color: time_color[item.state] }}>{item.time}</span>
                          </div>)}
                      </div>
                      {/* {
                  (goods_detail_data.returnType == 1 && goods_detail_data.state == 100) &&
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                  <span className={order.title}>{goods_detail_data.stateValue}</span>
                  <span className={order.tip}>{`${sldComLanguage('收到买家仅退款申请，请尽快处理')}`}</span>
                  <div className={order.btnsty}>
                      <div onClick={() => this.agreeReturn('agreegoods', goods_detail_data.returnType)}
                          className={order.agree_btn}>{sldComLanguage('同意退款申请')}</div>
                      <div onClick={() => this.agreeReturn('refusegoods', goods_detail_data.returnType)}
                          className={order.cancle_btn}>{sldComLanguage('拒绝退款申请')}</div>
                  </div>
                  </div>
              } */}
                      {
                          (goods_detail_data.state == 101) &&
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                      <span className={order.title}>{goods_detail_data.stateValue}</span>
                      <span className={order.tip}>{`${sldComLanguage(`收到买家${afsTypeText}申请，请尽快处理`)}`}</span>
                      {hasAuth("service_operation")&&<div className={order.btnsty}>
                          <div
                              onClick={() => this.agreeReturn('agreelocal', goods_detail_data.returnType)}
                              className={order.agree_btn}
                          >{sldComLanguage(`同意${afsTypeText}申请`)}</div>
                          <div
                              onClick={() => this.agreeReturn('refusegoods', goods_detail_data.returnType)}
                              className={order.refuse_btn}
                          >{sldComLanguage(`拒绝${afsTypeText}申请`)}</div>
                      </div>}
                  </div>
                      }
                      {
                          (goods_detail_data.state == 200) &&
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                      <span className={order.title}>{`${sldComLanguage('待平台审核')}`}</span>
                  </div>
                      }
              
                      {
                          (goods_detail_data.returnType == 2 && goods_detail_data.state == 201) &&
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                      <span className={order.title}>{goods_detail_data.stateValue}</span>
                      <span className={order.tip}>{`${sldComLanguage(`您已同意本次${afsTypeText}申请`)}`}</span>
                      {
                          !goods_detail_data.supplierOrderSn &&
                      <span
                          className={order.tip}
                      >{sldComLanguage('买家需')}<span>{goods_detail_data.deadline}</span>{sldComLanguage('之前发货,否则申请将自动撤销。')}</span>
                      }
                  
                      <div className={order.btnsty} />
                  </div>
                      }

                      {
                          (goods_detail_data.state == 102) &&
              <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                  <span className={order.title}>{`${sldComLanguage('买家已退货，等待商家确认收货')}`}</span>
                  <span className={order.tip}>{sldComLanguage('买家已退货，退货物流公司:')}{goods_detail_data.buyerExpressName}，</span>
                  <span className={order.tip}>{sldComLanguage('退货物流单号')}:{goods_detail_data.buyerExpressNumber} <a
                      src="javascript: void(0);"
                      style={{ color: '#FF711E' }}
                      onClick={() => this.checkFlow(1)}
                  >{hasAuth("service_view")&&sldComLanguage('查看物流')}</a></span>
                  {hasAuth('service_operation')&&<div className={order.btnsty}>
                      { goods_detail_data.supplierOrderSn===null &&
                          <div
                              onClick={() => this.agreeReturn('agreegoods', goods_detail_data.returnType)}
                              className={`${order.cancle_btn}`}
                          >
                              {sldComLanguage('已收到货,同意退款')}
                          </div>
                      }
                      <div onClick={() => this.agreeReturn('refusegoods', goods_detail_data.returnType)} className={`${order.refuse_btn}`}>{`拒绝${afsTypeText}申请`}</div>
                  </div>}
              </div>
                      }
                      {
                          (afsType==4) && 
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                      {goods_detail_data.storeExpressName && <span className={order.tip}>{sldComLanguage('维修发货物流公司:')}{goods_detail_data.storeExpressName}</span>}
                      {
                          goods_detail_data.storeDeliveryNumber && 
                  <span className={order.tip}>{sldComLanguage('物流单号')}:{goods_detail_data.storeDeliveryNumber}<a
                      src="javascript: void(0);"
                      style={{ color: '#FF711E' }}
                      onClick={() => this.checkFlow(2)}
                  >{hasAuth("service_view")&&sldComLanguage('查看物流')}</a></span>
                      }
                      {hasAuth("service_view")&&goods_detail_data.showMaintainExpressSubmitBtn && <Button onClick={()=>this.showExpress()}>发货信息</Button>}  
                  </div>
                      }
                      {
                          (goods_detail_data.state == 300) &&
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                      <span className={order.title}>{goods_detail_data.stateValue}</span>
                      {afsType==1 && <span className={order.tip} style={{color:'#333'}}>{sldComLanguage('退款金额：')}<span style={{color:'#FF1818'}}>{sldComLanguage('¥')}{goods_detail_data.returnMoneyAmount}</span></span>}
                      {afsType==1 && <span className={order.tip}>{sldComLanguage('平台审核备注：')}{goods_detail_data.platformRemark}</span>}
                  </div>
                      }
                      {
                          (goods_detail_data.state == 202) &&
                  <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                      <span className={order.title}>{goods_detail_data.stateValue}</span>
                      <span className={order.tip}>{sldComLanguage('拒绝原因：')}{goods_detail_data.storeRemark}{goods_detail_data.refuseReason}</span>
                  </div>
                      }

                      {
                          goods_detail_data.supplierOrderSn && (afsType==1) && <div>
                              {sldCommonTitle(`${sldComLanguage('供应商退款信息')}`, '#333', 5, 15, 15)}
                              <div>
                                  <SldTableRowTwo
                                      r_color="#333"
                                      l_color="#999"
                                      l_fontw={500}
                                      r_fontw={600}
                                      form={this.props.form}
                                      data={sp_return_info}
                                  />
                              </div> 
                          </div>   
                      }
                      {
                          goods_detail_data.supplierOrderSn && spDetail && <div>
                              {sldCommonTitle(`${sldComLanguage('供应商信息')}`, '#333', 5, 15, 15)}
                              <div>
                                  <SldTableRowTwo
                                      r_color="#333"
                                      l_color="#999"
                                      l_fontw={500}
                                      r_fontw={600}
                                      form={this.props.form}
                                      data={supply_info}
                                  />
                                  <div style={{marginTop:'15px',paddingLeft:'10px'}}>
                                      {
                                          spDetail.serviceTrackInfoDTOs && spDetail.serviceTrackInfoDTOs.length && <Timeline>
                                              {
                                                  spDetail.serviceTrackInfoDTOs.map((item)=><Timeline.Item>
                                                      <p>{item.title}</p>
                                                      <p>{item.context}</p>
                                                      <p>{item.createDate}</p>
                                                  </Timeline.Item>)
                                              }
                                          </Timeline>
                                      }
                                  </div>
                              </div> 
                          </div>   
                      }
                      {sldCommonTitle(`${sldComLanguage('售后信息')}`, '#333', 5, 15, 15)}
                      <SldTableRowTwo
                          r_color="#333"
                          l_color="#999"
                          l_fontw={500}
                          r_fontw={600}
                          form={this.props.form}
                          data={order_return_data}
                      />

                      {sldCommonTitle(`${sldComLanguage('售后凭证信息')}`, '#333', 5, 15, 15)}
                      <SldTableRowTwo
                          r_color="#333"
                          l_color="#999"
                          l_fontw={500}
                          r_fontw={600}
                          form={this.props.form}
                          part_width={100}
                          lwidth={10}
                          rwidth={90}
                          data={order_return_img_data}
                      />
                      {sldCommonTitle(`${sldComLanguage('商品信息')}`, '#333', 5, 15, 15)}
                      <StandardTable
                          selectedRows={[]}
                          data={{ list: [goods_detail_data], pagination: {} }}
                          size="small"
                          rowKey="orderProductId"
                          isCheck={false}
                          columns={this.columns_order_goods}
                          sldpagination={false}
                      />
                      {getSldEmptyH(40)}
                  </Scrollbars>
                  {/*新增/编辑对话框-start*/}
                  <SldModal
                      title={title}
                      submiting={submiting}
                      show_foot={show_foot}
                      width={modal_width}
                      modalVisible={modalVisible}
                      sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                      sldHandleCancle={this.sldHandleCancle}
                      formItemLayoutModal={formItemLayoutModal}
                      content={operateData}
                  />
                  {/*新增/编辑对话框-end*/}
                  <Modal
                      centered
                      title={sldComLanguage(`同意${afsTypeText}`)}
                      visible={islocalModalVisible}
                      onOk={this.sldConfirm}
                      onCancel={() => this.onhandleModalVisible()}
                  >
                      <div style={{ margin: 20 }}>
                          {afsType==1 &&
                  <Form>
                      <FormItem {...formItemLayoutModal} label="退款金额">
                          {getFieldDecorator('returnAmount', {
                              rules: [{required: true, message: '退款金额不为空'},{pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/, message: '金额小数不正确!'}],
                              // eslint-disable-next-line no-restricted-globals
                              initialValue:isNaN(parseInt(goods_detail_data.returnMoneyAmount))?'' : goods_detail_data.returnMoneyAmount
                          })(
                              <InputNumber min={0} max={goods_detail_data.returnMoneyAmount} style={{width:'100%'}} />
                          )}
                      </FormItem>
                      <FormItem {...formItemLayoutModal} label="退款理由">
                          {getFieldDecorator('remark', {
                              rules: [{
                                  max: 50, message: '最多50字'
                              }]
                          })(
                              <TextArea rows={4} placeholder="最多50字" maxLength={50} />
                          )}
                      </FormItem>
                  </Form>
                          }
                          {(afsType==1 && !goods_detail_data.supplierOrderSn) &&
                  <Table
                      rowKey="addressId"
                      rowSelection={{
                          type: 'radio',
                          ...rowSelection
                      }}
                      columns={addressColu}
                      dataSource={addressList}
                      pagination={false}
                      bordered
                      showHeader={false}
                  />
                          }
                          {
                              (afsType==2||afsType==4) && <div>{`同意${afsTypeText}申请`}</div>
                          }
                      </div>
                  </Modal>
                  {
                      expressModalVisible && 
              <Modal
                  title={sldComLanguage(`填写发运单信息`)}
                  visible={expressModalVisible}
                  onOk={this.subExpress}
                  onCancel={() => this.closeExpress()}
              >
                  <div style={{padding:'10px'}}>
                      <Form>
                          <FormItem {...formItemLayoutModal} label="物流单号">
                              {getFieldDecorator('deliveryNumber', {
                                  rules: [],
                                  initialValue:spDetail?.serviceExpressInfoDTO?.expressCode ? spDetail.serviceExpressInfoDTO.expressCode:''
                              })(
                                  <Input style={{width:'100%'}} />
                              )}
                          </FormItem>
                          <FormItem {...formItemLayoutModal} label="物流公司">
                              {getFieldDecorator('expressCode', {
                                  rules: [],
                                  initialValue:spDetail?.serviceExpressInfoDTO?.expressCompanyCode ? spDetail.serviceExpressInfoDTO.expressCompanyCode:''
                              })(
                                  <Select
                                      style={{ width: '100%' }}
                                      showSearch
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                  >
                                      {
                                          expressList.map((item,index)=><Option value={item.expressCode} key={index}>{item.expressName}</Option>)
                                      }
                                  </Select>
                              )}
                          </FormItem>
                      </Form>
                  </div>
              </Modal>

                  }
                  {/*图片预览-start*/}
                  <SldPreviewImg
                      img={preview_img}
                      show_preview_modal={show_preview_modal}
                      modal_width={400}
                      preview_alt_con={preview_alt_con}
                      closePreviewModal={() => this.viewImg(false)}
                  />
                  {/*图片预览-end*/}
              </AuthBtn>
          </div>

      );
  }
}
