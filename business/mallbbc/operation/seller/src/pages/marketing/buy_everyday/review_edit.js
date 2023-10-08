/* eslint-disable react/sort-comp */
/*
* 参加天天专场活动
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, InputNumber,Tooltip,message,Spin,Table,Popconfirm } from 'antd';
import {
    sucTip,
    failTip,
    sldLlineRtextAddMargin,
    sldComLanguage,
    isEmpty,
    setSession,
    getAuthBtn,
    getTableNum,
    hasAuth
} from '@/utils/utils';

import global from '@/global.less';
import _styles from './index.less';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();

let sthis = '';
const FormItem = Form.Item;
let stateTxtValue = { 1: '未开始', 2: '进行中', 3: '已结束' }
// eslint-disable-next-line no-shadow
@connect(({ promotion,project, global }) => ({
    promotion,project, global
}))
@Form.create()
export default class AddSecill extends Component {
      sele_more_goods = {
          info: [],//选择的商品数组
          ids: [],//选择的商品id数组
          min_num: 1//最小数量，0为不限制
      };
    
      constructor(props) {
          super(props);
          sthis = this;
          const {
              form: { getFieldDecorator }
          } = props;
          this.state = {
              query: props.location.query,
              columns: [
                  {
                      title: '序号',
                      dataIndex: 'index',
                      align: 'center',
                      width: 30,
                      render: (text, record, index) => getTableNum(this.state.page, 10, index)
                  },
                  {
                      title: '商品名称',
                      dataIndex: 'skuName',
                      align: 'center',
                      width: 100,
                      render: (text) => <Tooltip title={text}><div className={`${_styles['sku_name']}`}>{text}</div></Tooltip>
                  },
                  {
                      title: 'sku编号',
                      dataIndex: 'sku',
                      align: 'center',
                      width: 100
                  },
                  {
                      title:'销售价',
                      dataIndex: 'salePrice',
                      align: 'center',
                      width: 100
                  },
                  {
                      title:'结算价',
                      dataIndex: 'supplierSettlePrice',
                      align: 'center',
                      width: 100
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>划线价
                      </div>,
                      dataIndex: 'markingPrice',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`markingPrice${record.withKey}`, {
                                  initialValue: text,
                                  rules:[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]
                              })(
                                  <InputNumber
                                      min={0.01}
                                      max={9999999}
                                      precision={2}
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e, 'markingPrice', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: <div style={{ position: 'relative' }}>
                          <span style={{ color: '#FF2929', fontSize: 13 }}>*</span>专场价
                      </div>,
                      dataIndex: 'promotionPrice',
                      align: 'center',
                      width: 100,
                      render: (text, record) => (
                          <FormItem
                              style={{ width: '100%' }}
                          >
                              {getFieldDecorator(`promotionPrice${record.withKey}`, {
                                  initialValue: text,
                                  rules:[{
                                      required: true,
                                      message: `${sldComLanguage('该项必填')}`
                                  }]
                              })(
                                  <InputNumber
                                      min={0.01}
                                      max={9999999}
                                      precision={2}
                                      style={{ width: '100%' }}
                                      onChange={e => this.handleFieldChange(e, 'promotionPrice', record)}
                                  />,
                              )}
                          </FormItem>
                      )
                  },
                  {
                      title: '操作',
                      align: 'center',
                      width: 100,
                      render: (_, record) => (
                          <Fragment>
                              {hasAuth('buy_everyday_audit_edit')?
                                  <Popconfirm
                                      title="是否确定删除?"
                                      onConfirm={()=>this.delItem(record)}
                                      onCancel={()=>{}}
                                  ><span className={`${_styles['operation_text']}`}>删除</span></Popconfirm>:'--'

                              }
                          </Fragment>
                      )
                  }
              ],//商品规格表头
              detail:{}, // 活动详情信息
              uploading:false, 
              originData:[],
              activityStateList:[], //已参加其他活动的sku   
              page:{
                  current:1,
                  pageSize:10
              } 
          };
      }

      componentDidMount() {
          const { query } = this.state;
          if (query.id != undefined) {
              // 获取活动详情
              this.get_detail(query);
          }
          
      }

    //获取数据列表
    get_list = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        const { query,detail } = this.state;
        params.pageIndex = params.current || 1
        dispatch({
            type: 'promotion/get_buyEveryday_skus',
            payload: { promotionId: query.id, ...params, verifyStates:[query.verifyState] },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    if (res.data.products.length == 0 && this.state.params.current > 1) {
                        params.current = params.current - 1;
                        this.get_list(params);
                    } else {
                        res.data.products.forEach((item) => {
                            item.withKey = `${item.sku}`;
                        });
                        detail.state = res.data.state
                        this.setState({                       
                            originData:res.data.products || [],
                            detail
                        });
                    }
                }
            }
        });
    };
    
  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { query,originData} = this.state;
      this.props.form.validateFieldsAndScroll((err) => {
          if (!err) {
              let sendParams = {}
              let products = []
              let tipsInfo = []
              originData.forEach((item)=>{
                  const {sku,skuName,mainImage,salePrice,promotionPrice,markingPrice,id} = item
                  let arrinfo = []
                  if(isEmpty(promotionPrice)){
                      arrinfo.push(`专场价为必填`)
                  }
                  if(isEmpty(markingPrice)){
                      arrinfo.push(`划线价为必填`)
                  }
                  if(Number(markingPrice)<Number(promotionPrice)){
                      arrinfo.push(`划线价不能小于专场价`)
                  }
                  if(arrinfo.length>0){
                      let info = arrinfo.join(',')
                      tipsInfo.push(`商品${sku},${info}`)
                  }
                  products.push({
                      sku,
                      productId:id,
                      skuName,
                      mainImage,
                      salePrice:salePrice,
                      promotionPrice,
                      markingPrice
                  })
                
              })
              if (products.length == 0) {
                  message.error("没有商品，无法提交审核，请取消", 6);
                  return false;
              }              
              sendParams.promotionId = query.id
              sendParams.products = products
              
              if(tipsInfo.length>0){
                  const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${tipsInfo.join('\n')}`}</p>)
                  message.error(rdom,6);
                  tipsInfo = [];
                  return false;
              }
              sthis.setState({ uploading: true });
              dispatch({
                  type: 'promotion/updateProduct',
                  payload: sendParams,
                  callback: (res) => {
                      sthis.setState({ uploading: false });
                      if (res.state == 200) {
                          sucTip(res.msg);
                          setTimeout(() => {
                              this.goBackList()
                          }, 500);
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisibleGoods: false });
  };

  delItem = (record)=>{
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/quit_buyEveryday',
          payload: {
              promotionIdBindProductId: record.id
          },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  sucTip('退出成功')
                  let { originData } = this.state
                  originData = originData.filter(item=>item.withKey!=record.withKey)
                  this.setState({
                      originData
                  })   
              } else {
                  failTip(res.msg)
              }
          }
      });
  }
  
   //获取详情
   get_detail = (query) => {
       const {promotionName,promotionTime,state,verifyState} = query
       this.setState({
           detail:{
               promotionName,
               promotionTime,
               verifyState,
               state
           }
       },()=>{        
           // 获取列表页
           this.get_list({ pageSize: 2000 })
       });
   };

   handleFieldChange(val, fieldName, record) {
       let { originData } = this.state;

       //拼团价格不可以超过商品价格
       if (fieldName == 'promotionPrice' && Number(val) > Number(record.salePrice)) {
           val = record.salePrice;
       }
       // 当前操作的数据
       let tar_item = originData.filter(item => item.withKey == record.withKey);
       if (tar_item.length > 0) {
           let tar_data = tar_item[0];
           if (tar_data) {
               tar_data[fieldName] = val;
               this.setState({ originData }, () => {
                   sthis.props.form.resetFields([`promotionPrice${record.withKey}`]);
               });
           }
       }
   }

   // eslint-disable-next-line react/sort-comp
   pagination = {
       onChange:(current)=>{
           this.setState({
               page:{
                   current,
                   pageSize:10
               }
           })
       }
   }

   goBackList = ()=>{
       setSession('togetherBuy_detail_back',3); 
       this.props.history.goBack()
   }

   render() {
       const { detail,uploading,columns,originData } = this.state;
    
       return (
           <div
               className={`${global.common_page} ${global.com_flex_column}`}
               style={{ position: 'relative' }}
           >
               <AuthBtn eventKey={['buy_everyday_audit_view']} btnAuth={btnAuth} showPage>
                  
                   {sldLlineRtextAddMargin('#FA6F1E', `${sldComLanguage('天天专场 / 编辑专场')}`, 0, 0, 10)}
                   <div className={`${_styles['content_des']}`}>
                       <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>专场名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                       <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>专场日期：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionTime}</span></div>
                       <div className={`${_styles['des_item']}`}><span className={`${_styles['des_item_title']}`}>活动状态：</span> <span className={`${_styles['des_item_content']}`}>{stateTxtValue[detail.state]}</span></div>
                   </div>

                   <Spin spinning={uploading}>
                       <Scrollbars
                           autoHeight
                           autoHeightMin={100}
                           autoHeightMax={document.body.clientHeight-300}
                       >
                           <Table 
                               rowKey="withKey"
                               columns={columns}
                               dataSource={originData}
                               size="small"
                               pagination={this.pagination}
                           />
                       </Scrollbars>
                       
                   </Spin>
                   <div
                       className={global.m_diy_bottom_wrap}
                       style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                   >
                       <div onClick={() => this.goBackList()} className={global.add_goods_bottom_btn}>
                           {sldComLanguage('取消')}
                       </div>
                       {hasAuth('buy_everyday_audit_audit')&&<div
                           onClick={() => this.props.form.submit(this.handleSaveAllData)}
                           className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                       >
                           {sldComLanguage('提交审核')}
                       </div>}
                   </div>
               </AuthBtn>
           </div>
       );
   }
}
