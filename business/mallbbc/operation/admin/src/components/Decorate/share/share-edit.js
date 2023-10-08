import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-radio',
        label: '当前页面分享类型',
        type: 'radio',
        options: [{ key: true, value: '链接' }, { key: false, value: '图片' }],
        valuekey: ['props.shareLink'],
        style: {
            'marginBottom': '10px'
        },
        children: {
            false: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    label: '分享的图片（目前只对小程序有效）',
                    valuekey: ['props.shareImg']
                }
            ]
        }
    }
]