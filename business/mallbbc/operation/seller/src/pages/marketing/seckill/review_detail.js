/*
* 秒杀审核详情
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin,Tooltip,Table } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    sucTip,
    failTip,
    sldIconBtnBg,
    setSession,
    isEmpty,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import _styles from './index.less';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let stateTxtValue = { 0: "待店铺审核", 1: "待平台审核", 2: "审核通过",3:"审核拒绝" }
// eslint-disable-next-line no-shadow
@connect(({ promotion,global }) => ({
    promotion,global
}))
@Form.create()
export default class JoinedGoodsList extends Component {
   

    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            detail:{}, // 活动详情信息
            data: {},//列表数据

            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key

            query: props.location.query,
            params: { pageSize: pageSize,current:1},//搜索条件
            formValues: {},//搜索条件
            columns: [
                {
                    title: '商品名称',
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 100,
                    render: (text) => <Tooltip title={text}><div className={`${_styles['sku_name']}`}>{text||'--'}</div></Tooltip>
                },
                {
                    title: 'sku',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 100
                },
                {
                    title: '审核状态',
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
                },
                {
                    title: '销售价',
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100,
                    render: (text) => <span>{text||'--'}</span>
                },
                {
                    title: '划线价',
                    dataIndex: 'markingPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '秒杀价',
                    dataIndex: 'promotionPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '秒杀库存',
                    dataIndex: 'promotionStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: '限购数量',
                    dataIndex: 'upperLimit',
                    align: 'center',
                    width: 100
                }
            ]
        };
    }


    componentDidMount() {
        const { query } = this.state;
        if (query.stageId != undefined && query.stageId > 0) {
            const {promotionId,stageId,promotionName,stageTime,stageAliar,verifyState,type} = query
            this.setState({
                detail:{
                    promotionId,
                    stageId,
                    promotionName,
                    stageTime,
                    stageAliar,
                    verifyState,
                    type
                }
            })
            // 获取列表页
            let verifyStates 
            if(type=='view'){
                verifyStates = [0,3]
            }else if(type=='audit'){
                verifyStates = [0]
            }
            this.get_list({pageIndex:1,pageSize:2000,verifyStates})
        }
    }
  
 
 //获取数据列表
 get_list = (params) => {
     this.setState({ initLoading: true });
     const { dispatch } = this.props;
     const { query } = this.state;
     dispatch({
         type: 'promotion/get_joined_seckill_goods',
         payload: { ...params,stageId:query.stageId },
         callback: (res) => {
             this.setState({ initLoading: false });
             if (res.state == 200) {
                 if (res.data.list.length == 0 && this.state.params.current > 1) {
                     params.current = params.current - 1;
                     params.pageIndex = params.current
                     this.get_list(params);
                 } else {
                     res.data.list.forEach((item,index)=>{
                         item.key = index;
                     });
                     this.setState({
                         data: res.data
                     });
                 }
             }
         }
     });
 };

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

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      const { formValues,params } = this.state;
      if (type == 'main') {
         
          const params1 = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          const { showState } = params1
          if(isEmpty(showState)){
              delete params.showState
          }
          Object.assign(params,params1)
         
          pageSize = params.pageSize;
          this.setState({ params });
          this.get_list(params);
      }
  };

    refuseEvent = (reason)=>{
        this.auditPromotion({rejectReason:reason,verifyState:3})
    }

    successEvent = ()=>{
        this.auditPromotion({verifyState:1})
    }

    auditPromotion = (param)=>{
        const { detail,data:{list} } = this.state
        const { dispatch } = this.props;
        param.promotionId = detail.promotionId
        param.stageId = detail.stageId
        if(list){
            let arr = []
            list.forEach((item)=>{
                arr.push(item.productId)
            })
            param.productIds = arr
        }else{
            failTip('商品不存在');
            return
        }
        
        dispatch({
            type: 'promotion/audit',
            payload: param,
            callback: (res) => {
                if (res.state == 200) {
                    sucTip(res.msg);
                    this.get_list({ pageSize: 2000,pageIndex:1 });
                    setTimeout(()=>{
                        this.goBack()
                    },500)
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    goBack = ()=>{
        setSession('seckill_detail_back',5);
        this.props.history.goBack()
    }

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  render() {
      const { columns, initLoading, data,detail,type} = this.state;
     
      return (
          <div className={global.common_page}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', '活动详情', 0, 0, 10)}
                  {sldIconBtnBg(() => {this.goBack()}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              <div className={`${_styles['content_des']}`}>
                  <div className={`${_styles['des_item']} ${_styles['des_item_name']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                  <div className={`${_styles['des_item']} ${_styles['des_item_date']}`}><span className={`${_styles['des_item_title']}`}>活动日期：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageTime}</span></div>
                  <div className={`${_styles['des_item']} ${_styles['des_item_date']}`}><span className={`${_styles['des_item_title']}`}>活动场次：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageAliar}</span></div>
                  {/* <div className={`${_styles['des_item']} ${_styles['des_item_state']}`}><span className={`${_styles['des_item_title']}`}>商品审核状态：</span> <span className={`${_styles['des_item_content']}`}>{stateTxtValue[detail.verifyState]}</span></div> */}
                 
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  {/* <StandardTable
                      totalHeight={document.body.clientHeight - 260}
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="id"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      onSldHandleSeleRow={this.onSldHandleSeleRow}
                      resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                      isColumnResize
                  /> */}
                  {/*标准表格-end*/}
                  <Table 
                      rowKey="withKey"
                      columns={columns}
                      dataSource={data.list}
                      size="small"
                      pagination={this.pagination}
                  />
              </Spin>
              <ReviewLog type='project/listRecord' params={{businessId:this.props.location.query.stageId}} />
              <div
                  className={global.m_diy_bottom_wrap}
                  style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
              >
                  {/* <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                      {sldComLanguage('取消')}
                  </div>
                  <div
                      onClick={() => this.props.form.submit(this.handleSaveAllData)}
                      className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                  >
                      {sldComLanguage('确定')}
                  </div> */}
                  {
                      detail.type == 'audit' && hasAuth('seckill_audit_audit') &&
                      <ReviewButton 
                          refuseText='审核拒绝'
                          refuseTitle='确定拒绝该条活动么?'
                          refuseEvent={this.refuseEvent}
                          successText='审核通过'
                          successTitle='确定通过该条活动么?'
                          successEvent={this.successEvent}
                      />
                  }
                      
                  
              </div>
          </div>

      );
  }
}
