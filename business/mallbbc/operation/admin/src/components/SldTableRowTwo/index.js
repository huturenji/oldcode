/*
*发布商品的布局（表单内容）   一行多列  左侧label 右侧内容
* */
import React, { PureComponent } from 'react';
import {
    Form, Select, Icon, Row, Col, Input, InputNumber, DatePicker, TreeSelect, Cascader, Checkbox, Radio, Upload, Button, Tooltip
} from 'antd';
import global from '@/global.less';
import styles from './index.less';
import { sldInputAfterAddons, sldBeforeUpload, getSldComImg, sldComLanguage, getLocalStorageStingVal,getStorage } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const InputGroup = Input.Group;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const { TextArea } = Input;

export default class SldTableRowTwo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            props_data: props
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            props_data: props
        });
    }

	//处理input内容变化事件
	handleInputOnchange = (e, item) => {
	    if (item.handleChange) {
	        item.handleChange(e);
	    }
	};

	//处理复选框变化事件
	handleSingleCheckboxOnchange = (e, item) => {
	    if (item.onChange) {
	        item.onChange(e);
	    }
	};

	//多选事件
	sldCheckShop = (items, value) => {
	    if (items.sldCheckShop) {
	        items.sldCheckShop(value);
	    }
	};

	redioOnChange = (e, val) => {
	    if (val.onChange) {
	        val.onChange(e.target.value);
	    }
	};

  //图品的点击预览
  sldShowImgPre = (val,item) => {
      if (val.preView) {
          val.preView(true, item);
      }
  };

  radio_select = (e, item) => {
      if (item.callback) {
          item.callback(e);
      }
  };

	commonCon = (val, index) => {
	    let {
	        // eslint-disable-next-line no-unused-vars
	        form: { getFieldDecorator }, item_width
	    } = this.props;
	    //普通输入框
	    item_width = item_width != undefined ? item_width : 'auto';
	    const uploadButton = (
	        <div>
	            <Icon type="plus" />
	            <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
	        </div>
	    );
	    if (val.type == 'input') {
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '80%' }}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <Input
	                    maxLength={val.maxLength!=undefined?val.maxLength:250}
	                    disabled={val.disable != undefined ? val.disable : false}
	                    className={styles.item}
						        placeholder={val.placeholder}
	                />,
	            )}
	        </FormItem>
	        );
	    }if (val.type == 'show_text') {
		  //内容展示，目前用于商品详情页
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '80%' }}
	        >
	            <div style={{color:this.props.r_color!=undefined?this.props.r_color:'#999',fontWeight: this.props.r_fontw!=undefined?this.props.r_fontw:'500',lineHeight:'16px'}}>
	                {val.text.length>84
	                    ?<Tooltip placement="bottomRight" title={val.text}>
	                        <span className={styles.word_break}>{val.text.substring(0,83)}...</span>
	                    </Tooltip>
	                    :val.text
	                }
	            </div>
	        </FormItem>
	        );
	    }if (val.type == 'show_text1') {
	        //内容展示，目前用于商品详情页
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '80%' }}
	        >
	            <div style={{color:this.props.r_color!=undefined?this.props.r_color:'#999',fontWeight: this.props.r_fontw!=undefined?this.props.r_fontw:'500',lineHeight:'16px'}} title={val.text}>{val.text.length > 30 ? `${val.text.substring(0,30) }...` : val.text}</div>
	        </FormItem>
	        );
	    }if (val.type == 'show_goods_img_more') {
		  //展示商品图片（多图），目前用于商品详情页
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            <div style={{flexDirection:'row',justifyContent:'flex-start'}}>
	                {val.data.length > 0 && val.data.map((item,index1)=><div key={index1} onClick={() => this.sldShowImgPre(val,item.imageUrl)} style={{flexDirection:'row',justifyContent:'center',alignItems:'center',overFlow:'hidden',width:100,height:100,display:'inline-flex',backgroundColor:'#F8F8F8',marginRight:10}}>
	                    <img style={{ maxWidth: '100%', maxHeight: '100%' }} src={item.imageUrl} />
	                </div>)}
	            </div>
	        </FormItem>
	        );
	    } if (val.type == 'inputnum') {
	        //数字搜索框
	        return (
	            <FormItem
	                key={index}
				          style={{ width: '80%' }}
				          extra={val.extra}
	            >
	                {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(<InputNumber
	                    min={val.min != undefined ? val.min : 0}
	                    max={val.max != undefined ? val.max : 999999999}
	                    step={val.step ? val.step : 0}
	                    className={styles.item}
	                    placeholder={val.placeholder}
	                    precision={val.precision != undefined ? val.precision : 0}
	                    disabled={val.disable}
	                    onChange={(e) => this.handleInputOnchange(e, val)}
	                />)}
	            </FormItem>
	        );

	    } if (val.type == 'select') {
	        //下拉选择框
	        return (<FormItem
	            key={index}
	            style={{ width: val.width != undefined ? val.width : ' 80%' }}
	            extra={val.extra}
	        >
	            {getFieldDecorator(val.name, val.initialValue ? {
	                initialValue: val.initialValue,
	                rules: val.rules
	            } : {
	                rules: val.rules
	            })(
	                <Select
	                    placeholder={val.placeholder}
	                    className={styles.item}
	                    onChange={val.onChange}
	                    getPopupContainer={triggerNode => triggerNode.parentNode}
	                >
	                    {val.sel_data.map((items, indexs) => <Option
	                        key={indexs}
								               value={val.diy != undefined && val.diy ? items[val.sele_key] : items.key}
	                    >{val.diy != undefined && val.diy ? items[val.sele_name] : items.name}</Option>)}
	                </Select>,
	            )}
	        </FormItem>
	        );

	    } if (val.type == 'multiple_select') {
	        //下拉多选框
	        return (<FormItem
	            key={index}
	            style={{ width: val.width != undefined ? val.width : ' 80%' }}
	            extra={val.extra}
	        >
	            {getFieldDecorator(val.name, val.initialValue ? {
	                initialValue: val.initialValue,
	                rules: val.rules
	            } : {
	                rules: val.rules
	            })(
	                <Select
	                    mode="multiple"
	                    placeholder={val.placeholder}
	                    className={styles.item}
	                    onChange={val.onChange}
	                    getPopupContainer={triggerNode => triggerNode.parentNode}
	                >
	                    {val.sel_data.map((items, indexs) => <Option
	                        key={indexs}
								               value={val.diy != undefined && val.diy ? items[val.sele_key] : items.key}
	                    >{val.diy != undefined && val.diy ? items[val.sele_name] : items.name}</Option>)}
	                </Select>,
	            )}
	        </FormItem>
	        );

	    } if (val.type == 'textarea') {

	        return (<FormItem
	            key={index}
	            help={val.help}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <TextArea
	                    className={styles.item}
	                    maxLength={val.maxLength!=undefined?val.maxLength:250}
					          disabled={val.is_disable != undefined && val.is_disable ? true : false}
					          style={{ minHeight: 32 }}
	                    rows={2}
	                    placeholder={val.placeholder}
	                />,
	            )}
	        </FormItem>);
	    } if (val.type == 'rangepicker') {
	        //时间范围选择器
	        return (<FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            {getFieldDecorator(val.name)(
	                <RangePicker
	                    showTime={val.show_time != undefined ? val.show_time : false}
	                    // className={styles.item}
	                    placeholder={[val.placeholder1, val.placeholder2]}
	                    getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
	                />,
	            )}
	        </FormItem>
	        );
	    }if (val.type == 'checkboxgroup') {
	        //checkbox多选
	        return (<FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <CheckboxGroup options={val.sldOptions} onChange={(value) => this.sldCheckShop(val, value)} />,
	            )}
	        </FormItem>
	        );
	    } if (val.type == 'datepicker') {
	        //时间选择器
	        return (<FormItem
	            key={index}
			                  extra={val.extra}
			                  style={{ width: '100%' }}
	        >
	            {val.initialValue && getFieldDecorator(val.name, {
	                initialValue: val.initialValue,
	                rules: val.rules
	            })(
	                <DatePicker
	                    className={styles.item}
	                    placeholder={val.placeholder}
	                    showTime={val.show_time != undefined ? val.show_time : false}
	                    getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
	                />,
	            )}
	            {!val.initialValue && getFieldDecorator(val.name, { rules: val.rules })(
	                <DatePicker
	                    className={styles.item}
	                    placeholder={val.placeholder}
	                    showTime={val.show_time != undefined ? val.show_time : false}
	                    getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
	                />,
	            )}
	        </FormItem>
	        );
	    } if (val.type == 'rangeval') {
	        //范围选择器
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            <InputGroup compact className={styles.item}>
	                {getFieldDecorator([val.name1])(<Input
	                    maxLength={250}
	                    style={{ width: '40%', textAlign: 'center' }}
						                                       placeholder={val.placeholder1}
	                />)}

	                <Input
	                    style={{ width: '20%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
						       placeholder="~"
	                    disabled
	                />
	                {getFieldDecorator([val.name2])(<Input
	                    maxLength={250}
	                    style={{ width: '40%', textAlign: 'center', borderLeft: 0 }}
	                    placeholder={val.placeholder2}
	                />)}
	            </InputGroup>
	        </FormItem>
	        );

	    } if (val.type == 'input_after') {
	        //带图标后缀
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            <div onClick={() => val.callback(val.operate_obj)}>
	                {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                    <Input
	                        style={{ width: 150, marginLeft: 3 }}
	                        disabled
	                        addonAfter={sldInputAfterAddons()}
						       placeholder={val.placeholder}
	                    />,
	                )}
	            </div>
	        </FormItem>);
	    } if (val.type == 'textarea_single') {
	        return <FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <TextArea className={styles.item} style={{ minHeight: 30 }} rows={1} />,
	            )}
	        </FormItem>;
	    } if (val.type == 'TreeSelect') {
	        return <FormItem key={index} extra={val.extra} style={{ width: ' 80%' }}>
	            {getFieldDecorator(val.name, {
	                initialValue: val.initialValue == '' ? undefined : val.initialValue,
	                rules: val.rules
	            })(
	                <TreeSelect
	                    className={styles.item}
	                    treeData={val.data}
	                    showSearch
	                    placeholder={val.placeholder}
	                    allowClear={val.allowClear}
	                    onSelect={val.onSelect}
	                    dropdownStyle={{maxHeight:300}}
	                    getPopupContainer={triggerNode => triggerNode.parentNode}
	                />,
	            )}
	        </FormItem>;
	    } if (val.type == 'cascader') {
	        //店铺分类选择
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '80%' }}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <Cascader
	                    disabled={val.disable != undefined && val.disable ? val.disable : false}
	                    fieldNames={{ label: 'title', value: 'key', children: 'children' }}
	                    className={styles.item}
	                    options={val.options}
	                    placeholder={val.placeholder}
	                />,
	            )}
	        </FormItem>
	        );
	    }if (val.type == 'cascader_area') {
	        //三级地址选择
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '80%' }}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <Cascader
	                    disabled={val.disable != undefined ? val.disable : false}
	                    options={JSON.parse(getStorage('common_area_list'))}
	                    placeholder={val.placeholder}
	                />,
	            )}
	        </FormItem>
	        );
	    } if (val.type == 'single_checkbox') {
	        //选择框
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            {getFieldDecorator(val.name, {
	                valuePropName: 'checked',
	                initialValue: val.initialValue,
	                rules: val.rules
	            })(
	                <Checkbox
	                    disabled={val.disable != undefined && val.disable ? val.disable : false}
	                    className={styles.item}
	                    onChange={(e) => this.handleSingleCheckboxOnchange(e, val)}
	                >
	                    {val.check_con}
	                </Checkbox>,
	            )}
	        </FormItem>
	        );
	    } if (val.type == 'radio') {
	        //radio
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            {getFieldDecorator(val.name, {
	                valuePropName: 'checked',
	                rules: val.rules,
	                initialValue: val.initialValue
	            })(
	                <RadioGroup
	                    size="small"
	                    defaultValue={val.initialValue}
	                    disabled={val.disable}
	                    className={styles.item}
						            onChange={(e) => this.redioOnChange(e, val)}
	                >
	                    {val.sel_data.map((item, index1) => <Radio key={index1} value={item.key}>{item.name}</Radio>)}
	                </RadioGroup>,
	            )}
	        </FormItem>
	        );
	    } if (val.type == 'radio_select') {
	        return (<FormItem
	            key={index}
	            extra={val.extra}
	            style={{ width: '100%' }}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <Radio.Group
	                    size="small"
	                    buttonStyle="solid"
	                    disabled={val.disable}
	                    onChange={(e) => this.radio_select(e, val)}
	                >
	                    {val.data.map((cval, ckey) => <Radio.Button key={ckey} value={cval.key}>{cval.value}</Radio.Button>)}

	                </Radio.Group>,
	            )}
	        </FormItem>);
	    } if (val.type == 'checkboxgroup') {
	        //radio
	        return (<FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <CheckboxGroup
	                    className={styles.item}
	                    options={val.sldOptions}
						               onChange={(value) => this.sldCheckShop(val, value)}
	                />,
	            )}
	        </FormItem>
	        );
	    } if (val.type == 'upload_img_upload') {
	        return <FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            <Upload
	                beforeUpload={sldBeforeUpload}
	                withCredentials
	                accept=".gif, .jpeg, .png,.jpg,"
	                name={val.upload_name}
	                action={val.upload_url}
	                listType="picture-card"
	                fileList={val.fileList}
	                onPreview={(info) => val.uploadPreview(info)}
	                onChange={(info) => val.uploadChange(info,val.extra_param!=undefined?val.extra_param:{})}
	                headers={{
	                    Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
	                }}
	            >
	                {val.fileList.length >= (val.num!=undefined?val.num:6) ? null : uploadButton}
	            </Upload>
	        </FormItem>;
	    } if (val.type == 'show_img_more') {
	        return <FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            <div className={`${global.flex_row_start_center}`}>
	                {val.data.map(item=><div className={`${global.flex_row_center_center}`}>
	                    {getSldComImg(item,200,200,100,100)}
	                </div>)}

	            </div>
	        </FormItem>;
	    } if (val.type == 'goods_spec_sele') {
	        let con = <div className={styles.spec_wrap}>
	            {
	                val.sel_data.length > 0 && val.sel_data.map((vall, keyl) => <div
	                    key={keyl}
						            className={`${styles.spec_r_wrap} ${keyl != val.sel_data.length - 1 ? styles.show_bot_border : null}`}
	                >
	                    <span className={styles.spec_l}>{vall.name}</span>
	                    {vall.attrList.length > 0 &&
							<div className={styles.spec_item_wrap}>
							    <Checkbox.Group
							        disabled={val.disable != undefined && val.disable ? val.disable : false}
								                style={{ width: '100%' }}
							    >
							        <Row>
							            {vall.attrList.map((valr, keyr) => <Col key={keyr} span={4}><Checkbox
							                value={valr.id}
							            >{valr.name}</Checkbox>
							            {vall.type == 2 &&
												<Upload
												    beforeUpload={sldBeforeUpload}
												    withCredentials
												    accept=".gif, .jpeg, .png,.jpg,"
												    name={val.upload_name}
												    action={val.upload_url}
												    listType="picture-card"
												    fileList={[]}
												    onPreview={(info) => val.uploadPreview(info)}
												    onChange={(info) => val.uploadChange(info)}
												    headers={{
												        Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
												    }}
												>
												    {uploadButton}
												</Upload>
							            }

							            </Col>)}
							        </Row>
							    </Checkbox.Group>
							</div>
	                    }
	                </div>)
	            }
	        </div>;

	        return con;
	    } if (val.type == 'show_text_btn') {
	        return <FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            <div>
	                <span>{val.initialValue}</span>
	                {val.btn != undefined &&
					<Button
					    style={{ marginLeft: 10 }}
					    key="submit"
					    type="primary"
					    loading={false}
					        onClick={val.btn.callback}
					>
					    {val.btn.text}
					</Button>
	                }
	            </div>
	        </FormItem>;
	    } if (val.type == 'cascader_common') {
	        //多级联动选择器-通用
	        return (<FormItem
	            key={index}
	            style={{ width: '100%' }}
	            extra={val.extra}
	        >
	            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
	                <Cascader
	                    options={val.data}
	                    fieldNames={val.fieldNames != undefined ? val.fieldNames : {
	                        label: 'label',
	                        value: 'value',
	                        children: 'children'
	                    }}
	                    onChange={(value, selectedOptions) => val.onChange(selectedOptions)}
	                    placeholder={val.placeholder}
	                />,
	            )}
	        </FormItem>
	        );
	    }


	};

	render() {
	    const { data, lwidth, rwidth, totalHeght, part_width } = this.state.props_data;
	    // let {
	    //     form: { getFieldDecorator }
	    // } = this.props;
	    const total_width = document.body.clientWidth-208;
	    const cur_height = totalHeght != undefined ? totalHeght : 70;
	    return (
	        <div className={styles.sld_table_row_two} style={{ height: totalHeght }}>
	            <div className={styles.sld_det_lr_wrap}>
	                {data != undefined && data.length > 0 && data.map((val, index) => <div
	                    className={styles.sld_det_lr_item_wrap}
	                    key={index}
	                    style={{
	                    width: `${(part_width != undefined ? part_width : 50)*0.01*total_width-2}px`,
	                    height: val.item_height!=undefined?val.item_height+1:cur_height + 1
	                }}
	                >
	                    <span
	                        className={styles.sld_det_r_item}
	                        style={{
	            flexDirection: 'row',
	            alignItems: 'center',
	            justifyContent: 'flex-end',
	            width: `${lwidth != undefined ? lwidth : 20}%`,
	            backgroundColor: '#FFFAF7',
	            height: val.item_height!=undefined?val.item_height+2:cur_height + 2
	                    }}
	                    >
	                        {val.required != undefined && val.required && <span style={{ color: 'red' }}>*</span>}
	            <span className={styles.sld_det_r_text} style={{ fontWeight: this.props.l_fontw!=undefined?this.props.l_fontw:'600',color:this.props.l_color!=undefined?this.props.l_color:'#333'}}>{val.label}</span>
	                    </span>
	                    <span
	                        className={styles.sld_det_r_item}
	                        style={{
	                        width: `${rwidth != undefined ? rwidth : 80}%`,
	                        alignItems: 'flex-start',
	                        paddingLeft: 20,
	                        height: val.item_height!=undefined?val.item_height+2:cur_height + 2,
	                        borderRightWidth: 1
	                    }}
	                    >
	                        <span className={styles.sld_det_r_text} style={{ width: '100%' }}>
	                            {this.commonCon(val, index)}
	                        </span>
	                    </span>
	                </div>)}
	            </div>
	        </div>
	    );
	}
}
