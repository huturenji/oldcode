import { seckill_link_type, seckill_more_link_type, m_diy_link_type } from '@/utils/util_data';
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
        label: '是否显示顶部分类',
        type: 'radio',
        options: [{ key: true, value: '显示' }, { key: false, value: '不显示' }],
        valuekey: ['props.firstTabShow']
    },
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
        name: 'sn-radio',
        label: '分类是否吸顶（对嵌套组件无效）',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.tabFixed']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '商品展示样式',
        type: 'radio',
        options: [{ key: 'old', value: '样式1' }, { key: 'new', value: '样式2' }],
        valuekey: ['props.show_style']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '场次分类样式',
        type: 'radio',
        options: [{ key: 1, value: '旧场次样式' }, { key: 2, value: '新场次样式' }],
        valuekey: ['props.cateStyle'],
        children: {
            2: [
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '是否显示顶部区域',
                    type: 'radio',
                    options: [{ key: true, value: '显示' }, { key: false, value: '不显示' }],
                    valuekey: ['props.isTopShow'],
                    children: {
                        true: [
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '主标题',
                                type: 'radio',
                                options: [{ key: 'none', value: '无' }, { key: 'imgOrtext', value: '图文' }],
                                valuekey: ['props.mainTitle.titleStyle'],
                                style: {
                                    'borderTop': '1px solid #ccc'
                                },
                                children: {
                                    imgOrtext: [
                                        {
                                            guid: guid(),
                                            name: 'sn-upload',
                                            valuekey: ['props.mainTitle.img']
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-text',
                                            type: 'input',
                                            placeholder: '请输入主标题',
                                            style: {
                                                'width': '200px',
                                                'marginLeft': '10px'
                                            },
                                            valuekey: ['props.mainTitle.title']
                                        }
                                    ]
                                }
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '副标题',
                                type: 'radio',
                                options: [{ key: 'none', value: '无' }, { key: 'imgOrtext', value: '图文' }, { key: 'countDown', value: '倒计时' }],
                                valuekey: ['props.subTitle.titleStyle'],
                                children: {
                                    imgOrtext: [
                                        {
                                            guid: guid(),
                                            name: 'sn-upload',
                                            valuekey: ['props.subTitle.img']
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-text',
                                            type: 'input',
                                            placeholder: '请输入副标题',
                                            style: {
                                                'width': '200px',
                                                'marginLeft': '10px',
                                                'display': 'block'
                                            },
                                            valuekey: ['props.subTitle.title']
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-url-picker',
                                            options: m_diy_link_type(),
                                            valuekey: ['props.subTitle']
                                        }
                                    ]
                                }
                            },
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                label: '顶部背景',
                                valuekey: ['props.topBackgroundImg']
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-slide',
        label: '商品区域左右内边距',
        max: 20,
        style: {
            'borderTop': '1px solid #ccc'
        },
        valuekey: ['props.contentLRPadding']
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加秒杀活动',
        max: 10,
        valuekey: ['data'],
        style: {
            'width': '460px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            activityName: '',
            seckillType: 'vop',
            vopdata: {
                storeId: '',//数据来源
                recommendId: ''//推广位id
            },//vop商品数据来源
            showProgress: false,
            showBuyNum: false,
            showMaxNum: false,
            showMore: true,
            context: '查看更多商品',
            moredata: {
                url: '', //链接值
                url_type: '' //链接类型
            }
        },
        children: [
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '分类标题',
                placeholder: '请输入分类标题',
                style: {
                    'width': '300px',
                    'marginBottom': '10px',
                    'display': 'block'
                },
                valuekey: ['activityName']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: "秒杀类型",
                type: 'radio',
                options: [{ key: 'vop', value: 'vop秒杀' }],
                valuekey: ['seckillType'],
                children: {
                    vop: [
                        {
                            guid: guid(),
                            name: 'sn-title',
                            label: 'vop秒杀数据来源'
                        },
                        {
                            guid: guid(),
                            name: 'sn-url-picker',
                            options: seckill_link_type(),
                            valuekey: ['vopdata']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            label: '已购比例进度条(只对商品样式1生效)：',
                            type: 'radio',
                            options: [{ key: true, value: '展示' }, { key: false, value: '隐藏' }],
                            valuekey: ['showProgress']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            label: '已抢购件数(只对商品样式1生效)：',
                            type: 'radio',
                            options: [{ key: true, value: '展示' }, { key: false, value: '隐藏' }],
                            valuekey: ['showBuyNum']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            label: '限购数量(只对商品样式1生效)：',
                            type: 'radio',
                            options: [{ key: true, value: '展示' }, { key: false, value: '隐藏' }],
                            valuekey: ['showMaxNum']
                        },
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            label: '页脚(只对商品样式1生效)：',
                            type: 'radio',
                            options: [{ key: true, value: '展示' }, { key: false, value: '隐藏' }],
                            valuekey: ['showMore'],
                            children: {
                                true: [
                                    {
                                        guid: guid(),
                                        name: 'sn-text',
                                        type: 'input',
                                        label: '标题',
                                        placeholder: '请输入标题',
                                        style: {
                                            'width': '300px',
                                            'marginBottom': '10px',
                                            'display': 'block'
                                        },
                                        valuekey: ['context']
                                    },
                                    {
                                        guid: guid(),
                                        name: 'sn-title',
                                        label: '跳转'
                                    },
                                    {
                                        guid: guid(),
                                        name: 'sn-url-picker',
                                        options: seckill_more_link_type(),
                                        valuekey: ['moredata']
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
]