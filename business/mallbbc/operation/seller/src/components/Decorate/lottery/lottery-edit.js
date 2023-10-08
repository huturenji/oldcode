import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-title',
        label: '抽奖活动内容'
    },
    {
        guid: guid(),
        name: 'sn-union',
        min: 1,
        max: 1,
        valuekey: ['props.background'],
        style: {
            'width': '240px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            img: '',
            backgroundColor: ''
        },
        children: [
            {
                guid: guid(),
                label: '请输入背景色或者图片',
                name: 'sn-upload',
                valuekey: ['img']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                placeholder: '请输入背景色',
                style: {
                    'width': '200px',
                    'marginBottom': '10px',
                    'display': 'block'
                },
                valuekey: ['backgroundColor']
            }
        ]
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '抽奖内容',
        style: {
            'marginTop': '10px'
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加中奖类型',
        max: 5,
        valuekey: ['data'],
        style: {
            'width': '400px',
            'padding': '10px',
            'backgroundColor': '#f8f8f8'
        },
        defaultvalue: {
            couponName:'', // 抽奖的文字
            couponId:'', // 抽奖优惠券的id
            probability:'' //中奖概率
        },
        children: [
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '奖品名称',
                placeholder: '请输入奖品名称',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['couponName']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '奖品ID（优惠券ID）',
                placeholder: '请输入优惠券Id',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['couponId']
            },
            {
                guid: guid(),
                name: 'sn-text',
                type: 'input',
                label: '中奖概率',
                placeholder: '请输入中奖概率',
                style: {
                    'width': '300px',
                    'marginBottom': '10px'
                },
                valuekey: ['probability']
            }
        ]
    }
]