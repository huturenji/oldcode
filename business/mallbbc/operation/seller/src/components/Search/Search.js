import React, { Component, Fragment } from 'react';
import { Form, Select, Icon, Radio, Col, Button, Input, InputNumber, DatePicker, TreeSelect } from 'antd';
/* eslint-disable */
import global from '@/global.less';
/* eslint-disable */
import { sldInputAfterAddons,sldComLanguage } from '@/utils/utils';

const FormItem = Form.Item;
const { RangePicker, MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;


@Form.create()
export default class Search extends Component {
state = {
    expandForm: false,
    yearpicker_isopen: false//年份选择器的面板
};

componentDidMount() {

}

componentWillReceiveProps(nextProps) {
    if (nextProps.isReset != undefined && nextProps.isReset) {
        this.props.form.resetFields();
    }
}

redioOnChange = (e, val) => {
    console.log(e,val);
    
    if (val.onChange) {
        val.onChange(e.target.value);
    }
};

commonCon = (val, index) => {
    const {
        form: { getFieldDecorator }
    } = this.props;
    const { yearpicker_isopen } = this.state;
    //普通输入框
    if (val.type == 'input') {
        return (
            <FormItem
                key={index}
                ////widthMode组件宽度模式，不输入就是普通的，fat模式就是加宽的
                style={{ width: val.widthMode == 'fat' ? 280 :230 }}
                label={val.label}
            >
                {getFieldDecorator(val.name,{initialValue: val.initValue?val.initValue:''})(<Input autoComplete="off" maxLength={250} style={{ width: val.widthMode == 'fat' ? 180 :150 }} placeholder={val.placeholder} />)}
            </FormItem>

        );
    } if (val.type == 'inputnum') {
        //数字搜索框
        return (
            <FormItem
                key={index}
                style={{ width: 230 }}
                label={val.label}
            >
                {getFieldDecorator(val.name)(<InputNumber min={0} precision={0} max={999999999} style={{ width: 150 }} placeholder={val.placeholder} />)}
            </FormItem>
        );

    } if (val.type == 'select') {
        //下拉选择框
        return (
            <FormItem
                key={index}
                style={{ width: val.width? val.width + 80:230 }}
                label={val.label}
            >
                {getFieldDecorator(val.name,{
                    initialValue: val.initialValue,
                })(
                    <Select
                        placeholder={val.placeholder}
                        style={{ width: val.width?val.width:150 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        mode={val.mode||''}
                    >
                        {val.sel_data!=null&&val.sel_data.map((items, indexs) => <Option
                            key={indexs}
                            value={val.diy != undefined && val.diy ? items[val.sele_key] : items.key}
                        >{val.diy != undefined && val.diy ? items[val.sele_name] : items.name}</Option>)}
                    </Select>,
                )}
            </FormItem>
        );

    } if (val.type == 'radio') {
        //radio
        return (<FormItem
            key={index}
            // style={{ width: 230 }}
            extra={val.extra}
            label={val.label}
            style={{ width: val.width != undefined ? val.width + 80 : '100%' }}
        >
            {getFieldDecorator(val.name, {
                valuePropName: 'checked',
                rules: val.rules,
                initialValue: val.initialValue
            })(
                <RadioGroup
                    size="small"
                    value={val.initialValue}
                    style={{ width: val.width != undefined ? val.width : '100%' }}
                    onChange={(e) => this.redioOnChange(e, val)}
                >
                    {val.sel_data.map((item, index1) => <Radio key={index1} value={item.key}>{item.name}</Radio>)}
                </RadioGroup>,
            )}
        </FormItem>
        );
    } if (val.type == 'monthpicker') {
        //月份选择器
        return (<FormItem
            key={index}
            help={val.help}
            placeholder={val.placeholder}
            extra={val.extra}
            label={val.label}
        >
            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
                <MonthPicker
                    placeholder={val.placeholder}
                    style={{ width: 150 }}
                    getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                />,
            )}
        </FormItem>
        );
    } if (val.type == 'yearpicker') {
        //年份选择器
        return (<FormItem
            key={index}
            help={val.help}
            style={{ width: 230 }}
            placeholder={val.placeholder}
            extra={val.extra}
            label={val.label}
        >
            {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
                <DatePicker
                    open={yearpicker_isopen}
                    mode="year"
                    format="YYYY"
                    onFocus={() => {
                        this.setState({ yearpicker_isopen: true });
                    }}
                    onBlur={() => {
                        this.setState({ yearpicker_isopen: false });
                    }}
                    onPanelChange={(v) => {
                        val.hanleYear(v);
                        this.setState({
                            yearpicker_isopen: false
                        });
                    }}
                    getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                />,
            )}
        </FormItem>
        );
    } if (val.type == 'rangepicker') {
        //时间选择器
        return (
            <FormItem
                key={index}
                style={{ width: 290 }}
                label={val.label}
            >
                {getFieldDecorator(val.name)(
                    <RangePicker
                        showTime={val.show_time!=undefined?val.show_time:false}
                        style={{ width: 220 }}
                        placeholder={[val.placeholder1, val.placeholder2]}
                        getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                    />,
                )}
            </FormItem>
        );

    } if (val.type == 'datepicker') {
        //时间选择器
        return (
            <FormItem
                key={index}
                help={val.help}
                style={{ width: 250 }}
                placeholder={val.placeholder}
                extra={val.extra}
                label={val.label}
            >
                {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
                    <DatePicker
                        showTime={val.show_time!=undefined?val.show_time:false}
                        getCalendarContainer={(triggerNode)=>triggerNode.parentNode}
                        placeholder={val.placeholder}
                        style={{ width: 150 }}
                    />,
                )}
            </FormItem>
        );
    } if (val.type == 'rangeval') {
        //范围选择器
        return (
            <FormItem
                key={index}
                label={val.label}
            >
                <InputGroup compact style={{ width: 150 }}>
                    {getFieldDecorator([val.name1])(<Input
                        maxLength={250}
                        style={{ width: '40%', textAlign: 'center' }}
                        placeholder={val.placeholder1}
                    />)}

                    <Input
                        maxLength={250}
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

    } if (val.type == 'rangeval_select') {
        //范围选择+select
        return (
            <FormItem
                key={index}
            >
                <InputGroup compact style={{ flex: 1, flexDirection: 'row' }}>
                    {getFieldDecorator(val.select.name, { initialValue: val.select.initialValue })(<Select
                        style={{ width: '36%' }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {val.select.sel_data.map((items, indexs) => <Option key={indexs} value={items.key}>{items.name}</Option>)}
                    </Select>)}
                    {getFieldDecorator(val.name1)(<Input
                        maxLength={250}
                        key={`first${ index}`}
                        style={{ width: '26%', textAlign: 'center' }}
                        placeholder={val.placeholder1}
                    />)}
                    <Input
                        maxLength={250}
                        key={`center${ index}`}
                        style={{ width: '12%', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }}
                        placeholder="~"
                        disabled
                    />
                    {getFieldDecorator(val.name2)(<Input
                        maxLength={250}
                        key={`end${ index}`}
                        style={{
                            width: '26%',
                            textAlign: 'center',
                            borderLeft: 0
                        }}
                        placeholder={val.placeholder2}
                    />)}

                </InputGroup>
            </FormItem>
        );

    } if (val.type == 'type_select_input') {
        //范围选择+select
        return (
            val.width == undefined ?
                <FormItem
                    style={{ width: 290, paddingLeft: 10 }}
                    key={index}
                >
                    <InputGroup compact style={{ flex: 1, flexDirection: 'row' }}>
                        {getFieldDecorator(val.select.name, { initialValue: val.select.initialValue })(<Select
                            style={{ width: 120 }}
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            {val.select.sel_data.map((items, indexs) => <Option key={indexs} value={items.key}>{items.name}</Option>)}
                        </Select>)}
                        {getFieldDecorator(val.name)(<Input
                            maxLength={250}
                            key={index}
                            style={{ width: 160 }}
                            placeholder={val.placeholder}
                        />)}
                    </InputGroup>
                </FormItem>
                :
                <InputGroup key={index} compact style={{ width: val.width, flexDirection: 'row', marginLeft: 24 }}>
                    {getFieldDecorator(val.select.name, { initialValue: val.select.initialValue })(<Select
                        style={{ width: 120 }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {val.select.sel_data.map((items, indexs) => <Option key={indexs} value={items.key}>{items.name}</Option>)}
                    </Select>)}
                    {getFieldDecorator(val.name)(<Input
                        maxLength={250}
                        key={index}
                        style={{ width: 160 }}
                        placeholder={val.placeholder}
                    />)}
                </InputGroup>
        );

    } if (val.type == 'input_after') {
        //带图标后缀
        return (
            <FormItem
                key={index}
                label={val.label}
            >
                {getFieldDecorator(val.name, { initialValue: val.initialValue, rules: val.rules })(
                    <div onClick={() => val.callback(val.operate_obj)}>
                        <Input maxLength={250} style={{ width: 150 }} disabled addonAfter={sldInputAfterAddons()} placeholder={val.placeholder} />
                    </div>
                )}
            </FormItem>
        );
    } if (val.type == 'tree_select') {
        //树选择器
        return <FormItem key={index} label={val.label} style={{ width: 230 }}>
            {getFieldDecorator(val.name, {
                initialValue: val.initialValue == '' ? undefined : val.initialValue
            })(
                <TreeSelect
                    style={{ width: 150 }}
                    treeData={val.data}
                    treeDefaultExpandAll
                    showCheckedStrategy="SHOW_PARENT"
                    placeholder={val.placeholder}
                    allowClear={val.allowClear}
                    onChange={val.onChange}
                    multiple={false}
                    dropdownStyle={{maxHeight:300}}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                />,
            )}
        </FormItem>;
    } if (val.type == 'TreeSelectAll') {
        return <Col key={index} md={8} sm={24} xl={7} xxl={5} lg={7}>
            <FormItem label={val.label}>
                {val.initialValue && getFieldDecorator(val.name, {
                    initialValue: val.initialValue,
                    rules: val.rules
                })(
                    <TreeSelect
                        style={{ width: '100%' }}
                        showSearch
                        placeholder={val.placeholder}
                        allowClear={val.allowClear}
                        onSelect={val.onSelect}
                        dropdownStyle={{maxHeight:300}}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {val.data.map((value) => <TreeNode value={value.sellerName} title={value.sellerName} key={value.id} />)}
                    </TreeSelect>,
                )}
                {val.initialValue == '' && getFieldDecorator(val.name, { rules: val.rules })(
                    <TreeSelect
                        style={{ width: '100%' }}
                        showSearch
                        placeholder={val.placeholder}
                        allowClear={val.allowClear}
                        onSelect={val.onSelect}
                        dropdownStyle={{maxHeight:300}}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {val.data.map((value) => <TreeNode value={value.sellerName} title={value.sellerName} key={value.id} />)}
                    </TreeSelect>,
                )}
            </FormItem>
        </Col>;
    } if (val.type === 'radio_button'){
        return (<FormItem
            key={index}
            label={val.label}
        >
            {getFieldDecorator(val.name, {
                rules: val.rules,
                initialValue: val.initialValue
            })(
            <RadioGroup
                style={{
                    marginBottom: 16
                }}
            >
                {
                    val.sel_data.map(item=><Radio.Button value={item.key}>{item.name}</Radio.Button>)
                }
            </RadioGroup>
            )}
        </FormItem>)
    }
};

//搜索重置事件
handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.validateFieldsAndScroll((err, fieldsValue) => {
        if (err) {return;}
        this.props.seaReset(fieldsValue);
    });
};

//搜索事件
handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFieldsAndScroll((err, fieldsValue) => {
        if (err) {return;}
        this.props.seaSubmit(fieldsValue);
    });
};

	//搜索条件-默认前两条数据
	renderSearchFiist = (search_data) => search_data.map((item, index) => index < 4 ? this.commonCon(item, index) : null);

	//搜索条件-默认前两条之后数据
	renderSearchSecond = (search_data) => search_data.map((item, index) => index > 3 ? this.commonCon(item, index) : null);


toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
        expandForm: !expandForm
    },()=>{
        if(this.props.moreSearchToggle){this.props.moreSearchToggle()}
    });
};

renderSimpleForm() {
    const { search_data, top } = this.props;
    const { expandForm } = this.state;

    return (
        search_data.length > 0 && <Form onSubmit={this.handleSearch} ref="sld_common_search_part" layout="inline">

            {this.renderSearchFiist(search_data)}
            {expandForm && (
                <Fragment>
                    {this.renderSearchSecond(search_data)}
                </Fragment>
            )}
            <span style={{ position: 'absolute', right: search_data.length > 4?20:0, top: top != undefined ? top : 0 }}>
                <Button type="primary" htmlType="submit">
                    {sldComLanguage('搜索')}
                </Button>
                <Button style={{ marginLeft: 3, marginBottom: 10 }} onClick={this.handleFormReset}>
                    {sldComLanguage('重置')}
                </Button>
                {search_data.length > 4 && <a style={{ marginLeft: 3, fontSize: 12,color: '#FF711E'}} onClick={this.toggleForm}>
                    {expandForm ? `${sldComLanguage('收起')}` : `${sldComLanguage('展开')}`} <Icon type={expandForm ? 'up' : 'down'} />
                </a>}
            </span>
        </Form>
    );
}

render() {
    return this.renderSimpleForm();
}
}

