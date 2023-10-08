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
        name: 'sn-text',
        type: 'input',
        label: '搜索框内容',
        placeholder: '请输入搜索框内容',
        style: {
            'width': '300px',
            'marginBottom': '10px',
            'display': 'block'
        },
        valuekey: ['props.inputVal']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: '跳转链接地址',
        placeholder: '请输入跳转链接地址',
        style: {
            'width': '300px',
            'marginBottom': '10px',
            'display': 'block'
        },
        valuekey: ['props.linkVal']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: "是否展示店铺列表 (选择“否”时，搜索列表将不会展示店铺)",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showStoreList']
    },
    {
        guid: guid(),
        name: 'sn-tree',
        label: '数据来源:',
        data: {
            connect: true,
            key: 'storeList'
        },
        valuekey: ['props.storeAndSupplierInfos']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: "是否固定在顶部",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.fixed'],
        children: {
            false: [
                {
                    name: 'sn-radio',
                    label: "是否悬浮",
                    type: 'radio',
                    options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                    valuekey: ['props.suspend']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: "搜索样式",
        type: 'radio',
        options: [{ key: 'section', value: '样式1' }, { key: 'all', value: '样式2' }],
        valuekey: ['props.show_style']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '最多增加两个设置。第一个是页面初始状态，另一个是页面滑动后的状态',
        style: {
            color: 'red'
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加子项目',
        max: 2,
        valuekey: ['data'],
        style: {
            'width': '400px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            showLeftText: false,//是否展示左方内容
            showUnion: false,//点击右方图片是否是弹窗
            showRightText: false,//是否展示右方图片
            color:'#999', //文字颜色
            background:'#fff', //背景颜色
            searchBackground:'#eff2f5', // 搜索框颜色
            leftData:[{
                img: '',//左方方图片的路径
                img_path: '',//图片相对地址
                url: '', //链接值
                url_type: '',//链接类型
                info: ''
            }],
            searchImg:'',//搜索图标的路径
            img: '',//右方图片的路径
            img_path: '',//图片相对地址
            url: '', //链接值
            url_type: '', //链接类型
            info: ''
        },
        children: [
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否展示左方内容',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showLeftText'],
                defaultvalue: {
                    img: '',//左方方图片的路径
                    img_path: '',//图片相对地址
                    info: '',
                    url: '', //链接值
                    url_type: '' //链接类型
                },
                children: {
                    true: [
                        {
                            guid: guid(),
                            name: 'sn-union',
                            min: 1,
                            max: 1,
                            valuekey: ['leftData'],
                            style: {
                                'width': '250px',
                                'padding': '10px',
                                'backgroundColor': '#eceaea'
                            },
                            children: [
                                {
                                    guid: guid(),
                                    name: 'sn-upload',
                                    valuekey: ['img']
                                },
                                {
                                    guid: guid(),
                                    name: 'sn-title',
                                    label: '左方图片链接'
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
            },
            {
                guid: guid(),
                name: 'sn-upload',
                label: '请上传搜索图标',
                valuekey: ['searchImg']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '搜索框文字颜色',
                style: {
                    'marginBottom': '10px'
                },
                valuekey: ['color']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '组件背景色',
                style: {
                    'marginBottom': '10px'
                },
                valuekey: ['background']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '搜索框背景色',
                style: {
                    'marginBottom': '10px'
                },
                valuekey: ['searchBackground']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: "是否展示右方内容",
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showRightText'],
                children: {
                    true: [
                        {
                            guid: guid(),
                            name: 'sn-radio',
                            label: "右方展示类型",
                            type: 'radio',
                            options: [{ key: false, value: '图片' }],
                            valuekey: ['showUnion'],
                            children: {
                                false: [
                                    {
                                        guid: guid(),
                                        name: 'sn-upload',
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
                        }
                    ]
                }
            }
        ]
    }
]