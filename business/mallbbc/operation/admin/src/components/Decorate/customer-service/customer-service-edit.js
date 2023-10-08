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
        label: '客服文本',
        max: 10,
        placeholder: '输入客服文本，最多10个字',
        style: {
            'width': '300px',
            'marginBottom': '10px'
        },
        valuekey: ['props.text']
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        label: '客服电话',
        max: 13,
        placeholder: '输入客服电话',
        style: {
            'width': '300px',
            'marginBottom': '10px'
        },
        valuekey: ['props.tel']
    }
]