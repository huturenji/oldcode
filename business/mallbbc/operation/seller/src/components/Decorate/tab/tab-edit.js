import { m_diy_link_type } from '@/utils/util_data';
import { guid } from '@/utils/utils';

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
        label: '组件向下滑动是否固定在顶部',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.fixed']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否展示顶部滑动导航title',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showNav']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '组件风格',
        type: 'radio',
        options: [{ key: 'column', value: '风格1' }, { key: 'row', value: '风格2' }],
        valuekey: ['props.showStyle'],
        children: {
            row: [
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '每行最多个数（默认为4）',
                    type: 'radio',
                    options: [{ key: 3, value: 3 }, { key: 4, value: 4 }, { key: 5, value: 5 }],
                    valuekey: ['props.maxNum']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加子项目',
        valuekey: ['data'],
        max: 15,
        style: {
            'width': '500px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            background:'#fff',
            titleData:{
                showTitleData:true,
                img: '',//图片绝对地址
                img_path: '',//图片相对地址
                title:'',
                url: '', //链接值
                url_type: ''//链接类型
            },
            showLogistics:false,//是否显示物流
            size:'big',//图片文字大小
            moreData:{
                showMoreData:false,
                img: '',//图片绝对地址
                img_path: '',//图片相对地址
                title:'',
                url: '', //链接值
                url_type: ''//链接类型
            },
            topData: {
                showTopData: false,
                background: '#fff',
                children: [],
                radius: {
                    showRadius:false,
                    leftTop:"", 
                    rightTop:"",
                    rightBottom:"",
                    leftBottom:""
                }
            },
            children: [{
                tabName: '',
                img: "",
                img_path: "",
                showRedDot:false,//是否展示红点
                redDotSource:'',//红点数据来源
                showArrow:false,//是否展示箭头
                redDotType: 'redDot',
                info: "",
                name: "",
                url: "",
                url_type: "",
                guid: guid()
            }], //数据信息
            radius: {
                showRadius:false,
                leftTop:"",
                rightTop:"",
                rightBottom:"",
                leftBottom:""
            }
        },
        children: [
            {
                guid: guid(),
                name: 'sn-radio',
                label: '顶部区域',
                type: 'radio',
                options: [{ key: true, value: '图文' }, { key: false, value: '无' }],
                valuekey: ['topData.showTopData'],
                children: {
                    true: [
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            label: '顶部区域背景色',
                            style: {
                                display: 'block',
                                width: '200px'
                            },
                            valuekey: ['topData.background']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            label: '顶部区域有无圆角',
                            type: 'radio',
                            options: [{ key: true, value: '有' }, { key: false, value: '无' }],
                            valuekey: ['topData.radius.showRadius'],
                            children: {
                                true: [
                                    {
                                        guid: guid(),
                                        name: 'sn-text',
                                        type: 'input',
                                        placeholder: '左上',
                                        style: {
                                            width: '75px'
                                        },
                                        valuekey: ['topData.radius.leftTop']
                                    },
                                    {
                                        guid: guid(),
                                        name: 'sn-text',
                                        type: 'input',
                                        placeholder: '右上',
                                        style: {
                                            width: '75px'
                                        },
                                        valuekey: ['topData.radius.rightTop']
                                    },
                                    {
                                        guid: guid(),
                                        name: 'sn-text',
                                        type: 'input',
                                        placeholder: '右下',
                                        style: {
                                            width: '75px'
                                        },
                                        valuekey: ['topData.radius.rightBottom']
                                    },
                                    {
                                        guid: guid(),
                                        name: 'sn-text',
                                        type: 'input',
                                        placeholder: '左下',
                                        style: {
                                            width: '75px'
                                        },
                                        valuekey: ['topData.radius.leftBottom']
                                    }
                                ]
                            }
                        },
                        {
                            guid: guid(),
                            name: 'sn-union',
                            label: '添加子项目',
                            valuekey: ['topData.children'],
                            max: 3,
                            style: {
                                'width': '300px',
                                'backgroundColor': '#eceaea',
                                'padding': '10px'
                            },
                            defaultvalue: {
                                tabName: '',
                                img: "",
                                img_path: "",
                                showRedDot:false,//是否展示红点
                                redDotType: 'redDot', // 红点类型
                                redDotSource:'',//红点数据来源
                                redDotUnit: '',
                                showArrow:false,//是否展示箭头
                                info: "",
                                name: "",
                                url: "",
                                url_type: ""
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
                                    name: 'sn-radio',
                                    label: '是否展示红点',
                                    type: 'radio',
                                    options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                    valuekey: ['showRedDot'],
                                    children: {
                                        true: [
                                            {
                                                guid: guid(),
                                                name: 'sn-select',
                                                options: [
                                                    { key: '', value: '无' },
                                                    { key: 'toPaidOrder', value: '待付款' },
                                                    { key: 'toDeliverOrder', value: '待发货' },
                                                    { key: 'toReceivedOrder', value: '待收货' },
                                                    { key: 'afterSaleNum', value: '退换/售后' },
                                                    { key: 'collectNum', value: '收藏' },
                                                    { key: 'couponNum', value: '优惠券' },
                                                    { key: 'redpacketTotal', value: '红包金额' }
                                                ],
                                                label: '红点数据来源：',
                                                style: {
                                                    width: '200px'
                                                },
                                                valuekey: ['redDotSource']
                                            },
                                            {
                                                guid: guid(),
                                                name: 'sn-radio',
                                                label: '数据展示样式：',
                                                type: 'radio',
                                                options: [{ key: 'redDot', value: '红点' }, { key: 'brackets', value: '[1]' }],
                                                valuekey: ['redDotType']
                                            }
                                        ]
                                    }
                                },
                                {
                                    guid: guid(),
                                    name: 'sn-text',
                                    placeholder: '请输入子项目名称',
                                    type: 'input',
                                    style: {
                                        'width': '200px',
                                        'marginBottom': '10px'
                                    },
                                    valuekey: ['tabName']
                                },
                                {
                                    guid: guid(),
                                    name: 'sn-url-picker',
                                    options: m_diy_link_type(),
                                    valuekey: ['']
                                }
                            ]
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '主标题',
                type: 'radio',
                options: [{ key: true, value: '图文' }, { key: false, value: '无' }],
                valuekey: ['titleData.showTitleData'],
                style: {
                    'borderTop': '1px solid #ccc',
                    'marginTop': '5px'
                },
                children: {
                    true: [
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            valuekey: ['titleData.img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            placeholder: '请输入标题',
                            style: {
                                display: 'block',
                                width: '200px'
                            },
                            valuekey: ['titleData.title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-url-picker',
                            options: m_diy_link_type(),
                            style: {
                                'marginTop': '5px'
                            },
                            valuekey: ['titleData']
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '副标题',
                type: 'radio',
                options: [{ key: true, value: '图文' }, { key: false, value: '无' }],
                valuekey: ['moreData.showMoreData'],
                style: {
                    'borderTop': '1px solid #ccc',
                    'marginTop': '5px'
                },
                children: {
                    true: [
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            valuekey: ['moreData.img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            placeholder: '请输入标题',
                            style: {
                                display: 'block',
                                width: '200px'
                            },
                            valuekey: ['moreData.title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-url-picker',
                            options: m_diy_link_type(),
                            style: {
                                'marginTop': '5px',
                                'paddingBottom': '5px',
                                'borderBottom': '1px solid #ccc'
                            },
                            valuekey: ['moreData']
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-text',
                label: '组件背景：',
                type: 'input',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['background']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否展示物流信息',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showLogistics']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '图片文字大小',
                type: 'radio',
                options: [{ key: 'big', value: '大' }, { key: 'small', value: '小' }, { key: 'custom', value: '自定义' }],
                valuekey: ['size'],
                children: {
                    custom: [
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'inputNumber',
                            label: '图片大小',
                            style: {
                                width: '100px'
                            },
                            max:100,
                            valuekey: ['imgSize']
                        },
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'inputNumber',
                            label: '文字大小',
                            max:100,
                            style: {
                                width: '100px'
                            },
                            valuekey: ['textSize']
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-union',
                label: '添加子项目',
                valuekey: ['children'],
                max: 15,
                style: {
                    'width': '300px',
                    'backgroundColor': '#eceaea',
                    'padding': '10px'
                },
                defaultvalue: {
                    tabName: '',
                    img: "",
                    img_path: "",
                    showRedDot:false,//是否展示红点
                    redDotType: 'redDot', // 红点类型
                    redDotSource:'',//红点数据来源
                    redDotUnit: '',
                    showArrow:false,//是否展示箭头
                    info: "",
                    name: "",
                    url: "",
                    url_type: ""
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
                        name: 'sn-radio',
                        label: '是否展示红点',
                        type: 'radio',
                        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                        valuekey: ['showRedDot'],
                        children: {
                            true: [
                                {
                                    guid: guid(),
                                    name: 'sn-select',
                                    options: [
                                        { key: '', value: '无' },
                                        { key: 'toPaidOrder', value: '待付款' },
                                        { key: 'toDeliverOrder', value: '待发货' },
                                        { key: 'toReceivedOrder', value: '待收货' },
                                        { key: 'afterSaleNum', value: '退换/售后' },
                                        { key: 'collectNum', value: '收藏' },
                                        { key: 'couponNum', value: '优惠券' },
                                        { key: 'redpacketTotal', value: '红包金额' }
                                    ],
                                    label: '红点数据来源：',
                                    style: {
                                        width: '200px'
                                    },
                                    valuekey: ['redDotSource']
                                }
                            ]
                        }
                    },
                    {
                        guid: guid(),
                        name: 'sn-text',
                        placeholder: '请输入子项目名称',
                        type: 'input',
                        style: {
                            'width': '200px',
                            'marginBottom': '10px'
                        },
                        valuekey: ['tabName']
                    },
                    {
                        guid: guid(),
                        name: 'sn-url-picker',
                        options: m_diy_link_type(),
                        valuekey: ['']
                    }
                ]
            }
        ]
    }
]