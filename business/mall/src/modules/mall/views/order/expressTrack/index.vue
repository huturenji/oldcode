<!-- 订单跟踪页面 -->
<template>
    <div class="orderTrack-wrap">
        <section class="track-wrap">
            <div class="track_info">
                <div class="track_info_item">
                    <p class="track_info_item_label">订单编号：</p>                 
                    <div class="track_info_item_content can-select">{{orderNo}}</div>                                  
                </div>
                <div class="track_info_item">
                    <p class="track_info_item_label">{{supplierExpressName}}：</p>                 
                    <div class="track_info_item_content can-select">{{waybillNo}}</div>                                  
                </div>
                <div class="track_info_item">
                    <p class="track_info_item_label">国内承运人：</p>                 
                    <div class="track_info_item_content">{{carrier}}</div>                                  
                </div>
                <div v-if="!!dataInfo.deliveryTimeRange" class="track_info_item">
                    <p class="track_info_item_label">预计送达：</p>                 
                    <div class="track_info_item_content" v-html = 'dataInfo.deliveryTimeRange'></div>                                  
                </div>
            </div>
            <div class="track-box">
                <OrderTrackInfo :trackInfo='trackInfo'></OrderTrackInfo>
            </div>
            
        </section>
    </div>
</template>
<script>
const OrderTrackInfo = ()=>import('view/order/expressTrack/orderTrackInfo.vue');
import OrderHandler from 'common/lib/requestHandler/orderHandler.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
export default {
    components: {
        OrderTrackInfo
    },
    mixins: [tChatEventMixin], 
    data() {
        return {
            orderNo: this.$route.query.orderNo,
            title:'订单跟踪',
            carrier:'',
            trackInfo:[],
            dataInfo:{},
            waybillNo: '', //物流单号
        };
    },
    created(){
        this.init();
    },
    computed:{
        supplierExpressName(){
            let name = '物流单号';
            // let supplierId = OrderHandler.supplierId;
            // if(supplierId!=null && supplierId!=undefined && supplierId!=''&& !!this.BMallConfig.SUPPLIER_Map[supplierId].name){
            //     name = this.BMallConfig.SUPPLIER_Map[supplierId].name + name;
            // }
            return name;
        }
    },
    methods: {
        init(){
            let needRequest = this.$route.query.needRequest || '';
            if(!!needRequest){
                this.initByRequest();
            }else{
                this.initByCache();
            }
        },


        //通过缓存获取数据，此时是通过包裹信息页面跳转过来的，相关的信息是存入缓存的，该场景为大于一个的包裹时候会用到
        initByCache(){
            this.orderNo = this.$route.query.orderNo;
            this.dataInfo = JSON.parse(this.$route.query.item);
            let deliveryInfo = this.dataInfo.deliveryInfo;
            this.waybillNo = deliveryInfo.waybillNo||''; //更新物流单号
            this.carrier = deliveryInfo.carrier;
            this.dataInfo.deliveryTimeRange = this.getExpectedDeliveryTime(deliveryInfo.expectedDeliveryTime, deliveryInfo.expectedDeliveryTimeRange);
            this.trackInfo = this.autoSort(deliveryInfo.routeInfos||[])||[];
        },

        //通过接口请求获取数据，只有一个包裹的时候会用到
        initByRequest(){
            let param = {
                orderNo:this.orderNo
            }
            this.$loading.show();
            OrderHandler.getOrderExpressRouteInfos(param).then(res=>{
                this.$loading.hide()
                let packageList = res.result.packageList;
                if(packageList.length > 0 && !!packageList[0].deliveryInfo){
                    let deliveryInfo = packageList[0].deliveryInfo;
                    this.carrier = deliveryInfo.carrier;
                    this.dataInfo.deliveryTimeRange = this.getExpectedDeliveryTime(deliveryInfo.expectedDeliveryTime, deliveryInfo.expectedDeliveryTimeRange);
                    this.trackInfo = this.autoSort(deliveryInfo.routeInfos||[])||[];
                    this.waybillNo = deliveryInfo.waybillNo||''; //更新物流单号
                }                
            }).catch(e=>{
                this.$loading.hide()
                console.log(e)
            });
        },


        //处理后端数据结构
        autoSort(list){
            let arr =[];
            for(let i = 0;i<list.length;i++){
                let $item = list[i].remarkAndTime;
                for(let k = 0;k<$item.length;k++){
                    arr.push({
                        state:k==0?list[i].state:'',
                        remarkAndTime:{
                            name:$item[k].name,
                            phone:$item[k].phone,
                            remark:$item[k].remark,
                            time:$item[k].time,
                        }
                    })
                }
            }
            return arr;
        },
        /*
         * 组合预计到达参数
         * @time 送达日期时间戳
         * @timeRange 送达时间段
        */
        getExpectedDeliveryTime(time,timeRange){
            if(!timeRange){
                timeRange = '';
            }
            //判断时间格式正确性
            if(!!time && (time.length == 10 || time.length == 13)){
                if(time.length == 10){
                    time *= 1000;
                }
                let date = new Date(time*1);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                month = month>10?month:`0${month}`;
                let day = date.getDate();
                day = day>10?day:`0${day}`;
                return `${year}年${month}月${day}日 ${timeRange}`;
            }else{
                return `${timeRange}`;
            }
            
        },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            this.$router.back();
        },
    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/order/orderList/orderTrack.less";
</style>