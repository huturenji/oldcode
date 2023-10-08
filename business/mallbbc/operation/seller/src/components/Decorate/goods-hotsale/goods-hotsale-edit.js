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
        label: "是否隐藏不可售商品",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.filterNosaleGoods']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '左方文字',
        style: {
            'borderTop': '1px solid #ccc',
            'fontSize': '16px'
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
        placeholder: '请输入描述',
        style: {
            'width': '240px',
            'display': 'block',
            'marginBottom': '5px'
        },
        valuekey: ['props.leftText.title']
    },
    {
        guid: guid(),
        name: 'sn-url-picker',
        options: m_diy_link_type(),
        valuekey: ['props.leftText']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '右方文字',
        style: {
            'borderTop': '1px solid #ccc',
            'marginTop': '15px',
            'fontSize': '16px'
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
        placeholder: '请输入描述',
        style: {
            'width': '240px',
            'display': 'block',
            'marginBottom': '5px'
        },
        valuekey: ['props.rightText.title']
    },
    {
        guid: guid(),
        name: 'sn-url-picker',
        options: m_diy_link_type(),
        valuekey: ['props.rightText']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '选择商品',
        style: {
            'borderTop': '1px solid #ccc',
            'marginTop': '15px',
            'fontSize': '16px'
        }
    },
    {
        guid: guid(),
        name: 'sn-goods-picker',
        type: 'goods',
        valuekey: ['data.0'],
        style: {
            width: '360px'
        }
    }
]