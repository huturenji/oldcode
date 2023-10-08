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
        label: '添加左侧分类',
        max: 10,
        valuekey: ['data'],
        style: {
            'width': '450px',
            'backgroundColor': '#f8f8f8',
            'padding': '10px'
        },
        defaultvalue: {
            range_set: 'single', //'single'-当前专题，'all'-所有装修页
            uploadImg: {
                img: '',
                info: {},
                url_type: ''
            },
            allowClose: true,
            position: 'right',
            showStyle: 0
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
                valuekey: ['uploadImg.img']
            },
            {
                guid: guid(),
                name: 'sn-url-picker',
                options: m_diy_link_type(),
                valuekey: ['uploadImg']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '是否支持用户单次关闭',
                type: 'radio',
                options: [{ key: true, value: '是' }, { key: false, value: '否' }],
                valuekey: ['allowClose']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '浮窗位置',
                type: 'radio',
                options: [{ key: "left", value: '左侧边栏' }, { key: "right", value: '右侧边栏' }],
                valuekey: ['position']
            },
            {
                guid: guid(),
                name: 'sn-radio',
                label: '页面滑动小浮窗展示效果',
                type: 'radio',
                options: [{ key:0, value: '隐藏' }, { key:1, value: '无效果' }, { key:2, value: '向内侧旋转折叠收缩' }, { key:3, value: '向内侧折叠收缩' }],
                valuekey: ['showStyle']
            }
        ]
    }
]