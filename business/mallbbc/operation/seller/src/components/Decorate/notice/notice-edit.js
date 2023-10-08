import { guid } from '@/utils/utils';
import { m_diy_link_type, sld_m_diy_notice_style } from '@/utils/util_data';

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
        options: sld_m_diy_notice_style,
        style: {
            width: '300px'
        },
        valuekey: ['props.show_style']
    },
    {
        guid: guid(),
        label: "公告内容",
        name: 'sn-text',
        type: 'input',
        max: 200,
        placeholder: '请输入公告内容,最多200字',
        style: {
            'width': '300px'
        },
        valuekey: ['data.0.text']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '公告链接'
    },
    {
        guid: guid(),
        name: 'sn-url-picker',
        options: m_diy_link_type(),
        valuekey: ['data.0']
    }
]