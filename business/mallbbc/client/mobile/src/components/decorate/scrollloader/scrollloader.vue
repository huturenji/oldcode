<template>
    <view class="machine_warp">
        <view class="top" v-margin="decoItem" v-background.self="setBackground">
            <swiper 
                v-if="(goods && goods.length > 0)"
                class="swiper"
                :current="current"  
                duration="200"
                vertical
                circular
                previous-margin="24rpx"
                next-margin="24rpx"
                easing-function="linear"
                :disable-touch="true"
            >
                <swiper-item class="swiper_item" v-for="item in goods" :key="item.sku">
                    <image :src="dealImage(item)" mode="heightFix"></image>
                </swiper-item>
            </swiper>
        </view>
        <!-- 开始抽奖的按钮 -->
        <view v-if="!!btnSrc" class="start_button" @click="start">
            <image :src="btnSrc" mode="widthFix"></image>
        </view>

        <!-- 抽中奖品的弹窗 -->
        <uni-popup ref="popup" :mask-click="false">
            <view class="popup_box">
                <view class="top"></view>
                <view class="center">
                    <view class="goods">
                        <image :src="selectedGoods.mainImage" mode="widthFix"></image>
                        <view class="name_wrap"><view class="name">{{selectedGoods.skuName}}</view></view>
                    </view>

                    <view class="btns">
                        <view class="toPay" @click="toPay">去支付送礼</view>
                        <view @click="closePop" class="back">返回</view>
                    </view>
                </view>
                <view class="bottom"></view>
                <view @click="closePop" class="closeIcon">
                    <image :src="imgUrl + 'common/icon/close_screen.png'" mode="widthFix"></image>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { isNotEmpty, isEmpty } from '@/utils/common'
import goodsHandler from '@/components/goods/handler';
// import orderHandler from '@/components/order/handler'; // 订单服务
const totleTimes = 19000; // 总计商品滚动时间
export default {
    name: "deco-scrollloader",
    components:{
        uniPopup
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            timer: null,
            current: 1,
            times: totleTimes,
            selectedGoods: {} // 选中的商品
        }
    },
    mounted(){},
    watch:{
        /**
         * 监听到装修数据变化时，开始绘制整体框架
         */
        decoItem: {
            handler(val, oldVal){
                if (isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)){
                    this.initCurrent(val);
                }    
            },
            deep: true,
            immediate: true
        }
    },
    computed:{
        // 开始抽奖的操作按钮
        btnSrc(){
            return this.decoItem.props.btnImg
        },

        // 配置的商品列表
        goods(){
            return this.decoItem?.data[0]?.info
        },

        // 设置组件背景
        setBackground(){
            let obj = {};
            if (isNotEmpty(this.decoItem.styles[0].background)){
                obj = {...this.decoItem.styles[0].background}
            }
            return obj;
        }
    },
    props: {
        decoItem:{}
    },
    methods:{
        // 关闭弹窗
        closePop(){
            this.$refs.popup.close();
            this.selectedGoods = {};
        },

        // 打开弹窗
        openPop(){
            this.$refs.popup.open(); 
        },

        // 随机获取当前current
        initCurrent(val){
            this.current = 1;
            try {
                let goodsIds = val?.data[0]?.ids;
                this.current = Math.floor((Math.random()*goodsIds.length))
            } catch (error) {
                console.log(error);
            }
        },

        // 处理渲染显示的商品图片 是显示上传的图片还是本省的商品图片
        dealImage(item){
            let src = item.mainImage;
            if (isNotEmpty(item.uploadImage)){
                src = item.uploadImage;
            }
            return src;
        },

        // 开始抽奖 选出当前随机商品的index
        start(){
            if (!!this.timer){ return }
            let indexs = this.goods.length-1;
            this.timer = setInterval(() => {
                this.times = this.times - 1000;
                this.current++;
                if (this.current > indexs){
                    this.current = 0;
                }
                if (this.times <= 0){
                    clearInterval(this.timer);
                    this.timer = null;
                    this.times = totleTimes;
                    this.filterGoods(this.current)
                }
            }, 70)
        },

        // 过滤出选中的商品
        filterGoods(current){
            this.selectedGoods = this.goods.find((item, index) => {
                return current == index;
            })
            if (Object.keys(this.selectedGoods).length > 0){
                // 延时两秒显示弹窗
                setTimeout(()=>{
                    this.openPop();
                }, 150)
            } else {
                console.log('选中的商品有问题');
            }
        },

        // 点击去支付页面
        async toPay(){
            if (isEmpty(this.selectedGoods.sku)){
                console.log('所选商品没有sku');
                return;
            }
            this.$setStorageSync('confirmParams','')
            let goodsData = {}
            try {
                goodsData = await this.getGoodsDetails([this.selectedGoods.sku])
            } catch(e) {}
            let productInfo = []
            if (isNotEmpty(goodsData)) {
                productInfo = [{
                    storeId : goodsData.storeId,
                    storeName : goodsData.storeName,
                    ownShop : goodsData.ownShop,
                    products:[{
                        sku:this.selectedGoods.sku,
                        skuName:goodsData.skuName,
                        mainImage: goodsData.mainImage,
                        number:1,
                        salePrice: goodsData.salePrice,
                        specValues:goodsData.specValues==null?'默认':goodsData.specValues,
                        lowestBuy:goodsData.lowestBuy,
                        notAttendDiscount:false,
                        ownShop:goodsData.ownShop,
                        storeId:goodsData.storeId,
                        categoryId3:goodsData.categoryId3,
                        cidPath:goodsData.cidPath,
                        specialOfferVO:(goodsData?.promotionId)
                            ?{
                                promotionId:goodsData.promotionId,
                                promotionType:goodsData.promotionType
                            }
                            :null
                    }]
                }]
                let confirmParams = {
                    productInfo:productInfo
                }
                this.$setStorageSync('confirmParams',JSON.stringify(confirmParams))
                let query = {
                    orderType: 1,
                    FEATHER_ORDER: true
                }
            
                let path = '/views/order/confirm/gift';
                this.$Router.push({
                    path: path,
                    query
                })
            }  
            
        },
        // 获取商品详情
        getGoodsDetails(ids) {
            return new Promise((resolve) => {
                let param = {};
                param.skus = ids;
                uni.showLoading()
                goodsHandler.getListBySkus(param).then((res) => {
                    if (res.state == 200) {
                        if (res.data.length > 0) {
                            let list = res.data
                            resolve(list[0]);
                        } else {
                            uni.showToast({
                                title: "当前商品暂时缺货，火速补货中，请稍后再试",
                                icon:'none'
                            })
                        }
                    } else {
                        resolve({});
                        uni.showToast({
                            title: "当前商品暂时缺货，火速补货中，请稍后再试",
                            icon:'none'
                        })
                    }
                    uni.hideLoading()
                }).catch(() => {
                    resolve({});
                    uni.hideLoading()
                });
            });
        }
    }
}
</script>

<style lang='scss' scoped>
.top{
    display: flex;
    width: 100%;
}
.start_button{
    display: flex;
    image{
        flex: 1;
        font-size: 0;
        display: inline-block;
    }
}

.swiper{
    flex: 1;
    width: 100%;
    height: 268rpx;
    .swiper_item{
        height: 100%;
        border-radius: 8rpx;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        image{
            width: auto;
            height: 204rpx;
            border-radius: 8rpx;
        }
    }
}

.popup_box{
    width: 578rpx;
    position: relative;
    .closeIcon{
        position: absolute;
        left: 50%;
        margin-left: -28rpx;
        bottom: -140rpx;
        width: 56rpx;
        height: 56rpx;
        z-index: 2000;
        image{
            width: 56rpx;
            height: 56rpx;
        }
    }
    .top{
        width: 100%;
        height: 220rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/bg_lql_sltj2.png') center top no-repeat;
        background-size: cover;
    }
    .center{
        width: 100%;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/bg_lql_changtiao.png') center top repeat-y;
        background-size: 100% auto;
        padding: 0 42rpx;
        .goods{
            width: 100%;
            text-align: center;
            image{
                width: 240rpx;
                height: 240rpx;
                border-radius: 12rpx;
                margin: 24rpx 0;
            }
            .name_wrap{
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .name{
                width: 336rpx;  //设置宽度
                // height: 80rpx;
                font-size: 28rpx;
                color: #222;
                line-height: 40rpx;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;  //使用自适应布局
                -webkit-line-clamp: 2;  //设置超出行数，要设置超出几行显示省略号就把这里改成几
                -webkit-box-orient: vertical;
            }
        }
        .btns{
            text-align: center;
            margin-top: 48rpx;
            padding-bottom: 52rpx;
            position: relative;
            .toPay{
                width: 100%;
                height: 80rpx;
                background: linear-gradient(180deg,#fcd055, #fc8936);
                border-radius: 16rpx;
                line-height: 80rpx;
                text-align: center;
                color: #fff;
                font-size: 30rpx;
            }
            .back{
                font-size: 26rpx;
                color: #994605;
                position: absolute;
                bottom: -14rpx;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
            }

        }
    }
    .bottom{
        margin-top: -1px;
        width: 100%;
        height: 68rpx;
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/decorate/bg_lql_sltj4.png') center top no-repeat;
        background-size: cover;
    }
}
</style>