/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于装修商品选择
* 2021-12-07复制于SldSelMoreLeftRightGoods组件,用于优惠活动以sku规格的商品参加
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Empty,
    Form, Modal,Upload,Button,message,Tooltip,Switch
} from 'antd';
import XLSX from 'xlsx';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    failTip,
    list_com_page_size_16,
    sldComLanguage,
    downLoad_front
} from '@/utils/utils';
import global from '@/global.less';
import styles from './index.less';
import Search from '@/components/Search/Search';
import ALibbSvg from '../ALibbSvg';

const { confirm } = Modal;

let pageSize = list_com_page_size_16;
const step = 100;
@connect(({ pc_home, project }) => ({
    pc_home,
    project
}))
@Form.create()
export default class SldSelMoreLeftRightGoods extends Component {
    init_flag = true;

    loading_pagination_flag = false;//分页加载标识，防止分页重复加载
    
    constructor(props) {
        super(props);
        this.state = {
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            modalVisible: false,
            loading: false,
            data: {},
            storeData:{},//店铺数据
            
            onlyOneStore:false,//是否只搜索京东企业购商品
            storeId:'',
            title: '',
            params: { pageSize: pageSize },
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'keyword',
                placeholder: `${sldComLanguage('请输入商品名称')}`
            },
            {
                type: 'select',
                label: `选择店铺`,
                name: 'storeId',
                initialValue:'',
                placeholder: `请选择店铺`,
                sel_data: [
                    {
                        key:'6',
                        name:'京东企业购'
                    }
                ],
                selectChange:this.selectChange,
                setItemInitValue:[{
                    'supplierTypes':''
                }]
            },
            {
                type: 'select',
                label: `选择供应商`,
                name: 'supplierTypes',
                initialValue:'',
                placeholder: `请选择供应商`,
                sel_data: [
                   
                ]
            }
            ],
            formValues: {},//搜索条件
            uploading:false,
            showUpload:true, // 是否展示上传按钮
            toTop:false//添加商品是否添加在顶部
        };
    }

    componentDidMount() {
        Modal.destroyAll();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisible) {
            if(nextProps.showUpload!==undefined){
                this.setState({
                    showUpload:nextProps.showUpload
                })
            }
            this.setState({
                data:{},
                onlyOneStore:nextProps.onlyOneStore,
                selectedRows: !!nextProps?.selectedRows?[...nextProps.selectedRows]:[],
                selectedRowKeys: !!nextProps?.selectedRowKeys?[...nextProps?.selectedRowKeys]:[]
            },()=>{
                this.get_store_list();
            });
        }
    }

    componentWillUnmount() {
        Modal.destroyAll();

    }

  //获取数据列表
  get_store_list = (params) => {
     
      this.setState({ loading: true });
      const { dispatch } = this.props;
      const {search_data,onlyOneStore} = this.state;
      dispatch({
          type: 'project/get_own_store_list',
          payload: params,
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  let storeData = res.data.list
                  let storeArr = []
                  if(onlyOneStore){
                      storeData.forEach((item)=>{
                          if(item.storeId=='6'){
                              storeArr.push({
                                  key:item.storeId,
                                  name:item.storeName
                              })
                          }  
                      })
                  }else{
                      storeData.unshift({storeId:'',storeName:'全部',supplierTypes:[]})
                      storeData.forEach((item)=>{
                          storeArr.push({
                              key:item.storeId,
                              name:item.storeName
                          })
                      })
                  }
                  
                  search_data.forEach((item)=>{
                      if(item.name=='storeId'){
                          item.sel_data = storeArr
                      }
                  })
                  this.setState({
                      storeData: storeData,
                      search_data
                  });
              }
          }
      });
  };

  selectChange = (e)=>{
      const {storeData,search_data} = this.state
      const ele = storeData.find((el)=>el.storeId==e)
      let supplierTypes = []
      if(ele&&ele.supplierTypes.length>0){
          supplierTypes.push({
              key:ele.supplierTypes[0],
              name:ele.supplierTypes[0]
          })
      }
      search_data.forEach((item)=>{
          if(item.name=='supplierTypes'){
              item.sel_data = supplierTypes
          }
      })
      this.setState({
          search_data
      })
  }

  //获取数据列表 type 为2 代表是导入的
  get_list = (params,type=1) => {
      this.setState({ loading: true });
      if(type==2){this.setState({ uploading: true })}
      const { dispatch } = this.props;
      let { data } = this.state;
      let dis_type = '';
      let new_params = { ...params };
      dis_type = 'project/get_activity_goods_lists';
      dispatch({
          type: dis_type,
          payload: new_params,
          callback: (res) => {
              this.setState({ loading: false });
              if(type==2){this.setState({ uploading: false })}
              if (res.state == 200) {
                  if (res.data.pagination != undefined) {
                      if (res.data.pagination.current == 1) {
                          data = res.data;
                      } else {
                          data.list = data.list.concat(res.data.list);
                          data.pagination = res.data.pagination;
                      }
                  }
                  this.setState({
                      data: data
                  });
                  this.loading_pagination_flag = false;
                  if(type==2){this.loading_pagination_flag = true}
              }else{
                  failTip(res.msg)
              }
          }
      });
  };

  // 此函数与get_list为同一个请求接口,切片需要递归函数,为避免导入和搜索的判断,同时切片导入下父子关系存在分裂的可能,需要重组 此时不在复用get_list
  // sliceNum 首项0开始 sliceTotal 总切片数 resSliceTotal 结果数组
  get_list_upLoad = (params,sliceNum,sliceTotal,resSliceTotal) => {
      this.setState({ uploading: true });
      sliceNum==0 && message.success(`导入中...`);
      const { dispatch } = this.props;
      let { data } = this.state;
      let dis_type = '';
      const { productIdArr } = params;
      const ids = productIdArr.slice(sliceNum,sliceNum+step);
      let new_params = { pageSize:1000, pageIndex: 1,skus: ids,state:3 };
      dis_type = 'project/get_activity_goods_lists_byskulist';
      dispatch({
          type: dis_type,
          payload: new_params,
          callback: (res) => {
              if (res.state == 200) {
                  //   if (res.data.pagination != undefined) {
           
                  sliceNum = sliceNum+step;
                  sliceTotal = sliceTotal-1;
                  resSliceTotal = resSliceTotal.concat(res.data);
                  if( sliceTotal && (sliceTotal > 0) ){
                      this.get_list_upLoad(params,sliceNum,sliceTotal,resSliceTotal);
                  }else{
                      // 处理完毕
                      this.setState({ uploading: false });
                      this.loading_pagination_flag = true
                      //   resSliceTotal = this.mergeTree(resSliceTotal,'sku','productList');
                      //   console.log(resSliceTotal)
                      // 这里对返回数据进行处理 用于sku处理
                      //   let skuList = []
                      //   resSliceTotal.map((item)=>{
                      //     item.productList.map((el)=>{
                      //       el.storeName = item.storeName
                      //       el.goodsPrice = el.productPrice
                      //       el.mainImage = el.mainImageUrl
                      //     })
                      //     skuList = skuList.concat(item.productList)
                      //   })

                      // 核算数据
                      let errList = [];
                      if(productIdArr.length == resSliceTotal.length){
                          // 核算成功
                          data.list = resSliceTotal;
                          data.pagination = {current: 1,total:resSliceTotal.length};
                          this.setState({
                              data: data
                          },()=>{this.handleLeftAll()});
                      }else{
                          // 返回的数据丢失
                          productIdArr.forEach((item,index)=>{
                              if(resSliceTotal.findIndex(e=>e.sku==item)>-1){
                                  // todo
                              }else{
                                  errList.push(`请检查第${index+2}行商品${item},未匹配到数据`)
                              }
                          })
                          let that = this
                          confirm({
                              title: '以下商品未匹配到数据，是否确定继续导入?',
                              content: `${errList.join('\n')}`,
                              className:'comfirm_modal',
                              cancelText:'取消',
                              okText:'确定',
                              mask:false,
                              onOk(){
                                  data.list = resSliceTotal;
                                  data.pagination = {current: 1,total:resSliceTotal.length};
                                  that.setState({
                                      data: data
                                  },()=>{that.handleLeftAll()});
                              },
                              onCancel() {
                    
                              }
                          });
                
                      }

                      // data.list = skuList;
                      // data.pagination = res.data.pagination;
                      // this.setState({
                      //   data: data,
                      // },()=>{this.handleLeftAll()});
              
                  }
            
                  //   }
              }else{
                  this.setState({ uploading: false });
                  failTip(res.msg);
              }
          }
      });
  };

  // 合并树
  mergeTree = (arr,key,tarKey)=>{
      let hash = {};
      let resArr = [];
      arr.forEach((item)=>{
          if(hash[ item[key] ]){
              let i = resArr.findIndex( (el)=>el[key] == item[key] );
              resArr[i][tarKey] = resArr[i][tarKey].concat(item[tarKey]);
          }else{
              hash[ item[key] ] = true
              resArr.push(item)
          }
      })
      return resArr
  }

  //搜索事件
  search = (data) => {
      const { onlyOneStore } = this.props
      const {keyword,storeId,supplierTypes} = data
      let searchForm = {}
      let storeAndSupplierInfos = []
      if(onlyOneStore){
          storeAndSupplierInfos.push({
              storeId:6,
              supplierTypes:[]
          })
      }else{
          if(storeId==''){
              storeAndSupplierInfos = []
          }else{
              if(supplierTypes==''){
                  storeAndSupplierInfos.push({
                      storeId:storeId,
                      supplierTypes:[]
                  })
              }else{
                  storeAndSupplierInfos.push({
                      storeId:storeId,
                      supplierTypes:[supplierTypes]
                  })
              }
          }
      }
      
      searchForm.keyword = keyword
      searchForm.storeAndSupplierInfos = storeAndSupplierInfos
      console.log(searchForm);
      this.setState({
          formValues: searchForm,
          params: { pageSize: pageSize }
      });
      this.loading_pagination_flag =true
      setTimeout(() => {
          this.refs.scrollbars.scrollToTop()
          this.get_list({ pageSize: pageSize, ...searchForm ,pageIndex:1});
      }, 0);
  };

  //搜索重置事件
  seaReset = () => {
      let {data} = this.state
      data.list = []
      //搜索条件置为空
      this.setState({
          formValues: {
              data:data,
              storeAndSupplierInfos:[]
          },
          params: { pageSize: pageSize }
      });
      //   this.get_list({ pageSize: pageSize,pageIndex:1 });
  };

  //取消事件
  sldCancle = () => {
      this.setState({
          selectedRows: [],
          selectedRowKeys: [],//selectedRows的key
          params: { pageSize: pageSize }
      });
      this.props.sldHandleSeleMoreModalCancle();
  };

  sldConfirm = () => {
      let { selectedRows, selectedRowKeys } = this.state;
      if (selectedRowKeys.length > 0) {
          if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
              failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
              return false;
          }
          if (this.props.extra.total_num != undefined && this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
              failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}${sldComLanguage('个商品')}`);//该模块需要选择   个商品
              return false;
          }
          if (this.props.extra.max_num != undefined && this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
              failTip(`${sldComLanguage('该模块最多选择')}${this.props.extra.max_num}${sldComLanguage('个商品')}`);//该模块至少需要选择   个商品
              return false;
          }

          this.props.seleSvideo(selectedRows, selectedRowKeys);
          this.setState({
              selectedRows: [],
              selectedRowKeys: []
          });
      } else {
          failTip(`${sldComLanguage('请选择商品')}`);//请选择商品
      }
      this.setState({ params: { pageSize: pageSize } });
  };

  //关闭modal之后重置数据
  closeReset = () => {
      this.init_flag = true;
  };

  //滚动条滚动到底部事件
  handleScrollLeft = () => {

      let { data ,formValues} = this.state;
      // //当滚动到距离底部50px的时候请求分页
      // if (e.scrollTop < (height * (data.pagination.current * 1 - 1) + 50) && e.scrollTop > height * (data.pagination.current * 1 - 1)) {
      //
      // }
      //是否还有数据
      if (data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
      //请求分页数据
          this.loading_pagination_flag = true;
          this.get_list({ ...formValues,pageSize: pageSize, pageIndex: data.pagination.current * 1 + 1 });
      }
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
      let { selectedRows, selectedRowKeys,toTop } = this.state;
      let {onlyPartInfo} = this.props
      if (selectedRowKeys.indexOf(item.sku) == -1) {
          item.showPrice = item.salePrice
          
          if(toTop){
              selectedRowKeys.unshift(item.sku)
          }else{
              selectedRowKeys.push(item.sku);
          }
          if(onlyPartInfo){
              let newItem = {}
              newItem.sku = item.sku
              newItem.skuName = item.skuName
              newItem.showPrice = item.showPrice
              newItem.mainImage = item.mainImage
              if(toTop){
                  selectedRows.unshift(newItem)
              }else{
                  selectedRows.push(newItem);
              }
          }else{
              if(toTop){
                  selectedRows.unshift(item)
              }else{
                  selectedRows.push(item);
              }
          }
      }
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  handleLeftAll = () => {
      let { selectedRows, selectedRowKeys,data,toTop } = this.state;
      let {onlyPartInfo} = this.props
      if( data.list && Array.isArray(data.list) ){
          data.list.forEach((item,index)=>{
              if (selectedRowKeys.indexOf(item.sku) == -1) {
                  if(toTop){
                      selectedRowKeys.splice(index,0,item.sku);
                  }else{
                      selectedRowKeys.push(item.sku);
                  }
                  if(onlyPartInfo){
                      let newItem = {}
                      newItem.sku = item.sku
                      newItem.skuName = item.skuName
                      newItem.showPrice = item.salePrice
                      newItem.mainImage = item.mainImage
                      
                      if(toTop){
                          selectedRows.splice(index,0,newItem);
                      }else{
                          selectedRows.push(newItem);
                      }
                  }else{
                      if(toTop){
                          selectedRows.splice(index,0,item);
                      }else{
                          selectedRows.push(item);
                      }
                  }
              }
          })
          this.setState({
              selectedRowKeys,
              selectedRows
          });
      }
  };

  //右侧数据点击事件（移除选中数据，右侧将不显示，左侧的选中标识去掉）
  handleRightItem = (item) => {
      let { selectedRows, selectedRowKeys } = this.state;
      selectedRows = selectedRows.filter(items => items.sku != item.sku);
      selectedRowKeys = selectedRowKeys.filter(items => items != item.sku);
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  // 直接导模板
  downFile = () =>{
      downLoad_front('1')
  }

  beforeUploadFun = (file,fileList)=>{
      let that = this;
      //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
      fileList = fileList.slice(-1);
      const isExcle = file.name.split('.')[file.name.split('.').length-1] === 'xlsx';
      if (!isExcle) {
          message.error('请按模板上传xlsx文件!');
          return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
          message.error('上传文件需小于10MB!');
          return false
      }
      var rABS = true;
      const f = fileList[0];
      var reader = new FileReader();
      reader.onload = function(e){
          var data = e.target.result;
          if (!rABS) {data = new Uint8Array(data);}
          var workbook = XLSX.read(data, {
              type: rABS ? 'binary' : 'array'
          });
          // 假设我们的数据在第一个标签
          var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // XLSX自带了一个工具把导入的数据转成json
          var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
          // 通过自定义的方法处理Json，比如加入state来展示
          that.handleImpotedJson(jsonArr);
      };
      if (rABS) {reader.readAsBinaryString(f);} else {reader.readAsArrayBuffer(f);}
      return false;
  }

    switchtoTop = (type)=>{
        let { toTop } = this.state;
        toTop = type;
        this.setState({toTop});
    }

  handleImpotedJson = (jsonData)=>{
      try {
          if(!!jsonData.length && jsonData.length > 0){
              // 整合商品详情的入参
              let skuList = [];
              for(let index = 0; index < jsonData.length; index++) {
                  const ele = jsonData[index];
                  if(Array.isArray(ele)&&ele.length>0){
                      if(index==0){
                          if(ele[0]=='sku'){
                              // todo
                          }else{
                              message.error('sku项错误,请按格式重新上传!');
                              return false
                          }
                      }else if( ele[0] && ((/^[A-Za-z0-9_-]+$/.test( ele[0] ))) ){
                          if(skuList.indexOf(String(ele[0]))>-1){
                              message.error(`sku重复,请检查第${index+1}行数据`);
                              return false
                          }
                          skuList.push(String(ele[0]));
                      }else{
                          message.error(`解析失败,请检查第${index+1}行数据`);
                      }
                  }
              }
              if(skuList.length>0){
                  if(skuList.length>step){
                      //这里需要切片
                      const sliceTotal = Math.ceil(skuList.length / step)
                      this.get_list_upLoad({ pageSize:1000, current: 1,productIdArr:skuList},0,sliceTotal,[]);
                  }else{
                      this.get_list_upLoad({ pageSize:1000, current: 1,productIdArr:skuList},0,0,[]);
                  }
              }else{
                  message.error(`请导入数据!`);
              }

          }else{
              message.error('解析失败,请按格式上传!');
          }
      
      } catch (error) {
          message.error('解析失败,请按格式上传!');
      }
  }

  // eslint-disable-next-line react/sort-comp
  upProps = {
      name: 'file', //发到后台的文件参数名
      // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
      headers: { Authorization: 'SID' }, // 
      showUploadList: false,
      beforeUpload: this.beforeUploadFun
  }

  render() {
      const { modalVisible, width, title, height } = this.props;
      const { selectedRows, search_data, data, selectedRowKeys,uploading,showUpload,toTop } = this.state;
      // let { form: { getFieldDecorator } } = this.props;
      return (
          <Modal
              destroyOnClose
              onOk={this.sldConfirm}
              afterClose={this.closeReset}
              onCancel={this.sldCancle}
              visible={modalVisible}
              width={width}
              title={title}
          >
              <div className={`${styles.component_sele_more} ${global.flex_column_start_start}`}>
                  <div className={global.tableListForm}>
                      <div style={{ position: 'relative' }}>
                          <Search
                              search_data={search_data}
                              top={0}
                              seaSubmit={(datas) => this.search(datas)}
                              seaReset={() => this.seaReset()}
                          />
                      </div>
                      {
                          showUpload && 
                        <div>
                            <Button onClick={()=>{this.downFile()}} style={{marginRight:'10px'}}>下载模板</Button>
                            <Upload {...this.upProps} disabled={uploading}>
                                <Button loading={uploading}>点击上传</Button>
                            </Upload>
                            <span style={{marginLeft:'10px'}}>是否添加到顶部：</span>
                            <Switch
                                onChange={(checked) => this.switchtoTop(checked)}
                                checked={toTop}
                                valuepropname="checked"
                            ></Switch>
                        </div>
                      }
                  </div>
                  <div className={`${styles.content} ${global.flex_row_start_start}`} style={{ height: height }}>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              onScrollFrame={(e) => this.handleScrollLeft(e)}
                              ref='scrollbars'
                              style={{ width: 438, zIndex: 1 }}
                          >
                              <div className={`${styles.left} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {data.list != undefined && data.list.length > 0 &&
                                    data.list.map((item, index) => <a
                                        key={index}
                                        href="javascript:void(0)"
                                        className={`${styles.item} ${global.flex_row_start_start}`}
                                        onClick={() => this.handleLeftItem(item)}
                                        style={{ marginBottom: index == data.list.length - 1 ? 10 : 0 }}
                                    >
                                        <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                                            <img className={styles.live_img} src={item.mainImage} />
                                        </div>
                                        <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                                            <span className={`${styles.svideo_name}`}>{item.skuName}</span>
                                            <Tooltip title={item.specValues}>
                                                <span className={`${styles.spec_name}`}>{item.specValues}</span>
                                            </Tooltip>
                                            <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.showPrice||item.salePrice}</span>
                                            {selectedRowKeys.indexOf(item.sku) > -1 &&
                                            <div className={`${styles.sele_svideo_flag}`}>
                                                <ALibbSvg fill="#FC701E" width={19} height={19} type="yixuan" />
                                            </div>
                                            }
                                        </div>
                                    </a>)
                                  }
                                  {data.list == undefined||data.list.length ==0 &&
                                        <div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        </div>
                                  }
                              </div>
                          </Scrollbars>
                      </div>
                      <div className={`${styles.center} ${global.flex_row_center_center}`} onClick={() => this.handleLeftAll()}>
                          <ALibbSvg fill="#ff711e" width={39} height={32} type="move-up1" />
                      </div>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              style={{ width: 438, zIndex: 1 }}
                          >
                              <div className={`${styles.right} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {selectedRows.length > 0 ?
                                      selectedRows.map((item, index) => <a
                                          key={index}
                                          href="javascript:void(0)"
                                          className={`${styles.item} ${global.flex_row_start_start}`}
                                          onClick={() => this.handleRightItem(item)}
                                          style={{ marginBottom: index == selectedRows.length - 1 ? 10 : 0 }}
                                      >
                                          <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                                              <img className={styles.live_img} src={item.mainImage} />
                                          </div>
                                          <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                                              <span className={`${styles.svideo_name}`}>{item.skuName}</span>
                                              <Tooltip title={item.specValues}>
                                                  <span className={`${styles.spec_name}`}>{item.specValues}</span>
                                              </Tooltip>
                                              <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.showPrice||item.salePrice}</span>
                                              <div className={`${styles.sele_svideo_flag}`}>
                                                  <ALibbSvg fill="#FC701E" width={19} height={19} type="ziyuan21" />
                                              </div>
                                          </div>
                                      </a>)
                                      :<div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('您还未选择数据')}`} />
                                      </div>
                                  }
                              </div>
                          </Scrollbars>
                      </div>
                  </div>
              </div>
          </Modal>
      );
  }
}
