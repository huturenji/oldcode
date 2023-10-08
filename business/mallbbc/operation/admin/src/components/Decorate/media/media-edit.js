import { guid } from '@/utils/utils';

const commonList = [
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: "新闻标题",
        placeholder: '请输入标题，最多200个字',
        style: {
            width: '300px'
        },
        valuekey: ['title']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: "发布机构",
        placeholder: '请输入发布机构，最多10个字',
        style: {
            width: '300px'
        },
        valuekey: ['mediaName']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: "新闻标识id",
        placeholder: '请输入新闻标识id，最多20个字',
        style: {
            width: '300px'
        },
        valuekey: ['articleId']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '新闻图片'
    }
]

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
        label: '资讯展示类型',
        type: 'radio',
        options: [{ key: 'text', value: '文字' }, { key: 'img', value: '图片' }],
        valuekey: ['props.showStyle']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '图片边角',
        type: 'radio',
        options: [{ key: '8', value: '圆角' }, { key: '0', value: '直角' }],
        valuekey: ['props.news_border_radius']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: "更多资讯",
        placeholder: '请输入跳转链接',
        style: {
            width: '300px'
        },
        valuekey: ['props.more_news']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: "资讯分类ID",
        placeholder: '请输入资讯分类ID',
        style: {
            width: '300px'
        },
        valuekey: ['props.categoryId']
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加导航',
        valuekey: ['data'],
        max: 5,
        style: {
            'width': '400px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            news_style: '1', //样式,默认1图
            title: '', //新闻标题
            mediaName: '',
            articleId: '',
            lastUpdateTime: new Date().getTime(), //更新时间
            children: [{
                img: '',
                img_path: "",
                info: "",
                name: "",
                url: "",
                url_type: "",
                guid: guid()
            }]
        },
        children: [
            {
                guid: guid(),
                name: 'sn-radio',
                label: '展示风格',
                type: 'radio',
                options: [{ key: '3', value: '3图布局' }, { key: '1', value: '1图布局' }],
                valuekey: ['news_style'],
                children: {
                    1: [
                        ...commonList,
                        {
                            guid: guid(),
                            name: 'sn-union',
                            label: '添加图片',
                            valuekey: ['children'],
                            max: 1,
                            style: {
                                'width': '160px',
                                'backgroundColor': '#ccc',
                                'padding': '10px'
                            },
                            defaultvalue: {
                                img: ''
                            },
                            children: [
                                {
                                    guid: guid(),
                                    name: 'sn-upload',
                                    showDelBtn: false,
                                    valuekey: ['img']
                                }
                            ]
                        }
                    ],
                    3: [
                        ...commonList,
                        {
                            guid: guid(),
                            name: 'sn-union',
                            label: '添加图片',
                            valuekey: ['children'],
                            max: 3,
                            style: {
                                'width': '160px',
                                'backgroundColor': '#ccc',
                                'padding': '10px'
                            },
                            defaultvalue: {
                                img: ''
                            },
                            children: [
                                {
                                    guid: guid(),
                                    name: 'sn-upload',
                                    showDelBtn: false,
                                    valuekey: ['img']
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    }
]