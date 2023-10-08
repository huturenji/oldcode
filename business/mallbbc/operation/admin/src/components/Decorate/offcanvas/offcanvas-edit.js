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
        label: '添加左侧分类',
        max: 15,
        custEvent: 'offcanvas',
        valuekey: ['data'],
        style: {
            'width': '500px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            leftTitle: { //左侧标题
                img: '',//图片绝对地址
                title:''
            },
            mainTitle:{//右侧主标题
                titleStyle: 'imgOrtext',
                img: '',//图片绝对地址
                title:''
            },
            subTitle:{//右侧副标题
                titleStyle: 'none',
                img: '',//图片绝对地址
                img_path: '',//图片相对地址
                title:'',//文字 或者 倒计时
                url: '', //链接值
                url_type: ''//链接类型
            },
            children: {},
            backgroundImg: '', //分类背景图
            topBackgroundImg:'' //顶部分类的背景图
        },
        children: [
            {
                guid: guid(),
                name: 'sn-title',
                label: '分类标题:',
                style: {
                    'fontWeight': 'bold'
                }
            },
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['leftTitle.img']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                placeholder: '请输入分类标题',
                style: {
                    'width': '200px',
                    'marginLeft': '10px'
                },
                valuekey: ['leftTitle.title']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '内容标题设置:',
                style: {
                    'fontWeight': 'bold'
                }
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '主标题',
                style: {
                    'borderTop': '1px solid #ccc'
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '',
                type: 'radio',
                options: [{ key: 'none', value: '无' }, { key: 'imgOrtext', value: '图文' }],
                valuekey: ['mainTitle.titleStyle'],
                children: {
                    imgOrtext: [
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            valuekey: ['mainTitle.img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            placeholder: '请输入主标题',
                            style: {
                                'width': '200px',
                                'marginLeft': '10px'
                            },
                            valuekey: ['mainTitle.title']
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '副标题',
                type: 'radio',
                options: [{ key: 'none', value: '无' }, { key: 'imgOrtext', value: '图文' }],
                valuekey: ['subTitle.titleStyle'],
                style: {
                    'borderTop': '1px solid #ccc'
                },
                children: {
                    imgOrtext: [
                        {
                            guid: guid(),
                            name: 'sn-upload',
                            valuekey: ['subTitle.img']
                        },
                        {
                            guid: guid(),
                            name: 'sn-text',
                            type: 'input',
                            placeholder: '请输入副标题',
                            style: {
                                'width': '200px',
                                'marginBottom': '10px',
                                'display': 'block'
                            },
                            valuekey: ['subTitle.title']
                        },
                        {
                            guid: guid(),
                            name: 'sn-url-picker',
                            options: m_diy_link_type(),
                            valuekey: ['subTitle']
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-upload',
                label: '顶部背景',
                valuekey: ['topBackgroundImg']
            }
        ]
    }
]