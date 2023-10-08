import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch } from 'antd';
import {
    sldIconBtn,
    failTip,
    sucTip,
    sldPopConfirmDiy,
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    formItemLayoutModal,
    validatorNumbe,
    getTableNum,
    sldComLanguage,
    getAuthBtn,
    hasAuth,
    sldtbaleOpeBtnText,
    getSldCopyData,
    sldLlineRtextAddGoodsAddMargin,
    sldIconBtnBg,
    sldSearchValClear
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ product }) => ({
    product
}))
@Form.create()
export default class SearchAttr extends Component {
  cur_edit_id = '';
    
  constructor(props) {
      super(props);
      this.state = {
          query: props.location.query,
          search_con: '',//搜索框内容
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
              label: `${sldComLanguage('属性名称')}`,
              name: 'parameterName',
              extra: `${sldComLanguage('最多输入6个字')}`,
              placeholder: `${sldComLanguage('请输入属性名称')}`,
              initialValue: '',
              maxLength:6,
              rules: [{
                  required: true,
                  whitespace: true,
                  message: `${sldComLanguage('请输入属性名称')}`
              }]
          },{
              type: 'attr_tags',
              label: `${sldComLanguage('属性值')}`,
              extra: `${sldComLanguage('最多可添加20个，每个属性值最多可以输入10个字，且不可重复')}`,
              disable: true,
              name: 'attribute',
              placeholder: `${sldComLanguage('请输入属性值')}`,
              initialValue: '',
              inputVisible:false,
              handleClose:this.handleTagClose,//删除tag事件
              showInput:this.showTagInput,//tag点击添加事件
              tip_con:`${sldComLanguage('添加属性值')}`,
              required: true,//是否必填
              tags:[],//已经添加的tag数组
              inputValue:'',//当前tag输入的内容
              handleInputChange:this.handleTagInputChange,//当前tag输入事件
              handleInputConfirm:this.handleTagInputConfirm//当前tag输入完成事件
          }, {
              type: 'inputnum',
              label: `${sldComLanguage('排序')}`,
              name: 'sort',
              extra: `${sldComLanguage('请输入0~255的数字,数字越小顺序越靠前')}`,
              placeholder: `${sldComLanguage('请输入排序')}`,
              initialValue: '',
              rules: [{
                  required: true,
                  message: `${sldComLanguage('排序必填')}`
              }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }]
          }, {
              type: 'switch',
              label: `${sldComLanguage('启用')}`,
              name: 'isShow',
              placeholder: ``,
              initialValue: 1
          }
          ],//modal框的数据
          formValues: {},//搜索条件
          columns: [
              {
                  title: ' ',
                  dataIndex: 'parameterId',
                  align: 'center',
                  width: 30,
                  render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
              },
              {
                  title: `${sldComLanguage('属性名称')}`,
                  dataIndex: 'parameterName',
                  align: 'center',
                  width: 100
              },
              {
                  title: `${sldComLanguage('属性值')}`,
                  dataIndex: 'parameterValues',
                  align: 'center',
                  width: 150,
                  render:(text)=>text&&text.join(',')
              },
              {
                  title: `${sldComLanguage('排序')}`,
                  dataIndex: 'sort',
                  align: 'center',
                  width: 80
              },
              {
                  title: `${sldComLanguage('启用状态')}`,
                  dataIndex: 'isShow',
                  align: 'center',
                  width: 80,
                  render: (text, record) => (
                      <Switch
                          disabled={!hasAuth('attribute_parameter_edit')}
                          checkedChildren={`${sldComLanguage('启用')}`}
                          onChange={(checked) => this.operateAttr({...record,isShow:checked?1:0}, 'edit')}
                          unCheckedChildren={`${sldComLanguage('停用')}`}
                          checked={text == 1 ? true : false}
                          valuepropname="checked"
                      />
                  )
              },
              {
                  title: `${sldComLanguage('操作')}`,
                  align: 'center',
                  width: 100,
                  render: (text, record) => (

                      <Fragment>
                          <AuthBtn eventKey={[`attribute_parameter_edit`]} btnAuth={btnAuth}>
                              {sldtbaleOpeBtnText('编辑', () => this.editAttr(record))}
                          </AuthBtn>
                          <span className={global.splitLine} />
                          {/*删除后不可恢复，是否确定删除？*/}
                          <AuthBtn eventKey={[`attribute_parameter_del`]} btnAuth={btnAuth}>
                              {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateAttr(record.parameterId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                  sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                          </AuthBtn>
                      </Fragment>
                  )
              }
          ]
      };
  }

 
  //当前操作数据id
  componentDidMount() {
      this.get_list({ pageSize: pageSize });
  }

  //删除tag事件
  handleTagClose = (removedTag) => {
      let {operateData} = this.state;
      let tar_data = operateData.filter(item=>item.name == 'attribute')[0];
      let tar_tag_data = tar_data.tags.filter(tag => tag !== removedTag);
      tar_data.tags = tar_tag_data;
      this.setState({operateData})
  }

  //tag点击添加事件
  showTagInput = () => {
      let {operateData} = this.state;
      let tar_data = operateData.filter(item=>item.name == 'attribute')[0];
      tar_data.inputVisible = true;
      this.setState({operateData})
  }

  //当前tag输入事件
  handleTagInputChange = (e) => {
      let {operateData} = this.state;
      let tar_data = operateData.filter(item=>item.name == 'attribute')[0];
      tar_data.inputValue = e.target.value;
      this.setState({operateData})
  }

  //当前tag输入完成事件
  handleTagInputConfirm = () => {
      let {operateData} = this.state;
      let tar_data = operateData.filter(item=>item.name == 'attribute')[0];
      tar_data.inputValue = tar_data.inputValue.trim();
      if(!tar_data.inputValue){
          failTip(`${sldComLanguage('属性值不可为空～')}`);
          return false;
      }
      if(tar_data.tags.length>=20){
          failTip(`${sldComLanguage('属性值最多可添加20个～')}`);
          return false;
      }
      if(tar_data.tags.indexOf(tar_data.inputValue)>-1){
          failTip(`${sldComLanguage('属性值不可以重复～')}`);
          return false;
      }
      tar_data.tags.push(tar_data.inputValue);
      tar_data.inputVisible = false;
      tar_data.inputValue = '';
      this.setState({operateData})
  }


  //编辑属性
  editAttr = (val) => {
      let { addData, operateData } = this.state;
      operateData = getSldCopyData(addData);
      for(let i=0;i<operateData.length;i++){
          if(operateData[i].name == 'attribute'){
              operateData[i].tags = val.parameterValues;
          }else{
              operateData[i].initialValue = val[operateData[i].name];
          }
          operateData[i].initialValue = val[operateData[i].name];
      }
      this.cur_edit_id = val.parameterId;//当前操作数据id
      this.setState({
          type: 'edit',
          title: `${sldComLanguage('编辑属性')}`,
          operateData,
          modalVisible: true
      });//编辑属性
  };

  //属性操作  del：删除 stop：停用 start：启用 edit：编辑
  operateAttr = (id, type) => {
      this.setState({ submiting: true });
      const { params } = this.state;
      const { dispatch } = this.props;
      let dis_type = '';
      let param_data = {};
      if (type == 'del') {
          dis_type = 'product/del_attribute';
          param_data.parameterId = id;
      } else if (type == 'edit') {
          dis_type = 'product/edit_attribute';
          param_data = id;
      } else if (type == 'stop' || type == 'start') {
          dis_type = 'product/edit_attribute';
          param_data.isShow = type == 'stop' ? 0 : 1;
          param_data.parameterId = id;
      }
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
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

  //添加属性
  addAttr = () => {
      let { addData, operateData } = this.state;
      operateData = getSldCopyData(addData);
      let attr_data = operateData.filter(item=>item.name == 'attribute')[0];
      attr_data.inputVisible = false;
      attr_data.tags = [];
      attr_data.inputValue = '';
      this.setState({
          modalVisible: true,
          type: 'add',
          title: `${sldComLanguage('添加属性')}`,
          operateData
      });//添加属性
  };

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      params.pageIndex = params.currentPage||1;
      dispatch({
          type: 'product/get_attribute_lists',
          payload: {...params,groupIds:[this.state.query.id]},
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
      const { type,query,operateData } = this.state;
      const { dispatch } = this.props;
      let _this = this;
      val.isShow = val.isShow ? 1 : 0;
      //检测属性值必填
      let attr_data = operateData.filter(item=>item.name == 'attribute')[0];
      if(attr_data.tags.length == 0){
          failTip(`${sldComLanguage('属性值必填～')}`);
          return false;
      }
      val.parameterValues = attr_data.tags;
    
      this.setState({ submiting: true });
      if (type == 'edit') {
          val.parameterId = this.cur_edit_id;
          val.groupId = query.id;
          this.operateAttr(val, 'edit');
      } else {
          val.groupId = query.id;
          dispatch({
              type: 'product/add_attribute',
              payload: val,
              callback: (res) => {
                  if (res.state == 200) {
                      sucTip(res.msg);
                      _this.get_list({ pageSize: pageSize });
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

  //搜索框内容的变化
  sldSearChange = (val) => {
      this.setState({
          search_con: val.target.value
      });
  };

  //清空搜索内容
  sldSearClear = () => {
      this.setState({
          search_con: ''
      });
      this.sldSearch('');
  };

  //搜索
  sldSearch = (val) => {
      let { params, formValues } = this.state;
      params.parameterName = val;
      formValues.parameterName = val;
      this.setState({ pageSize: pageSize, ...formValues,params: { pageSize: pageSize } });
      this.get_list(params);
  };

  render() {
      const { selectedRows, columns, initLoading, data, submiting, operateData, modalVisible, title, search_con } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('属性管理')}`, 0, 0, 5)}
                  {sldIconBtnBg(() => {this.props.history.goBack()}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              <div className={global.operate_bg} style={{marginTop:'10px'}}>
                  <AuthBtn eventKey={[`attribute_parameter_add`]} btnAuth={btnAuth}>
                      {sldIconBtn(() => this.addAttr(), `${sldComLanguage('添加属性')}`, 7, 7)}
                  </AuthBtn>
                  {/*请输入属性名称     搜索*/}
                  {sldSearchValClear(`${sldComLanguage('请输入属性名称')}`, 291, this.sldSearch, `${sldComLanguage('搜索')}`, search_con, this.sldSearChange, this.sldSearClear, 65)}
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      totalHeight={document.body.clientHeight - 150 - 25}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="parameterId"
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
                  maxLengthLimit={20}
                  width={500}
                  Promotion_flash_sale
                  modalVisible={modalVisible}
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={operateData}
              />
              {/*新增/编辑对话框-end*/}

          </div>

      );
  }
}
