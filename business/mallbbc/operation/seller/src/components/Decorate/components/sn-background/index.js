import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import { sldTsvg } from '@/utils/utils';
import global from '@/global.less';
import styles from './index.less';
import SnText from '../sn-text';
import SnTitle from '../sn-title';
// import SnRadio from '../sn-radio';
import SnUpload from '../sn-upload/index.js';
import SnColorPicker from '../sn-color-picker/index.js';

const FormItem = Form.Item;

export default class SnBackground extends Component {

    addBackground = ()=>{
        let { value } = this.props;

        value.push({
            padding:['','','',''],
            margin:['','','',''],
            background:{
                color:'',//背景颜色
                img:'',//背景图
                opacity:'100',//背景透明度
                scroll:true,//固定模式
                left:0,
                top:0,
                bgHeight:'100%'
            }
        });
        
        this.props.onchange(value)
    }

    // 对象修改数据
    onChange = (keys, key, val, type) => {
        let { value } = this.props
        let targetData = keys.reduce((pre, cur) => pre[cur], value)

        if (type === 'del') {
            delete targetData[key]
        } else {
            targetData[key] = val
        }
        this.props.onchange(value)
    }

    delBackground = (tar_index) => {
        let { value } = this.props;
        let newData = value.filter((item, index) => index != tar_index);
        this.props.onchange(newData)
    }

    render(){
        let { value, disabled } = this.props
        return(
            <Fragment>
                <div>
                    <SnTitle label="最多增加两个设置。第一个是页面初始状态，另一个是页面滑动后的状态" style={{color: 'red'}} />
                    <FormItem
                        key="background_data"
                        label=""
                    >   
                        {value.length > 0 && value.map((item, index) => (
                            <div className={`${global.flex_com_column_start_center} ${styles.sld_com_img}`} style={{padding:"0 10px 10px 10px",width:360}} key={index}>
                                <SnTitle label="背景会优先取图片,其次取取色器颜色" style={{'font-size': 12, color: 'red'}} />

                                <SnUpload
                                    value={item.background.img}
                                    onchange={params => this.onChange([index, 'background'], 'img', params)}
                                />

                                <SnColorPicker
                                    value={item.background.color}
                                    onchange={params => this.onChange([index, 'background'], 'color', params)}
                                />

                                <SnText
                                    label="请输入背景透明度（0-100）"
                                    type="inputNumber"
                                    max={100}
                                    value={item.background['opacity']}
                                    onchange={params => this.onChange([index, 'background'], 'opacity', params)}
                                />
                                
                                {/* { !disabled && 
                                    <SnRadio
                                        label="背景是否随页面滚动而滚动"
                                        type="radio"
                                        value={item.background['scroll']}
                                        options={[{ key: true, value: '是' }, { key: false, value: '否' }]}
                                        onchange={params => this.onChange([index, 'background'], 'scroll', params)}
                                    />
                                } */}
                                {value.length > 1 && <div
                                    className={`${global.flex_com_column_flex_end} ${styles.del_sld_com_img}`}
                                    onClick={() => this.delBackground(index)}
                                >
                                    {sldTsvg('qingchu', '#666', 16, 16)}
                                </div>}
                                {index < 1 && disabled && <div style={{paddingBottom: 10}}>
                                    <SnTitle label="内边距(上右下左)" style={{'font-size': 12, color: '#999'}} />
                                    {item.padding.length>0 && item.padding.map((paddingItem, paddingIndex)=>(
                                        <SnText
                                            type="input"
                                            style={{width: 75, display: 'inline-block'}}
                                            value={paddingItem}
                                            onchange={params => this.onChange([index, 'padding'], paddingIndex, params)}
                                        />
                                    ))}
                                    <SnTitle label="外边距(上右下左)" style={{'font-size': 12, color: '#999'}} />
                                    {item.margin.length>0&&item.margin.map((marginItem,marginIndex)=>(
                                        <SnText
                                            type="input"
                                            style={{width: 75, display: 'inline-block'}}
                                            value={marginItem}
                                            onchange={params => this.onChange([index, 'margin'], marginIndex, params)}
                                        />
                                    ))}
                                </div>}
                            </div>
                        ))}
                      
                        { value.length < 2 &&
                            <div
                                className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                onClick={() => this.addBackground()}
                            >
                                + 添加配置
                            </div>
                        }
                    </FormItem>
                </div>
            </Fragment>
        )
    }   
}