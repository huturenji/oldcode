/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于选择店铺商品到推手商品里
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Form, Modal, InputNumber, Select
} from 'antd';
import {
    failTip,
    list_com_page_size_16,
    sldComLanguage
} from '@/utils/utils';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';
import Search from '@/components/Search/Search';
import ALibbSvg from '../ALibbSvg';

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
          label_data: [],//推手商品标签列表
          selectedRows: [],
          selectedRowKeys: [],//selectedRows的key
          modalVisible: false,
          loading: false,
          data: {},
          title: '',
          params: { pageSize: pageSize },//搜索条件
          search_data: [{
              type: 'input',
              label: `${sldComLanguage('商品名称')}`,
              name: 'goodsName',
              placeholder: `${sldComLanguage('请输入商品名称')}`
          }
          ],
          formValues: {}//搜索条件
      };
  }


  componentDidMount() {
      this.get_label_list();
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.modalVisible) {
          this.get_list({ pageSize: pageSize });
          this.setState({
              selectedRows: [...nextProps.selectedRows],
              selectedRowKeys: [...nextProps.selectedRowKeys]
          });
      }
  }

  componentWillUnmount() {

  }

  //获取标签列表
  get_label_list = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'project/get_spreader_goods_label_lists',
          callback: (res) => {
              if (res.state == 200) {
                  if(res.data.length == 0){
                      failTip(sldComLanguage('平台后台未添加商品标签，无法导入商品'))
                  }
                  this.setState({
                      label_data: res.data
                  });
              }
          }
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      let { data } = this.state;
      let dis_type = '';
      let new_params = { ...params };
      dis_type = 'project/get_goods_list_to_import_spreader';
      // dis_type = 'project/get_seckill_goods_lists';
      dispatch({
          type: dis_type,
          payload: new_params,
          callback: (res) => {
              this.setState({ loading: false });
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
              }
          }
      });
  };

  //搜索事件
  search = (data) => {
      this.setState({
          formValues: data,
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, ...data });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize });
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
      let { data } = this.state;
      //当滚动到距离底部50px的时候请求分页
      // if (e.scrollTop < (height * (data.pagination.current * 1 - 1) + 50) && e.scrollTop > height * (data.pagination.current * 1 - 1)) {
      //
      // }
      //是否还有数据
      if (data.pagination.current * pageSize < data.pagination.total && !this.loading_pagination_flag) {
      //请求分页数据
          this.loading_pagination_flag = true;
          this.get_list({ pageSize: pageSize, current: data.pagination.current * 1 + 1 });
      }
  };

  //左侧数据点击事件（将选中的数据添加到右侧，左侧添加选中标识）
  handleLeftItem = (item) => {
      let { selectedRows, selectedRowKeys,label_data } = this.state;
      if(label_data.length == 0){
          failTip(sldComLanguage('平台未添加商品标签，无法选择商品'))
      }
      if (selectedRowKeys.indexOf(item.goodsId) == -1) {
          item.commission = 0.01;
          item.labelId = label_data[0].labelId;
          item.labelName = label_data[0].labelName;
          selectedRowKeys.push(item.goodsId);
          selectedRows.push(item);
          this.setState({
              selectedRowKeys,
              selectedRows
          });
      }
  };

  //右侧数据点击事件（移除选中数据，右侧将不显示，左侧的选中标识去掉）
  handleRightItem = (item) => {
      let { selectedRows, selectedRowKeys } = this.state;
      selectedRows = selectedRows.filter(items => items.goodsId != item.goodsId);
      selectedRowKeys = selectedRowKeys.filter(items => items != item.goodsId);
      this.setState({
          selectedRowKeys,
          selectedRows
      });
  };

  handleCommission = (e,goodsId) => {
      let { selectedRows } = this.state;
      let target = selectedRows.filter(items => items.goodsId == goodsId)[0];
      target.commission = e;
      this.setState({
          selectedRows
      });
  }

  handleLabel = (e,goodsId) => {
      let { selectedRows,label_data } = this.state;
      let target = selectedRows.filter(items => items.goodsId == goodsId)[0];
      target.labelId = e;
      let tar_label_data = label_data.filter(item=>item.labelId == e)[0];
      target.labelName = tar_label_data.labelName;
      this.setState({
          selectedRows
      });
  }

  render() {
      const { modalVisible, width, title, height } = this.props;
      const { selectedRows, search_data, data, selectedRowKeys,label_data } = this.state;
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
                              seaSubmit={(data1) => this.search(data1)}
                              seaReset={() => this.seaReset()}
                          />
                      </div>
                  </div>
                  <div className={`${styles.content} ${global.flex_row_start_start}`} style={{ height: height }}>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              onScrollFrame={(e) => this.handleScrollLeft(e)}
                              style={{ width: 438, zIndex: 1 }}
                          >
                              <div className={`${styles.left} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {data.list != undefined && data.list.length > 0 &&
                  data.list.map((item, index) => <div
                      key={index}
                      className={`${styles.item} ${global.flex_row_start_start}`}
                      onClick={() => this.handleLeftItem(item)}
                      style={{ marginBottom: index == data.list.length - 1 ? 10 : 0 }}
                  >
                      <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                          <img className={styles.live_img} src={item.mainImage} />
                          <span className={`${styles.storage} ${global.flex_row_center_center}`}>{sldComLanguage('库存')}{item.goodsStock}</span>
                      </div>
                      <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                          <span className={`${styles.svideo_name}`}>{item.goodsName}</span>
                          <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.goodsPrice}</span>
                          {selectedRowKeys.indexOf(item.goodsId) > -1 &&
                        <div className={`${styles.sele_svideo_flag}`}>
                            <ALibbSvg fill="#FF711E" width={19} height={19} type="xuanzhongshangpin" />
                        </div>
                          }
                      </div>
                  </div>)
                                  }
                              </div>
                          </Scrollbars>
                      </div>
                      <div className={`${styles.center} ${global.flex_row_center_center}`}>
                          <ALibbSvg fill="#fff6f4" width={39} height={32} type="move-up1" />
                      </div>
                      <div style={{ height: height, background: '#f5f5f5' }}>
                          <Scrollbars
                              style={{ width: 438, zIndex: 1 }}
                          >
                              <div className={`${styles.right} ${global.flex_row_start_start}`} style={{ height: height }}>
                                  {selectedRows.length > 0 &&
                  selectedRows.map((item, index) => <div
                      key={index}
                      className={`${styles.right_item_wrap} ${global.flex_column_start_start}`}
                      style={{ marginBottom: index == selectedRows.length - 1 ? 10 : 0 }}
                  >
                      <div
                          className={`${styles.item} ${global.flex_row_start_start}`}
                          onClick={() => this.handleRightItem(item)}
                      >
                          <div className={`${styles.item_left} ${global.flex_row_center_center}`}>
                              <img className={styles.live_img} src={item.mainImage} />
                          </div>
                          <div className={`${styles.item_right} ${global.flex_column_start_start}`}>
                              <span className={`${styles.svideo_name}`}>{item.goodsName}</span>
                              <span className={`${styles.svideo_label}`}>{sldComLanguage('¥')}{item.goodsPrice}</span>
                              <div className={`${styles.sele_svideo_flag}`}>
                                  <ALibbSvg fill="#FF711E" width={19} height={19} type="shanchushangpin" />
                              </div>
                          </div>
                      </div>
                      <div className={`${styles.spreader_goods_info} ${global.flex_row_between_center}`}>
                          <div className={`${styles.spreader_goods_info_left} ${global.flex_row_start_center}`}>
                              <span className={styles.must}>*</span>
                              {/*<span className={styles.commission_tip}>佣金</span>*/}
                              <InputNumber
                                  value={item.commission!=undefined&&item.commission?item.commission:0.01}
                                  placeholder="佣金"
                                  min={0.01}
                                  max={item.goodsPrice*1}
                                  precision={2}
                                  onChange={e => this.handleCommission(e, item.goodsId)}
                              />
                          </div>
                          <div className={`${styles.spreader_goods_info_left} ${styles.spreader_goods_info_right} ${global.flex_row_start_center}`}>
                              <span className={styles.must}>*</span>
                              {/*<span className={styles.commission_tip}>标签</span>*/}
                              <Select
                                  value={item.labelId!=undefined&&item.labelId?item.labelId:label_data[0].labelId}
                                  placeholder="标签"
                                  onChange={(e) => this.handleLabel(e,item.goodsId)}
                                  getPopupContainer={triggerNode => triggerNode.parentNode}
                              >
                                  {label_data.map((item1, index1) => <Select.Option key={index1} value={item1.labelId}>{item1.labelName}</Select.Option>)}
                              </Select>
                          </div>
                      </div>
                  </div>)
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
