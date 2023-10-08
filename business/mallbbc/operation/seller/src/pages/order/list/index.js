import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Radio, Empty, Pagination, Modal, Select, Input,Tooltip,Tag } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    sldComLanguage,
    dateFormat,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    list_com_page_more,
    formItemLayoutModal,
    sucTip,
    failTip,
    sldPrint,
    mobile_reg,
    getSldEmptyH,
    setSession,
    getSession,
    removeSession,
    getAuthBtn,
    downByUrl
} from '@/utils/utils';
import {
    famatterOrderType,
    famatterOrderSource
} from '@/utils/util_data';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import order from '../order.less';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import PrintOrderDetail from './components/print_order_detail';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';
import MarkModal from './components/markModal';
import MemberInfoModal from './components/memberInfoModal';
import Express from './components/express';

let btnAuth = getAuthBtn();
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

//搜索组件数据容器（不需要对变量进行监听）
let searchComponentData = {};
const markStateValue = (text) => { 
    switch (text){
    case 1: return <DotTag type="failed">待处理</DotTag>
    case 2: return <DotTag type="pending">处理中</DotTag>
    case 3: return <DotTag type='sucess'>处理完成</DotTag>
    default: return '--'
    }                    
}
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class OrderLists extends Component {
    
    filter_data = [
        { filter_code: '', filter_name: `${sldComLanguage('全部订单')}` },
        { filter_code: '10', filter_name: `${sldComLanguage('待付款订单')}` },
        { filter_code: '20', filter_name: `${sldComLanguage('待发货订单')}` },
        { filter_code: '30', filter_name: `${sldComLanguage('待收货订单')}` },
        { filter_code: '40', filter_name: `${sldComLanguage('已完成订单')}` },
        { filter_code: '0', filter_name: `${sldComLanguage('已取消订单')}` }
    ];//订单过滤器

    constructor(props) {
        super(props);
        this.state = {
            print_data: {},//发货明细单数据
            search_height: 0,
            filter_code: '',//过滤器默认值
            loading: false,
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('订单号')}`,
                name: 'orderSn',
                placeholder: `${sldComLanguage('请输入订单号或供应商订单号')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('会员名')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入商品名称')}`
            },{
                type: 'input',
                label: `${sldComLanguage('商品SKU')}`,//商品SKU
                name: 'sku',
                placeholder: `${sldComLanguage('请输入商品SKU')}`//请输入商品SKU
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('下单时间')}`,
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            },{
                type: 'select',
                label: `${sldComLanguage('订单来源')}`,
                name: 'source',
                placeholder: `${sldComLanguage('请选择订单来源')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部来源')}` },
                    { key: 'NORMAL', name: `${sldComLanguage('普通订单')}` },
                    { key: 'GIVER', name: `${sldComLanguage('鹅毛送')}` },
                    { key: 'RECEIVER', name: `${sldComLanguage('鹅毛收')}` },
                    { key: 'VOUCHER', name: `${sldComLanguage('抽奖订单')}` }
                ]
            },
            {
                type: 'select',
                label: `${sldComLanguage('处理标记')}`,
                name: 'markState',
                placeholder: `${sldComLanguage('请选择处理标记')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('待处理')}` },
                    { key: '2', name: `${sldComLanguage('处理中')}` },
                    { key: '3', name: `${sldComLanguage('处理完成')}` }
                ]
            }
            ],
            formValues: {},//搜索条件
            operateData: [], //弹框操作数据
            modalVisible: false,
            modalTitle: '',
            submiting: false,
            show_foot: true,
            modal_width: 550,
            modalItem: {},
            demodalVisible: false,
            expressList: [],
            deliverType: '0',
            resList: [], // 取消原因数据
            markModalVisible:false,
            memberModalVisible:false,
            showExpresslVisible:false,
            record:{},
            memberId:'',
            expressParam:{}
        };
    }

    componentDidMount() {
        //如果是订单详情返回的，并且记录了跳转前的Tab选项，恢复原来的Tab项
        if(getSession('detail_back') && getSession('order_detail_type')!= null && getSession('order_detail_type')!= ''){
            removeSession('detail_back')
            this.setState({filter_code: getSession('order_detail_type')},()=>{
                this.initData({ pageSize: pageSize, orderState:this.state.filter_code})
            });
        }else {
            this.initData({ pageSize: pageSize})  
        }
    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  initData = (param) => {
      this.get_list(param);
      this.get_express_list();
      this.get_reason_list();
      this.resize();
      window.addEventListener('resize', this.resize, { passive: true });    
  };

  resize = () => {
      const { search_height } = this.state;
      if (this.refs.search_part != undefined) {
          if (this.refs.search_part.clientHeight != search_height) {
              this.setState({ search_height: this.refs.search_part.clientHeight });
          }
      }
  };

   //搜索点击
   moreSearchToggle = () => {
       this.resize()
   }

  get_reason_list = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'order/get_order_reason',
          payload: {
              type: 108,
              pageSize: list_com_page_more
          },
          callback: res => {
              if (res.state == 200) {
                  this.setState({
                      resList: res.data
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //获取店铺启用的物流公司
  get_express_list = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'order/get_express',
          payload: { pageSize: list_com_page_more, expressState: 1 },
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

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true, params: params });
      const { dispatch } = this.props;
      params.pageIndex = params.current||1
      dispatch({
          type: 'order/get_order_lists',
          payload: { ...params },
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  if (params.current > 1 && res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
              }else {
                  failTip(res.msg);
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

  //搜索事件
  search = (data) => {
      searchComponentData = data;
      const values = { ...data };
      const { filter_code } = this.state;
      //时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_create_time = '';
      }
      for (let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize }
      });
      let param = { pageSize: pageSize, ...values };
      if (filter_code) {
          param.orderState = filter_code;
      }
      this.get_list(param);
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          filter_code: '',
          data: {},
          params: { pageSize: pageSize }
      });
      this.search({});
  };

  doMark =(state,content)=>{
      const { dispatch } = this.props;
      const {params,record:{orderSn}} = this.state
      let param = {state,content,orderSn}
      dispatch({
          type:'order/doMark',
          payload:param,
          callback:(res)=>{
              if(res.state == 200){
                  this.get_list(params);
              }else{
                  failTip(res.msg)
              }
          }
      })
  };

showMark = (item)=>{
    this.setState({
        record:item,
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

showMember = (memberId)=>{
    this.setState({
        memberId,
        memberModalVisible:true
    })
}

cancleMember = ()=>{
    this.setState({
        memberModalVisible:false
    })
}

confirmMember = ()=>{
    this.setState({
        memberModalVisible:false
    })
}

  showExpress = (item)=>{
      this.setState({
          expressParam:item,
          showExpresslVisible:true
      })
  }

  cancleExpress = ()=>{
      this.setState({
          showExpresslVisible:false
      })
  }

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //订单条件过滤器
  clickFilter = (e) => {
      this.setState({
          filter_code: e.target.value
      }, () => {
          this.search(searchComponentData);
      });
  };

  //改变每页的数量
  onShowSizeChange = (current, pageSizeNew) => {
      let { params, formValues, filter_code } = this.state;
      params.pageSize = pageSizeNew;
      pageSize = params.pageSize;
      let curParams = { ...params, ...formValues };
      if (filter_code) {
          curParams.orderState = filter_code;
      }
      this.setState({ params }, () => {
          this.get_list(curParams);
      });
  };

  //改变页码
  // eslint-disable-next-line no-shadow
  onPageChange = (page, pageSize) => {
      const { formValues, filter_code } = this.state;
      let curParams = { pageSize: pageSize, current: page, ...formValues };
      if (filter_code) {
          curParams.orderState = filter_code;
      }
      this.setState({ params: curParams });
      this.get_list(curParams);
  };

  handleSldExcel = () => {
      const { params, formValues, filter_code, data } = this.state;
      if(data.list != undefined && data.list.length == 0){
          failTip('没有可导出的数据!');
          return 
      }
      let paramData = {
          ...params,
          ...formValues
      };
      if (filter_code) {
          paramData.orderState = filter_code;
      }
      if(paramData.startTime&&paramData.endTime){
          let start = moment(paramData.startTime)
          let end = moment(paramData.endTime)
          let day = end.diff(start,'days') + 1
          if(day>92){
              failTip('订单导出最大时间间隔为三个月!');
              return
          }
      }else{
          failTip('请先选择下单时间，点击搜索后再导出！');
          return 
      }
      paramData.fileName = `${sldComLanguage('订单导出')}`;
      const { dispatch } = this.props;
      this.setState({ loading: true });
      dispatch({
          type: 'order/export_order_list',
          payload: paramData,
          callback: (res) => {
              if (res.state == 200) {
                  const {downloadPath,fileName} = res.data
                  downByUrl(downloadPath,fileName)
              }else{
                  failTip(res.msg)
              }
              this.setState({ loading: false });
          }
      });
  };

  sldHandleCancle = () => {
      const { modalVisible } = this.state;
      this.setState({
          modalVisible: !modalVisible,
          operateData: [],
          modalItem: {},
          modalTitle: ''
      });
  };

  //弹框确定操作
  sldHandleConfirm = (val) => {
      const { modalItem } = this.state;
      const { dispatch } = this.props;
      val.orderSn = modalItem.orderSn;
      dispatch({
          type: 'order/cancle_order',
          payload: val,
          callback: res => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.setState({
                      modalVisible: false,
                      operateData: [],
                      modalItem: {},
                      modalTitle: ''
                  });
                  const { formValues, params } = this.state;
                  this.get_list({ ...formValues, ...params });
              } else {
                  failTip(res.msg);
              }
          }
      });

  };

  agreeReturn = (item) => {
      let { operateData, resList } = this.state;
      operateData.push({
          type: 'onlytxt',
          label: ' ',
          content: `${sldComLanguage('*取消订单后，订单将自动关闭')}`,
          fontSize: '12px',
          fontColor: '#FF711E',
          right: 18,
          bgcColor: '#F2F2F2'
      });
      operateData.push({
          type: 'select',
          label: `${sldComLanguage('取消理由')}`,
          name: 'reasonId',
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
          name: 'remark',
          placeholder: `${sldComLanguage('请输入取消备注，最多50个字')}`,
          initialValue: '',
          maxLength: 50
      });
      this.setState({
          modalTitle: `${sldComLanguage('取消订单')}`,
          modalVisible: true,
          operateData: operateData,
          modalItem: item
      });
  };

  agreeDeliver = (item) => {
      this.setState({
          modalItem: item,
          modalTitle: `${sldComLanguage('商品发货')}`,
          demodalVisible: true,
          deliverType: '0'
      });
  };

  deliverConfirm = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              const { modalItem } = this.state;
              const { dispatch } = this.props;
              values.orderSn = modalItem.orderSn;
              dispatch({
                  type: 'order/confirm_delivery',
                  payload: values,
                  callback: res => {
                      if (res.state == 200) {
                          sucTip(res.msg);
                          this.setState({
                              modalItem: {},
                              modalTitle: '',
                              demodalVisible: false
                          });
                          const { formValues, params } = this.state;
                          this.get_list({ ...formValues, ...params });
                          this.props.form.resetFields();
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });
  };

  sldDeliverHandleCancle = () => {
      this.setState({
          modalItem: {},
          modalTitle: '',
          deliverType: '',
          demodalVisible: false
      });
      this.props.form.resetFields();
  };

  //选择发货方式
  redioOnChange = (e) => {
      this.setState({
          deliverType: e.target.value
      });
  };


  //打印明细单
  printDetail = (val) => {
      this.setState({ print_data: val }, () => {
          sldPrint('send_detail', 'html');
      });
  };
  
  //缓存当前的Tab项
  clickToDetail(){
      setSession('order_detail_type', this.state.filter_code);
  }

  render() {
      const { getFieldDecorator } = this.props.form;
      const { search_data, data, loading, filter_code, params, operateData, modalVisible, modalTitle, submiting, show_foot, modal_width, search_height, demodalVisible, modalItem, expressList, print_data, deliverType,
          markModalVisible,memberModalVisible,showExpresslVisible,memberId,record,expressParam
      } = this.state;
      return (
          <div
              className={`${global.common_page}`}
              style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
          >
              <AuthBtn btnAuth={btnAuth} eventKey={["order_lists_view"]} showPage>
                  <AuthBtn btnAuth={btnAuth} eventKey={["order_lists_export"]}>
                      <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                          {sldLlineRtextAddGoods('#69A2F2', `${sldComLanguage('订单管理')}`)}
                          <Tooltip title="订单导出最大时间间隔为三个月!"><span> {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('订单导出')}`, '#fff', 7, 0, 15, 15, 3)}</span></Tooltip>
                      </div>
                  </AuthBtn>
                  <div style={{ position: 'relative' }}>

                      <div className={global.tableListForm} ref="search_part">
                          <Search
                              search_data={search_data}
                              seaSubmit={(datas) => this.search(datas)}
                              seaReset={() => this.seaReset()}
                              moreSearchToggle={() => this.moreSearchToggle()}
                          />
                      </div>
                      {/*筛选器-start*/}
                      <div style={{ marginBottom: 10 }}>
                          <RadioGroup value={filter_code} size="small" onChange={this.clickFilter}>
                              {this.filter_data.map((item, index) => <RadioButton
                                  key={index + 1}
                                  value={item.filter_code}
                              >{item.filter_name}</RadioButton>)}
                          </RadioGroup>
                      </div>

                      <Spin spinning={loading}>
                          {/*标准表格-start*/}
                          <div className={order.order_list}>
                              <ul className={order.header}>
                                  <li className={`${order.width_30} ${order.pl_100}`}>{sldComLanguage('商品信息')}</li>
                                  <li className={`${order.width_10} ${order.center}`}>商品SKU</li>
                                  <li className={`${order.width_6} ${order.center}`}>{sldComLanguage('单价(元)')}</li>
                                  <li className={`${order.width_6} ${order.center}`}>{sldComLanguage('数量')}</li>
                                  <li className={`${order.width_8} ${order.center}`}>{sldComLanguage('会员名')}</li>
                                  <li className={`${order.width_8} ${order.center}`}>{sldComLanguage('合计金额(含运费)')}</li>
                                  <li className={`${order.width_8} ${order.center}`}>{sldComLanguage('供应商订单号')}</li>
                                  <li className={`${order.width_8} ${order.center}`}>处理标记</li>
                                  <li className={`${order.width_8} ${order.center}`}>订单状态</li>
                                  <li className={`${order.width_8} ${order.center}`}>{sldComLanguage('操作')}</li>
                              </ul>
                              <div className={order.order_content}>
                                  {
                                      data.list != undefined && data.list.length == 0 &&
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  }
                                  <Scrollbars
                                      autoHeight
                                      autoHeightMax={document.body.clientHeight - 272 - search_height}
                                  >
                                      {data.list != undefined && data.list.length > 0 && data.list.map((item, index) => (
                                          <div className={order.item} key={index}>
                                              <div className={`${order.order_info} ${global.flex_row_between_center}`}>
                                                  <div className={`${order.left} ${global.flex_row_start_start}`}>
                                                      <span className={order.order_sn}>{sldComLanguage('订单号：')}{item.orderSn}</span>
                                                      <div className={order.order_type}>
                                                          <img
                                                              className={order.order_type_icon}
                                                              src={famatterOrderType(item.orderType,item.isAllPay).icon}
                                                          />
                                                          <span
                                                              className={order.order_type_text}
                                                          >{famatterOrderType(item.orderType,item.isAllPay).text}</span>
                                                      </div>
                                                      <div className={order.order_type}>
                                                          <img
                                                              className={order.order_type_icon}
                                                              src={famatterOrderSource(item.orderSource,item.orderFeatherInfo).icon}
                                                          />
                                                          <span
                                                              className={order.order_type_text}
                                                          >{famatterOrderSource(item.orderSource,item.orderFeatherInfo).text}</span>
                                                      </div>
                                                  </div>
                                                  <span className={order.create_time}>{sldComLanguage('下单时间：')}{item.createTime}</span>
                                              </div>
                                              <div className={`${order.order_goods_part} ${global.flex_row_start_center}`}>
                                                  <div
                                                      className={`${order.goods} ${global.flex_column_start_start} ${order.width_52} ${item.orderProductListVOList != undefined && item.orderProductListVOList.length > 1 ? order.goods_split : null}`}
                                                  >
                                                      {
                                                          item.orderProductListVOList != undefined && item.orderProductListVOList.length > 0 && item.orderProductListVOList.map((item_goods, index_goods) =>(
                                                              <div
                                                                  className={`${order.goods_item} ${global.flex_row_start_center}`}
                                                                  style={{ width: '100%' }}
                                                                  key={index_goods}
                                                              >
                                                                  <div className={`${global.flex_row_start_center}`} style={{ width: '57.69%' }}>
                                                                      <div className={`${order.goods_img_wrap} ${global.flex_row_center_center}`}>
                                                                          <img
                                                                              src={item_goods.mainImage}
                                                                          />
                                                                      </div>
                                                                      <div className={`${order.goods_info} ${global.flex_column_start_start}`}>
                                                                          <span className={`${order.goods_name}`}>{item_goods.skuName}</span>
                                                                          <span className={`${order.goods_spec}`}>{item_goods.specValues}</span>
                                                                      </div>
                                                                  </div>
                                                                  <span
                                                                      className={`${order.text} ${order.width_10} ${order.center}`}
                                                                      style={{ width: '19.23%' }}
                                                                  >{item_goods.sku}</span>
                                                                  <span
                                                                      className={`${order.goods_price} ${order.width_10} ${order.center}`}
                                                                      style={{ width: '11.53%' }}
                                                                  >￥{item_goods.productShowPrice}</span>
                                                                  <span
                                                                      className={`${order.buy_num} ${order.width_10} ${order.center}`}
                                                                      style={{ width: '11.53%' }}
                                                                  >{item_goods.productNum}</span>
                                                              </div>
                                                          ))}
                                                  </div>
      
                                                  {/* 会员名 */}
                                                  <div className={`${order.member_info} ${global.flex_column_center_center} ${order.width_8}`}>
                                                      <span className={`${order.mem_name}`} onClick={()=>this.showMember(item.memberId)}>{item.memberName}</span>
                                                  </div>
                                                  {/* 合计金额 */}
                                                  <div className={`${order.pay_amount} ${global.flex_column_center_center} ${order.width_8}`}>
                                                      <span className={`${order.mem_name}`}>￥{item.orderAmount}</span>
                                                  </div>
                                                  {/* 供应商订单号 */}
                                                  <div
                                                      className={`${order.text} ${order.width_8} ${order.center}`}
                                                  >{item.supplierOrderSn||'--'}
                                                  </div>
                                                  {/* 处理标记 */}
                                                  <div
                                                      className={`${order.order_state} ${order.width_8} ${order.center}`}
                                                  >{markStateValue(item.markState)}
                                                  </div>
                                                  <div
                                                      className={`${order.order_state} ${order.width_8} ${order.center}`}
                                                  >{item.orderStateValue}
                                                  </div>
                                                  <div
                                                      className={`${order.operate} ${order.width_8} ${order.center}`}
                                                      style={{ padding: '15px 5px' }}
                                                  >
                                                      <Link
                                                          to={{
                                                              pathname: '/order/order_lists_to_detail',
                                                              query: {
                                                                  orderSn: item.orderSn
                                                              }
                                                          }}
                                                      >
                                                          <AuthBtn btnAuth={btnAuth} eventKey={["order_lists_view"]}>
                                                              <div className={`${order.operate_btn}`} onClick={() => this.clickToDetail(item)}>
                                                                  {sldComLanguage('查看详情')}
                                                              </div>

                                                          </AuthBtn>
                                                      </Link>
                                                      <div className={`${order.operate_btn} ${(item.orderState==30||item.orderState==40)?'':order._disabled}`} onClick={()=>this.showExpress({order:item.orderSn,type:'BBC'})}>
                                                          {sldComLanguage('查看物流')}
                                                      </div>
                                                      <AuthBtn btnAuth={btnAuth} eventKey={["order_lists_operation"]}>
                                                          {item.orderState == 20 ?
                                                              <div className={order.operate_btn} onClick={() => this.printDetail(item)}>
                                                                  {sldComLanguage('打印发货单')}
                                                              </div> : null
                                                          }
                                  
                                                          {
                                                              (item.orderState == 20 && item.lockState == 0 && (item.isShowDeliverButton == undefined || (item.isShowDeliverButton != undefined && item.isShowDeliverButton))) ?
                                                                  <div className={order.operate_btn} onClick={() => this.agreeDeliver(item)}>
                                                                      {sldComLanguage('发货')}
                                                                  </div> : null
                                                          }
                                                          {
                                                              item.orderState == 10 || item.orderState == 20 ?
                                                                  <div className={order.operate_btn} onClick={() => this.agreeReturn(item)}>
                                                                      {sldComLanguage('取消订单')}
                                                                  </div> : null
                                                          }
                                                          <div className={`${order.operate_btn} ${(item.orderState==30||item.orderState==40||item.orderState==50)?'':order._disabled}`} onClick={()=>this.showMark(item)}>
                                                              {sldComLanguage('标记')}
                                                          </div>
                                                      </AuthBtn>
                                                  </div>
                                              </div>
                                              {
                                                  item.orderFeatherInfo &&
                                                    <div className={`${order.related_order}`}>
                                                        <span className={`${order.related_text}`}>关联{item.orderFeatherInfo.giverOrReceiver===0?'收礼人':'送礼人'}订单:</span>
                                                        {
                                                            item.orderFeatherInfo.orderSns?
                                                                item.orderFeatherInfo.orderSns.map((orders)=>(
                                                                    <Link
                                                                        to={{
                                                                            pathname: '/order/order_lists_to_detail',
                                                                            query: {
                                                                                orderSn: orders
                                                                            }
                                                                        }}
                                                                    >
                                                                        <Tag color={item.orderFeatherInfo.giverOrReceiver===0?'#0094a3':'#ff6b5c'} onClick={() => this.clickToDetail(item)}>{orders}</Tag>
                                                                    </Link>
                                                                
                                                                ))
                                                                :
                                                                <span>收礼人暂未领取</span>
                                                        }
                                                    </div>
                                              }
                                          </div>
                                      ))
                                      }
                                  </Scrollbars>
                              </div>
                              <div className={order.pagination}>
                                  {
                                      data.list != undefined && data.list.length > 0 && data.pagination != undefined &&
                                        <Pagination
                                            size="small"
                                            showSizeChanger
                                            showQuickJumper
                                            current={data.pagination.current}
                                            pageSize={params.pageSize}
                                            onShowSizeChange={this.onShowSizeChange}
                                            onChange={this.onPageChange}
                                            defaultCurrent={data.pagination.current}
                                            total={data.pagination.total}
                                        />
                                  }
                              </div>
                          </div>
                          {/*标准表格-end*/}
                      </Spin>
                      {/* 发货弹框-start */}

                      <div className={global.modalsty}>
                          <SldModal
                              title={modalTitle}
                              submiting={submiting}
                              show_foot={show_foot}
                              width={modal_width}
                              modalVisible={modalVisible}
                              sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                              sldHandleCancle={this.sldHandleCancle}
                              formItemLayoutModal={formItemLayoutModal}
                              content={operateData}
                          />
                      </div>

                      <Modal
                          centered
                          title={modalTitle}
                          width={modal_width}
                          visible={demodalVisible}
                          onCancel={() => this.sldDeliverHandleCancle()}
                          onOk={this.deliverConfirm}
                      >
                          <Form layout="horizontal">
                              {deliverType == 0
                                  ? <div style={{
                                      width: modal_width,
                                      paddingLeft: modal_width * 0.11,
                                      marginTop: 5,
                                      marginBottom: 8
                                  }}
                                  >
                                      <div style={{
                                          color: '#FF711E',
                                          width: 18 / 24 * (modal_width ? modal_width : 416),
                                          fontSize: 12,
                                          borderBottom: '1px solid #f2f2f2',
                                          lineHeight: '28px'
                                      }}
                                      >* {sldComLanguage('请认真填写物流公司及快递单号')}
                                      </div>
                                  </div> : getSldEmptyH(15)
                              }
                              <FormItem
                                  label={sldComLanguage('收货人姓名')}
                                  {...formItemLayoutModal}
                              >
                                  <span>{modalItem.receiverName}</span>
                              </FormItem>
                              <FormItem
                                  label={sldComLanguage('收货人电话')}
                                  {...formItemLayoutModal}
                              >
                                  <span>{modalItem.receiverMobile}</span>
                              </FormItem>
                              <FormItem />
                              <FormItem
                                  label={sldComLanguage('收货人地址')}
                                  {...formItemLayoutModal}
                              >
                                  <span style={{ wordBreak: 'break-all' }}>{modalItem.receiverAddress}</span>
                              </FormItem>
                              <FormItem
                                  label={sldComLanguage('发货方式')}
                                  {...formItemLayoutModal}
                              >
                                  {getFieldDecorator('deliverType', {
                                      initialValue: 0,
                                      rules: [{ required: true, message: `${sldComLanguage('请选择发货方式')}` }]
                                  })(
                                      <RadioGroup onChange={(e) => this.redioOnChange(e)}>
                                          <Radio value={0}>{sldComLanguage('物流发货')}</Radio>
                                          <Radio value={1}>{sldComLanguage('无需物流')}</Radio>
                                      </RadioGroup>,
                                  )}
                              </FormItem>
                              {
                                  this.state.deliverType == '0' ? <Fragment>
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
                                          label={sldComLanguage('快递单号')}
                                          {...formItemLayoutModal}
                                      >
                                          {getFieldDecorator('expressNumber', {
                                              rules:
                            [{
                                required: true,
                                whitespace: true,
                                message: `${sldComLanguage('请输入物流单号')}`
                            }, {
                                pattern: /^[0-9a-zA-Z]*$/g,
                                message: `${sldComLanguage('请输入正确的单号')}`
                            }]
                                          })(
                                              <Input placeholder={sldComLanguage('请输入物流单号')} maxLength={20} />,
                                          )}
                                      </FormItem>
                                  </Fragment> : null
                              }
                              {
                                  this.state.deliverType == '1' ? <Fragment>
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
                                              <Input placeholder={sldComLanguage('请输入联系人')} maxLength={10} />,
                                          )}
                                      </FormItem>
                                      <FormItem
                                          label={sldComLanguage('联系方式')}
                                          {...formItemLayoutModal}
                                      >
                                          {getFieldDecorator('deliverMobile', {
                                              rules: [
                                                  {
                                                      required: true,
                                                      whitespace: true,
                                                      message: `${sldComLanguage('请输入联系方式')}`
                                                  }, {
                                                      pattern: mobile_reg,
                                                      message: `${sldComLanguage('请输入正确的手机号')}`
                                                  }
                                              ]
                                          })(
                                              <Input maxLength={11} placeholder={sldComLanguage('请输入联系方式')} />,
                                          )}
                                      </FormItem>
                                  </Fragment> : null
                              }

                          </Form>
                      </Modal>

                  </div>
                  {/* 打印发货单-start */}
                  <div style={{ display: 'none' }}>
                      <div id="send_detail">
                          <PrintOrderDetail data={print_data} />
                      </div>
                  </div>
                  {/* 打印发货单-end */}
                  <MarkModal
                      modalVisible={markModalVisible}
                      cancle={this.cancleMark}
                      confirm={this.confirmMark}
                  />
                  <MemberInfoModal
                      modalVisible={memberModalVisible}
                      memberId={memberId}
                      cancle={this.cancleMember}
                      confirm={this.confirmMember}
                  />
                  <Express
                      modalVisible={showExpresslVisible}
                      cancle={this.cancleExpress}
                      expressParam={expressParam}
                  />
              </AuthBtn>
          </div>
      );
  }
}
