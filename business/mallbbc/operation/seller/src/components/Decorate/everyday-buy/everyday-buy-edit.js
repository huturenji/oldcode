import { m_diy_link_type } from '@/utils/util_data';
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
        name: 'sn-radio',
        label: "是否隐藏不可售商品",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.filterNosaleGoods']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '商品展示样式',
        type: 'radio',
        options: [{ key: 'd_small', value: '一行两个' }, { key: "d_row", value: '横排' }, { key: "d_smallRow", value: '两图+横排' }, { key: "d_big", value: '大图' }],
        valuekey: ['props.show_style']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '内容标题设置'
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '主标题（设置图片后，仍以天天专场标题图优先，没有标题图时显示设置图片）',
        style: {
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '',
        type: 'radio',
        options: [{ key: 'none', value: '无' }, { key: 'imgOrtext', value: '图文' }],
        valuekey: ['data.0.mainTitle.titleStyle'],
        children: {
            imgOrtext: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.mainTitle.img']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '请输入主标题',
                    style: {
                        'width': '200px',
                        'marginLeft': '10px'
                    },
                    valuekey: ['data.0.mainTitle.title']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '副标题',
        type: 'radio',
        options: [{ key: 'none', value: '无' }, { key: 'imgOrtext', value: '图文' }],
        valuekey: ['data.0.subTitle.titleStyle'],
        style: {
            'borderTop': '1px solid #ccc'
        },
        children: {
            imgOrtext: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['data.0.subTitle.img']
                },
                {
                    guid: guid(),
                    name: 'sn-text',
                    type: 'input',
                    placeholder: '请输入副标题',
                    style: {
                        'width': '200px',
                        'marginBottom': '10px',
                        'display': 'block'
                    },
                    valuekey: ['data.0.subTitle.title']
                },
                {
                    guid: guid(),
                    name: 'sn-url-picker',
                    options: m_diy_link_type(),
                    valuekey: ['data.0.subTitle']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-upload',
        label: '顶部背景',
        valuekey: ['data.0.topBackgroundImg']
    }
]