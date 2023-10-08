/* 商云首页配置
 * @Descripttion: 
 * @version: 
 * @Author: xiaowe
 * @Date: 2020-5-12
 * @LastEditors: xiaowe
 * @LastEditTime: 2020-5-12
 */

/**
 * 授权类型
 * 'bp'：商旅授权类型
 * 'mall'：商城授权类型
 * 'third'：第三方授权类型
 */
export const authTypeMap = {
    'bp':{needAuth:true,needGetEnvHost:true,list:['TGC','ProdId','cpyId','uaId','appId','terType'],addPagefrom:true},
    'mall':{needAuth:false,needGetEnvHost:true,list:['supplierId'],addPagefrom:true},
    'suning':{needAuth:false,needGetEnvHost:true,list:['supplierId'],addPagefrom:true},
    'xiyu':{needAuth:false,needGetEnvHost:true,list:['supplierId'],addPagefrom:true},
    'third':{needAuth:false,needGetEnvHost:false},
    'bankofchangsha':{needAuth:false,needGetEnvHost:true},
    'bbc':{needAuth:false,needGetEnvHost:true},
}

//小应用id配置
export const appIdMap = {
    'express':268435602,//快递服务
    'flight':268435546,//机票
    'hotel':268435548,//酒店
    'train':268435547,//火车票
    'order':268435549,//订单
    'invoice':536871341,//发票助手
    'trip':268435545,//行程助手
    'personal':268435550,//我的商旅
    'car':268435612,//商务用车
    'content':268435720,//资讯
    'jdshop':268435679,//京东企业购
    'snshop':268435735,//苏宁易购
    'businesscloud':268435729,//商云
    'enterprise':268435730,//企业订单管理
    'checkinvoice':268435585,//发票核验
    'accountant':268435749,//棒会计
    'bankofchangsha':268435801,//弗兰社
}

//配置多环境商旅通和商城的域名
export const bpAppConfig = {
    'bp':{
        Dev:{url:'https://bplusdev.sinosun.com:18180'},
        BlackBox:{url:'https://bplussit.sinosun.com:18380'},
        Sandbox:{url:'https://bplus-uat.sinosun.com'},
        Production:{url:'https://cloud.sinosun.com'}, 

    },
    'mall':{
        Dev:{url:'https://bplusdev.sinosun.com:18180',supplierId:'1001',supplierList:['mall','suning']},
        BlackBox:{url:'https://bplussit.sinosun.com:18380',supplierId:'1001',supplierList:['mall','suning']},
        Sandbox:{url:'https://bplus-uat.sinosun.com',supplierId:'1001',supplierList:['mall','suning']},
        Production:{url:'https://cloud.sinosun.com',supplierId:'1',supplierList:['mall']},   
    },
    'suning':{
        Dev:{url:'https://bplusdev.sinosun.com:18180',supplierId:'1002',ctrlOpen:true,openByChannels:['1','9729']},
        BlackBox:{url:'https://bplussit.sinosun.com:18380',supplierId:'1002',ctrlOpen:true,openByChannels:['1','9729']},
        Sandbox:{url:'https://bplus-uat.sinosun.com',supplierId:'1002',ctrlOpen:true,openByChannels:['1','5']},
        Production:{url:'https://cloud.sinosun.com',supplierId:'2',close:true,ctrlOpen:true,},   
    },
    'xiyu':{
        Dev:{url:'https://bplusdev.sinosun.com:18180',supplierId:'1003'},
        BlackBox:{url:'https://bplussit.sinosun.com:18380',supplierId:'1003'},
        Sandbox:{url:'https://bplus-uat.sinosun.com',supplierId:'1003'},
        Production:{url:'https://cloud.sinosun.com',supplierId:'3'},   
    },
    'bankofchangsha':{
        Dev:{url:'http://test.bankofchangsha.com/pbank'},
        BlackBox:{url:'http://test.bankofchangsha.com/pbank'},
        Sandbox:{url:'https://test.bankofchangsha.com/pbank-uat'},
        Production:{url:'https://bpmall.bankofchangsha.com/pbank'}, 
    },
    'bbc':{
        Dev:{url:'https://bplusdev.sinosun.com:18180'},
        BlackBox:{url:'https://bplussit.sinosun.com:18380'},
        Sandbox:{url:'https://bplus-uat.sinosun.com'},
        Production:{url:'https://cloud.sinosun.com'}, 
    }
}

/**
 * tommrowTime
 */
let now = new Date();
now = new Date(now.getFullYear()+'/'+(now.getMonth()+1)+"/"+now.getDate());
const tommrowTime = new Date(now).setDate(now.getDate()+1);

/**
 * 入口文件
 */
export const topListGroup = {
    leftEntryList:[
        {src: require('../img/top/bg_shangyun_plane@2x.png'),className:'flight', name: '订机票', url: '/travel/static/flight/index.html#/?DepartTime='+tommrowTime+'&',authType:'bp',saveHistory:false,appId:appIdMap.businesscloud},
        // {src: require('../img/top/bg_shangyun_jingdong@2x.png'), className:'jd', name: '京东企业购', url: '/mallbbc/static/mobile/index.html#/',authType:'bbc',saveHistory:false,appId:appIdMap.businesscloud,unwantedTime:true}, 
    ],
    rightEntryList:[
        {src: require('../img/top/bg_shangyun_hotel1@2x.png'),className:'hotel', name: '订酒店', url: '/travel/static/hotel/index.html#/?',authType:'bp',saveHistory:false,appId:appIdMap.businesscloud},
        {src: require('../img/top/bg_shangyun_train@2x.png'),className:'train',  name: '订火车票', url: '/travel/static/train/index.html#/?',authType:'bp',saveHistory:false,appId:appIdMap.businesscloud},
        // {src: require('../img/top/bg_shangyun_suning1@2x.png'),className:'suning', name: '苏宁易购', url: '/mallbbc/static/mobile/index.html#/',authType:'bbc',saveHistory:false,appId:appIdMap.businesscloud,unwantedTime:true}, 
    ],
    bottomEntryList:[
        {src: require('../img/top/bg_shangyun_sypt@2x.png'), className:'bbc', name: '商云平台', url: '/mallbbc/static/mobile/index.html#/',authType:'bbc',saveHistory:false,appId:appIdMap.businesscloud,unwantedTime:true}, 
    ]
}

/**
 * 商旅入口列表
 */
export const bpListGroup = [
    { name: '我的商城',lineItems:'Two',src: require('../img/top/bg_shangyun_shangcheng@2x.png'),  url: '/mallbbc/static/mobile/index.html#/pages/user/user',authType:'bbc',saveHistory:false,appId:appIdMap.businesscloud,unwantedTime:true},
    { name: '我的商旅',lineItems:'Two',src: require('../img/top/bg_shangyun_shanglv@2x.png'),  url: '/travel/static/personal/index.html#/mine?',authType:'bp',saveHistory:false,appId:appIdMap.businesscloud}, 
]

/**
 * 我的常用
 */
export const historyListGroup = {
    groupName:'我的常用',
    groupId:'wdcy1',
    entryList:[
        {src: require('../img/third/cbopSOwNzs8fG9sPfCA.png'), name: '中国平安', url: 'http://baoxian.pingan.com/m/index.html#/?sourceId=SbyOnqBo',authType:'third',saveHistory:false},
        {src: require('../img/third/WPfIdatYiIT9hHhKfOo.png'), name: '慧择', url:'https://m.huize.com/',authType:'third',saveHistory:false},
        {src: require('../img/third/67JTi5Zz1gtdIvTXHmV.png'), name: '小雨伞', url: 'https://www.xiaoyusan.com/',authType:'third',saveHistory:false}, 
        {src: require('../img/third/d1QcSMn7EbsnS9UaRD0.png'), name: '首汽',url: 'https://yd.01zhuanche.com/',authType:'third',saveHistory:false}
    ]
}

/**
 * 入口文件
 */
export const entryListGroup = [ 
    {
        groupName:'旅行',
        groupId:'lx13',
        entryList:[
            {src: require('../img/third/fg2G5E914nAVEPG15Tt.png'), name: '订机票', url: '/travel/static/flight/index.html#/?DepartTime='+tommrowTime+'&',authType:'bp',saveHistory:true,appId:appIdMap.businesscloud}, 
            {src: require('../img/third/0rRnw1eTrimeebuIQI5.png'), name: '订酒店', url: '/travel/static/hotel/index.html#/?',authType:'bp',saveHistory:true,appId:appIdMap.businesscloud}, 
            {src: require('../img/third/V18qWnoEXn7slIgPJOz.png'), name: '订火车票', url: '/travel/static/train/index.html#/?',authType:'bp',saveHistory:true,appId:appIdMap.businesscloud}, 
        ],
    },   
    {
        groupName:'保险',
        groupId:'bx14',
        entryList:[
            {src: require('../img/third/cbopSOwNzs8fG9sPfCA.png'), name: '中国平安', url: 'http://baoxian.pingan.com/m/index.html#/?sourceId=SbyOnqBo',authType:'third',saveHistory:true},
            {src: require('../img/third/WPfIdatYiIT9hHhKfOo.png'), name: '慧择', url:'https://m.huize.com/',authType:'third',saveHistory:true},
            {src: require('../img/third/67JTi5Zz1gtdIvTXHmV.png'), name: '小雨伞', url: 'https://www.xiaoyusan.com/',authType:'third',saveHistory:true}, 
        ],
    },   
    {
        groupName:'打车',
        groupId:'dc15',
        entryList:[
            {src: require('../img/third/d1QcSMn7EbsnS9UaRD0.png'), name: '首汽',url: 'https://yd.01zhuanche.com/',authType:'third',saveHistory:true},
            {src: require('../img/third/vDALcOa9Ok8JF4TttOM.png'), name: '曹操', url: 'https://m.caocaokeji.cn/',authType:'third',saveHistory:true},
        ],
    }, 
    {
        groupName:'办公租赁',
        groupId:'bgzl16',
        entryList:[
            {src: require('../img/third/xVfdtrvDftuhnxq2h3s.png'), name: '小熊u租',url: 'https://m.bearrental.com/',authType:'third',saveHistory:true},
            {src: require('../img/third/RfCqU3HLDSSLUv7XLbK.png'), name: '人人租机',url: 'https://m.rrzu.com/',authType:'third',saveHistory:true},
        ],
    },    
    {
        groupName:'外卖',
        groupId:'wm17',
        entryList:[
            {src: require('../img/third/KhB9X1tVQJrrf9J2nVM.png'), name: '饿了吗',url: 'https://www.ele.me/',authType:'third',saveHistory:true},
        ],
    },   
    {
        groupName:'加油',
        groupId:'jy18',
        entryList:[
            {src: require('../img/third/8N5VHYlGzvfXLuDRiAf.png'), name: '小桔加油',url: 'https://thrust.am.xiaojukeji.com/gas/bs/pc/view/app.html#/login',authType:'third',saveHistory:true},
            {src: require('../img/third/ajCAjaaeMDiWE7VvuKy.png'), name: '能链',url: 'https://www.newlink.com/',authType:'third',saveHistory:true},
        ],
    },   
    {
        groupName:'同城货运',
        groupId:'tchy19',
        entryList:[
            {src: require('../img/third/JJVb6q7xIn4zymNB0kG.png'), name: '货拉拉',url: 'https://www.huolala.cn/m/index.html?sources=SZ-Y-A-P-bd-pc',authType:'third',saveHistory:true},
        ],
    }                
];


/**
 * 入口文件
 */
export const channelIdCtrl={
    '2108677':{usedHide:true,thirdHide:true}

}

/**
 * 第三方小应用白名单入口文件，没有配置则均可见，配置了则指定渠道可见
 *  '2108677'//伴正事私有云部署银行
 *  '6301445',//长沙银行-SIM
 *  '2107141',//长沙银行-UAT
 *  '5252869',//长沙银行-DEV
 *  '3155717',//长沙银行-SIT
 *  '9989',//长沙银行-PROD
 *  '5':{},//伴正事ACE\uat
 *  '9729':{},//伴正事dev\sit
 *  '1':{},//伴正事dev\sit
 *  '11269':{},//伴正事prod
 */
export const channelIdWhiteCtrl = {
    'sld12' : ['9729','5'],
    'bdsh2' : ['6301445','2107141','5252869','3155717','9989']
}