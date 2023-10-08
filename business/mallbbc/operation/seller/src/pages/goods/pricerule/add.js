/*
* 商品管理——新增定价规则
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Button, Input, Collapse, Radio,Form, Modal,Tooltip } from 'antd';
import router from 'umi/router';
import {
    failTip,
    list_com_page_size_10,
    sldComLanguage,
    sldLlineRtextAddGoodsAddMargin,
    getStorage,
    isNotEmpty,
    isEmpty,
    accMul,
    accDiv
} from '@/utils/utils';
import ALibbSvg from '@/components/ALibbSvg';
import global from '@/global.less';
import priceRuleStyles from './css/price_rule.less';

import PriceRuleSelectCategory from './components/price_rule_select_category';
import PriceRuleSelectSku from './components/price_rule_select_sku';
import PriceRulePriview from './components/price_rule_priview';

const storeId = getStorage('storeId');
const { Panel } = Collapse;
const { TextArea } = Input;
const FormItem = Form.Item;
const { confirm } = Modal;
let pageSize = list_com_page_size_10;

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
@connect(({ pricerule }) => ({
    pricerule
}))
@Form.create()
export default class PriceRuleWrite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //当前页面是编辑吗？
            isEditMode: props.location.query.pricingRuleId != undefined ? true : false,
            pricingRuleId:props.location.query.pricingRuleId,
            goodSelectType: 3, // 分类 1   sku 2   全局 3
            pricingStrategyEumn:{
                'SPECIFIED_CATEGORY':1,
                'SPECIFIED_SKU':2,
                'DEFAULT':3,
                '1':'SPECIFIED_CATEGORY',
                '2':'SPECIFIED_SKU',
                '3':'DEFAULT'
            },
            selectCategory: [],//编辑已有的分类
            allLeafCates: [],//
            selectSkus: [],//编辑已有的sku
            remark: "",//备注内容
            modalVisible: false,//是否显示预览弹框
            priceRuleDetail: {},//定价规则对象，详情返回数据
            initLoading: false,
            submitParam: {},//提交参数  
            tableData: [], // 预览表格
            priceRules:{} //表单收集数据
        };
    }

    componentDidMount() {
        const { isEditMode } = this.state
        isEditMode && this.getPriceDetail({ pageSize: pageSize });
    }

    componentWillUnmount() {
    }

  //获取数据
  getPriceDetail = () => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { pricingRuleId } = this.state
      dispatch({
          type: 'pricerule/get_price_rule_detail',
          payload: { pricingRuleId,storeId },
          callback: (res) => {
              this.setState({ initLoading: false });
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

  initEditValue = () => {
      const { priceRuleDetail,pricingStrategyEumn } = this.state
      
      this.setState({
          remark: priceRuleDetail.remark,
          goodSelectType: pricingStrategyEumn[priceRuleDetail.pricingStrategy]
      })
      //如果productInfos有数据，说明是sku,否则是分类
      if (priceRuleDetail.productInfos && priceRuleDetail.productInfos.length) {
      //给子组件赋值选中的SKU
          this.setState({selectSkus: priceRuleDetail.productInfos })
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

  //数字输入，是否拦截的校验
  checkTheNum = (num) => {
      //最多显示2位小数;不能是负数，必须是数字；
      const pattern = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
      return pattern.test(num);
  }

  //处理分类选择 组件的输入
  handlerGoodsa4SelCategory = (alldata) => {
      const { submitParam } = this.state
      let result = [];
      for (let i = 0; i < alldata.length; i++) {
          if (alldata[i].children) {//如果是倒数第二级，直接返回数组
              for (let j = 0; j < alldata[i].children.length; j++) {
                  if (alldata[i].children[j].children) {
                      for (let k = 0; k < alldata[i].children[j].children.length; k++) {
                          let product = {
                              categoryId1: alldata[i].categoryId,
                              categoryName1: alldata[i].categoryName,
                              categoryId2: alldata[i].children[j].categoryId,
                              categoryName2: alldata[i].children[j].categoryName,
                              categoryId3: alldata[i].children[j].children[k].categoryId,
                              categoryName3: alldata[i].children[j].children[k].categoryName
                          };
                          result.push(product);
                      }
                  }
              }
          }
      }
      submitParam.productInfos = result
      this.setState({ submitParam: submitParam })
  };

  //处理SKU选择 组件的输入
  handlerGoods4SelSKU = (alldata) => {
      if (alldata.length == 0) {
          failTip(sldComLanguage('请选择SKU'))
      } else {
          const { submitParam } = this.state;
          let result = [];
          for (let i = 0; i < alldata.length; i++) {
              let product = {
                  categoryId1: alldata[i].categoryId1,
                  categoryId2: alldata[i].categoryId2,
                  categoryId3: alldata[i].categoryId3,
                  sku: alldata[i].sku,
                  unitPrice:alldata[i].unitPrice
              };
              result.push(product);
          }
          submitParam.productInfos = result
          this.setState({ submitParam: submitParam })
      }
  };

  onRefSelCategory = (ref) => {
      this.childSelCategory = ref;
  }

  onRefSelSKU = (ref) => {
      this.childSelSKU = ref;
  }

  showConfirm = (paramObj,tips) => {
      let that = this
      confirm({
          title: '温馨提示',
          content: tips,
          cancelText:'取消',
          okText:'确定',
          className:`${priceRuleStyles.p20}`,
          onOk() {
              that.addOrUpdateRule(paramObj);
              console.log('OK');
          },
          onCancel() {
              console.log('Cancel');
          }
      });
  };

  handleSaveAllData = async () => {
      let { pricingStrategyEumn } = this.state 
      this.props.form.validateFieldsAndScroll(async (err, values)=>{
          if(!err){
              if(this.state.goodSelectType == 1 && this.childSelCategory){
                  const res = this.childSelCategory.sendParams(this.handlerGoodsa4SelCategory)
                  if(res=='error'){ return }
              }
              if(this.state.goodSelectType == 2 && this.childSelSKU){
                  const res = this.childSelSKU.sendParams(this.handlerGoods4SelSKU);
                  if(res=='error'){ return }
              }
              if(values.discountRate){
                  values.discountRate = accDiv(values.discountRate,100)
              }
              if(values.premiumRate){
                  values.premiumRate = accDiv(values.premiumRate,100)
              }
              // 京东官网的到手价折扣率
              if(values.buyPriceDiscountRate){
                  values.buyPriceDiscountRate = accDiv(values.buyPriceDiscountRate,100)
              }
              // 京东联盟价折扣率
              if(values.unionPriceDiscountRate){
                  values.unionPriceDiscountRate = accDiv(values.unionPriceDiscountRate,100)
              }
              // 京东建议销售价折扣率
              if(values.salePriceDiscountRate){
                  values.salePriceDiscountRate = accDiv(values.salePriceDiscountRate,100)
              }
              let paramObj = { ...this.state.submitParam,...values };
              paramObj.pricingStrategy = pricingStrategyEumn[this.state.goodSelectType];
              paramObj.remark = this.state.remark;
              paramObj.operator = (getStorage('user_info') != '' && getStorage('user_info') != null)
                  ? JSON.parse(getStorage('user_info')).user_name : 'admin';
      
              let tips = '确定保存定价规则?'
              // 指定sku新增和编辑需要判断是否重复定价
              if(this.state.goodSelectType == 2){
                  const { productInfos } = paramObj
                  let skus = []
                  productInfos.forEach((item)=>{
                      skus.push(item.sku)
                  })
                  const repeatSkus = await this.repeatSku({skus})
                  if(isNotEmpty(repeatSkus)){
                      tips = `以下sku重复定价${repeatSkus.join(',')}`
                  }
              }
              //二次确认
              this.showConfirm(paramObj,tips)
          }

      })
      
  }

  // 检验sku是否重复
  repeatSku = (params)=>new Promise((resolve) => {
      const { dispatch } = this.props;
      const {isEditMode ,pricingRuleId} = this.state
      if(isEditMode){
          params.pricingRuleId = pricingRuleId
      }
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

  //收集一次输入的价格数据，除了提交动作。还有选择SKU和预览等动作，也需要用到价格数据
  submitPriceNumbers = () => 
      // eslint-disable-next-line react/no-access-state-in-setstate
      new Promise((resolve)=>{
          this.props.form.validateFields((err,value)=>{
              if(!err){
                  if(value.discountRate){
                      value.discountRate = accDiv(value.discountRate,100)
                  }
                  if(value.premiumRate){
                      value.premiumRate = accDiv(value.premiumRate,100)
                  }
                  // 京东官网的到手价折扣率
                  if(value.buyPriceDiscountRate){
                      value.buyPriceDiscountRate = accDiv(value.buyPriceDiscountRate,100)
                  }
                  // 京东联盟价折扣率
                  if(value.unionPriceDiscountRate){
                      value.unionPriceDiscountRate = accDiv(value.unionPriceDiscountRate,100)
                  }
                  // 京东建议销售价折扣率
                  if(value.salePriceDiscountRate){
                      value.salePriceDiscountRate = accDiv(value.salePriceDiscountRate,100)
                  }
                  this.setState({ priceRules: { ...value } })
                  resolve(true)
              }else{
                  resolve(false)
              }
  
          })
      })
  

  //获取数据
  addOrUpdateRule = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const {isEditMode ,pricingRuleId} = this.state
      let disType = 'pricerule/add_rule'
      if(isEditMode){
          disType = 'pricerule/updatePricingRule'
          params.pricingRuleId = pricingRuleId
      }
      dispatch({
          type: disType,
          payload: { ...params },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  //返回上一级页面
                  this.props.history.goBack();
              } else {
                  failTip(res.msg)
              }
          }
      });
  };

  //渲染折叠板的头部
  getRadioHeader = () => {
      const { goodSelectType,isEditMode } = this.state
      return (
          <div style={{ display: 'flex' }} onClick={e => e.stopPropagation()}>
              <span style={{ marginRight: '30px' }}>{sldComLanguage('产品范围')}</span>
              <Radio.Group
                  onChange={(e) => {
                      this.setState({
                          goodSelectType: e.target.value
                      });
                  }}
                  value={goodSelectType}
                  disabled={isEditMode}
                  onClick={e => e.stopPropagation()}
              >
                  <Radio value={3}>{sldComLanguage('全局')}</Radio>
                  <Radio value={1}>{sldComLanguage('分类')}</Radio>
                  <Radio value={2}>{sldComLanguage('SKU')}</Radio>
              </Radio.Group>
          </div>
      )
  };

  getReamk = (e) => {
      if (e.target.value.length > 200) {
          failTip(sldComLanguage('请输入备注，最多200字'));
          return
      }
      this.setState({ remark: e.target.value })
  }

  //预览
  preview = () => {
      const { goodSelectType } = this.state;
      if (goodSelectType == 1) {
      //分类模式，需要先准备预览数据
          this.childSelCategory && this.childSelCategory.sendParams(this.privewCategory)
      } else if (goodSelectType == 2) {
          this.childSelSKU && this.childSelSKU.sendParams(this.previewSKU);
      } else {
          failTip(sldComLanguage('请选择产品范围'));
      }
  }

  //privew分类的分类选择数据
  privewCategory =async (alldata) => {
      if (alldata && alldata.length > 0) {
          this.getLeafCates(alldata)
          let res = await this.submitPriceNumbers();
          if(!res){ return }
          //弹出展示框
          this.setState({ modalVisible: true })
      } else {
          failTip(sldComLanguage('请先选择分类'));
      }
  }

  //previewSKU表格数据
  previewSKU = (alldata) => {
      if (alldata && alldata.length > 0) {
          this.setState({
              tableData: alldata
          })
          //弹出展示框
          this.setState({ modalVisible: true })
      } else {
          failTip(sldComLanguage('请先选择sku商品'));
      }
  }

  //获取分类的所有叶子结点，用于预览展示
  getLeafCates = (selectCategory) => {
      let result = [];
      // console.log(222, selectCategory)
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

  //取消预览模态框
  onCancelPriview = () => {
      this.setState({ modalVisible: false })
  }

  // 名词解释
  glossary = (type) => {
      let dom
      if(type=='1'){
          dom = <div style={{width:'400px'}}>
              <p>P<sub>b</sub>：京东企业购对某一商品在某一时段的结算价格；</p>
              <p>P<sub>r</sub>：京东联盟对某一商品在某一时段的零售价格，又称参考价；</p>
              <p>P<sub>s</sub>：商云的报价 ；</p>
              <p>γ，最高溢价率：0≤γ&lt;1： γ≥(P<sub>s</sub>-P<sub>r</sub>)/P<sub>r</sub>； 即，报价P<sub>s</sub>不能高出参考价P<sub>r</sub>的γ(%)，γ可配置；</p>
          </div>
      }else{
          dom = <div style={{width:'400px'}}>
              <p>P<sub>b</sub>：京东企业购对某一商品在某一时段的结算价格；</p>
              <p>P<sub>r</sub>：京东联盟对某一商品在某一时段的零售价格，又称参考价；</p>
              <p>P<sub>s</sub>：商云的报价；</p>
              <p>β，理想折扣率：0≤β&lt;1： β≤(P<sub>r</sub>-P<sub>s</sub>)/P<sub>r</sub>；  即，当P<sub>s</sub>比P<sub>r</sub>小，且P<sub>s</sub>比P<sub>r</sub>小β（%）时，认为P<sub>s</sub>对用户有较大的吸引力；β可配置；</p>
          </div>
      }
      return dom
  }

  render() {
      const { isEditMode, priceRules, selectCategory, allLeafCates, selectSkus,priceRuleDetail,
          goodSelectType, remark, modalVisible, tableData } = this.state;
      let { form: { getFieldDecorator } } = this.props;
      return (
          <div className={global.common_page} style={{ flex: 1, overflow: 'auto' }}>
              <div className={priceRuleStyles.price_rule_title}>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2',
                      `${isEditMode ? sldComLanguage('编辑定价规则') : sldComLanguage('新增定价规则')}`, 0, 0, 10)}
              </div>
              <Form>
                  <FormItem {...formItemLayout} label="规则名称">
                      {getFieldDecorator('pricingRuleName', {
                          rules: [{
                              required: true, message: '请输入规则名称'
                          }],
                          initialValue: isNotEmpty(priceRuleDetail.pricingRuleName) ? priceRuleDetail.pricingRuleName : ''
                      })(
                          <Input placeholder="请输入规则名称,最多输入100字" maxLength={100} />
                      )
                      }
                  </FormItem>
                  {
                      (goodSelectType==1||goodSelectType==3) &&
                      <FormItem
                          {...formItemLayout}
                          label={
                              <span>最高溢价率
                                  <Tooltip title={this.glossary('1')} overlayStyle={{minWidth:420}}>
                                      <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                                  </Tooltip>
                              </span>
                          }
                      >
                          {getFieldDecorator('premiumRate', {
                              rules: [
                                  {required: true, message: '请输入最高溢价率'},
                                  {
                                      validator:(rule, value, callback) => {
                                          //   let reg = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/
                                          let reg = /^([1-9][0-9]{0,1})$/
                                          if(reg.test(value)||value=='0'){
                                              if(value>=100){
                                                  callback('请按格式输入')
                                              }else{
                                                  callback()
                                              }
                                          }else{
                                              callback('请按格式输入')
                                          }
                                        
                                      }
                                  }
                              ],
                              initialValue: isNotEmpty(priceRuleDetail.premiumRate) ? accMul(priceRuleDetail.premiumRate,100) : ''
                          })(
                              <Input placeholder="请输入最高溢价率0-99" addonAfter="%" />
                          )
                          }
                      </FormItem>
                  }
                  {
                      (goodSelectType==1||goodSelectType==3) &&
                      <FormItem
                          {...formItemLayout}
                          label={
                              <span>
                                理想折扣率
                                  <Tooltip title={this.glossary('2')} overlayStyle={{minWidth:420}}>
                                      <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                                  </Tooltip>
                              </span>
                          }
                      >
                          {getFieldDecorator('discountRate', {
                              rules: [
                                  {required: true, message: '请输入理想折扣率'},
                                  {
                                      validator:(rule, value, callback) => {
                                          //   let reg = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/
                                          let reg = /^([1-9][0-9]{0,1})$/
                                          if(reg.test(value)||value=='0'){
                                              if(value>=100){
                                                  callback('请按格式输入')
                                              }else{
                                                  callback()
                                              }
                                              
                                          }else{
                                              callback('请按格式输入')
                                          }
                                      
                                      }
                                  }
                              ],
                              initialValue: isNotEmpty(priceRuleDetail.discountRate) ? accMul(priceRuleDetail.discountRate,100) : ''
                          })(
                              <Input placeholder="请输入理想折扣率0-99" addonAfter="%" />
                          )
                          }
                      </FormItem>
                  }
                  {
                      (goodSelectType==1||goodSelectType==3) &&
                      <FormItem
                          {...formItemLayout}
                          label={
                              <span>
                                 京东官网到手价折扣率
                                  {/* <Tooltip title={this.glossary('2')} overlayStyle={{minWidth:420}}>
                                      <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                                  </Tooltip> */}
                              </span>
                          }
                      >
                          {getFieldDecorator('buyPriceDiscountRate', {
                              rules: [
                                  {required: false, message: '请输入京东官网到手价折扣率'},
                                  {
                                      validator:(rule, value, callback) => {
                                          //   let reg = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/
                                          if(isEmpty(value)){
                                              callback()
                                              return
                                          }
                                          let reg = /^([1-9][0-9]{0,1})$/
                                          if(reg.test(value)||value=='0'){
                                              if(value>=100){
                                                  callback('请按格式输入')
                                              }else{
                                                  callback()
                                              }
                                              
                                          }else{
                                              callback('请按格式输入')
                                          }
                                      
                                      }
                                  }
                              ],
                              initialValue: isNotEmpty(priceRuleDetail.buyPriceDiscountRate) ? accMul(priceRuleDetail.buyPriceDiscountRate,100) : ''
                          })(
                              <Input placeholder="请输入京东官网到手价折扣率0-99" addonAfter="%" />
                          )
                          }
                      </FormItem>
                  }
                  {
                      (goodSelectType==1||goodSelectType==3) &&
                      <FormItem
                          {...formItemLayout}
                          label={
                              <span>
                                京东联盟价折扣率
                                  {/* <Tooltip title={this.glossary('2')} overlayStyle={{minWidth:420}}>
                                      <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                                  </Tooltip> */}
                              </span>
                          }
                      >
                          {getFieldDecorator('unionPriceDiscountRate', {
                              rules: [
                                  {required: false, message: '请输入京东联盟价折扣率'},
                                  {
                                      validator:(rule, value, callback) => {
                                          //   let reg = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/
                                          if(isEmpty(value)){
                                              callback()
                                              return
                                          }
                                          let reg = /^([1-9][0-9]{0,1})$/
                                          if(reg.test(value)||value=='0'){
                                              if(value>=100){
                                                  callback('请按格式输入')
                                              }else{
                                                  callback()
                                              }
                                              
                                          }else{
                                              callback('请按格式输入')
                                          }
                                      
                                      }
                                  }
                              ],
                              initialValue: isNotEmpty(priceRuleDetail.unionPriceDiscountRate) ? accMul(priceRuleDetail.unionPriceDiscountRate,100) : ''
                          })(
                              <Input placeholder="请输入京东联盟价折扣率0-99" addonAfter="%" />
                          )
                          }
                      </FormItem>
                  }
                  {
                      (goodSelectType==1||goodSelectType==3) &&
                      <FormItem
                          {...formItemLayout}
                          label={
                              <span>
                                京东建议销售价折扣率
                                  {/* <Tooltip title={this.glossary('2')} overlayStyle={{minWidth:420}}>
                                      <span style={{marginLeft:'2px',position:'relative',top:'3px'}}><ALibbSvg fill="#FF711E" width={18} height={18} type="wenti" /></span>
                                  </Tooltip> */}
                              </span>
                          }
                      >
                          {getFieldDecorator('salePriceDiscountRate', {
                              rules: [
                                  {required: false, message: '请输入京东建议销售价折扣率'},
                                  {
                                      validator:(rule, value, callback) => {
                                          //   let reg = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)$/
                                          if(isEmpty(value)){
                                              callback()
                                              return
                                          }
                                          let reg = /^([1-9][0-9]{0,1})$/
                                          if(reg.test(value)||value=='0'){
                                              if(value>=100){
                                                  callback('请按格式输入')
                                              }else{
                                                  callback()
                                              }
                                              
                                          }else{
                                              callback('请按格式输入')
                                          }
                                      
                                      }
                                  }
                              ],
                              initialValue: isNotEmpty(priceRuleDetail.salePriceDiscountRate) ? accMul(priceRuleDetail.salePriceDiscountRate,100) : ''
                          })(
                              <Input placeholder="请输入京东建议销售价折扣率0-99" addonAfter="%" />
                          )
                          }
                      </FormItem>
                  }
              </Form>
              <Collapse defaultActiveKey={['1']}>
                  <Panel header={this.getRadioHeader()} key="1">
                      {goodSelectType == 1 && <PriceRuleSelectCategory onRef={this.onRefSelCategory} selectCategory={selectCategory} />}
                      {goodSelectType == 2 && <PriceRuleSelectSku
                          onRef={this.onRefSelSKU}
                          selectSkus={selectSkus}
                          submitPriceNumbers={this.submitPriceNumbers}
                      />}
                  </Panel>
              </Collapse>
              <div style={{ display: 'flex', margin: '10px 0' }}>
                  <span>备注：</span>
                  <TextArea
                      style={{ width: 'auto' }}
                      maxLength={200}
                      value={remark}
                      autosize={{ minRows: 3 }}
                      onChange={this.getReamk}
                      placeholder={`${sldComLanguage('请输入备注，最多200字')}`}
                  />
              </div>
              <div style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={() => this.props.form.submit(this.handleSaveAllData)} style={{marginRight:'20px'}}>{sldComLanguage('保存')}</Button>
                  {(goodSelectType==1||goodSelectType==2) && <Button style={{ marginRight:'20px' }} onClick={this.preview}>{sldComLanguage('预览')}</Button>}
                  <Button type="dashed" onClick={() => { this.props.history.goBack() }}>{sldComLanguage('返回')}</Button>
              </div>
              {/* 预览模态框 */}
              {
                  modalVisible &&
          <PriceRulePriview
              previewType={goodSelectType}
              cateList={allLeafCates}//所有的第三级分类
              tableData={tableData}
              priceDetailInfo={priceRules}
              modalCancel={this.onCancelPriview}
          />
              }
          </div>
      );
  }
}
