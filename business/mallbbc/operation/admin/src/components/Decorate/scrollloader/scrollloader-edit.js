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
        name: 'sn-upload',
        label: '开始抽奖按钮图片',
        valuekey: ['props.btnImg']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '选择商品(最多选择30个商品, 商品图片建议尺寸220*102)'
    },
    {
        guid: guid(),
        name: 'sn-goods-picker',
        max: 30,
        type: 'goods',
        valuekey: ['data.0'],
        style: {
            width: '360px'
        }
    }
]