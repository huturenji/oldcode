import { guid } from '@/utils/utils';
import { sld_m_diy_svideo_style } from '@/utils/util_data';

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
        name: 'sn-radio',
        label: '展示风格',
        type: 'img',
        options: sld_m_diy_svideo_style,
        style: {
            width: '140px'
        },
        valuekey: ['props.show_style']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '短视频卡片边角',
        type: 'radio',
        options: [{ key: 8, value: '圆角' }, { key: 0, value: '直角' }],
        valuekey: ['props.border_radius'],
        style: {
            margin: '10px 0'
        }
    },
    {
        guid: guid(),
        name: 'sn-text',
        type: 'input',
        max: 10,
        label: "设置标题",
        style: {
            'width': '300px'
        },
        valuekey: ['data.0.title']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '添加短视频',
        style: {
            margin: '10px 0'
        }
    },
    {
        guid: guid(),
        name: 'sn-goods-picker',
        type: 'video',
        valuekey: ['data.0.data'],
        style: {
            width: '360px'
        }
    }
]