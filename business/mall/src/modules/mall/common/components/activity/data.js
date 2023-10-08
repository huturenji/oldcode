export default {
    "type": "activity",
    "name": "活动模板",
    "data": {
        components:['banner', 'cutDown', 'tabList'], //需要整合的组件列表
        showCutDown: true, //是否需要倒计时组件
        title:'活动标题',//活动页的title
        bgConfig: { //背景颜色的配置
            use:'color',
            color: '#fff', //背景配置颜色
            url: '', //背景配置背景图url
        },
        showJdHref:true, //是否配置京东的超链接
        salesPriceText:'优惠价'
    }       
}
