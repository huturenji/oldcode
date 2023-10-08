/*
* 商品管理——新增定价规则
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Spin, Button, Collapse, Radio,Form,Input,Row,Col,Modal } from 'antd';
import router from 'umi/router';
import {
    failTip,
    list_com_page_size_10,
    sldComLanguage,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    getStorage,
    sldPopConfirm,
    isEmpty,
    isNotEmpty,
    getAuthBtn,
    accMul
} from '@/utils/utils';
import global from '@/global.less';
import priceRuleStyles from './css/price_rule.less';
import StandardTable from '@/components/StandardTable';

import PriceRuleSelectCategory from './components/price_rule_select_category';
import PriceRuleSelectSku from './components/price_rule_select_sku';
import PriceRulePriview from './components/price_rule_priview';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const storeId = getStorage('storeId');
const { Panel } = Collapse;
const FormItem = Form.Item;
const { confirm } = Modal;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
    }
}
let pageSize = list_com_page_size_10;
@connect(({ pricerule }) => ({
    pricerule
}))
@Form.create()
export default class PriceRuleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodSelectType: 3, // 分类 1   sku 2   全局 3
            pricingRuleId:props.location.query.pricingRuleId,
            pricingStrategyEumn:{
                'SPECIFIED_CATEGORY':1,
                'SPECIFIED_SKU':2,
                'DEFAULT':3,
                '1':'SPECIFIED_CATEGORY',
                '2':'SPECIFIED_SKU',
                '3':'DEFAULT'
            },
            selectCategory: [],//编辑已有的分类
            allLeafCates: [],//编辑已有的分类
            selectSkus: [],//编辑已有的sku
            remark: "",//备注内容
            modalVisible: false,//是否显示预览弹框
          
            priceRuleDetail: {},//定价规则对象
            initLoading: false,
            isEnable: false,//是否规则状态启用
            initdisabled:true, // 详情接口回来之前不可点击
            opeLogData: {},//操作日志
            opeParams: { pageSize: pageSize },//日志列表入参
            formValues: { pricingRuleId: props.location.query.pricingRuleId },//格式化参数
            columns: [//操作日志分列设置项
                {
                    title: `${sldComLanguage('时间')}`,
                    dataIndex: 'operationTime',
                    key: "operationTime",
                    align: 'center'
                },
                {
                    title: `${sldComLanguage('操作人')}`,
                    dataIndex: 'operator',
                    key: "operator",
                    align: 'center'
                    // width: 150,
                },
                {
                    title: `${sldComLanguage('内容')}`,
                    dataIndex: 'operationDesc',
                    key: "operationDesc",
                    align: 'center'
                    // width: 150,
                }],
            tableData: [] // 预览表格
        };
    }

    componentDidMount() {
        this.getPriceDetail();
        this.getOpeLogs({ pageIndex: 1, pageSize: pageSize });
    }

    componentWillUnmount() {
    }

  //获取数据
  getPriceDetail = () => {
      this.setState({ initLoading: true,initdisabled:true });
      const { dispatch } = this.props;
      const { pricingRuleId } = this.state
      dispatch({
          type: 'pricerule/get_price_rule_detail',
          payload: { pricingRuleId,storeId },
          callback: (res) => {
              this.setState({ initLoading: false,initdisabled:false });
              if (res.state == 200) {
                  this.setState({
                      priceRuleDetail: res.data
                  }, () => {
                      //编辑模式，初始化赋值各个组件
                      this.initEditValue()
                  });
              } else {
                  failTip(res.msg)
              }
          }
      });
  };

  // 启用为指定sku 需要判断sku定价是否重复
  enablePriceRuleCheck =async ()=>{
      const { goodSelectType,selectSkus,isEnable } = this.state
      // 如果类型是2为sku启用状态下 需要check sku是否重复定价
      if(goodSelectType==2&&(!isEnable)){
          if(isEmpty(selectSkus)){
              failTip('sku为空')
              return 
          }
          let skus = []
          selectSkus.forEach((item)=>{
              skus.push(item.sku)
          })
          const repeatSkus = await this.repeatSku({skus})
          if(isNotEmpty(repeatSkus)){
              let tips = `以下sku重复定价${repeatSkus.join(',')}`
              this.showConfirm(tips)
          }else{
              this.enablePriceRule()
          }
      }else{
          this.enablePriceRule()
      }
     

  }

  showConfirm = (tips) => {
      let that = this
      confirm({
          title: '温馨提示',
          content: tips,
          cancelText:'取消',
          okText:'确定',
          className:`${priceRuleStyles.p20}`,
          onOk() {
              that.enablePriceRule();
          },
          onCancel() {

          }
      });
  };

  enablePriceRule = () => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { pricingRuleId } = this.state
      dispatch({
          type: 'pricerule/enable_priceRule',
          payload: {
              pricingRuleId,
              state: this.state.isEnable ? "STOPPED" : "STARTED",
              operator: (getStorage('user_info') != '' && getStorage('user_info') != null)
                  ? JSON.parse(getStorage('user_info')).user_name : 'admin'
          },
          callback: (res) => {
              this.setState({ initLoading: false });
              let {isEnable} = this.state
              if (res.state == 200) {
                  this.setState({
                      isEnable: !isEnable
                  }, () => {
                      //获取操作日志
                      this.getOpeLogs({ pageIndex: 1, pageSize: pageSize });
                  });
              } else {
                  failTip(res.msg)
              }
          }
      });
  }

  // 检验sku是否重复
  repeatSku = (params)=>new Promise((resolve) => {
      const { dispatch } = this.props;
      const { pricingRuleId } = this.state
      params.pricingRuleId = pricingRuleId
      dispatch({
          type: 'pricerule/repeatSku',
          payload: { ...params },
          callback: (res) => {
              if (res.state == 200) {
                  resolve(res.data.skus||[])
              } else {
                  resolve([])
                  failTip(res.msg)
              }
          }
      });
  })

  //获取操作日志
  getOpeLogs = (opeParams) => {
      const { dispatch } = this.props;
      const { pricingRuleId } = this.state
      this.setState({ initLoading: true });
      opeParams.pricingRuleId = pricingRuleId;
      opeParams.pageIndex = opeParams.current||1;
      dispatch({
          type: 'pricerule/get_priceRule_logs',
          payload: { ...opeParams },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  this.setState({
                      opeLogData: {
                          list: res.data.list,
                          pagination: {...res.data.pagination}
                      }
                  });
              } else {
                  failTip(res.msg)
              }
          }
      });
  }

  initEditValue = () => {
      const { priceRuleDetail,pricingStrategyEumn } = this.state
      //备注 规则状态
      this.setState({
          remark: priceRuleDetail.remark,
          isEnable: priceRuleDetail.state == 'STOPPED' ? false : true,
          goodSelectType: pricingStrategyEumn[priceRuleDetail.pricingStrategy] 
      });

      //如果productInfos有数据，说明是sku,否则是分类
      if (priceRuleDetail.productInfos && priceRuleDetail.productInfos.length) {
      //给子组件赋值选中的SKU
          this.setState({ selectSkus: priceRuleDetail.productInfos });
      } else {
      //给子组件赋值选中的分类
      //TODO目前 price服务中分类数据的模型是老商城的，跟BBC的分类模型不对应，这里需要翻译。后续统一，可以去掉了
          let sourceTree = priceRuleDetail.productCategoryTrees;
          let desTree = [];
          for (let i = 0; i < sourceTree.length; i++) {
              let category = {
                  categoryId: sourceTree[i].productCategoryId,
                  categoryName: sourceTree[i].productCategoryName
              };
              if (sourceTree[i].childNodes && sourceTree[i].childNodes.length) {//如果是倒数第二级，直接返回数组
                  category.children = [];
                  for (let j = 0; j < sourceTree[i].childNodes.length; j++) {
                      let cate2 = {
                          categoryId: sourceTree[i].childNodes[j].productCategoryId,
                          categoryName: sourceTree[i].childNodes[j].productCategoryName
                      };
                      if (sourceTree[i].childNodes[j].childNodes && sourceTree[i].childNodes[j].childNodes.length) {
                          cate2.children = [];
                          for (let k = 0; k < sourceTree[i].childNodes[j].childNodes.length; k++) {
                              let cate3 = {
                                  categoryId: sourceTree[i].childNodes[j].childNodes[k].productCategoryId,
                                  categoryName: sourceTree[i].childNodes[j].childNodes[k].productCategoryName
                              };
                              cate2.children.push(cate3);
                          }
                      }
                      category.children.push(cate2);
                  }
              }
              desTree.push(category);
          }

          this.setState({ selectCategory: desTree });
      }
  }

  //处理新增按钮的点击
  toEditPage = () => {
      //跳转到新增规则页面
      router.push({
          pathname: '/goods/price_rule_list_add',
          query: {
              pricingRuleId: this.props.location.query.pricingRuleId
          }
      });
  };

  //渲染折叠板的头部
  getRadioHeader = () => {
      const { goodSelectType } = this.state
      return (

          <div style={{ display: 'flex' }} onClick={e => e.stopPropagation()}>
              <span style={{ marginRight: '30px' }}>{sldComLanguage('产品范围')}</span>
              <Radio.Group disabled value={goodSelectType}>
                  <Radio value={3}>{sldComLanguage('全局')}</Radio>
                  <Radio value={1}>{sldComLanguage('分类')}</Radio>
                  <Radio value={2}>{sldComLanguage('SKU')}</Radio>
              </Radio.Group>
          </div>
      )
  }

  // sku子组件
  onRefSelSKU = (ref) => {
      this.childSelSKU = ref;
  }

  // 分类子组件
  onRefSelCategory = (ref) => {
      this.childCategory = ref;
  }

  //预览
  preview = () => {
      const { goodSelectType } = this.state;
      if (goodSelectType == 1) {
      //分类模式，需要先准备预览数据
          this.getLeafCates();
      } else if (goodSelectType == 2) {
          this.childSelSKU && this.childSelSKU.sendParams(this.previewSKU);
      }
      //弹出展示框
      this.setState({ modalVisible: true })
  }

  //previewSKU表格数据
  previewSKU = (alldata) => {
      if (alldata.length == 0) {
          failTip(sldComLanguage('请先选择sku商品'));
      } else if (alldata && alldata.length > 0) {
          this.setState({
              tableData: alldata
          })
      }
  }

  //获取分类的所有叶子结点，用于预览展示
  getLeafCates = () => {
      const { selectCategory } = this.state;
      let result = [];

      for (let i = 0; i < selectCategory.length; i++) {
          if (selectCategory[i].children) {//如果是倒数第二级，直接返回数组
              for (let j = 0; j < selectCategory[i].children.length; j++) {
                  if (selectCategory[i].children[j].children) {
                      for (let k = 0; k < selectCategory[i].children[j].children.length; k++) {
                          let cate = {
                              categoryId1: selectCategory[i].categoryId
                          }
                          cate.categoryId2 = selectCategory[i].children[j].categoryId;
                          cate.categoryId3 = selectCategory[i].children[j].children[k].categoryId;
                          cate.categoryName = selectCategory[i].children[j].children[k].categoryName;

                          result.push(cate);
                      }
                  }
              }
          }
      }
      this.setState({ allLeafCates: result });
  }

  //分页事件
  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      const { formValues } = this.state;

      if (type == 'main') {
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          // this.setState({ params });
          this.getOpeLogs(params);
      }
  };

  //取消预览模态框
  onCancelPriview = () => {
      this.setState({ modalVisible: false })
  }

  render() {
      const { initLoading, priceRuleDetail, selectCategory, allLeafCates, selectSkus
          , goodSelectType, remark, modalVisible
          , columns, opeLogData, isEnable, tableData,initdisabled } = this.state;
      let { form: { getFieldDecorator }} = this.props;
      return (
          <div className={global.common_page} style={{ flex: 1, overflow: 'auto' }}>
              <div className={priceRuleStyles.price_rule_title}>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('定价规则详情')} `, 0, 0, 10)}
                  <div style={{ display: 'flex' }}>
                      {(goodSelectType==1||goodSelectType==2) && <Button style={{ marginRight: '10px' }} onClick={this.preview}>{sldComLanguage('预览')}</Button>}
                      <AuthBtn btnAuth={btnAuth} eventKey={["price_rule_list_edit"]}>
                          {sldPopConfirm('leftBottom', `${sldComLanguage('确定要启用、停用此规则吗?')}`
                              , () => this.enablePriceRuleCheck(), `${sldComLanguage('确定')} `, `${sldComLanguage('取消')} `
                              , <Button style={{ marginRight: '10px' }} disabled={initdisabled}>{isEnable ? sldComLanguage('停用') : sldComLanguage('启用')}</Button>
                              , 0, 0, '#F21414')}
                          <Button type="primary" style={{ marginRight: '10px' }} onClick={this.toEditPage}>{sldComLanguage('编辑')}</Button>
                      </AuthBtn>
                      <Button type="dashed" onClick={() => { this.props.history.goBack() }}>返回</Button>
                  </div>
              </div>
              <div className={priceRuleStyles.price_rule_add_form}>
                 
                  <Row style={{marginBottom:'8px'}}>
                      <Col span={6} style={{textAlign:'right'}}><span style={{ color: 'red' }}>*</span>{`${sldComLanguage('状态') }：`}</Col>
                      <Col span={14}><p style={{ color: 'red' }}>{isEnable ? sldComLanguage('已启用') : sldComLanguage('已停用')} </p></Col>
                  </Row>
                  <Row style={{marginBottom:'8px'}}>
                      <Col span={6} style={{textAlign:'right'}}><span style={{ color: 'red' }}>*</span>{`${sldComLanguage('规则名称') }：`}</Col>
                      <Col span={14}><p>{isNotEmpty(priceRuleDetail.pricingRuleName)?priceRuleDetail.pricingRuleName:''} </p></Col>
                  </Row>
                 
                  <Form>
                      {
                          (goodSelectType==1||goodSelectType==3) &&
                            <FormItem {...formItemLayout} label="最高溢价率">
                                {getFieldDecorator('premiumRate', {
                                    rules: [{
                                        required: true, message: '请输入最高溢价率'
                                    }],
                                    initialValue: isNotEmpty(priceRuleDetail.premiumRate) ? accMul(priceRuleDetail.premiumRate,100) : ''
                                })(
                                    <Input placeholder="请输入最高溢价率" disabled addonAfter="%" />
                                )
                                }
                            </FormItem>
                      }
                      {
                          (goodSelectType==1||goodSelectType==3) &&
                            <FormItem {...formItemLayout} label="理想折扣率">
                                {getFieldDecorator('discountRate', {
                                    rules: [{
                                        required: true, message: '请输入理想折扣率'
                                    }],
                                    initialValue: isNotEmpty(priceRuleDetail.discountRate) ? accMul(priceRuleDetail.discountRate,100) : ''
                                })(
                                    <Input placeholder="请输入理想折扣率" disabled addonAfter="%" />
                                )
                                }
                            </FormItem>
                      }
                      {
                          (goodSelectType==1||goodSelectType==3) &&
                            <FormItem {...formItemLayout} label="京东官网到手价折扣率">
                                {getFieldDecorator('buyPriceDiscountRate', {
                                    rules: [{
                                        required: false, message: '请输入京东官网到手价折扣率'
                                    }],
                                    initialValue: isNotEmpty(priceRuleDetail.buyPriceDiscountRate) ? accMul(priceRuleDetail.buyPriceDiscountRate,100) : ''
                                })(
                                    <Input placeholder="请输入京东官网到手价折扣率" disabled addonAfter="%" />
                                )
                                }
                            </FormItem>
                      }
                      {
                          (goodSelectType==1||goodSelectType==3) &&
                            <FormItem {...formItemLayout} label="京东联盟价折扣率">
                                {getFieldDecorator('unionPriceDiscountRate', {
                                    rules: [{
                                        required: false, message: '请输入京东联盟价折扣率'
                                    }],
                                    initialValue: isNotEmpty(priceRuleDetail.unionPriceDiscountRate) ? accMul(priceRuleDetail.unionPriceDiscountRate,100) : ''
                                })(
                                    <Input placeholder="请输入京东联盟价折扣率" disabled addonAfter="%" />
                                )
                                }
                            </FormItem>
                      }
                      {
                          (goodSelectType==1||goodSelectType==3) &&
                            <FormItem {...formItemLayout} label="京东建议销售价">
                                {getFieldDecorator('salePriceDiscountRate', {
                                    rules: [{
                                        required: false, message: '请输入京东建议销售价折扣率'
                                    }],
                                    initialValue: isNotEmpty(priceRuleDetail.salePriceDiscountRate) ? accMul(priceRuleDetail.salePriceDiscountRate,100) : ''
                                })(
                                    <Input placeholder="请输入京东建议销售价折扣率" disabled addonAfter="%" />
                                )
                                }
                            </FormItem>
                      }
                  </Form>
              </div>
              <Collapse defaultActiveKey={['1']}>
                  <Panel header={this.getRadioHeader()} key="1">
                      {goodSelectType == 1 && <PriceRuleSelectCategory
                          onRef={this.onRefSelCategory}
                          readOnly
                          selectCategory={selectCategory}
                      />}
                      {goodSelectType == 2 && <PriceRuleSelectSku
                          onRef={this.onRefSelSKU}
                          readOnly
                          selectSkus={selectSkus}
                      />}
                  </Panel>
              </Collapse>
              <div style={{ display: 'flex', margin: '10px 0' }}>
                  <span>{sldComLanguage('备注：')}</span>
                  <div>{remark}</div>
              </div>
              <p style={{ margin: '10px 0' }}>{sldComLanguage('操作日志')}</p>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      bordered={false}
                      data={opeLogData}
                      rowKey="operationId"
                      columns={columns}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                  />
                  {/*标准表格-end*/}
              </Spin>
              {/* 预览模态框 */}
              {
                  modalVisible && <PriceRulePriview
                      previewType={goodSelectType}
                      cateList={allLeafCates}//所有的第三级分类
                      tableData={tableData}
                      priceDetailInfo={priceRuleDetail}
                      modalCancel={this.onCancelPriview}
                  />
              }
          </div>
      );
  }
}
