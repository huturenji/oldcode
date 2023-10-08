import { guid } from '@/utils/utils';
import { m_diy_link_type, seckill_link_type } from '@/utils/util_data';

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
        name: 'sn-text',
        label: '组件圆角:',
        type: 'input',
        max: 15,
        style: {
            'width': '300px',
            'marginBottom': '10px'
        },
        valuekey: ['props.borderRadius']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '左标题',
        style: {
            'margin': '10px 0',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-upload',
        valuekey: ['props.leftText.img']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        placeholder: '请输入标题',        
        style: {
            'width': '300px'
        },
        valuekey: ['props.leftText.title']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '右标题',
        style: {
            'margin': '10px 0',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-upload',
        valuekey: ['props.rightText.img']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        placeholder: '请输入标题',        
        style: {
            'width': '300px'
        },
        valuekey: ['props.rightText.title']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '秒杀活动链接',
        style: {
            'margin': '10px 0',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-url-picker',
        options: m_diy_link_type(),
        valuekey: ['props.linkdata']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '活动类型',
        type: 'radio',
        options: [{ key: 'vop', value: 'vop秒杀' }],
        valuekey: ['props.seckillType'],
        style: {
            'margin': '10px 0',
            'borderTop': '1px solid #ccc'
        },
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
                    valuekey: ['data.0.vopdata']
                }
            ]
        }
    }
]