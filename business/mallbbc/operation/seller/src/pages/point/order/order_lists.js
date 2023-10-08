import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Radio, Empty, Pagination, Modal, Select, Input } from 'antd';
import Link from 'umi/link';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    sldComLanguage,
    dateFormat,
    sldLlineRtextAddGoods,
    list_com_page_more,
    formItemLayoutModal,
    sucTip,
    failTip,
    getSldEmptyH,
    mobile_reg
} from '@/utils/utils';
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';
import order from './order.less';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let pageSize = list_com_page_size_10;
@connect(({ point }) => ({
    point
}))
@Form.create()
export default class Order_lists extends Component {
    filter_data = [
        { filter_code: '', filter_name: `${sldComLanguage('全部订单')}` },
        { filter_code: '10', filter_name: `${sldComLanguage('待付款订单')}` },
        { filter_code: '20', filter_name: `${sldComLanguage('待发货订单')}` },
        { filter_code: '30', filter_name: `${sldComLanguage('待收货订单')}` },
        { filter_code: '40', filter_name: `${sldComLanguage('已完成订单')}` },
        { filter_code: '0', filter_name: `${sldComLanguage('已取消订单')}` }
    ];//订单过滤器

    constructor(props) {
        super(props);
        this.state = {
            search_height:0,
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
                label: `${sldComLanguage('订单号')}`,
                name: 'orderSn',
                placeholder: `${sldComLanguage('请输入订单号')}`
            }, {
                type: 'input',
                label: `${sldComLanguage('会员名称')}`,
                name: 'memberName',
                placeholder: `${sldComLanguage('请输入会员名称')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('兑换时间')}`,
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
            modal_width: 550,
            modalItem: {},
            demodalVisible: false,
            expressList: [],
            deliverType: '0',
            resList: [] // 取消原因数据
        };
    }


    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        this.get_express_list();
        this.resize();
        window.addEventListener('resize', this.resize, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () =>{
      const {search_height} = this.state;
      if(this.refs.search_part!=undefined){
          if(this.refs.search_part.clientHeight != search_height){
              this.setState({search_height:this.refs.search_part.clientHeight})
          }
      }
  }

  //获取店铺启用的物流公司
  get_express_list = () => {
      const { dispatch } = this.props;
      dispatch({
          type: 'point/get_express',
          payload: { pageSize: list_com_page_more, expressState: 1 },
          callback: res => {
              if (res.state == 200) {
                  this.setState({
                      expressList: res.data.list
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'point/get_order_lists',
          payload: { ...params },
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
     
      //时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          values.search_create_time = '';
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
      this.get_list({ pageSize: pageSize, ...values});
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
      let {formValues} = this.state;
      this.setState({
          filter_code: e.target.value
      });
      let param = {pageSize: pageSize, currentPage: 1,...formValues};
      if(e.target.value){
          param.orderState = e.target.value;
      }
      this.get_list(param);
  };

  //改变每页的数量
  onShowSizeChange = (current, pageSizeNew) => {
      let { params,formValues, filter_code } = this.state;
      params.pageSize = pageSizeNew;
      pageSize = params.pageSize;
      let curParams = { ...params, ...formValues }
      if(filter_code){
          curParams.orderState = filter_code;
      }
      this.setState({ params },()=>{
          this.get_list(curParams);
      });
  };

  //改变页码
  // eslint-disable-next-line no-shadow
  onPageChange = (page, pageSize) => {
      const { formValues, filter_code } = this.state;
      let curParams = { pageSize: pageSize, current: page, ...formValues }
      if(filter_code){
          curParams.orderState = filter_code;
      }
      this.setState({ params: curParams});
      this.get_list(curParams);
  };

  sldHandleCancle = () => {
      const { modalVisible } = this.state;
      this.setState({
          modalVisible: !modalVisible,
          operateData: [],
          modalItem: {},
          modalTitle: ''
      });
  };

  //弹框确定操作
  sldHandleConfirm = (val) => {
      const { modalItem } = this.state;
      const { dispatch } = this.props;
      val.orderSn = modalItem.orderSn;
      dispatch({
          type: 'point/cancle_order',
          payload: val,
          callback: res => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.setState({
                      modalVisible: false,
                      operateData: [],
                      modalItem: {},
                      modalTitle: ''
                  });
                  const { formValues, params } = this.state;
                  this.get_list({ ...formValues, ...params });
              } else {
                  failTip(res.msg);
              }
          }
      });

  };

  agreeReturn = (item) => {
      let { operateData, resList } = this.state;
      operateData.push({
          type: 'onlytxt',
          label: ' ',
          content: `${sldComLanguage('*取消订单后，订单将自动关闭')}`,
          fontSize: '12px',
          fontColor: '#FF711E',
          right: 18,
          bgcColor: '#F2F2F2'
      });
      operateData.push({
          type: 'select',
          label: `${sldComLanguage('取消理由')}`,
          name: 'reasonId',
          placeholder: `${sldComLanguage('请选择取消理由')}`,
          sel_data: resList,
          sele_key: 'reasonId',
          sele_name: 'content',
          diy: true,
          rules: [{
              required: true,
              message: `${sldComLanguage('请选择取消理由')}`
          }]
      });
      operateData.push({
          type: 'textarea',
          label: `${sldComLanguage('取消备注')}`,
          name: 'remark',
          placeholder: `${sldComLanguage('请输入取消备注，最多50个字')}`,
          initialValue: ''
      });
      this.setState({
          modalTitle: `${sldComLanguage('取消订单')}`,
          modalVisible: true,
          operateData: operateData,
          modalItem: item
      });
  };

  agreeDeliver = (item) => {
      this.setState({
          modalItem: item,
          modalTitle: `${sldComLanguage('商品发货')}`,
          demodalVisible: true,
          deliverType: '0'
      });
  };

  deliverConfirm = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              const { modalItem } = this.state;
              const { dispatch } = this.props;
              values.orderSn = modalItem.orderSn;
              dispatch({
                  type: 'point/confirm_delivery',
                  payload: values,
                  callback: res => {
                      if (res.state == 200) {
                          sucTip(res.msg);
                          this.setState({
                              modalItem: {},
                              modalTitle: '',
                              demodalVisible: false
                          });
                          const { formValues, params } = this.state;
                          this.get_list({ ...formValues, ...params });
                          this.props.form.resetFields();
                      } else {
                          failTip(res.msg);
                      }
                  }
              });
          }
      });

  };

  sldDeliverHandleCancle = () => {
      this.setState({
          modalItem: {},
          modalTitle: '',
          deliverType: '',
          demodalVisible: false
      });
      this.props.form.resetFields();
  };

  //选择发货方式
  redioOnChange = (e) => {
      this.setState({
          deliverType: e.target.value
      });
  };

  render() {
      const { getFieldDecorator } = this.props.form;
      const { search_data, data, loading, filter_code, params, operateData, modalVisible, modalTitle, submiting, show_foot, modal_width, search_height, demodalVisible, modalItem, expressList, deliverType } = this.state;
      return (
          <div
              className={`${global.common_page}`}
              style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
          >
              <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                  {sldLlineRtextAddGoods('#69A2F2', `${sldComLanguage('订单管理')}`)}
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
                              <li className={`${order.width_40} ${order.pl_100}`}>{sldComLanguage('商品信息')}</li>
                              <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('单价(元)')}</li>
                              <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('数量')}</li>
                              <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('会员')}</li>
                              <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('实付金额')}</li>
                              <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('订单状态')}</li>
                              <li className={`${order.width_10} ${order.center}`}>{sldComLanguage('操作')}</li>
                          </ul>
                          <div className={order.order_content}>
                              {data.list != undefined && data.list.length == 0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                              }
                              <Scrollbars
                                  autoHeight
                                  autoHeightMax={document.body.clientHeight - 260-search_height}
                              >
                                  {data.list != undefined && data.list.length > 0 && data.list.map((item, index) => <div className={order.item} key={index}>
                                      <div className={`${order.order_info} ${global.flex_row_between_center}`}>
                                          <div className={`${order.left} ${global.flex_row_start_start}`}>
                                              <span className={order.order_sn}>{sldComLanguage('订单号：')}{item.orderSn}</span>
                                          </div>
                                          <span className={order.create_time}>{sldComLanguage('兑换时间：')}{item.createTime}</span>
                                      </div>
                                      <div className={`${order.order_goods_part} ${global.flex_row_start_center}`}>
                                          <div
                                              className={`${order.goods} ${global.flex_column_start_start} ${order.width_60} ${item.orderProductList != undefined && item.orderProductList.length > 1 ? order.goods_split : null}`}
                                          >

                                              {item.orderProductList != undefined && item.orderProductList.length > 0 && item.orderProductList.map((item_goods, index_goods) => <div
                                                  className={`${order.goods_item} ${global.flex_row_start_center}`}
                                                  style={{ width: '100%' }}
                                                  key={index_goods}
                                              >
                                                  <div className={`${global.flex_row_start_center}`} style={{ width: '66.66%' }}>
                                                      <div className={`${order.goods_img_wrap} ${global.flex_row_center_center}`}>
                                                          <img
                                                              src={item_goods.mainImage}
                                                          />
                                                      </div>
                                                      <div className={`${order.goods_info} ${global.flex_column_start_start}`}>
                                                          <span className={`${order.goods_name}`}>{item_goods.skuName}</span>
                                                          <span className={`${order.goods_spec}`}>{item_goods.specValues}</span>
                                                      </div>
                                                  </div>
                                                  <span
                                                      className={`${order.goods_price} ${order.width_10} ${order.center}`}
                                                      style={{ width: '16.68%' }}
                                                  >{sldComLanguage('积分')}{item_goods.integralPrice}{sldComLanguage('+￥')}{item_goods.cashPrice}</span>
                                                  <span
                                                      className={`${order.buy_num} ${order.width_10} ${order.center}`}
                                                      style={{ width: '16.66%' }}
                                                  >{item_goods.productNum}</span>
                                              </div>)}
                                          </div>

                                          <div className={`${order.member_info} ${global.flex_column_center_center} ${order.width_10}`}>
                                              <span className={`${order.mem_name}`}>{item.memberName}</span>
                                          </div>
                                          <div className={`${order.pay_amount} ${order.width_10} ${order.center}`}>
                                              <div>{sldComLanguage('积分')}{item.integral}{sldComLanguage('+￥')}{item.cashAmount}</div>
                                              <div>{item.paymentName}</div>
                                          </div>
                                          <div
                                              className={`${order.order_state} ${order.width_10} ${order.center}`}
                                          >{item.orderStateValue}</div>
                                          <div className={`${order.operate} ${order.width_10} ${order.center} ${global.flex_column_center_center}`}>
                                              <Link
                                                  to={{
                                                      pathname: '/point/order_list_to_detail',
                                                      query: {
                                                          orderSn: item.orderSn
                                                      }
                                                  }}
                                              >
                                                  <div className={`${order.operate_btn}`}>
                                                      {sldComLanguage('查看详情')}
                                                  </div>
                                              </Link>
                                              {
                                                  item.orderState == 20 &&
                            <div className={order.operate_btn} onClick={() => this.agreeDeliver(item)}>
                                {sldComLanguage('发货')}
                            </div>
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
                  {/* 发货弹框-start */}

                  <div className={global.modalsty}>
                      <SldModal
                          title={modalTitle}
                          submiting={submiting}
                          show_foot={show_foot}
                          width={modal_width}
                          modalVisible={modalVisible}
                          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                          sldHandleCancle={this.sldHandleCancle}
                          formItemLayoutModal={formItemLayoutModal}
                          content={operateData}
                      />
                  </div>

                  <Modal
                      centered
                      title={modalTitle}
                      width={modal_width}
                      visible={demodalVisible}
                      onCancel={() => this.sldDeliverHandleCancle()}
                      onOk={this.deliverConfirm}
                  >
                      <Form layout="horizontal">
                          {deliverType == 0
                              ? <div style={{
                                  width: modal_width,
                                  paddingLeft: modal_width * 0.11,
                                  marginTop: 5,
                                  marginBottom:8
                              }}
                              >
                                  <div style={{
                                      color: '#FF711E',
                                      width: 18 / 24 * (modal_width ? modal_width : 416),
                                      fontSize: 12,
                                      borderBottom:'1px solid #f2f2f2',
                                      lineHeight: '28px'
                                  }}
                                  >* {sldComLanguage('请认真填写物流公司及快递单号')}
                                  </div>
                              </div> : getSldEmptyH(15)
                          }
                          <FormItem
                              label={sldComLanguage('收货人姓名')}
                              {...formItemLayoutModal}
                          >
                              <span>{modalItem.receiverName}</span>
                          </FormItem>
                          <FormItem
                              label={sldComLanguage('收货人电话')}
                              {...formItemLayoutModal}
                          >
                              <span>{modalItem.receiverMobile}</span>
                          </FormItem>
                          <FormItem />
                          <FormItem
                              label={sldComLanguage('收货人地址')}
                              {...formItemLayoutModal}
                          >
                              <span style={{wordBreak:'break-all'}}>{modalItem.receiverAddress}</span>
                          </FormItem>
                          <FormItem
                              label={sldComLanguage('发货方式')}
                              {...formItemLayoutModal}
                          >
                              {getFieldDecorator('deliverType', {
                                  initialValue: 0,
                                  rules: [{ required: true, message: `${sldComLanguage('请选择发货方式')}` }]
                              })(
                                  <RadioGroup onChange={(e) => this.redioOnChange(e)}>
                                      <Radio value={0}>{sldComLanguage('物流发货')}</Radio>
                                      <Radio value={1}>{sldComLanguage('无需物流')}</Radio>
                                  </RadioGroup>,
                              )}
                          </FormItem>
                          {
                              this.state.deliverType == '0' ? <Fragment>
                                  <FormItem
                                      label={sldComLanguage('物流公司')}
                                      {...formItemLayoutModal}
                                  >
                                      {getFieldDecorator('expressId', { rules: [{ required: true, message: `${sldComLanguage('请选择物流公司')}` }] })(
                                          <Select
                                              placeholder={sldComLanguage('请选择物流公司')}
                                              getPopupContainer={triggerNode => triggerNode.parentNode}
                                          >
                                              {
                                                  expressList.length > 0 && expressList.map(item => <Option
                                                      value={item.expressId}
                                                  >{item.expressName}</Option>)
                                              }
                                          </Select>,
                                      )}
                                  </FormItem>
                                  <FormItem
                                      label={sldComLanguage('快递单号')}
                                      {...formItemLayoutModal}
                                  >
                                      {getFieldDecorator('expressNumber', { rules: [{ required: true,whitespace: true, message: `${sldComLanguage('请输入物流单号')}` },{
                                          pattern: /^[0-9a-zA-Z]*$/g,
                                          message: `${sldComLanguage('请输入正确的单号')}`}] })(
                                          <Input maxLength={20} placeholder={sldComLanguage('请输入物流单号')} />,
                                      )}
                                  </FormItem>
                              </Fragment> : null
                          }
                          {
                              this.state.deliverType == '1' ? <Fragment>
                                  <FormItem
                                      label={sldComLanguage('联系人')}
                                      {...formItemLayoutModal}
                                  >
                                      {getFieldDecorator('deliverName', { rules: [{ required: true, whitespace: true,message: `${sldComLanguage('请输入联系人')}` }] })(
                                          <Input placeholder={sldComLanguage('请输入联系人')} maxLength={10} />,
                                      )}
                                  </FormItem>
                                  <FormItem
                                      label={sldComLanguage('联系方式')}
                                      {...formItemLayoutModal}
                                  >
                                      {getFieldDecorator('deliverMobile', { rules: [
                                          {
                                              required: true,
                                              whitespace: true,
                                              message: `${sldComLanguage('请输入联系方式')}`
                                          }, {
                                              pattern: mobile_reg,
                                              message: `${sldComLanguage('请输入正确的手机号')}`
                                          }
                                      ] })(
                                          <Input maxLength={11} placeholder={sldComLanguage('请输入联系方式')} />,
                                      )}
                                  </FormItem>
                              </Fragment> : null
                          }
                      </Form>
                  </Modal>
              </div>
          </div>
      );
  }
}
