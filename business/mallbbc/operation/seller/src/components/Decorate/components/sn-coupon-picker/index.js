import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sldTsvg, guid } from '@/utils/utils';
import { m_diy_link_type } from '@/utils/util_data';
import styles from './index.less';
import SnUrlPicker from '../sn-url-picker/index';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import SnUpload from '../sn-upload';

export default function SnCouponPicker(props) {
    const [link_type, setLinkType] = useState('')
    const [selCouponType, setselCouponType] = useState('')
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedRows, setSelectedRows] = useState([])

    const {
        value, // 传递的装修数据
        type,
        onchange,
        max,
        min
    } = props


    // 对象修改数据
    const onChange = (keys, key, val, datatype) => {
        let targetData = keys.reduce((pre, cur) => pre[cur], value)

        if (datatype === 'del') {
            delete targetData[key]
        } else {
            targetData[key] = val
        }
        onchange(value)
    }

    /*
     * 选择优惠券
     */
    const addCoupon = (couponShowType) => {
        if (couponShowType === 'vopCoupon') {
            // 添加vop优惠券
            const selectedRowsArr = value.info.filter(item => item.coupon_show_type === 402).map(item => item.info)
            const couponIdArr = selectedRowsArr.map(item => item.couponId)
            setselCouponType(402)
            // 修改父组件linkType的值，控制专题/商品选择弹窗弹出,并且绑定优惠券弹窗中的勾选
            setLinkType('voucher')
            setSelectedRowKeys(couponIdArr)
            setSelectedRows(selectedRowsArr)
        }
        if (couponShowType === 'freightCoupon') {
            // 添加vop优惠券
            const selectedRowsArr = value.info.filter(item => item.coupon_show_type === 405).map(item => item.info)
            const couponIdArr = selectedRowsArr.map(item => item.couponId)
            setselCouponType(405)
            // 修改父组件linkType的值，控制专题/商品选择弹窗弹出,并且绑定优惠券弹窗中的勾选
            setLinkType('freightCoupon')
            setSelectedRowKeys(couponIdArr)
            setSelectedRows(selectedRowsArr)
        }
        if (couponShowType === 'consumerCoupon') {
            // 添加vop优惠券
            const selectedRowsArr = value.info.filter(item => item.coupon_show_type === 406).map(item => item.info)
            const couponIdArr = selectedRowsArr.map(item => item.couponId)
            setselCouponType(406)
            // 修改父组件linkType的值，控制专题/商品选择弹窗弹出,并且绑定优惠券弹窗中的勾选
            setLinkType('consumerCoupon')
            setSelectedRowKeys(couponIdArr)
            setSelectedRows(selectedRowsArr)
        }
        if (couponShowType === 'picCoupon') {
            // 添加图片优惠券
            value.info.push({
                img: '',//图片绝对地址
                img_path: '',//图片相对地址
                name: '',//导航名称
                url: '', //链接值
                url_type: '',//链接类型
                info: '',//用于存放额外信息
                width: 361,
                height: 95,
                uuid: guid(),
                coupon_show_type: 'picCoupon'
            })
        }

        onchange(value);
    }

    //优惠券选中事件
    const seleSku = (val) => {
        let tar_data = value;
        if (val.length > 0) {
            tar_data.couponIdArr = [];
            const vopCouponList = val.map(item => {
                tar_data.couponIdArr.push(item.couponId);
                return {
                    uuid: guid(),
                    url_type: "voucher",
                    coupon_show_type: item.promotionType,
                    info: item
                }
            })
            tar_data.info = tar_data.info.filter(item => item.coupon_show_type !== selCouponType).concat(vopCouponList);
        } else {
            tar_data.couponIdArr = [];
            tar_data.info = [];
        }
        onchange(tar_data);
        setLinkType('');
    };

    /*
     * 处理优惠券时间显示
     */
    const handleCouponDate = (info) => info.effectiveStart && info.effectiveStart ?
        `${info.effectiveStart.slice(0, 10)}~${info.effectiveEnd.slice(0, 10)}`
        :
        `领取后${info.cycle} 天内使用`;

    /*
     * 删除优惠券
     */
    const delCoupon = (coupon_index, delType) => {
        let newData = []
        if (delType === 'coupon') {
            // 优惠券展示分类（图片优惠券/平台或店铺优惠券）
            let couponShowType = value.info[coupon_index].coupon_show_type;

            if (couponShowType === 'vopCoupon'||couponShowType === 'freightCoupon'||couponShowType === 'consumerCoupon') {
                // 从优惠券编号数组集合中删除指定编号
                value.couponIdArr = value.couponIdArr.filter(item => item != value.info[coupon_index].info.couponId);
            }

            newData = value.info.filter((item, index) => index !== coupon_index);
            value.info = newData;
        }

        onchange(value);
    };

    /*
     * 拖拽结束事件
     * */
    const onDragEnd = result => {
        const { source, destination } = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            let sourceIndex = source.index;
            let destinationIndex = destination.index;

            if (sourceIndex == destinationIndex) {
                return;
            }
            let list = JSON.parse(JSON.stringify(value.info));
            if (['droppableCouponList'].includes(source.droppableId)) {
                let [draggedItem] = list.splice(sourceIndex, 1);                
                list.splice(destinationIndex, 0, draggedItem);
            }
            value.info = list
            onchange(value);
        }
    }

    /*
     * 处理优惠券使用时间限制
     */
    const handleCouponUseTime = (info) => info.cycle ? `领取后${info.cycle} 天内使用` : `${(new Date(info.effectiveEnd) - new Date(info.effectiveStart)) / (1000 * 3600 * 24)} 天有效期`;

    return (
        <div>
            <div className={`${styles.add_coupon_wrap}`}>
                <span className={`${styles.required}`}>*</span>
                <span className={`${styles.title}`}>选择优惠券:</span>
                <a
                    href='javascript:void(0)'
                    style={{ marginLeft: '5px' }}
                    className={`${styles.add_coupon_button}`}
                    onClick={() => addCoupon('vopCoupon')}
                >
                    + 添加优惠券
                </a>
                {/* <a
                    href='javascript:void(0)'
                    style={{ marginLeft: '5px' }}
                    className={`${styles.add_coupon_button}`}
                    onClick={() => addCoupon('freightCoupon')}
                >
                    + 添加运费券
                </a> */}
                <a
                    href='javascript:void(0)'
                    style={{ marginLeft: '5px' }}
                    className={`${styles.add_coupon_button}`}
                    onClick={() => addCoupon('consumerCoupon')}
                >
                    + 添加消费券
                </a>

                {type=='single'&&<a
                    href='javascript:void(0)'
                    style={{ marginLeft: '5px' }}
                    className={`${styles.add_coupon_button}`}
                    onClick={() => addCoupon('picCoupon')}
                >
                    + 添加图片
                </a>}

            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppableCouponList" type="couponList">
                    {/* eslint-disable-next-line no-unused-vars */}
                    {(provided, snapshot) => (
                        <div
                            className={`${styles.selected_coupon_list}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                        >

                            {
                                value.info.map((coupon_item, coupon_index) => (
                                    <Draggable
                                        key={(`${coupon_item.uuid}`)}
                                        draggableId={(`${coupon_item.uuid}`)}
                                        index={coupon_index}
                                    >
                                        {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                        {(provided, snapshot) => (
                                            <div
                                                className={`${global.flex_row_start_center}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                // style={{ width: '500px', marginLeft: '15px' }}
                                            >
                                                {coupon_item.coupon_show_type !== 'picCoupon' ?

                                                    // 添加vop优惠券
                                                    <div className={`${global.flex_com_row_start_center} ${styles.sld_com_img}`}>
                                                        <div className={`${styles.coupon_item_box}`}>
                                                            <div className={`${styles.coupon_item}`}>
                                                                <div className={`${styles.coupon_left_box}`}>
                                                                    <div className={`${styles.coupon_tips}`} style={{background:coupon_item.info.promotionType==406?'radial-gradient(circle at 0% 0%,#ff985b, #fc6106)':'#F30300'}}>{coupon_item.info.promotionType==406?'消费券':coupon_item.info?.couponTypeValue}</div>

                                                                    {coupon_item.info?.couponType == '3' ?
                                                                        <div className={`${styles.coupon_price} ${styles.couponEditPrice}`} style={{color:coupon_item.info.promotionType==406?'#ff711e':'#F30300'}}>
                                                                            <span className={`${styles.coupon_unit}`}>¥</span>
                                                                            <span className={`${styles.coupon_random_number}`}>{coupon_item.info?.randomMin}</span>
                                                                            <span>-</span>
                                                                            <span className={`${styles.coupon_unit}`}>¥</span>
                                                                            <span className={`${styles.coupon_random_number}`}>{coupon_item.info?.randomMax}</span>
                                                                        </div>
                                                                        :
                                                                        <div className={`${styles.coupon_price} ${styles.couponEditPrice}`} style={{color:coupon_item.info.promotionType==406?'#ff711e':'#F30300'}}>
                                                                            <span className={`${styles.coupon_unit}`}>¥</span>
                                                                            <span className={`${styles.coupon_number}`}>{coupon_item.info?.publishValue}</span>
                                                                        </div>
                                                                    }

                                                                    <span className={`${styles.price_tips}`} style={{color:coupon_item.info.promotionType==406?'#ff711e':'#F30300'}}>{coupon_item.info?.couponContent}</span>

                                                                    <span className={`${styles.coupon_second_tips}`}>{coupon_item.info?.couponName}</span>

                                                                    <span className={`${styles.coupon_date}`}>
                                                                        {handleCouponDate(coupon_item.info)}
                                                                    </span>
                                                                    {coupon_item.info.promotionType!==406&&<div className={`couponRule ${styles.coupon_rule}`}>
                                                                        <span>使用规则</span>
                                                                        <span className={`ruleIcon ${styles.rule_icon}`}></span>
                                                                    </div>}

                                                                </div>

                                                                <div className={`${styles.coupon_right_box}`} style={{background:coupon_item.info.promotionType==406?'radial-gradient(circle at 0% 0%,#ff985b, #fc6106)':'#F30300'}}>
                                                                    <span className={`${styles.coupon_stock_tips}`}>已抢19%</span>

                                                                    <div className={`${styles.coupon_stock_bar}`}>
                                                                        <div className={`${styles.coupon_stock_bar_progress}`}>

                                                                        </div>
                                                                    </div>
                                                                    <span className={`${styles.coupon_get_button}`}>立即领取</span>
                                                                </div>
                                                            </div>

                                                            <p>折扣说明：{coupon_item.info?.description}</p>
                                                            <p>限品类：{handleCouponUseTime(coupon_item.info)}</p>
                                                            <p>券编号：{coupon_item.info?.couponId}</p>
                                                        </div>
                                                        
                                                        <div
                                                            className={`${global.flex_com_column_flex_end} ${styles.del_sld_com_img}`}
                                                            onClick={() => delCoupon(coupon_index, 'coupon')}
                                                        >
                                                            {sldTsvg('qingchu', '#666', 16, 16)}
                                                        </div>
                                                    </div>
                                                    :
                                                    // 添加图片优惠券
                                                    <div className={`${global.flex_com_row_start_center} ${styles.sld_com_img}`}>
                                                        <div className={`${styles.common_img_part} ${global.flex_com_column_center_center}`}>
                                                            <div className={`${styles.upload_img} ${global.flex_column_center_center}`}>
                                                                <SnUpload
                                                                    value={coupon_item.img}
                                                                    onchange={params => onChange(['info',coupon_index], 'img', params)}
                                                                >
                                                                </SnUpload>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <SnUrlPicker
                                                                    value={{ ...coupon_item }}
                                                                    options={m_diy_link_type()}
                                                                    onchange={(params) => { onChange(['info'], coupon_index, params) }}
                                                                />
                                                            </div>
                                                        </div>


                                                        <div
                                                            className={`${global.flex_com_column_flex_end} ${styles.del_sld_com_img}`}
                                                            onClick={() => delCoupon(coupon_index, 'coupon')}
                                                        >
                                                            {sldTsvg('qingchu', '#666', 16, 16)}
                                                        </div>

                                                    </div>

                                                }
                                            </div>
                                        )}

                                    </Draggable>
                                ))
                            }

                            {provided.placeholder}

                        </div>
                    )}
                </Droppable>
            </DragDropContext>


            <SldSelGoodsSingleDiy
                link_type={link_type}
                seleSku={seleSku}
                client="mobile"
                sldHandleCancle={() => setLinkType('')}
                selectedRowKeys={selectedRowKeys}
                selectedRows={selectedRows}
                max={max}
                min={min}
                ifMultiSelected={true}
                ifDecorateUse={true}
            />

        </div>

    )
}
