import { guid } from '@/utils/utils';
import { m_diy_link_type } from '@/utils/util_data';

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
        label: '显示风格',
        type: 'radio',
        options: [{ key: 'nav', value: '导航' }, { key: 'tag-nav', value: '分组' }],
        valuekey: ['props.style_set'],
        children: {
            nav: [
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '显示图标',
                    type: 'radio',
                    options: [{ key: 'up', value: '图标居上' }, { key: 'left', value: '图标居左' }, { key: 'no-icon', value: '不显示图标' }],
                    valuekey: ['props.icon_set'],
                    children: {
                        up: [
                            {
                                guid: guid(),
                                name: 'sn-color-picker',
                                label: '手机端滚动条颜色',
                                defaultvalue: '#ff8676',
                                valuekey: ['props.indicatorColor']
                            },
                            {
                                guid: guid(),
                                name: 'sn-color-picker',
                                label: '手机端滚动条滑块颜色',
                                valuekey: ['props.indicatorActiveColor']
                            }
                        ],
                        left: [
                            {
                                guid: guid(),
                                name: 'sn-title',
                                label: '图标大小'
                            },
                            {
                                guid: guid(),
                                name: 'sn-slide',
                                min: 30,
                                max: 80,
                                valuekey: ['props.slide']
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '导航图片',
        style: {
            'fontSize': '16px',
            'marginTop': '5px',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加导航',
        valuekey: ['data'],
        style: {
            'width': '400px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            img: '',
            name: '',
            url: '',
            url_type: '',
            info: ''
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
                placeholder: "请输入导航名称",
                valuekey: ['name']
            },
            {
                guid: guid(),
                name: 'sn-url-picker',
                options: m_diy_link_type(),
                valuekey: [''],
                style: {
                    'marginTop': '10px'
                }
            }
        ]
    }
]