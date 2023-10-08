import React from 'react';
import { sldComLanguage } from '@/utils/utils';

const modal_pageSize_com = 10;

export function fixedZero(val) {
    return val * 1 < 10 ? `0${val}` : val;
}

export const comm_cur_page_global = { cur: 1 };//对象可以修改值

/*
* java—规格列表
* */
export function column_spec_list() {
    return [
        {
            title: ' ',
            dataIndex: 'specId',
            align: 'center',
            width: 55,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('规格名称')}`,
            align: 'center',
            dataIndex: 'specName',
            width: 150
        },
        {
            title: `${sldComLanguage('创建时间')}`,
            dataIndex: 'createTime',
            width: 150
        },
        {
            title: `${sldComLanguage('排序')}`,
            dataIndex: 'sort'
        }
    ];
}
/*
* java—VOP映射列表
* */
export function column_category_vop_list() {
    return [
        {
            title: ' ',
            dataIndex: 'categoryId',
            align: 'center',
            width: 55,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('分类ID')}`,
            align: 'center',
            dataIndex: 'categoryId',
            width: 150
        },
        {
            title: `${sldComLanguage('分类名称')}`,
            dataIndex: 'categoryFullName',
            width: 150
        }
    ];
}
/*
* java—品牌列表
* */
export function column_brand_list() {
    return [
        {
            title: ' ',
            dataIndex: 'brandId',
            align: 'center',
            width: 55,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('品牌名称')}`,
            align: 'center',
            dataIndex: 'brandName',
            width: 150
        },
        {
            title: `${sldComLanguage('创建时间')}`,
            dataIndex: 'createTime',
            width: 150
        }
    ];
}

/*
* java—检索属性列表
* */
export function column_attr_list() {
    return [
        {
            title: ' ',
            dataIndex: 'attributeId',
            align: 'center',
            width: 55,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('属性名称')}`,
            align: 'center',
            dataIndex: 'attributeName',
            width: 150
        },
        {
            title: `${sldComLanguage('创建时间')}`,
            dataIndex: 'createTime',
            width: 150
        },
        {
            title: `${sldComLanguage('排序')}`,
            dataIndex: 'sort',
            width: 100
        }
    ];
}


/*
 * 店铺——表头数据
 * */
export function column_shop_search() {
    return [
        {
            title: ' ',
            dataIndex: 'id',
            align: 'center',
            width: 30,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('店铺名称')}`,
            dataIndex: 'sellerName'
        },
        {
            title: '店铺等级',
            dataIndex: 'sellerGrade'
        }, {
            title: `${sldComLanguage('店铺创建时间')}`,
            dataIndex: 'createTime'
        }
    ];
}


/*
 * 客户收货地址列表
 * */
export function column_client_recipients() {
    return [
        {
            title: `${sldComLanguage('收货人')}`,
            dataIndex: 'name',
            width: 100
        },
        {
            title: `${sldComLanguage('手机号')}`,
            dataIndex: 'mobile',
            width: 110
        },
        {
            title: `${sldComLanguage('电话')}`,
            dataIndex: 'tel',
            width: 100
        },
        {
            title: `${sldComLanguage('地区')}`,
            dataIndex: 'area_str',
            width: 150
        },
        {
            title: `${sldComLanguage('邮编')}`,
            dataIndex: 'zip',
            width: 80
        },
        {
            title: `${sldComLanguage('详细地址')}`,
            dataIndex: 'addr',
            width: 100
        },
        {
            title: `${sldComLanguage('操作')}`,
            render: (text, record) => (record.use != 1 ? <a href='javascript:void(0)'>{sldComLanguage('使用该地址')}</a> : <span>{sldComLanguage('已选地址')}</span>)
        }
    ];
}


/*
* 会员管理——会员经验规格
* */
export const column_exp_rules = [{
    type: 'inputnum',
    label: `${sldComLanguage('会员注册')}`,
    extra: `${sldComLanguage('会员注册送经验值数量')}`,
    name: 'register',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('每日登录')}`,
    extra: `${sldComLanguage('会员每天第一次登陆送经验值数量')}`,
    name: 'login',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('订单评论')}`,
    extra: `${sldComLanguage('会员评论商品送经验值数量')}`,
    name: 'orderEvaluate',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('会员购物')}`,
    extra: `${sldComLanguage('会员购物时送经验值的比例。如设定10，则表示会员消费200元时，送经验值：200/10=20，即送20经验值')}`,
    name: 'orderBuy',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('购物送值上限')}`,
    extra: `${sldComLanguage('会员购物时送经验值的上限。如设定100，会员消费金额根据上述规则换算后需要送出105经验值，则取上限值只送出100经验值')}`,
    name: 'orderMax',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'radio_select',
    label: `${sldComLanguage('使用状态')}`,
    name: 'state',
    placeholder: `${sldComLanguage('请选择使用状态')}`,
    sel_data: [{ key: '1', value: `${sldComLanguage('开启')}` }, { key: '2', value: `${sldComLanguage('关闭')}` }]
}, {
    type: 'button',
    label: '',
    name: 'button'
}];

/*
* 系统配置——基本配置——配置管理——积分配置
* */
export const point_set_data = [{
    type: 'inputnum',
    label: `${sldComLanguage('积分换算比例')}`,
    extra: `${sldComLanguage('用户下单使用积分时换算成人民币的比例，如填100表示100个积分当做1元钱使用')}`,
    name: 'integralScale',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'button',
    label: '',
    name: 'button'
}];
/*
* 系统配置——基本配置——配置管理——索引初始化
* */
export const index_init_data = [{
    type: 'single_checkbox',
    label: `${sldComLanguage('索引初始化')}`,
    name: 'isInit',
    check_con: `${sldComLanguage('是')}`,
    initialValue: false,
    extra: `${sldComLanguage('索引初始化是清除solr里面所有的索引文件，下一次定时器从头开始执行建立索引。\n')}` +
    `${sldComLanguage('建议在必要时才使用此功能')}`
}, {
    type: 'button',
    label: '',
    name: 'button'
}];
/*
* 系统配置——基本配置——配置管理——搜索词设置
* */
export const search_word_data = [{
    type: 'input',
    label: `${sldComLanguage('关键词')}`,
    name: 'keyword',
    placeholder: `${sldComLanguage('请输入关键词')}`,
    extra: `${sldComLanguage('关键字用英文逗号（,）隔开')}`,
    rules: [{
        required: true,
        whitespace: true,
        message: `${sldComLanguage('请输入关键词')}`
    }]
}, {
    type: 'single_checkbox',
    label: `${sldComLanguage('敏感词过滤')}`,
    name: 'keywordFilter',
    check_con: `${sldComLanguage('过滤')}`,
    initialValue: false,
    extra: `${sldComLanguage('启用敏感词过滤之后，输入敏感词将搜索不到任何结果')}`
}, {
    type: 'button',
    label: '',
    name: 'button'
}];

/*
* 会员管理——会员积分规则
* */
export const column_integ_rules = [{
    type: 'inputnum',
    label: `${sldComLanguage('会员注册')}`,
    extra: `${sldComLanguage('会员注册送积分数量')}`,
    name: 'register',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('每日登陆')}`,
    extra: `${sldComLanguage('会员每天第一次登陆送积分数量')}`,
    name: 'login',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('会员签到')}`,
    extra: `${sldComLanguage('会员签到送积分数量')}`,
    name: 'sign',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('订单评论')}`,
    extra: `${sldComLanguage('会员评论商品送积分数量')}`,
    name: 'orderEvaluate',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('会员购物')}`,
    extra: `${sldComLanguage('会员购物时送积分的比例。如设定10，则表示会员消费200元时，送积分：200/10=20，即送20积分')}`,
    name: 'orderBuy',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('购物送值上限')}`,
    extra: `${sldComLanguage('会员购物时送积分的上限。如设定100，会员消费金额根据上述规则换算后需要送出105积分，则取上限值只送出100积分')}`,
    name: 'orderMax',
    placeholder: '',
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'radio_select',
    label: `${sldComLanguage('使用状态')}`,
    name: 'state',
    placeholder: `${sldComLanguage('请选择使用状态')}`,
    sel_data: [{ key: '1', value: `${sldComLanguage('开启')}` }, { key: '2', value: `${sldComLanguage('关闭')}` }]
}, {
    type: 'button',
    label: '',
    name: 'button'
}];

/*
* 会员管理——等级配置
* */
export const column_grade_config = [{
    type: 'inputnum',
    label: `${sldComLanguage('注册会员经验值')}`,
    help: '',
    name: 'grade1',
    placeholder: `${sldComLanguage('请输入注册会员经验值')}`,
    initialValue: '',
    disabled: true,
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('铜牌会员经验值')}`,
    help: '',
    name: 'grade2',
    placeholder: `${sldComLanguage('请输入铜牌会员经验值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('银牌会员经验值')}`,
    help: '',
    name: 'grade3',
    placeholder: `${sldComLanguage('请输入银牌会员经验值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('金牌会员经验值')}`,
    help: '',
    name: 'grade4',
    placeholder: `${sldComLanguage('请输入金牌会员经验值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('钻石会员经验值')}`,
    help: '',
    name: 'grade5',
    placeholder: `${sldComLanguage('请输入钻石会员经验值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'button',
    label: '',
    name: 'button'
}];

/*
* 会员管理——经验值减少配置
* */
export const column_grade_config_down = [{
    type: 'inputnum',
    label: `${sldComLanguage('注册会员年度减少值')}`,
    name: 'grade1',
    placeholder: `${sldComLanguage('请输入注册会员年度减少值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('铜牌会员年度减少值')}`,
    name: 'grade2',
    placeholder: `${sldComLanguage('请输入铜牌会员年度减少值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('银牌会员年度减少值')}`,
    name: 'grade3',
    placeholder: `${sldComLanguage('请输入银牌会员年度减少值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('金牌会员年度减少值')}`,
    name: 'grade4',
    placeholder: `${sldComLanguage('请输入金牌会员年度减少值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'inputnum',
    label: `${sldComLanguage('钻石会员年度减少值')}`,
    name: 'grade5',
    placeholder: `${sldComLanguage('请输入钻石会员年度减少值')}`,
    initialValue: '',
    rules: [{
        required: true,
        message: `${sldComLanguage('该项必填')}`
    }]
}, {
    type: 'button',
    label: '',
    name: 'button'
}];

/*
* 会员管理——充值列表
* */
export const column_balance_pay_log = [
    {
        title: ' ',
        dataIndex: 'id',
        align: 'center',
        width: 55
    },
    {
        title: `${sldComLanguage('会员账号')}`,
        dataIndex: 'memberName',
        width: 100
    },
    {
        title: `${sldComLanguage('支付方式名称')}`,
        dataIndex: 'paymentName',
        width: 100
    },
    {
        title: `${sldComLanguage('支付金额')}`,
        dataIndex: 'payMoney',
        width: 90
    },
    {
        title: `${sldComLanguage('支付状态')}`,
        dataIndex: 'payState',
        width: 80
    },
    {
        title: `${sldComLanguage('支付订单号')}`,
        dataIndex: 'paySn',
        width: 150
    },
    {
        title: `${sldComLanguage('支付交易流水号')}`,
        dataIndex: 'tradeSn',
        width: 200
    },
    {
        title: `${sldComLanguage('创建时间')}`,
        dataIndex: 'createTime',
        width: 150
    },
    {
        title: `${sldComLanguage('支付完成时间')}`,
        dataIndex: 'payFinishTime',
        width: 150
    }
];

/*
* 退货状态
* */
export const common_return_state = [
    { key: '1', name: `${sldComLanguage('未处理')}` }
    // { key: '2', name: '审核通过' },
    // { key: '3', name: '用户发货' },
    // { key: '4', name: '店铺收货' },
    // { key: '5', name: '不予处理' },
];
/*
* 换货状态
* */
export const common_exchange_state = [
    { key: '1', name: `${sldComLanguage('未处理')}` }
    // { key: '2', name: '审核通过' },
    // { key: '3', name: '用户发回退件' },
    // { key: '4', name: '商家收到退件' },
    // { key: '5', name: '商家发出换件' },
    // { key: '6', name: '原件退还' },
    // { key: '7', name: '不予处理' },
];

/*
* 换货状态
* */
export const flash_banner_search_data = [{
    type: 'select',
    label: `${sldComLanguage('使用场景')}`,
    name: 'q_pcMobile',
    placeholder: `${sldComLanguage('请选择使用场景')}`,
    sel_data: [
        { key: '1', name: 'PC' },
        { key: '2', name: 'Mobile' }
    ]
}, {
    type: 'select',
    label: `${sldComLanguage('状态')}`,
    name: 'q_state',
    placeholder: `${sldComLanguage('请选择状态')}`,
    sel_data: [
        { key: '1', name: `${sldComLanguage('启用')}` },
        { key: '0', name: `${sldComLanguage('不启用')}` }
    ]
}];

/*
* 添加/编辑装修模板提示数据
* */
export function add_tpl_tip() {
    return [
        `${sldComLanguage('点击编辑按钮，添加或编辑改模块内容，并根据弹出框体中的提示文字完成内容提交')}`,
        `${sldComLanguage('设置完成后，可点击返回模板列表按钮，回到模板列表页进行其他模板设置操作')}`,
        `${sldComLanguage('小提示：该模版编辑预览页面为实际展示页面效果，所添加编辑的内容即见即所得。')}`
    ];
}

/*
* 单条广告编辑的modal框提示
* */
export function tpl_adv_01_modal_tip() {
    return [
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];
}

/*
* PC装修四栏广告的modal框提示
* */
export function tpl_adv_06_modal_tip() {
    return [
        `${sldComLanguage('一行4张图片，宽度按照指定要求传，高度不限，建议4张图的高度一致')}`,
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];
}

/*
* PC装修三栏广告的modal框提示
* */
export function tpl_adv_07_modal_tip() {
    return [
        `${sldComLanguage('一行3张图片，宽度按照指定要求传，高度不限，建议3张图的高度一致')}`,
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];
}

/*
* PC装修五栏广告的modal框提示
* */
export function tpl_adv_08_modal_tip() {
    return [
        `${sldComLanguage('一行5张图片，宽度按照指定要求传，高度不限，建议5张图的高度一致')}`,
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];
}

/*
* pc首页开屏图的modal框提示
* */
export function pc_home_modal_tip() {
    return [
        `${sldComLanguage('“弹出广告开关” 开启后,会员访问PC端商城首页时，会弹出一个图片广告')}`,
        `${sldComLanguage('“弹出方式” 可以设置弹出广告是只弹出一次还是每次访问都会弹出。设置成“仅弹出一次”后访问首页时当天仅弹出一次。而设置成 “每次访问都弹出”后 ，每次访问首页都会弹出')}`,
        `${sldComLanguage('“广告图片” 可以设置弹出广告显示的图片')}`,
        `${sldComLanguage('“跳转链接” 可以设置点击图片的跳转地址')}`
    ];
}
/*
* pc首页开屏图的select 选择数据
* */
export function pc_home_modaladv_sele_data() {
    return [
        { label: `${sldComLanguage('只弹出一次')}`, value: 'one' },
        { label: `${sldComLanguage('每次访问都弹出')}`, value: 'more' }
    ];
}

/*
* 装修连接选择器-PC端
* */

export function diy_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        { key: 'keyword', name: `${sldComLanguage('关键字')}` },
        { key: 'goods', name: `${sldComLanguage('商品')}` },
        { key: 'category', name: `${sldComLanguage('商品分类')}` },
        { key: 'topic', name: `${sldComLanguage('专题')}` },
        { key: 'brand_home', name: `${sldComLanguage('品牌列表')}` },
        { key: 'voucher_center', name: `${sldComLanguage('领券中心')}` },
        { key: 'store_list', name: `${sldComLanguage('店铺街')}` }
    // { key: 'information_home', name: '资讯中心' },
    ];
}

//tabbar装修链接选择器
export function diy_tabbar_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无')}` },
        { key: 'topic', name: `${sldComLanguage('专题')}` }
    ];
}

/*
* 装修连接选择器-移动端
* */

export function m_diy_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        { key: 'third_url', name: `${sldComLanguage('第三方链接地址')}` },
        { key: 'applet_url', name: `${sldComLanguage('小应用链接地址')}` },
        { key: 'openBbcPage_url', name: `${sldComLanguage('非同域链接地址')}` },
        { key: 'customer-service', name: `${sldComLanguage('客服')}` },
        // { key: 'store', name: `${sldComLanguage('店铺首页')}` },
        // { key: 'keyword', name: `${sldComLanguage('关键字')}` },
        { key: 'goods', name: `${sldComLanguage('商品')}` },
        { key: 'category', name: `${sldComLanguage('商品分类')}` },
        { key: 'topic', name: `${sldComLanguage('专题')}` }
        // { key: 'brand_home', name: `${sldComLanguage('品牌列表')}` },
        // { key: 'seckill', name: `${sldComLanguage('秒杀首页')}` },
        // { key: 'spell_group', name: `${sldComLanguage('拼团首页')}` },
        // { key: 'ladder_group', name: `${sldComLanguage('阶梯团首页')}` },
        // { key: 'presale', name: `${sldComLanguage('预售首页')}` },
        // { key: 'voucher_center', name: `${sldComLanguage('领券中心')}` },
        // { key: 'point', name: `${sldComLanguage('积分商城')}` },
        // { key: 'svideo_center', name: `${sldComLanguage('短视频中心')}` },
        // { key: 'live_center', name: `${sldComLanguage('直播中心')}` },
        // { key: 'sign_center', name: `${sldComLanguage('签到中心')}` },
        // { key: 'spreader_center', name: `${sldComLanguage('推手中心')}` }
    ];
}

/*
* 装修连接选择器-移动端-图片自由组合
* */

export function image_combination_diy_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        { key: 'third_url', name: `${sldComLanguage('第三方链接地址')}` },
        { key: 'applet_url', name: `${sldComLanguage('小应用链接地址')}` },
        { key: 'openBbcPage_url', name: `${sldComLanguage('非同域链接地址')}` },
        
        { key: 'confirm_order', name: `${sldComLanguage('批量下单')}` },
        { key: 'customer-service', name: `${sldComLanguage('客服')}` },
        // { key: 'store', name: `${sldComLanguage('店铺首页')}` },
        // { key: 'keyword', name: `${sldComLanguage('关键字')}` },
        { key: 'goods', name: `${sldComLanguage('商品')}` },
        { key: 'category', name: `${sldComLanguage('商品分类')}` },
        { key: 'topic', name: `${sldComLanguage('专题')}` }
        // { key: 'brand_home', name: `${sldComLanguage('品牌列表')}` },
        // { key: 'seckill', name: `${sldComLanguage('秒杀首页')}` },
        // { key: 'spell_group', name: `${sldComLanguage('拼团首页')}` },
        // { key: 'ladder_group', name: `${sldComLanguage('阶梯团首页')}` },
        // { key: 'presale', name: `${sldComLanguage('预售首页')}` },
        // { key: 'voucher_center', name: `${sldComLanguage('领券中心')}` },
        // { key: 'point', name: `${sldComLanguage('积分商城')}` },
        // { key: 'svideo_center', name: `${sldComLanguage('短视频中心')}` },
        // { key: 'live_center', name: `${sldComLanguage('直播中心')}` },
        // { key: 'sign_center', name: `${sldComLanguage('签到中心')}` },
        // { key: 'spreader_center', name: `${sldComLanguage('推手中心')}` }
    ];
}

/*
* 装修连接选择器-开屏图
* */

export function kai_diy_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        { key: 'topic', name: `${sldComLanguage('专题')}` }
    ];
}

/*
* 装修连接选择器-移动端-积分商城
* */

export function m_diy_point_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        { key: 'keyword', name: `${sldComLanguage('关键字')}` },
        { key: 'goods', name: `${sldComLanguage('商品')}` },
        { key: 'category', name: `${sldComLanguage('积分标签')}` }
    ];
}

/*
* 装修连接选择器-移动端-推手装修
* */

export function m_diy_spreader_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        { key: 'keyword', name: `${sldComLanguage('关键字')}` },
        { key: 'goods', name: `${sldComLanguage('商品')}` },
        { key: 'category', name: `${sldComLanguage('商品标签')}` }
    ];
}


export function coupon_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` },
        // { key: 'third_url', name: `${sldComLanguage('第三方链接地址')}` },
        // { key: 'applet_url', name: `${sldComLanguage('小应用链接地址')}` },
        { key: 'openBbcPage_url', name: `${sldComLanguage('非同域链接地址')}` },
    
        { key: 'topic', name: `${sldComLanguage('专题')}` }
    ];
}

export function activity_combination_link_type() {
    return [
        { key: 'seckill', name: `${sldComLanguage('秒杀活动')}` },
        { key: 'buytogether', name: `${sldComLanguage('一起买')}` },
        { key: 'everydaybuy', name: `${sldComLanguage('天天专场')}` }
    ];
}

export function seckill_link_type() {
    return [
        { key: 'seckill', name: `${sldComLanguage('秒杀首页')}` }
    ];
}

export function buytogether_link_type() {
    return [
        { key: 'buytogether', name: `${sldComLanguage('一起买')}` }
    ];
}

export function buyeveryday_link_type() {
    return [
        { key: 'buyeveryday', name: `${sldComLanguage('天天买')}` }
    ];
}

export function signin_link_type() {
    return [
        { key: 'signin', name: `${sldComLanguage('签到活动')}` }
    ];
}

//
export function seckill_more_link_type() {
    return [
        { key: '', name: `${sldComLanguage('无操作')}` },
        { key: 'next', name: `${sldComLanguage('下一场次')}` },
        { key: 'url', name: `${sldComLanguage('链接地址')}` }
    ];
}
/*
* 商品类型列表
* */
export function type_list_column() {
    return [
        {
            title: ' ',
            align: 'center',
            dataIndex: 'typeId',
            fixed: 'left',
            width: 50,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('类型名称')}`,
            align: 'center',
            dataIndex: 'typeName',
            width: 150
        },
        {
            title: `${sldComLanguage('关联规格')}`,
            align: 'center',
            dataIndex: 'goodsSpecList',
            width: 250,
            render: (text) => {
                let spec_names = '';
                if (text.length > 0) {
                    text.forEach((item, index) => {
                        spec_names += (index == 0 ? '' : '|') + item.specName;
                    });
                }
                return spec_names;
            }
        }, {
            title: `${sldComLanguage('关联品牌')}`,
            align: 'center',
            dataIndex: 'goodsBrandList',
            width: 250,
            render: (text) => {
                let brand_names = '';
                if (text != null && text.length > 0) {
                    text.forEach((item, index) => {
                        brand_names += (index == 0 ? '' : '|') + item.brandName;
                    });
                }
                return brand_names;
            }
        },
        {
            title: `${sldComLanguage('排序')}`,
            dataIndex: 'sort'
        }


    ];
}

/*
* 生产企业列表
* */

export function enterprise_list_column() {
    return [
        {
            title: ' ',
            align: 'center',
            dataIndex: 'enterprisesId',
            fixed: 'left',
            width: 50,
            render: (text, record, index) => (comm_cur_page_global.cur - 1) * modal_pageSize_com + index + 1
        },
        {
            title: `${sldComLanguage('企业名称')}`,
            align: 'center',
            dataIndex: 'enterprisesName',
            width: 150
        }, {
            title: `${sldComLanguage('企业简称')}`,
            align: 'center',
            dataIndex: 'enterprisesAbbreviation',
            width: 150
        }, {
            title: `${sldComLanguage('企业注册地址')}`,
            align: 'center',
            dataIndex: 'enterprisesAddress',
            width: 250
        }, {
            title: `${sldComLanguage('企业曾用名')}`,
            align: 'center',
            dataIndex: 'enterpriseFormerName',
            width: 150
        },
        {
            title: `${sldComLanguage('所在地域')}`,
            dataIndex: 'locationValue'
        }
    ];
}
/*
* 不改变原数组头部添加元素
* */

export function prepend(arr, item) {
    var newarr=arr.slice(0);
    newarr.unshift(item);
    return newarr;
}

export const resize_style = { background: 'transparent', borderWidth: 0 };

/*
* 空数组
* */
export const sld_com_empty_arrar_2 = [1, 2];
export const sld_com_empty_arrar_3 = [1, 2, 3];
export const sld_com_empty_arrar_4 = [1, 2, 3, 4];
export const sld_com_empty_arrar_5 = [1, 2, 3, 4, 5];
export const sld_com_empty_arrar_6 = [1, 2, 3, 4, 5, 6];
export const sld_com_empty_arrar_7 = [1, 2, 3, 4, 5, 6, 7];
export const sld_com_empty_arrar_8 = [1, 2, 3, 4, 5, 6, 7, 8];
export const sld_com_empty_arrar_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const sld_com_empty_arrar_ImgNumber = [1];


export const sld_m_diy_tpzh_style = [{
    img: require('@/assets/img/decorate/tpzh/show_style0.png'),
    sele_style: 0
}, {
    img: require('@/assets/img/decorate/tpzh/show_style1.png'),
    sele_style: 1
}, {
    img: require('@/assets/img/decorate/tpzh/show_style2.png'),
    sele_style: 2
}, {
    img: require('@/assets/img/decorate/tpzh/show_style3.png'),
    sele_style: 3
}, {
    img: require('@/assets/img/decorate/tpzh/show_style4.png'),
    sele_style: 4
}, {
    img: require('@/assets/img/decorate/tpzh/show_style5.png'),
    sele_style: 5
}, {
    img: require('@/assets/img/decorate/tpzh/show_style6.png'),
    sele_style: 6
}, {
    img: require('@/assets/img/decorate/tpzh/show_style7.png'),
    sele_style: 7
}];

/*
* 修改配置成功后，需点击右上角更新配置按钮更新配置才可生效
* */
export function sld_need_update_setting() {
    return [`${sldComLanguage('修改配置成功后，需点击右上角更新配置按钮更新配置才可生效')}`];
}

/*
*  修改域名配置的提示
* */

export function sld_domain_manage_tip() {
    return [`${sldComLanguage('域名更改一定要确保正确，否则将影响该系统的使用')}`];
}
/*
*  订单配置-订单导出的配置的提示
* */

export function sld_order_export_tip() {
    return [`${sldComLanguage('选中的字段将在订单导出的时候导出该数据，修改配置成功后，需点击右上角更新配置按钮更新配置才可生效')}`];
}

/*
*  系统配置-基本配置-保存按钮
* */
export const sld_config_save_btn = {
    type: 'button',
    label: '',
    name: 'button'
};

export function week_day() {
    return [`${sldComLanguage('周日')}`, `${sldComLanguage('周一')}`, `${sldComLanguage('周二')}`, `${sldComLanguage('周三')}`, `${sldComLanguage('周四')}`, `${sldComLanguage('周五')}`, `${sldComLanguage('周六')}`];
}

/*
*  结算管理-结算列表操作提示
* */
export function settle_list_tip() {
    return [
        `${sldComLanguage('每个商家结算周期为一个月，每个月1号都会生成一个结算账单，平台依据结算单与商家进行结算')}`,
        `${sldComLanguage('账单计算公式：本期应结 = 系统计算总额(订单总额-现金支付总额+积分转换总额-退款/退货总额-退回积分总额)+其他金额')}`,
        `${sldComLanguage('账单处理流程为：系统自动出账>平台审核> 商家核对 > 平台核对 > 财务支付(完成结算) 5个环节')}`
    ];
}

/*
*  运营配置-平台收款账号配置提示
* */

export function sld_sys_amount_tip() {
    return [`${sldComLanguage('填写平台收款账号的信息，相关信息会出现在需要向平台汇款的页面')}`, `${sldComLanguage('修改配置成功后，需点击右上角更新配置按钮更新配置才可生效')}`];
}

//TAB切换购物车图标
export function cart_icon_data() {
    return [
        {
            icon:'gouwuche',
            width:23,
            type:1,
            padding:5
        },{
            icon:'shoppingCart',
            width:23,
            type:2,
            padding:5
        },{
            icon:'add-sy',
            width:23,
            type:3,
            padding:5
        },{
            icon:'ziyuan110',
            width:23,
            type:4,
            padding:5
        },{
            icon:'jinzhi',
            width:19,
            type:5,
            padding:7
        }
    ];
}

//TAB切换购物车展示图标
export function show_cart_icon_data() {
    return [
        {
            icon:'gouwuche',
            width:20,
            type:1
        },{
            icon:'shoppingCart',
            width:18,
            type:2
        },{
            icon:'add-sy',
            width:22,
            type:3
        },{
            icon:'ziyuan110',
            width:22,
            type:4
        }
    ];
}

//短视频空图片
export function video_defalut_img() {
    return {
        one: require('@/assets/img/decorate/video/center_empty_one.png'),
        two: require('@/assets/img/decorate/video/center_empty_two.png'),
        three: require('@/assets/img/decorate/video/center_empty_three.png'),
        four: require('@/assets/img/decorate/video/center_empty_four.png'),
        five: require('@/assets/img/decorate/video/center_empty_five.png')
    };
}

//直播空图片
export function live_defalut_img() {
    return {
        one: require('@/assets/img/decorate/live/center_empty_one.png'),
        two: require('@/assets/img/decorate/live/center_empty_two.png')
    };
}

//短视频展示风格
export const sld_m_diy_svideo_style = [{
    value: require('@/assets/img/decorate/video/show_style1.png'),
    key: 'one'
}, {
    value: require('@/assets/img/decorate/video/show_style2.png'),
    key: 'two'
}, {
    value: require('@/assets/img/decorate/video/show_style3.png'),
    key: 'three'
}, {
    value: require('@/assets/img/decorate/video/show_style4.png'),//异形轮播图
    key: 'four'
}, {
    value: require('@/assets/img/decorate/video/show_style5.png'),//
    key: 'five'
}];

//直播展示风格
export const sld_m_diy_live_style = [{
    value: require('@/assets/img/decorate/live/show_style1.png'),
    key: 'one'
}, {
    value: require('@/assets/img/decorate/live/show_style2.png'),
    key: 'two'
}];

//活动组默认图片
export function activity_default_img() {
    return {
        pin: require('@/assets/img/decorate/activity/center_pin.png'),
        discount: require('@/assets/img/decorate/activity/center_discount.png'),
        group_buy: require('@/assets/img/decorate/activity/center_group_buy.png')
    };
}

//活动组活动类型
export const sld_m_diy_activity_style = [{
    img: require('@/assets/img/decorate/activity/show_style_pin.png'),
    sele_style: 'pin',
    name:'拼团'
}, {
    img: require('@/assets/img/decorate/activity/show_style_discount.png'),
    sele_style: 'discount',
    name:'限时折扣'
}, {
    img: require('@/assets/img/decorate/activity/show_style_group_buy.png'),
    sele_style: 'group_buy',
    name:'团购'
}];

//活动图片组合
export const sld_m_diy_activity_conbination_style = [{
    value: require('@/assets/img/decorate/activity_combination/show_style1.png'),
    key: 'one'
}, {
    value: require('@/assets/img/decorate/activity_combination/show_style2.png'),
    key: 'two'
}, {
    value: require('@/assets/img/decorate/activity_combination/show_style3.png'),
    key: 'three'
}];

//公告风格
export const sld_m_diy_notice_style = [{
    value: require('@/assets/img/decorate/notice/show_style1.png'),
    left_img: require('@/assets/img/decorate/notice/left_icon_1.png'),
    key: 'one'
}, {
    value: require('@/assets/img/decorate/notice/show_style2.png'),
    left_img: require('@/assets/img/decorate/notice/left_icon_2.png'),
    key: 'two'
}];

/*
* 手机装修顶部分类导航数据
* */
export const m_diy_swiper_data = [{
    img: require('@/assets/img/decorate/top_nav_cat/swiper1.png'),
    bg_color: '#E81832'
}, {
    img: require('@/assets/img/decorate/top_nav_cat/swiper2.png'),
    bg_color: '#1C6BFC'
}, {
    img: require('@/assets/img/decorate/top_nav_cat/swiper3.png'),
    bg_color: '#11986B'
}];

//周一～周日对应的数字
export function week_to_num() {
    return [{
        label:`${sldComLanguage('周一')}`,
        value:'1'
    },{
        label:`${sldComLanguage('周二')}`,
        value:'2'
    },{
        label:`${sldComLanguage('周三')}`,
        value:'3'
    },{
        label:`${sldComLanguage('周四')}`,
        value:'4'
    },{
        label:`${sldComLanguage('周五')}`,
        value:'5'
    },{
        label:`${sldComLanguage('周六')}`,
        value:'6'
    },{
        label:`${sldComLanguage('周日')}`,
        value:'7'
    }];
}

//1～31号对应的数字
export function month_to_num() {
    return [{
        label:'1',value:'1' },{
        label:'2',value:'2' },{
        label:'3',value:'3'},{
        label:'4',value:'4' },{
        label:'5',value:'5' },{
        label:'6',value:'6' },{
        label:'7',value:'7' },{
        label:'8',value:'8' },{
        label:'9',value:'9' },{
        label:'10',value:'10' },{
        label:'11',value:'11' },{
        label:'12',value:'12' },{
        label:'13',value:'13' },{
        label:'14',value:'14' },{
        label:'15',value:'15' },{
        label:'16',value:'16' },{
        label:'17',value:'17' },{
        label:'18',value:'18' },{
        label:'19',value:'19' },{
        label:'20',value:'20' },{
        label:'21',value:'21' },{
        label:'22',value:'22' },{
        label:'23',value:'23' },{
        label:'24',value:'24' },{
        label:'25',value:'25' },{
        label:'26',value:'26' },{
        label:'27',value:'27' },{
        label:'28',value:'28' },{
        label:'29',value:'29' },{
        label:'30',value:'30' },{
        label:'31',value:'31' }];
}

//数字转为对应的汉字
export function num_to_num() {
    return {
        1:`${sldComLanguage('一')}`,
        2:`${sldComLanguage('二')}`,
        3:`${sldComLanguage('三')}`,
        4:`${sldComLanguage('四')}`,
        5:`${sldComLanguage('五')}`
    };
}

//结算账户——银行账户
export function settle_account_bank() {
    return [{
        label:`${sldComLanguage('银行开户名')}`,
        code:'bankAccountName'
    },{
        label:`${sldComLanguage('公司银行账号')}`,
        code:'bankAccountNumber'
    },{
        label:`${sldComLanguage('开户银行')}`,
        code:'bankBranch'
    },{
        label:`${sldComLanguage('开户行所在地')}`,
        code:'addressAll'
    }];
}

//结算账户——支付宝账户
export function settle_account_alipay() {
    return [{
        label:`${sldComLanguage('支付宝账号')}`,
        code:'alipayAccount'
    },{
        label:`${sldComLanguage('支付宝姓名')}`,
        code:'alipayName'
    }];
}

//TAB切换购物车展示图标

export function day_hour() {
    return ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];
}
//多语言匹配—— key为前端对应的语言类型，val为接口需要的语言类型
export function language_type() {
    return [{
        key:'zh-CN',
        val:'zh'
    },{
        key:'en-US',
        val:'en'
    }];
}

/*
* 积分抵扣配置页面操作提示
* */
export function sld_promotion_point_setting() {
    return [`${sldComLanguage('开启积分抵现后，买家下单时可以使用积分抵扣部分现金')}`,`${sldComLanguage('抵扣的现金结算时平台会支付给商家')}`];
}

/*
* 订单来源
*/
export const enumOrderSource = { 
    'NORMAL':'正常订单',
    'VOUCHER':'抽奖活动',
    'FEATHERGIVER':'鹅毛情送',
    'FEATHERRECEIVER':'鹅毛情收'
};
/*
* 订单来源图标
*/
export const orderSourceIcon = {
    'NORMAL': require('@/assets/img/mall/order/common_order_icon.png'), 
    'VOUCHER': require('@/assets/img/mall/order/deposit_presale_order_icon.png'), 
    'FEATHERGIVER': require('@/assets/img/mall/order/emq2.png'),
    'FEATHERRECEIVER': require('@/assets/img/mall/order/emq1.png')
};
/*
* 订单类型
*/
export const enumOrderType = { 
    '1':'普通',
    '102':'拼团',
    'PreSale':'定金预售', //103 && isAllPay==0  定金预售
    'FullPreSale':'全款预售', //103 && isAllPay==1  全款预售
    '104':'秒杀',
    '105':'阶梯团',
    '106':'一起买',
    '107':'天天专场'
};
/*
* 订单图标
*/
export const orderTypeIcon = {
    '1': require('@/assets/img/mall/order/common_order_type.png'), // 普通
    '102': require('@/assets/img/mall/order/spell_group_order_icon.png'), //拼团
    'PreSale': require('@/assets/img/mall/order/deposit_presale_order_icon.png'), //103 && isAllPay==0  定金预售
    'FullPreSale': require('@/assets/img/mall/order/full_presale_order_icon.png'),//103 && isAllPay==1  全款预售
    '104': require('@/assets/img/mall/order/seckill_order_icon.png'), //秒杀
    '105': require('@/assets/img/mall/order/ladder_grooup_order_icon.png'), //阶梯团
    '106': require('@/assets/img/mall/order/ladder_grooup_order_icon.png'), //一起买
    '107': require('@/assets/img/mall/order/full_presale_order_icon.png') //天天专场
};

/**
 * 获取订单文字和图标
 * @param {Object} orderType
 * @param {Object} isAllPay
 */
export const famatterOrderType = (orderType,isAllPay)=>{
    if(orderType=='103'){
        orderType = isAllPay==1?'FullPreSale':'PreSale'
    }
    return {
        text:enumOrderType[orderType]||'',
        icon:orderTypeIcon[orderType]||''
    }
};

/**
 * 订单来源
 * @param {Object} orderSource
 */
export const famatterOrderSource = (orderSource,orderFeatherInfo)=>{
    if(orderSource=='FEATHER' && orderFeatherInfo){
        // giverOrReceiver 0送礼人  1收礼人
        orderSource = orderFeatherInfo.giverOrReceiver===0?'FEATHERGIVER':'FEATHERRECEIVER'
    }
    return {
        text:enumOrderSource[orderSource]||'',
        icon:orderSourceIcon[orderSource]||''
    }
}

/*
* 特价活动
*/
export const promotionTypeEumn = { 
    '104':'秒杀',
    '105':'阶梯团',
    '106':'一起买',
    '107':'天天专场'
};


/*
* 一起买页面操作提示
* */
export function sld_promotion_together_buy() {
    return [
        `${sldComLanguage('1、一起买是一种由平台发起的团购活动，商户提供参与活动的商品，用户以团购价购买活动商品；')}`,
        `${sldComLanguage('2、每款商品在每个活动场次中有且仅有 1 个团购，场次开始时用户可以随时购买商品加入团购，或取消订单退出团购，待场次结束时根据最终团购件数是否达到实际成团件数判断团购成功或失败，成功则发货，失败则原路退回实付款项；')}`,
        `${sldComLanguage('3、每款商品可以同时参加多个一起买活动，但相同活动日期内只能参加其中一个活动场次，且该活动日期内其不可再参与其他活动（如秒杀活动）；')}`,
        `${sldComLanguage('4、用户购买一起买商品的待付款订单，订单生成后30分钟内未完成支付的由系统自动取消该订单。')}`];
}

/*
* 导入权限页面操作提示
* */
export function sld_systemset_authority_import() {
    return [
        `${sldComLanguage('1.下载平台端Excel权限码文档，按照格式要求填写数据。')}`,
        `${sldComLanguage('2.上传已填好的Excel文件。请注意本操作是全量上传，操作人需保证不要遗漏。')}`,
        `${sldComLanguage('3.上传成功后，请重新登录平台端。')}`
    ];
}

/*
* 导入权限页面操作提示
* */
export function sld_systemset_authority_import2() {
    return [
        `${sldComLanguage('1.下载商户端Excel权限码文档，按照格式要求填写数据。')}`,
        `${sldComLanguage('2.上传已填好的Excel文件。请注意本操作是全量上传，操作人保证不要遗漏。')}`,
        `${sldComLanguage('3.上传成功后，需要重新登录商户端。')}`
    ];
}