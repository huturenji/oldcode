
import { guid } from '@/utils/utils';
import { m_diy_link_type,sld_m_diy_activity_conbination_style,activity_combination_link_type } from '@/utils/util_data';

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
    // {
    //     guid: guid(),
    //     name: 'sn-radio',
    //     label: "是否隐藏不可售商品",
    //     type: 'radio',
    //     options: [{ key: true, value: '是' }, { key: false, value: '否' }],
    //     valuekey: ['props.filterNosaleGoods']
    // },
    {
        guid: guid(),
        name: 'sn-title',
        label: '',
        style: {
            'borderBottom': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: "组件展示类型",
        style:{
            'width':'200px'
        },
        type: 'img',
        options: sld_m_diy_activity_conbination_style,
        valuekey: ['props.show_style'],
        children:{
            one:[
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '1区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: "展示类型",
                    type: 'radio',
                    options: [{ key: 'activity', value: '活动' }, { key: 'img', value: '图片' }],
                    valuekey: ['data.0.areaOne.areaOneType'],
                    children:{
                        activity:[
                            {
                                guid: guid(),
                                name: 'sn-color-picker',
                                label: "区域背景颜色",
                                valuekey: ['data.0.areaOne.backgroundColor']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '区域样式',
                                type: 'radio',
                                options: [{ key: 'one', value: '样式1（卡片内）' }, { key: 'two', value: '样式2（卡片外）' }],
                                valuekey: ['data.0.areaOne.style']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '主标题（优选展示文字）'
                            },
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaOne.leftText.img']
                            },
                            {
                                guid: guid(),
                                name: 'sn-text',
                                type: 'input',
                                placeholder: '请输入描述',
                                style: {
                                    'width': '240px',
                                    'display': 'block',
                                    'marginBottom': '5px'
                                },
                                valuekey: ['data.0.areaOne.leftText.title']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '活动数据来源'
                            },
                            {
                                guid: guid(),
                                name: 'sn-url-picker',
                                options: activity_combination_link_type(),
                                valuekey: ['data.0.areaOne.sources']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: "活动商品是否轮播",
                                type: 'radio',
                                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                valuekey: ['data.0.areaOne.isLunbo'],
                                children:{
                                    true:[
                                        {
                                            guid: guid(),
                                            name: 'sn-title',
                                            label: '请输入轮播间隔时长（1-10），精确至小数点后一位'
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-text',
                                            type: 'inputNumber',
                                            min:1,
                                            max:10,
                                            step:0.1,
                                            placeholder: '轮播间隔时长',
                                            valuekey: ['data.0.areaOne.speed']
                                        }
                                    ]
                                }
                            }
                        ],
                        img:[
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaOne.img']
                            }
                        ]
                    }
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaOne.link']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '2区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.areaTwo.img']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaTwo.link']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '3区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.areaThree.img']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaThree.link']
                }
            ],
            two:[
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '1区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: "展示类型",
                    type: 'radio',
                    options: [{ key: 'activity', value: '活动' }, { key: 'img', value: '图片' }],
                    valuekey: ['data.0.areaOne.areaOneType'],
                    children:{
                        activity:[
                            {
                                guid: guid(),
                                name: 'sn-color-picker',
                                label: "区域背景颜色",
                                valuekey: ['data.0.areaOne.backgroundColor']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '区域样式',
                                type: 'radio',
                                options: [{ key: 'one', value: '样式1（卡片内）' }, { key: 'two', value: '样式2（卡片外）' }],
                                valuekey: ['data.0.areaOne.style']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '主标题（优选展示文字）'
                            },
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaOne.leftText.img']
                            },
                            {
                                guid: guid(),
                                name: 'sn-text',
                                type: 'input',
                                placeholder: '请输入描述',
                                style: {
                                    'width': '240px',
                                    'display': 'block',
                                    'marginBottom': '5px'
                                },
                                valuekey: ['data.0.areaOne.leftText.title']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '活动数据来源'
                            },
                            {
                                guid: guid(),
                                name: 'sn-url-picker',
                                options: activity_combination_link_type(),
                                valuekey: ['data.0.areaOne.sources']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: "活动商品是否轮播",
                                type: 'radio',
                                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                valuekey: ['data.0.areaOne.isLunbo'],
                                children:{
                                    true:[
                                        {
                                            guid: guid(),
                                            name: 'sn-title',
                                            label: '请输入轮播间隔时长（1-10），精确至小数点后一位'
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-text',
                                            type: 'inputNumber',
                                            min:1,
                                            max:10,
                                            step:0.1,
                                            placeholder: '轮播间隔时长',
                                            valuekey: ['data.0.areaOne.speed']
                                        }
                                    ]
                                }
                            }
                        ],
                        img:[
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaOne.img']
                            }
                        ]
                    }
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaOne.link']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '2区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.areaTwo.img']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaTwo.link']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '3区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.areaThree.img']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaThree.link']
                }
            ],
            three:[
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '1区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: "展示类型",
                    type: 'radio',
                    options: [{ key: 'activity', value: '活动' }, { key: 'img', value: '图片' }],
                    valuekey: ['data.0.areaOne.areaOneType'],
                    children:{
                        activity:[
                            {
                                guid: guid(),
                                name: 'sn-color-picker',
                                label: "区域背景颜色",
                                valuekey: ['data.0.areaOne.backgroundColor']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '区域样式',
                                type: 'radio',
                                options: [{ key: 'one', value: '样式1（卡片内）' }, { key: 'two', value: '样式2（卡片外）' }],
                                valuekey: ['data.0.areaOne.style']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '主标题（优选展示文字）'
                            },
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaOne.leftText.img']
                            },
                            {
                                guid: guid(),
                                name: 'sn-text',
                                type: 'input',
                                placeholder: '请输入描述',
                                style: {
                                    'width': '240px',
                                    'display': 'block',
                                    'marginBottom': '5px'
                                },
                                valuekey: ['data.0.areaOne.leftText.title']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '活动数据来源'
                            },
                            {
                                guid: guid(),
                                name: 'sn-url-picker',
                                options: activity_combination_link_type(),
                                valuekey: ['data.0.areaOne.sources']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: "活动商品是否轮播",
                                type: 'radio',
                                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                valuekey: ['data.0.areaOne.isLunbo'],
                                children:{
                                    true:[
                                        {
                                            guid: guid(),
                                            name: 'sn-title',
                                            label: '请输入轮播间隔时长（1-10），精确至小数点后一位'
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-text',
                                            type: 'inputNumber',
                                            min:1,
                                            max:10,
                                            step:0.1,
                                            placeholder: '轮播间隔时长',
                                            valuekey: ['data.0.areaOne.speed']
                                        }
                                    ]
                                }
                            }
                        ],
                        img:[
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaOne.img']
                            }
                        ]
                    }
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaOne.link']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    style:{
                        'fontSize':'16px',
                        'borderTop':'1px solid #ccc',
                        'fontWeight':'bold'
                    },
                    label: '2区域信息'
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: "展示类型",
                    type: 'radio',
                    options: [{ key: 'activity', value: '活动' }, { key: 'img', value: '图片' }],
                    valuekey: ['data.0.areaTwo.areaTwoType'],
                    children:{
                        activity:[
                            {
                                guid: guid(),
                                name: 'sn-color-picker',
                                label: "区域背景颜色",
                                valuekey: ['data.0.areaTwo.backgroundColor']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: '区域样式',
                                type: 'radio',
                                options: [{ key: 'one', value: '样式1（卡片内）' }, { key: 'two', value: '样式2（卡片外）' }],
                                valuekey: ['data.0.areaOne.style']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '主标题（优选展示文字）'
                            },
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaTwo.leftText.img']
                            },
                            {
                                guid: guid(),
                                name: 'sn-text',
                                type: 'input',
                                placeholder: '请输入描述',
                                style: {
                                    'width': '240px',
                                    'display': 'block',
                                    'marginBottom': '5px'
                                },
                                valuekey: ['data.0.areaTwo.leftText.title']
                            },
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '活动数据来源'
                            },
                            {
                                guid: guid(),
                                name: 'sn-url-picker',
                                options: activity_combination_link_type(),
                                valuekey: ['data.0.areaTwo.sources']
                            },
                            {
                                guid: guid(),
                                name: 'sn-radio',
                                label: "活动商品是否轮播",
                                type: 'radio',
                                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                                valuekey: ['data.0.areaTwo.isLunbo'],
                                children:{
                                    true:[
                                        {
                                            guid: guid(),
                                            name: 'sn-title',
                                            label: '请输入轮播间隔时长（1-10），精确至小数点后一位'
                                        },
                                        {
                                            guid: guid(),
                                            name: 'sn-text',
                                            type: 'inputNumber',
                                            min:1,
                                            max:10,
                                            step:0.1,
                                            placeholder: '轮播间隔时长',
                                            valuekey: ['data.0.areaTwo.speed']
                                        }
                                    ]
                                }
                            }
                        ],
                        img:[
                            {
                                guid: guid(),
                                name: 'sn-upload',
                                valuekey: ['data.0.areaTwo.img']
                            }
                        ]
                    }
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.areaTwo.link']
                }
            ]
        }
    }  
]