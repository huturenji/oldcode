// 引入客服的功能
import customerService from '@/common/lib/customer-service';
import orderHandler from '@/components/order/handler';
import {accMul} from '@/utils/common';
const mixin={
    data() {
        return {   
            customerService: customerService
        }
    },    
    mounted() {          
    },

    onShow() {
       
        
    },
    
    methods: {

        //跳转到客服系统
        async gotoCustomerService(order, type){
            try {
                let url = await this.customerService.run(1, this.zcConfig(order, type), 'order')
                this.$openCustomerServicePage(url)
            } catch (error) {
                console.log(error)
            }
        },
        
        /********
         * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
         */
        zcConfig(order, type){
            
            //这里的订单商品结构上，是分店铺来统计的，默认获取第一个店铺的。后续有需求再修改。
            let products = [];
            let total_fee = '';
            if (type == 'detail'){
                products = order.childOrdersVOS[0].orderProductListVOList;
                total_fee = accMul(order.actualPayment, 100);
            } else if (type == 'list'){
                products = order.orderProductListVOList;
                total_fee = accMul(order.orderAmount, 100);
            }
            let goods = []; //商品详情数组
            // 此处只显示第一个商品的缩略图即可
            goods.push({
                name: encodeURIComponent(products[0].skuName), //商品名称
                pictureUrl: encodeURIComponent(products[0].mainImage) //商品图片链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
            })
            let orderDetailUrl = `${window.location.origin}${window.location.pathname}#/pages/order/detail?orderSn=${order.orderSn}` //目前涉及的联系客服退款的订单详情的卡片，同意跳转到订单详情
            let zConfig = {
                order_status: this.$config.ZC_ORDER_STATE_MAP[order.orderState], //订单状态，1: '待付款',2: '待发货',3: '运输中', 4: '派送中',5: '已完成', 6: '待评价',7: '已取消',
                create_time: new Date(order.createTime.replace(/-/g, '/')).getTime(), //创建时间（毫秒）此处需特别注意，ios时间格式如果是-的话转换有兼容性问题，应该转为/
                order_code: order.orderSn, //订单编号
                order_url: encodeURIComponent(this.$assignUrlParam('pageFrom', 'customerService', orderDetailUrl)), //订单链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
                goods_count: products.length, //商品数量 
                total_fee: total_fee, //订单金额（以分为单位，total_fee=1000相当与total_fee=10.00元，不支持小数）
                goods: JSON.stringify(goods)
            }
            return zConfig
        },
        //查看物流
        async lookLogistics(orderSn=this.orderSn,expressNumber) {
            let trackList = await this.getTrack(orderSn);
            if (!!trackList){
                if (!!expressNumber) {
                    trackList = trackList.filter(e=>{
                        return e.tracesResult.expressNumber == expressNumber
                    })
                }
                try {
                    if (trackList.length > 1){ //多个包裹, 跳转到多包裹页面
                        this.$Router.push({path:'/views/order/logistics/list',query:{orderSn}})
                    } else if (trackList.length <= 1){ //一个包裹
                        //如果是一个包裹的话，此时直接跳转到物流详情页面，首先存入缓存
                        // 跳转到物流详情
                        this.gotoTraceDetail(trackList[0] || {})
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                uni.showToast({
                    title: '查询物流信息错误',
                    icon: 'none',
                    duration: 700
                })
            }
        },

        // 跳转到物流详情页面
        gotoTraceDetail(item = {}){
            // 将包裹信息存入缓存
            this.$setStorageSync('packageItem', item);
            this.$Router.push({
                path:'/views/order/logistics/detail',
                query:{
                    orderSn: this.orderSn,
                    detailFrom: 'cache' //物流信息来自哪里 说明来自前端缓存localstorage
                }
            })
        },

        //获取物流信息 此处获取物流信息是为了判断 该订单是否是多包裹的
        //如果是多包裹的，此时需要跳转到包裹选择页面  如果是单包裹的此时直接跳转物流展示页面
        getTrack(orderSn){
            return new Promise((resolve) => {
                let param = {orderSn};
                uni.showLoading();
                orderHandler.getTrace(param).then(res => {
                    uni.hideLoading();
                    if (res.state == 200 && res.data.traces) {
                        resolve(res.data.traces)
                    } else {
                        resolve(false)
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {
                    //异常处理
                    resolve(false)
                    uni.hideLoading();
                })
            })
        }
    }
}
export default mixin;