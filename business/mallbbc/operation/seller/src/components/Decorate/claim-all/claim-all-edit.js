import { guid } from '@/utils/utils';
import { m_diy_link_type } from '@/utils/util_data';

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
    // {
    //     guid: guid(),
    //     name: 'sn-radio',
    //     label: '是否显示一键领取按钮',
    //     type: 'radio',
    //     options: [{ key: true, value: '是' }, { key: false, value: '否' }],
    //     valuekey: ['props.btnInfo.show'],
    //     children: {
    //         true: [
    //             {
    //                 guid: guid(),
    //                 name: 'sn-title',
    //                 label:'一键领取未领取完图片'
    //             },
    //             {
    //                 guid: guid(),
    //                 name: 'sn-upload',
    //                 valuekey: ['props.btnInfo.beforeReceiveimg']
    //             },
    //             {
    //                 guid: guid(),
    //                 name: 'sn-title',
    //                 label:'一键领取领取完后图片'
    //             },
    //             {
    //                 guid: guid(),
    //                 name: 'sn-upload',
    //                 valuekey: ['props.btnInfo.afterReceiveimg']
    //             },
    //             {
    //                 guid: guid(),
    //                 name: 'sn-title',
    //                 label:'一键领取跳转地址'
    //             },
    //             {
    //                 guid: guid(),
    //                 name: 'sn-url-picker',
    //                 options: m_diy_link_type(),
    //                 valuekey: ['props.btnInfo']
    //             }
    //         ]
    //     }
    // },
    // {
    //     guid: guid(),
    //     name: 'sn-union',
    //     label: '添加图片行数',
    //     valuekey: ['data'],
    //     style: {
    //         'width': '500px',
    //         'backgroundColor': '#eceaea',
    //         'padding': '10px'
    //     },
    //     defaultvalue: {
    //         info:[{
    //             img:'',
    //             activeImg:'',
    //             info: [], // 优惠券数据
    //             couponIdArr: [] // 优惠券编号数组
    //         }]
    //     },
    //     children: [
            
            
    //     ]
    // }
    {
        guid: guid(),
        name: 'sn-union',
        label: '添加图片列数',
        valuekey: ['data'],
        style: {
            'width': '400px',
            'backgroundColor': '#eee',
            'padding': '10px'
        },
        defaultvalue: {
            img:'',
            activeImg:'',
            info: [], // 优惠券数据
            couponIdArr: [], // 优惠券编号数组
            urlInfo:{
                url:'',
                url_type:''
            }
        },
        children: [
            {
                guid: guid(),
                name: 'sn-title',
                label:'优惠券未领取图片'
            },
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['img']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label:'优惠券领取后图片'
            },
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['activeImg']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label:'领取完后跳转地址'
            },
            {
                guid: guid(),
                name: 'sn-url-picker',
                options: m_diy_link_type(),
                valuekey: ['urlInfo']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label:'点击图片领取的优惠券来源'
            },
            {
                guid: guid(),
                name: 'sn-coupon-picker',
                valuekey: ['']
            }
        ]
    }
]