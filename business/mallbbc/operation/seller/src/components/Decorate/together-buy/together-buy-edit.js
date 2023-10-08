import { guid } from '@/utils/utils';
import { buytogether_link_type } from '@/utils/util_data';

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
        name: 'sn-text',
        label: '截取数据条数 （进行中场次从第几条数据开始展示，建议和轮播一起买数据配合使用，只对第一个分类生效）',
        type: 'inputNumber',
        max: 10,
        min: 0,
        valuekey: ['props.sliceGoodsNum'],
        style: {
            width: '200px'
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加一起买分类',
        max: 5,
        valuekey: ['data'],
        style: {
            'width': '400px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            categoryText:'', // 分类内容
            url: '', // 链接值
            url_type: '', //链接类型
            activityData: 0, //活动日期
            show_style: 't_row',
            showBuyNum: false, // 已拼件数
            showSuccessNum: true // 成团件数
        },
        children: [
            {
                guid: guid(),
                name: 'sn-text',
                label: '分类标题:',
                type: 'input',
                max: 15,
                placeholder: '请输入分类标题，最多15个字',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['categoryText']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '数据来源'
            },
            {
                guid: guid(),
                name: 'sn-url-picker',
                options: buytogether_link_type(),
                valuekey: ['']
            },
            {
                guid: guid(),
                name: 'sn-text',
                label: '活动日期 T+ (T代表今日)',
                type: 'inputNumber',
                max: 10,
                min: 0,
                step: 1,
                valuekey: ['activityData'],
                style: {
                    width: '200px'
                }
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '商品展示样式',
                type: 'radio',
                options: [{ key: 't_big', value: '大图' }, { key: 't_small', value: '一行两图' }, { key: 't_row', value: '横排' }],
                valuekey: ['show_style']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否展示已拼件数',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showBuyNum']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否展示成团件数',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['showSuccessNum']
            }
        ]
    }
]