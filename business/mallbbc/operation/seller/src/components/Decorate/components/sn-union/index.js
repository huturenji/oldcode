import React, { Fragment,Component } from 'react';
import global from '@/global.less';
import styles from './index.less'
import { sldTsvg, guid, getOSvgMDiy } from '@/utils/utils';
import CustEvent from '@/utils/custEvent.js'
import SnColorPicker from '../sn-color-picker';
import SnCouponPicker from '../sn-coupon-picker';
import SnGoodsPicker from '../sn-goods-picker';
import SnRadio from '../sn-radio';
import SnRichText from '../sn-richtext';
import SnSelect from '../sn-select';
import SnSlide from '../sn-slide';
import SnText from '../sn-text';
import SnTimePicker from '../sn-time-picker';
import SnTitle from '../sn-title';
import SnTree from '../sn-tree';
import SnUpload from '../sn-upload';
import SnUrlPicker from '../sn-url-picker';

export default class SnUnion extends Component {
    custEvents = null

    componentDidMount() {
        this.custEvents = CustEvent.init('decocoms')
    }

    // 修改数据
    onchange = (params, keysList) => {
        const { value, onchange } = this.props;
        let newValue = JSON.parse(JSON.stringify(value))

        if (keysList && keysList.length > 0) {
            let keys = keysList[0].split('.')

            let targetData = keys.slice(0, keys.length - 1).reduce((pre, cur) => pre[cur], newValue)
            targetData[keys[keys.length - 1]] = params

            onchange(newValue)
        }
    }

    // 嵌套聚合修改数据
    unionchange = (params, keysList, index) => {
        const { value, onchange } = this.props;
        let newValue = JSON.parse(JSON.stringify(value))

        if (keysList && keysList.length > 0) {
            let keys = keysList[0].split('.')
            keys.unshift(index)
            
            let targetData = keys.slice(0, keys.length - 1).reduce((pre, cur) => pre[cur], newValue)
            targetData[keys[keys.length - 1]] = params

            onchange(newValue)
        }
    }

    // 添加子项
    addTtem = () => {
        let { value, defaultvalue, onchange, custEvent = '' } = this.props
        let newValue = JSON.parse(JSON.stringify(value))
        let defaultData = JSON.parse(JSON.stringify(defaultvalue))
        // 侧边导航栏需要新增id
        if (custEvent === 'offcanvas') {
            defaultvalue.leftTitle.id = guid()
        }

        newValue.push({
            ...defaultData,
            guid: guid()
        })
        onchange(newValue)

        // 调用特殊情况函数
        if (custEvent === 'offcanvas') {
            setTimeout(() => this.custEvents.dispatch('offcanvas', { type: 'add' }), 50)
        }
    }

    // 删除子项
    delItem = (index) => {
        let { value, onchange, custEvent = '' } = this.props
        let obj = value[index]
        let newValue = JSON.parse(JSON.stringify(value))
        newValue.splice(index, 1)
        onchange(newValue)

        // 调用特殊情况函数
        if (custEvent === 'offcanvas') {
            setTimeout(() => this.custEvents.dispatch('offcanvas', { type: 'del', id: obj.leftTitle.id }), 50)
        }
    }

    // 移动顺序
    moveItem = (index, type) => {
        let { value, onchange } = this.props
        let newValue = JSON.parse(JSON.stringify(value))
        if (type === 'down') {
            newValue[index + 1] = newValue.splice(index, 1, newValue[index + 1])[0]
        } else {
            newValue[index - 1] = newValue.splice(index, 1, newValue[index - 1])[0]
        }
        onchange(newValue)
    }

    // 根据索引关系查找值
    getValue = (data, keysList) => {
        if (keysList && keysList.length > 0) {
            let keys = keysList[0].length > 0 ? keysList[0].split('.') : []
            return keys.reduce((pre, cur) => pre[cur], data)
        }
    }

    // 渲染聚合组件里的子组件
    renderUnionChild = (ritem, index) => {
        let { childs, value, style, min = 0 } = this.props

        let con = childs.map((item, index2) => {
            let conItem = null
            // 索引关系增加 index (直属关系不需要 . )
            let keys = item.valuekey?.map(key => key ? `${index}.${key}` : `${index}`)
            let valueItem = this.getValue(value, keys || [])

            if (item.name === 'sn-text') {
                conItem =
                    <SnText
                        key={item.guid}
                        value={valueItem}
                        label={item.label}
                        type={item.type}
                        placeholder={item.placeholder}
                        style={item.style}
                        min={item.min}
                        max={item.max}
                        step={item.step}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-radio') {
                conItem =
                    <Fragment key={item.guid}>
                        <SnRadio
                            key={item.guid}
                            value={valueItem}
                            label={item.label}
                            type={item.type}
                            options={item.options}
                            style={item.style}
                            custEvent={item.custEvent}
                            onchange={params => this.onchange(params, keys)}
                        />
                        { this.renderRadioChild(ritem, item, valueItem, index) }
                    </Fragment>
            } else if (item.name === 'sn-select') {
                conItem =
                    <SnSelect
                        key={item.guid}
                        value={valueItem}
                        label={item.label}
                        options={item.options}
                        style={item.style}
                        placeholder={item.placeholder}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-upload') {
                conItem = 
                    <SnUpload
                        key={item.guid}
                        value={valueItem}
                        label={item.label}
                        showDelBtn={item.showDelBtn}
                        format={item.format}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-time-picker') {
                conItem = 
                    <SnTimePicker
                        key={item.guid}
                        value={valueItem}
                        label={item.label}
                        format={item.format}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-tree') {
                conItem = 
                    <SnTree
                        key={item.guid}
                        value={valueItem}
                        label={item.label}
                        data={item.data}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-title') {
                conItem = <SnTitle key={item.guid} label={item.label} style={item.style} />
            } else if (item.name === 'sn-slide') {
                conItem = 
                    <SnSlide
                        key={item.guid}
                        label={item.label}
                        value={valueItem}
                        type={item.type}
                        min={item.min}
                        max={item.max}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-color-picker') {
                conItem = 
                    <SnColorPicker
                        key={item.guid}
                        label={item.label}
                        defaultvalue={item.defaultvalue}
                        value={valueItem}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-richtext') {
                conItem = 
                    <SnRichText
                        key={item.guid}
                        value={valueItem}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-url-picker') {
                conItem = 
                    <SnUrlPicker
                        key={item.guid}
                        value={valueItem}
                        options={item.options}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-union') {
                conItem = 
                    <SnUnion
                        key={item.guid}
                        label={item.label}
                        value={valueItem}
                        custEvent={item.custEvent}
                        min={item.min}
                        max={item.max}
                        defaultvalue={item.defaultvalue}
                        childs={item.children}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-goods-picker') {
                conItem = 
                    <SnGoodsPicker
                        key={item.guid}
                        value={valueItem}
                        min={item.min}
                        max={item.max}
                        type={item.type}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-coupon-picker') {
                conItem = 
                    <SnCouponPicker
                        key={item.guid}
                        value={valueItem}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            }

            return conItem
        })


        return (
            <div key={ritem.guid} className={`${styles.group_item}`} style={style}>
                {/* 删除按钮 */}
                { value.length > min &&
                    <div
                        className={`${styles.del_sld_com_img}`}
                        onClick={() => this.delItem(index)}
                    >
                        {sldTsvg('qingchu', '#666', 16, 16)}
                    </div>
                }

                {/* 移动按钮 */}
                <div className={`${styles.group_item_move}`}>
                    { index > 0 &&
                        <div title="上移">
                            { getOSvgMDiy(() => this.moveItem(index, 'up'), 'move-up', '#666', 24, 24) }
                        </div>
                    }
                    { index < value.length - 1 &&
                        <div title="下移">
                            { getOSvgMDiy(() => this.moveItem(index, 'down'), 'xia1', '#666', 24, 24) }
                        </div>
                    }
                </div>

                { con }
            </div>
        )
    }

    // 渲染单选框里的子组件
    renderRadioChild = (data, ritem, rvalue, index) => {
        if (ritem.children && Array.isArray(ritem.children[rvalue])) {
            let list = ritem.children[rvalue]
            let con = list.map((item, ii) => {
                let conItem = null
                // 索引关系增加 index (直属关系不需要 . )
                let keys = item.valuekey
                let value = this.getValue(data, keys)
    
                if (item.name === 'sn-text') {
                    conItem =
                        <SnText
                            key={item.guid}
                            value={value}
                            label={item.label}
                            type={item.type}
                            placeholder={item.placeholder}
                            style={item.style}
                            min={item.min}
                            max={item.max}
                            step={item.step}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-radio') {
                    conItem =
                        <Fragment key={item.guid}>
                            <SnRadio
                                key={item.guid}
                                value={value}
                                label={item.label}
                                type={item.type}
                                options={item.options}
                                style={item.style}
                                custEvent={item.custEvent}
                                onchange={params => this.unionchange(params, keys, index)}
                            />
                            { this.renderRadioChild(data, item, value, index) }
                        </Fragment>
                } else if (item.name === 'sn-select') {
                    conItem =
                        <SnSelect
                            key={item.guid}
                            value={value}
                            label={item.label}
                            options={item.options}
                            style={item.style}
                            placeholder={item.placeholder}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-upload') {
                    conItem = 
                        <SnUpload
                            key={item.guid}
                            value={value}
                            label={item.label}
                            format={item.format}
                            showDelBtn={item.showDelBtn}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-time-picker') {
                    conItem = 
                        <SnTimePicker
                            key={item.guid}
                            value={value}
                            label={item.label}
                            format={item.format}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-tree') {
                    conItem = 
                        <SnTree
                            key={item.guid}
                            value={value}
                            label={item.label}
                            data={item.data}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-title') {
                    conItem = <SnTitle key={item.guid} label={item.label} style={item.style} />
                } else if (item.name === 'sn-slide') {
                    conItem = 
                        <SnSlide
                            key={item.guid}
                            label={item.label}
                            value={value}
                            min={item.min}
                            max={item.max}
                            type={item.type}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-color-picker') {
                    conItem = 
                        <SnColorPicker
                            key={item.guid}
                            label={item.label}
                            defaultvalue={item.defaultvalue}
                            value={value}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-richtext') {
                    conItem = 
                        <SnRichText
                            key={item.guid}
                            value={value}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-url-picker') {
                    conItem = 
                        <SnUrlPicker
                            key={item.guid}
                            value={value}
                            options={item.options}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-union') {
                    conItem = 
                        <SnUnion
                            key={item.guid}
                            label={item.label}
                            value={value}
                            min={item.min}
                            max={item.max}
                            custEvent={item.custEvent}
                            defaultvalue={item.defaultvalue}
                            childs={item.children}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-goods-picker') {
                    conItem = 
                        <SnGoodsPicker
                            key={item.guid}
                            value={value}
                            type={item.type}
                            min={item.min}
                            max={item.max}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                } else if (item.name === 'sn-coupon-picker') {
                    conItem = 
                        <SnCouponPicker
                            key={item.guid}
                            value={value}
                            style={item.style}
                            onchange={params => this.unionchange(params, keys, index)}
                        />
                }
    
                return conItem
            })

            return con
        }
    }

    render() {
        let { value = [], label, max = 10 } = this.props

        return(
            <div className={`${styles.union_group}`}>
                {/* 渲染项 */}
                { value.map((item, index) => this.renderUnionChild(item, index)) }

                {/* 添加按钮 */}
                { value.length < max &&
                    <div
                        className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                        onClick={() => this.addTtem()}
                    >
                        + { label }
                    </div>
                }
            </div>
        )
    }
}
