import { guid } from '@/utils/utils';
import { m_diy_link_type } from '@/utils/util_data';
import { userDataList } from '../common/common.js'

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
        label: '是否展示头像',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showAvatarData'],
        style: {
            'marginTop': '20px',
            'paddingTop': '10px',
            'borderTop': '1px solid #ccc'
        },
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '点击头像跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.avatarData']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否展示名称',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showNameData'],
        style: {
            'marginTop': '20px',
            'paddingTop': '10px',
            'borderTop': '1px solid #ccc'
        },
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '点击名称跳转链接'
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.nameData']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否展示右侧图标',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showRightData'],
        style: {
            'marginTop': '20px',
            'paddingTop': '10px',
            'borderTop': '1px solid #ccc'
        },
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.rightData.img']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '请输入标题',        
                    style: {
                        'width': '200px',
                        'marginBottom': '10px',
                        'display': 'block'
                    },
                    valuekey: ['data.0.rightData.title']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '图片尺寸（默认22px）',        
                    style: {
                        'width': '200px',
                        'marginBottom': '10px',
                        'display': 'block'
                    },
                    valuekey: ['data.0.rightData.imgWidth']
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.rightData']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否展示个人信息项',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showUserItems'],
        style: {
            'marginTop': '20px',
            'paddingTop': '10px',
            'borderTop': '1px solid #ccc'
        },
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '容器内边距：'
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '上',
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.padding.0']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '右',
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.padding.1']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '下',
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.padding.2']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '左',
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.padding.3']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '容器外边距：'
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '上',
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.margin.0']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '右',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.margin.1']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '下',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.margin.2']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '左',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.margin.3']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '容器圆角：'
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '左上',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.radius.0']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '右上',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.radius.1']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '右下',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.radius.2']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '左下',        
                    style: {
                        'width': '100px',
                        'marginBottom': '5px',
                        'display': 'inline-block'
                    },
                    valuekey: ['props.userItemProps.radius.3']
                },
                {
                    guid: guid(),
                    name: 'sn-color-picker',
                    label: '容器背景色:',
                    valuekey: ['props.userItemProps.background']
                },
                {
                    guid: guid(),
                    name: 'sn-color-picker',
                    label: '数值文本颜色:',
                    defaultvalue: '#222',
                    valuekey: ['props.userItemProps.numberColor']
                },
                {
                    guid: guid(),
                    name: 'sn-color-picker',
                    label: '标题文本颜色:',
                    defaultvalue: '#999',
                    valuekey: ['props.userItemProps.titleColor']
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '每行最多个数（默认为4）',
                    type: 'radio',
                    options: [{ key: 3, value: 3 }, { key: 4, value: 4 }, { key: 5, value: 5 }],
                    valuekey: ['props.userItemProps.maxNum']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '添加展示用户信息'
                },
                {
                    guid: guid(),
                    name: 'sn-union',
                    label: '添加信息',
                    valuekey: ['data.0.userData'],
                    style: {
                        'width': '300px',
                        'backgroundColor': '#f8f8f8',
                        'padding': '10px'
                    },
                    defaultvalue: {
                        title: '',
                        source: '',
                        url: ''
                    },
                    children: [
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            placeholder: '请输入标题',        
                            style: {
                                'width': '200px',
                                'marginBottom': '5px',
                                'display': 'block'
                            },
                            valuekey: ['title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-select',
                            options: userDataList,
                            label: '数据来源：',
                            style: {
                                width: '200px'
                            },
                            valuekey: ['source']
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
    }
]