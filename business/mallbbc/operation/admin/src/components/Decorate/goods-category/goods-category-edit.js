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
        options: [{ key: 1, value: '旧分类' }, { key: 2, value: '新分类' }, { key: 3, value: '图片' }],
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
        label: '是否隐藏无实惠标签商品',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.filterNoSubstantialGoods']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '分类是否吸顶（在侧边导航栏中无效）',
        type: 'radio',
        options: [{ key: false, value: '是' }, { key: true, value: '否' }],
        valuekey: ['props.fixed']
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
        name: 'sn-radio',
        label: '请选择商品数据来源',
        type: 'radio',
        options: [{ key: 'upload', value: '本地上传' }, { key: 'goodsPool', value: '自定义商品池' }],
        custEvent: 'goodsCategory',
        valuekey: ['props.sources'],
        children: {
            upload: [
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
                        img:'',
                        imgActivity:'',
                        ids: [], // 数据id集合
                        info: [] // 数据信息
                    },
                    children: [
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            label: '分类标题：',
                            placeholder: '请输入分类标题',
                            style: {
                                'width': '300px'
                            },
                            valuekey: ['title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            label: '分类图片',
                            valuekey: ['img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            label: '选中后的分类图片',
                            valuekey: ['imgActivity']
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
            ],
            goodsPool: [
                {
                    guid: guid(),
                    name: 'sn-union',
                    label: '添加分类导航',
                    valuekey: ['data'],
                    max: 15,
                    style: {
                        'width': '400px',
                        'backgroundColor': '#f8f8f8',
                        'padding': '10px'
                    },
                    defaultvalue: {
                        title: '全部', // 分类标题
                        goodsPool:{},
                        goodsGroup:[]
                    },
                    children: [
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            label: '导航标题：',
                            max: 16,
                            placeholder: '请输入父标题，最多16个',
                            style: {
                                'width': '300px'
                            },
                            valuekey: ['title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            label: '分类图片',
                            valuekey: ['img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            label: '选中后的分类图片',
                            valuekey: ['imgActivity']
                        },
                        {
                            guid: guid(),
                            name: 'sn-goods-picker',
                            type: 'goodsPool',
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