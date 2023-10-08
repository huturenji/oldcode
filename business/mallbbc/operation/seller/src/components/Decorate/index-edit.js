import React, { Component, Fragment } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import styles from './common/css/index-edit.less';
import CustEvent from '@/utils/custEvent.js'

// 装修基础组件
import SnBackground from './components/sn-background';
import SnColorPicker from './components/sn-color-picker';
import SnCouponPicker from './components/sn-coupon-picker';
import SnGoodsPicker from './components/sn-goods-picker';
import SnRadio from './components/sn-radio';
import SnRichText from './components/sn-richtext';
import SnSelect from './components/sn-select';
import SnSlide from './components/sn-slide';
import SnText from './components/sn-text';
import SnTimePicker from './components/sn-time-picker';
import SnTitle from './components/sn-title';
import SnTree from './components/sn-tree';
import SnUpload from './components/sn-upload';
import SnUrlPicker from './components/sn-url-picker';
import SnUnion from './components/sn-union';

// 具体装修组件对应的配置文件
import scrollloader from './scrollloader/scrollloader-edit.js'
import navigation from './navigation/navigation-edit.js'
import statusbar from './statusbar/statusbar-edit.js'
import titlebar from './titlebar/titlebar-edit.js';
import richText from './rich-text/rich-text-edit.js';
import goodsImageTop from './goods-image-top/goods-image-top-edit.js';
import mediaCategory from './media-category/media-category-edit.js';
import media from './media/media-edit.js';
import html from './html/html-edit.js';
import advertise from './advertise/advertise-edit.js';
import goods from './goods/goods-edit.js';
import shortVideo from './short-video/short-video-edit.js';
import goodsHotsale from './goods-hotsale/goods-hotsale-edit.js';
import scrollto from './scrollto/scrollto-edit.js';
import fixLine from './fix-line/fix-line-edit.js';
import coupon from './coupon/coupon-edit.js';
import goodsSeckillEntry from './goods-seckill-entry/goods-seckill-entry-edit.js';
import fixBlank from './fix-blank/fix-blank-edit.js';
import customerService from './customer-service/customer-service-edit.js';
import background from './background/background-edit.js';
import personalCenter from './personal-center/personal-center-edit.js';
import fixImage from './fix-image/fix-image-edit.js';
import goodsSeckillActivity from './goods-seckill-activity/goods-seckill-activity-edit.js';
import lottery from './lottery/lottery-edit.js';
import share from './share/share-edit.js';
import togetherBuy from './together-buy/together-buy-edit.js';
import everydayBuy from './everyday-buy/everyday-buy-edit.js';
import notice from './notice/notice-edit.js';
import live from './live/live-edit.js';
import search from './search/search-edit.js';
import imageCombination from './image-combination/image-combination-edit.js';
import goodsCombination from './goods-combination/goods-combination-edit.js';
import offcanvas from './offcanvas/offcanvas-edit.js';
import floatingWindow from './floating-window/floating-window-edit.js';
import counterTimer from './counter-timer/counter-timer-edit.js';
import cart from './cart/cart-edit.js';
import signin from './signin/signin-edit.js';
import imageSwiper from './image-swiper/image-swiper-edit.js';
import goodsCategory from './goods-category/goods-category-edit.js';
import tab from './tab/tab-edit.js';
import claimAll from './claim-all/claim-all-edit.js'

const comLists = {
    'scrollloader': scrollloader,
    'navigation': navigation,
    'statusbar': statusbar,
    'titlebar': titlebar,
    'rich-text': richText,
    'goods-image-top': goodsImageTop,
    'media-category': mediaCategory,
    'media': media,
    'html': html,
    'advertise': advertise,
    'goods': goods,
    'short-video': shortVideo,
    'goods-hotsale': goodsHotsale,
    'scrollto': scrollto,
    'fix-line': fixLine,
    'coupon': coupon,
    'goods-seckill-entry': goodsSeckillEntry,
    'fix-blank': fixBlank,
    'customer-service': customerService,
    'background': background,
    'personal-center': personalCenter,
    'fix-image': fixImage,
    'goods-seckill-activity': goodsSeckillActivity,
    'lottery': lottery,
    'share': share,
    'together-buy': togetherBuy,
    'everyday-buy': everydayBuy,
    'notice': notice,
    'live': live,
    'search': search,
    'image-combination': imageCombination,
    'goods-combination': goodsCombination,
    'offcanvas': offcanvas,
    'floating-window': floatingWindow,
    'counter-timer': counterTimer,
    'cart': cart,
    'signin': signin,
    'image-swiper': imageSwiper,
    'goods-category': goodsCategory,
    'tab': tab,
    'claim-all': claimAll
}

@connect(({ decocoms, decorate }) => ({
    decocoms, decorate
}))
@Form.create()
export default class MDiyItem extends Component {
    custEvents = null

    componentDidMount() {
        this.custEvents = CustEvent.init('decocoms')
        this.get_store_list()

        // 监听特殊情况处理函数
        this.custEvents.addListener('offcanvas', params => {
            let { select_data, handleCurSelData } = this.props;

            if (params.type === 'add') {
                let id = select_data.data[select_data.data.length - 1].leftTitle.id
                select_data.children[id] = []
            } else if (params.type === 'del') {
                delete select_data.children[params.id]
            }

            handleCurSelData(select_data)
        })

        this.custEvents.addListener('imageSwiper', params => {
            let { select_data, handleCurSelData } = this.props;
            if (params.type === 'img') {
                select_data.data = []
            } else if (params.type === 'upload') {
                select_data.data = [{ url: '', ids: [], info: [] }]
            } else {
                select_data.data = [{ url: '', info: '' }]
            }
            handleCurSelData(select_data)
        })

        this.custEvents.addListener('goodsCategory', () => {
            let { select_data, handleCurSelData } = this.props;
            select_data.data = []
            handleCurSelData(select_data)
        })
    }

    // 获取店铺数据列表
    get_store_list = (params) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'decorate/get_store_info',
            payload: params,
            callback: (res) => {
                if (res.state == 200) {
                    let storeData = [res.data]
                    storeData.forEach(item => {
                        item.key = res.data.storeId
                        item.value = res.data.storeName
                    })
                    // 店铺数据 和 秒杀组件需要的店铺数据
                    this.changeglobeData({
                        storeList: storeData,
                        seckillStoreList: storeData.filter(items => items.storeId == 8)
                    })
                }
            }
        });
    };

    // 修改装修组件需要的数据
    changeglobeData = (data) => {
        let { dispatch } = this.props;
        dispatch({
            type: 'decocoms/setParams',
            payload: data
        })
    }

    renderData = (data) => {
        if (data.name && comLists[data.name]) {
            return this.renderItem(data, comLists[data.name])
        }
    }

    renderItem = (data, list) => {
        let con = list.map(item => {
            let keys = item.valuekey
            let value = this.getValue(data, keys)
            let conItem = null

            if (item.name === 'sn-text') {
                conItem =
                    <SnText
                        value={value}
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
                    <Fragment>
                        <SnRadio
                            value={value}
                            label={item.label}
                            type={item.type}
                            options={item.options}
                            style={item.style}
                            custEvent={item.custEvent}
                            onchange={params => this.onchange(params, keys)}
                        />
                        {this.renderChild(data, item, value)}
                    </Fragment>
            } else if (item.name === 'sn-select') {
                conItem =
                    <SnSelect
                        value={value}
                        label={item.label}
                        options={item.options}
                        style={item.style}
                        placeholder={item.placeholder}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-upload') {
                conItem =
                    <SnUpload
                        value={value}
                        label={item.label}
                        format={item.format}
                        showDelBtn={item.showDelBtn}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-time-picker') {
                conItem =
                    <SnTimePicker
                        value={value}
                        label={item.label}
                        format={item.format}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-tree') {
                conItem =
                    <SnTree
                        value={value}
                        label={item.label}
                        data={item.data}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-title') {
                conItem = <SnTitle label={item.label} style={item.style} />
            } else if (item.name === 'sn-slide') {
                conItem =
                    <SnSlide
                        value={value}
                        label={item.label}
                        type={item.type}
                        min={item.min}
                        max={item.max}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-color-picker') {
                conItem =
                    <SnColorPicker
                        label={item.label}
                        defaultvalue={item.defaultvalue}
                        value={value}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-richtext') {
                conItem =
                    <SnRichText
                        value={value}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-url-picker') {
                conItem =
                    <SnUrlPicker
                        value={value}
                        options={item.options}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-union') {
                conItem =
                    <SnUnion
                        label={item.label}
                        value={value}
                        min={item.min}
                        max={item.max}
                        custEvent={item.custEvent}
                        defaultvalue={item.defaultvalue}
                        childs={item.children}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-goods-picker') {
                conItem =
                    <SnGoodsPicker
                        value={value}
                        min={item.min}
                        max={item.max}
                        type={item.type}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-coupon-picker') {
                conItem =
                    <SnCouponPicker
                        value={value}
                        style={item.style}
                        onchange={params => this.onchange(params, keys)}
                    />
            } else if (item.name === 'sn-background') {
                conItem =
                    <SnBackground
                        value={value}
                        disabled={item.disabled}
                        onchange={params => this.onchange(params, keys)}
                    />
            }

            return conItem
        })

        return con
    }

    renderChild = (data, item, value) => {
        if (item.children && Array.isArray(item.children[value])) {
            return this.renderItem(data, item.children[value])
        }
    }

    // 根据索引关系查找值
    getValue = (data, keysList) => {
        if (keysList && keysList.length > 0) {
            let keys = keysList[0].length > 0 ? keysList[0].split('.') : []
            return keys.reduce((pre, cur) => pre[cur], data)
        }
    }

    onchange = (params, keysList) => {
        const { select_data } = this.props;
        let newValue = JSON.parse(JSON.stringify(select_data))

        if (keysList && keysList.length > 0) {
            let keys = keysList[0].split('.')

            let targetData = keys.slice(0, keys.length - 1).reduce((pre, cur) => pre[cur], newValue)
            targetData[keys[keys.length - 1]] = params
            this.props.handleCurSelData(newValue)
        }

    }

    render() {
        const { select_data } = this.props;
        return (
            <div className={styles.r_edit_wrap}>
                <Form ref="sld_mdiy_edit" layout="horizontal">
                    {this.renderData(select_data)}
                </Form>
            </div>
        );
    }
}