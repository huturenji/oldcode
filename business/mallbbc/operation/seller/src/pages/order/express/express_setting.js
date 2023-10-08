import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, InputNumber, Radio,Button,Switch,Input } from 'antd';
import {
    failTip,
    sucTip,
    sldComLanguage,
    getSldEmptyH,
    getAuthBtn,
    getStorage,
    isNotEmpty,
    isEmpty
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less'; //货品来源：1-接入；2-手工发布；3-接入&手工
import AuthBtn from '@/components/AuthBtn';

const goodsSource = getStorage('goodsSource');


let btnAuth = getAuthBtn();
let sthis = '';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

// eslint-disable-next-line no-shadow
@connect(({ promotion,conscoupon, global }) => ({
    promotion,conscoupon, global
}))
@Form.create()
export default class ExpressSetting extends Component {
    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            loading:false,
            firstLoading:false,
            freightType:1, // 1 从接入的供应商获取  2 固定金额  freightAmount 为 -1 代表按供应商收取
            lowerType:undefined, // 1 减运费  2 免运费  lowerAmount 为 -1 代表减免全部
            details:{}, // 配置详情
            flag:false // 默认是关闭

        };
    }

    componentDidMount() {
        this.getFreightRule()
    }

    componentWillUnmount() {
    }

    // 获取配置
    getFreightRule = () => {
        const { dispatch } = this.props;
        this.setState({
            loading:true
        })
        dispatch({
            type: 'express/getFreightRule',
            callback: (res) => {
                if (res.state == 200) {
                    const {freightAmount,fullAmount,lowerAmount,state,link,miniProgramLink} = res.data ||{}
                    let freightType = 1
                    let lowerType
                    let details = {}

                    if(isNotEmpty(freightAmount)){
                        details.freightAmount=freightAmount
                        if(freightAmount==-1){
                            freightType = 1
                            details.freightAmount=''
                        }else{
                            freightType = 2
                        }
                    }
                    if(isNotEmpty(fullAmount)){
                        details.fullAmount=fullAmount
                        details.lowerAmount=lowerAmount
                        if(lowerAmount==-1){
                            lowerType = 2
                            details.lowerAmount=''
                        }else{
                            lowerType = 1
                        }
                    }
                    details.link = link
                    details.miniProgramLink = miniProgramLink
                    this.setState({
                        freightType,
                        lowerType,
                        details,
                        flag:state==1?true : false,
                        firstLoading:true,
                        loading:false
                    })
                   
                }else{
                    failTip(res.msg)
                    this.setState({
                        firstLoading:true,
                        loading:false
                    })
                }
            }
        });
    };

  //保存事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              let {freightType,freightAmount,lowerType,fullAmount,lowerAmount,state,link,miniProgramLink} = values
              let param = {}
              if(isNotEmpty(freightType)){
                  if(freightType==1){
                      freightAmount = -1
                  }
                  if(isEmpty(freightAmount)){
                      failTip('请填写运费')
                      return 
                  }
                  param.freightAmount = freightAmount
              }
              // 如果是开启状态
              if(state){
                  if(isEmpty(fullAmount)){
                      failTip('开启状态下请填写减免设置')
                      return
                  }
              }
              param.state = state?1:0

              if(isNotEmpty(fullAmount)){
                  param.fullAmount = fullAmount
                  if(isEmpty(lowerType)){
                      failTip('请填写减免类型')
                      return
                  }
                  // 免运费
                  if(lowerType==2){
                      lowerAmount = -1
                  }
                  if(isEmpty(lowerAmount)){
                      failTip('请填写减免运费金额')
                      return
                  }
                  // 添加校验 运费减免金额需小于订单运费固定金额
                  if( isNotEmpty(freightType) && freightType==2 && lowerType==1 ){
                      if(lowerAmount>=freightAmount){
                          failTip('运费减免金额需小于订单运费固定金额')
                          return
                      }
                  }
                  param.lowerAmount = lowerAmount
              }

              if(isNotEmpty(link)){
                  param.link = link
              }else{
                  param.link = ''
              }
              if(isNotEmpty(miniProgramLink)){
                  param.miniProgramLink = miniProgramLink
              }else{
                  param.miniProgramLink = ''
              }
              
              this.setState({
                  loading:true
              })
              dispatch({
                  type: 'express/configFreight',
                  payload: { ...param },
                  callback: (res) => {
                      if (res.state == 200) {
                          sucTip(res.msg);
                          this.getFreightRule()
                      } else {
                          failTip(res.msg);
                      }
                      this.setState({ loading: false });
                  }
              });

          }
      },
      );
  };

  
  freightTypeChange = (e) => {
      this.setState({
          freightType:e.target.value
      })
  };
  
  lowerTypeChange = (e) => {
      if(e.target.value == 2){
          this.props.form.setFieldsValue({
              'lowerAmount':''
          });
      }
      this.setState({
          lowerType:e.target.value
      })
  };

  render() {
      const {
          freightType,lowerType,firstLoading,loading,details,flag
      } = this.state;
      let {
          form: { getFieldDecorator }
      } = this.props;
      return (
          <AuthBtn btnAuth={btnAuth} eventKey={["free_view"]} showPage>
              <div className={`${global.common_page} ${global.com_flex_column}`} style={{ position: 'relative' }}>
                  <Spin spinning={loading}>
                      <Form layout="inline">
                          <Scrollbars
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={document.body.clientHeight - 160}
                          >
                              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap} ${promotion.full_activity}`}>
                                  {getSldEmptyH(10)}
                                  {
                                      firstLoading && 
                                <Fragment>
                                    {getSldEmptyH(20)}
                                    <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                                        {
                                            goodsSource == 1 && 
                                            <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                <div className={`${promotion.left}`} style={{height:35}}>
                                                    <span style={{ color: 'red' }}>*</span>{sldComLanguage('订单运费')}
                                                </div>
                                                <div className={`${promotion.right}`}>
                                                    <FormItem
                                                        style={{ width: 250 }}
                                                    >
                                                        {getFieldDecorator('freightType', {
                                                            initialValue: freightType
                                                        })(
                                                            <RadioGroup size="small" onChange={(e) => this.freightTypeChange(e)}>
                                                                <Radio value={1}>
                                                             从接入的供应商获取
                                                                </Radio>
                                                                <Radio value={2}>
                                                              固定金额
                                                                </Radio>
                                                            </RadioGroup>,
                                                        )}
                                                    </FormItem>
                                                    {
                                                        freightType==2 && 
                                                        <Fragment>
                                                            <FormItem
                                                                style={{ width: 200 }}
                                                            >
                                                                <div>
                                                                    {getFieldDecorator('freightAmount', {
                                                                        initialValue: details.freightAmount,
                                                                        rules: [{
                                                                            required: false,
                                                                            message: '请输入运费'
                                                                        }]
                                                                    })(
                                                                        <InputNumber
                                                                            max={100000}
                                                                            min={0.00}
                                                                            precision={2}
                                                                            style={{ width: 170 }}
                                                                            placeholder='请输入运费'
                                                                        />
                                                                    )}
                                                                    <span>元</span>
                                                                </div>
                                                            </FormItem>
                                                            <span style={{position:'relative',top:'5px', color: 'rgb(153, 153, 153)'}}>需输入具体金额值（需大于等于0，且保留2位小数）</span>
                                                        </Fragment>
                                                    }
                                                </div>
                                            </div>
                                        }
                                        
                                        {getSldEmptyH(20)}
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                {sldComLanguage('运费减免设置开关')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    extra={`${sldComLanguage('开启后,运费减免设置生效')}`}
                                                    style={{ width: 300 }}
                                                >
                                                    {getFieldDecorator('state', {
                                                        initialValue: flag,
                                                        valuePropName: 'checked',
                                                        rules: [{
                                                            required: true,
                                                            message: '请选择开启关闭'
                                                        }]
                                                    })(
                                                        <Switch />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        {getSldEmptyH(20)}
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                {sldComLanguage('运费减免设置')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    extra={`${sldComLanguage('需输入具体金额值（大于等于0，且保留2位小数）')}`}
                                                    style={{ width: 300 }}
                                                >
                                                    <div className={global.flex_row_start_center}>
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                marginRight: 5,
                                                                color: 'rgba(0, 0, 0, 0.65)'
                                                            }}
                                                        >{sldComLanguage('订单金额满')}</span>
                                                        {getFieldDecorator('fullAmount', {
                                                            initialValue: details.fullAmount, rules: [{
                                                                required: false,
                                                                message: '请输入订单金额'
                                                            }]
                                                        })(
                                                            <InputNumber
                                                                max={100000}
                                                                min={0.00}
                                                                precision={2}
                                                                style={{ width: 180 }}
                                                                placeholder='请输入订单金额'
                                                            />,
                                                        )}
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                marginLeft: 5,
                                                                color: 'rgba(0, 0, 0, 0.65)'
                                                            }}
                                                        >{sldComLanguage('元')}</span>
                                                    </div>
                                                </FormItem>
                                                <FormItem
                                                    style={{ width: 400 }}
                                                >
                                                    {getFieldDecorator('lowerType', {
                                                        initialValue: lowerType
                                                    })(
                                                        <RadioGroup size="small" onChange={(e) => this.lowerTypeChange(e)}>
                                                            <Radio value={1}>
                                                             减运费
                                                                <FormItem
                                                                    style={{ width: 180,marginTop:'-8px',marginLeft:'16px' }}
                                                                >
                                                                    <div>
                                                                        {getFieldDecorator('lowerAmount', {
                                                                            initialValue: details.lowerAmount,
                                                                            rules: [{
                                                                                required: false,
                                                                                message: `${sldComLanguage('请输入运费')}`
                                                                            }]
                                                                        })(
                                                                            <InputNumber
                                                                                max={100000}
                                                                                min={0.00}
                                                                                precision={2}
                                                                                style={{ width: 170 }}
                                                                                placeholder={`${sldComLanguage('请输入减免运费金额')}`}
                                                                            />
                                                                        )}
                                                                        <span>元</span>
                                                                    </div>
                                                                </FormItem>
                                                            
                                                            </Radio>
                                                            <Radio value={2}>
                                                              免运费
                                                            </Radio>
                                                        </RadioGroup>,
                                                    )}
                                                </FormItem>
                                            </div>
                                          
                                        </div>
                                        {getSldEmptyH(20)}
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                {sldComLanguage('凑单跳转链接')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    extra={`${sldComLanguage('若未输入，则默认跳转至巨拾惠首页')}`}
                                                    style={{ width: 700 }}
                                                >
                                                    {getFieldDecorator('link', {
                                                        initialValue: details.link,
                                                        rules: [{
                                                            required: false,
                                                            message: '请填写'
                                                        }]
                                                    })(
                                                        <Input style={{width:700}} />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        {getSldEmptyH(20)}
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`}>
                                                {sldComLanguage('小程序凑单跳转链接')}
                                            </div>
                                            <div className={`${promotion.right}`}>
                                                <FormItem
                                                    extra={`${sldComLanguage('若未输入，则默认跳转至小程序首页,小程序专题地址/views/topic/index?topicId=专题id')}`}
                                                    style={{ width: 700 }}
                                                >
                                                    {getFieldDecorator('miniProgramLink', {
                                                        initialValue: details.miniProgramLink,
                                                        rules: [{
                                                            required: false,
                                                            message: '请填写'
                                                        }]
                                                    })(
                                                        <Input style={{width:700}} />,
                                                    )}
                                                </FormItem>
                                            </div>
                                        </div>
                                        {getSldEmptyH(20)}
                                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                            <div className={`${promotion.left}`} />
                                            <div className={`${promotion.right}`}>
                                                <AuthBtn btnAuth={btnAuth} eventKey={["free_edit"]}>
                                                    <Button onClick={() => this.props.form.submit(this.handleSaveAllData)} type='primary'>确定</Button>
                                                </AuthBtn>
                                            </div>
                                          
                                        </div>
                                    </div>
                                </Fragment>
                                  }
                              
                              </div>
                          </Scrollbars>
                      </Form>
                  </Spin>
              </div>
          </AuthBtn>
      );
  }
}

