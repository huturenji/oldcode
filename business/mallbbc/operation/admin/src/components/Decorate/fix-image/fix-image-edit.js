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
        name: 'sn-union',
        label: '添加图片文字',
        max: 2,
        valuekey: ['data'],
        style: {
            'width': '360px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            img : '', // 图片绝对地址
            img_path : '', // 图片相对地址
            checkHeight :"titleBar", // solgin高度
            inputHeight :'30',
            containerHeight :"titleBar", // 组件真实高度
            opacity :'100', // 透明度
            background :'white', // 背景色
            title : '', // 文字
            fixed :false,
            direction :'row', // 文字和图片的对齐方向
            align :'left', // 文字和图片的对齐方向
            url : '', // 链接值
            url_type : '', // 链接类型
            width : '100%',
            height : '100%'
        },
        children: [
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['img']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '请输入图片高度，可输入titleBar（即title的高度）或者数字',
                placeholder: '请输入图片高度',
                valuekey: ['containerHeight']
            },
            {
                name: 'sn-text',
                type: 'input',
                label: '请输入背景色',
                placeholder: '请输入背景色',
                style: {
                    'width': '300px',
                    'marginBottom': '10px',
                    'display': 'block'
                },
                valuekey: ['background']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '请输入透明度（0-100）',
                placeholder: '请输入透明度（0-100）',
                style: {
                    'width': '300px',
                    'marginBottom': '10px',
                    'display': 'block'
                },
                valuekey: ['opacity']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: "是否固定在顶部",
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['fixed']
            }
        ]
    }
]
