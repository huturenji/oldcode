import { guid } from '@/utils/utils';
import { signin_link_type } from '@/utils/util_data';

export default [
    {
        guid: guid(),
        name: 'sn-title',
        label: '签到背景设置：',
        style: {
            'fontWeight': 'bold'
        }
    },
    {
        guid: guid(),
        name: 'sn-upload',
        label: '请上传活动背景：',
        valuekey: ['props.signInBgImg']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '请选择签到活动：',
        style: {
            'fontWeight': 'bold',
            'borderTop': '1px solid #ccc'
        }
    },
    {
        guid: guid(),
        name: 'sn-url-picker',
        options: signin_link_type(),
        valuekey: ['data.0']
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '签到按钮设置：',
        style: {
            'fontWeight': 'bold',
            'borderTop': '1px solid #ccc',
            'marginTop': '15px'
        }
    },
    {
        guid: guid(),
        name: 'sn-upload',
        label: '请上传未签到按钮图片：',
        valuekey: ['props.signInImg']
    },
    {
        guid: guid(),
        name: 'sn-upload',
        label: '请上传已签到按钮图片：',
        valuekey: ['props.signInDoneImg']
    },
    {
        guid: guid(),
        name: 'sn-text',
        label: '图片宽度：',
        type: 'inputNumber',
        min: 0,
        max: 375,
        valuekey: ['props.signImgWidth']
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否设置按钮坐标（不设置默认左右居中）：',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.isShowSignInXY'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '签到按钮位置坐标:',
                    style: {
                        'fontWeight': 'bold'
                    }
                },
                {
                    guid: guid(),
                    name: 'sn-slide',
                    label: 'X：',
                    type: 'union',
                    min: -100,
                    max: 100,
                    style: {
                        'display': 'flex'
                    },
                    valuekey: ['props.signInXY.0']
                },
                {
                    guid: guid(),
                    name: 'sn-slide',
                    label: 'Y：',
                    type: 'union',
                    min: -100,
                    max: 100,
                    style: {
                        'display': 'flex'
                    },
                    valuekey: ['props.signInXY.1']
                }
            ]
        }
    },
    {
        guid: guid(),
        name: 'sn-title',
        label: '已签到天数设置：',
        style: {
            'fontWeight': 'bold',
            'borderTop': '1px solid #ccc',
            'marginTop': '10px'
        }
    },
    {
        guid: guid(),
        name: 'sn-radio',
        label: '是否显示已签到天数：',
        type: 'radio',
        options: [{ key: true, value: '是' }, { key: false, value: '否' }],
        valuekey: ['props.isShowCount'],
        children: {
            true: [
                {
                    guid: guid(),
                    name: 'sn-text',
                    label: '字体大小：',
                    type: 'inputNumber',
                    min: 12,
                    max: 200,
                    valuekey: ['props.countFontSize']
                },
                {
                    guid: guid(),
                    name: 'sn-color-picker',
                    label: '字体颜色：',
                    defaultvalue: '#000',
                    valuekey: ['props.countColor']
                },
                {
                    guid: guid(),
                    name: 'sn-radio',
                    label: '累计签到天数是否加粗：',
                    type: 'radio',
                    options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                    valuekey: ['props.isCountBold']
                },
                {
                    guid: guid(),
                    name: 'sn-title',
                    label: '天数位置坐标:',
                    style: {
                        'fontWeight': 'bold'
                    }
                },
                {
                    guid: guid(),
                    name: 'sn-slide',
                    label: 'X：',
                    type: 'union',
                    min: -100,
                    max: 100,
                    style: {
                        'display': 'flex'
                    },
                    valuekey: ['props.countXY.0']
                },
                {
                    guid: guid(),
                    name: 'sn-slide',
                    label: 'Y：',
                    type: 'union',
                    min: -100,
                    max: 100,
                    style: {
                        'display': 'flex'
                    },
                    valuekey: ['props.countXY.1']
                }
            ]
        }
    }
]