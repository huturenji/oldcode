/*
* 参与一起买活动的商品
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,Tabs,Icon,Modal,DatePicker,Tooltip } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldComLanguage,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldLlineRtextAddGoodsAddMargin,
    sucTip,
    failTip,
    sldIconBtnBg,
    sldPopConfirmDiy,
    setSession,
    dateFormat,
    isEmpty,
    downByUrl,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import _styles from './index.less';
import StandardTable from '@/components/StandardTable';
import DotTag from '@/components/DotTag';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
let pageSize = list_com_page_size_10;
let showLeng = 7
@connect(({ promotion }) => ({
    promotion
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
            params: { pageSize: pageSize,current:1, pageIndex:1},//搜索条件
            formValues: {},//搜索条件
            columns: [
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
                    title: '销售价',
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '结算价',
                    dataIndex: 'settlePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '划线价',
                    dataIndex: 'markingPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '拼团价',
                    dataIndex: 'promotionPrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: '实际成团件数',
                    dataIndex: 'lowestStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: '成团件数',
                    dataIndex: 'wishStock',
                    align: 'center',
                    width: 100
                },
                {
                    title: '每人限购件数',
                    dataIndex: 'upperLimit',
                    align: 'center',
                    width: 100
                },
                {
                    title: '已售件数',
                    dataIndex: 'buyQuantity',
                    align: 'center',
                    width: 100
                },
                {
                    title: '参团人数',
                    dataIndex: 'buyerCount',
                    align: 'center',
                    width: 100
                },
                {
                    title: '拼团状态',
                    dataIndex: 'showState',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        switch (text){
                        case 1: return <DotTag type="normal">{record.showStateValue}</DotTag>
                        case 2: return <DotTag type='pending'>{record.showStateValue}</DotTag>
                        case 3: return <DotTag type='sucess'>{record.showStateValue}</DotTag>
                        case 4: return <DotTag type='failed'>{record.showStateValue}</DotTag>
                        default: return <DotTag type='normal'>{record.showStateValue}</DotTag>
                        }                    
                    },
                    filters:[
                        {
                            text: '未开始',
                            value: 1
                        },
                        {
                            text: '拼团中',
                            value: 2
                        },
                        {
                            text: '拼团成功',
                            value: 3
                        },
                        {
                            text: '拼团失败',
                            value: 4
                        }
                    ],
                    filterMultiple:false
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {
                                ((record.showState == 1 || record.showState == 2)) && hasAuth('together_buy_attend_quit')?
                                    sldPopConfirmDiy('leftBottom', `${sldComLanguage('是否确定退出')}`, () => this.quitActivity(record), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('退出')}`, () => null)):'--'
                            }
                        </Fragment>
                    )
                }
            ],
            dayList:[], // 该活动下商家所有参与的活动场次  维度为 天 > 场次 
            showDayList:[], // 展示的天
            stageList:[], // 天下面的场次
            currentDay:'', // 当前激活的天
            exportVisible:false,
            showMore:false, // 是否展示更多按钮
            showMoreState:1 // 默认收起  1 收起  2 展开
        };
        this.formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 }
            }
        }
    }


    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            // 获取详情
            this.get_detail(query.id)
            // 获取场次信息
            this.buyTogetherStageList(query.id)
        }
    }

    //获取详情
  get_detail = (id) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/get_buyTogether_detail',
          payload: { promotionId: id },
          callback: (res) => {
              if (res.state == 200) {
                  this.setState({
                      detail:res.data
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };
  
  // 获取场次
  buyTogetherStageList = (id) => {
      const { dispatch } = this.props;
      const { params } = this.state;
      this.setState({ initLoading: true });
      dispatch({
          type: 'project/get_buyTogether_stage',
          payload: { promotionId: id ,hasProduct:true},
          callback: (res) => {
              if (res.state == 200) {
                  const { buyTogetherStageGroupList } = res.data
                  let dayList = []
                  buyTogetherStageGroupList.forEach((item)=>{
                      let _dayParams = {day:item.day,stage:[]}
                      item.buyTogetherStageVOList.forEach((el)=>{
                          const {stageContent,stageId,state} = el
                          let _stageParams = {
                              stageContent,
                              stageId,
                              state:state==1?'未开始':(state==2?'进行中':'已结束')
                          }
                          _dayParams.stage.push(_stageParams)
                      })
                      dayList.push(_dayParams)
                  })
                  let showDayList = dayList.length>showLeng?dayList.slice(0,showLeng):[...dayList]
                  Object.assign(params,{stageId:dayList[0].stage[0].stageId})
                  this.setState({
                      dayList,
                      showDayList,
                      showMore:dayList.length>showLeng?true:false,
                      currentDay:dayList[0].day,
                      stageList:dayList[0].stage,
                      params

                  });
                  this.setState({ initLoading: false });
                  this.get_list({...params,current:1,pageSize, pageIndex:1})
              } else {
                  this.setState({ initLoading: false });
                  failTip(res.msg);
              }
          }
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { query } = this.state;
      params.current = params.current || 1
      dispatch({
          type: 'promotion/get_buyTogetherProduct_List',
          payload: { ...params,promotionId:query.id,verifyStates:[2] },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      params.pageIndex = params.current
                      this.get_list(params);
                  } else {
                      res.data.list.forEach((item)=>{
                          item.key = `${item.stageProductId}_${item.sku}`;
                      });
                      this.setState({
                          data: res.data
                      });
                  }
              }
          }
      });
  };

  //退出活动
  quitActivity = (item) => {
      this.setState({ initLoading: true });
      const {params,query } = this.state;
      const { dispatch } = this.props;
      const {stageId,sku} = item
      const parsm = {
          promotionId:query.id,
          stageId,
          skuList:[sku]
      }
      dispatch({
          type: 'promotion/quit_buyTogetherProduct',
          payload: { 
              buyTogetherProductList:[parsm]
          },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {   
                  failTip('退出成功')
                  this.get_list({ pageSize: pageSize,...params, pageIndex:1 });
              }else{
                  failTip(res.msg)
              }
          }
      });
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

  showExport=()=>{
      this.setState({
          exportVisible: true
      });
  }

  handleOk = () => {
      const { dispatch } = this.props;
      const { query } = this.state;
      sucTip('导出中...')
      this.setState({
          initLoading:true
      })
      this.props.form.validateFieldsAndScroll((err, values)=>{
          if(!err){
              if (values.date_range) {
                  values.startDate = values.date_range[0] ? `${values.date_range[0].format(dateFormat)} 00:00:00` : '';
                  values.endDate = values.date_range[1] ? `${values.date_range[1].format(dateFormat)} 23:59:59` : '';
                  delete values.date_range;
              }
              values.promotionId = query.id
              dispatch({
                  type: 'promotion/expor_buyTogetherProduct',
                  payload: {...values,fileName:'一起买'},
                  callback: (res) => {
                      if(res.state == 200){
                          const {downloadPath,fileName} = res.data
                          downByUrl(downloadPath,fileName)
                      }else{
                          failTip(res.msg)
                      }
                      this.setState({
                          initLoading:false
                      })
                  }
              })
              this.setState({
                  exportVisible: false
              });
          }

      })
      
  };

  handleCancel = e => {
      console.log(e);
      this.setState({
          exportVisible: false
      });
  };
  
  // 点击天数
  changeDay = (dayInfo)=>{
      const { day,stage } = dayInfo
      let { params } = this.state
      this.setState({
          currentDay:day,
          stageList:stage
      })
      if(stage[0] && stage[0].stageId){
          Object.assign(params,{ stageId:stage[0].stageId })
          this.setState({
              params
          })
          this.get_list({...params,current:1,pageSize, pageIndex:1})
      }
      
  }
  
  // 点击场次
  changeStage = (key)=>{
      let { params } = this.state
      Object.assign(params,{ stageId:key })
      this.setState({
          params
      })
      this.get_list({...params,current:1,pageSize, pageIndex:1})
  }

  open = (e,state)=>{
      const {dayList} = this.state
      e.stopPropagation()

      if(state=='1'){
          this.setState({
              showMoreState:2,
              showDayList:[...dayList]
          })
      }else{
          this.setState({
              showMoreState:1,
              showDayList:dayList.length>showLeng?dayList.slice(0,showLeng):[...dayList]
          })
      }
      
  }

  getDate = (date)=>{
      if(isEmpty(date)){
          return ''
      }
      let dateArr = date.split(' ')
      return dateArr[0]
  }

  goBackList = ()=>{
      setSession('togetherBuy_detail_back',2); 
      this.props.history.goBack()
  }

  render() {
      const { selectedRows, columns, initLoading, data,detail,exportVisible,showDayList,currentDay,stageList,showMore,showMoreState} = this.state;
      let {
          form: { getFieldDecorator }
      } = this.props;
      return (
          <div className={global.common_page}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('活动商品列表')}`, 0, 0, 10)}
                  {sldIconBtnBg(() => this.goBackList(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              <div className={`${_styles['content_des']}`}>
                  <div className={`${_styles['des_item']} ${_styles['des_item_name']}`}><span className={`${_styles['des_item_title']}`}>活动名称：</span> <span className={`${_styles['des_item_content']}`}>{detail.promotionName}</span></div>
                  <div className={`${_styles['des_item']} ${_styles['des_item_date']}`}><span className={`${_styles['des_item_title']}`}>活动时间：</span> <span className={`${_styles['des_item_content']}`}>{this.getDate(detail.startTime)}~{this.getDate(detail.endTime)}</span></div>
                  <div className={`${_styles['des_item']} ${_styles['des_item_stage']}`}><span className={`${_styles['des_item_title']}`}>活动场次：</span> <span className={`${_styles['des_item_content']}`}>{detail.stageHourTimeList && detail.stageHourTimeList.join(',')}</span></div>
                  <div className={`${_styles['des_item']} ${_styles['des_item_time']}`}><span className={`${_styles['des_item_title']}`}>场次时长：</span> <span className={`${_styles['des_item_content']}`}>{detail.duration}小时</span></div>
                  <div className={`${_styles['des_item']} ${_styles['des_item_state']}`}><span className={`${_styles['des_item_title']}`}>活动状态：</span> <span className={`${_styles['des_item_content']}`}>{detail.state==1?'未开始':(detail.state==2?'进行中':'已结束')}</span></div>
                  {hasAuth('together_buy_attend_export')&&<div className={`${_styles['des_item']} ${_styles['des_item_export']}`} onClick={this.showExport}><Icon type="upload" />导出</div>}
              </div>
              <div className={`${_styles['date_box']}`}>
                  <div className={`${_styles['date_group']}`}>
                      {
                          showDayList.map((item,index)=>{
                              if(index+1 < showDayList.length){
                                  return <div key={`${item}${index}`} className={`${_styles['date_item']} ${currentDay==item.day?_styles['date_item_check']:''}`} onClick={(e)=>this.changeDay(item,e)}>{item.day}</div>
                              }
                              return <div key={`${item}${index}`} className={`${_styles['date_item']} ${currentDay==item.day?_styles['date_item_check']:''}`} onClick={(e)=>this.changeDay(item,e)}>{item.day}{showMore && <div className={`${_styles['item_icon']}`} onClick={(e)=>{this.open(e,showMoreState)}}><Icon type='double-right' style={{color:'#fd6918' , transform:`rotate(${showMoreState==1?'90':'-90'}deg)`}} /></div>}</div>
                            
                          })
                      }
                      
                  </div>
              </div>
              <Tabs defaultActiveKey="1" onChange={this.changeStage}>
                  {
                      stageList.map((item)=><TabPane tab={`${item.stageContent} (${item.state})`} key={item.stageId} />)
                  }
              </Tabs>

              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      totalHeight={document.body.clientHeight - 260}
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="key"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      onSldHandleSeleRow={this.onSldHandleSeleRow}
                      resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                      isColumnResize
                      scroll={{ x: 1000 }}
                  />
                  {/*标准表格-end*/}
              </Spin>
              { /*导出-start*/}
              {
                  exportVisible &&
                  <Modal
                      title="导出"
                      visible={exportVisible}
                      onOk={this.handleOk}
                      onCancel={this.handleCancel}
                      maskClosable={false}
                  >
                      <div className={`${_styles['date_range']}`}>
                          <Form>
                              <FormItem {...this.formItemLayout} label="导出日期">
                                  {getFieldDecorator('date_range', {
                                      rules: [{
                                          required: true, message: '请选择导出日期'
                                      }],
                                      initialValue:[]
                                  })(
                                      <RangePicker
                                          style={{ width: 350 }}
                                          placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                                          getCalendarContainer={(triggerNode) => triggerNode.parentNode}
                                      />
                                  )
                                  }
                              </FormItem>
                          </Form>
                      </div>
                  </Modal>
              }
          </div>

      );
  }
}
