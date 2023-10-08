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
        name: 'sn-union',
        min: 1,
        max: 1,
        valuekey: ['data'],
        style: {
            'width': '450px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        children: [
            {
                guid: guid(),
                name: 'sn-title',
                label: '图片设置:',
                style: {
                    'fontWeight': 'bold'
                }
            },
            {
                guid: guid(),
                name: 'sn-upload',
                valuekey: ['bgImg.img']
            },
            {
                guid: guid(),
                name: 'sn-url-picker',
                options: m_diy_link_type(),
                valuekey: ['bgImg']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '倒计时设置',
                type: 'radio',
                options: [{ key: 0, value: '精确至天' }, { key: 1, value: '精确至时分秒' }],
                valuekey: ['countSet'],
                children: {
                    0: [
                        {
                            guid: guid(),
                            name: 'sn-time-picker',
                            label: '指定日期',
                            format: "YYYY-MM-DD",
                            valuekey: ['countTime']
                        }
                    ],
                    1: [
                        {
                            guid: guid(),
                            name: 'sn-time-picker',
                            label: '指定时点',
                            format: "YYYY-MM-DD HH:mm:ss",
                            valuekey: ['countTime']
                        }
                    ]
                }
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '位置坐标:',
                style: {
                    'fontWeight': 'bold'
                }
            },
            {
                guid: guid(),
                name: 'sn-slide',
                label: 'X：',
                type: 'union',
                max: 100,
                style: {
                    'display': 'flex'
                },
                valuekey: ['positionStyle.positionX']
            },
            {
                guid: guid(),
                name: 'sn-slide',
                label: 'Y：',
                type: 'union',
                max: 100,
                style: {
                    'display': 'flex'
                },
                valuekey: ['positionStyle.positionY']
            },
            {
                guid: guid(),
                name: 'sn-color-picker',
                label: '字体颜色',
                valuekey: ['fontStyle.color']
            },
            {
                guid: guid(),
                name: 'sn-title',
                label: '字体大小:',
                style: {
                    'fontWeight': 'bold'
                }
            },
            {
                guid: guid(),
                name: 'sn-slide',
                type: 'union',
                max: 100,
                style: {
                    'display': 'flex'
                },
                valuekey: ['fontStyle.size']
            }
        ]
    }
]