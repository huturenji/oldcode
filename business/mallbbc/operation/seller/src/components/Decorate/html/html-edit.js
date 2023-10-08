import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-text',
        type: 'textarea',
        label: "网页片段内容",
        style: {
            width: '300px'
        },
        valuekey: ['data.0']
    }
]