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
        name: 'sn-union',
        label: '添加图片',
        max: 9,
        valuekey: ['data'],
        style: {
            'width': '300px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            img: '', // 图片绝对地址
            url: '', // 链接值
            url_type: '', // 链接类型
            info: '', // 用于存放额外信息
            products:[],// 选择确认订单页的商品数据
            goodsInfo:[],
            ids: []
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
                name: 'sn-url-picker',
                options: m_diy_link_type(),
                valuekey: ['']
            }
        ]
    }
]