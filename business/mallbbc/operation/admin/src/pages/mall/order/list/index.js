import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Radio, Empty, Pagination, Tooltip,Tag } from 'antd';
import Link from 'umi/link';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    sldComLanguage,
    dateFormat,
    sldLlineRtextAddGoods,
    sldIconBtnBg,failTip,downByUrl, getAuthBtn,
    setSession,
    getSession,
    removeSession,
    isNotEmpty
} from '@/utils/utils';
import {
    famatterOrderType,
    famatterOrderSource
} from '@/utils/util_data';
import global from '@/global.less';
import order from '../order.less';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';
import MarkModal from './components/markModal';
import MemberInfoModal from './components/memberInfoModal';
import VopModal from './components/vopModal';
import Express from './components/express';


let btnAuth = getAuthBtn();
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const markStateValue = (text) => { 
    switch (text){
    case 1: return <DotTag type="failed">待处理</DotTag>
    case 2: return <DotTag type="pending">处理中</DotTag>
    case 3: return <DotTag type='sucess'>处理完成</DotTag>
    default: return '--'
    }                    
}
// sinosun.com 域名下才显示穿透按钮
let host = window.location.host
// 开发调试显示该按钮
if(process.env.NODE_ENV=='development'){
    host = 'sinosun.com'
}
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-shadow
@connect(({ order,project }) => ({
    order,project
}))
@Form.create()
export default class Order_lists extends Component {
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
            viewAuth:"view_order",
            search_height:0,
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
                label: `${sldComLanguage('订单号')}`,//订单号
                name: 'orderSn',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('订单号或供应商订单号')}`//请输入订单号
            }, {
                type: 'input',
                label: `${sldComLanguage('会员名')}`,//会员名
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名')}`//请输入会员名
            }, {
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,//商品名称
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入商品名称')}`//请输入商品名称
            }, {
                type: 'input',
                label: `${sldComLanguage('商品SKU')}`,//商品SKU
                name: 'sku',
                placeholder: `${sldComLanguage('请输入商品SKU')}`//请输入商品SKU
            },{
                type: 'select',
                label: `${sldComLanguage('下单渠道')}`,
                name: 'channelId',
                placeholder: `${sldComLanguage('请选择下单渠道')}`,
                sel_data: []
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('下单时间')}`,//下单时间
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,//开始时间
                placeholder2: `${sldComLanguage('结束时间')}`//结束时间
            },{
                type: 'select',
                label: `${sldComLanguage('所属店铺')}`,
                name: 'storeId',
                placeholder: `${sldComLanguage('请选择所属店铺')}`,
                sel_data: []
            },
            {
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
            modal_width: 700,
            modalItem: {},
            demodalVisible: false,
            expressList: [],
            deliverType: '',
            resList: [], // 取消原因数据
            markModalVisible:false,
            memberModalVisible:false,
            vopModalVisible:false,
            showExpresslVisible:false,
            record:{},
            memberId:'',
            expressParam:{}
        };
    }

    componentDidMount() {
        let params = {pageSize: pageSize}
        if(getSession('order_detail_back')){
            const {search_data} = this.state
            let searchKey = []
            search_data.forEach((item)=>{searchKey.push(item.name)})
            let exkey = searchKey.slice(4) //展开项的key
            let _search_params = JSON.parse(getSession('order_detail_back'))
            // _search_params 来自三个部分  搜索条件  订单状态  分页  formValues,filter_code, current,pageSize
            // eslint-disable-next-line no-shadow
            let {filter_code,orderState,current,pageSize,...formValues} = _search_params
        
            if(isNotEmpty(filter_code)){params.orderState = filter_code}

            params = {...params,...formValues,current,pageSize}
            removeSession('order_detail_back')
            // 时间特殊处理 
            if(formValues.startTime && formValues.endTime){

                formValues.search_create_time = [moment(formValues.startTime),moment(formValues.endTime)]
            }
            // 处理展开项
            Object.keys(formValues).some(key=>{
                if(exkey.includes(key)){
                    this.searchFormRef.setState({expandForm:true},()=>{
                        this.resize()
                    })
                    return true
                }
                return false
                
            })
            // 需要等展开按钮渲染后才能设置值
            setTimeout(()=>{
                Object.keys(formValues).forEach((key)=>{
                    if(searchKey.includes(key)){
                        this.searchFormRef.props.form.setFieldsValue({ [key]: formValues[key] }) 
                    }
                })
            },500)

            this.setState({
                filter_code:filter_code||'',
                formValues:{...formValues}
            })
        }

        this.get_list({ ...params });
        this.get_operation_list()
        this.get_store_list()
        this.resize();
        window.addEventListener('resize', this.resize, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    // 获取渠道信息
    get_operation_list = ()=>{
        const { dispatch } = this.props;
        const arr = []
        dispatch({
            type: 'project/operation_list',
            payload: { pageSize:1000, pageNum:1 },
            callback: (res) => {
                if (res.state == 200) {
                    if(res.data.channelInfos && res.data.channelInfos.length > 0) {
                        res.data.channelInfos.filter(item => item.channelId !== '-1').forEach(item => {
                            arr.push({
                                name: item.channelName,
                                key: item.channelId
                            })
                        })
                        
                        arr.unshift({
                            name: '全部渠道',
                            key: ''
                        })
                    }

                    this.setState(prev => ({
                        search_data: prev.search_data.map(item => {
                            if(item.name === 'channelId') {
                                item.sel_data = arr
                            }
                            return item
                        })
                    }));
                }
            }
        });
    }

    //获取数据列表
    get_store_list = () => {
        const { dispatch } = this.props;
        const { search_data } = this.state;
        dispatch({
            type: 'project/get_own_store_list',
            payload: {},
            callback: (res) => {
                if (res.state == 200) {
                    let storeArr = []
                    res.data.list.forEach((item) => {
                        storeArr.push({
                            key: item.storeId,
                            name: item.storeName
                        })
                    })

                    storeArr.unshift({
                        name: '全部店铺',
                        key: ''
                    })

                    search_data.forEach(item=>{
                        if (item.name == 'storeId') {
                            item.sel_data = storeArr;
                        }
                    })

                    this.setState({
                        search_data
                    });
                }
            }
        });
    };

  resize = () =>{
      const {search_height} = this.state;
      if(this.refs.search_part!=undefined){
          if(this.refs.search_part.clientHeight != search_height){
              this.setState({search_height:this.refs.search_part.clientHeight})
          }
      }
  }

  //搜索点击
  moreSearchToggle = () => {
      this.resize()
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
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
      const values = { ...data };
      const { filter_code } = this.state;
      //时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_create_time = '';
      }
      values.orderState = filter_code;
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
          filter_code:'',
          data:{},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize });
  };

  save = ()=>{
      // eslint-disable-next-line no-shadow
      const { formValues,filter_code,data:{pagination:{current,pageSize}} } = this.state;
      setSession('order_detail_back',JSON.stringify({...formValues,filter_code,current,pageSize}))
  }

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
  
  showVop = (item)=>{
      this.setState({
          record:item,
          vopModalVisible:true
      })
  }

    canclevop = ()=>{
        this.setState({
            vopModalVisible:false
        })
    }

    confirmvop = ()=>{
        this.setState({
            vopModalVisible:false
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
      //搜索条件置为空
      this.setState({
          filter_code: e.target.value
      });
      const { formValues } = this.state;
      let param = {pageSize: pageSize, current: 1};
      if(e.target.value){
          param.orderState = e.target.value;
      }
      this.get_list({...formValues,...param});
  };

  //改变每页的数量
  onShowSizeChange = (current, pageSizeNew) => {
      let { params,formValues,filter_code } = this.state;
      params.pageSize = pageSizeNew;
      pageSize = params.pageSize;
      let curParams = { ...params, ...formValues }
      if(filter_code){
          curParams.orderState = filter_code;
      }
      this.setState({ params },()=>{
          this.get_list(curParams);
      });
  };

  //改变页码
  // eslint-disable-next-line no-shadow
  onPageChange = (page, pageSize) => {
      const { formValues, filter_code } = this.state;
      let curParams = { pageSize: pageSize, current: page, ...formValues }
      if(filter_code){
          curParams.orderState = filter_code;
      }
      this.setState({ params: curParams});
      this.get_list(curParams);
  };

  onRefSearch = (ref) => {
      this.searchFormRef = ref;
  }

  handleSldExcel = () => {
      const { params, formValues,filter_code,data } = this.state;
      if(data.list != undefined && data.list.length == 0){
          failTip('没有可导出的数据!');
          return 
      }
      let paramData = {
          ...params,
          ...formValues
      };
      if(filter_code){
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
      this.setState({loading:true})
      dispatch({
          type: 'order/export_order_lists',
          payload: paramData,
          callback: (res) => {
              if(res.state == 200){
                  const {downloadPath,fileName} = res.data
                  downByUrl(downloadPath,fileName)
              }else{
                  failTip(res.msg);
              }
              this.setState({loading:false})
          }
      })
  };

  render() {
      const { search_data, data, loading, filter_code, params,search_height ,viewAuth,markModalVisible,memberModalVisible,vopModalVisible,showExpresslVisible,memberId,record,expressParam} = this.state;
      return (
          <div
              className={`${global.common_page}`}
              style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
          >
              <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                  {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('订单管理')}`)}
                  <AuthBtn eventKey={["export_order"]} btnAuth={btnAuth}>
                      <AuthBtn eventKey={[viewAuth]} btnAuth={btnAuth}>
                          <Tooltip title="订单导出最大时间间隔为三个月!"><span> {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('订单导出')}`, '#fff', 7, 0, 15, 15, 3)}</span></Tooltip>  
                      </AuthBtn>
                  </AuthBtn>
              </div>
              <AuthBtn eventKey={[viewAuth]} btnAuth={btnAuth} showPage>

                  <div style={{ position: 'relative' }}>
                      <div className={global.tableListForm} ref="search_part">
                          <Search
                              search_data={search_data}
                              seaSubmit={(datas) => this.search(datas)}
                              seaReset={() => this.seaReset()}
                              width={200}
                              onRef={this.onRefSearch}
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
                                  <li className={`${order.width_20} ${order.pl_100}`}>商品信息</li>
                                  <li className={`${order.width_6} ${order.center}`}>下单渠道</li>
                                  <li className={`${order.width_10} ${order.center}`}>商品SKU</li>
                                  <li className={`${order.width_6} ${order.center}`}>单价(元)</li>
                                  <li className={`${order.width_6} ${order.center}`}>数量</li>
                                  <li className={`${order.width_8} ${order.center}`}>会员名</li>
                                  <li className={`${order.width_8} ${order.center}`}>合计金额(含运费)</li>
                                  <li className={`${order.width_10} ${order.center}`}>供应商订单号</li>
                                  <li className={`${order.width_8} ${order.center}`}>处理标记</li>
                                  <li className={`${order.width_8} ${order.center}`}>订单状态</li>
                                  <li className={`${order.width_10} ${order.center}`}>操作</li>
                              </ul>
                              <div className={order.order_content}>
                                  {data.list != undefined && data.list.length == 0 &&
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  }
                                  <Scrollbars
                                      autoHeight
                                      autoHeightMax={document.body.clientHeight - 272-search_height}
                                  >
                                      {
                                          data.list != undefined && data.list.length > 0 && data.list.map((item, index) => (
                                              <div className={order.item} key={index}>
                                                  <div className={`${order.order_info} ${global.flex_row_between_center}`}>
                                                      <div className={`${order.left} ${global.flex_row_start_start}`}>
                                                          {/*<span className={order.num}>序号:{index + 1}</span>*/}
                                                          <span className={order.order_sn}>{sldComLanguage('订单号')}：{item.orderSn}</span>
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
                                                          <span className={order.order_sn} style={{marginLeft:20}}>店铺【{item.storeName}】</span>
                                                      </div>
                                                      <span className={order.create_time}>{sldComLanguage('下单时间')}：{item.createTime}</span>
                                                  </div>
                                                  <div className={`${order.order_goods_part} ${global.flex_row_start_center}`}>

                                                      <div
                                                          className={`${order.goods} ${global.flex_column_start_start} ${order.width_48} ${item.orderProductListVOList != undefined && item.orderProductListVOList.length > 1 ? order.goods_split : null}`}
                                                      >

                                                          {
                                                              item.orderProductListVOList != undefined && item.orderProductListVOList.length > 0 && item.orderProductListVOList.map((item_goods, index_goods) => (
                                                                  <div
                                                                      className={`${order.goods_item} ${global.flex_row_start_center}`}
                                                                      style={{ width: '100%' }}
                                                                      key={index_goods}
                                                                  >
                                                                      <div className={`${global.flex_row_start_center}`} style={{ width: '41.6%' }}>
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
                                                                          className={`${order.channelName} ${order.width_10} ${order.center}`}
                                                                          style={{ width: '12.5%' }}
                                                                      >{item.channelName}</span>
                                                                      <span
                                                                          className={`${order.text} ${order.width_10} ${order.center}`}
                                                                          style={{ width: '20.8%' }}
                                                                      >{item_goods.sku}</span>
                                                                      <span
                                                                          className={`${order.goods_price} ${order.width_10} ${order.center}`}
                                                                          style={{ width: '12.5%' }}
                                                                      >￥{item_goods.productShowPrice}</span>
                                                                      <span
                                                                          className={`${order.buy_num} ${order.width_10} ${order.center}`}
                                                                          style={{ width: '12.5%' }}
                                                                      >{item_goods.productNum}</span>
                                                                  </div>
                                                              ))}
                                                      </div>

                                                      {/* 会员名 */}
                                                      <div className={`${order.member_info} ${global.flex_column_center_center} ${order.width_8}`}>
                                                          <span className={`${order.mem_name}`} onClick={()=>this.showMember(item.memberId)}>{item.memberName}</span>
                                                      </div>
                                                      {/* 合计金额 */}
                                                      <div
                                                          className={`${order.pay_amount} ${order.width_8} ${order.center}`}
                                                      >￥{item.orderAmount}
                                                      </div>
                                                      {/* 供应商订单号 */}
                                                      <div className={`${order.member_info} ${global.flex_column_center_center} ${order.width_10}`}>
                                                          <span className={`${order.text}`}>{item.supplierOrderSn||'--'}</span>
                                                      </div>
                                                      {/* 处理标记 */}
                                                      <div
                                                          className={`${order.order_state} ${order.width_8} ${order.center}`}
                                                      >{markStateValue(item.markState)}
                                                      </div>
                                                      {/* 订单状态 */}
                                                      <div
                                                          className={`${order.order_state} ${order.width_8} ${order.center}`}
                                                      >{item.orderStateValue}
                                                      </div>

                                                      <div className={`${order.operate} ${order.width_10} ${order.center} `}>
                                                          <Link
                                                              to={{
                                                                  pathname: '/manage_order/order_lists_to_detail',
                                                                  query: {
                                                                      orderSn: item.orderSn
                                                                  }
                                                              }}
                                                          >
                                                              <div className={`${order.operate_btn}`} onClick={this.save}>
                                                                  {sldComLanguage('查看详情')}
                                                              </div>
                                                          </Link>
                                                          <div className={`${order.operate_btn} ${(item.orderState==30||item.orderState==40)?'':order._disabled}`} onClick={()=>this.showExpress({order:item.orderSn,type:'BBC'})}>
                                                              {sldComLanguage('查看物流')}
                                                          </div>
                                                          <AuthBtn eventKey={["order_lists_operation"]} btnAuth={btnAuth}>
                                                              <div className={`${order.operate_btn} ${(item.orderState==30||item.orderState==40||item.orderState==50)?'':order._disabled}`} onClick={()=>this.showMark(item)}>
                                                                  {sldComLanguage('标记')}
                                                              </div>
                                                          </AuthBtn>
                                                          {
                                                              host.includes('sinosun.com') && item.supplierOrderSn &&
                                                            <div className={`${order.operate_btn}`} onClick={()=>this.showVop(item)}>
                                                                {sldComLanguage('穿透')}
                                                            </div>
                                                          }
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
                                                                        pathname: '/manage_order/order_lists_to_detail',
                                                                        query: {
                                                                            orderSn: orders
                                                                        }
                                                                    }}
                                                                >
                                                                    <Tag color={item.orderFeatherInfo.giverOrReceiver===0?'#0094a3':'#ff6b5c'}>{orders}</Tag>
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
                  </div>
              </AuthBtn>
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
              <VopModal
                  modalVisible={vopModalVisible}
                  cancle={this.canclevop}
                  confirm={this.confirmvop}
                  supplierOrderSn={record.supplierOrderSn}
                  showExpress={this.showExpress}
              />
              <Express
                  modalVisible={showExpresslVisible}
                  cancle={this.cancleExpress}
                  expressParam={expressParam}
              />
          </div>
      );
  }
}
