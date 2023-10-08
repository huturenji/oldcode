<!-- 商品样式组合
-->
<template name="goodsCombination">
    <view class="goodsCombination" v-margin="decoItem">
        <view class="goods_container flex_row_start_start" ref="container">
            <view v-for="(item,index) in decoItem.data" :key="index" class="goods_item">
                <view v-for="(item1,index1) in item.data.info" :key="index1" @click="goDetail(item1)" class="goods_item_con">
                    <!-- todo 兼容旧商品图片 优先级 新-旧-原商品图片 -->
                    <imgThumb :imgSrc="item1.uploadImage || item1.imgUrl || item1.mainImage" class="img_item"/>
                    
                    <!-- 价格 -->
                    <view class="price" v-if="hadRequested && showPrice(item1)" :style="{left:item.priceStyle.positionX+'%',top:item.priceStyle.positionY+'%',color:item.priceStyle.priceColor,fontSize:item.priceStyle.priceSymbolAndDemicalSize?item.priceStyle.priceSymbolAndDemicalSize*2/100+'rem':'0.24rem',transform:item.priceStyle.positionX !== '' ? 'none' : 'translateX(-50%)'}">
                        <text class="num-font" v-if="item.priceStyle.ifShowPriceSymbol">¥</text>
                        <text class="num-font intPrice" :style="{fontSize:item.priceStyle.priceFontSize?item.priceStyle.priceFontSize*2/100+'rem':'0.24rem'}">{{$getPartNumber(price(item1)['salePrice'],'int')}}</text>
                        <text class="num-font" v-if="item.priceStyle.priceDemicalCount!=0">{{$getPartNumber(price(item1)['salePrice'],'decimal').slice(0,item.priceStyle.priceDemicalCount+1)}}</text>
                    </view>
                    <view class="old_price num-font" v-if="hadRequested && item.priceStyle.priceStyleType==1 && showPrice(item1)" :style="{left:item.priceStyle.originPositionX+'%',top:item.priceStyle.originPositionY+'%',fontSize:item.priceStyle.originPriceSize?item.priceStyle.originPriceSize*2/100+'rem':'0.24rem',color:item.priceStyle.originPriceColor,transform:item.priceStyle.originPositionX !== '' ? 'none' : 'translateX(-50%)'}">
                        <text v-if="item.priceStyle.ifShowOriginPriceSymbol">¥</text>
                        <text>{{$getPartNumber(price(item1)['originalSalePrice'],'int')}}</text>
                        <text v-if="item.priceStyle.originPriceDemicalCount!=0">{{$getPartNumber(price(item1)['originalSalePrice'],'decimal').slice(0,item.priceStyle.originPriceDemicalCount+1)}}</text>
                    </view>
                    <view
                        v-if="hadRequested && !showPrice(item1)" class="price"
                        :style="{
                            fontSize: item.priceStyle.priceFontSize?item.priceStyle.priceFontSize*2/100+'rem':'0.24rem',
                            left: item.priceStyle.positionX+'%',top: item.priceStyle.positionY+'%',
                            color: item.priceStyle.priceColor,transform:item.priceStyle.positionX !== '' ? 'none' : 'translateX(-50%)'
                        }">
                        {{$L('暂无定价')}}
                    </view>
                </view>

                <!-- 标签 -->
                <view class="label_container flex_row_center_center" 
                :class="labelTypeEnum[item.iconStyle.type].className"
                :style="{
                    left:!positionRight(item)?item.iconStyle.positionX+'%':'unset',
                    right:positionRight(item)?item.iconStyle.positionX+'%':'unset',
                    top:item.iconStyle.positionY+'%',
                    opacity:labelOpacity(item),
                    background: filterLabelTypeList.includes(labelTypeEnum[item.iconStyle.type].type)?labelBackground(item):'',
                    color:item.iconStyle.iconTextColor,
                    transform:labelTransform(item),
                    transformOrigin:labelTransformOrigin(item)
                }">
                    <!-- 斜标（左上） type:1-->
                    <angleLabel v-if="labelTypeEnum[item.iconStyle.type].type == 'angleLeft'" :width="264" :borderWidth="64" :text="item.iconStyle.iconText" :bgColor="labelBackground(item)" :isBgImg="judgeIsBgImg(item)" :textColor="item.iconStyle.iconTextColor" :opacity="labelOpacity(item)" textFontSize="110rpx"></angleLabel>
                    <!-- 斜标（右上） type:2-->
                    <angleLabel v-if="labelTypeEnum[item.iconStyle.type].type == 'angleRight'" :width="264" :borderWidth="64" direction="rightTop" :text="item.iconStyle.iconText" :isBgImg="judgeIsBgImg(item)" :bgColor="labelBackground(item)" :textColor="item.iconStyle.iconTextColor" :opacity="labelOpacity(item)" textFontSize="110rpx"></angleLabel>
                    <!-- 火标 type:3 -->
                    <view v-if="labelTypeEnum[item.iconStyle.type].type == 'fire'">{{item.iconStyle.iconText}}</view>
                    <!-- 圆标 type:4 -->
                    <view v-if="labelTypeEnum[item.iconStyle.type].type == 'circle'">{{item.iconStyle.iconText}}</view>
                    <!-- 圆角标 type:5 -->
                    <view v-if="labelTypeEnum[item.iconStyle.type].type == 'circleAngle'">{{item.iconStyle.iconText}}</view>
                    <!-- 圆角标（中间） type:6 -->
                    <view v-if="labelTypeEnum[item.iconStyle.type].type == 'circleAngleCenter'">{{item.iconStyle.iconText}}</view>
                    <!-- 书签标 type:7 -->
                    <view v-if="labelTypeEnum[item.iconStyle.type].type == 'bookmark'">{{item.iconStyle.iconText}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import angleLabel from '@/components/angle-label/angle-label.vue'
import imgThumb from "@/components/goods/thumb/imgThumb.vue";
import goodsHandler from '@/components/goods/handler';
import {isNotEmpty } from '@/utils/common.js'
export default {
    name: "deco-goods-combination",
    components: {
        angleLabel,
        imgThumb
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            containerWidth:0,
            labelTypeEnum:{ //所有标签类型枚举
                0: {className:'labe_none',type:'none'},
                1: {className:'label_angleLeft',type:'angleLeft'}, //斜标（左上）
                2: {className:'label_angleRight',type:'angleRight'}, //斜标（右上）
                3: {className:'label_fire',type:'fire'}, //火标
                4: {className:'label_circle',type:'circle'}, //圆标
                5: {className:'label_circleAngle',type:'circleAngle'}, //圆角标（左上）
                6: {className:'label_circleAngleCenter',type:'circleAngleCenter'}, //圆角标（中间）
                7: {className:'label_bookmark',type:'bookmark'} //书签标
            },
            filterLabelTypeList:['fire','circle','circleAngle','circleAngleCenter','bookmark'], //除了第一种和第二种之外的标签
            skuList:[], //admin传过来的sku集合
            priceData:[], //通过sku查的价格数据
            hadRequested:false //查价格接口是否请求完成
        }
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        price(){
            return (goodsItem) => {
                let price;
                if (this.hadRequested){
                    let index = this.priceData.findIndex(item => item.sku == goodsItem.sku)
                    if (index !== -1) {
                        price = {salePrice:this.priceData[index]['salePrice'],originalSalePrice:this.priceData[index]['originalSalePrice']}
                    }
                }
                return price
            }
        },
        showPrice() {
            return (goodsItem) => {
                let flag = false;
                if (this.hadRequested){
                    let index = this.priceData.findIndex(item => item.sku == goodsItem.sku)
                    if (index !== -1) {
                        flag = true
                    }
                }
                return flag
            }
        },
        // 以下三种标签用右定位，其他用左定位
        positionRight(){
            return (item)=> {
                let flag;
                let tempLabelList =['angleRight','fire','circle']
                if (tempLabelList.includes(this.labelTypeEnum[item.iconStyle.type].type)){
                    flag = true
                } else {
                    flag = false
                }
                return flag
            }
            
            
        },
        // 等比缩小时的缩放原点
        labelTransformOrigin(){
            return (item)=> {
                let origin = '';
                let tempLabelList =['angleRight','fire','circle']
                if (tempLabelList.includes(this.labelTypeEnum[item.iconStyle.type].type)){
                    origin = 'right top'
                } else if (this.labelTypeEnum[item.iconStyle.type].type == 'circleAngleCenter'){
                    if (item.iconStyle.positionX == 50) {
                        origin = 'center top'
                    } else {
                        origin = 'left top'
                    }
                } else {
                    origin = 'left top'
                }
                return origin
            }
            
        },
        // 判断标签背景是不是图片 true:是，false:不是
        judgeIsBgImg(){
            return (item)=> {
                let flag = ''
                if (item.iconStyle.background.img) {
                    flag = true
                } else {
                    flag = false
                }

                return flag
            }
        },

        // 标签背景
        labelBackground() {
            return (item)=> {
                let background = item.iconStyle.background.img?`url(${item.iconStyle.background.img}) center/100% 100% no-repeat`:item.iconStyle.background.color
                return background
            }
            
        },
        // 标签大小根据商品数量等比例缩小，1个商品时是初始状态，适应1,2,3,4个商品时的情况
        labelTransform(){
            return (item)=> {
                let labelScale = 1;
                let labelScaleList = {1:1,2:0.5,3:0.33,4:0.25} //根据商品数量确定缩放比例
                labelScale = labelScaleList[this.decoItem.data.length];
                if (item.iconStyle.type=='6' && item.iconStyle.positionX == 50){
                    return `translateX(-50%) scale(${labelScale})`
                }
                return `scale(${labelScale})`
            }  
        },
        // 单个商品item的宽
        itemWidth(){
            return (length) => {
                let width;
                width = this.containerWidth/length
                return width
            }
        },
        // 标签透明度
        labelOpacity(){
            return (item)=> {
                let opacity = item.iconStyle.background.opacity?item.iconStyle.background.opacity/100:1
                return opacity
            }
            
        }
    },
    created() {

    },
    mounted(){
        this.skuList = this.decoItem.data.map(item=>{
            return item.data.info?.[0]?.sku
        }).filter(item => isNotEmpty(item))
        this.getContainerWidth();
        this.getGoodsDetails(this.skuList)
        
    },
    methods: {
        getContainerWidth(){
            this.containerWidth = this.$refs.container.$el.clientWidth;
        },
        goDetail(goodsItem){
            try {
                let sku = goodsItem.sku;
                this.$Router.push({
                    path: '/standard/product/detail',
                    query: {
                        sku
                    }
                });
            } catch (error) {
                console.log("跳转到商品详情出错", error);
            }
        },
        // 获取商品价格
        getGoodsDetails(ids) {
            return new Promise(async (resolve) => {
                let param = {};
                //获取渠道配置信息，确认是否查询比价数据
                param.skus = ids;
                goodsHandler.getListBySkus(param).then((res) => {
                    this.hadRequested = true;
                    if (res.state == 200 && res.data.length > 0) {                         
                        this.priceData = res.data
                        resolve(res.data);
                    } else {
                        resolve([]);
                    }
                }).catch(() => {
                    this.hadRequested = true;
                    resolve([]);
                });
            });
        }
        
    }
}
</script>

<style lang='scss' scoped>
    .goodsStyle{
        padding: 0 20rpx;
    }
    .goods_container{
        width: 100%;
        .goods_item{
            flex: 1;
            position: relative;
            overflow: hidden;
            .goods_item_con {
               position: relative; 
            }
            .img_item{
                min-height: 1px; //为了修复当图片没有加载完成的时候，快速离开，再回来图片加载异常的问题
                width: 100%;
                vertical-align: top;
            }
            .price{
                position: absolute;
                top: 60%;
                left: 50%;
                z-index: 5;
                height: fit-content;
                max-height: 56rpx;
                // line-height: 100%;
                font-size: 24rpx;
                font-weight: normal;
                color: #f30300;
                white-space: nowrap;
            }
            .old_price{
                position: absolute;
                height: fit-content;
                top: 70%;
                left: 50%;
                z-index: 5;
                font-size: 24rpx;
                text-decoration:  line-through;
                white-space: nowrap;
            }
            .label_container{
                position: absolute;
                z-index: 5;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                opacity: 1;
                &.label_fire,&.label_circle,&.label_circleAngle,&.label_circleAngleCenter{
                    font-size: 80rpx;
                    color: #fff;
                    background: #f30300;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                }

                &.label_angleLeft{
                    top: 0;
                    left: 0;
                    transform-origin: left top;
                    letter-spacing: 2rpx;
                }
                &.label_angleRight{
                    width: fit-content;
                    top: 0;
                    right: 0;
                    transform-origin: right top;
                    letter-spacing: 2rpx;
                }
                &.label_fire{
                    font-size: 80rpx;
                    width: 250rpx;
                    height: 340rpx;
                    right: 4%;
                    top: 4%;
                    padding-bottom: 42rpx;
                    justify-content: flex-end;
                    transform-origin: right top;
                    writing-mode:vertical-lr;
                    letter-spacing: 4rpx;
                    background: url('@/static/shared/goods/icon_huobiao.svg') no-repeat;
                    background-size: 100% auto;
                    color: #fff;
                }
                &.label_circle{
                    font-size: 88rpx;
                    right: 6%;
                    top: 6%;
                    width: 250rpx;
                    height: 250rpx;
                    transform-origin: right top;
                    border-radius: 50%;
                    letter-spacing: 2rpx;
                }
                &.label_circleAngle{
                    font-size: 96rpx;
                    width: 376rpx;
                    height: 160rpx;
                    top: 0;
                    left: 0;
                    transform-origin: left top;
                    border-radius: 0 0 60rpx 0;
                    letter-spacing: 2rpx;
                    font-weight: bold;
                }
                &.label_circleAngleCenter{
                    font-size: 84rpx;
                    width: 376rpx;
                    height: 116rpx;
                    top: 0;
                    left: 50%;
                    transform-origin: top;
                    transform: translateX(-50%);
                    border-radius: 0 0 30rpx 30rpx;
                    letter-spacing: 2rpx;
                    font-weight: bold;
                }
                &.label_bookmark{
                    font-size: 110rpx;
                    transform-origin: left top;
                    transform: scale(1);
                    width: 250rpx;
                    height: 392rpx;
                    padding-bottom: 80rpx;
                    left: 0;
                    top: 0;
                    writing-mode:vertical-lr;
                    letter-spacing: 8rpx;
                    background: url('@/static/shared/goods/icon_shuqianbiao.svg') no-repeat;
                    background-size: 100% auto;
                    color: #fff;
                }
            }
        }
    }

</style>
