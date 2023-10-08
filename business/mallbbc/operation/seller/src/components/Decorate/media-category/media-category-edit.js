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
        label: "点击更多跳转",
        placeholder: '请输入点击更多跳转链接',
        style: {
            width: '300px'
        },
        valuekey: ['props.more_news']
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加导航',
        valuekey: ['data'],
        style: {
            'width': '400px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            tabName: '', // 标题
            categoryId:'' // 标题id
        },
        children: [
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '父标题:',
                max: 16,
                placeholder: "请输入父标题，最多16个字",
                style: {
                    width: '360px'
                },
                valuekey: ['tabName']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '标题id:',
                max: 16,
                placeholder: "请输入标题id，最多16个字",
                style: {
                    width: '360px'
                },
                valuekey: ['categoryId']
            }
        ]
    }
]