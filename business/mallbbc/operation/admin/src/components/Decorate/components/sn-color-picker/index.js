import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { Form } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

export default function SnColorPicker(props) {
    // 拾色面板显示开关
    const [ifShowColorPicker, setIfShowColorPicker] = useState(false)

    const {
        value, // 当前绑定的颜色值
        label, // 顶部标题
        defaultvalue = '#fff', // 默认颜色值
        onchange // 颜色更改事件
    } = props;

    // 事件
    /*
     * 控制颜色面板展示
     */
    const showColorPicker = (val) => {
        setIfShowColorPicker(val)
    }

    return (
        <div>
            {
                label && <p className={`${styles.subtitle}`}>{ label }</p>
            }
            
            <FormItem style={{display:'flex'}}>
                <div className={styles.fzx_color_show}>
                    <div className={styles.show_color} onClick={() => showColorPicker(true)}>
                        <span style={{ backgroundColor: value }} />
                    </div>
                    <a href="javascript:void(0)" onClick={() => onchange(defaultvalue)}>重置</a>
                </div>

                { ifShowColorPicker && (
                    <div className={styles.color_picker_wrap}>
                        <div
                            className={styles.color_picker_mask}
                            onClick={() => showColorPicker(false)}
                        />
                        <SketchPicker
                            color={value}
                            onChangeComplete={(e) => onchange(`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`)}
                        />
                    </div>
                )}
            </FormItem>
        </div>
    )
}
