import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Select, Input, Spin,Upload ,Icon,Checkbox,Tree} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    sldLlineRtextAddGoods,
    failTip,
    sucTip,
    getSldEmptyH,
    sldComLanguage,
    sldBeforeUpload,
    getLocalStorageStingVal,
    getStorage,
    getAuthBtn
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import SldReactQuill from '@/components/SldReactQuill';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const FormItem = Form.Item;
const Option = Select.Option;
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
                channelId:'',
                channelName:'',
                shortChannelName:'',
                paymentMethods:[],
                protocolInfo:{//协议部分
                    "protocolId": '',
                    "protocolName": "",
                    "protocolFileUrl": "",
                    "remark": "",
                    "fileName": "",
                    "summary": "",
                    "protocolContent":""
                    // "showPositionList": []
                } 
            },//渠道详情 
            query: props.location.query,//query数据
            showLoading: true,
            stateMap:{
                '1':'启用',
                '2':'停用'
            },
            stateActionNameMap:{
                '1':'停用',
                '2':'启用'
            },
            stateActionMap:{
                '1':'2',
                '2':'1'
            },
            //   positionList:['jd','sn','xy'],//协议展示位置
            //   positionListMap:{'jd':'京东企业购','sn':'苏宁易购','xy':'西域'},//协议展示位置
            channelState:null,//渠道状态
            optional:[],//未开通渠道数据
            available:[],//支付方式列表
            preview_img: '',
            preview_alt_con: '',
            show_preview_modal: false,
            uploadImgInfo: {//上传图片数据
                logoImgFileList: []
            },
            uploadPdfInfo: {//上传协议文件数据
                pdfFileList: []
            },
            storeData:[],//店铺信息
            storeIdList:[]//选中的店铺
        };
    }

    componentDidMount() {
        let { bisEdit } = this.state;
        this.getDetail();
        this.get_operation_available();
        if(!bisEdit){
            this.get_optional();
        }
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
        this.get_store_list()
    }

  //获取店铺数据列表
  get_store_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'systemset_channel/get_own_store_list',
          payload: params,
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  let storeData = res.data.list
                  // let allSupplierTypes = []
                  storeData.forEach((item)=>{
                      item.key = `${item.storeId}`
                      item.title = item.storeName
                  })
                  let topSearchStoreData = []
                  topSearchStoreData.push({
                      key:"0",
                      title:'全部',
                      children:[]
                  })
                  topSearchStoreData[0].children = storeData

                  this.setState({
                      storeData: topSearchStoreData
                  });
              } 
          }
      });
  };

    onCheck = (checkedKeys)=>{
        let list = checkedKeys.filter(item=>item!="0")
        this.setState({
            storeIdList:list
        })
    }

  //根据id获取详细信息
  getDetail = () => {
      let { detail, query,channelState,uploadImgInfo,uploadPdfInfo,storeIdList } = this.state;
      const { dispatch } = this.props;
      if(!!query.id){
          dispatch({
              type: 'systemset_channel/operation_detail',
              payload: { 'channelId': query.id },
              callback: (res) => {
                  if (res.state == 200) {
                      //初始化数据
                      detail = res.data;
                      detail.paymentMethods = res.data.paymentMethods.map((item)=>item.payType);
                      let list = res.data.storeIdList
                      if(list&&list.length>0){
                          list.forEach(item=>{
                              storeIdList.push(
                                  item
                              )
                          })
                          this.setState({
                              storeIdList:storeIdList
                          })
                      }else{
                          this.setState({
                              storeIdList:[]
                          })
                      }
                      channelState = res.data.channelState;
                      let logoImgFileList = [];
                      if (detail.logo) {
                          let tmp_data = {};
                          tmp_data.uid = detail.logo;
                          tmp_data.name = detail.logo;
                          tmp_data.status = 'done';
                          tmp_data.url = detail.logo;
                          tmp_data.response = {};
                          tmp_data.response.data = {};
                          tmp_data.response.data.url = detail.logo;
                          tmp_data.response.data.path = detail.logo;
                          logoImgFileList.push(tmp_data);
                      }
                      uploadImgInfo.logoImgFileList = logoImgFileList;
                      let tempProtocolInfo = [];
                      let pdfFileList = [];
                      if (!!detail.protocolInfos && 0 < detail.protocolInfos.length) {
                          let temp = detail.protocolInfos[0];
                          tempProtocolInfo = detail.protocolInfos[0];
                          let tmp_data = {};
                          tmp_data.uid = temp.protocolFileUrl;
                          tmp_data.name = temp.fileName;
                          tmp_data.status = 'done';
                          tmp_data.url = temp.protocolFileUrl;
                          tmp_data.response = {};
                          tmp_data.response.data = {};
                          tmp_data.response.data.url = temp.protocolFileUrl;
                          tmp_data.response.data.path = temp.protocolFileUrl;
                          pdfFileList.push(tmp_data);
                          detail.protocolInfo = tempProtocolInfo;
                          if(pdfFileList&&pdfFileList.length>0){
                              uploadPdfInfo.pdfFileList = pdfFileList[0].url!=null?pdfFileList:[];
                          }
                      }else{
                          let tmp_data = {};
                          tmp_data.fileName = '';
                          tmp_data.protocolFileUrl = '';
                          tmp_data.protocolName = '';
                          tmp_data.remark = '';
                          tmp_data.summary = '';
                          tmp_data.protocolContent = '';
                          detail.protocolInfo= tmp_data
                          uploadPdfInfo.pdfFileList = []
                      }
                      this.setState({detail, channelState, uploadImgInfo,uploadPdfInfo,showLoading: false });
                  } else {
                      failTip(res.msg);
                  }
              }
          });
      }
  };

  //获取待创建渠道列表
  get_optional = () => {
      const { dispatch } = this.props;
      let { optional } = this.state;
      dispatch({
          type: 'systemset_channel/operation_optional',
          payload: {},
          callback: (res) => {
              if (res.state == 200) {
                  optional = res.data;
                  this.setState({ optional });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //获取支付方式列表
  get_operation_available = () => {
      const { dispatch } = this.props;
      let { available } = this.state;
      dispatch({
          type: 'systemset_channel/operation_available',
          payload: {},
          callback: (res) => {
              if (res.state == 200) {
                  available = res.data.payTypes;
                  this.setState({ available });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };
  
  //保存并新增事件
  handleSaveAllData = () => {
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              const { dispatch } = this.props;
              const { query,detail,uploadImgInfo ,uploadPdfInfo, bisEdit, available ,storeIdList} = this.state;
              let dis_type = 'systemset_channel/operation_add';
              //如果有id，则编辑该条数据信息
              if (!!query.id) {
                  dis_type = 'systemset_channel/operation_upData';
              }
              let params = {
                  userId: "1",
                  companyId: "1",
                  userName: (getStorage('user_info') != '' && getStorage('user_info') != null) ? JSON.parse(getStorage('user_info')).user_name : 'admin',
                  channelId:values.channelId,
                  channelName:detail.channelName,
                  shortChannelName:values.shortChannelName
              }
              //logo图片
              if (uploadImgInfo.logoImgFileList.length > 0) {
                  params.logo = uploadImgInfo.logoImgFileList[0].response.data.url;//图片
              } else {
                  failTip(`${('请上传渠道logo')}`);
                  return false;
              }
              //店铺信息
              if (storeIdList.length > 0) {
                  params.storeIdList = storeIdList;//图片
              } else {
                  failTip(`${('请选择店铺')}`);
                  return false;
              }

              //支付方式
              if (values.paymentMethods.length > 0) {
                  params.paymentMethods = values.paymentMethods.map((payTypeItem)=>{
                      let index = available.findIndex((item)=>item.payType == payTypeItem )
                      return available[index]
                  });
              } else {
                  failTip(`${('请选择支付方式')}`);
                  return false;
              }
              let tempProtocolInfo = {
                  protocolName:values.protocolName,
                  remark:values.remark,
                  summary:detail.protocolInfo.summary,
                  protocolContent:detail.protocolInfo.protocolContent
                  // showPositionList:values.showPositionList
              }
              if(bisEdit){
                  tempProtocolInfo.protocolId = detail.protocolInfo.protocolId;
              }

              //协议文件
              if (uploadPdfInfo.pdfFileList.length>0) {
                  let pdfUrl = uploadPdfInfo.pdfFileList[0].response.data.url;
                  tempProtocolInfo.protocolFileUrl = pdfUrl;
                  tempProtocolInfo.fileName = uploadPdfInfo.pdfFileList[0].name;
              }
              if((tempProtocolInfo.protocolContent==''||null)&&(tempProtocolInfo.protocolName==''||null)&&(tempProtocolInfo.remark==''||null)&&(tempProtocolInfo.summary==''||null)&&(uploadPdfInfo.protocolFileUrl==null)){

              }else{
                  params.protocolInfos = [tempProtocolInfo];
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

  //切换状态
  toogleState = (action)=>{
      const { dispatch } = this.props;
      let { detail, channelState,stateMap } = this.state;
      let params = {
          userId: "1",
          companyId: "1",
          userName: (getStorage('user_info') != '' && getStorage('user_info') != null) ? JSON.parse(getStorage('user_info')).user_name : 'admin',
          channelId:detail.channelId,
          channelState:action
      }
      dispatch({
          type: 'systemset_channel/operation_setState',
          payload: params,
          callback: (res) => {
              if (res.state == 200) {
                  channelState = action;
                  this.setState({ channelState });
                  sucTip(`已${stateMap[action]}`);
              } else {
                  failTip(res.msg);
              }
          }
      });

  }

  //slodon_获取富文本返回的内容
  handleGetContent = (value) => {
      let {detail } = this.state;
      if(value=="<p><br></p>"){
          detail.protocolInfo.summary = ''
      }else{
          detail.protocolInfo.summary = value;
      }
      this.setState({ detail });
  };

  //slodon_获取富文本返回的内容
  handleGetProtocolContent = (value) => {
      let {detail } = this.state;
      if(value=="<p><br></p>"){
          detail.protocolInfo.protocolContent = ''
      }else{
          detail.protocolInfo.protocolContent = value;
      }
      this.setState({ detail });
  };

  //checkbox选择
  more_checkbox_select = () => {
      // let { detail } = this.state;
      // detail.protocolInfo.showPositionList = e;
      // this.setState({ detail });

  };  

  //select选择
  selectOnChange = (e) => {
      let { detail, optional } = this.state;
      let index = optional.findIndex((item)=>item.channelId == e )
      detail.channelName = optional[index].channelName;
      this.setState({ detail });
  };
 
  //预览图片
  uploadPreview = (info) => {
      this.viewImg(true, info.response.data.url);
  };

  //预览pdf
  uploadPdfPreview = (info) => {
      window.open(info.response.data.url)
  };

  //上传协议
  uploadPdfChange = (info, type) => {
      let { uploadPdfInfo } = this.state;
      if (info.file.status != undefined && info.file.status != 'error') {
          uploadPdfInfo[type] = info.fileList;
      }
      this.setState({ uploadPdfInfo });
  };

  //上传图片
  uploadChange = (info, type) => {
      let { uploadImgInfo } = this.state;
      if (info.file.status != undefined && info.file.status != 'error') {
          uploadImgInfo[type] = info.fileList;
      }
      this.setState({ uploadImgInfo });
  };

  //预览图片/关闭预览图片
  viewImg = (flag, img = '', text = '') => {
      this.setState({
          preview_img: img,
          preview_alt_con: text,
          show_preview_modal: flag
      });
  };

  render() {
      const { detail, showLoading,optional,stateActionNameMap,stateActionMap, query,bisEdit,stateMap,channelState,uploadImgInfo,preview_img, preview_alt_con, show_preview_modal,available ,uploadPdfInfo,storeData,storeIdList } = this.state;
      let { form: { getFieldDecorator } } = this.props;
      const uploadButton = (text)=>(
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">{text}</div>
          </div>
      );
      return (
          <Scrollbars
              autoHeight
              autoHeightMin={100}
              autoHeightMax={document.body.clientHeight - 160}
          >
              <Spin spinning={query.id != undefined ? showLoading : false}>
                  {bisEdit &&
                <div className={global.flex_com_space_between} style={{ marginBottom: 10 ,padding: 10}}>
                    <div />
                    <AuthBtn eventKey={["switch_channel"]} btnAuth={btnAuth}>
                        <div
                            onClick={() => this.toogleState(stateActionMap[channelState])}
                            className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                        >
                            {stateActionNameMap[channelState]}
                        </div>
                    </AuthBtn>
                </div>
                  }
                  <div
                      className={`${promotion.full_activity} ${promotion.seckill} ${global.common_page_20}`}
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}
                  >
                      {sldLlineRtextAddGoods('#FA6F1E', `${('基础信息')}`)}
                      {getSldEmptyH(10)}
                      <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                          <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  {/* 状态 */}
                                  {!!channelState &&
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: '#FF1515' }}>*</span>状态
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300 }}
                                >
                                    {stateMap[channelState]}
                                </FormItem>
                            </div>
                        </div>
                                  }

                                  {/* logo */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }}>*</span>渠道logo
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <FormItem
                                              style={{ width: 300 }}
                                              extra= '支持上传.gif .jpeg .png .jpg格式的图片'
                                          >
                                              <Upload
                                                  withCredentials
                                                  beforeUpload={sldBeforeUpload}
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
                                                  {uploadImgInfo.logoImgFileList.length >= 1 ? null : uploadButton('上传图片')}
                                              </Upload>
                                          </FormItem>
                                      </div>
                                  </div>
                                  {/* 新建时选取渠道id */}
                                  {!bisEdit &&
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: '#FF1515' }}>*</span>渠道全称
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem>
                                    {getFieldDecorator('channelId', {
                                        initialValue: detail.channelId,
                                        rules: [{
                                            required: true,
                                            message: `${('请选择渠道全称')}`
                                        }]
                                    })(
                                        <Select
                                            placeholder={`${('请选择渠道全称')}`}
                                            style={{ width: 400 }}
                                            getPopupContainer={triggerNode => triggerNode.parentNode}
                                            onChange={(e) => this.selectOnChange(e)}
                                        >
                                            {optional.map((item, index) => <Option
                                                key={index}
                                                value={item.channelId}
                                            >{item.channelName}</Option>)}
                                        </Select>,
                                    )}
                                </FormItem>
                            </div>
                        </div>
                                  }

                                  {/* 编辑时展示渠道id */}
                                  {bisEdit &&
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: '#FF1515' }}>*</span>渠道ID
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300 }}
                                >
                                    {getFieldDecorator('channelId', {
                                        initialValue: detail.channelId, rules: [{
                                            required: true,
                                            message: `${('请输入渠道ID')}`
                                        }]
                                    })(
                                        <Input maxLength={20} disabled={bisEdit} style={{ width: 400 }} placeholder={`${('请输入渠道ID，找行长确认')}`} />,
                                    )}
                                </FormItem>
                            </div>
                        </div>
                                  }

                                  {/* 渠道全称 */}
                                  {bisEdit &&
                        <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                            <div className={`${promotion.left}`}>
                                <span style={{ color: '#FF1515' }}>*</span>渠道全称
                            </div>
                            <div className={`${promotion.right}`}>
                                <FormItem
                                    style={{ width: 300 }}
                                >
                                    {getFieldDecorator('channelName', {
                                        initialValue: detail.channelName, rules: [{
                                            required: true,
                                            whitespace: true,
                                            message: `${('请输入渠道全称')}`
                                        }]
                                    })(
                                        <Input maxLength={50} disabled={bisEdit} style={{ width: 400 }} placeholder={`${('如有多套环境，请找行长确认，需清晰表示当前环境')}`} />,
                                    )}
                                </FormItem>
                            </div>
                        </div>
                                  }

                                  {/* 渠道简称 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }}>*</span>渠道简称
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <FormItem
                                              style={{ width: 300 }}
                                          >
                                              {getFieldDecorator('shortChannelName', {
                                                  initialValue: detail.shortChannelName, rules: [{
                                                      required: true,
                                                      whitespace: true,
                                                      message: `${('请输入渠道简称')}`
                                                  }]
                                              })(
                                                  <Input maxLength={50} style={{ width: 400 }} placeholder={`${('请输入渠道简称')}`} />,
                                              )}
                                          </FormItem>
                                      </div>
                                  </div>
                                  {getSldEmptyH(35)}
                                  {sldLlineRtextAddGoods('#FA6F1E', `${('渠道支付方式(至少选择一种支付方式)')}`)}{/*支付方式*/}
                                  {/* 设置支付方式 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }} />支付方式
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <FormItem>
                                              {getFieldDecorator('paymentMethods', {
                                                  initialValue: detail.paymentMethods,
                                                  rules: [{
                                                      required: true,
                                                      message: `${('请选择支付方式')}`
                                                  }]
                                              })(
                                                  <Checkbox.Group size="small" buttonStyle="solid" onChange={(e) => this.more_checkbox_select(e)}>
                                                      {available.length > 0 && available.map((val) => <div style={{padding:5, display: 'inline-block' }}>
                                                          <Checkbox key={val.payType} style={{}} value={val.payType}><img width="28px" height="28px" style={{marginRight:5}} src={val.icon} />{val.payTypeName}</Checkbox>
                                                      </div>)}
                                                  </Checkbox.Group>,
                                              )}
                                          </FormItem>
                                      </div>
                                  </div>
                    
                                  {getSldEmptyH(35)}
                                  {sldLlineRtextAddGoods('#FA6F1E', `${('请选择店铺信息')}`)}{/*支付方式*/}
                                  {/* 设置支付方式 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }} />店铺信息
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <FormItem>
                                              <Tree
                                                  checkable
                                                  onCheck={this.onCheck}
                                                  checkedKeys={storeIdList}
                                                  treeData={storeData}
                                              />
                                          </FormItem>
                                      </div>
                                  </div>

                                  {getSldEmptyH(35)}
                                  {sldLlineRtextAddGoods('#FA6F1E', `${('服务协议（提示：当一个页面同时配置了多个协议时，只显示第一个配置协议的摘要）')}`)}{/*服务协议*/}
                                  {/* 协议名称 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }} />协议名称
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <FormItem
                                              style={{ width: 300 }}
                                          >
                                              {getFieldDecorator('protocolName', {
                                                  initialValue: detail.protocolInfo.protocolName, rules: [{
                                                      required: false,
                                                      whitespace: true,
                                                      message: `${('请输入协议名称')}`
                                                  }]
                                              })(
                                                  <Input
                                                      maxLength={100}
                                                      style={{ width: 400 }}
                                                      placeholder={`${('请输入协议名称')}`}
                                                  />,
                                              )}
                                          </FormItem>
                                      </div>
                                  </div>

                                  {/* 信息摘要 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }} />信息摘要
                                      </div>
                                      <div className={`${promotion.right } `}>
                                          <FormItem
                                              style={{ width: 650 }}
                                          >
                                              <div className={global.goods_sku_tab} style={{ display: 'flex', flex: 1, marginTop: 20, position: 'relative' }}>
                                                  <SldReactQuill
                                                      value={detail.protocolInfo.summary}
                                                      getRQContent={this.handleGetContent}
                                                      // height={300}
                                                  />
                                              </div>
                                          </FormItem>
                                      </div>
                                  </div>

                                  {/* 协议 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }} />上传协议书
                        
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <div style={{ marginTop:5,color:"red",fontWeight:"bold"}}>注：协议可上传富文本或pdf文档，两者都上传时，以富文本为主</div>
                                          <FormItem
                                              style={{ width: 650 }}
                                          >
                                              <div className={global.goods_sku_tab} style={{ display: 'flex', flex: 1, marginTop: 20, position: 'relative' }}>
                                                  <SldReactQuill
                                                      value={detail.protocolInfo.protocolContent}
                                                      getRQContent={this.handleGetProtocolContent}
                                                      // height={300}
                                                  />
                                              </div>
                                          </FormItem>
                                          <FormItem
                                              style={{ width: 300 ,marginTop:10}}
                                          >
                                              <Upload
                                                  withCredentials
                                                  beforeUpload={sldBeforeUpload}
                                                  accept=".pdf"
                                                  name="file"
                                                  action={`${apiUrl }v3/oss/common/upload?source=adminDoc`}
                                                  listType="picture-card"
                                                  fileList={uploadPdfInfo.pdfFileList}
                                                  onPreview={(info) => this.uploadPdfPreview(info)}
                                                  onChange={(info) => this.uploadPdfChange(info, 'pdfFileList')}
                                                  headers={{
                                                      Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                                                  }}
                                              >
                                                  {uploadPdfInfo.pdfFileList.length >= 1 ? null : uploadButton('上传协议')}
                                              </Upload>
                                          </FormItem>
                                      </div>
                                      {/* <div className={`${promotion.right}`}>
                        
                        </div> */}
                                  </div>

                                  {/* 协议展示位置 */}
                                  {/* <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                        <div className={`${promotion.left}`}>
                            <span style={{ color: '#FF1515' }}></span>{('展示位置')}
                        </div>
                        <div className={`${promotion.right}`}>
                            <FormItem
                            >
                            {getFieldDecorator('showPositionList', {
                                initialValue: detail.protocolInfo.showPositionList,
                                rules: [{
                                required: false,
                                message: `${('请选择展示位置')}`,
                                }],
                            })(
                                <Checkbox.Group size={'small'} buttonStyle="solid" onChange={(e) => this.more_checkbox_select(e)}>
                                {positionList.map((val) => {
                                    return <div style={{ width: 150,paddingTop:3,paddingBottom:3, display: 'inline-block' }}>
                                        <Checkbox key={val} style={{}} value={val}>{positionListMap[val]}</Checkbox>
                                    </div>;
                                })}
                                </Checkbox.Group>,
                            )}
                            </FormItem>
                        </div>
                    </div> */}

                                  {/* 备注 */}
                                  <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                      <div className={`${promotion.left}`}>
                                          <span style={{ color: '#FF1515' }} />备注
                                      </div>
                                      <div className={`${promotion.right}`}>
                                          <FormItem
                                              style={{ width: 300 }}
                                          >
                                              {getFieldDecorator('remark', {
                                                  initialValue: detail.protocolInfo.remark, rules: [{
                                                      required: false,
                                                      whitespace: true,
                                                      message: `${('请输入备注')}`
                                                  }]
                                              })(
                                                  <Input
                                                      maxLength={200}
                                                      style={{ width: 400 ,minHeight: 32}}
                                                      rows={4}
                                                      placeholder={`${('请输入备注')}`}
                                                  />,
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
                                      <AuthBtn eventKey={["edit_channel","add_channel"]} btnAuth={btnAuth}>
                                          <div
                                              onClick={() => this.props.form.submit(this.handleSaveAllData)}
                                              className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                                          >
                        保存并返回
                                          </div>
                                      </AuthBtn>
                                  </div>
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
