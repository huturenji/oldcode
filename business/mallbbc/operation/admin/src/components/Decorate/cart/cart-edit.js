import { guid } from '@/utils/utils';

export default [
    {
        guid: guid(),
        name: 'sn-radio',
        label: "是否展示首页购物车",
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.showCart']
    },
    {
        guid: guid(),
        name: 'sn-upload',
        label: '购物车图标',
        valuekey: ['props.img']
    }
]