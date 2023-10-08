import React, { Fragment, Component } from 'react';
import { Radio } from 'antd';
import CustEvent from '@/utils/custEvent.js'
import styles from './index.less';
import global from '@/global.less';

export default class SnRadio extends Component{
    custEvents = null

    componentDidMount() {
        this.custEvents = CustEvent.init('decocoms')
    }

    // 修改数据
    onChange = (value) => {
        let { custEvent = '' } = this.props

        this.props.onchange(value)

        // 调用特殊情况函数
        if (custEvent === 'imageSwiper') {
            setTimeout(() => this.custEvents.dispatch('imageSwiper', { type: value }))
        }

        if (custEvent === 'goods') {
            setTimeout(() => this.custEvents.dispatch('goods', { type: value }))
        }

        if (custEvent === 'goodsCategory') {
            setTimeout(() => this.custEvents.dispatch('goodsCategory'))
        }
    }
    
    render(){
        let { label, type, value, style, options = [] } = this.props
        
        return(
            <Fragment>
                <div>
                    {/* 单选按钮 */}
                    { type === 'radio' && 
                        <div className={`${styles.rowRadio}`} style={style}>
                            { label && (<span className={`${styles.subLabel}`}>{ label }</span>) }
                            <Radio.Group value={value} onChange={(e) => this.onChange(e.target.value)}>
                                { options.map((item, index) => <Radio value={item.key} key={item.value + index}>{ item.value }</Radio>) }
                            </Radio.Group>
                        </div>
                    }

                    {/* 图片单选 */}
                    { type === 'img' &&
                        <div>
                            { label && <div className={`${styles.subtitle}`}>{ label }</div> }
                            <div className={`${styles.com_default_styles} ${global.flex_com_row_start_center}`}>
                                { options.map(item => <div
                                    key={item.key}
                                    className={`${value == item.key ? styles.sel_show_style : ''}`}
                                    style={{padding: 8, ...style}}
                                    onClick={() => this.onChange(item.key)}
                                >
                                    <img src={item.value} style={{width: '100%'}} />
                                </div>)}
                            </div>
                        </div>
                    }
                </div>
            </Fragment>
        )
    }
}