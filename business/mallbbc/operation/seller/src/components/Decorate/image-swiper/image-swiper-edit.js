import { guid } from '@/utils/utils';
import { m_diy_link_type, buytogether_link_type } from '@/utils/util_data';

export default [
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否设置组件背景',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.isShowStyle'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-background',
                    disabled: true,
                    valuekey: ['styles']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '轮播数据是图片还是商品',
        type: 'radio',
        options: [{ key: 'img', value: '图片' }, { key: 'goods', value: '商品' }],
        custEvent: 'imageSwiper',
        valuekey: ['props.dataType'],
        children: {
            img: [
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '是否展示高斯模糊',
                    type: 'radio',
                    options: [{ key: true, value: '展示' }, { key: false, value: '隐藏' }],
                    valuekey: ['props.showVague']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    label: "轮播图图片之间的间距",
                    max: 100,
                    style: {
                        width: '300px'
                    },
                    valuekey: ['props.imageSpacing']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'inputNumber',
                    label: "轮播图圆角度数（0即是直角）",
                    valuekey: ['props.borderRadio']
                },
                {
                    name: 'sn-slide',
                    type: 'union',
                    label: "轮播指示灯的位置Y：",
                    style: {
                        display:'flex',alignItems:'center'
                    },
                    max:100,
                    valuekey: ['props.swiperDotPosition']
                },
                {
                    name: 'sn-text',
                    type: 'inputNumber',
                    label: "轮播间隔时长（单位：秒）",
                    min: 1,
                    max: 10,
                    step: 0.1,
                    style: {
                        width: '300px'
                    },
                    valuekey: ['props.autoplaySpeed']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '轮播图片'
                },
                {
                    guid: guid(),
                    name: 'sn-union',
                    label: '添加图片',
                    valuekey: ['data'],
                    style: {
                        'width': '300px',
                        'backgroundColor': '#f8f8f8',
                        'padding': '10px'
                    },
                    defaultvalue: {
                        img: '', // 图片绝对地址
                        title: '', // 图片标题
                        url: '', // 链接值
                        url_type: '', // 链接类型
                        info: [],
                        ids: []
                    },
                    children: [
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            showDelBtn: false,
                            valuekey: ['img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-url-picker',
                            options: m_diy_link_type(),
                            valuekey: ['']
                        }
                    ]
                }
            ],
            goods: [
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '商品数据来源',
                    type: 'radio',
                    options: [{ key: 'upload', value: '手动上传' }, { key: 'buytogether', value: '一起买活动' }],
                    valuekey: ['props.sources'],
                    custEvent: 'imageSwiper',
                    children: {
                        upload: [
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '是否隐藏不可售商品',
                                type: 'radio',
                                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                valuekey: ['props.filterNosaleGoods']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '选择商品(最多选择9个商品)'
                            },
                            {
                                guid: guid(),
                                name: 'sn-union',
                                valuekey: ['data'],
                                style: {
                                    'width': '400px',
                                    'backgroundColor': '#fff',
                                    'padding': '10px'
                                },
                                min: 1,
                                max: 1,
                                defaultvalue: {
                                    info: [],
                                    ids: []
                                },
                                children: [
                                    {
                                        guid: guid(),
                                        name: 'sn-goods-picker',
                                        type: 'goods',
                                        max: 9,
                                        valuekey: [''],
                                        style: {
                                            width: '360px'
                                        }
                                    }
                                ]
                            }
                        ],
                        buytogether: [
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '是否隐藏不可售商品',
                                type: 'radio',
                                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                valuekey: ['props.filterNosaleGoods']
                            },
                            {
                                guid: guid(),
                                name: 'sn-text',
                                type: 'inputNumber',
                                label: '商品显示条数',
                                min: 3,
                                max: 8,
                                valuekey: ['props.showGoodsNum']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '数据来源'
                            },
                            {
                                guid: guid(),
                                name: 'sn-union',
                                valuekey: ['data'],
                                style: {
                                    'width': '400px',
                                    'backgroundColor': '#fff',
                                    'padding': '10px'
                                },
                                min: 1,
                                max: 1,
                                defaultvalue: {
                                    info: [],
                                    ids: []
                                },
                                children: [
                                    {
                                        guid: guid(),
                                        name: 'sn-url-picker',
                                        options: buytogether_link_type(),
                                        valuekey: ['']
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }
    }
]