import React, { Fragment,Component } from 'react';
import { Input, InputNumber } from 'antd';
import { failTip } from '@/utils/utils';
// eslint-disable-next-line no-unused-vars
import styles from '../common/css/index-edit.less';

const { TextArea } = Input;//antd的文本域初始化方法

export default class SnText extends Component{
    // 修改数据
    onChange = (value) => {
        this.props.onchange(value)
    }
    
    render(){
        let { label, type, value, placeholder, style = {}, min = 0, max = 1000, step = 1} = this.props
        
        return(
            <Fragment>
                { label &&
                    <div className={`${styles.subtitle}`}>{ label }</div>
                }
                {/* 输入框 */}
                { type === 'input' && 
                    <Input
                        style={{...style}}
                        maxLength={max}
                        placeholder={placeholder}
                        onChange={(e) => this.onChange(e.target.value)}
                        value={value}
                    />
                }

                {/* 数值输入框 */}
                { type === 'inputNumber' && 
                    <InputNumber 
                        style={{...style}}
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(val) => {
                            val = parseFloat(val);
                            if (val < min || val > max) {
                                failTip('请输入正确的值')
                                return;
                            }
                            this.onChange(val)
                        }}
                    />
                }

                {/* 文本域 */}
                { type === 'textarea' && 
                    <TextArea
                        style={{...style}}
                        autoSize={{ minRows: 2}}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => this.onChange(e.target.value)}
                        allowClear
                    />
                }
            </Fragment>
        )
    }
}