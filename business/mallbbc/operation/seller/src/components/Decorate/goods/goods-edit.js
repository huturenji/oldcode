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
        name: 'sn-text',
        type: 'input',
        label: '商品标题',
        max: 16,
        placeholder: '请输入描述',
        style: {
            'width': '300px',
            'marginBottom': '10px'
        },
        valuekey: ['props.title']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: "底部是否展示'没有更多了'提示字样",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.isShowMore']
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
        label: '商品数据来源',
        type: 'radio',
        options: [{ key:"upload", value:'手动上传'}, { key:"allbuy", value:'都在买'}],
        valuekey: ['props.sources'],
        children: {
            upload: [
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: "商品展示模式",
                    type: 'radio',
                    options: [{ key:"datubijia", value:'大图'}, { key:"small", value:'一行两个'}, { key:"bijia", value:'一行一个'}, { key:"half_rank", value:'一行两个2'}],
                    valuekey: ['props.show_style']
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
        }
    }
]