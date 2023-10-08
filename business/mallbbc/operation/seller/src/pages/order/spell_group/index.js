import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Radio, Empty, Pagination } from 'antd';
import Link from 'umi/link';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    sldComLanguage,
    dateFormat,
    sldLlineRtextAddGoods,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import order from './order.less';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


let pageSize = list_com_page_size_10;

// eslint-disable-next-line no-shadow
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class AllSpellGroupOrderLists extends Component {
    filter_data = [
        { filter_code: '', filter_name: `${sldComLanguage('全部订单')}` },
        { filter_code: '1', filter_name: `${sldComLanguage('拼团中')}` },
        { filter_code: '2', filter_name: `${sldComLanguage('拼团成功')}` },
        { filter_code: '3', filter_name: `${sldComLanguage('拼团失败')}` }
    ];

    //订单过滤器
    constructor(props) {
        super(props);
        this.state = {
            query: props.location.query,
            search_height: 0,
            filter_code: '',//过滤器默认值
            loading: false,
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            curData: {},//编辑的数据
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'spellName',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('活动名称')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('订单号')}`,
                name: 'orderSn',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('订单号')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('会员名称')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名称')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'goodsName',
                placeholder: `${sldComLanguage('请输入商品名称')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('开团时间')}`,
                name: 'search_spell_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('下单时间')}`,
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }
            ],
            formValues: {},//搜索条件
            operateData: [], //弹框操作数据
            modalVisible: false,
            modalTitle: '',
            submiting: false,
            show_foot: true,
            modal_width: 700,
            modalItem: {},
            demodalVisible: false,
            expressList: [],
            deliverType: '',
            resList: [] // 取消原因数据
        };
    }


    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.resize();
        window.addEventListener('resize', this.resize, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () => {
      const { search_height } = this.state;
      if (this.refs.search_part != undefined) {
          if (this.refs.search_part.clientHeight != search_height) {
              this.setState({ search_height: this.refs.search_part.clientHeight });
          }
      }
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'order/get_spell_group_order_list',
          payload: { ...params, spellId: this.state.query.id },
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  if (params.current > 1 && res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
              }else{
                  this.setState({
                      data: {
                          list:[],
                          pagination:{
                              current:1,
                              pageSize:10,
                              total:0
                          }
                      }
                  });
              }
          }
      });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      const { filter_code } = this.state;
      //开团时间处理
      if (values.search_spell_time) {
          values.spellStartTime = values.search_spell_time[0] ? `${values.search_spell_time[0].format(dateFormat) } 00:00:00` : '';
          values.spellEndTime = values.search_spell_time[1] ? `${values.search_spell_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_spell_time = '';
      }

      //下单时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_create_time = '';
      }
      if (filter_code) {
          values.state = filter_code;
      }
      for (let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize, ...values });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          filter_code: '',
          data: {},
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //订单条件过滤器
  clickFilter = (e) => {
      //搜索条件置为空
      this.setState({
          filter_code: e.target.value
      });
      const { formValues } = this.state;
      let param = { pageSize: pageSize, current: 1 };
      if (e.target.value) {
          param.state = e.target.value;
      }
      this.get_list({ ...param, ...formValues });
  };

  //改变每页的数量
  onShowSizeChange = (current, pageSizeNew) => {
      let { params } = this.state;
      params.pageSize = pageSizeNew;
      this.setState({ params });
  };

  //改变页码
  // eslint-disable-next-line no-shadow
  onPageChange = (page, pageSize) => {
      const { formValues, filter_code } = this.state;
      let curParams = { pageSize: pageSize, current: page, ...formValues };
      if (filter_code) {
          curParams.state = filter_code;
      }
      this.get_list(curParams);
  };

  render() {
      const { search_data, data, loading, filter_code, params, search_height } = this.state;
      return (
          <div
              className={`${global.common_page}`}
              style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
          >
              <AuthBtn btnAuth={btnAuth} eventKey={["spell_group_order_lists_view"]} showPage>
                  <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                      {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('订单管理')}`)}
                  </div>
                  <div style={{ position: 'relative' }}>
                      <div className={global.tableListForm} ref="search_part">
                          <Search
                              search_data={search_data}
                              seaSubmit={(datas) => this.search(datas)}
                              seaReset={() => this.seaReset()}
                          />
                      </div>
                      {/*筛选器-start*/}
                      <div style={{ marginBottom: 10 }}>
                          <RadioGroup value={filter_code} size="small" onChange={this.clickFilter}>
                              {this.filter_data.map((item, index) => <RadioButton
                                  key={index + 1}
                                  value={item.filter_code}
                              >{item.filter_name}</RadioButton>)}
                          </RadioGroup>
                      </div>
                      <Spin spinning={loading}>
                          {/*标准表格-start*/}
                          <div className={order.order_list}>
                              <ul className={order.header}>
                                  <li className={`${order.width_15} ${order.center}`}>拼团商品</li>
                                  <li className={`${order.width_35} ${order.pl_100}`}>多人拼团</li>
                                  <li className={`${order.width_10} ${order.center}`}>单价(元)</li>
                                  <li className={`${order.width_10} ${order.center}`}>数量</li>
                                  <li className={`${order.width_10} ${order.center}`}>订单金额</li>
                                  <li className={`${order.width_10} ${order.center}`}>订单状态</li>
                                  <li className={`${order.width_10} ${order.center}`}>操作</li>
                              </ul>
                              <div className={order.order_content}>
                                  {data.list != undefined && data.list.length == 0 &&
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  }
                                  <Scrollbars
                                      autoHeight
                                      autoHeightMax={document.body.clientHeight - 272 - search_height}
                                  >
                                      {data.list != undefined && data.list.length > 0 && data.list.map((item, index) => <div className={order.item} key={index}>
                                          <div className={`${order.order_info_num} ${global.flex_row_between_center}`}>
                                              <div className={`${order.left} ${global.flex_row_start_center}`}>
                                                  <div className={`${order.left_activity_info} ${global.flex_row_start_center}`}>
                                                      <img
                                                          className={`${order.activity_icon}`}
                                                          src={require('@/assets/sld_spell_group_order_item_icon.png')}
                                                      />
                                                      <span
                                                          className={`${order.num} ${order.activity_name}`}
                                                          title={item.spellName}
                                                      >{item.spellName}</span>
                                                  </div>
                                                  <div className={`${order.spell_group_num} ${global.flex_row_start_center}`}>
                                                      <img src={require('@/assets/spell_group_icon.png')} />
                                                      <span>{item.requiredNum}{sldComLanguage('人团')}（{item.stateValue}）</span>
                                                  </div>
                                                  <div className={order.spell_state}><span
                                                      className={order.spell_state_val}
                                                  >{item.finishType == 2 &&
                              <span className={order.simulate_group}>{item.finishTypeValue}</span>}</span></div>
                                              </div>
                                              <div className={`${order.right} ${global.flex_row_end_center}`}>
                                                  <span
                                                      className={order.spell_time}
                                                  >{sldComLanguage('开团时间')}：{item.createTime} ～ {item.endTime}</span>
                                              </div>
                                          </div>

                                          <div
                                              className={`${global.flex_row_start_start}`}
                                              style={{ width: '100%', alignItems: 'stretch' }}
                                          >
                                              <div
                                                  className={`${order.spell_group_goods} ${global.flex_column_center_center}`}
                                                  style={{ width: '15%', padding: '15px 0' }}
                                              >
                                                  <div className={`${order.left} ${global.flex_column_center_center}`}>
                                                      <div className={`${order.goods_img_wrap} ${global.flex_row_center_center}`}>
                                                          <img src={item.goodsImage} />
                                                      </div>
                                                      <span className={`${order.goods_name} `} title={item.goodsName}>{item.goodsName}</span>
                                                  </div>
                                              </div>

                                              <div className={`${global.flex_column_start_start}`} style={{ width: '85%' }}>
                                                  {item.memberList && item.memberList.length > 0 && item.memberList.map((child, child_index) => <div
                                                      key={child_index}
                                                      className={`${order.order_goods_part} ${global.flex_row_start_center}`}
                                                  >
                                                      <div
                                                          className={`${order.goods} ${global.flex_column_start_start} ${order.width_70} ${item.orderProductListVOList != undefined && item.orderProductListVOList.length > 1 ? order.goods_split : null}`}
                                                          style={{ padding: '10px 5px', width: '64.71%' }}
                                                      >
                                                          <div
                                                              className={`${order.goods_item} ${global.flex_row_start_center}`}
                                                              style={{ width: '100%' }}
                                                          >

                                                              <div
                                                                  className={`${global.flex_column_between_start}`}
                                                                  style={{ width: '63.64%', overflow: 'hidden' }}
                                                              >
                                                                  <div className={`${global.flex_row_start_center}`}>
                                                                      <div className={`${order.goods_img_wrap} ${global.flex_row_center_center}`}>
                                                                          <div
                                                                              className={order.member_avatar}
                                                                              style={{ backgroundImage: `url(${ child.memberAvatar })` }}
                                                                          />
                                                                          {child.isLeader
                                                                              ? <span className={order.spell_leader_flag}>{sldComLanguage('团长')}</span>
                                                                              : null
                                                                          }
                                                                      </div>
                                                                      <div className={`${order.goods_info} ${global.flex_column_start_start}`}>
                                                                          <span className={`${order.member_name}`}>{child.memberName}</span>
                                                                          <span
                                                                              className={`${order.goods_spec}`}
                                                                              title={child.specValues}
                                                                          >{child.specValues}</span>
                                                                      </div>
                                                                  </div>

                                                                  <div className={`${order.member_order_info}`}>
                                                                      <span className={order.tip}>{sldComLanguage('订单号：')}<span
                                                                          className={order.content}
                                                                      >{child.orderSn}</span></span>
                                                                      <span
                                                                          className={order.tip}
                                                                          style={{ marginLeft: 25 }}
                                                                      >{sldComLanguage('下单时间：')}
                                                                          <span
                                                                              className={order.content}
                                                                          >{child.createTime}</span></span>
                                                                  </div>

                                                              </div>

                                                              <span
                                                                  className={`${order.goods_price} ${order.width_10} ${order.center}`}
                                                                  style={{ width: '18.18%' }}
                                                              >￥{child.spellPrice}</span>
                                                              <span
                                                                  className={`${order.buy_num} ${order.width_10} ${order.center}`}
                                                                  style={{ width: '18.18%' }}
                                                              >{child.productNum}</span>
                                                          </div>
                                                      </div>
                                                      <div
                                                          className={`${order.pay_amount} ${order.width_10} ${order.center}`}
                                                          style={{ width: '11.76%' }}
                                                      >￥{child.orderAmount}</div>

                                                      <div
                                                          className={`${order.order_state} ${order.width_10} ${order.center}`}
                                                          style={{ width: '11.76%' }}
                                                      >{child.orderStateValue}</div>
                                                      <div
                                                          className={`${order.operate} ${order.width_10} ${order.center} ${global.flex_row_center_center}`}
                                                          style={{ width: '11.76%' }}
                                                      >
                                                          <Link
                                                              to={{
                                                                  pathname: '/order/spell_group_order_lists_to_detail',
                                                                  query: {
                                                                      orderSn: child.orderSn
                                                                  }
                                                              }}
                                                          >
                                                              <AuthBtn btnAuth={btnAuth} eventKey={["spell_group_order_lists_view"]}>
                                                                  <div className={`${order.operate_btn}`}>
                                                                      {sldComLanguage('查看详情')}
                                                                  </div>
                                                              </AuthBtn>
                                                          </Link>
                                                      </div>
                                                  </div>)
                                                  }
                                              </div>
                                          </div>
                                      </div>)
                                      }
                                  </Scrollbars>
                              </div>
                              <div className={order.pagination}>
                                  {data.list != undefined && data.list.length > 0 && data.pagination != undefined &&
                    <Pagination
                        size="small"
                        showSizeChanger
                        showQuickJumper
                        current={data.pagination.current}
                        pageSize={params.pageSize}
                        onShowSizeChange={this.onShowSizeChange}
                        onChange={this.onPageChange}
                        defaultCurrent={data.pagination.current}
                        total={data.pagination.total}
                    />
                                  }
                              </div>
                          </div>
                          {/*标准表格-end*/}
                      </Spin>
                  </div>
              </AuthBtn>
          </div>
      );
  }
}
