import { guid } from '@/utils/utils';
import { sld_m_diy_live_style } from '@/utils/util_data';

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
        label: "展示风格",
        type: 'img',
        options: sld_m_diy_live_style,
        style: {
            width: '120px'
        },
        valuekey: ['props.show_style']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '直播卡片边角',
        type: 'radio',
        options: [{ key: 8, value: '圆角' }, { key: 0, value: '直角' }],
        valuekey: ['props.border_radius']
    },
    {
        guid: guid(),
        label: "设置标题",
        name: 'sn-text',
        type: 'input',
        max: 10,
        placeholder: '请输入标题，最多10个字',
        style: {
            'width': '300px'
        },
        valuekey: ['data.0.title']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '添加直播'
    },
    {
        guid: guid(),
        name: 'sn-goods-picker',
        type: 'live',
        valuekey: ['data.0.data']
    }
]