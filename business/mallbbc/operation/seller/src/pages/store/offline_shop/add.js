/*
* 门店管理——添加门店
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Form, Spin, Input,Cascader, Button,Popconfirm, Upload,Icon } from 'antd';
import {
    failTip,
    sucTip,
    sldLlineRtextAddMargin,
    sldIconBtnBg,
    sldComLanguage,
    getSldHorLine,
    sldCommonTitleByBg,
    getSldEmptyH,
    validatorVendorPhone,
    sldBeforeUpload,
    getLocalStorageStingVal,
    getAuthBtn,
    isEmpty,
    isNotEmpty,
    guid
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import AuthBtn from '@/components/AuthBtn';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import areaData from '@/assets/area.json';
import _cloneDeep from 'lodash/cloneDeep';


let btnAuth = getAuthBtn();
let sthis = '';
const FormItem = Form.Item;
// eslint-disable-next-line no-shadow
@connect(({ offline_shop, global }) => ({
    offline_shop, global
}))
@Form.create()
export default class AddFullAcm extends Component {
    

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            loading: false,
            query: props.location.query,
            title:props.location.query.id?'编辑门店':'新增门店',
            detail: {}, //详情
            preview_img: '',//预览的图片
            show_preview_modal:false, // 预览模态框
            selectedArea:[],
            fileList:[], //上传文件
            telArr:[
                {
                    key: guid(),
                    tel:''
                }
            ] // 手机号
        };
    }

    componentDidMount() {
        const { query } = this.state;
        if (isNotEmpty(query.id)) {
            this.get_detail(query.id);
        }
        this.props.dispatch({
            type: 'global/getLayoutCollapsed'
        });
    }

    componentWillUnmount() {
    }

  //获取门店详情
  get_detail = (id) => {
      const { dispatch } = this.props;
      let { detail,telArr } = this.state;
      let _telArr = _cloneDeep(telArr)
      dispatch({
          type: 'offline_shop/get_offlineShop_detail',
          payload: { id },
          callback: (res) => {
              if (res.state == 200) {
                  detail = res.data;
                  const {logo,provinceCode,cityCode,areaCode,servicePhones} = detail
                  // 处理图片
                  let fileList = []
                  if(logo){
                      fileList = [{
                          uid: '-1',
                          name: 'image.png',
                          status: 'done',
                          url: logo,
                          response:{data:{url:logo}}
                      }]
                  }
                  // 处理手机号
                  let telArrInfo = []
                  if(isNotEmpty(servicePhones)){
                      servicePhones.forEach((item)=>{
                          telArrInfo.push({
                              key: guid(),
                              tel:item 
                          })
                      })
                  }
                  // 处理省市区
                  let shopArea = [provinceCode,cityCode,areaCode]
                  detail.shopArea = shopArea

                  // areaInfo 拆解的逻辑
                  let selectedArea = []
                  let provinceItem = areaData.find(item=>item.regionCode==provinceCode)
                  let cityItem = provinceItem.children.find(item=>item.regionCode==cityCode)
                  let areaItem = cityItem.children.find(item=>item.regionCode==areaCode)
                  selectedArea = [provinceItem,cityItem,areaItem]
                  

                  this.setState({
                      detail,
                      fileList,
                      selectedArea,
                      telArr:isEmpty(telArrInfo)?_telArr:telArrInfo
                  })
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  areaChange = (value, selectedOptions)=>{
      this.setState({
          selectedArea:selectedOptions
      })
  }
  
  // 添加手机号
  addTel = ()=>{
      let { telArr } = this.state;
      if(telArr.length==3){
          failTip('最多添加三个！')
          return
      }
      telArr.push({
          key: guid(),
          tel:''
          
      });
      this.setState({ telArr });
  }

  // 删除手机号
  delTel = (key)=>{
      let { telArr } = this.state;
      telArr = telArr.filter(item => item.key != key);
      this.setState({ telArr: JSON.parse(JSON.stringify(telArr)) });
  }

  telChange = (e,key)=>{
      let { telArr } = this.state;
      let tar_item = telArr.find(item => item.key == key);
      tar_item.tel = e.target.value
      this.setState({ telArr });
  }

  //上传图片
  uploadImg = (info) => {
      let { fileList } = this.state;
      console.log(122,info)
      if (info.file.status != undefined && info.file.status != 'error') {
          fileList = info.fileList
          this.setState({ fileList });
      }
  };

  // 图片预览
  viewImg = (file) => {
      this.setState({
          preview_img: file.url || file.thumbUrl,
          show_preview_modal: true
      });
  };

  //关闭预览
  closeViewModal = () => {
      this.setState({
          show_preview_modal: false
      });
  };

  //保存并新增事件
  handleSaveAllData = () => {
      const { dispatch } = this.props;
      const { telArr,fileList,selectedArea,query } = this.state;
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              //处理图片
              if(fileList.length > 0 && fileList[0].response.data != undefined){
                  values.logo = fileList[0].response.data.url
              }else{
                  values.logo = ''
              }
              //处理电话号码
              let servicePhone = []
              telArr.forEach((item)=>{
                  if(isNotEmpty(item.tel)){
                      servicePhone.push(item.tel) 
                  }
              })
              if(servicePhone.length>0){
                  values.servicePhone = servicePhone.join(',')
              }else{
                  values.servicePhone = ''
              }
              // 处理省市区
              let areaInfo = ''
              const [province,city,area] = selectedArea
              values.provinceCode = province.regionCode
              values.cityCode = city.regionCode
              values.areaCode = area.regionCode

              areaInfo+=province.regionName
              areaInfo+=city.regionName
              areaInfo+=area.regionName
              values.areaInfo = areaInfo
              
              console.log(values)
              sthis.setState({ loading: true });
              let dis_type = '';
              if (isNotEmpty(query.id)) {
                  //编辑
                  values.id = query.id;
                  dis_type = 'offline_shop/edit_offlineShop';
              } else {
                  //新增
                  dis_type = 'offline_shop/add_offlineShop';
              }
              dispatch({
                  type: dis_type,
                  payload: values,
                  callback: (res) => {
                      sthis.setState({ loading: false });
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
      },
      );
  };

  render() {
      const { loading, detail,preview_img,show_preview_modal,fileList,telArr,title } = this.state;
      const uploadButton = (
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
          </div>
      );
      let {
          form: { getFieldDecorator }
      } = this.props;
      return (
          <div
              className={`${promotion.full_activity} ${global.common_page} ${global.com_flex_column}`}
              style={{ position: 'relative' }}
          >
              <AuthBtn btnAuth={btnAuth} eventKey={["offline_shop_add","offline_shop_edit"]} showPage>
                
                  <div className={global.flex_com_space_between} style={{ margin: 10, marginTop: 0 }}>
                      {sldLlineRtextAddMargin('#FA6F1E', title, 0, 0, 10)}
                      {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
                  </div>
                  {getSldHorLine(1)}
                  <Spin spinning={loading}>
                      <Form layout="inline">
                          <Scrollbars
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={document.body.clientHeight - 160}
                          >
                              <div className={`${global.goods_sku_tab} ${global.add_goods_wrap}`}>
                                  {/* 基本信息-start */}
                                  <div>
                                      {getSldEmptyH(10)}
                                      {sldCommonTitleByBg(`${sldComLanguage('门店基本信息')}`)}
                                      <div className={`${promotion.full_acm_activity} ${global.flex_column_start_start}`}>

                                          <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                              <div className={`${promotion.left}`}>
                                                  <span style={{ color: 'red' }}>*</span>{sldComLanguage('门店名称')}
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  <FormItem
                                                      extra={`${sldComLanguage('最多输入20个字')}`}
                                                      style={{ width: 300 }}
                                                  >
                                                      {getFieldDecorator('shopName', {
                                                          initialValue: detail.shopName, rules: [{
                                                              required: true,
                                                              whitespace: true,
                                                              message: `${sldComLanguage('请输入门店名称')}`
                                                          }]
                                                      })(
                                                          <Input maxLength={20} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入门店名称')}`} />,
                                                      )}
                                                  </FormItem>
                                              </div>
                                          </div>

                                          <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                              <div className={`${promotion.left}`}>
                                                  {sldComLanguage('门店logo')}
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  <FormItem
                                                      extra={`${sldComLanguage('支持jpg、jpeg、png，大小不超过2M')}`}
                                                      style={{ width: 300 }}
                                                  >
                                                      {getFieldDecorator('logo', {
                                                          initialValue: detail.logo, rules: [{
                                                              required: false,
                                                              message: `${sldComLanguage('请上传门店logo')}`
                                                          }]
                                                      })(
                                                          <Upload
                                                              withCredentials
                                                              beforeUpload={sldBeforeUpload}
                                                              accept=".jpeg, .png,.jpg,"
                                                              name="file"
                                                              listType="picture-card"
                                                              fileList={fileList}
                                                              action={`${apiUrl}/v3/oss/common/upload?source=setting`}
                                                              onPreview={this.viewImg}
                                                              onChange={(info) => this.uploadImg(info)}
                                                              headers={{
                                                                  Authorization: `Bearer ${ getLocalStorageStingVal('token')}`
                                                              }}
                                                          >
                                                              {fileList.length >= 1 ? null : uploadButton}
                                                          </Upload>,
                                                      )}
                                                  </FormItem>
                                              </div>
                                          </div>

                                          <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                              <div className={`${promotion.left}`}>
                                                  <span style={{ color: 'red' }}>*</span>{sldComLanguage('省市地区')}
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  <FormItem
                                                      extra=''
                                                      style={{ width: 300 }}
                                                  >
                                                      {getFieldDecorator('shopArea', {
                                                          initialValue: detail.shopArea, rules: [{
                                                              required: true,
                                                              message: `${sldComLanguage('请输入省市地区')}`
                                                          }]
                                                      })(
                                                          <Cascader
                                                              options={areaData}
                                                              fieldNames={{
                                                                  label: 'regionName',
                                                                  value: 'regionCode',
                                                                  children: 'children'
                                                              }}
                                                              onChange={this.areaChange}
                                                              placeholder="请输入省市地区"
                                                              style={{ width: 400 }}
                                                          />,
                                                      )}
                                                  </FormItem>
                                              </div>
                                          </div>

                                          <div className={`${promotion.item} ${global.flex_row_start_start}`}>
                                              <div className={`${promotion.left}`}>
                                                  <span style={{ color: 'red' }}>*</span>{sldComLanguage('详细地址')}
                                              </div>
                                              <div className={`${promotion.right}`}>
                                                  <FormItem
                                                      extra=''
                                                      style={{ width: 300 }}
                                                  >
                                                      {getFieldDecorator('address', {
                                                          initialValue: detail.address, rules: [{
                                                              required: true,
                                                              whitespace: true,
                                                              message: `${sldComLanguage('请输入详细地址')}`
                                                          }]
                                                      })(
                                                          <Input maxLength={20} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入详细地址')}`} />,
                                                      )}
                                                  </FormItem>
                                              </div>
                                          </div>
                                      

                                          {
                                              telArr.map((item,index)=>(
                                                  <div className={`${promotion.item} ${global.flex_row_start_start}`} key={item.key}>
                                                      <div className={`${promotion.left}`}>
                                                          {sldComLanguage(`门店电话${index+1}`)}
                                                      </div>
                                                      <div className={`${promotion.right}`}>
                                                          <FormItem
                                                              extra=''
                                                          >
                                                              {getFieldDecorator(`servicePhone_${item.key}`, {
                                                                  initialValue: item.tel||undefined, rules: [{
                                                                      required: false,
                                                                      message: `${sldComLanguage('请输入门店电话')}`
                                                                  },{ validator: (rule, value, callback) => validatorVendorPhone(rule, value, callback) }]
                                                              })(
                                                                  <Input maxLength={20} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入门店电话')}`} onChange={(e)=>this.telChange(e,item.key)} />,
                                                              )}
                                                         
                                                          </FormItem>
                                                          {
                                                              telArr.length>1 && <span onClick={()=>{this.delTel(item.key)}} style={{position:'relative',top:'6px',marginRight:'10px'}}><Icon type="minus-circle" /></span>
                                                          }
                                                          {
                                                              index+1==telArr.length && <span onClick={()=>{this.addTel()}} style={{position:'relative',top:'6px'}}><Icon type="plus" />添加</span>   
                                                          }
                                                      </div>
                                                  </div>
                                              ))
                                          }

                                      </div>
                                  </div>
                                  {/* 基本信息-end */}
                              </div>
                             
                              {getSldEmptyH(15)}
                              <div
                                  className={global.m_diy_bottom_wrap}
                                  style={{ position: 'fixed', left: this.props.global.collapsed ? 90 : 160 }}
                              >
                               
                                  {
                                      <Popconfirm
                                          title="是否确定提交?"
                                          onConfirm={() => this.props.form.submit(this.handleSaveAllData)}
                                          okText="确认"
                                          cancelText="取消"
                                      >
                                          <Button style={{marginRight:20}} type='primary'>确定</Button>
                                      </Popconfirm>
                                  }
                                 
                                  
                              </div>
                          </Scrollbars>
                      </Form>
                  </Spin>
              </AuthBtn>
              {/*图片预览-start*/}
              <SldPreviewImg
                  img={preview_img}
                  show_preview_modal={show_preview_modal}
                  modal_width={300}
                  preview_alt_con=''
                  closePreviewModal={() => this.closeViewModal()}
              />
              {/*图片预览-end*/}
          </div>
      );
  }
}
