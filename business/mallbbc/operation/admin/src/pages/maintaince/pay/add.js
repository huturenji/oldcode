import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Input, Radio, Spin,Upload ,Icon} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    getStorage,
    sldLlineRtextAddGoods,
    failTip,
    sucTip,
    getSldEmptyH,
    sldComLanguage,
    sldBeforeUpload,
    getLocalStorageStingVal,
    getAuthBtn
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const { TextArea } = Input;

const FormItem = Form.Item;

let sthis = '';
// eslint-disable-next-line no-shadow
@connect(({ product, global }) => ({
    product, global
}))
@Form.create()
export default class Add_article extends Component {
    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            bisEdit: !!props.location.query.id?true:false,//'add'新增  'edit'编辑
            detail: {
                "signType":"SM9",
                "payType": "",
                "payTypeName": "",

                "alias": "",
                "apiUrl": "",
                "shopId": "",
                "thirdPublicKey":"",
                "icon": "",
                "account":"", //SM2
	        "accountName":"", //SM2
	        "recvbank":"", //SM2
	        "recvbankName":"", //SM2

                "publicCommonParam": "", //SM9
                "publicKey": "", //SM2
                "privateKey":"",
                "privateKeyPwd":"", //SM9

                "notifyUrl": "",
                "operationName": ""
            },//渠道详情
            query: props.location.query,//query数据
            showLoading: true,
            preview_img: '',
            preview_alt_con: '',
            show_preview_modal: false,
            uploadImgInfo: {//上传图片数据
                logoImgFileList: []
            }
        };
    }

    componentDidMount() {
        this.getDetail();
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
    }

  //根据id获取详细信息
  getDetail = () => {
      let { detail, query,uploadImgInfo } = this.state;
      const { dispatch } = this.props;
      if(!!query.id){
          dispatch({
              type: 'bosspay/detail',
              payload: { 'payType': query.id },
              callback: (res) => {
                  if (res.state == 200) {
                      //初始化数据
                      detail = res.data;
                      let logoImgFileList = [];
                      if (detail.icon) {
                          let tmp_data = {};
                          tmp_data.uid = detail.icon;
                          tmp_data.name = detail.icon;
                          tmp_data.status = 'done';
                          tmp_data.url = detail.icon;
                          tmp_data.response = {};
                          tmp_data.response.data = {};
                          tmp_data.response.data.url = detail.icon;
                          tmp_data.response.data.path = detail.icon;
                          logoImgFileList.push(tmp_data);
                      }
                      uploadImgInfo.logoImgFileList = logoImgFileList;
                      this.setState({detail, uploadImgInfo,showLoading: false });
                  } else {
                      failTip(res.msg);
                  }
              }
          });
      }
  };
  
  //保存并新增事件
  handleSaveAllData = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              const { dispatch } = this.props;
              const { uploadImgInfo } = this.state;
              let dis_type = 'bosspay/upData';
              let params = {
                  "signType":values.signType,
                  "payType": values.payType,
                  "payTypeName": values.payTypeName,

                  "alias": values.alias,
                  "apiUrl": values.apiUrl,
                  "shopId": values.shopId,
                  "thirdPublicKey":values.thirdPublicKey,
                  "account":values.account, //SM2
	          "accountName":values.accountName, //SM2
	          "recvbank":values.recvbank, //SM2
	          "recvbankName":values.recvbankName, //SM2


                  "publicCommonParam": values.publicCommonParam, //SM9
                  "publicKey": values.publicKey, //SM2
                  "privateKey":values.privateKey,
                  "privateKeyPwd":values.privateKeyPwd, //SM9
  
                  "notifyUrl": values.notifyUrl,
                  "operationName": (getStorage('user_info') != '' && getStorage('user_info') != null) ? JSON.parse(getStorage('user_info')).user_name : 'admin'
            
              }
              //logo图片
              if (uploadImgInfo.logoImgFileList.length > 0) {
                  params.icon = uploadImgInfo.logoImgFileList[0].response.data.url;//图片
              } else {
                  failTip(`${('请上传图标')}`);
                  return false;
              }

              dispatch({
                  type: dis_type,
                  payload: params,
                  callback: (res) => {
                      if (res.state == 200) {
                          sucTip(res.msg);
                          setTimeout(() => {
                              sthis.props.history.goBack();
                          }, 500);
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });
  };

  //预览图片
  uploadPreview = (info) => {
      this.viewImg(true, info.response.data.url);
  };

  //上传图片
  uploadChange = (info, type) => {
      let { uploadImgInfo } = this.state;
      if (info.file.status != undefined && info.file.status != 'error') {
          uploadImgInfo[type] = info.fileList;
      }
      this.setState({ uploadImgInfo });
  };

  signTypeOnChange = (value) =>{
      let { detail } = this.state;
      detail.signType = value;
      this.setState({ detail });
      console.log(detail)
      console.log(value)
  }

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
      this.setState({
          preview_img: img,
          preview_alt_con: text,
          show_preview_modal: flag
      });
  };

  render() {
      const { detail, showLoading, query,bisEdit,uploadImgInfo ,preview_img, preview_alt_con, show_preview_modal} = this.state;
      let { form: { getFieldDecorator } } = this.props;
      const uploadButton = (
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
          </div>
      );
      return (
          <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 160}
          >
              <Spin spinning={query.id != undefined ? showLoading : false}>
                  <div
                      className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page_20}`}
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                  >

                      <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                          <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <Form layout="inline">
                                      {sldLlineRtextAddGoods('#FA6F1E', `${('秘钥类型')}`)}
                                      {getSldEmptyH(10)}
                                      {/* 秘钥类型 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>秘钥类型
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem>
                                                  {getFieldDecorator('signType', {
                                                      initialValue: detail.signType, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入支付方式key')}`
                                                      }]
                                                  })(
                                                      <Radio.Group onChange={(e) => this.signTypeOnChange(e.target.value)} disabled={bisEdit}>
                                                          <Radio value="SM9">SM9（老板付）</Radio>
                                                          <Radio value="SM2">SM2（公款闪付、公款转账）</Radio>
                                                      </Radio.Group>,

                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {getSldEmptyH(35)}
                                      {sldLlineRtextAddGoods('#FA6F1E', `${('基础信息')}`)}{/*支付方式*/}
                                      {/* 支付方式key */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>支付方式key
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('payType', {
                                                      initialValue: detail.payType, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入支付方式key')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={200} disabled={bisEdit} style={{ width: 600 }} placeholder={`${('请按照***_BOSS_PAY,_QUICK_PAY等格式填入')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {/* 支付方式全称 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>支付方式全称
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('payTypeName', {
                                                      initialValue: detail.payTypeName, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入支付方式全称')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={200} style={{ width: 600 }} placeholder={`${('请输入支付方式全称')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {getSldEmptyH(35)}
                                      {sldLlineRtextAddGoods('#FA6F1E', `${('老板付接入配置（下列配置都是银行提供的，请找行长确认）')}`)}{/*支付方式*/}
                                      {/* 支付方式全称 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>支付方式简称
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('alias', {
                                                      initialValue: detail.alias, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入支付方式简称')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={64} style={{ width: 600 }} placeholder={`${('请输入支付方式简称,最大64位，找行长确认')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {/* 支付服务地址 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>支付服务地址
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('apiUrl', {
                                                      initialValue: detail.apiUrl, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入支付服务地址')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={255} style={{ width: 600 }} placeholder={`${('请输入支付服务地址,最大255位，找行长确认')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {/* 商户号 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>商户号
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('shopId', {
                                                      initialValue: detail.shopId, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入商户号')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={64} style={{ width: 600 }} placeholder={`${('请输入商户号,最大64位，找行长确认')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {/* 公钥 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>第三方公钥
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('thirdPublicKey', {
                                                      initialValue: detail.thirdPublicKey, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入第三方公钥')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={128} style={{ width: 600 }} placeholder={`${('请输入第三方公钥,最大128位，找行长确认')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {/* 支付图标 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>支付图标(64K)
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  extra= '支持上传.gif .jpeg .png .jpg格式的图片'
                                                  style={{ width: 300 }}
                                              >
                                                  <Upload
                                                      withCredentials
                                                      beforeUpload={(file, fileList)=>sldBeforeUpload(file, fileList,0.064)}
                                                      accept=".gif, .jpeg, .png,.jpg,"
                                                      name="file"
                                                      action={`${apiUrl }v3/oss/common/upload?source=setting`}
                                                      listType="picture-card"
                                                      fileList={uploadImgInfo.logoImgFileList}
                                                      onPreview={(info) => this.uploadPreview(info)}
                                                      onChange={(info) => this.uploadChange(info, 'logoImgFileList')}
                                                      headers={{
                                                          Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                                                      }}
                                                  >
                                                      {uploadImgInfo.logoImgFileList.length >= 1 ? null : uploadButton}
                                                  </Upload>
                                              </FormItem>
                                          </div>
                                      </div>
                                      {/* 收方账户账号 */}
                                      {
                                          detail.signType=='SM2'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      收方账户账号
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem
                                                          style={{ width: 300 }}
                                                      >
                                                          {getFieldDecorator('account', {
                                                              initialValue: detail.account, rules: [{
                                                                  whitespace: true,
                                                                  message: `${('请输入收方账户账号')}`
                                                              }]
                                                          })(
                                                              <Input maxLength={200} style={{ width: 600 }} placeholder={`${('请输入收方账户账号，渠道提供的，用于B+支付配置，找行长确认')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {/* 收方账户名称 */}
                                      {
                                          detail.signType=='SM2'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      收方账户名称
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem
                                                          style={{ width: 300 }}
                                                      >
                                                          {getFieldDecorator('accountName', {
                                                              initialValue: detail.accountName, rules: [{
                                                                  whitespace: true,
                                                                  message: `${('请输入收方账户名称')}`
                                                              }]
                                                          })(
                                                              <Input maxLength={200} style={{ width: 600 }} placeholder={`${('请输入收方账户名称，渠道提供的，用于B+支付配置，找行长确认')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {/* 商户开户行行号 */}
                                      {
                                          detail.signType=='SM2'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      商户开户行行号
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem
                                                          style={{ width: 300 }}
                                                      >
                                                          {getFieldDecorator('recvbank', {
                                                              initialValue: detail.recvbank, rules: [{
                                                                  whitespace: true,
                                                                  message: `${('请输入商户开户行行号')}`
                                                              }]
                                                          })(
                                                              <Input maxLength={200} style={{ width: 600 }} placeholder={`${('请输入商户开户行行号，渠道提供的，用于B+支付配置（非本行账号必填），找行长确认')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {/* 商户开户行名称 */}
                                      {
                                          detail.signType=='SM2'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      商户开户行名称
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem
                                                          style={{ width: 300 }}
                                                      >
                                                          {getFieldDecorator('recvbankName', {
                                                              initialValue: detail.recvbankName, rules: [{
                                                                  whitespace: true,
                                                                  message: `${('请输入商户开户行名称')}`
                                                              }]
                                                          })(
                                                              <Input maxLength={200} style={{ width: 600 }} placeholder={`${('请输入商户开户行名称，渠道提供的，用于B+支付配置（非本行账号必填），找行长确认')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {getSldEmptyH(35)}
                                      {sldLlineRtextAddGoods('#FA6F1E', `${('老板付接入配置（下列配置都是B+提供的，不依赖银行）')}`)}{/*服务协议*/}
                                      {/* 公共参数 */}
                                      {
                                          detail.signType=='SM9'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      <span style={{ color: '#FF1515' }}>*</span>公共参数
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem>
                                                          {getFieldDecorator('publicCommonParam', {
                                                              initialValue: detail.publicCommonParam, rules: [{
                                                                  required: true,
                                                                  whitespace: true,
                                                                  message: `${('请输入公共参数')}`
                                                              }]
                                                          })(
                                                              <TextArea rows={8} maxLength={1000} style={{ width: 600,wordBreak: 'break-all' }} placeholder={`${('B+固定参数，拷贝其它已有配置即可')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {/* 公钥 */}
                                      {
                                          detail.signType=='SM2'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      <span style={{ color: '#FF1515' }}>*</span>公钥
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem
                                                          style={{ width: 300 }}
                                                      >
                                                          {getFieldDecorator('publicKey', {
                                                              initialValue: detail.publicKey, rules: [{
                                                                  required: true,
                                                                  whitespace: true,
                                                                  message: `${('请输入公钥')}`
                                                              }]
                                                          })(
                                                              <TextArea rows={8} maxLength={1000} style={{ width: 600 }} placeholder={`${('最大128位，B+固定参数，拷贝其它已有配置即可')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {/* 私钥 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>私钥
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('privateKey', {
                                                      initialValue: detail.privateKey, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入私钥')}`
                                                      }]
                                                  })(
                                                      <TextArea rows={8} maxLength={1000} style={{ width: 600 }} placeholder={`${('B+固定参数，拷贝其它已有配置即可')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>

                                      {/* 私钥密码 */}
                                      {
                                          detail.signType=='SM9'?
                                              <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                                  <div className={`${promotion.left}`}>
                                                      <span style={{ color: '#FF1515' }}>*</span>私钥密码
                                                  </div>
                                                  <div className={`${promotion.right}`}>
                                                      <FormItem
                                                          style={{ width: 300 }}
                                                      >
                                                          {getFieldDecorator('privateKeyPwd', {
                                                              initialValue: detail.privateKeyPwd, rules: [{
                                                                  required: true,
                                                                  whitespace: true,
                                                                  message: `${('请输入私钥密码')}`
                                                              }]
                                                          })(
                                                              <Input maxLength={200} style={{ width: 600 }} placeholder={`${('最大128位，B+固定参数，拷贝其它已有配置即可')}`} />,
                                                          )}
                                                      </FormItem>
                                                  </div>
                                              </div>
                                              :null
                                      }

                                      {/* 回调地址 */}
                                      <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                          <div className={`${promotion.left}`}>
                                              <span style={{ color: '#FF1515' }}>*</span>回调地址
                                          </div>
                                          <div className={`${promotion.right}`}>
                                              <FormItem
                                                  style={{ width: 300 }}
                                              >
                                                  {getFieldDecorator('notifyUrl', {
                                                      initialValue: detail.notifyUrl, rules: [{
                                                          required: true,
                                                          whitespace: true,
                                                          message: `${('请输入回调地址')}`
                                                      }]
                                                  })(
                                                      <Input maxLength={255} style={{ width: 600 }} placeholder={`${('最大255位，B+固定参数，需区分银行对接的是伴正事还是T信')}`} />,
                                                  )}
                                              </FormItem>
                                          </div>
                                      </div>


                                      <div
                                          className={global.m_diy_bottom_wrap}
                                          style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                                      >
                                          <div onClick={() => this.props.history.goBack()} className={global.add_goods_bottom_btn}>
                                              {sldComLanguage('返回')}{/*返回*/}
                                          </div>
                                          <AuthBtn eventKey={["add_bosspay","edit_bosspay"]} btnAuth={btnAuth}>
                                              <div
                                                  onClick={() => this.props.form.submit(this.handleSaveAllData)}
                                                  className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                                              >
                        保存并返回
                                              </div>
                                          </AuthBtn>
                                      </div>
                                  </Form>
                              </div>
                          </div>
                      </div>
                  </div>
                  {/*图片预览-start*/}
                  <SldPreviewImg
                      img={preview_img}
                      show_preview_modal={show_preview_modal}
                      modal_width={500}
                      preview_alt_con={preview_alt_con}
                      closePreviewModal={() => this.viewImg(false)}
                  />
                  {/*图片预览-end*/}
              </Spin>
          </Scrollbars>
      );
  }
}
