/*
 * @Descripttion: 导出服务请求地址，以及小应用跳转地址
 * @version: 
 * @Author: yg
 * @Date: 2020-05-29 18:11:11
 * @LastEditors: yg
 * @LastEditTime: 2020-09-25 09:41:13
 */

module.exports = {
    serverUrl:'bp/v1/travel/',//服务请求地址
    appUrlMap:{//小应用链接
        trip:{web:'static/trip/',server:'bp/trip/'},//我的行程
        order:{web:'static/order/',server:'bp/order/'},//订单
        flight:{web:'static/flight/',server:'bp/flight/'},//机票
        hotel:{web:'static/hotel/',server:'bp/hotel/'},//酒店
        train:{web:'static/train/',server:'bp/train/'},//火车票
        pay:{web:'static/pay/',server:'bp/pay/'},//支付
        invoice:{web:'static/invoice/',server:'bp/invoice/'},//发票
        verInvoice:{web:'',server:'bp/verInvoice/'},//发票核验
        personal:{web:'static/personal/',server:'bp/travelUser/'},//我的商旅
        criterion:{web:'static/personal/',server:'bp/travelUser/'},//差标
        passenger:{web:'static/passenger/',server:'bp/passenger/'},//乘客管理
        score:{web:'static/score/',server:'bp/score/'},//积分
        coupon:{web:'static/coupon/',server:'bp/coupon/'},//优惠券
        address:{web:'static/address/',server:'bp/address/'},//地址管理
        express:{web:'static/express/',server:'bp/express/'},//快递
        car:{web:'static/car/',server:'bp/car/'},//商务用车
        travelEnterprise:{web:'static/enterprise/',server:''},//企业管理
        insurance:{web:'',server:'bp/insurance/'},//保险
        travelUser: {web:'',server:'bp/travelUser/'},//用户服务
        swplib: {
            path:'static/swplib/',
            child:{
                pay: {prefix:'bp/pay/',version:'1.0.0/',entry:'swp-pay.js'},//支付组件
                invoice: {prefix:'bp/invoice/',version:'1.0.0/',entry:'swp-invoice.js'},//发票组件
                passenger: {prefix:'bp/passenger/',version:'1.0.0/',entry:'swp-psg.js'},//乘客组件
                address: {prefix:'bp/address/',version:'1.0.0/',entry:'swp-address.js'},//地址组件
                serviceReminders: {prefix:'bp/serviceReminders/',version:'',entry:'swp-serviceReminders.js'},//服务提醒组件
                serverAuth: {prefix:'bp/serverAuth/',version:'1.0.0/',entry:'swp-serviceAuth.js'}//授权提醒组件
            }
        }
    },
	envMap:{
        local:{//本地调试
            host:'https://bplussit.sinosun.com:18380/',
        },
        Dev: { //开发环境
            host:'https://bplusdev.sinosun.com:18180/',
        },
        BlackBox: { //黑盒环境
            host:'https://bplussit.sinosun.com:18380/',
        },
        Sandbox: { //沙盒环境
            host:'https://bplus-uat.sinosun.com/',
        },
        Production: { //生产环境
            host:'https://bplus.sinosun.com/',
        },
        K8s: { //K8s环境
            host:'http://yqtdemo.sinosun.com:30106/'
		}
	}
}
