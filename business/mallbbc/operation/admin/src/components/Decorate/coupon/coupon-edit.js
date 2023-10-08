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
        label: '是否显示分类导航背景图',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.tabBackImage.ifShowTabBackImage'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['props.tabBackImage.imgInfo.img']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '列表滚动分类导航栏是否置顶',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.tabBackImage.ifScrollTop'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['props.tabBackImage.scrollTopImgInfo.img']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否显示优惠券列表顶部区域',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.couponBackTopImage.ifShowCouponBackTopImage'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['props.couponBackTopImage.imgInfo.img']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否显示优惠券底部区域',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.couponBottomImage.ifShowCouponBottomImage'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-upload',
                    valuekey: ['props.couponBottomImage.imgInfo.img']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否显示优惠券列表背景图',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.couponBackImage.ifShowCouponBackImage'],
        children: {
            true: [
                {
                    name: 'sn-upload',
                    valuekey: ['props.couponBackImage.imgInfo.img']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加分类导航',
        valuekey: ['data'],
        style: {
            'width': '500px',
            'backgroundColor': '#eceaea',
            'padding': '10px'
        },
        defaultvalue: {
            title: '默认', // 分类标题
            info: [], // 优惠券数据
            couponIdArr: [] // 优惠券编号数组
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
                valuekey: ['title']
            },
            {
                guid: guid(),
                name: 'sn-coupon-picker',
                type:'single',
                valuekey: ['']
            }
        ]
    }
]