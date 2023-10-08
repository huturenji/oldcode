import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-color-picker',
        label: "颜色",
        valuekey: ['props.color']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: "样式",
        type: 'radio',
        options: [{ key: "solid", value: '实线' }, { key: "dashed", value: '虚线' }, { key: "dotted", value: '点线' }],
        valuekey: ['props.val']
    }
]