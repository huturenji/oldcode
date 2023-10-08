import { guid } from '@/utils/utils';

// 标签样式数组
const iconTypeList = [
    { value: '无', key: 0 },
    { value: '斜标(左上)', key: 1 },
    { value: '斜标(右上)', key: 2 },
    { value: '火标', key: 3 },
    { value: '圆标', key: 4 },
    { value: '圆角标(左上)', key: 5 },
    { value: '圆角标(中间)', key: 6 },
    { value: '书签标', key: 7 }
]

// 标签配置项
const iconOptions = [
    {
        guid: guid(),
        name: 'sn-title',
        label: '标签位置坐标：',
        style: {
            'fontWeight': 'bold'
        }
    },
    {
        guid: guid(),
        name: 'sn-slide',
        label: 'X：',
        type: 'union',
        max: 100,
        style: {
            'display': 'flex'
        },
        valuekey: ['iconStyle.positionX']
    },
    {
        guid: guid(),
        name: 'sn-slide',
        label: 'Y：',
        type: 'union',
        max: 100,
        style: {
            'display': 'flex'
        },
        valuekey: ['iconStyle.positionY']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '标签背景：',
        style: {
            'fontWeight': 'bold',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '背景会优先取图片,其次取取色器颜色',
        style: {
            color: "red"
        }
    },
    {
        guid: guid(),
        name: 'sn-upload',
        showDelBtn: false,
        valuekey: ['iconStyle.background.img']
    },
    {
        guid: guid(),
        name: 'sn-color-picker',
        valuekey: ['iconStyle.background.color']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        placeholder: '请输入背景透明度（0-100）',
        valuekey: ['iconStyle.background.opacity']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '标签文字：',
        style: {
            'fontWeight': 'bold',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        placeholder: '请输入标签文字',
        valuekey: ['iconStyle.iconText']
    },
    {
        guid: guid(),
        name: 'sn-color-picker',
        valuekey: ['iconStyle.iconTextColor']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '注：暂只支持两个汉字，否则导致文本溢出',
        style: {
            fontSize: '11px',
            color: 'red'
        }
    }
]

// 部分常规价配置项
const normalPriceOptions = [
    {
        guid: guid(),
        name: 'sn-title',
        label: '常规价格位置坐标：',
        style: {
            'fontWeight': 'bold'
        }
    },
    {
        guid: guid(),
        name: 'sn-slide',
        label: 'X：',
        type: 'union',
        max: 100,
        style: {
            'display': 'flex'
        },
        valuekey: ['priceStyle.positionX']
    },
    {
        guid: guid(),
        name: 'sn-slide',
        label: 'Y：',
        type: 'union',
        max: 100,
        style: {
            'display': 'flex'
        },
        valuekey: ['priceStyle.positionY']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        type: 'radio',
        label: '常规价格人民币符号：',
        options: [{ key: 0, value: '隐藏' }, { key: 1, value: '显示' }],
        valuekey: ['priceStyle.ifShowPriceSymbol']
    }
]

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
        name: 'sn-union',
        label: '添加商品',
        min: 1,
        max: 9,
        valuekey: ['data'],
        style: {
            'width': '600px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: { 
            iconStyle : { // icon样式
                type: 0, // 标签类型（0无 1斜标（左上）2斜标(右上) 3火标 4圆标 5圆角标(左上) 6圆角标(中间) 7书签标）
                iconText: '', // 标签内容
                positionX: '', // 位置横坐标
                positionY: '',// 位置纵坐标
                iconTextColor:'', // 标签文本颜色
                background:{color:'',img:'',opacity:''} // 组件背景属性
            
            },
            priceStyle : { // 价格划线样式
                priceStyleType: 0, // 价格样式类型（0常规样式 1划线价样式）
                positionX: '', // 价格横坐标
                positionY: '', // 价格纵坐标
                originPositionX:'',
                originPositionY:'',
                priceFontSize:12, // 价格大小
                priceSymbolAndDemicalSize: 12,// 价格符号和小数
                priceColor: '', // 价格颜色
                originPriceSize: 12,// 划线价大小
                originPriceColor: '', // 划线价颜色
                ifShowPriceSymbol: 1, // 是否展示价格符号
                ifShowOriginPriceSymbol: 1, // 是否展示价格符号
                priceDemicalCount:2, //价格小数位数
                originPriceDemicalCount:2 //划线价格小数位数
            },
            data : {
                ids: [],
                info: []
            }
        },
        children: [
            {
                guid: guid(),
                name: 'sn-goods-picker',
                type: 'goods',
                max: 1,
                style: {
                    width: '360px'
                },
                valuekey: ['data']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '标签样式(只设置样式，标签文字和坐标需在下方设置)：',
                style: {
                    color: 'red'
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                type: 'radio',
                options: iconTypeList,
                valuekey: ['iconStyle.type'],
                children: {
                    1: iconOptions,
                    2: iconOptions,
                    3: iconOptions,
                    4: iconOptions,
                    5: iconOptions,
                    6: iconOptions,
                    7: iconOptions
                }
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '价格样式：',
                style: {
                    'fontWeight': 'bold',
                    'marginTop': '10px',
                    'borderTop': '1px solid #ccc'
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                type: 'radio',
                label: '样式分类：',
                options: [{ key: 0, value: '常规样式' }, { key: 1, value: '划线价样式' }],
                valuekey: ['priceStyle.priceStyleType'],
                children: {
                    0: [
                        ...normalPriceOptions,
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '价格字体大小：',
                            style: {
                                'fontWeight': 'bold'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: '价格大小：',
                            type: 'union',
                            max: 200,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.priceFontSize']
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: '符号和小数：',
                            type: 'union',
                            max: 200,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.priceSymbolAndDemicalSize']
                        },
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '价格小数显示位数：',
                            style: {
                                'fontWeight': 'bold',
                                'borderTop': '1px solid #ccc'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            type: 'radio',
                            label: '划线价格人民币符号：',
                            options: [{ key: 0, value: '0位' }, { key: 1, value: '1位' }, { key: 2, value: '2位' }],
                            valuekey: ['priceStyle.priceDemicalCount']
                        },
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '颜色：',
                            style: {
                                'fontWeight': 'bold',
                                'borderTop': '1px solid #ccc'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-color-picker',
                            label: '价格颜色:',
                            valuekey: ['priceStyle.priceColor']
                        }
                    ],
                    1: [
                        ...normalPriceOptions,
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '划线价格位置坐标：',
                            style: {
                                'fontWeight': 'bold'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: 'X：',
                            type: 'union',
                            max: 100,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.originPositionX']
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: 'Y：',
                            type: 'union',
                            max: 100,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.originPositionY']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            type: 'radio',
                            label: '划线价格人民币符号：',
                            options: [{ key: 0, value: '隐藏' }, { key: 1, value: '显示' }],
                            valuekey: ['priceStyle.ifShowOriginPriceSymbol']
                        },
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '价格字体大小：',
                            style: {
                                'fontWeight': 'bold'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: '价格大小：',
                            type: 'union',
                            max: 200,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.priceFontSize']
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: '符号和小数：',
                            type: 'union',
                            max: 200,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.priceSymbolAndDemicalSize']
                        },
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '划线价大小：',
                            style: {
                                'fontWeight': 'bold'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-slide',
                            label: '符号和小数：',
                            type: 'union',
                            max: 200,
                            style: {
                                'display': 'flex'
                            },
                            valuekey: ['priceStyle.originPriceSize']
                        },
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '价格小数显示位数：',
                            style: {
                                'fontWeight': 'bold',
                                'borderTop': '1px solid #ccc'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            type: 'radio',
                            label: '价格小数位数：',
                            options: [{ key: 0, value: '0位' }, { key: 1, value: '1位' }, { key: 2, value: '2位' }],
                            valuekey: ['priceStyle.priceDemicalCount']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            type: 'radio',
                            label: '划线价格人民币符号：',
                            options: [{ key: 0, value: '0位' }, { key: 1, value: '1位' }, { key: 2, value: '2位' }],
                            valuekey: ['priceStyle.originPriceDemicalCount']
                        },
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: '颜色：',
                            style: {
                                'fontWeight': 'bold',
                                'borderTop': '1px solid #ccc'
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-color-picker',
                            label: '价格颜色:',
                            valuekey: ['priceStyle.priceColor']
                        },
                        {
                            guid: guid(),
                            name: 'sn-color-picker',
                            label: '划线价格颜色:',
                            valuekey: ['priceStyle.originPriceColor']
                        }
                    ]
                }
            }
        ]
    }
]