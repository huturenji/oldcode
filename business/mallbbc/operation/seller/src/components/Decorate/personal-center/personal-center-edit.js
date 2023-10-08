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
    }
]