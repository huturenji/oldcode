/*
* Slider 组件
* 
* */
import React, { Component } from 'react';
import { Slider, InputNumber } from 'antd';
import styles from '../common/css/index-edit.less';

export default class snSlide extends Component {

    onChange = (val)=>{
        let {onchange} = this.props
        onchange(val)
    }

    render() {
        const { 
            style,
            value,
            label,
            type,
            min = 0,
            max = 1000,
            step = 1
        } = this.props
        return (     
            <div style={style}>
                { label && <div className={`${styles.subtitle}`}>{ label }</div> }
                { type=="union" && 
                    <InputNumber 
                        style={{width: '100px',marginRight: 10}} 
                        min={min} 
                        max={max} 
                        step={step}
                        value={value || 0} 
                        onChange={(val) => this.onChange(val || 0)}
                    />
                }
                <div style={{ width: '200px' }}>
                    <Slider 
                        min={min} 
                        max={max} 
                        onChange={(val) => this.onChange(val)} 
                        value={value}
                    />
                </div>
            </div>
        );
    }
}
