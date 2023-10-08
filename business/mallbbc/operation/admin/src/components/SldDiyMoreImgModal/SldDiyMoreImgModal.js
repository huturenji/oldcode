/*
* 多图选择器
* */
import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Form,
    Select,
    Icon,
    Button,
    Input,
    Modal,
    Table,
    Upload,
    Radio,
    InputNumber,
    DatePicker
} from 'antd';
import moment from 'moment';
// eslint-disable-next-line no-unused-vars
import { object } from 'prop-types';
import global from '../../global.less';
import {
    showMoreModalHelpTip,
    sldBeforeUpload,
    formItemLayoutModal,
    sldComLanguage,
    getLocalStorageStingVal
} from '@/utils/utils';
import { diy_link_type,kai_diy_link_type } from '@/utils/util_data';
import { apiUrl,uploadLimit } from '@/utils/sldconfig.js';
import styles from '@/pages/decorate/pc/pcdecorate.less';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@connect(({ product }) => ({
    product
}))
@Form.create()
export default class SldDiyMoreImgModal extends Component {
	first_flag = false;

    submitError = false;//表单提交错误标识
	
    constructor(props) {
        super(props);
        const {
            form: { getFieldDecorator }
        } = props;
        this.state = {
            link_type: '',
            img_width: 150,
            img_height: 150,
            admin_show_width:150,
            admin_show_height:150,
            sele_index: 0,
            selectedRowKeys: [],
            cur_data: [{
                key: 'img',
                name: `${sldComLanguage('图片')}`,
                value: './img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
                imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
                type: 'img',
                required: true
            }, {
                key: 'link_type',
                name: `${sldComLanguage('操作')}`,
                value: '',
                type: 'link_type'
            }],//当前
            data: [
                [{
                    key: 'img',
                    name: '',
                    value: './img/TB1jsBeKYPpK1RjSZFFSuu5PpXa.jpg',
                    imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
                    type: 'img',
                    required: true
                }, {
                    key: 'link_type',
                    name: `${sldComLanguage('操作')}`,
                    value: '',
                    type: 'link_type'
                }], [{
                    key: 'img',
                    name: `${sldComLanguage('图片')}`,
                    value: './img/s1549014141_06023581415508567.jpg',
                    imgPath: '/images/brand/3e56e20d-453d-4cf8-906f-a928de37ce6a.png',
                    type: 'img',
                    required: true
                }, {
                    key: 'link_type',
                    name: `${sldComLanguage('操作')}`,
                    value: 'url',
                    type: 'link_type'
                }, {
                    key: 'link_value',
                    name: `${sldComLanguage('操作')}`,
                    value: '1111',
                    type: 'url'
                }]
            ],//数据
            columns: [{
                align: 'right',
                width: 150,
                dataIndex: 'name',
                render: (text, record) => <div>
                    <span className={styles.table_left_con}>{text}</span>
                    {record.required != undefined && record.required &&
						<span className={styles.table_left_require}>*</span>
                    }
                </div>
            }, {
                align: 'left',
                dataIndex: 'type',
                render: (text, record) => {                
                    let content = '';
                    if (record.type == 'loopShowTime') {
                        content = 
                            <FormItem>
                                <Radio.Group value={record.value?.intervalType || '0'} onChange={(e) => this.handleFieldChange(e, 'intervalType', 'loopShowTime')}>
                                    <Radio value='1'>有效期内仅展示1天</Radio>
                                    <Radio value='0'>手动输入</Radio>
                                </Radio.Group>
                                <InputNumber
                                    step={1}
                                    style={{ width: 100 }}
                                    min={0}
                                    max={30}
                                    parser={value => value.toString().split('.')[0]}
                                    value={record.value?.intervalDays || 0}
                                    onChange={(e) => this.handleFieldChange(e,'intervalDays','loopShowTime')}
                                />
                            </FormItem>
                    } 
                    if (record.type == 'marginList') {
                        content = <div style={{display:'flex'}}>
                            {record.value.length>0 && record.value.map((marginItem,marginIndex)=>(
                                <InputNumber
                                    step={1}
                                    style={{ width: 75 }}
                                    value={marginItem}
                                    onChange={(e) => this.marginChange(e,'marginList',marginIndex)}
                                />
                            ))}
                        </div>;
                    }

                    // 每天最大展示次数
                    if (record.type == 'maxShowTime') {
                        const optionValue = record.value == '不限' ? '0' : '1'
                        content = <FormItem>
                            <Radio.Group defaultValue={optionValue} onChange={(e) => this.handleShowTimeTypeChange(e)}>
                                <Radio value='0'>不限次数</Radio>
                                <Radio value='1'>手动输入</Radio>
                            </Radio.Group>
                            {
                                getFieldDecorator('maxShowTime', { initialValue: record.value || '不限', rules:[
                                    {
                                        validator: (rule, value, callback) => this.validMaxShowTime(rule, value, callback)
                                    }
                                ] })(<Input
                                    style={{ width: 150 }}
                                    disabled={this.state.maxShowTimeOption === '0'}
                                    onChange={(e) => this.handleFieldChange(e,'maxShowTime','maxShowTime',e.target.value)}
                                />)
                            }
                            
                        </FormItem>

                    }
                    
                    // 有效期限
                    if (record.type == 'deadline') {
                        content = 
                        <div>
                            <div style={{color: '#DB5609',paddingLeft:'10px',fontSize:'12px'}}>如果当前时间超过有效期，不管设不设置开屏图，会员端都不显示开屏图。</div>
                            <FormItem>
                                {getFieldDecorator('deadline', { initialValue: !record.value ? ['',''] : [moment(record.value[0]),moment(record.value[1])], rules: [{
                                    required: true,
                                    message: `${sldComLanguage('请选择有效期')}`
                                }, { validator: (rule, value, callback) => this.validateTime(rule, value, callback) }] })(
                                    <RangePicker
                                        format="YYYY-MM-DD"
                                        showTime
                                        placeholder={[`${sldComLanguage('开始时间')}`, `${sldComLanguage('结束时间')}`]}
                                        onChange={(e,f) => this.handleFieldChange(e,'deadline','deadline',f)}
                                        disabledDate={this.disabledDate}
                                    />
                                )}  
                            </FormItem>
                        </div>

                    }
                    if (record.type == 'img') {
                        content = <div className={styles.modal_img}>
                            <span
                                className={styles.modal_tip_color}
                            >{sldComLanguage('此处对应上传上方选中标签项内容，要求宽度为')}{this.state.img_width}{sldComLanguage('像素、高度')}{this.state.img_height == 0 ? `${sldComLanguage('不限制')}` : `${this.state.img_height }${sldComLanguage('像素')}`}{sldComLanguage('的图片；支持格式gif，jpg，png。')}</span>
                            <Upload
                                withCredentials
                                beforeUpload={(file, fileList)=>sldBeforeUpload(file, fileList,this.props.uploadLimit!=undefined?this.props.uploadLimit:uploadLimit)}
                                accept=".gif, .jpeg, .png,.jpg,"
                                showUploadList={false}
                                name="file"
                                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                onChange={(info) => this.setImg(info)}
                                headers={{
                                    Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                                }}
                            >
                                <Button>
                                    <Icon type="upload" /> {sldComLanguage('上传图片')}
                                </Button>
                            </Upload>
                        </div>;
                    } else if (record.type == 'link_type') {
					  let cur_all_link = diy_link_type();
					  if(props.client != undefined && props.client == 'mobile'){
                            cur_all_link = kai_diy_link_type();
                        }
                        content = <div>
                            <Select
                                value={record.value}
                                style={{ width: 120 }}
                                placeholder={`${sldComLanguage('请选择链接类型')}`}
                                onSelect={this.sldHandSeleChange}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                {cur_all_link.map((item, index) =>
                                    <Option key={index} value={item.key}>{item.name}</Option>,
                                )}
                            </Select>
                        </div>;
                    } else if (record.type == 'url') {
                        content = <FormItem>
                            {getFieldDecorator(`link_type`, {
                                initialValue: record.value, rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: `${sldComLanguage('请输入链接地址')}`
                                }]
                            })(
                                <Input
                                    maxLength={250}
                                    onChange={e => this.handleFieldChange(e, 'url', 'link_value')}
                                    placeholder={`${sldComLanguage('请输入链接地址')}`}
                                />,
                            )}
                        </FormItem>;
                    } else if (record.type == 'keyword') {
                        content = <FormItem>
                            {getFieldDecorator(record.type, {
                                initialValue: record.value, rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: `${sldComLanguage('请输入关键字')}`
                                }]
                            })(
                                <Input
                                    maxLength={250}
                                    onChange={e => this.handleFieldChange(e, record.type, 'link_value')}
                                    placeholder={`${sldComLanguage('请输入关键字')}`}
                                />,
                            )}
                        </FormItem>;
                    } else if (record.type == 'main_title' || record.type == 'sub_title') {
                        content = <FormItem>
                            {getFieldDecorator(record.type, {
                                initialValue: record.value, rules: [{
                                    required: true,
                                    whitespace: true,
                                    message: `${sldComLanguage('请输入')}${ record.name}`
                                }]
                            })(
                                <Input
                                    maxLength={250}
                                    onChange={e => this.handleFieldChange(e, record.type, record.key)}
                                    placeholder={`${sldComLanguage('请输入')}${ record.name}`}
                                />,
                            )}
                        </FormItem>;
                    } else if (record.type == 'goods' || record.type == 'category' || record.type == 'topic' || record.type == 'seckill') {
                        content = <div>
                            <span>{record.value}</span>
                        </div>;
                    }

                    return content;
                }
            }],
            maxShowTimeOption:'0', // 默认展示次数类型：不限次数
            maxShowTimeNumber:'' // 手动选择展示次数
        };
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.modalVisible && !this.props.modalVisible) {
            //防止别的模板发生变化，影响数据报错
            return false;
        }
        if (!this.first_flag) {
            let ope_data = nextProps.content.data;
            let new_data = [];
            
            for (let i=0;i<ope_data.length; i++) {
                let tmp_info = [];
                if (ope_data[i].main_title != undefined) {
                    tmp_info.push({
                        key: 'main_title',
                        name: `${sldComLanguage('图片标题')}`,
                        value: ope_data[i].main_title,
                        type: 'main_title',
                        info: {},
                        required: true
                    });
                }
                if (ope_data[i].sub_title != undefined) {
                    tmp_info.push({
                        key: 'sub_title',
                        name: `${sldComLanguage('图片子标题')}`,
                        value: ope_data[i].sub_title,
                        type: 'sub_title',
                        info: {},
                        required: true
                    });
                }
                tmp_info.push({
                    key: 'img',
                    name: `${sldComLanguage('图片')}`,
                    value: ope_data[i].imgUrl,
                    imgPath: ope_data[i].imgPath,
                    type: 'img',
                    required: true
                });
                if(!nextProps.hideTimeLoop){
                    tmp_info.push({
                        key: 'loopShowTime',
                        name: `${sldComLanguage('展示间隔')}`,
                        value: ope_data[i].loopShowTime,
                        type: 'loopShowTime',
                        required: true
                    });
                }
                if (ope_data[i].marginList) {
                    tmp_info.push({
                        key: 'marginList',
                        name: `${sldComLanguage('外边距(上右下左)')}`,
                        value: ope_data[i].marginList,
                        type: 'marginList',
                        required: false
                    });
                }
                if (ope_data[i].deadline != undefined) {
                    tmp_info.push({
                        key: 'deadline',
                        name: `${sldComLanguage('有效期')}`,
                        value: ope_data[i].deadline,
                        type: 'deadline',
                        required: true
                    });
                }
                
                // 每天最大展示次数
                if (ope_data[i].maxShowTime != undefined) {
                    tmp_info.push({
                        key: 'maxShowTime',
                        name: `${sldComLanguage('每天最大展示次数')}`,
                        value: ope_data[i].maxShowTime,
                        type: 'maxShowTime',
                        required: true
                    });
                }
                 
                tmp_info.push({
                    key: 'link_type',
                    name: `${sldComLanguage('操作')}`,
                    value: ope_data[i].link_type,
                    type: 'link_type'
                });
                if (ope_data[i].link_value != undefined && ope_data[i].link_value) {
                    let tmp_info_new = {
                        key: 'link_value',
                        name: `${sldComLanguage('关键字')}`,
                        value: ope_data[i].link_value,
                        type: ope_data[i].link_type,
                        info: ope_data[i].info != undefined ? ope_data[i].info : {},
                        required: true
                    };
                    if (ope_data[i].link_type == 'url') {
                        tmp_info_new.name = `${sldComLanguage('链接地址')}`;
                        tmp_info_new.required = true;
                    } else if (ope_data[i].link_type == 'keyword') {
                        tmp_info_new.name = `${sldComLanguage('关键字')}`;
                        tmp_info_new.required = true;
                    } else if (ope_data[i].link_type == 'goods') {
                        tmp_info_new.name = `${sldComLanguage('商品名称')}`;
                        tmp_info_new.required = true;
                    } else if (ope_data[i].link_type == 'category') {
                        tmp_info_new.name = `${sldComLanguage('分类名称')}`;
                        tmp_info_new.required = true;
                    } else if (ope_data.link_type == 'topic') {
                        tmp_info_new.name = `${sldComLanguage('专题名称')}`;
                        tmp_info_new.required = true;
                    } else if (ope_data.link_type == 'seckill') {
                        tmp_info_new.name = `${sldComLanguage('秒杀活动名称')}`;
                        tmp_info_new.required = true;
                    }
                    tmp_info.push(tmp_info_new);
                }
                new_data.push(tmp_info);
            }
            this.setState({
                data: new_data,
                img_width: nextProps.content.width,
                img_height: nextProps.content.height,
                admin_show_width:nextProps.content.admin_show_width!=undefined&&nextProps.content.admin_show_width>0?nextProps.content.admin_show_width:nextProps.content.width,
                admin_show_height:nextProps.content.admin_show_height!=undefined&&nextProps.content.admin_show_height>0?nextProps.content.admin_show_height:nextProps.content.height,
                maxShowTimeOption: ope_data[0].maxShowTime == '不限' ? '0' : '1'
            });
        }
    }

	//上传图片
	setImg = (info) => {
	    let { sele_index, data } = this.state;
	    let img_data = info.file.response;
	    if (info.file.status != undefined && info.file.status != 'error') {
	        if (img_data != undefined && img_data.state != undefined && img_data.state == 200) {
	            data[sele_index].forEach(item => {
	                if (item.key == 'img') {
	                    item.value = img_data.data.url;
	                    item.imgPath = img_data.data.path;
	                    item.width = img_data.data.width;
	                    item.height = img_data.data.height;
	                }
	            });
	        }
	    }
	    this.setState({ data });
	};

	//操作类型选择事件
	sldHandSeleChange = (val) => {
	    this.props.form.resetFields(['link_type','keyword']);
	    let { data, sele_index } = this.state;
	    let cur_data = [];
	    for (let i=0;i<data[sele_index].length; i++) {
	        if (data[sele_index][i].key != 'link_value') {
	            if (data[sele_index][i].key == 'link_type') {
	                data[sele_index][i].value = val;
	            }
	            cur_data.push(data[sele_index][i]);
	        }
	    }
	    if (val == 'url') {
	        cur_data.push({
	            key: 'link_value',
	            name: `${sldComLanguage('链接地址')}`,
	            value: '',
	            type: 'url',
	            required: true
	        });
	    } else if (val == 'keyword') {
	        cur_data.push({
	            key: 'link_value',
	            name: `${sldComLanguage('关键字')}`,
	            value: '',
	            type: 'keyword',
	            required: true
	        });
	    } else if (val == 'goods') {
	        cur_data.push({
	            key: 'link_value',
	            name: `${sldComLanguage('商品名称')}`,
	            value: '',
	            info: {},
	            type: 'goods',
	            required: true
	        });
	    } else if (val == 'category') {
	        cur_data.push({
	            key: 'link_value',
	            name: `${sldComLanguage('分类名称')}`,
	            value: '',
	            info: {},
	            type: 'category',
	            required: true
	        });
	    } else if (val == 'topic') {
	        cur_data.push({
	            key: 'link_value',
	            name: `${sldComLanguage('专题名称')}`,
	            value: '',
	            info: {},
	            type: 'topic',
	            required: true
	        });
	    } else if (val == 'seckill') {
	        cur_data.push({
	            key: 'link_value',
	            name: `${sldComLanguage('秒杀活动名称')}`,
	            value: '',
	            info: {},
	            type: 'seckill',
	            required: true
	        });
	    }
	    data[sele_index] = cur_data;
	    this.setState({ data, link_type: val });
	};
    
    /**
     * 校验有效时间
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
    validateTime = (rule, value, callback)=>{
        if ((new Date(value[1].format('YYYY-MM-DD 23:59:59')).getTime() - new Date(value[0].format('YYYY-MM-DD 00:00:00')).getTime()) > 30 * 24 * 60 * 60 * 1000) {
            callback(sldComLanguage('有效期不可以超过30天'));
        } else {
            callback();
        }
    }

    /**
     * 校验最大展示次数
     * @param {*} rule 
     * @param {*} value 
     * @param {*} callback 
     */
     validMaxShowTime = (rule, value, callback)=>{
         const maxShowTimeOption = this.state.maxShowTimeOption;
          
         if (maxShowTimeOption === '1' && (!/^\d+$/.test(value) || value <= 0 || value > 30)) {
             callback(sldComLanguage('只能为1-30之间的数字'));
         }
         else {
             callback();
         }
     }

	//确定事件
	sldConfirm = (e) => {
	    e.preventDefault();
	    const {content} = this.props;
	    this.props.form.validateFieldsAndScroll((err, values) => {
	        if (!err) {
	            this.submitError = false;
	            //将数据组装，返回给上级页面
	            const { data } = this.state;
	            let parent_data = [];
	            for (let i=0;i<data.length; i++) {
	                let tmp_info = {};
	                for (let j=0;j<data[i].length; j++) {
	                    if (data[i][j].key == 'img') {
	                        tmp_info.imgUrl = data[i][j].value;
	                        tmp_info.imgPath = data[i][j].imgPath;
	                        tmp_info.width = data[i][j].width;
	                        tmp_info.height = data[i][j].height;
	                    } else if(data[i][j].key == 'link_type'){
	                        tmp_info.link_type = data[i][j].value;
	                        tmp_info.link_value = '';
	                        tmp_info.info = {};
	                    } else if (data[i][j].key == 'link_value') {
	                        tmp_info.link_type = data[i][j].type;
	                        tmp_info.link_value = data[i][j].value;
	                        tmp_info.info = data[i][j].info;
	                    } else if (data[i][j].key == 'main_title') {
	                        tmp_info.main_title = data[i][j].value;
	                    } else if (data[i][j].key == 'sub_title') {
	                        tmp_info.sub_title = data[i][j].value;
	                    } else if (data[i][j].key == 'loopShowTime') {
	                        tmp_info.loopShowTime = data[i][j].value;
	                    } else if (data[i][j].key == 'marginList') {
	                        tmp_info.marginList = data[i][j].value;
	                    } else if (data[i][j].key == 'deadline') {
	                        tmp_info.deadline = data[i][j].value;
	                    } else if (data[i][j].key == 'maxShowTime') {
	                        tmp_info.maxShowTime = data[i][j].value;
	                    }
	                }
	                parent_data.push(tmp_info);
	            }
	            if(content!=undefined&&content.title_info != undefined && content.title_info.title_name != undefined){
	                this.props.sldHandleConfirm({title_name:values.title_name,parent_data});
	            }else{
	                this.props.sldHandleConfirm(parent_data);
	            }
	            this.sldCancle();
	        }else{
			    this.submitError = true;   
	        }
	    });
	};

	//取消事件-清空表单
	sldCancle = () => {
	    this.props.form.resetFields();
	    this.props.sldHandleCancle();
	    this.first_flag = false;
	    this.setState({ sele_index: 0 });
	};

	//关闭modal之后重置数据
	closeReset = () => {
	    this.props.form.resetFields();
	};

	//选择图片操作
	seleCurData = (index) => {
	    this.setState({ sele_index: index }, () => {
	        this.props.form.resetFields(['link_type','keyword','main_title','sub_title']);
	    });
	};

	//删除该图片对应的数据
	del_img = (index) => {
	    let { data } = this.state;
	    data[index] = data[index].filter(item => item.key != 'link_value');
	    data[index].forEach(item => {
	        if (item.key == 'img') {
	            item.value = '';
	            item.imgPath = '';
	        } else if (item.key == 'link_type'||item.key == 'main_title'||item.key == 'sub_title') {
	            item.value = '';
	        }
	    });
	    this.setState({ data });
	};

	//选择商品或者分类取消事件
	sldHandleLinkCancle = () => {
	    let { data, sele_index } = this.state;
	    let cur_data = [];
	    for (let i=0;i<data[sele_index].length; i++) {
	        if (data[sele_index][i].key != 'link_value') {
	            if (data[sele_index][i].key == 'link_type') {
	                data[sele_index][i].value = '';
	            }
	            cur_data.push(data[sele_index][i]);
	        }
	    }
	    data[sele_index] = cur_data;
	    this.setState({ data, link_type: '' });
	};

	//商品或分类选中事件
	seleSku = (val) => {
	    let { data, sele_index } = this.state;
	    data[sele_index].forEach(item => {
	        if (item.type == 'goods') {
	            item.value = val.goodsName;
	            item.info = val;
	        } else if (item.type == 'category') {
	            item.value = val.categoryName;
	            item.info = val;
	        } else if (item.type == 'topic') {
			  if(this.props.client!=undefined&&this.props.client=='mobile'){
	                item.value = val.name;
			  }else{
	                item.value = val.decoName;
	            }
	            item.info = val;
	        } else if (item.type == 'seckill') {
	            item.value = val.seckillName;
	            item.info = val;
	        }
	    });
	    this.setState({ data, link_type: '' });
	};
    
	/**
     * 处理最大展示次数切换事件
     */
     handleShowTimeTypeChange = (e)=>{
         const maxShowTimeOption = e.target.value;
         let switchValue = '';
         if (maxShowTimeOption === '0') {
             switchValue = '不限'
         } else {
             switchValue = ''
         }
         this.props.form.setFieldsValue({
             maxShowTime: switchValue
         })
         this.setState({
             maxShowTimeOption
         })
         this.handleFieldChange('','maxShowTime','maxShowTime',switchValue)
     }

     /**
     * 处理最大展示次数切换事件
     */
    handleMaxShowTimeChange = (e)=>{
        this.setState({
            maxShowTimeNumber: e.target.value
        })
    }
    
    /**
     * 有效期无法选中的日期
     * @param {*} current moment日期对象
     * @returns 
     */

    disabledDate(current){
	    return current && current.endOf('day') < moment().endOf('day');
    }

    //input编辑事件
    handleFieldChange(e, type, key,f) {
	    this.first_flag = true;
	    let { data, sele_index } = this.state;
	    for (let i=0;i<data[sele_index].length; i++) {
	        if (data[sele_index][i].key == key) {
	            if (data[sele_index][i].key == 'deadline') {
	                data[sele_index][i].value = [`${f[0]} 00:00:00`,`${f[1]} 23:59:59`];
	            }
                else if (data[sele_index][i].key == 'maxShowTime') {
                    data[sele_index][i].value = f;
                }
                else if (data[sele_index][i].key == 'loopShowTime'){
                    const ifObject = typeof data[sele_index][i].value === 'object'
                    const mergeData = {}
                    if (type === 'intervalType') {
                        mergeData.intervalType = e.target.value
                    }
                    if (type === 'intervalDays') {
                        mergeData.intervalDays = e
                    }
                    data[sele_index][i].value = Object.assign(ifObject ? data[sele_index][i].value : {}, mergeData)
                }
                else {
	                data[sele_index][i].value = e.target.value;
	            }
	        }
	    }
	    this.setState({ data });
    }

    marginChange(e,key,index){
	    this.first_flag = true;
	    let { data, sele_index } = this.state;
	    for (let i=0;i<data[sele_index].length; i++) {
	        if (data[sele_index][i].key == key) {
	            data[sele_index][i].value[index] = e
	        }
	    }
	    this.setState({ data });
    }

    render() {
	    const { data, columns, sele_index, link_type,admin_show_width,admin_show_height } = this.state;
	    const { title, modalVisible, submiting, zIndex, show_foot, modal_tip, form: { getFieldDecorator }, content } = this.props;
	    return <Modal
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
	            {...formItemLayoutModal}
	        >
	            <div>{showMoreModalHelpTip(modal_tip)}</div>
	            {content!=undefined&&content.title_info != undefined && content.title_info.title_name != undefined &&
				<FormItem
				    label={`${sldComLanguage('标题名称')}`}
				>
				    {getFieldDecorator('title_name', {
				        initialValue: content.title_info.title_name, rules: [{
				            required: true,
				            whitespace: true,
				            message: `${sldComLanguage('请输入标题名称')}`
				        }]
				    })(
				        <Input
				            maxLength={4}
				            placeholder={`${sldComLanguage('请输入标题名称')}`}
				        />,
				    )}
				</FormItem>
	            }
	            <div className={styles.imgs_wrap}>
	                {/* eslint-disable-next-line array-callback-return */}
	                {data.map((item, index) => item.map((val) => {
	                    if (val.key == 'img') {
	                        return <div
	                            onClick={() => this.seleCurData(index)}
	                            key={index}
	                            className={`${styles.adv_more_img_wrap} ${sele_index == index ? styles.seleImg : null}`}
	                            style={{ width: admin_show_width, height: admin_show_height ? admin_show_height : 100 }}
	                        >
	                            {val.value == ''
	                                ? null
	                                : <img className={styles.adv_01_img} src={val.value} />}
	                            <span onClick={() => this.del_img(index)} className={styles.del_img}>{sldComLanguage('删除')}</span>
	                        </div>;
	                    }
	                }))}
	            </div>
	            <Table
	                showHeader={false}
	                columns={columns}
	                dataSource={data[sele_index]}
	                bordered
	                pagination={false}
	            />
	        </Form>
	        <SldSelGoodsSingleDiy
	            link_type={link_type}
	            seleSku={this.seleSku}
	            sldHandleCancle={this.sldHandleLinkCancle}
	            client={this.props.client!=undefined?this.props.client:'mobile'}
	        />
	    </Modal>;
    }
}


