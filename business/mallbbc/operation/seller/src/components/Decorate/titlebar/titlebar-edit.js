import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-title',
        label: 'TitleBar内容'
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
        label: '添加配置',
        valuekey: ['data'],
        max: 2,
        style: {
            'width': '500px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            showBack: true, // 返回按钮展示
            suspend: true, // 悬浮状态
            background: 'white', // 背景色
            opacity: '100', // 透明度
            themeMode: 'dark', // 按钮颜色
            color: 'black', // 文字颜色
            showTitle: true // title展示
        },
        children: [
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否展示返回按钮',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showBack']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否显示标题文字',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showTitle']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否是沉浸式',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['suspend']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: "请输入背景色",
                valuekey: ['background']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: "请输入透明度（0-100）",
                valuekey: ['opacity']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: "请输入文字颜色",
                valuekey: ['color']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '请选择按钮颜色',
                type: 'radio',
                options: [{ key: 'dark', value: '黑色' }, { key: 'light', value: '白色' }],
                valuekey: ['themeMode']
            }
        ]
    }
]