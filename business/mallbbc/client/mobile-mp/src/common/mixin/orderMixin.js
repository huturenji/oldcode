// 引入客服的功能
import orderHandler from '@/views/components/order/handler';
import {setStorageSync} from '@/utils/common';
const mixin={
    data() {
        return {   
        }
    },    
    mounted() {          
    },

    onShow() {
       
        
    },
    
    methods: {
        //查看物流
        async lookLogistics(orderSn = this.orderSn, expressNumber) {
            this.showState= true;
            let trackList = await this.getTrack(orderSn);
            if (!!trackList){
                if (!!expressNumber) {
                    trackList = trackList.filter(e=>{
                        return e.tracesResult.expressNumber == expressNumber
                    })
                }
                try {
                    if (trackList.length > 1){ //多个包裹, 跳转到多包裹页面
                        this.$Router.push({path:'/views/gift/logistics/list',query:{orderSn}})
                    } else if (trackList.length <= 1){ //一个包裹
                        //如果是一个包裹的话，此时直接跳转到物流详情页面，首先存入缓存
                        // 跳转到物流详情
                        this.gotoTraceDetail(trackList[0] || {})
                    }
                } catch (error) {
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
            setStorageSync('packageItem', item);
            this.$Router.push({
                path:'/views/gift/logistics/detail',
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
                this.$refs?.loading?.open();
                orderHandler.getTrace(param).then(res => {
                    if (res.state == 200 && res.data.traces) {
                        resolve(res.data.traces)
                    } else {
                        resolve(false)
                        uni.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                    }
                }).catch(() => {
                    //异常处理
                    resolve(false)
                }).finally(e=>{
                    this.$refs?.loading?.close();
                })
            })
        }
    }
}
export default mixin;