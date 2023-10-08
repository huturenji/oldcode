<template>
    <view :style='[rootStyle, styles]'>
        <view class="img_warp" v-if="loading">
            <view class="img_warp_item" v-for="(item, index) in decoItem.data" :key="index" > 
                <image class="img_item" :src="setImg(item)" mode="widthFix" @click="receive(item)"></image>
            </view>
        </view>
    </view>
</template>

<script>
import { skipTo } from '@/utils/common.js'
import goodsHandler from "@/views/components/goods/handler";
import mixin from "@/common/components/decorate/common/mixin/index";

export default {
    name: "deco-claim-all",
    mixins: [mixin],
    data() {
        return {
            loading:false
        }
    },
    props: {
        decoItem:{
            type: Object,
            default: () => {}
        }
    },
    computed: {
        rootStyle() {
            let styleObj = {}
            if (this.decoItem.props.isShowStyle && this.decoItem.styles[0].background) {
                let style = this.decoItem.styles[0].background
                styleObj = {
                    background: style.img?`url(${style.img}) center/100% 100% no-repeat`:style.color,
                    opacity: style.opacity/100<1?style.opacity/100:1
                }
            }
            return styleObj
        },
        setImg(){
            return item=>{
                let relImg
                if(!item.flag&&item.activeImg!==''){
                    relImg = item.activeImg
                }else{
                    relImg = item.img
                }
                return relImg
            }
        }
    },
    watch: {
                   
    },
    mounted(){
        this.getAllCouponList()
    },
    
    methods:{
        receive(item){
            if(!item.flag&&item.activeImg!==''){
                skipTo(item.urlInfo,this)
            }else{
                let params = {}
                params.couponInfoVOs=[]
                item.info.forEach((items)=>{
                    params.couponInfoVOs.push({
                        promotionType:!!items?.info?.promotionType?items.info.promotionType:402,
                        promotionId:items?.info?.couponId
                    })
                })
                goodsHandler.reveiverAllCoupon(params).then(res=>{
                    if(res.state==200){
                        uni.showToast({
                            title: '领取成功!',
                            icon:'none'
                        })
                    }else{
                        uni.showToast({
                            title: '您来晚了，优惠券已领完！',
                            icon:'none'
                        })
                    }
                    this.getAllCouponList()
                }).catch(()=>{

                })
            }
        },
        //获取领券中心数据
        getAllCouponList() {
            let couponIdList = []//优惠券的id列表
            let freightCouponIdList = []//运费券的id列表
            let consumerCouponIdList = []//消费券的id列表
            let redPacketIdList = []//红包的id列表
            this.decoItem.data.length>0&&this.decoItem.data.forEach((item)=>{
                item.info.forEach((items)=>{
                    if(!items.info.promotionType||items.info.promotionType=='402'){
                        couponIdList.push(items.info.couponId)
                    }
                    if(items.info.promotionType=='405'){
                        freightCouponIdList.push(items.info.couponId)
                    }
                    if(items.info.promotionType=='406'){
                        consumerCouponIdList.push(items.info.couponId)
                    }
                    if(items.info.promotionType=='404'){
                        redPacketIdList.push(items.info.couponId)
                    }
                })
            })
            Promise.all([this.getCouponList(couponIdList),
                this.getFreightCouponList(freightCouponIdList),
                this.getConsumerCouponList(consumerCouponIdList),
                this.getRedPacketList(redPacketIdList)
            ])
            .then(([couponList,freightCouponList,consumerCouponList,redPacketList])=>{
                let couponLists = couponList.concat(freightCouponList).concat(consumerCouponList).concat(redPacketList)  
                let dataList = this.decoItem.data
                for(let i = dataList.length - 1; i >= 0; i--) {
                    for (let index = 0; index < dataList[i].info.length; index++) {
                        if(dataList[i].info[index].info.couponId) {
                            this.$set(dataList[i].info[index], 'info', couponLists.filter(items => items.couponId== dataList[i].info[index].info.couponId)[0])
                        }
                    }
                }
                this.decoItem.data.forEach((item)=>{
                    if(item.info.some(items=>items?.info?.receivedState == 1)){
                        item.flag=true
                    }else{
                        item.flag=false
                    }
                })
                this.$forceUpdate()
                this.loading=true
            })
        },
        //获取优惠券列表
        getCouponList(list){
            return new Promise((resolve) => {
                let param = {};
                param.current = 1;
                param.pageSize = 1000;
                param.couponIds = list
                goodsHandler.couponCenter(param).then(res => {
                    if (res.state == 200) {
                        resolve(res.data.couponList)
                    } else {
                        resolve([])
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {
                    //异常处理
                })
            })
                
        },
        // 获取红包列表
        getRedPacketList(list){
            return new Promise((resolve) => {
                let param = {};
                param.current = 1;
                param.pageSize = 1000;
                param.couponIds = list.join(',')
                goodsHandler.getRedPacketList(param).then(res => {
                    if (res.state == 200) {
                        resolve(res.data.couponList)
                    } else {
                        resolve([])
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {
                    //异常处理
                })
            })
        },
        // 获取运费券列表
        getFreightCouponList(list){
            return new Promise((resolve) => {
                let param = {};
                param.current = 1;
                param.pageSize = 1000;
                param.couponIdList = list
                goodsHandler.freightCouponCenter(param).then(res => {
                    if (res.state == 200) {
                        resolve(res.data.list)
                    } else {
                        resolve([])
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    //异常处理
                })
            })
        },
        // 获取消费券列表
        getConsumerCouponList(list){
            return new Promise((resolve) => {
                // resolve([])
                let param = {};
                param.current = 1;
                param.pageSize = 1000;
                param.couponIds = list.join(',')
                goodsHandler.getConsumeCouponList(param).then(res => {
                    if (res.state == 200) {
                        resolve(res.data.couponList)
                    } else {
                        resolve([])
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {
                    //异常处理
                })
            })
        }
    }
}
</script>

<style lang="scss" >
    .img_warp{
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 0;
        .img_warp_item{
            flex: 1;
            .img_item{
                min-height: 1px; //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
                width: 100%;
                vertical-align: top;
            }
            //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
            ::v-deep uni-image{
                height: auto;
            }
            ::v-deep uni-image > img {
                object-fit: unset;
            }
        }
    } 
    .allWrap{
        width: 100%;
        .img_item{
            min-height: 1px; //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
            width: 100%;
            vertical-align: top;
        }
        //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
        ::v-deep uni-image{
            height: auto;
        }
        ::v-deep uni-image > img {
            object-fit: unset;
        }
    }
</style>