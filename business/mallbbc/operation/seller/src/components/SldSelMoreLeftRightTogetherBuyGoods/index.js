/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于选择一起买的商品
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Empty,
    Form, Modal,Tooltip,Input,Cascader,Spin 
} from 'antd';
import {
    failTip,
    list_com_page_size_16,
    sldComLanguage,
    getStorage,
    isEmpty
} from '@/utils/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import ALibbSvg from '../ALibbSvg';

import global from '@/global.less';
import styles from './index.less';

const { Search } = Input;
const storeId = getStorage('storeId');
let pageSize = list_com_page_size_16;

@connect(({ pc_home, project }) => ({
    pc_home,
    project
}))
@Form.create()
export default class SldSelMoreLeftRightSeckillGoods extends Component {
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
	        title: '',
	        params: { pageSize: pageSize },//搜索条件
	        formValues: {}, //搜索条件 keyword
            options:[], // 场次下拉数据
            stageInfo:{}, // 选中的场次信息 
            activityStateList:[],
            activityStateLoading:false
	    };
    }


    componentDidMount() {
        let id = window.location.href.split('?')[1].split('=')[1]
        this.buyTogetherStageList(id)
    }

    componentWillReceiveProps(nextProps) {
	    if (nextProps.modalVisible) {
	        // this.get_list({ pageSize: pageSize });
	        this.setState({
	            selectedRows: [...nextProps.selectedRows],
	            selectedRowKeys: [...nextProps.selectedRowKeys],
                stageInfo:{},
                data:{}
	        });
	    }
    }

    componentWillUnmount() {

    }

  //获取数据列表
  get_list = (params) => {
      const { stageInfo:{stageId} } = this.state
      if(isEmpty(stageId)){
          failTip('请选择场次信息');
          return false; 
      }
      this.setState({ loading: true });
      const { dispatch } = this.props;
      let { data,formValues,activityStateList } = this.state;
      let dis_type = '';
      let new_params = {...formValues, ...params,storeId,pageIndex:params.current||1 };
      dis_type = 'project/get_search_by_keyword';
      dispatch({
          type: dis_type,
          payload: new_params,
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  // 为数据加上选择的该日期下是否有其他活动标识
                  res.data.list.forEach((item)=>{
                      if(activityStateList.includes(item.sku)){
                          item.activityState = 2
                      }else{
                          item.activityState = 1
                      }
                  })
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
              }
          }
      });
  };

  //根据日期获取以参加活动的sku集合
  hasActivityByDate = (dateList) => new Promise(() =>{
      const { dispatch } = this.props;
      this.setState({
          activityStateLoading:true
      })
      dispatch({
          type: 'project/get_productState_list',
          payload: {
              dateList
          },
          callback: (res) => {
              if (res.state == 200) {
                  const {skuInfos} = res.data
                  this.setState({
                      activityStateLoading:false,
                      activityStateList:skuInfos[0].skus||[]
                  })
              } else {
                  failTip(res.msg)
              }
          }
      })
  });

  //获取场次下拉信息列表 只展示可以参加的场次，过去的场次不展示 
  buyTogetherStageList = (id) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'project/get_buyTogether_stage',
          payload: { promotionId: id,states:[1] },
          callback: (res) => {
              if (res.state == 200) {
                  let _options = []
                  res.data.buyTogetherStageGroupList.forEach((item)=>{
                      const {stageDate} = item
                      let dateInfo = {
                          label:stageDate,
                          value:stageDate
                      }
                      let stageList = []
                      item.buyTogetherStageVOList.forEach((el)=>{
                          stageList.push({
                              label:el.stageContent,
                              value:el.stageId,
                              startTime:el.startTime,
                              endTime:el.endTime
                          })
                      })
                      dateInfo.children = stageList
                      _options.push(dateInfo)
                  })
                 
                  this.setState({
                      options:_options
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //搜索事件
  search = (value) => {
      this.setState({
          formValues: {keyword:value},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize,keyword:value });
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
      let { selectedRows, selectedRowKeys,stageInfo } = this.state;
      const {activityDate,activitySession,stageId,startTime,endTime} = stageInfo
      if (selectedRowKeys.length > 0) {
          if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
              failTip(`${sldComLanguage('该模块至少需要选择')}${this.props.extra.min_num}${sldComLanguage('个商品')}`);
              return false;
          }
          if (this.props.extra.total_num != undefined && this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
              failTip(`${sldComLanguage('该模块需要选择')}${this.props.extra.total_num}${sldComLanguage('个商品')}`);//该模块需要选择   个商品
              return false;
          }
          if (this.props.extra.max_num != undefined && this.props.extra.max_num > 0 && selectedRowKeys.length > this.props.extra.max_num) {
              failTip(`${sldComLanguage('该模块最多选择')}${this.props.extra.max_num}${sldComLanguage('个商品')}`);
              return false;
          }
          if(isEmpty(stageId)){
              failTip('请选择场次信息');
              return false;
          }
          selectedRows.forEach((item)=>{
              item.activityDate = activityDate
              item.activitySession = activitySession
              item.stageId = stageId
              item.startTime = startTime
              item.endTime = endTime
              item.withKey = `${activityDate}_${activitySession}_${item.sku}`
          })

          this.props.seleSvideo(selectedRows, selectedRowKeys,activityDate);
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
      let { data } = this.state;
      //当滚动到距离底部50px的时候请求分页
      // if (e.scrollTop < (height * (data.pagination.current * 1 - 1) + 50) && e.scrollTop > height * (data.pagination.current * 1 - 1)) {
      //
      // }
      //是否还有数据
      if (data.pagination && data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
      //请求分页数据
          this.loading_pagination_flag = true;
          this.get_list({ pageSize: pageSize, current: data.pagination.current * 1 + 1 });
      }
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
      if(item.activityState==1){
          let { selectedRows, selectedRowKeys } = this.state;
          if (selectedRowKeys.indexOf(item.sku) == -1) {
              selectedRowKeys.push(item.sku);
              selectedRows.push(item);
          }
          this.setState({
              selectedRowKeys,
              selectedRows
          });
      }
  };

  // 左边全选到右边
  handleLeftAll = () => {
      let { selectedRows, selectedRowKeys,data } = this.state;
      if(data.list && Array.isArray(data.list)){
          data.list.forEach((item)=>{
              if (selectedRowKeys.indexOf(item.sku) == -1 && item.activityState==1) {
                  selectedRowKeys.push(item.sku);
                  selectedRows.push(item);
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
 
  // 动了场次所有的值清空
  onChange = (value,selectedOptions)=>{
      console.log(value,selectedOptions)
      if(value.length==0){
          this.setState({
              stageInfo:{},
              selectedRows: [],
              selectedRowKeys: [],
              data: {}
          })
          return 
      }
      const [activityDate,stageId] = value
      const [,{label,startTime,endTime}] = selectedOptions
      let obj = {
          activityDate,
          activitySession:label,
          stageId,
          startTime,
          endTime
      }
      this.hasActivityByDate([activityDate])
      this.setState({
          stageInfo:obj,
          selectedRows: [],
          selectedRowKeys: [],
          data: {}
      })
  }

  render() {
      const { modalVisible, width, title, height } = this.props;
      const { selectedRows, data, selectedRowKeys,options,activityStateLoading } = this.state;
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
              <Spin spinning={activityStateLoading}>
                  <div className={`${styles.component_sele_more} ${global.flex_column_start_start}`}>
                      <div className={`${styles['stage_content']}`}>
                          <span className={`${styles['attention']}`}>*</span>
                          <span className={`${styles['lable']}`}>活动场次</span>
                          <Cascader
                              options={options}
                              onChange={this.onChange}
                              placeholder="请选择"
                              displayRender={label => `${label.join(' ') }${label.length==0?'':'场次'}`}
                          /><span style={{marginLeft:'6px',color:'#FF711E'}}>请先选择场次信息</span>
                      </div>
                
                      <div className={`${styles.content} ${global.flex_row_start_start}`} style={{ height: height+48 }}>
                          <div style={{ height: height+48, background: '#f5f5f5' }}>
                              <div className={`${styles['goods_head']}`}>
                                  <Search
                                      placeholder="请输入商品名称"
                                      onSearch={(value) => this.search(value)}
                                      style={{ width: 240 }}
                                      enterButton
                                  />
                              </div>
                              <Scrollbars
                                  onScrollFrame={(e) => this.handleScrollLeft(e)}
                                  style={{ width: 438, zIndex: 1,height: height }}
                              >
                                  <div 
                                      className={`${styles.left} ${global.flex_row_start_start}`} 
                                      style={{ height: height }}
                                  >
                                      {
                                          data.list != undefined && data.list.length > 0 &&
                                        data.list.map((item, index) =>(
                                            <a
                                                key={index}
                                                href="javascript:void(0)"
                                                className={`${styles.item} ${global.flex_row_start_start}`}
                                                onClick={() => this.handleLeftItem(item)}
                                                style={{ marginBottom: index == data.list.length - 1 ? 10 : 0 }}
                                            >
                                                {
                                                    item.activityState==2 &&
                                                <div className={`${styles.mask} ${global.flex_row_center_center}`}>
                                                    {sldComLanguage('已参加其他活动')}
                                                </div>
                                                }
                                                <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                                                    <img className={styles.live_img} src={item.mainImage} />
                                                </div>
                                                <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                                                    <Tooltip title={item.skuName}>
                                                        <span className={`${styles.svideo_name}`}>{item.skuName}</span>
                                                    </Tooltip>
                                                    <Tooltip title={item.specValues}>
                                                        <span className={`${styles.spec_name}`}>{item.specValues||'--'}</span>
                                                    </Tooltip>
                                                    <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.salePrice}</span>
                                                    {
                                                        selectedRowKeys.indexOf(item.sku) > -1 &&
                                                <div className={`${styles.sele_svideo_flag}`}>
                                                    <ALibbSvg fill="#FF711E" width={19} height={19} type="yixuan" />
                                                </div>
                                                    }
                                                </div>
                                            </a>
                                        ))
                                      }
                                      {
                                          data.list == undefined||data.list.length ==0 &&
                                        <div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                        </div>
                                      }
                                  </div>
                              </Scrollbars>
                          </div>
                          <div className={`${styles.center} ${global.flex_row_center_center}`} onClick={() => this.handleLeftAll()}>
                              <ALibbSvg fill="#FF711E" width={39} height={32} type="move-up1" />
                          </div>
                          <div style={{ height: height+48, background: '#f5f5f5' }}>
                              <div className={`${styles['goods_head']}`}>
                                  <span className={`${styles['goods_head_select']}`}>已选{selectedRows.length}件商品</span>
                                  <span className={`${styles['goods_head_tips']}`}>至少选择1件商品</span>
                              </div>
                              <Scrollbars
                                  style={{ width: 438, zIndex: 1,height: height }}
                              >
                                  <div className={`${styles.right} ${global.flex_row_start_start}`} style={{ height: height }}>
                                      {
                                          selectedRows.length > 0 ?
                                              selectedRows.map((item, index) =>( 
                                                  <a
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
                                                          <Tooltip title={item.skuName}>
                                                              <span className={`${styles.svideo_name}`}>{item.skuName}</span>
                                                          </Tooltip>
                                                          <Tooltip title={item.specValues}>
                                                              <span className={`${styles.spec_name}`}>{item.specValues||'--'}</span>
                                                          </Tooltip>
                                                          <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.salePrice}</span>
                                                          <div className={`${styles.sele_svideo_flag}`}>
                                                              <ALibbSvg fill="#FF711E" width={19} height={19} type="ziyuan21" />
                                                          </div>
                                                      </div>
                                                  </a>))
                                              :
                                              <div className={global.flex_column_center_center} style={{width:'100%',height:'100%'}}>
                                                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={`${sldComLanguage('您还未选择数据')}`} />
                                              </div>
                                      }
                                  </div>
                              </Scrollbars>
                          </div>
                      </div>
                  </div>
              </Spin>
          </Modal>
      );
  }
}
