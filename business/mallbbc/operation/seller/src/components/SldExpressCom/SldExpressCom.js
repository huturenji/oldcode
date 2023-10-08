import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
    Form,
    InputNumber,
    Table, Button, Popconfirm
} from 'antd';
import global from '@/global.less';
import { sldTsvg, getSldEmptyH, formItemLayoutModal,sldComLanguage } from '@/utils/utils';
import SldEditFormCom from '../SldEditFormCom/SldEditFormCom';
import SldModal from '../SldModal/SldModal';
import areaData from '../../assets/area.json'

const FormItem = Form.Item;
// eslint-disable-next-line no-unused-vars
let sthis = '';
@connect(({ business }) => ({
    business
}))
export default class SldExpressCom extends Component {
    com_area_data = areaData;//通用的地址信息

    constructor(props) {
        super(props);
        sthis = this;
        const {
            form: { getFieldDecorator },
            type
        } = props;
        this.state = {
            flag: true,
            edit_flag: props.edit_flag,
            addData: [{
                type: 'city_area_deliver',
                name: 'deliver_area',
                label: `${sldComLanguage('选择地区')}`,
                placeholder: `${sldComLanguage('请选择modalVisible')}`,
                content: '',
                data: []
            }],
            modalVisible: false,//是否展示对话框
            area_data: areaData,//地区数据
            permissionList: [],//地区数据
            data_table: [],//表格数据
            base_info: [{
                type: 'inputnum',
                label: '首件/重/体积',
                name: `trans_com_weight${ type}`,
                placeholder: '首件/重/体积(件/kg/cm³)',
                initialValue: '',
                precision: 1,
                step:1,
                min:0,
                max:9999,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('该项必填')}`
                }]
            }, {
                type: 'inputnum',
                label: `${sldComLanguage('首费(元)')}`,
                name: `trans_com_fee${ type}`,
                placeholder: `${sldComLanguage('首费(元)')}`,
                initialValue: '',
                precision: 2,
                step:2,
                min:0,
                max:9999,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('该项必填')}`
                }]
            }, {
                type: 'inputnum',
                label: '续件/重/体积',
                name: `trans_com_add_weight${ type}`,
                placeholder: '续件/重/体积(件/kg/cm³)',
                initialValue: '',
                precision: 1,
                step:1,
                min:0,
                max:9999,
                rules: [{
                    required: true,
                    message: `${sldComLanguage('该项必填')}`
                }]
            }, {
                type: 'inputnum',
                label: `${sldComLanguage('续费(元)')}`,
                name: `trans_com_add_fee${ type}`,
                placeholder: `${sldComLanguage('续费(元)')}`,
                precision: 2,
                step:1,
                min:0,
                max:9999,
                initialValue: '',
                rules: [{
                    required: true,
                    message: `${sldComLanguage('该项必填')}`
                }]
            }],
            column: [
                {
                    title: ' ',
                    dataIndex: 'key',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => index + 1
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 70,
                    render: (text, record) => (
                        <Popconfirm
                            placement="rightBottom"
                            title={`${sldComLanguage('确定删除该行吗？')}`}
                            onConfirm={() => this.remove(record.key)}
                            okText={`${sldComLanguage('确定')}`}
                            cancelText={`${sldComLanguage('取消')}`}
                        >
                            <a style={{
                                marginTop: 5,
                                display: 'inline-block'
                            }}
                            >{sldTsvg('shanchu', '#FF711E', 20, 20)}</a>
                        </Popconfirm>
                    )
                },
                {
                    title: `${sldComLanguage('配送地区')}`,
                    align: 'center',
                    width: 300,
                    dataIndex: 'deliver_areas',
                    render: (text, record) => (
                        <a
                            style={{color:'#FF711E'}}
                            onClick={() => {
                                this.combine_area_info(record.key, record.sele_area_id_array);
                            }}
                        >{text == '' ? `${sldComLanguage('点击选择配送地区')}` : text}</a>
                    )
                },
                {
                    title: '首件/重/体积(件/kg/cm³)',
                    align: 'center',
                    width: 200,
                    dataIndex: 'trans_weight',
                    render: (text, record) => (
                        <FormItem
                            style={{ width: 135 }}
                        >
                            {getFieldDecorator(`trans_weight${record.key}${type}`, {
                                initialValue: text, rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={0}
                                    max={999999999}
                                    precision={2}
                                    style={{ width: 135 }}
                                    onChange={e => this.handleFieldChange(e, 'trans_weight', record.key)}
                                    placeholder={sldComLanguage('该项必填')}
                                />,
                            )}
                        </FormItem>
                    )
                }, {
                    title: `${sldComLanguage('首费(元)')}`,
                    align: 'center',
                    width: 150,
                    dataIndex: 'trans_fee',
                    render: (text, record) => (
                        <FormItem
                            style={{ width: 135 }}
                        >
                            {getFieldDecorator(`trans_fee${record.key}${type}`, {
                                initialValue: text, rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={0}
                                    max={999999999}
                                    precision={2}
                                    style={{ width: 135 }}
                                    onChange={e => this.handleFieldChange(e, 'trans_fee', record.key)}
                                    placeholder={sldComLanguage('该项必填')}
                                />,
                            )}
                        </FormItem>
                    )
                }, {
                    title: '续件/重/体积(件/kg/cm³)',
                    align: 'center',
                    width: 200,
                    dataIndex: 'trans_add_weight',
                    render: (text, record) => (
                        <FormItem
                            style={{ width: 135 }}
                        >
                            {getFieldDecorator(`trans_add_weight${record.key}${type}`, {
                                initialValue: text, rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={0}
                                    max={999999999}
                                    precision={2}
                                    style={{ width: 135 }}
                                    onChange={e => this.handleFieldChange(e, 'trans_add_weight', record.key)}
                                    placeholder={sldComLanguage('该项必填')}
                                />,
                            )}
                        </FormItem>
                    )
                }, {
                    title: `${sldComLanguage('续费(元)')}`,
                    dataIndex: 'trans_add_fee',
                    render: (text, record) => (
                        <FormItem
                            style={{ width: 135 }}
                        >
                            {getFieldDecorator(`trans_add_fee${record.key}${type}`, {
                                initialValue: text, rules: [{
                                    required: true,
                                    message: `${sldComLanguage('该项必填')}`
                                }]
                            })(
                                <InputNumber
                                    min={0}
                                    max={999999999}
                                    precision={2}
                                    style={{ width: 135 }}
                                    onChange={e => this.handleFieldChange(e, 'trans_add_fee', record.key)}
                                    placeholder={sldComLanguage('该项必填')}
                                />,
                            )}
                        </FormItem>
                    )
                }
            ]//表格
        };

    }


    componentDidMount() {
        let { edit_flag, base_info, flag } = this.state;
        if (edit_flag == 1 && flag) {
            for(let i=0;i<base_info.length;i++){
                base_info[i].initialValue = this.props.base_info[base_info[i].name];
                this.setState({
                    base_info,
                    flag: false
                });
            }
            this.setState({ base_info, data_table: this.props.data_table });
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            data_table: nextProps.data_table
        });
    }

    getRowByKey(key, newData) {
        return (newData).filter(item => item.key === key)[0];
    }

  //地区数据组装，已经选择的地区id数据跟通用地区组装
  combine_area_info = (key, sele_id_array) => {
      // let tmp_data = this.com_area_data;
      if(this.props.areaJson.length==0){
          return 
      }
      let tmp_data = this.props.areaJson;
      let init_com_data = [];
      for(let i=0;i<tmp_data.length;i++){
          let tmp_info = {};
          tmp_info.key = i;
          tmp_info.id = i;
          tmp_info.indeterminate = true;//有选中的为true
          tmp_info.checkList = [];
          tmp_info.sldchild = [];//下级数据
          tmp_info.name = tmp_data[i].regionName;
          //查看子元素是否有选中的
          tmp_info.checkAll = true;//是否全部选中
          for(let j=0;j<tmp_data[i].children.length;j++){
              let cur_data = tmp_data[i].children[j];
              if (sele_id_array.length == 0) {
                  tmp_info.checkAll = false;//是否全部选中
              } else if (sele_id_array.indexOf(cur_data.regionCode) == -1) {
                  tmp_info.checkAll = false;
              } else {
                  tmp_info.checkList.push(cur_data.regionCode);
              }
              tmp_info.sldchild.push({ id: j, key: j, label: cur_data.regionName, value: cur_data.regionCode });
          }
          if (tmp_info.checkList.length == 0) {
              tmp_info.indeterminate = false;
          }
          init_com_data.push(tmp_info);
      }
      this.setState({
          cur_key: key,
          permissionList: init_com_data,
          modalVisible: true
      });
  };
 

  //添加一条数据
  add_spec_table_item = () => {
      const { data_table } = this.state;
      let key = data_table.length + 1;
      const newData = data_table.map(item => ({ ...item }));
      newData.push({
          key: key,
          deliver_areas: '',
          trans_weight: 1,
          trans_fee: 1,
          trans_add_weight: 1,
          trans_add_fee: 1,
          sele_area_id_array: []
      });
      this.props.save_sele_area(newData);
      this.setState({ data_table: newData });
  };


  sldHandleConfirm = (val) => {
      this.setSubmiting(true);
      const { curData } = this.state;
      val.id = curData.id;//待定，id
      this.operateGoods(val, 'set');
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  //全选操作
  sldHandleCheckAll = (e, index) => {
      let { permissionList } = this.state;
      permissionList[index]['checkAll'] = e.target.checked;
      if (e.target.checked) {
          let sldchild = permissionList[index]['sldchild'];
          if (sldchild.length > 0) {
              for (let i = 0; i < sldchild.length; i++) {
                  permissionList[index]['checkList'].push(sldchild[i]['value']);
              }
          }
      } else {
          permissionList[index]['checkList'] = [];
      }
      permissionList[index]['indeterminate'] = false;
      this.setState({
          permissionList: permissionList
      });
  };

  //单选操作
  sldHandleCheckSingle = (checkList, index) => {
      let { permissionList } = this.state;
      let sldchild = permissionList[index]['sldchild'];
      permissionList[index]['checkList'] = checkList;
      if (sldchild.length == checkList.length) {
          permissionList[index]['indeterminate'] = false;
          permissionList[index]['checkAll'] = true;
      } else {
          permissionList[index]['indeterminate'] = false;
          permissionList[index]['checkAll'] = false;
      }
      this.setState({
          permissionList: permissionList
      });
  };

  //权限保存操作
  sldHandleConfirmPer = () => {
      let { permissionList, cur_key, data_table } = this.state;
      let seleSldPermiss = [];//选中的地区id结合
      for (let i = 0; i < permissionList.length; i++) {
          seleSldPermiss = seleSldPermiss.concat(permissionList[i]['checkList']);
      }

      //获取选中的城市名称
      let sele_area_name_array = [];
      for(let i=0;i<permissionList.length;i++){
          if (permissionList[i].checkList.length > 0) {
              for(let j=0;j<permissionList[i].sldchild.length;j++){
                  let tmp = permissionList[i].sldchild[j];
                  if (seleSldPermiss.indexOf(tmp.value) != -1) {
                      sele_area_name_array.push(tmp.label);
                  }
              }
          }
      }
      for(let i=0;i<data_table.length;i++){
          if (data_table[i].key == cur_key) {
              data_table[i].sele_area_id_array = seleSldPermiss;
              data_table[i].deliver_areas = sele_area_name_array.join(',');
          }
      }

      this.setState({
          data_table
      });
      this.props.save_sele_area(data_table);
      this.setState({
          modalVisible: false
      });
  };

  remove(key) {
      let { data_table } = this.state;
      data_table = data_table.filter(item => item.key != key);
      this.props.save_sele_area(data_table);
      this.setState({ data_table });
  }

  handleFieldChange(e, fieldName, key) {
      const { data_table } = this.state;
      const newData = data_table.map(item => ({ ...item }));
      const target = this.getRowByKey(key, newData);
      if (target) {
          target[fieldName] = e;
          this.props.save_sele_area(newData);
          this.setState({ data_table: newData });
      }
  }

  render() {
      const { column, data_table, base_info, modalVisible, permissionList } = this.state;
      return <Fragment>
          <SldEditFormCom form={this.props.form} search_data={base_info} />
          {getSldEmptyH(10)}
          <div className={global.goods_sku_tab} style={{ width: '100%' }}>
              {/*可编辑表格-start*/}
              <Table
                  columns={column}
                  size="small"
                  bordered
                  rowKey="key"
                  dataSource={data_table}
                  pagination={false}
              />
              {/* 可编辑表格-end*/}
          </div>
          <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.add_spec_table_item}
              icon="plus"
          >
        添加数据
          </Button>
          {/*地址选择对话框-start*/}
          <SldModal
              title={`${sldComLanguage('选择地址')}`}
              width={900}
              modalVisible={modalVisible}
              sldHandleConfirm={this.sldHandleConfirmPer}
              sldHandleCancle={this.sldHandleCancle}
              formItemLayoutModal={formItemLayoutModal}
              content={permissionList}
              conType="moreCheck"
              permissionSingle={this.sldHandleCheckSingle}
              permissionAll={this.sldHandleCheckAll}
          />
          {/*地址选择对话框-end*/}
      </Fragment>;
  }
}

