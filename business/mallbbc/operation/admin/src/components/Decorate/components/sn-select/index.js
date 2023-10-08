import React, { Fragment,Component } from 'react';
import { connect } from 'dva';
import { Form, Select } from 'antd';
// eslint-disable-next-line no-unused-vars
import styles from '../common/css/index-edit.less';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ decocoms }) => ({
    decocoms
}))

export default class SnSelect extends Component{
    // 修改数据
    onChange = (value) => {
        this.props.onchange(value)
    }
    
    render(){
        let { label, value, placeholder, style, options = [], decocoms } = this.props

        // 判断 options是不是命名空间的数据
        let selectList = options
        if (!Array.isArray(options) && options.connect) {
            selectList = decocoms[options.key]
        }

        return(
            <Fragment>
                <div className={`${styles.title}`} style={{marginRight: 10}}>{ label }</div>
                <FormItem
                    key="data"
                    label=""
                >
                    {/* 输入框 */}
                    <Select
                        defaultValue={value}
                        style={{ ...style }}
                        placeholder={placeholder}
                        onSelect={(e)=> this.onChange(e)}
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                    >
                        {selectList.map((item, index) =>
                            <Option key={index} value={item.key}>{item.value}</Option>
                        )}
                    </Select>
                </FormItem>
            </Fragment>
        )
    }
}