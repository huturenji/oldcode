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
        name: 'sn-radio',
        label: '请选择商品分类样式',
        type: 'radio',
        options: [{ key: 1, value: '旧分类' }, { key: 2, value: '新分类' }],
        valuekey: ['props.cateStyle']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '当分类标题只有一个时，是否展示分类标题',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showFirstNav']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '请选择商品数据来源',
        type: 'radio',
        options: [{ key: 'upload', value: '本地上传' }],
        custEvent: 'goodsCategory',
        valuekey: ['props.sources'],
        children: {
            upload: [
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
                    label: '商品展示模式',
                    type: 'radio',
                    options: [{ key: "small", value: '一行两个' }, { key: "bijia", value: '一行一个' }, { key: "datubijia", value: '大图' }, { key: "half_rank", value: '一行两个2' }],
                    valuekey: ['props.show_style']
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '是否隐藏不可售商品',
                    type: 'radio',
                    options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                    valuekey: ['props.filterNosaleGoods']
                },
                {
                    guid: guid(),
                    name: 'sn-union',
                    label: '添加分类导航',
                    valuekey: ['data'],
                    max: 15,
                    style: {
                        'width': '400px',
                        'backgroundColor': '#eceaea',
                        'padding': '10px'
                    },
                    defaultvalue: {
                        title: '全部', // 分类标题
                        ids: [], // 数据id集合
                        info: [] // 数据信息
                    },
                    children: [
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            label: '分类标题：',
                            max: 4,
                            placeholder: '请输入分类标题，最多4个字',
                            style: {
                                'width': '300px'
                            },
                            valuekey: ['title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-goods-picker',
                            type: 'goods',
                            valuekey: [''],
                            style: {
                                'marginTop': '10px',
                                'width': '360px'
                            }
                        }
                    ]
                }
            ]
        }
    }
]