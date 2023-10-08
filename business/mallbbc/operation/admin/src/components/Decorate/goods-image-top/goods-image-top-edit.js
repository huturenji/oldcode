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
        name: 'sn-upload',
        label: '搭配图片',
        valuekey: ['props.dapei_img']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '此处建议上传宽度为750，高度不限制的图片',
        style: {
            'fontSize': '12px',
            'color': '#136cd8',
            'line-height': '15px',
            'marginBottom': '10px'
        }
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '搭配图片链接',
        style: {
            'paddingTop': '5px',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-url-picker',
        options: m_diy_link_type(),
        style: {
            'paddingBottom': '15px',
            'borderBottom': '1px solid #ccc'
        },
        valuekey: ['props.dapei_link']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        max: 15,
        label: "图片标题",
        style: {
            'width': '300px'
        },
        valuekey: ['props.dapei_title']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        max: 50,
        label: "图片描述",
        placeholder: '请输入图片描述',
        style: {
            'width': '300px'
        },
        valuekey: ['props.dapei_desc']
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
        name: 'sn-radio',
        label: '是否隐藏无实惠标签商品',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.filterNoSubstantialGoods']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '选择商品'
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