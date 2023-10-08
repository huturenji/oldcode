import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import moment from 'moment';
import {
    sldIconBtn,
    failTip,
    sucTip,
    dateFormat,
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    formItemLayoutModal,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldPopConfirmDiy,
    getSldCopyData,
    validatorSpecialString,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import ReviewModal from './reviewModal';
import Search from '@/components/Search/Search';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
//场次状态(1-未开始,2-进行中,3-已结束)
let stateTxtValue = {0:'待审核', 1: "未开始", 2: "进行中", 3: "已结束",4:'审核拒绝' }
@connect(({ seckill }) => ({
    seckill
}))
@Form.create()
export default class SeckillLists extends Component {
    cur_edit_id = '';//当前操作数据id

    modal_tip = [
        `${sldComLanguage('最多上传8张图片,每张图片不可以超过1M')}`,
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];
    
    constructor(props) {
        super(props);
        this.state = {
            search_con: '',
            initLoading: false,
            modalVisibleAdv: false,
            submiting: false,
            data: {},//列表数据
            curData: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            cur_data: {},//多图选择器的数据
            origion_data: {
                width: 710,
                height: 300,
                admin_show_width: 236,
                admin_show_height: 100,
                data: [{
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }]
            },//多图选择器的数据
            addData: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'promotionName',
                extra: `${sldComLanguage('最多输入6个字')}`,
                placeholder: `${sldComLanguage('请输入活动名称')}`,
                initialValue: '',
                maxLength:6,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入活动名称')}`
                }, { validator: (rule, value, callback) => validatorSpecialString(rule, value, callback) }]
            }, {
                type: 'seckill_time_select',
                label: `${sldComLanguage('活动场次')}`,
                extra: `${sldComLanguage('每场活动时间为本场次整点开始时间到下一场次开始时间，当日设置的最后一场结束时间为当日23:59:59')}`,
                name: 'stages',
                sel_data: [],
                onChange: this.handleSelTime,
                placeholder: ``
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('活动日期')}`,
                name: 'activity_time',
                placeholder: `${sldComLanguage('请选择活动日期')}`,
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`,
                initialValue: '',
                disabledDate:(currentDate) => currentDate && currentDate < moment().subtract(1, 'days'),
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请选择活动日期')}`
                }]
            }
            ],//modal框的数据
            formValues: {states: [0, 1, 2]},//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动名称')}`,
                name: 'promotionName',
                placeholder: `${sldComLanguage('请输入活动名称')}`
            },{
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [0, 1, 2],
                label: `${sldComLanguage('活动状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择活动状态')}`,
                sel_data: [
                    { key: 0, name: `${sldComLanguage('待审核')}` },
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` },
                    { key: 3, name: `${sldComLanguage('已结束')}` },
                    { key: 4, name: `${sldComLanguage('审核拒绝')}` }
                ]
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('活动时间')}`,
                name: 'search_create_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }],
            columns: [
                {
                    title: ' ',
                    dataIndex: 'promotionId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('活动名称')}`,
                    dataIndex: 'promotionName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动ID')}`,
                    dataIndex: 'promotionId',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('活动时间')}`,
                    dataIndex: 'startTime',
                    align: 'center',
                    width: 200,
                    render: (text, record) => `${text }~${ record.endTime}`
                }, {
                    title: `${sldComLanguage('活动状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 0:
                            return <DotTag type='pending'>待审核</DotTag>
                        case 1:
                            return <DotTag type='normal'>未开始</DotTag>
                        case 2:
                            return <DotTag type='sucess'>进行中</DotTag>
                        case 3:
                            return <DotTag type='normal'>已结束</DotTag>
                        case 4:
                            return <DotTag type='failed'>审核拒绝</DotTag>    
                        default:
                            return ''
                        }
                    }
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={["view_seckill"]} btnAuth={btnAuth}>
                                <Link to={{
                                    pathname: '/marketing_promotion/seckill_detail',
                                    query: {
                                        id: record.promotionId
                                    }
                                }}
                                >
                                    {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => null)}
                                </Link>
                            </AuthBtn>
                            <AuthBtn eventKey={["delete_seckill"]} btnAuth={btnAuth}>
                                {
                                    record.state == 3 &&
                                    <Fragment>
                                        {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.promotionId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                            sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                                    </Fragment>
                                }
                            </AuthBtn>
                            <AuthBtn eventKey={["edit_seckill"]} btnAuth={btnAuth}>
                                {record.state == 4 && sldtbaleOpeBtnText('编辑', () => this.editActivity(record))}
                            </AuthBtn>
                            <AuthBtn eventKey={["audit_seckill"]} btnAuth={btnAuth}>
                                {record.state == 0 && sldtbaleOpeBtnText('审核', () => this.showReview(record))}
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ],
            reviewModalVisible:false,
            record:{}
        };
    }

    componentDidMount() {
        //初始化取值，需要state [0, 1, 2]
        this.get_list({ pageSize: pageSize,pageIndex:1, ...this.state.formValues });
    }

  //编辑活动
  editActivity = (val) => {
      let { addData } = this.state;
      for (let i = 0; i < addData.length; i++) {
          addData[i].initialValue = val[addData[i].name];
      }
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == 'activity_time') {//活动日期组件
              addData[i].initialValue = [moment(val.startTime), moment(val.endTime)]
          } else if (addData[i].name == 'stages') {//活动场次记录
              addData[i].sel_data = val['stages']
          } else {
              addData[i].initialValue = val[addData[i].name];
          }
      }
      this.cur_edit_id = val.promotionId;//当前操作数据id
      this.setState({
          type: 'edit',
          title: `${sldComLanguage('编辑秒杀活动')}`,
          addData: addData,
          modalVisible: true
      });//编辑活动
  };

  handleSelTime = (val) => {
      let { addData } = this.state;
      let tmp_data = addData.filter(item => item.name === 'stages')[0];
      if (tmp_data.sel_data.indexOf(val) > -1) {
          tmp_data.sel_data = tmp_data.sel_data.filter(item => item != val);
      } else {
          tmp_data.sel_data.push(val);
      }
      this.setState({ addData });
  };

  //活动操作  del：删除 edit: 编辑
  operate = (id, type) => {
      this.setState({ submiting: true });
      const { params } = this.state;
      const { dispatch } = this.props;
      let dis_type = '';
      let param_data = {};
      if (type == 'del') {
          dis_type = 'seckill/del_activity';
          param_data = { promotionId: id };
      } else if (type == 'swiper') {
          dis_type = 'seckill/set_activity_swiper';
          param_data = id;
      }
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.setState({
                      modalVisible: false
                  });
                  this.get_list(params);
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //添加活动
  addActivity = () => {
      let { addData } = this.state;
      for (let i = 0; i < addData.length; i++) {
          addData[i].initialValue = '';
          if (addData[i].name == 'stages') {
              addData[i].sel_data = [];
          }
      }
      this.setState({
          modalVisible: true,
          type: 'add',
          title: `${sldComLanguage('新增秒杀活动')}`,
          addData: addData
      });//添加活动
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { formValues } = this.state
      let sendParams = {
          ...formValues,
          ...params
      }
      const { dispatch } = this.props;
      dispatch({
          type: 'seckill/get_activity_lists',
          payload: sendParams,
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      params.pageIndex = params.current 
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

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      const { formValues } = this.state;
      if (type == 'main') {
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          params.pageIndex = params.current
          this.setState({ params });
          this.get_list(params);
      }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisibleAdv: false });
  };

  //设置轮播图
  addAdv = (val) => {
      let { cur_data, origion_data } = this.state;
      cur_data = { ...origion_data, data: getSldCopyData(origion_data.data) };
      //获取秒杀活动详情
      const { dispatch } = this.props;
      dispatch({
          type: 'seckill/get_activity_detail',
          payload: { promotionId: val.promotionId },
          callback: (res) => {
              if (res.state == 200) {
                  if (res.data.banner) {
                      let adv_data = JSON.parse(res.data.banner);
                      for (let i = 0; i < cur_data.data.length; i++) {
                          if (adv_data[i].imgUrl) {
                              cur_data.data[i] = adv_data[i];
                          }
                      }
                  }
              }
              this.setState({
                  modalVisibleAdv: true,
                  cur_data: cur_data,
                  curData: val
              });
          }
      });
  };

  sldHandleConfirmAdv = (val) => {
      const { curData } = this.state;
      let param = {};
      param.promotionId = curData.promotionId;
      param.banner = JSON.stringify(val);
      this.operate(param, 'swiper');
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false, modalVisibleAdv: false });
  };

  sldHandleConfirm = (val) => {
      let { addData, type } = this.state;
      //时间处理
      if (val.activity_time) {
          val.startTime = val.activity_time[0] ? val.activity_time[0].format(dateFormat) : '';
          val.endTime = val.activity_time[1] ? val.activity_time[1].format(dateFormat) : '';
          delete val.activity_time;
      }
      //活动场次的处理
      let stages = addData.filter(item => item.name == 'stages')[0];
      if (stages.sel_data.length == 0) {
          failTip(`${sldComLanguage('请选择活动场次')}`);
          return false;
      } 
      val.stages = stages.sel_data;
    
      const { dispatch } = this.props;
      this.setState({ submiting: true });
      if(type=='add'){
          dispatch({
              type: 'seckill/add_activity',
              payload: val,
              callback: (res) => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      this.get_list({ pageSize: pageSize,pageIndex:1 });
                      this.setState({
                          modalVisible: false
                      });
                  } else {
                      failTip(res.msg);
                  }
                  this.setState({ submiting: false });
              }
          });

      }else if(type=='edit'){
          val.promotionId = this.cur_edit_id
          dispatch({
              type: 'seckill/seckill_update',
              payload: val,
              callback: (res) => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      this.get_list({ pageSize: pageSize,pageIndex:1 });
                      this.setState({
                          modalVisible: false
                      });
                  } else {
                      failTip(res.msg);
                  }
                  this.setState({ submiting: false });
              }
          });

      }
      
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      //时间处理
      if (values.search_create_time) {
          values.startTime = values.search_create_time[0] ? `${values.search_create_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_create_time[1] ? `${values.search_create_time[1].format(dateFormat) } 23:59:59` : '';
          delete values.search_create_time;
      }
      for (let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize ,pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, ...values, pageIndex:1 });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {states: [0, 1, 2]},
          params: { pageSize: pageSize }
      },()=>{
          this.get_list({ pageSize: pageSize , pageIndex:1 , states: [0, 1, 2] });
      });
  };

  showReview = (record)=>{
      this.setState({
          record,
          reviewModalVisible:true
      })
  }

  successEvent = ()=>{
      this.auditPromotion({state:1})
  }

  refuseEvent = (rejectReason)=>{
      this.auditPromotion({state:4,rejectReason})
  }

  reviewModalCancle = ()=>{
      this.setState({
          reviewModalVisible:false
      })
  }

  auditPromotion = (param)=>{
      const { record } = this.state
      const { dispatch } = this.props;
      param.promotionId = record.promotionId
      dispatch({
          type: 'seckill/auditPromotion',
          payload: param,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({ pageSize: pageSize,pageIndex:1 });
                  this.setState({
                      reviewModalVisible: false
                  });
              } else {
                  failTip(res.msg);
              }
          }
      });
  }

  render() {
      const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, modalVisibleAdv, search_data, cur_data,reviewModalVisible,record } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1, paddingTop: 0 }}>
              <div className={global.tableListForm}>
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              <div className={global.operate_bg}>
                  <AuthBtn eventKey={['add_seckill']} btnAuth={btnAuth}>
                      {sldIconBtn(() => this.addActivity(), `${sldComLanguage('新增活动')}`, 7, 7)}{/*新增活动*/}
                  </AuthBtn>
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="promotionId"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      onSldHandleSeleRow={this.onSldHandleSeleRow}
                      resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                      isColumnResize
                  />
                  {/*标准表格-end*/}

              </Spin>
              {/*新增/编辑对话框-start*/}
              <SldModal
                  title={title}
                  submiting={submiting}
                  width={860}
                  modalVisible={modalVisible}
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={addData}
                  confirmText='提交审核'
              />
              {/*新增/编辑对话框-end*/}
              <SldDiyMoreImgModal
                  width={1000}
                  title={`${sldComLanguage('设置活动轮播图')}`}
                  sldSeleSingleRow
                  submiting={submiting}
                  modalVisible={modalVisibleAdv}
                  sldHandleConfirm={(val) => this.sldHandleConfirmAdv(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  content={cur_data}
                  modal_tip={this.modal_tip}
                  client="mobile"
                  uploadLimit={1}
              />
              <ReviewModal
                  modalVisible={reviewModalVisible}
                  record={record}
                  refuseEvent={this.refuseEvent}
                  successEvent={this.successEvent}
                  cancle={this.reviewModalCancle}
              />
          </div>

      );
  }
}
