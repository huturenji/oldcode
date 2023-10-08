import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Radio, Modal, Select, Input,Tag,Spin,Button } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    sldComLanguage,
    failTip,
    sucTip,
    getSldHorLine,
    getSldListGoodsImg80,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    sldCommonTitle,
    list_com_page_more,
    formItemLayoutModal,
    getSldEmptyH,
    getAuthBtn
} from '@/utils/utils';
import {
    famatterOrderType,
    famatterOrderSource,
    promotionTypeEumn
} from '@/utils/util_data';
import global from '@/global.less';
import order from '../order.less';
import SldTableRowTwo from '@/components/SldTableRowTwo';
import SldModal from '@/components/SldModal/SldModal';
import StandardTable from '@/components/StandardTable';
import Log from './components/Log';
import MarkModal from './components/markModal';
import AuthBtn from '@/components/AuthBtn';

const { info } = Modal;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
let btnAuth = getAuthBtn();

// eslint-disable-next-line no-shadow
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class Order_detail extends Component {
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
                    <span className={order.goods_brief} title={record.specValues}>
                        {record.specValues}
                    </span>
                </div>
            </div>
        },
        {
            title: `${sldComLanguage('sku')}`,
            dataIndex: 'sku',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('供应商sku')}`,
            dataIndex: 'supplierSku',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('特价活动')}`,
            dataIndex: 'promotionType',
            align: 'center',
            width: 100,
            render:(text)=>(promotionTypeEumn[text]||'--')
        },
     
        {
            title: `${sldComLanguage('单价(元)')}`,
            dataIndex: 'productShowPrice',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('数量')}`,
            dataIndex: 'productNum',
            align: 'center',
            width: 100
        }
    ];//订单商品表头
  
    invoice_info_other = [{ //收票信息
        type: 'show_text',
        label: `${sldComLanguage('是否需要开票')}`,
        name: 'invoiceStatus',
        extra: ``,
        item_height: 42,
        text: `${sldComLanguage('否')}`
    }];//不需要发票的情况
  
    invoice_info_personal = [{
        type: 'show_text',
        label: `${sldComLanguage('发票抬头')}`,
        name: 'invoiceTitle',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('收票邮箱')}`,
        name: 'receiverEmail',
        extra: ``,
        item_height: 42,
        text: ``
    }];//个人发票
  
    invoice_info_VAT = [{
        type: 'show_text',
        label: `${sldComLanguage('单位名称')}`,
        name: 'invoiceTitle',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('税号')}`,
        name: 'taxCode',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('注册地址')}`,
        name: 'registerAddr',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('注册电话')}`,
        name: 'registerPhone',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('开户银行')}`,
        name: 'bankName',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('银行账户')}`,
        name: 'bankAccount',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('收票人')}`,
        name: 'receiverName',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('收票电话')}`,
        name: 'receiverMobile',
        extra: ``,
        item_height: 42,
        text: ``
    },{
        type: 'show_text',
        label: `${sldComLanguage('下单渠道')}`,
        name: 'channelName',
        extra: ``,
        item_height: 42,
        text: ``
    },{
        type: 'show_text',
        label: `${sldComLanguage('企业名称')}`,
        name: 'companyName',
        extra: ``,
        item_height: 42,
        text: ``
    }, {
        type: 'show_text',
        label: `${sldComLanguage('收票地址')}`,
        name: 'receiverAddress',
        extra: ``,
        item_height: 42,
        text: ``
    }];//公司发票——增值税发票
    
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            order_detail: {},
            return_progress_data: [], //退货进度条
            invoice_info: [{
                type: 'show_text',
                label: `${sldComLanguage('单位名称')}`,
                name: 'invoiceTitle',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('税号')}`,
                name: 'taxCode',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('收票邮箱')}`,
                name: 'receiverEmail',
                extra: ``,
                item_height: 42,
                text: ``
            }],//公司——普通发票
            receiver_info: [{ //收货人信息
                type: 'show_text',
                label: `${sldComLanguage('会员真实名称')}`,
                name: 'memberTrueName',
                extra: ``,
                item_height: 42,
                text: ``
            },{ //收货人信息
                type: 'show_text',
                label: `${sldComLanguage('会员昵称')}`,
                name: 'memberNickName',
                extra: ``,
                item_height: 42,
                text: ``
            },{ //收货人信息
                type: 'show_text',
                label: `${sldComLanguage('用户名称')}`,
                name: 'memberName',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('收货人')}`,
                name: 'receiverName',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('收货人手机号')}`,
                name: 'receiverMobile',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('收货地址')}`,
                name: 'receiverAreaInfo',
                extra: ``,
                item_height: 42,
                text: ``
            }],
            order_info: [{
                type: 'show_text',
                label: `${sldComLanguage('订单类型')}`,
                name: 'orderTypeValue',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('订单号')}`,
                name: 'orderSn',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('供应商订单号')}`,
                name: 'supplierOrderSn',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('店铺名称')}`,
                name: 'storeName',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('支付方式')}`,
                name: 'paymentName',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('下单渠道')}`,
                name: 'channelName',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('企业名称')}`,
                name: 'companyName',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('订单备注')}`,
                name: 'orderRemark',
                extra: ``,
                item_height: 42,
                text: ``
            }],//订单信息
            amount_info: [{
                type: 'show_text',
                label: `${sldComLanguage('商品金额')}`,
                name: 'goodsAmount',
                extra: ``,
                item_height: 42,
                text: ``
            }, {
                type: 'show_text',
                label: `${sldComLanguage('优惠券')}`,
                name: 'voucherAmount',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('红包')}`,
                name: 'redpacketAmount',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('积分抵现')}`,
                name: 'integralCashAmount',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('满减')}`,
                name: 'fullDiscountAmount',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('运费劵')}`,
                name: 'freightCashAmount',
                extra: ``,
                item_height: 42,
                text: ``
            },{
                type: 'show_text',
                label: `${sldComLanguage('运费总额')}`,
                name: 'expressFee',
                extra: ``,
                item_height: 42,
                text: ``
            }],//金额信息
            goodsInfoList: [], //商品信息
            orderLogList: [],
            operateData: [], //弹框操作数据
            resList: [], // 取消原因数据
            modalVisible: false,
            titleName: '',
            submiting: false,
            show_foot: true,
            modal_width: 700,
            propType: '',
            deliverModal: false,
            expressList: [], //快递公司数据
            deliverType: '', //发货方式
            loading:false,
            markModalVisible:false, // 标记弹窗
            orderMarkList:[] // 标记列表
        };
    }

    componentDidMount() {
        const { query } = this.state;
        this.get_order_detail({ orderSn: query.orderSn });
    }

    componentWillReceiveProps(newProps) {
        // 查看关联订单 详情页跳转详情页，只是参数改变componentDidMount不会执行  需要重新拉数据
        const { query } = newProps.location
        const { orderSn } = query
        if (orderSn !== this.state.query.orderSn) {
            this.setState({ query,return_progress_data:[] }, () => {
                this.get_order_detail({ orderSn }); 
            });
        }
    }

  get_order_detail = (params) => {
      this.setState({loading:true})
      const { dispatch } = this.props;
      let { order_detail, return_progress_data, invoice_info, receiver_info, order_info,amount_info, orderLogList } = this.state;
      dispatch({
          type: 'order/get_order_detail',
          payload: params,
          callback: res => {
              if (res.state == 200) {
                  order_detail = res.data;
                  orderLogList = res.data.orderLogs;
                  //收票信息
                  if (!!order_detail.invoiceInfo && !!order_detail.invoiceInfo.invoiceId) {
                      let invoice_type = '';
                      if (order_detail.invoiceInfo.titleType == 1) {
                          //个人发票
                          invoice_info = JSON.parse(JSON.stringify(this.invoice_info_personal));
                          invoice_type = `${sldComLanguage('个人发票')}`;
                      } else {
                          //公司发票
                          if (order_detail.invoiceInfo.invoiceType != 1) {
                              //增值税发票
                              invoice_info = JSON.parse(JSON.stringify(this.invoice_info_VAT));
                              invoice_type = `${sldComLanguage('增值税专用发票')}`;
                          } else {
                              invoice_type = `${sldComLanguage('普通发票')}`;
                          }
                      }

                      //需要发票
                      for (let item = 0; item < invoice_info.length; item++) {
                          invoice_info[item].text = !order_detail['invoiceInfo'][invoice_info[item].name] ? '--' : order_detail['invoiceInfo'][invoice_info[item].name];
                      }
                      let invoice_content = order_detail.invoiceInfo.invoiceContent == 1 ? `${sldComLanguage('商品明细')}` : `${sldComLanguage('商品类别')}`;
                      //需要添加发票类型和发票内容
                      invoice_info = [{
                          type: 'show_text',
                          label: `${sldComLanguage('发票类型')}`,
                          name: 'invoiceTypeCombine',
                          extra: ``,
                          item_height: 42,
                          text: invoice_type
                      }, {
                          type: 'show_text',
                          label: `${sldComLanguage('发票内容')}`,
                          name: 'invoiceContent',
                          extra: ``,
                          item_height: 42,
                          text: invoice_content
                      }, ...invoice_info];

                  } else {
                      //不需要发票
                      invoice_info = JSON.parse(JSON.stringify(this.invoice_info_other));
                  }

                  //收货人信息
                  for (let item = 0; item < receiver_info.length; item++) {
                      if (receiver_info[item].name == 'receiverAreaInfo') {
                          order_detail[receiver_info[item].name] ? receiver_info[item].text = `${order_detail[receiver_info[item].name] } ${ order_detail.receiverAddress}`: receiver_info[item].text='--';
                      } else {
                          receiver_info[item].text = order_detail[receiver_info[item].name] ? order_detail[receiver_info[item].name] : '--';
                      }
                  }
                  //订单信息
                  for (let item = 0; item < order_info.length; item++) {
                      if (order_info[item].name == 'orderTypeValue') {
                          order_info[item].text = `${famatterOrderType(order_detail.orderType,order_detail.presellInfo?.isAllPay).text} (${famatterOrderSource(order_detail.orderSource,order_detail.orderFeatherInfo).text})`;
                      } else {
                          order_info[item].text = order_detail[order_info[item].name] == '' ? '--' : order_detail[order_info[item].name]||'';
                      }
                  }

                  //金额明细
                  for (let item = 0; item < amount_info.length; item++) {
                      if(amount_info[item].name=='goodsAmount'){
                          amount_info[item].text = `¥${order_detail[amount_info[item].name]}`;
                      }else if(amount_info[item].name=='expressFee'){
                          const value = order_detail[amount_info[item].name]
                          amount_info[item].text = `${value==0?'免运费':`¥${value}`}`;
                      }else{
                          amount_info[item].text = `-¥${order_detail[amount_info[item].name]}`;
                      }
                      
                  }

                  if (order_detail.orderState == 0) { // 订单取消
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/submit_pass.png'),
                          state: `${sldComLanguage('提交订单')}`,
                          time: (orderLogList.length > 0 && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:10
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/fail_current.png'),
                          state: `${sldComLanguage('订单取消')}`,
                          time: (orderLogList.length > 0 && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
                          state_color: 'rgba(255, 113, 30,1)',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: 'rgba(255, 113, 30,1)',
                          orderLogState:0
                      });
                  } else if (order_detail.orderState == 10) { //未付款订单
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/submit_current.png'),
                          state: `${sldComLanguage('提交订单')}`,
                          time: (orderLogList.length > 0 && orderLogList[0] && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
                          state_color: 'rgba(255, 113, 30,1)',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: 'rgba(255, 113, 30,1)',
                          orderLogState:10
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/pay_future.png'),
                          state: `${sldComLanguage('付款成功')}`,
                          time: '',
                          state_color: '#999999',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: '#eee',
                          orderLogState:20
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/deliver_future.png'),
                          state: `${sldComLanguage('商品发货')}`,
                          time: '',
                          state_color: '#999999',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: '#eee',
                          orderLogState:30
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/suc_future.png'),
                          state: `${sldComLanguage('订单完成')}`,
                          time: '',
                          state_color: '#999999',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: '#222',
                          orderLogState:40
                      });
                  } else if (order_detail.orderState == 20) {
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/submit_pass.png'),
                          state: `${sldComLanguage('提交订单')}`,
                          time: (orderLogList.length > 0 && orderLogList[0] && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:10
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/pay_current.png'),
                          state: `${sldComLanguage('付款成功')}`,
                          time: (orderLogList.length > 0 && orderLogList[1] && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
                          state_color: 'rgba(255, 113, 30,1)',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: 'rgba(255, 113, 30,1)',
                          orderLogState:20
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/deliver_future.png'),
                          state: `${sldComLanguage('商品发货')}`,
                          time: '',
                          state_color: '#999999',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: '#eee',
                          orderLogState:30
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/suc_future.png'),
                          state: `${sldComLanguage('订单完成')}`,
                          time: '',
                          state_color: '#999999',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: '#222',
                          orderLogState:40
                      });
                  } else if (order_detail.orderState == 30) {
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/submit_pass.png'),
                          state: `${sldComLanguage('提交订单')}`,
                          time: (orderLogList.length > 0 && orderLogList[0] && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:10
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/pay_pass.png'),
                          state: `${sldComLanguage('付款成功')}`,
                          time: (orderLogList.length > 0 && orderLogList[1] && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:20
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/deliver_current.png'),
                          state: `${sldComLanguage('商品发货')}`,
                          time: (orderLogList.length > 0 && orderLogList[2] && orderLogList[2].logTime != undefined) ? orderLogList[2].logTime : '',
                          state_color: 'rgba(255, 113, 30,1)',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: 'rgba(255, 113, 30,1)',
                          orderLogState:30
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/suc_pass.png'),
                          state: `${sldComLanguage('订单完成')}`,
                          time: '',
                          state_color: '#999999',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: '#222',
                          orderLogState:40
                      });
                  } else if (order_detail.orderState == 40) {
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/submit_pass.png'),
                          state: `${sldComLanguage('提交订单')}`,
                          time: (orderLogList.length > 0 && orderLogList[0] && orderLogList[0].logTime != undefined) ? orderLogList[0].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:10
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/pay_pass.png'),
                          state: `${sldComLanguage('付款成功')}`,
                          time: (orderLogList.length > 0 && orderLogList[1] && orderLogList[1].logTime != undefined) ? orderLogList[1].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:20
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/deliver_pass.png'),
                          state: `${sldComLanguage('商品发货')}`,
                          time: (orderLogList.length > 0 && orderLogList[2] && orderLogList[2].logTime != undefined) ? orderLogList[2].logTime : '',
                          state_color: 'rgba(255, 113, 30, .6)',
                          time_color: 'rgba(255, 113, 30, .3)',
                          line_color: 'rgba(255, 113, 30, .3)',
                          orderLogState:30
                      });
                      return_progress_data.push({
                          icon: require('@/assets/img/mall/order/suc_current.png'),
                          state: `${sldComLanguage('订单完成')}`,
                          time: (orderLogList.length > 0 && orderLogList[3] && orderLogList[3].logTime != undefined) ? orderLogList[3].logTime : '',
                          state_color: 'rgba(255, 113, 30,1)',
                          time_color: 'rgba(255, 113, 30, .5)',
                          line_color: 'rgba(255, 113, 30,1)',
                          orderLogState:40
                      });
                  }

                  return_progress_data.forEach((item)=>{
                      let tarele = orderLogList.find((el)=>el.orderStateLog==item.orderLogState)
                      if(tarele){
                          item.time = tarele.logTime
                      }else{
                          item.time = ''
                      }
                  })

                  this.setState({
                      order_detail: res.data,
                      invoice_info,
                      receiver_info,
                      order_info,
                      amount_info,
                      return_progress_data,
                      goodsInfoList: order_detail.orderProductList
                  });
              } else {
                  failTip(res.msg);
              }
              this.setState({loading:false})
          }
      });
      this.markDetail(params.orderSn)
  };

  get_afsReasonlist = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'order/order_reason',
          payload: {
              afsType: 2,
              pageSize: list_com_page_more
          },
          callback: res => {
              if (res.state == 200) {
                  this.setState({
                      resList: res.data.list
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  // 标记详情
  markDetail = (orderSn) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'order/markDetail',
          payload: {
              orderSn
          },
          callback: res => {
              if (res.state == 200) {
                  this.setState({
                      orderMarkList: res.data.orderMarkVOList
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  // 标记
  doMark =(state,content)=>{
      const { dispatch } = this.props;
      const {query:{orderSn}} = this.state
      let param = {state,content,orderSn}
      dispatch({
          type:'order/doMark',
          payload:param,
          callback:(res)=>{
              if(res.state == 200){
                  this.markDetail(orderSn);
              }else{
                  failTip(res.msg)
              }
          }
      })
  };

  agreeReturn = (type) => {
      const { dispatch } = this.props;
      let { resList, modalVisible, operateData, deliverModal, query, show_foot, order_detail } = this.state;
      let titlename = '';
      let cancleBool = false, deliverBool = false;
      if (type == 'cancleOrder') {
          operateData.push({
              type: 'onlytxt',
              label: ' ',
              content: `${sldComLanguage('*取消订单后，订单将自动关闭；')}`,
              fontSize: '12px',
              fontColor: '#6072C5',
              right: 18,
              bgcColor: '#F2F2F2'
          });
          operateData.push({
              type: 'select',
              label: `${sldComLanguage('取消理由')}`,
              name: 'cancelReasonId',
              placeholder: `${sldComLanguage('请选择取消理由')}`,
              sel_data: resList,
              sele_key: 'reasonId',
              sele_name: 'content',
              diy: true,
              rules: [{
                  required: true,
                  message: `${sldComLanguage('请选择取消理由')}`
              }]
          });
          operateData.push({
              type: 'textarea',
              label: `${sldComLanguage('取消备注')}`,
              name: 'cancelRemark',
              placeholder: `${sldComLanguage('请输入取消备注，最多50个字')}`,
              initialValue: ''
          });
          titlename = `${sldComLanguage('取消订单')}`;
          cancleBool = true;
          show_foot = true;
      } else if (type == 'deliver') {
          dispatch({
              type: 'order/get_express',
              payload: { pageSize: list_com_page_more },
              callback: res => {
                  if (res.state == 200) {
                      deliverBool = true;
                      this.setState({
                          expressList: res.data.list,
                          deliverModal: deliverBool && !deliverModal,
                          propType: type,
                          show_foot: true
                      });
                  } else {
                      failTip(res.msg);
                  }
              }
          });
      } else if (type == 'flow') {
          if(order_detail.deliverType == 1){
              //无需物流
              info({
                  width: 470,
                  title: '该订单是自行配送，您可以联系配送人了解具体进度',
                  content: <div>
                      <p>配送人姓名：{order_detail.deliverName}</p>
                      <p>配送人手机号：{order_detail.deliverMobile}</p>
                  </div>
              });
          }else{
              dispatch({
                  type: 'order/get_flow',
                  payload: { orderSn: query.orderSn },
                  callback: res => {
                      if (res.state == 200) {
                          if(res.data.traces.length==0){
                              res.data.traces[0] = {
                                  tracesResult:{
                                      expressName: "",
                                      expressNumber: "",
                                      routeList:[]
                                  }
                              }
                          }
                          operateData.push({
                              type: 'show_express',
                              content: res.data.traces[0].tracesResult
                          });
                          cancleBool = true;
                          titlename = `${sldComLanguage('物流信息')}`;
                          this.setState({
                              operateData: operateData,
                              modalVisible: cancleBool && !modalVisible,
                              titleName: titlename,
                              propType: type,
                              show_foot: false
                          });
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      }

      this.setState({
          operateData: operateData,
          modalVisible: cancleBool && !modalVisible,
          titleName: titlename,
          propType: type,
          show_foot
      });

  };

  //弹框确定操作
  sldHandleConfirm = (val) => {
      const { propType, query, modalVisible } = this.state;
      const { dispatch } = this.props;
      if (propType == 'cancleOrder') {
          val.orderSn = query.orderSn;
          dispatch({
              type: 'order/cancleOrder',
              payload: val,
              callback: res => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      this.setState({
                          modalVisible: !modalVisible,
                          return_progress_data: []
                      });
                      this.get_orderDetail({ orderSn: query.orderSn });
                  } else {
                      failTip(res.msg);
                  }
              }
          });
      }
  };

  //弹框取消操作
  sldHandleCancle = () => {
      const { modalVisible } = this.state;
      this.setState({
          modalVisible: !modalVisible,
          operateData: []
      });
  };

  sldDeliverHandleCancle = () => {
      const { deliverModal } = this.state;
      this.setState({
          deliverModal: !deliverModal,
          deliverType: ''
      });
  };

  deliverConfirm = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              const { query } = this.state;
              const { dispatch } = this.props;
              values.orderSn = query.orderSn;
              dispatch({
                  type: 'order/confirmDelivery',
                  payload: values,
                  callback: res => {
                      if (res.state == 200) {
                          sucTip(res.msg);
                          this.setState({
                              deliverModal: false,
                              return_progress_data: [],
                              deliverType: ''
                          });
                          this.get_orderDetail({ orderSn: query.orderSn });
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });
  };

  //选择发货方式
  redioOnChange = (e) => {
      this.setState({
          deliverType: e.target.value
      });
  };

  showMark = ()=>{
      this.setState({
          markModalVisible:true
      })
  }

  cancleMark = ()=>{
      this.setState({
          markModalVisible:false
      })
  }

 confirmMark = (state,content)=>{
     this.doMark(state,content)
     this.setState({
         markModalVisible:false
     })
 }


 render() {
     const {
         order_detail, invoice_info, receiver_info, order_info, return_progress_data, titleName, submiting, show_foot, modal_width,
         modalVisible, operateData, deliverModal, expressList,loading,amount_info,markModalVisible,orderMarkList
     } = this.state;
     const { getFieldDecorator } = this.props.form;
     return (
         <Spin spinning={loading}>
             <div
                 className={global.common_page}
                 style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
             >
                 <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                     {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('订单详情')}`)}
                     {sldIconBtnBg(() => router.go(-1), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                 </div>
                 {getSldHorLine(1)}
                 <Scrollbars
                     autoHeight
                     autoHeightMin={100}
                     autoHeightMax={document.body.clientHeight - 108}
                 >
                     <div className={`${global.flex_row_center_start} ${order.progress}`}>
                         {return_progress_data.map((item, index) => <div key={index} className={`${global.flex_column_start_center} ${order.item}`}>
                             <div className={`${order.top} ${global.flex_row_center_center}`}>
                                 <span className={`${order.left_line}`} style={{ borderColor: item.line_color }} /><img
                                     src={item.icon}
                                 /><span className={`${order.right_line}`} style={{ borderColor: item.line_color }} />
                             </div>
                             <span className={`${order.state}`} style={{ color: item.state_color }}>{item.state}</span>
                             <span className={`${order.time}`} style={{ color: item.time_color }}>{item.time}</span>
                         </div>)}
                     </div>

                     {
                         order_detail.orderState == 0 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                             <span className={order.title}>{`${sldComLanguage('订单已取消')}`}</span>
                             <span className={order.tip}>取消原因:{order_detail.refuseReason + (order_detail.refuseRemark ? (`,${ order_detail.refuseRemark}`) : '')}</span>
                         </div>
                     }

                     {
                         order_detail.orderState == 10 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                             <span className={order.title}>{order_detail.orderStateValue}</span>
                         </div>
                     }

                     {
                         (order_detail.orderState == 20 && order_detail.lockState == 0) &&
            <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                <span className={order.title}>{order_detail.orderStateValue}</span>
            </div>
                     }

                     {
                         (order_detail.orderState == 20 && order_detail.lockState > 0) &&
            <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                <span className={order.title}>{order_detail.orderStateValue}</span>
            </div>
                     }

                     {
                         order_detail.orderState == 30 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                             <span className={order.title}>{`${sldComLanguage('商品已发出,等待买家收货')}`}</span>
                             <div className={order.btnsty}>
                                 <div
                                     onClick={() => this.agreeReturn('flow')}
                                     className={order.cancle_btn}
                                 >{sldComLanguage('查看物流')}</div>
                             </div>
                         </div>
                     }

                     {
                         order_detail.orderState == 40 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                             <span className={order.title}>{`${sldComLanguage('买家已确认收货,订单完成')}`}</span>
                             <div className={order.btnsty}>
                                 <div
                                     onClick={() => this.agreeReturn('flow')}
                                     className={order.cancle_btn}
                                 >{sldComLanguage('查看物流')}</div>
                             </div>
                         </div>
                     }

                     {
                         order_detail.orderState == 50 && <div className={`${order.state_part} ${global.flex_column_start_center}`}>
                             <span className={order.title}>{order_detail.orderStateValue}</span>
                         </div>
                     }

                     {order_detail.orderFeatherInfo && sldCommonTitle(`${sldComLanguage('关联订单')}`, '#333', 5, 15, 15)}
                     {
                         order_detail.orderFeatherInfo &&
                        <div className={`${order.related_order}`}>
                            <span className={`${order.related_text}`} style={{marginRight:'4px'}}>关联{order_detail.orderFeatherInfo.giverOrReceiver===0?'收礼人':'送礼人'}订单:</span>
                            {
                                order_detail.orderFeatherInfo.orderSns?
                                    order_detail.orderFeatherInfo.orderSns.map((orders)=>(
                                        <Link
                                            to={{
                                                pathname: '/manage_order/order_lists_to_detail',
                                                query: {
                                                    orderSn: orders
                                                }
                                            }}
                                        >
                                            <Tag color={order_detail.orderFeatherInfo.giverOrReceiver===0?'#0094a3':'#ff6b5c'}>{orders}</Tag>
                                        </Link>
                                    
                                    ))
                                    :
                                    <span>收礼人暂未领取</span>
                            }
                        </div>
                     }
                     {sldCommonTitle(`${sldComLanguage('订单信息:')}`, '#333', 5, 15, 15)}
                     <SldTableRowTwo
                         r_color="#333"
                         l_color="#999"
                         l_fontw={500}
                         r_fontw={600}
                         form={this.props.form}
                         data={order_info}
                     />
                     {sldCommonTitle(`${sldComLanguage('收货人信息:')}`, '#333', 5, 15, 15)}
                     <SldTableRowTwo
                         r_color="#333"
                         l_color="#999"
                         l_fontw={500}
                         r_fontw={600}
                         form={this.props.form}
                         data={receiver_info}
                     />
                     {sldCommonTitle(`${sldComLanguage('发票信息:')}`, '#333', 5, 15, 15)}
                     <SldTableRowTwo
                         r_color="#333"
                         l_color="#999"
                         l_fontw={500}
                         r_fontw={600}
                         form={this.props.form}
                         data={invoice_info}
                     />
                     {sldCommonTitle(`${sldComLanguage('商品信息')}`, '#333', 5, 15, 15)}
                     <StandardTable
                         selectedRows={[]}
                         data={{ list: order_detail.orderProductList, pagination: {} }}
                         size="small"
                         rowKey="orderProductId"
                         isCheck={false}
                         columns={this.columns_order_goods}
                         sldpagination={false}
                     />
                     <div className={`${global.flex_row_end_center} ${order.order_detail_total}`}>
                         {/* <span className={order.amount_detail}>
                             {sldComLanguage('商品总金额')}({sldComLanguage('¥')}{order_detail.goodsAmount}) + {sldComLanguage('运费')}({sldComLanguage('¥')}{order_detail.expressFee})
                             {order_detail.promotionInfo != undefined && order_detail.promotionInfo.length > 0 && order_detail.promotionInfo.map(item => ` - ${item.promotionName}(${sldComLanguage('¥')}${item.discount})`)}
                         </span> */}
                         <span className={order.amount_total}>{sldComLanguage('合计金额')}({sldComLanguage('¥')}{order_detail.orderAmount})</span>
                     </div>
                     <SldTableRowTwo
                         r_color="#333"
                         l_color="#999"
                         l_fontw={500}
                         r_fontw={600}
                         form={this.props.form}
                         data={amount_info}
                     />
                     {sldCommonTitle(`${sldComLanguage('操作记录')}`, '#333', 5, 15, 15)}
                     <Log logList={orderMarkList} />
                     <AuthBtn eventKey={["order_lists_operation"]} btnAuth={btnAuth}>
                         <div className={order.mark}>
                             <Button onClick={this.showMark} type="primary" disabled={([30,40,50].includes(order_detail.orderState))?false:true}>标记</Button>
                         </div>
                     </AuthBtn>
                     {getSldEmptyH(40)}
                 </Scrollbars>
                 {/*取消订单-start*/}
                 <SldModal
                     title={titleName}
                     submiting={submiting}
                     show_foot={show_foot}
                     width={modal_width}
                     modalVisible={modalVisible}
                     sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                     sldHandleCancle={this.sldHandleCancle}
                     formItemLayoutModal={formItemLayoutModal}
                     content={operateData}
                 />
                 {/*取消订单-end*/}
                 {/* 发货弹框-start */}
                 <Modal
                     centered
                     title={sldComLanguage('商品发货')}
                     width={modal_width}
                     visible={deliverModal}
                     onCancel={() => this.sldDeliverHandleCancle()}
                     onOk={this.deliverConfirm}
                 >
                     <Form layout="horizontal">
                         <div style={{
                             width: modal_width,
                             paddingLeft: modal_width * 0.11,
                             marginTop: 10
                         }}
                         >
                             <div style={{
                                 color: '#6072C5',
                                 width: 18 / 24 * (modal_width ? modal_width : 416),
                                 fontSize: 12
                             }}
                             >{sldComLanguage('* 请仔细填写物流公司及快递单号，发货后24小时内仅支持1次更正，逾期不可修改；')}</div>
                             <span style={{
                                 display: 'inline-block',
                                 width: 18 / 24 * (modal_width ? modal_width : 416),
                                 height: 1,
                                 backgroundColor: '#F2F2F2'
                             }}
                             />
                         </div>
                         <FormItem
                             label={sldComLanguage('收货人姓名')}
                             {...formItemLayoutModal}
                         >
                             <span>{order_detail.name}</span>
                         </FormItem>
                         <FormItem
                             label={sldComLanguage('收货人电话')}
                             {...formItemLayoutModal}
                         >
                             <span>{order_detail.mobile}</span>
                         </FormItem>
                         <FormItem />
                         <FormItem
                             label={sldComLanguage('收货人地址')}
                             {...formItemLayoutModal}
                         >
                             <span>{`${order_detail.receiverAreaInfo } ${ order_detail.receiverAddress}`}</span>
                         </FormItem>
                         <FormItem
                             label={sldComLanguage('发货方式')}
                             {...formItemLayoutModal}
                         >
                             {getFieldDecorator('deliverType', {
                                 rules: [{
                                     required: true,
                                     message: `${sldComLanguage('请选择发货方式')}`
                                 }]
                             })(
                                 <RadioGroup onChange={(e) => this.redioOnChange(e)}>
                                     <Radio value={1}>{sldComLanguage('物流发货')}</Radio>
                                     <Radio value={2}>{sldComLanguage('无需物流')}</Radio>
                                 </RadioGroup>,
                             )}
                         </FormItem>
                         {
                             this.state.deliverType == '1' ? <Fragment>
                                 <FormItem
                                     label={sldComLanguage('物流公司')}
                                     {...formItemLayoutModal}
                                 >
                                     {getFieldDecorator('expressId', {
                                         rules: [{
                                             required: true,
                                             message: `${sldComLanguage('请选择物流公司')}`
                                         }]
                                     })(
                                         <Select
                                             placeholder={sldComLanguage('请选择物流公司')}
                                             getPopupContainer={triggerNode => triggerNode.parentNode}
                                         >
                                             {
                                                 expressList.length > 0 && expressList.map(item => <Option
                                                     value={item.expressId}
                                                 >{item.expressName}</Option>)
                                             }
                                         </Select>,
                                     )}
                                 </FormItem>
                                 <FormItem
                                     label="快递单号"
                                     {...formItemLayoutModal}
                                 >
                                     {getFieldDecorator('expressNumber', {
                                         rules: [{
                                             required: true,
                                             whitespace: true,
                                             message: `${sldComLanguage('请输入物流单号')}`
                                         }]
                                     })(
                                         <Input placeholder={sldComLanguage('请输入物流单号')} />,
                                     )}
                                 </FormItem>
                             </Fragment> : null
                         }
                         {
                             this.state.deliverType == '2' ? <Fragment>
                                 <FormItem
                                     label={sldComLanguage('联系人')}
                                     {...formItemLayoutModal}
                                 >
                                     {getFieldDecorator('deliverName', {
                                         rules: [{
                                             required: true,
                                             whitespace: true,
                                             message: `${sldComLanguage('请输入联系人')}`
                                         }]
                                     })(
                                         <Input placeholder={sldComLanguage('请输入联系人')} />,
                                     )}
                                 </FormItem>
                                 <FormItem
                                     label={sldComLanguage('联系方式')}
                                     {...formItemLayoutModal}
                                 >
                                     {getFieldDecorator('deliverMobile', {
                                         rules: [{
                                             required: true,
                                             whitespace: true,
                                             message: `${sldComLanguage('请输入联系方式')}`
                                         }]
                                     })(
                                         <Input placeholder={sldComLanguage('请输入联系方式')} />,
                                     )}
                                 </FormItem>
                             </Fragment> : null
                         }
                     </Form>
                 </Modal>
                 {/* 发货弹框-end */}
                 {/* 标记弹窗 */}
                 <MarkModal
                     modalVisible={markModalVisible}
                     cancle={this.cancleMark}
                     confirm={this.confirmMark}
                 />
             </div>
         </Spin>

     );
 }
}
