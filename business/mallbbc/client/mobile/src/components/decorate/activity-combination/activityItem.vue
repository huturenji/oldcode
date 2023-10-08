<template>
    <view class="activityItemWrap" @click="goDetail(decoData.link)" :style="{backgroundColor:decoData.backgroundColor}">
        <view class="leftTitle">{{decoData.leftText.title}}
            <image mode="heightFix" v-if="!decoData.leftText.title&&decoData.leftText.img" :src="decoData.leftText.img"/>
        </view>
        <view class="top" :style="setTopStyle(decoData)">
            <view v-if="decoData.sources.url_type=='everydaybuy'" class="everyDataTitle">
                {{everyDayTitle}}
            </view>
            <view class="distanceTime" v-if="judgeState==1&&isFirstLoading">
                <view class="left">{{showStage}}</view>
                <view class="right">
                    {{$L('即将开始')}}
                </view>
            </view>
            <view class="distanceTime" v-if="judgeState==2&&isFirstLoading">
                <view class="timeLeft"></view>
                <view class="timeRight">
                    <div class="time">{{secKillHr}}</div>
                    <div class="time_tips"></div>
                    <div class="time">{{secKillMin}}</div>
                    <div class="time_tips"></div>
                    <div class="time">{{secKillSec}}</div>
                </view>
            </view>
        </view>
        <view v-if="isFirstLoading&&!noData">
            <view v-if="decoData.isLunbo">
                <swiper
                    class="carousel carousel_bottom"
                    :autoplay='true'
                    circular
                    :current="current"
                    @change="change"
                    :style="setStyle(decoData)"
                    :interval="decoData.speed ? decoData.speed * 1000 : 3000"
                >
                    <swiper-item
                        v-for="(item, index) in goodslist"
                        :key="index"
                        class="carousel-item"
                        :style="{ width: '50%' }"
                    >
                        <view class="goods-img">
                            <imgThumb :imgSrc="item.mainImage" />
                        </view>
                        <view class="bottom_part flex_column_center_between">
                            <view class="bottom flex_column_center_between">
                                <view class="goods-price flex_row_center_center">
                                    <view class="left flex_column_center_center">
                                        <view class="left_price num-font">
                                            <text class="unit fontScaleIgnore">￥</text>
                                            <text class="price_int fontScaleIgnore">{{$getPartNumber(item.promotionPrice,'int')}}</text>
                                            <text class="price_decimal fontScaleIgnore">{{$getPartNumber(item.promotionPrice,'decimal')}}</text>
                                        </view>
                                        <view class="old_price num-font fontScaleIgnore">￥{{$getPartNumber(item.salePrice,'int')}}{{$getPartNumber(item.salePrice,'decimal')}}</view> 
                                    </view>
                                </view> 
                            </view>
                        </view>
                    </swiper-item>
                </swiper>
            </view>
            <view v-else class="goodsWrap" :style="setStyle(decoData)">
                <view  v-for="(item, index) in goodslist.slice(0,2)" :key='index' class="itemWrap" :class="{}">
                    <view class="goods-img">
                        <imgThumb :imgSrc="item.mainImage" />
                    </view>
                    <view class="bottom_part flex_column_center_between">
                        <view class="bottom flex_column_center_between">
                            <view class="goods-price flex_row_center_center">
                                <view class="left flex_column_center_center">
                                    <view class="left_price num-font">
                                        <text class="unit fontScaleIgnore">￥</text>
                                        <text class="price_int fontScaleIgnore">{{$getPartNumber(item.promotionPrice,'int')}}</text>
                                        <text class="price_decimal fontScaleIgnore">{{$getPartNumber(item.promotionPrice,'decimal')}}</text>
                                    </view>
                                    <view class="old_price num-font fontScaleIgnore">￥{{$getPartNumber(item.salePrice,'int')}}{{$getPartNumber(item.salePrice,'decimal')}}</view> 
                                </view>
                            </view> 
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="isFirstLoading&&noData">
            <view class="goodsWrap" :style="setTopStyle(decoData)">
                <view  v-for="(item, index) in 2" :key='index' class="itemWrap">
                    <view class="no-goods-img">
                        <image class="image" :src="imgUrl + 'activity-combination/picture@2x.png'"/>
                    </view>
                    <view class="no-goods-title">
                        暂无数据
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import goodsHandler from '@/components/goods/handler';
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import {
    skipTo
} from '@/utils/common.js'
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            seckillStage:'',
            buyTogetherStage:'',
            seckillPromotionId:'',
            buyTogetherPromotionId:'',
            everyDayTitle:'',
            current: 0,
            secKillHr: '', //距离下场秒杀活动开始（进行中） 时
            secKillMin: '', //距离下场秒杀活动开始（进行中） 分
            secKillSec: '' ,//距离下场秒杀活动开始（进行中） 秒
            judgeState:'',
            isFirstLoading:false,
            noData:false,
            goodslist:[]
        }
    },
    components:{
        imgThumb
    },
    props: {
        decoData:{
            type: Object,
            default: () => {}
        }
    },
    computed: {
        setStyle(){
            return item=>{
                let setStyle = {}
                if(item.style=='one'){
                    if(item.isLunbo){
                        setStyle.paddingLeft = '12rpx'
                        setStyle.paddingRight = '12rpx'
                    }else{
                        setStyle.paddingLeft = '24rpx'
                        setStyle.paddingRight = '24rpx'
                    }
                }else if(item.style=='two'){
                    if(item.isLunbo){
                        setStyle.paddingLeft = '16rpx'
                        setStyle.paddingRight = '16rpx'
                    }else{
                        setStyle.paddingLeft = '28rpx'
                        setStyle.paddingRight = '28rpx'
                    }
                }
                return setStyle
            } 
        },
        setTopStyle(){
            return item=>{
                let setStyle = {}
                if(item.style=='one'){
                    setStyle.paddingLeft = '24rpx'
                    setStyle.paddingRight = '24rpx'
                }else if(item.style=='two'){
                    setStyle.paddingLeft = '28rpx'
                    setStyle.paddingRight = '28rpx'
                }
                return setStyle
            } 
        }
    },
    watch: {
           
    },
    mounted(){
        setTimeout(()=>{
            this.getGoods(this.decoData.sources)
        },0)
    },
    methods:{
        //轮播图切换
        change(e) {
            this.current = e.detail.current;       
        },
        goDetail(item) {
            skipTo(item,this)
        },
        getGoods(val){
            if(val.url_type=='seckill'){
                this.seckillPromotionId = val.info.promotionId
                this.getSeckillInfo()
            }else if(val.url_type=='buytogether'){
                this.buyTogetherPromotionId = val.info.promotionId
                this.getBuySessionList()
            }else if(val.url_type=='everydaybuy'){
                this.getEverydayBuyInfo()
            }
        },
        // 获取天天专场
        getEverydayBuyInfo() {
            return this.$request({
                url: 'v3/specialoffer/front/buyEveryday/getTodayBuyEveryday',
                method: 'GET'
            }).then(res => {
                if (res.state === 200 && res.data) {
                    let promotionId = res.data.promotionId
                    this.everyDayTitle = res.data.promotionName
                    this.getEverydayBuyGoods(promotionId)
                } else {
                    this.noData = true
                    this.isFirstLoading =true
                }
            })
        },
        // 获取天天专场商品
        getEverydayBuyGoods(promotionId) {
            this.showSkeleton = true
            this.$request({
                url: 'v3/specialoffer/front/buyEveryday/pagePromotionBindProduct',
                data: {
                    promotionId: promotionId,
                    pageSize: 999,
                    pageIndex: 1
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                }
            }).then(async res => {
                if (res.state === 200 && res.data.products) {
                    if(res.data.products.length>0){
                        if(res.data.products.length>20){
                            this.goodslist = res.data.products.slice(0,20)
                        }else{
                            this.goodslist = res.data.products
                        }
                    }else{
                        this.noData = true
                    }
                    this.isFirstLoading =true
                }else{
                    this.noData = true
                    this.isFirstLoading =true
                }
            })
        },
        // 获取秒杀场次列表
        getSeckillInfo(){
            goodsHandler.getTodaySeckillStage({
                promotionId:this.seckillPromotionId
            }).then((res)=>{
                if (res.state == 200) {
                    let result = res.data.seckillStages
                    if (result != null && result.length>0){
                        this.time_list = result
                        this.pageNum = 1;
                        let countTime;
                        let showItem=this.time_list.find((value)=>value.logicState>1);
                        if (showItem.logicState==2){
                            this.judgeState = 2;
                            this.showStage = showItem.stageAliar.substring(0,5) + '场';
                            countTime = showItem.distanceEndTime;
                            this.getSeckillGoodsList(showItem.stageId);
                        } else if (showItem.logicState==3){
                            this.judgeState = 1;
                            this.showStage = showItem.stageAliar.substring(0,5) + '场';
                            this.getSeckillGoodsList(showItem.stageId);
                        }
                        this.getAllTime(countTime);
                        let secInterval = setInterval(() => {
                            if (countTime == 0) {
                                //倒计时结束，清除倒计时
                                clearInterval(secInterval);
                                this.getSeckillInfo();
                            } else {
                                countTime--;
                                this.getAllTime(countTime);
                            }
                        }, 1000)
                    } else {
                        this.noData = true
                        this.isFirstLoading =true
                    }
                }else {
                    this.noData = true
                    this.isFirstLoading =true
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                }
            }).finally(()=>{
                // uni.hideLoading();
            });
        },
        // 场次开始倒计时处理
        getAllTime(countTime){
            let hours = parseInt(countTime / 60 / 60 % 24);
            let minutes = parseInt(countTime / 60 % 60);
            let seconds = parseInt(countTime % 60);
            this.secKillHr = hours > 9 ? hours : '0' + hours;
            this.secKillMin = minutes > 9 ? minutes : '0' + minutes;
            this.secKillSec = seconds > 9 ? seconds : '0' + seconds;
        },
        getSeckillGoodsList(stageId){
            var param={}
            param.pageSize = 20;
            param.pageIndex = this.pageNum;
            param.stageId = stageId
            goodsHandler.getSeckillProductList(param).then(async (res)=>{
                if (res.state == 200&&res.data.list) {
                    if(res.data.list.length>0){
                        if(res.data.list.length>20){
                            this.goodslist = res.data.list.slice(0,20)
                        }else{
                            this.goodslist = res.data.list
                        }
                    }else{
                        this.noData = true
                    }
                    this.isFirstLoading =true
                } else {
                    this.noData = true
                    this.isFirstLoading =true
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                }
            });
        },

        // 获取一起买场次列表
        getBuySessionList() {
            let dateTime = new Date();
            let year = dateTime.getFullYear();
            let month = dateTime.getMonth() + 1;
            let day = dateTime.getDate();
            let stageDate= year + '-' + month + '-' + day
            this.$request({
                url: 'v3/specialoffer/front/buyTogether/getDateStage',
                method: 'GET',
                data: {
                    stageDate: stageDate,
                    promotionId: this.buyTogetherPromotionId
                }
            }).then(res => {
                if (res.state == 200 && res.data.buyTogetherStageVOList) {
                    let data = res.data.buyTogetherStageVOList.find(item=>item.frontState<3)
                    let countTime;
                    if(data.frontState==2){
                        this.judgeState = 2;
                        countTime = data.distanceTime;
                        this.showStage = data.stageContent.substring(0,5) + '场';
                        this.getOnlineGoods(data.stageId)
                    }else if(data.frontState==1){
                        this.judgeState = 1;
                        this.showStage = data.stageContent.substring(0,5) + '场';
                        this.getOnlineGoods(data.stageId)
                    }
                    this.getAllTime(countTime);
                    let buyTogetherSecInterval = setInterval(() => {
                        if (countTime == 0) {
                            //倒计时结束，清除倒计时
                            clearInterval(buyTogetherSecInterval);
                            this.getBuySessionList();
                        } else {
                            countTime--;
                            this.getAllTime(countTime);
                        }
                    }, 1000)
                } else {
                    this.noData = true 
                    this.isFirstLoading =true   
                }
            })
        },
        //获取一起买商品
        getOnlineGoods(stageId) {
            this.$request({
                url: 'v3/specialoffer/front/buyTogether/productList',
                data: {
                    promotionId: this.buyTogetherPromotionId,
                    stageId:stageId,
                    pageSize: 20,
                    pageIndex: 1
                },
                method: 'POST',
                header: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.state === 200 && res.data.list) {
                    if(res.data.list.length>0){
                        if(res.data.list.length>20){
                            this.goodslist = res.data.list.slice(0,20)
                        }else{
                            this.goodslist = res.data.list
                        }
                    }else{
                        this.noData = true
                    }
                    this.isFirstLoading =true
                }else{
                    this.noData = true
                    this.isFirstLoading =true
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.carousel_bottom {
    overflow: hidden;
}

.everyDataTitle{
    font-size: 26rpx;
    color: #666;
}
.carousel {
    width: 100%;
    margin-top: 20rpx;
    height: 210rpx;
    ::v-deep .uni-swiper-slides{
        width: 50%;
    }
    .carousel-item {
        width: 50%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center
    }
}
.no-goods-img{
    width: 128rpx;
    height:128rpx;
    background-color: #fff;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .image{
        width: 72rpx;
        height:72rpx
    }
}
.no-goods-title{
    margin-top: 8rpx;
    color: #666;
}
.goodsWrap{
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;
}
.itemWrap{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    
}

.timeLeft{
    background-image: url('@/static/shared/activity-combination/naozhong@2x.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 36rpx;
    height: 36rpx;
}
.timeRight{
    display: flex;
    align-items: center;
    .time{
        background-image: url('@/static/shared/activity-combination/bg_bnj_time1.png');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        text-align: center;
        font-size: 20rpx;
        color: #fff;
        margin:0 6rpx ;
        width: 38rpx;
        height: 30rpx;
    }
    .time_tips{
        background-image: url('@/static/shared/activity-combination/bg_bnj_time2.png');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        text-align: center;
        width: 6rpx;
        height: 20rpx;
    }
}

.goods-img {
    width: 128rpx;
    height: 128rpx;
    display: block;
    border-radius: 12rpx;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
}
.goods-price {
    width: 100%;
    color: #f30300;

    .unit.fontScaleIgnore{
        font-size: 20rpx;
        letter-spacing: -2px;
    }

    .price_int.fontScaleIgnore{
        font-size: 32rpx;
    }
    .price_decimal.fontScaleIgnore {
        font-size: 20rpx; 
    }
    .old_price.fontScaleIgnore{
        font-size: 20rpx;
        text-decoration:  line-through;
        color: #A4ACB2;
    }
}
.activityItemWrap{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 8rpx;
    height: 100%;
    .leftTitle{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-right: 16rpx;
        image{
            width: auto;
            height: 64rpx;
        }
    }
    .top{
        height: 30rpx;
        font-size: 24rpx;
        color: #222222;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .distanceTime{
            width:208rpx;
            height:34rpx;
            border-radius: 8rpx;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .left{
                width: 96rpx;
                height: 30rpx;
                background: #f30300;
                border-radius: 6rpx 0 0 6rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22rpx;
                color: #fff;
            }
            .right{
                width: 96rpx;
                height: 30rpx;
                border: 2rpx solid #f30300;
                border-radius: 0 6rpx 6rpx 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20rpx;
                color: #f30300;
            }
        }
    }
}
    
</style>