import { guid } from '@/utils/utils';
import { image_combination_diy_link_type } from '@/utils/util_data';

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
        label: "是否固定在顶部",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.fixed']
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加图片',
        max: 9,
        valuekey: ['data'],
        style: {
            'width': '400px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            img: '', // 图片绝对地址
            imgActivity:'',
            url: '', // 链接值
            url_type: '', // 链接类型
            info: '', // 用于存放额外信息
            goodsInfo:[]
        },
        children: [
            {
                guid: guid(),
                name: 'sn-upload',
                label: '滑动前图片',
                valuekey: ['img']
            },
            {
                guid: guid(),
                name: 'sn-upload',
                label: '滑动后图片(未上传则取滑动前的图片)',
                valuekey: ['imgActivity']
            },
            {
                guid: guid(),
                name: 'sn-url-picker',
                options: image_combination_diy_link_type(),
                valuekey: ['']
            }
        ]
    }
]