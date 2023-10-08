import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    sldIconBtn,
    failTip,
    sucTip,
    sldPopConfirmDiy,
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    formItemLayoutModal,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldLlineRtextAddGoodsAddMargin,
    validatorMemPwd,
    mobile_reg,
    deepCopy,
    validatorNumbe,
    getAuthBtn
} from '@/utils/utils';
import { week_to_num, month_to_num } from '@/utils/util_data';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import Search from '@/components/Search/Search';
import areaData from '@/assets/json/area.json';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
// 货品来源  1 接入  2 手工  3 接入&手工   
const goodsSource = {
    "JOIN":1,
    "HANDWORK":2,
    "JOINANDHANDWORK":3
}
let curStoreType = goodsSource['JOIN']
let pageSize = list_com_page_size_10;
@connect(({ store }) => ({
    store
}))
@Form.create()
export default class OwnList extends Component {
    week_data = {
        type: 'checkboxgroup',
        label: `${sldComLanguage('结算周期')}`,
        extra: `${sldComLanguage('设置该商家每周几进行结算，可多选，全部选中则为按天结算。')}`,
        name: 'billDays',
        placeholder: `${sldComLanguage('请选择结算周期')}`,
        sldOptions: week_to_num(),
        rules: [{
            required: true,
            message: `${sldComLanguage('请选择结算周期')}`
        }]
    };
  
    month_data = {
        type: 'checkboxgroup',
        label: `${sldComLanguage('结算周期')}`,
        extra: `${sldComLanguage('设置该商家每月几号进行结算，可多选，若当月没有设置的日期则该日不进行结算。')}`,
        name: 'billDays',
        placeholder: `${sldComLanguage('请选择结算周期')}`,
        sldOptions: month_to_num(),
        rules: [{
            required: true,
            message: `${sldComLanguage('请选择结算周期')}`
        }]
    };
  
    // supply_data 若改为多选模式 ，type改为checkboxgroup   radio_check
    supply_data = {
        type: 'checkboxgroup',
        label: `${sldComLanguage('供应商')}`,
        extra: `${sldComLanguage('设置该商家的供应商')}`,
        name: 'supplierTypes',
        placeholder: `${sldComLanguage('请选择供应商')}`,
        sldOptions: [],
        rules: [{
            required: true,
            message: `${sldComLanguage('请选择供应商')}`
        }]
    };
  
    cur_edit_id = '';
  
    //当前操作数据id
    operate_info = {};
  
    //当前操作的店铺信息
    sel_area_name = '';//选择的地区名称

    constructor(props) {
        super(props);
        this.state = {
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('店铺名称')}`,
                name: 'storeName',
                placeholder: `${sldComLanguage('请输入店铺名称')}`
            }, {
                type: 'select',
                label: `${sldComLanguage('店铺状态')}`,
                name: 'state',
                placeholder: `${sldComLanguage('请选择店铺状态')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('开启')}` },
                    { key: '2', name: `${sldComLanguage('关闭')}` }
                ]
            },{
                type: 'select',
                label: `${sldComLanguage('店铺类型')}`,
                name: 'goodsSource',
                placeholder: `${sldComLanguage('请选择店铺类型')}`,
                sel_data: [
                    { key: '', name: `${sldComLanguage('全部')}` },
                    { key: '1', name: `${sldComLanguage('自营接入店铺')}` },
                    { key: '2', name: `${sldComLanguage('自营手工店铺')}` }
                ]
            }],
            initLoading: false,
            submiting: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize },//搜索条件
            operateData: [],//操作数据
            addData: [{
                type: 'input',
                label: `${sldComLanguage('店铺名称')}`,
                name: 'storeName',
                extra: `${sldComLanguage('最多输入30个字')}`,
                placeholder: `${sldComLanguage('请输入店铺名称')}`,
                initialValue: '',
                maxLength:30,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入店铺名称')}`
                }]
            }, {
                type: 'input',
                label: `${sldComLanguage('店铺联系人')}`,
                name: 'contactName',
                extra: `${sldComLanguage('最多输入5个字')}`,
                placeholder: `${sldComLanguage('请输入店铺联系人')}`,
                initialValue: '',
                maxLength:5,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入店铺联系人')}`
                }]
            }, {
                type: 'input',
                label: `${sldComLanguage('手机号')}`,
                name: 'contactPhone',
                placeholder: `${sldComLanguage('请输入手机号')}`,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请输入手机号')}`
                }, {
                    pattern: mobile_reg,
                    message: `${sldComLanguage('请输入正确的手机号')}`
                }]
            }, {
                type: 'cascader_common',
                label: `${sldComLanguage('店铺地址')}`,
                name: 'area',
                data: areaData,//三级地址
                fieldNames: { label: 'regionName', value: 'regionCode', children: 'children' },
                placeholder: `${sldComLanguage('请选择店铺地址')}`,
                initialValue: [],
                onChange: this.getAreaInfo,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请选择店铺地址')}`
                }]
            }, {
                type: 'textarea',
                label: `${sldComLanguage('店铺详细地址')}`,
                extra: `${sldComLanguage('最多输入50字')}`,
                name: 'address',
                placeholder: `${sldComLanguage('请输入详细地址')}`,
                initialValue: '',
                maxLength: 50,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入详细地址')}`
                }]
            },
            {
                type: 'input',
                label: `${sldComLanguage('店铺账号')}`,
                name: 'vendorName',
                extra: `${sldComLanguage('最多输入15个字')}`,
                placeholder: `${sldComLanguage('请输入店铺账号')}`,
                initialValue: '',
                maxLength:15,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入店铺账号')}`
                },{
                    pattern: new RegExp(/^[A-Za-z0-9]+$/),
                    message: "支持输入字母、数字"
                }]
            }, {
                type: 'input',
                label: `${sldComLanguage('登录密码')}`,
                name: 'vendorPassword',
                placeholder: `${sldComLanguage('请设置6～20位字母、数字或符号组成的密码')}`,
                initialValue: '',
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入登录密码')}`
                }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }]
            }, {
                type: 'inputnum',
                label: `${sldComLanguage('排序')}`,//排序
                extra: `${sldComLanguage('请输入0~255的数字，数字越小，该项显示将越靠前')}`,
                name: 'sort',
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,
                initialValue: '',
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`
                }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }]
            },{
                type: 'radio_select',
                label: `${sldComLanguage('结算方式')}`,
                name: 'billType',
                data: [{
                    key: 1,
                    value: `${sldComLanguage('按月结算')}`
                }, {
                    key: 2,
                    value: `${sldComLanguage('按周结算')}`
                }],
                isReset: true,//是否要重置，true为重置，false为不重置
                resetFileds: ['billDays'],//要重置的字段数组
                initialValue: 1,
                callback: this.switchBillType
            }
            ],//modal框的数据
            formValues: {},//搜索条件
            columns: [
                {
                    title: ' ',
                    dataIndex: 'storeId',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('自营店铺类型')}`,
                    dataIndex: 'goodsSource',
                    align: 'center',
                    width: 150,
                    render:(text)=>text==1?'自营接入店铺':'自营手工店铺'
                },
                {
                    title: `${sldComLanguage('店铺账号')}`,
                    dataIndex: 'vendorName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('电话')}`,
                    dataIndex: 'contactPhone',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('店铺状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 80,
                    render: (text) => (
                        <span>{text == 1?'开启':'关闭'}</span>
                    )
                },
                {
                    title: `店铺标识符`,
                    dataIndex: 'identifier',
                    align: 'center',
                    width: 80
                },
                {
                    title: `${sldComLanguage('排序')}`,
                    dataIndex: 'sort',
                    align: 'center',
                    width: 80
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={["edit_own_store"]} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.edit(record))}
                            </AuthBtn>
                            {/* {record.state == 2 &&
              <Fragment>
                <span className={global.splitLine}></span>
                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate(record.storeId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
              </Fragment>
              } */}
                            <AuthBtn eventKey={["switch_own_store"]} btnAuth={btnAuth}>

                                {record.state == 1 &&
                <Fragment>
                    <span className={global.splitLine} />
                    {sldPopConfirmDiy('leftBottom', '店铺关闭为敏感操作，确定要关闭吗？', () => this.operate({ storeId: record.storeId, state: record.state == 2 ? 1 : 2 }, 'switch'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                        sldtbaleOpeBtnText(`关闭`, () => null))}
                </Fragment>
                                }
                                {record.state == 2 &&
                <Fragment>
                    <span className={global.splitLine} />
                    <span className={`${global.input_after_wrap} ${global.tableOperateText}`} onClick={()=>{this.operate({ storeId: record.storeId, state: 1 }, 'switch')}}>开启</span>
                </Fragment>
                                }
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize });
        let { addData } = this.state;
        addData.push(JSON.parse(JSON.stringify(this.month_data)));
        this.setState({ addData });
    }

  switchBillType = (e) => {
      let { addData } = this.state;
      addData = addData.filter(item => item.name != 'billDays');
      let tar_bill_data = {};
      if (e.target.value == 1) {
      //按月结算
          tar_bill_data = JSON.parse(JSON.stringify(this.month_data));
      } else if (e.target.value == 2) {
      //按周结算
          tar_bill_data = JSON.parse(JSON.stringify(this.week_data));
      }
      if (this.operate_info.storeId != undefined && this.operate_info.storeId && this.operate_info.billType == e.target.value) {
          tar_bill_data.initialValue = this.operate_info.billDay != null && this.operate_info.billDay ? this.operate_info.billDay.split(',') : '';
      }
      const index = addData.findIndex((item)=> item.name == 'billType')
      addData.splice(index+1,0,tar_bill_data)
      // addData.push(tar_bill_data);
      this.setState({ addData });
  };

  //编辑自营店铺
  edit = async (val) => {
      // 拷贝supply_data 不然数据会乱，下面的addData.filter之所以过滤生产新的addData，也是动态的push 会造成addData越来越多
      const operat_supply_data = deepCopy(this.supply_data);
      // 获取供应商信息
      const supplier_type = await this.get_supplier_type();

      let { addData } = this.state;
      addData = addData.filter(item => (item.name != 'billDays' && item.name != 'vendorPassword' && item.name != 'vendorName'&& item.name != 'supplierTypes'));
      this.props.dispatch({
          type: 'store/get_own_store_detail',
          payload: { storeId: val.storeId },
          callback: (res) => {
              if (res.state == 200) {
                  this.sel_area_name = res.data.areaInfo;//	省市区名称组合
                  addData.forEach(item => {
                      if (item.name == 'area') {
                          item.initialValue = [res.data.provinceCode, res.data.cityCode, res.data.areaCode];
                      } else {
                          //更改为能够修改店铺名称
                          //   if(item.name == 'storeName'){
                          //     item.disable = true;
                          //   }
                          item.initialValue = res.data[item.name];
                      }
                  });
                  //初始化结算周期数据
                  let tar_bill_data = {};
                  if (res.data.billType == 1) {
                      tar_bill_data = this.month_data;
                  } else {
                      tar_bill_data = this.week_data;
                  }
                  tar_bill_data = JSON.parse(JSON.stringify(tar_bill_data));
                  tar_bill_data.initialValue = res.data.billDay != null && res.data.billDay ? res.data.billDay.split(',') : '';
                  addData.push(tar_bill_data);

                  //初始化供应商信息 设置默认值   单选加join   res.data.supplierTypes.join(',')
                  operat_supply_data.initialValue = (res.data.supplierTypes!=null && res.data.supplierTypes)?res.data.supplierTypes:''
                  // 编辑状态下，返回的supplierTypes有值的都能编辑 因为编辑状态下那个供应商的状态肯定是0
                  if(res.data.supplierTypes){
                      supplier_type.forEach((item)=>{
                          if(res.data.supplierTypes.includes(item.value)){
                              item.disabled = false
                          }
                      })
                  }
                  operat_supply_data.sldOptions = supplier_type;
                  if(supplier_type&&(val.goodsSource==goodsSource['JOIN'])){
                      addData.push(operat_supply_data)
                  }
                  this.cur_edit_id = val.storeId;//当前操作数据id
                  this.operate_info = res.data;
                  this.setState({
                      type: 'edit',
                      title: `${sldComLanguage(`编辑自营${val.goodsSource==goodsSource['JOIN']?'接入':'手工'}店铺`)}`,
                      addData,
                      modalVisible: true
                  });//编辑自营店铺
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //获取地址信息
  getAreaInfo = (area) => {
      for (let i = 0; i < area.length; i++) {
          this.sel_area_name += area[i].regionName;
      }
  };

  switchStore=(text,record)=>{
      sldPopConfirmDiy('leftBottom', '店铺开关为敏感操作，关闭后将无法登录商家后台，确定要关闭吗？', this.operate({ storeId: record.storeId, state: text == 2 ? 1 : 2 }, 'switch'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,'')
  };  


  //店铺操作  del：删除 stop：停用 start：启用
  operate = (id, type) => {
      this.setState({ submiting: true });
      const { params } = this.state;
      const { dispatch } = this.props;
      let dis_type = '';
      let param_data = {};
      if (type == 'del') {
          dis_type = 'store/del_own_store';
          param_data.storeId = id;
      }else if (type == 'switch') {
          dis_type = 'store/switch_own_store';
          param_data = id;

      }else if (type == 'edit') {
          dis_type = 'store/edit_own_store';
          param_data = id;
      }else if (type == 'add') {
          dis_type = 'store/add_own_store';
          param_data = id;
      }
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
                  this.operate_info = {};
                  this.setState({
                      modalVisible: false
                  });
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //添加自营店铺
  add = async (type) => {
      let { addData } = this.state;
      // 拷贝supply_data 不然数据会乱，下面的addData.filter之所以过滤生产新的addData，也是动态的push 会造成addData越来越多
      const operat_supply_data = deepCopy(this.supply_data)
      // 获取供应商信息
      const supplier_type = await this.get_supplier_type();
      operat_supply_data.sldOptions = supplier_type

      addData = addData.filter(item => (item.name != 'billDays' && item.name != 'vendorPassword' && item.name != 'vendorName' && item.name != 'supplierTypes'));
      addData.push(JSON.parse(JSON.stringify(this.month_data)));
      if(supplier_type&&type==goodsSource['JOIN']){
          addData.push(operat_supply_data)
      }
      addData.forEach((item, index) => {
          if (item.name == 'address') {
              addData.splice(index + 1, 0, {
                  type: 'input',
                  label: `${sldComLanguage('店铺账号')}`,
                  name: 'vendorName',
                  extra: `${sldComLanguage('最多输入15个字')}`,
                  placeholder: `${sldComLanguage('请输入店铺账号')}`,
                  initialValue: '',
                  maxLength:15,
                  rules: [{
                      required: true,
                      whitespace: true,
                      message: `${sldComLanguage('请输入店铺账号')}`
                  },{
                      pattern: new RegExp(/^[A-Za-z0-9]+$/),
                      message: "支持输入字母、数字"
                  }]
              });
              addData.splice(index + 2, 0, {
                  type: 'input',
                  label: `${sldComLanguage('登录密码')}`,
                  name: 'vendorPassword',
                  placeholder: `${sldComLanguage('请设置6～20位字母、数字或符号组成的密码')}`,
                  initialValue: '',
                  rules: [{
                      required: true,
                      whitespace: true,
                      message: `${sldComLanguage('请输入登录密码')}`
                  }, { validator: (rule, value, callback) => validatorMemPwd(rule, value, callback) }]
              });
          }
          if (item.name == 'billType') {
              item.initialValue = 1;
          } else {
              if(item.name == 'storeName'){
                  item.disable = false;
              }
              item.initialValue = '';
          }
      });
      curStoreType = type
      this.setState({
          modalVisible: true,
          type: 'add',
          title: `${sldComLanguage(`新增自营${type==goodsSource['JOIN']?'接入':'手工'}店铺`)}`,
          addData
      });//新增自营店铺
  };

  // 获取店铺供应商
  get_supplier_type = ()=>new Promise((resolve) => {
      const { dispatch } = this.props;
      dispatch({
          type: 'store/get_supplier_type',
          payload: {},
          callback: (res) => {
              if(res && res.state == 200){
                  const { data } = res;
                  //进行数据组装
                  let arr = []
                  data.forEach((item)=>{
                      arr.push({
                          label:item.supplierType,
                          value:item.supplierType
                          //   disabled:item.state==1?false:true
                      })
                  })
                  resolve([...arr])
              }else{
                  failTip(res.msg)
                  resolve([])
              }
          }
      });
  })

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'store/get_own_store_list',
          payload: params,
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.length == 0 && this.state.params.currentPage > 1) {
                      params.currentPage = params.currentPage - 1;
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
      this.setState({ modalVisible: false });
  };

  sldHandleConfirm = (val) => {
      const { type } = this.state;
      val.billDays = val.billDays.join(',');//结算日期字符串，以逗号隔开
      if(val.area!=undefined&&val.area){
          val.provinceCode = val.area[0];
          val.cityCode = val.area[1];
          val.areaCode = val.area[2];
          delete val.area;
      }
      if(type == 'edit'){
          val.storeId = this.cur_edit_id;
      }
      if(type == 'add'){
          val.goodsSource = curStoreType
      }
      //   if(curStoreType==goodsSource['JOIN']){
      //       val.supplierTypes = [val.supplierTypes];
      //   }
      this.operate(val, type);
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
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
          params: { pageSize: pageSize }
      });
      this.get_list({ pageSize: pageSize });
  };

  render() {
      const { selectedRows, columns, initLoading, data, submiting, addData, modalVisible, title, search_data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('自营店铺')}${sldComLanguage('管理')}`, 0, 0, 5)}{/*自营店铺管理 */}
              <AuthBtn eventKey={["view_own_store"]} btnAuth={btnAuth} showPage>
                  <div className={global.tableListForm}>
                      <Search
                          search_data={search_data}
                          seaSubmit={(datas) => this.search(datas)}
                          seaReset={() => this.seaReset()}
                      />
                  </div>
                  <div className={global.operate_bg}>
                      <AuthBtn eventKey={["add_third_store"]} btnAuth={btnAuth}>
                          {sldIconBtn(() => this.add(goodsSource.JOIN), `${sldComLanguage('新增自营接入店铺')}`, 7, 7)}
                      </AuthBtn>
                      <AuthBtn eventKey={["add_hand_store"]} btnAuth={btnAuth}>

                          {sldIconBtn(() => this.add(goodsSource.HANDWORK), `${sldComLanguage('新增自营手工店铺')}`, 7, 7)}
                      </AuthBtn>
                  </div>
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          totalHeight={document.body.clientHeight-140-20-40}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="storeId"
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

              </AuthBtn>
              {/*新增/编辑对话框-start*/}
              <SldModal
                  title={title}
                  submiting={submiting}
                  width={500}
                  modalVisible={modalVisible}
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={addData}
              />
              {/*新增/编辑对话框-end*/}

          </div>

      );
  }
}
