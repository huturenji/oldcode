import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    Form,
    Select,
    Tag,
    Icon,
    Button,
    Input,
    InputNumber,
    DatePicker,
    Modal,
    Checkbox,
    Switch,
    Cascader,
    TreeSelect,
    Radio,
    Upload,
    Tabs,
    Tree,
    Timeline,
    AutoComplete,
    Spin 
} from 'antd';
import global from '../../global.less';
import {
    sldLlineRtextAddGoods,
    failTip,
    sldIconBtnBg,
    getSldEmptyH,
    sldSearchVal,
    sldTsvg,
    sldInputAfterAddons,
    sldBeforeUpload,
    sldSearchValClear,
    getLocalStorageStingVal,
    sldComLanguage
} from '@/utils/utils';
import StandardTable from '@/components/StandardTable';
import { TwitterPicker, SketchPicker } from 'react-color';
import styles from './SldModal.less';
import SldReactQuill from '@/components/SldReactQuill';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;
const Dragger = Upload.Dragger;
const TabPane = Tabs.TabPane;
const options = [
    {
        value1: 'zhejiang',
        label1: 'Zhejiang',
        isLeaf: false,
        children:[]
    },
    {
        value1: 'jiangsu',
        label1: 'Jiangsu',
        isLeaf: false,
        children:[]
    }
];
@Form.create()
export default class SldModal extends Component {
    init_flag = false;
    
    constructor(props) {
        super(props);
        this.state = {
            options,
            showColorPicker: false,//是否展示颜色选择器
            rowId: '',//选中行的id
            selectedRowKeys: [],
            tags: props.tags != undefined ? props.tags : [],
            inputVisible: false,
            inputValue: ''

        };
    }


    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modalVisible && !this.props.modalVisible && nextProps.tags != undefined && !this.init_flag) {
            //只有当前显示，上次是关闭的情况下才有必要更新子组件
            this.setState({ tags: nextProps.tags });
            this.init_flag = true;
        }
        //无法直接滚动到底部，暂时采用这种方式解决
        if (this.scrollRef && !nextProps.scrToBottom && this.props.scrToBottom) {
            this.scrollRef.scrollToBottom();
        }
        if (nextProps.scrToBottom) {
            this.props.resetScroll();
        }

    }

  //颜色选择器展示事件
  showColorPicker = () => {
      let {showColorPicker} = this.state
      this.setState({
          showColorPicker: !showColorPicker
      });

  };

  //SketchPicker  颜色选择器展示事件
  showMoreColorPicker = (flag, item) => {
      if (item.callbackShow) {
          item.callbackShow(flag);
      }
  };

  //选择颜色事件
  sldHandleColor = (color) => {
      if (this.props.setColorPicker) {
          this.props.setColorPicker(color.hex);
      }
  };

  //SketchPicker  选择颜色事件
  sldHandleMoreColor = (color, item) => {
      if (item.callback) {
          item.callback(color);
      }
  };

  //确定事件
  sldConfirm = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
              if (this.props.tags != undefined) {
                  values.tags = this.state.tags;
                  this.init_flag = false;
              }
              this.props.sldHandleConfirm(values);

          }
      });
  };

  redioOnChange = (e, val) => {
      if (val.onChange) {
          val.onChange(e.target.value);
      }
  };

  //取消事件-清空表单
  sldCancle = () => {
      this.props.form.resetFields();
      this.props.sldHandleCancle();
      this.init_flag = false;
  };

  //下拉选择事件变动
  sldHandSeleChange = (items, value) => {
      if (items.sldChange) {
          items.sldChange(value);
      }
  };

  //blur事件
  inputBlur = (items, value) => {
      if (items.inputBlur) {
          items.inputBlur(value);
      }
  };

  cascaderCommonChange = (value, selectedOptions, items) => {
      if (items.onChange) {
          items.onChange(selectedOptions);
      }
  };

  //图品的点击预览
  sldShowImgPre = (items) => {
      if (items.preView) {
          items.preView(true, items.content);
      }
  };

  //表格添加事件
  addTableRow = (items) => {
      if (items.addRow) {
          items.addRow();
      }
  };

  //多选事件
  sldCheckShop = (items, value) => {
      if (items.sldCheckShop) {
          items.sldCheckShop(value);
      }
  };

  handleTableChange = (pagination, filters, sorter, items) => {
      if (items) {
          items.onChange(pagination, filters, sorter);
      }
  };

  //校验两次密码是否一样
  checkConfirm = (rule, value, callback) => {
      const { form } = this.props;
      if (value && value !== form.getFieldValue('new_login_password')) {
          callback(`${sldComLanguage('两次密码不一致，请重新输入')}`);
      } else {
          callback();
      }
  };

  radio_select = (e, item) => {
      if (item.callback) {
          item.callback(e);
      }
  };

  //表格单行点击事件
  sldHandleRow = (record, index, items, rowKey) => {
      items(record);
      if (rowKey == 'id') {
          this.setState({
              rowId: record.id
          });
      } else if (rowKey == 'specId') {
          this.setState({
              rowId: record.specId
          });
      } else if (rowKey == 'brandId') {
          this.setState({
              rowId: record.brandId
          });
      } else if (rowKey == 'attributeId') {
          this.setState({
              rowId: record.attributeId
          });
      }
  };

  //设置选中行的背景色
  setRowClassName = (rowKey, record) => {
      let cur_id = '';
      if (rowKey == 'id') {
          cur_id = record.id;
      } else if (rowKey == 'specId') {
          cur_id = record.specId;
      } else if (rowKey == 'brandId') {
          cur_id = record.brandId;
      } else if (rowKey == 'attributeId') {
          cur_id = record.attributeId;
      }
      return cur_id === this.state.rowId ? 'seleSingle' : '';
  };

  handleClose = (removedTag) => {
      let {tags} = this.state
      tags = tags.filter(tag => tag !== removedTag);
      this.setState({ tags });
  };

  showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
      this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
      const state = this.state;
      const inputValue = state.inputValue * 1;
      let tags = state.tags;
      //必须是整数，大于等于0，小于等于24，
      if (!(/^\d+$/.test(inputValue) && inputValue >= 0 && inputValue <= 24)) {
          failTip(`${sldComLanguage('请输入0-24的整点')}`);
      } else if (inputValue && tags.indexOf(inputValue) === -1) {
          tags = [...tags, inputValue];
      } else {
          failTip(`${sldComLanguage('该值已经存在，请重新输入')}`);
      }

      this.setState({
          tags,
          inputVisible: false,
          inputValue: ''
      });
  };

  saveInputRef = input => this.input = input;

  loadData = (selectedOptions,items) => {
      if(items.loadData){
          items.loadData(selectedOptions)
      }
  };

  //获取每个item的内容
  getItem = (items, index) => {
      const { getFieldDecorator } = this.props.form;
      const { formItemLayoutModal,maxLengthLimit } = this.props;
      const { tags, inputVisible, inputValue } = this.state;
      const uploadButton = (
          <div>
              <Icon type="plus" />
              <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
          </div>
      );

      if (items.type == 'input') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {typeof (items.input_type) != 'undefined' && items.input_type == 'password' && (typeof (items.disable) == 'undefined' || (typeof (items.disable) != 'undefined' && !items.disable)) && getFieldDecorator(items.name, {
                  initialValue: items.initialValue,
                  rules: items.rules
              })(
                  <Input maxLength={items.maxLength!=undefined&&items.maxLength?items.maxLength:250} type="password" placeholder={items.placeholder} />,
              )}
              {typeof (items.input_type) != 'undefined' && items.input_type == 'password' && typeof (items.disable) != 'undefined' && items.disable && getFieldDecorator(items.name, {
                  initialValue: items.initialValue,
                  rules: items.rules
              })(
                  <Input maxLength={250} disabled placeholder={items.placeholder} />,
              )}

              {typeof (items.input_type) == 'undefined' && (typeof (items.disable) == 'undefined' || (typeof (items.disable) != 'undefined' && !items.disable)) && getFieldDecorator(items.name, {
                  initialValue: items.initialValue,
                  rules: items.rules
              })(
                  <Input maxLength={items.maxLength!=undefined&&items.maxLength?items.maxLength:250} placeholder={items.placeholder} />,
              )}

              {typeof (items.input_type) == 'undefined' && typeof (items.disable) != 'undefined' && items.disable && getFieldDecorator(items.name, {
                  initialValue: items.initialValue,
                  rules: items.rules
              })(
                  <Input maxLength={250} disabled placeholder={items.placeholder} />,
              )}

          </FormItem>;
      } if(items.type == 'autoInput'){
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, {
                  initialValue: items.initialValue,
                  rules: items.rules
              })(
                  <AutoComplete 
                      maxLength={250}
                      onSearch={(value) => this.sldHandSeleChange(items, value)}
                      onBlur={(value) => this.inputBlur(items, value)} 
                      placeholder={items.placeholder}
                      dataSource={items.dataSource}
                  />,
              )}

          </FormItem>;

      }if(items.type == 'onlytxt'){
          return <div
              key={index}
              style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: this.props.width ? this.props.width : 416,
                  marginBottom: 20,
                  paddingLeft: this.props.width * 0.15
              }}
          >
              <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  color: items.fontColor,
                  width: (items.right) / 24 * (this.props.width ? this.props.width : 416),
                  fontSize: items.fontSize,
                  marginBottom: 10
              }}
              >{items.content}</div>
              <span style={{ display: 'inline-block', width: (items.right) / 24 * (this.props.width ? this.props.width : 416), height: 1, backgroundColor: items.bgcColor }} />
          </div>;
      } if (items.type == 'textarea') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <TextArea
                      maxLength={items.maxLength!=undefined&&items.maxLength?items.maxLength:99999999}
                      disabled={items.is_disable != undefined && items.is_disable ? true : false}
                      style={{ minHeight: 32 }}
                      rows={4}
                      placeholder={items.placeholder}
                  />,
              )}
          </FormItem>;
      } if (items.type == 'inputnum') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <InputNumber
                      step={items.step != undefined ? items.step : 1}
                      style={{ width: '100%' }}
                      placeholder={items.placeholder}
                      min={items.min != undefined ? items.min : 0}
                      max={items.max != undefined ? items.max : 99999999}
                      precision={items.precision != undefined ? items.precision : 0}
                      disabled={items.disable != undefined ? items.disable : false}
                  />,
              )}
          </FormItem>;
      } if (items.type == 'show_content') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <div>{items.content}</div>
          </FormItem>;
      } if (items.type == 'show_img') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
          >
              <div className={global.flex_row_common} style={{ width: items.width, height: items.height }}>
                  <img className={global.show_img} src={items.initialValue} />
              </div>
          </FormItem>;
      } if (items.type == 'show_content_map') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {items.content.length > 0 &&
                  items.content.map((val, key) => <div key={key}>{val}</div>)
              }
          </FormItem>;
      } if (items.type == 'show_image') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
          >
              <div
                  onClick={() => this.sldShowImgPre(items)}
                  style={{ width: items.width, height: items.height, overflow: 'hidden' }}
              >
                  <img
                      style={{ maxWidth: '100%', maxHeight: '100%' }}
                      src={items.content}
                  />
              </div>
          </FormItem>;
      } if (items.type == 'show_editor_con') {
          return <div key={index} className={global.show_editor_con}>
              
              <div 
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                      __html: items.content
                  }}
              />
          </div>;
      } if (items.type == 'show_content_table') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <Scrollbars
                  autoHeight
                  autoHeightMin={100}
                  autoHeightMax={200}
              >
                  <StandardTable
                      width={items.width}
                      selectedRows={[]}
                      rowKey={items.rowKey}
                      data={{ list: items.data, pagination: {} }}
                      isCheck={false}
                      columns={items.columns}
                      sldpagination={false}
                  />
              </Scrollbars>


          </FormItem>;
      } if (items.type == 'color_picker') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <div
                  onClick={() => this.showColorPicker(items)}
                  className={global.flex_com_row_start_center}
              >
                  {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                      <Input maxLength={250} disabled style={{ width: 150 }} placeholder={items.placeholder} />,
                  )}
                  <span style={{
                      width: 30,
                      height: 30,
                      display: 'inline-block',
                      backgroundColor: items.initialValue,
                      marginLeft: 10,
                      borderRadius: 4
                  }}
                  />
              </div>
              {items.is_show && (
                  <TwitterPicker
                      colors={['#D0AAFF', '#98BFFE', '#73E5FF', '#B1E788', '#FFF17A', '#FFBB7C', '#FFA5AD', '#FEC5E8', '#C2C2C2', '#8187e0']}
                      color={items.initialValue}
                      onChange={(color) => this.sldHandleColor(color, items)}
                      style={{ marginTop: 20 }}
                  />
              )}
          </FormItem>;
      } if (items.type == 'more_color_picker') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <div className={styles.show_color_wap}>
                  <div className={styles.show_color} onClick={() => this.showMoreColorPicker(true, items)}>
                      <span style={{ backgroundColor: items.initialValue }} />
                  </div>
              </div>
              {items.is_show && (
                  <div className={styles.color_picker_wrap}>
                      <div className={styles.color_picker_mask} onClick={() => this.showMoreColorPicker(false, items)} />
                      <SketchPicker
                          color={items.initialValue}
                          onChangeComplete={(e) => this.sldHandleMoreColor(e.hex, items)}
                      />
                  </div>
              )}
          </FormItem>;
      } if (items.type == 'select') {
          if (items.is_show == 'true') {
              return <FormItem
                  key={index}
                  {...formItemLayoutModal}
                  label={items.label}
                  help={items.help}
                  extra={items.extra}
              >
                  {getFieldDecorator(items.name, {
                      initialValue: items.initialValue ? items.initialValue : (items.sel_data.length > 0 ? items.sel_data[0].key : ''),
                      rules: items.rules
                  })(
                      <Select
                          disabled={items.disable != undefined ? items.disable : false}
                          allowClear={items.allowClear != undefined ? items.allowClear : false}
                          onChange={(value) => this.sldHandSeleChange(items, value)}
                          placeholder={items.placeholder}
                          style={{ width: '100%' }}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                          {items.sel_data.map((itemss, indexss) => <Option
                              key={indexss}
                              value={items.diy != undefined && items.diy ? itemss[items.sele_key] : itemss.key}
                          >{items.diy != undefined && items.diy ? itemss[items.sele_name] : itemss.name}</Option>)}
                      </Select>,
                  )}
              </FormItem>;
          } if (items.is_show == 'false') {
              return '';
          } if (!items.is_show) {
              return <FormItem
                  key={index}
                  {...formItemLayoutModal}
                  label={items.label}
                  help={items.help}
                  extra={items.extra}
              >
                  {getFieldDecorator(items.name, {
                      initialValue: items.initialValue ? items.initialValue : (items.sel_data.length > 0 ? items.sel_data[0].key : ''),
                      rules: items.rules
                  })(
                      <Select
                          disabled={items.disable != undefined ? items.disable : false}
                          allowClear={items.allowClear != undefined ? items.allowClear : false}
                          onChange={(value) => this.sldHandSeleChange(items, value)}
                          placeholder={items.placeholder}
                          style={{ width: '100%' }}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                          {items.sel_data.map((itemss, indexss) => <Option
                              key={indexss}
                              value={items.diy != undefined && items.diy ? itemss[items.sele_key] : itemss.key}
                          >{items.diy != undefined && items.diy ? itemss[items.sele_name] : itemss.name}</Option>)}
                      </Select>,
                  )}
              </FormItem>;
          }

      } else if (items.type == 'switch') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, {
                  valuePropName: 'checked',
                  initialValue: items.initialValue * 1 ? true : false,
                  rules: items.rules
              })(
                  <Switch />,
              )}
          </FormItem>;
      } else if (items.type == 'edittable') {
          return <Fragment key={index}>
              <div style={{ marginBottom: 10, textAlign: 'right', marginTop: -30 }}><Button
                  type="primary"
                  onClick={() => this.addTableRow(items)}
                  size="default"
              >{items.btn_text}</Button>
              </div>
              <StandardTable
                  selectedRows={[]}
                  rowKey="key"
                  scroll={items.scroll}
                  data={{ list: items.dataSource, pagination: {} }}
                  isCheck={false}
                  columns={items.columns}
                  sldpagination={false}
              /></Fragment>;
      } else if (items.type == 'cascader') {
      //三级地区选择器
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <Cascader
                      options={items.sldarealist}
                      placeholder={items.placeholder}
                  />,
              )}
          </FormItem>
          );

      } else if (items.type == 'cascader_common') {
      //多级联动选择器-通用
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <Cascader
                      options={items.data}
                      fieldNames={items.fieldNames != undefined ? items.fieldNames : {
                          label: 'label',
                          value: 'value',
                          children: 'children'
                      }}
                      onChange={(value, selectedOptions) => this.cascaderCommonChange(value, selectedOptions, items)}
                      placeholder={items.placeholder}
                  />,
              )}
          </FormItem>
          );

      } else if (items.type == 'cascader_common_load') {
      //多级联动选择器-通用-一级一级获取，动态加载
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <Cascader
                      placeholder={items.placeholder}
                      options={items.data}
                      fieldNames={items.fieldNames != undefined ? items.fieldNames : {
                          label: 'label',
                          value: 'value',
                          children: 'children'
                      }}
                      loadData={(selectedOptions)=>this.loadData(selectedOptions,items)}
                      onChange={(value, selectedOptions)=>this.cascaderCommonChange(value, selectedOptions, items)}
                      changeOnSelect
                  />,
              )}
          </FormItem>
          );

      } else if (items.type == 'checkboxgroup') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <CheckboxGroup options={items.sldOptions} onChange={(value) => this.sldCheckShop(items, value)} />,
              )}
          </FormItem>;
      } else if (items.type == 'TreeSelect') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
          >
              {getFieldDecorator(items.name, {
                  initialValue: items.initialValue == '' ? undefined : items.initialValue,
                  rules: items.rules
              })(
                  <TreeSelect
                      disabled={items.disabled != undefined ? items.disabled : false}
                      style={{ width: '100%' }}
                      treeData={items.data}
                      showSearch
                      placeholder={items.placeholder}
                      allowClear={items.allowClear}
                      onSelect={items.onSelect}
                      dropdownStyle={{maxHeight:300}}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                  />,
              )}
          </FormItem>;
      } else if (items.type == 'TreeSelectAll') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <TreeSelect
                      style={{ width: '100%' }}
                      treeData={items.data}
                      showSearch
                      placeholder={items.placeholder}
                      allowClear={items.allowClear}
                      onSelect={items.onSelect}
                      dropdownStyle={{maxHeight:300}}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                      {/* eslint-disable-next-line react/self-closing-comp */}
                      {items.data.map((val) => <TreeSelect.TreeNode
                          value={val.sellerName}
                          title={val.sellerName}
                          key={val.id}
                      ></TreeSelect.TreeNode>)}
                  </TreeSelect>,
              )}
          </FormItem>;
      } else if (items.type == 'TreeSelectDIy') {
          return <FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, {
                  initialValue: items.initialValue == '' ? undefined : items.initialValue,
                  rules: items.rules
              })(
                  <TreeSelect
                      style={{ width: '100%' }}
                      showSearch
                      placeholder={items.placeholder}
                      allowClear={items.allowClear}
                      onSelect={items.onSelect}
                      dropdownStyle={{maxHeight:300}}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                      {items.data.map((val) => <TreeSelect.TreeNode
                          value={val[items.sele_name]}
                          title={val[items.sele_name]}
                          key={val[items.sele_key]}
                          extra={val}
                      >
                          {val.children != undefined && val.children.length > 0 && val.children.map((val_child) => <TreeSelect.TreeNode
                              value={val_child[items.sele_name]}
                              title={val_child[items.sele_name]}
                              key={val_child[items.sele_key]}
                              extra={val_child}
                          />)}
                      </TreeSelect.TreeNode>)}
                  </TreeSelect>,
              )}
          </FormItem>;
      } else if (items.type == 'search_add_table') {
          const rowKey = items.rowKey;
          return <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10
              }}
              >
                  {sldSearchVal(`${sldComLanguage('请输入搜索内容')}`, 300, items.search, true, items.search_value, items.searchCon)}
                  {items.add != '' &&
          sldIconBtnBg(items.add, 'jiahao-', `${sldComLanguage('新增')}`, '#fff', 7, 0, 18, 18, 4)
                  }
              </div>
              <StandardTable
                  selectedRows={items.selectedRows}
                  data={items.table}
                  rowKey={rowKey}
                  rowClassName={(record) => this.setRowClassName(rowKey, record)}
                  onRow={(record, index1) => ({
                      onClick: () => {
                          this.sldHandleRow(record, index1, items.onSldHandleSeleRow, rowKey);
                      }
                  })}
                  isCheck={items.isCheck}
                  columns={items.columns}
                  onSelectRow={items.handleSelectRows}
                  onChange={items.onChange}
                  onSldHandleSeleRow={items.onSldHandleSeleRow}
              />
              {this.props.showItemDetail &&
        <Fragment>
            {sldLlineRtextAddGoods('#69A2F2', items.detail_data.tip)}
            {getSldEmptyH(15)}
            <StandardTable
                selectedRows={items.detail_data.selectedRows}
                data={items.detail_data.table}
                rowKey={items.detail_data.rowKey}
                onRow={(record, index1) => ({
                    onClick: () => {
                        this.sldHandleRow(record, index1, items.detail_data.onSldHandleSeleRow, items.detail_data.rowKey);
                    }
                })}
                isCheck={items.detail_data.isCheck}
                columns={items.detail_data.columns}
                onSelectRow={items.detail_data.handleSelectRows}
                onChange={items.detail_data.onChange}
            />
        </Fragment>
              }
          </div>;
      } else if (items.type == 'modal_table_sele') {
          const rowKey = items.rowKey;
          return <div key={index} style={{ display: 'flex', flexDirection: 'column' }} className={styles.sld_modal}>
              {sldSearchValClear(items.topSeaplaceHolder, 300, items.search, `${sldComLanguage('搜索')}`, items.search_value, items.searchCon, items.searchClear, items.search_right != undefined ? items.search_right : 545)}
              {getSldEmptyH(6)}
              <StandardTable
                  selectedRows={items.selectedRows}
                  selectedRowKeys={items.selectedRowKeys}
                  data={items.table}
                  rowKey={rowKey}
                  sldpagination
                  isCheck={items.isCheck}
                  columns={items.columns}
                  onSelectRow={items.handleSelectRows}
                  onSldHandleSeleRow={items.onSldHandleSeleRow}
                  onChange={items.onChange}
                  flag_show_sele_data
              />
          </div>;
      } else if (items.type == 'tag_muilty_search') {
      //标签样式  多选 带搜索
          return <Select
              key={index}
              mode="multiple"
              allowClear={items.allowClear}
              style={{ width: '100%' }}
              onChange={items.sldSeleChange}
              placeholder={items.placeholder}
              defaultValue={items.defaultValue}
              value={items.value}
              getPopupContainer={triggerNode => triggerNode.parentNode}
          >
              {items.data.map((itemss, indexss) => <Option key={indexss} value={itemss.name}>{itemss.name}</Option>)}
          </Select>;

      } else if (items.type == 'table') {
          return <div key={index} style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
              <StandardTable
                  selectedRows={items.selectedRows}
                  data={items.table}
                  rowKey={items.rowKey}
                  isCheck={items.isCheck}
                  columns={items.columns}
                  onSelectRow={items.handleSelectRows}
                  sldpagination={false}
              />
          </div>;
      } else if (items.type == 'scroll_table') {
      //可以滚动的表格
          return <div key={index} style={{ display: 'flex', flexDirection: 'column',padding:10,paddingTop:5 }}>
              <Scrollbars
                  autoHeight
                  autoHeightMin={100}
                  autoHeightMax={300}
              >
                  <StandardTable
                      width={items.width}
                      selectedRows={[]}
                      rowKey={items.rowKey}
                      data={{ list: items.data, pagination: {} }}
                      isCheck={false}
                      columns={items.columns}
                      sldpagination={false}
                  />
              </Scrollbars>
          </div>;
      } else if (items.type == 'input_after') {
      //带图标后缀
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <div onClick={() => items.callback(items.operate_obj)}>
                  {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                      <Input
                          maxLength={250}
                          disabled
                          addonAfter={sldInputAfterAddons()}
                          placeholder={items.placeholder}
                      />,
                  )}
              </div>
          </FormItem>);
      } else if (items.type == 'text') {
          return <div
              key={index}
              style={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: this.props.width ? this.props.width : 416,
                  marginBottom: 10
              }}
          >
              <div style={{
                  display: 'flex',
                  fontSize: 14,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  width: (items.left) / 24 * (this.props.width ? this.props.width : 416),
                  color: 'rgba(0,0,0,0.85)',
                  lettreSpace: 2,
                  paddingRight: 5
              }}
              >{items.label}</div>
              <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  width: (items.right) / 24 * (this.props.width ? this.props.width : 416),
                  color: 'rgba(0,0,0,0.65)',
                  fontSize: 14
              }}
              >{items.initialValue}</div>
          </div>;
      } else if (items.type == 'single_checkbox') {
      //选择框
          return (
              <FormItem
                  key={index}
                  {...formItemLayoutModal}
                  label={items.label}
                  help={items.help}
                  extra={items.extra}
              >
                  {getFieldDecorator(items.name, {
                      valuePropName: 'checked',
                      initialValue: items.initialValue,
                      rules: items.rules
                  })(
                      <Checkbox onChange={(e) => {
                          if (items.callback) {items.callback(e);}
                      }}
                      >
                          {items.check_con}
                      </Checkbox>,
                  )}
              </FormItem>
          );
      } else if (items.type == 'show_subtitle') {
      //左侧一条数线，右侧文字，起到标题的左右
          return (
              <div
                  key={index}
                  style={{
                      marginTop: items.distance.top,
                      marginLeft: items.distance.left,
                      marginRight: items.distance.right,
                      marginBottom: items.distance.bottom
                  }}
              >
                  {sldLlineRtextAddGoods(items.color, items.name)}
              </div>
          );
      } else if (items.type == 'radio_select') {
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <Radio.Group
                      size="small"
                      buttonStyle="solid"
                      disabled={items.disable}
                      onChange={(e) => this.radio_select(e, items)}
                  >
                      {items.data.map((val, key) => <Radio.Button key={key} value={val.key}>{val.value}</Radio.Button>)}

                  </Radio.Group>,
              )}
          </FormItem>);
      } else if (items.type == 'rangepicker') {
      //时间范围选择器
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, { initialValue: items.initialValue, rules: items.rules })(
                  <RangePicker
                      showTime={items.show_time != undefined ? items.show_time : false}
                      style={{ width: '100%' }}
                      placeholder={[items.placeholder1, items.placeholder2]}
                      getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                  />,
              )}
          </FormItem>);
      } else if (items.type == 'radio') {
      //radio
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {getFieldDecorator(items.name, {
                  valuePropName: 'checked',
                  rules: items.rules,
                  initialValue: items.initialValue
              })(
                  <RadioGroup
                      size="small"
                      defaultValue={items.initialValue}
                      onChange={(e) => this.redioOnChange(e, items)}
                  >
                      {items.sel_data.map((item, index1) => <Radio key={index1} value={item.key}>{item.name}</Radio>)}
                  </RadioGroup>,
              )}
          </FormItem>
          );
      } else if (items.type == 'quill') {
      //quill富文本编辑器
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <SldReactQuill
                  value={items.initialValue}
                  getRQContent={(val)=>items.handleGetContent(val)}
              />
          </FormItem>);
      } else if (items.type == 'datepicker') {
      //时间选择器
          return (<FormItem
              {...formItemLayoutModal}
              key={index}
              help={items.help}
              extra={items.extra}
              label={items.label}
          >
              {items.initialValue && getFieldDecorator(items.name, {
                  initialValue: items.initialValue,
                  rules: items.rules
              })(
                  <DatePicker
                      showTime={items.show_time != undefined ? items.show_time : false}
                      style={{ width: '100%' }}
                      placeholder={items.placeholder}
                      getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                      className={styles.sld_edit_ope_itme}
                  />,
              )}
              {!items.initialValue && getFieldDecorator(items.name, { rules: items.rules })(
                  <DatePicker
                      showTime={items.show_time != undefined ? items.show_time : false}
                      style={{ width: '100%' }}
                      placeholder={items.placeholder}
                      getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                      className={styles.sld_edit_ope_itme}
                  />,
              )}
          </FormItem>);
      } else if (items.type == 'upload_img_drag') {
      //拖拽上传图片功能，暂时不用，样式不是很好
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <Dragger
                  listType="picture-card"
                  name={items.upload_name}
                  action={items.upload_url}
                  showUploadList
                  onChange={(info) => {
                      items.uploadImg(info);
                  }
                  }
                  onPreview={() => {
                  }}
              >
                  <Icon type="inbox" />
                  <p>{sldComLanguage('点击上传或者拖拽图片到该区域即可上传')}</p>
              </Dragger>
          </FormItem>);
      } else if (items.type == 'upload_img_upload') {

          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={<div className={styles.label_diy_wrap}>{items.required!=undefined&&items.required&&<span className={styles.label_must}>*</span>}{items.label}</div>}
              help={items.help}
              extra={items.extra}
          >
              <Upload
                  withCredentials
                  beforeUpload={sldBeforeUpload}
                  accept=".gif, .jpeg, .png,.jpg,"
                  name={items.upload_name}
                  action={items.upload_url}
                  listType="picture-card"
                  fileList={items.fileList}
                  onPreview={(info) => items.uploadPreview(info)}
                  onChange={(info) => items.uploadChange(info)}
                  onRemove={()=>items.is_disable != undefined && items.is_disable ?false:true}
                  disabled={items.is_disable != undefined && items.is_disable ? true : false}
                  headers={{
                      Authorization: `Bearer ${ getLocalStorageStingVal('token')}`
                  }}
              >
                  {items.fileList.length >= 1 ? null : uploadButton}
              </Upload>
          </FormItem>);
      } else if (items.type == 'flash_change_tags') {
      //专门用于限时抢购的时间点设置
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              <Fragment>
                  {tags.map((tag, index1) => {
                      const tagElem = (
                          <Tag key={tag} closable={index1 >= 0} afterClose={() => this.handleClose(tag)}>
                              {tag}
                          </Tag>
                      );
                      return tagElem;
                  })}
                  {inputVisible && (
                      <Input
                          maxLength={250}
                          ref={this.saveInputRef}
                          type="text"
                          size="small"
                          style={{ width: 78 }}
                          value={inputValue}
                          onChange={this.handleInputChange}
                          onBlur={this.handleInputConfirm}
                          onPressEnter={this.handleInputConfirm}
                      />
                  )}
                  {!inputVisible && (
                      <Tag
                          onClick={this.showInput}
                          style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                          <Icon type="plus" /> {items.tip_con}
                      </Tag>
                  )}
              </Fragment>
          </FormItem>);
      } else if (items.type == 'attr_tags') {
      //专门用于属性
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={<div className={styles.label_diy_wrap}>{items.required!=undefined&&items.required&&<span className={styles.label_must}>*</span>}{items.label}</div>}
              help={items.help}
              extra={items.extra}
          >
              <Fragment>
                  {items.tags.map((tag, index1) => <Tag key={tag} closable={index1 >= 0} onClose={() => items.handleClose(tag)}>
                      {tag}
                  </Tag>)}
                  {items.inputVisible && (
                      <Input
                          maxLength={10}
                          ref={this.saveInputRef}
                          type="text"
                          size="small"
                          style={{ width: 150 }}
                          value={items.inputValue}
                          onChange={items.handleInputChange}
                          onBlur={items.handleInputConfirm}
                          onPressEnter={items.handleInputConfirm}
                      />
                  )}

                  {!items.inputVisible &&items.tags.length<(maxLengthLimit || 11) && (
                      <Tag
                          onClick={items.showInput}
                          style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                          <Icon type="plus" /> {items.tip_con}
                      </Tag>
                  )}
              </Fragment>
          </FormItem>);
      } else if (items.type == 'sele_tpl_type') {
      //选择模板类型
          return <div className={global.sele_tpl_type} key={index}>
              <Tabs
                  activeKey={items.activeKey}
                  tabPosition="left"
                  style={{ height: 220 }}
                  onChange={items.handleTabChange}
              >
                  {items.data_left.length > 0 &&
          items.data_left.map(val => <TabPane tab={val.typeName} key={val.type}>
              <div className={global.right}>
                  {items.data_right.length > 0 &&
                items.data_right.map((value, key) => <div
                    key={key}
                    className={`${global.item} ${items.sele_tpl_info.tplPcId == value.tplPcId ? global.item_select : null}`}
                    onClick={() => items.handle_sele_tpl(value)}
                >
                    <span className={global.sele_flag}>
                        {sldTsvg('xuanzhong', '#ff7e28', 21, 21)}
                    </span>
                    <span className={global.img_wrap}>
                        {/* eslint-disable */}
                        <img src={require(`@/assets/tpl/tplPcId_${ value.tplPcId }.png`)} />
                    </span>
                    <span className={global.title}>{value.name}</span>
                    <span className={global.desc}>{value.desc}</span>
                </div>)
                  }
              </div>
          </TabPane>)
                  }
              </Tabs>
          </div>;
      } else if (items.type == 'sele_instance_tpl') {
      //选择模板类型
          return <div className={global.sele_tpl_type} style={{ marginTop: 0 }} key={index}>
              {items.show_left && <Tabs
                  activeKey={items.activeKey}
                  tabPosition="left"
                  style={{ height: 220 }}
                  onChange={items.handleTabChange}
              >
                  {items.data_left.length > 0 &&
          items.data_left.map(val => <TabPane tab={val.typeName} key={val.type}>
              <div className={global.right_instance}>
                  {items.data_right.length > 0 &&
                items.data_right.map((val, key) => <div
                    key={key}
                    className={`${global.item} ${items.sele_tpl_info.id == val.id ? global.item_select : null}`}
                    onClick={() => items.handle_sele_tpl(val)}
                >
                    <span className={global.sele_flag}>
                        {sldTsvg('xuanzhong', '#0D8CF1', 21, 21)}
                    </span>
                    <div
                        style={{ transform: 'scale(0.7,0.7)' }}
                        dangerouslySetInnerHTML={{ __html: val.html }}
                    />
                </div>)
                  }
              </div>
          </TabPane>)
                  }
              </Tabs>}
              {!items.show_left &&
        <div className={global.right_instance}>
            {items.data_right.length > 0 &&
          items.data_right.map((val, key) => <div
              key={key}
              className={`${global.item} ${items.sele_tpl_info.id == val.id ? global.item_select : null}`}
              onClick={() => items.handle_sele_tpl(val)}
          >
              <span className={global.sele_flag}>
                  {sldTsvg('xuanzhong', '#0D8CF1', 21, 21)}
              </span>
              <div
                  style={{ transform: 'scale(0.7,0.7)' }}
                  dangerouslySetInnerHTML={{ __html: val.html }}
              />
          </div>)
            }
        </div>
              }
          </div>;
      } else if (items.type == 'empty') {
          return getSldEmptyH(items.height);
      } else if (items.type == 'tag_show_btn_sel') {
      //按钮选择 选择的数据tag显示
          return (<FormItem
              key={index}
              {...formItemLayoutModal}
              label={items.label}
              help={items.help}
              extra={items.extra}
          >
              {/*选择的数据展示*/}
              {items.sel_data.length > 0 &&
        items.sel_data.map((val, index) => <div key={index} className={styles.sel_tag}>
            <span>{val[items.main_name]}</span>
            {!(val.allow_close != undefined && !val.allow_close) &&
            <a
                className={styles.del}
                onClick={() => items.del_tag_callback(val[items.main_key], items.name, items.main_key)}
            />
            }
        </div>)
              }
              {/*选择的按钮*/}
              <div style={{ display: 'inline-block' }}>
                  {sldIconBtnBg(() => items.btn_callback(), items.btn_icon, items.btn_text, '#fff', 0, 0, 18, 18, 4)}
              </div>
          </FormItem>);
      }else if (items.type == 'show_express') {
          return <div key={index} style={{ display: 'flex', flexDirection: 'column', marginTop: 0 }}>
              {items.content.expressName && <p className={styles.express_title}>{items.content.expressName}：{items.content.expressNumber}</p>}
              {items.content.routeList.length > 0 &&
          <div style={{ marginLeft: 20,marginRight: 10 }}>
              <Timeline>
                  {items.content.routeList.map((item, index) => <Timeline.Item color="#FF711E" key={index}>
                      <span className={styles.content}>&nbsp;&nbsp;&nbsp;&nbsp;{item.acceptTime}&nbsp;&nbsp;</span>
                      <span className={styles.content}>{item.acceptStation||item.remark}</span>
                  </Timeline.Item>)}
              </Timeline>
          </div>
              }
              {items.content.routeList.length == 0 &&
          <div className={`${global.flex_column_center_center} ${styles.empty_express}`}>
              <img src={require('../../assets/express_empty.png')} />
              <p>{sldComLanguage('暂无物流进度')}</p>
          </div>
              }
          </div>;
      }else if (items.type == 'select_cat') {
      //分类选择
          return (<FormItem
              key={index}
              style={{ width: items.width+50 }}
              extra={items.extra}
          ><div key={index} className={global.flex_column_start_start} style={{padding:10,paddingTop:5 }}>
                  <Scrollbars
                      autoHeight
                      autoHeightMin={100}
                      autoHeightMax={300}
                  >
                      <Tree
                          checkable
                          autoExpandParent={false}
                          treeData={items.tree_data}
                          onCheck={items.onCheck}
                          checkedKeys={items.selected_keys}
                      />
                  </Scrollbars>
              </div>
          </FormItem>
          );
      }else if (items.type == 'search_muilty') {
        return <FormItem
            key={index}
            {...formItemLayoutModal}
            label={items.label}
            help={items.help}
            extra={items.extra}
        >
            {getFieldDecorator(items.name, { initialValue: items.initialValue||[], rules: items.rules })(
                <Select
                    mode="multiple"
                    allowClear={items.allowClear}
                    style={{ width: '100%' }}
                    filterOption={false}
                    placeholder={items.placeholder}
                    onChange={items.sldSeleChange}
                    onSearch={items.fetchData}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                    {items.data.map((itemss, indexss) => <Option key={indexss} value={itemss.shopId}>{itemss.shopName}</Option>)}
                </Select>
            )}
        </FormItem>;
    }

  };

  //渲染主体内容
  rendeForm = (content) => content.map((items, index) => this.getItem(items, index));

  //全选按钮
  permissionAll = (e, index) => {
      this.props.permissionAll(e, index);
  };

  //单选按钮
  permissionSingle = (checkedList, index) => {
      this.props.permissionSingle(checkedList, index);
  };

  //关闭modal之后重置数据
  closeReset = () => {
      this.props.form.resetFields();
  };

  //渲染树节点
  renderJPerTreeNodes = data =>
      data.map(item => {
          if (item.children) {
              return (
                  <Tree.TreeNode title={item.content} key={item.resourcesId != undefined ? item.resourcesId : item.pid} dataRef={item}>
                      {this.renderJPerTreeNodes(item.children)}
                  </Tree.TreeNode>
              );
          }
          return <Tree.TreeNode title={item.content} key={item.resourcesId != undefined ? item.resourcesId : item.pid} />;
      });

  render() {
      const { title, modalVisible, content, submiting, zIndex, show_foot } = this.props;

      return <Modal
          destroyOnClose
          maskClosable={false}
          title={title}
          zIndex={zIndex}
          afterClose={this.closeReset}
          width={this.props.width ? this.props.width : 416}
          visible={modalVisible}
          onOk={this.sldConfirm}
          onCancel={this.sldCancle}
          footer={show_foot != undefined && !show_foot ? null : [
              <Button key="back" onClick={this.sldCancle}>{sldComLanguage('取消')}</Button>,
              <Button key="submit" type="primary" loading={submiting} onClick={this.sldConfirm}>
                  {sldComLanguage('确定')}
              </Button>
          ]}
      >
          <Form
              layout="horizontal"
          >
              {typeof (this.props.java_permission) == 'undefined'&&typeof (this.props.conType) == 'undefined' &&
        <div style={{ overflow: 'hidden', maxHeight: document.body.clientHeight - 300 }}>
            <Spin spinning={this.props.showLoading!=undefined?this.props.showLoading:false}>
                <Scrollbars
                    ref={(scrollv) => {
                        this.scrollRef = scrollv;
                    }}
                    autoHeight
                    autoHeightMin={this.props.autoHeightMin?this.props.autoHeightMin:100}
                    autoHeightMax={document.body.clientHeight - 300}
                >
                    {getSldEmptyH(this.props.getSldEmptyH?this.props.getSldEmptyH:16)}
                    {this.rendeForm(content)}
                </Scrollbars>
            </Spin>
        </div>
              }
              {typeof (this.props.conType) != 'undefined' && this.props.conType == 'moreCheck' && (
                  <div className={styles.sldPerminss}>
                      {content.map(item =>
                          <Fragment key={item.id}>
                              <Checkbox
                                  indeterminate={item.indeterminate}
                                  onChange={(e) => this.permissionAll(e, item.id)}
                                  checked={item.checkAll}
                              >
                                  <span className={styles.sldGroup}>{item.name}</span>
                              </Checkbox>
                              <CheckboxGroup
                                  options={item.sldchild}
                                  value={item.checkList}
                                  onChange={(e) => this.permissionSingle(e, item.id)}
                              />
                          </Fragment>,
                      )}
                  </div>
              )}
              {typeof (this.props.java_permission) != 'undefined' && this.props.java_permission && (
                  <Scrollbars
                      autoHeight
                      autoHeightMin={100}
                      autoHeightMax={document.body.clientHeight - 300}
                  >
                      <Tree
                          checkable
                          onExpand={this.props.onExpand}
                          expandedKeys={this.props.expandedKeys}
                          autoExpandParent={this.props.autoExpandParent}
                          onCheck={this.props.onCheck}
                          checkedKeys={this.props.checkedKeys}
                          onSelect={this.props.onSelect}
                          selectedKeys={this.props.selectedKeys}
                      >
                          {this.renderJPerTreeNodes(this.props.content)}
                      </Tree>
                  </Scrollbars>

              )}
          </Form>
      </Modal>;
  }
}


