import React, { Fragment, Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
// eslint-disable-next-line no-unused-vars
import styles from '../common/css/index-edit.less';

export default class SnTimePicker extends Component{
    // 修改数据
    onChange = (value) => {
        this.props.onchange(value)
    }
    
    render(){
        let { label, value, format } = this.props
        
        return(
            <Fragment>
                <div className={`${styles.sub_part}`} style={{paddingBottom: 10}}>
                    <div className={`${styles.subtitle}`}>{ label }</div>
                    <DatePicker
                        format={format}
                        value={moment(value, format)}
                        showToday
                        onChange={(e, f) => this.onChange(f)}
                    />
                </div>
            </Fragment>
        )
    }
}