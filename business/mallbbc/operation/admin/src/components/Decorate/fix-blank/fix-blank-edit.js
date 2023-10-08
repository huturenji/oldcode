import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-color-picker',
        label: "颜色",
        valuekey: ['props.color']
    },
    {
        name: 'sn-text',
        guid: guid(),
        label: "空白高度(可输入statusHeight，titleHeight或者数字)",
        type:'input',
        style:{
            'width':'120px'
        },
        valuekey: ['props.text']
    }
]