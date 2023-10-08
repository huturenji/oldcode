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
                    name: 'sn-background',
                    disabled: true,
                    valuekey: ['styles']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '图片',
        style: {
            'lineHeight': '40px',
            'borderTop': '1px solid #ccc',
            'marginTop': '10px',
            'fontSize': '16px'
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加子项目',
        min: 1,
        max: 1,
        valuekey: ['data.0.imglist'],
        style: {
            'width': '400px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            img: '', // 图片绝对地址
            title: '', // 图片标题
            url: '', // 链接值
            url_type: '', // 链接类型
            info: '' // 用于存放额外信息
        },
        children: [
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['img']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                placeholder: '请输入描述',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['title']
            }
            // {
            //     name: 'sn-url-picker',
            //     options: m_diy_link_type(),
            //     valuekey: ['']
            // }
        ]
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '商品信息',
        style: {
            'lineHeight': '40px',
            'borderTop': '1px solid #ccc',
            'marginTop': '20px',
            'fontSize': '16px'
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加子项目',
        max: 10,
        valuekey: ['data.0.children'],
        style: {
            'width': '400px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            img: '', // 图片绝对地址
            title: '', // 图片标题
            price: '', // 活动价
            url: '', // 链接值
            url_type: '', // 链接类型
            info: '' // 用于存放额外信息
        },
        children: [
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['img']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                placeholder: '请输入描述',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['title']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                placeholder: '请输入活动价',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['price']
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