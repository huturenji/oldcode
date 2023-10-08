<template>
    <view>
        <w-loading ref="loading"></w-loading>
        <view class="img_warp" :style="[styles,{
                position:position,
                top:top,
                zIndex:zIndex
            }]">
            <view class="img_warp_item"  @click="goDetail(item)" v-for="(item, index) in decoItem.data" :key="index" :style="[setImgStyle(index)]"> 
                <image class="img_item" :src="setImg(item)" mode="widthFix" @load="imageLoad($event, index)"></image>
            </view>
        </view>
    </view>
</template>

<script>
import goodsHandler from '@/views/components/goods/handler';
import {
    skipTo, isNotEmpty, getQuerySelector, setStorageSync
} from '@/utils/common'
import mixin from "@/common/components/decorate/common/mixin/index";
export default {
    name: "deco-image-combination",
    mixins: [mixin],
    data() {
        return {
            imgStyles: {},
            mountedCount: 0,
            imgFlag:0,
            position:'relative',
            top:0,
            zIndex:0,
        }
    },
    watch:{
        /**
         * 监听到装修数据变化时，开始绘制整体框架
         */
        decoItem: {
            handler(val, oldVal){
                if(isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)){
                    this.initBackgroud(val)
                    this.initSpace(val)
                }    
            },
            deep: true,
            immediate: true
        },
        parentScrollTop:{
            handler(val){
                //不在初始化时执行，避免多次触发同一事件
                if (val > 3){
                    this.imgFlag = 1
                }else{
                    this.imgFlag = 0
                }
            },
            immediate: true
        }  
    },
    props: {
        decoItem:{},
        parentScrollTop: {
            type: Number,
            default: 0
        }
    },
    computed:{
        setImg(){
            return item => {
                let img
                if(this.imgFlag == 0){
                    img = item.img
                }else{
                    img = !!item.imgActivity?item.imgActivity:item.img
                }
                return img
            }
        }
    },
    mounted(){
        this.setImageWrapStyle()
    },
    methods:{
        async goDetail(item){

            // 批量下单
            if(item.url_type == 'confirm_order'){
                let skus = item.info?.ids;
   
                let products = await this.listBySkus(skus);

                item.info?.products.forEach(product => {
                    products?.forEach(p => {
                        if(p.sku == product.sku){
                            p.number = product.number
                            p.specValues = p.specValues || product.specValues
                        }
                    } );
                })
                
                this.setParamForStorageOfConfirm(products);
            
                this.$Router.push({
                    path: '/views/order/confirm/index',
                    query: {
                        orderType: 1,
                        ifcart: 2,
                    }
                })
                
            }else{
                skipTo(item, this)
            }
        },
        setImageWrapStyle(){
            this.$nextTick(()=>{
                if (!!this.decoItem.props.fixed){
                    this.position = 'fixed'
                    this.top = getApp().globalData.navHeight + "px"
                    this.zIndex = 2000
                }
            })
        },
        imageLoad() {
            try {
                this.mountedCount += 1
                if (this.mountedCount === this.decoItem.data.length) {
                    // 该延时器是为了兼容部分手机上【目前已知iphone7】上有的图片依旧有白线的问题
                    setTimeout(()=>{
                        getQuerySelector('.img_warp_item', true, this).then(res => {
                            res.forEach((item, index) => {
                                // 修复图片的宽高有小数点，小数点宽高在不不同的机型上有白线的问题
                                this.$set(this.imgStyles, index, {width: parseInt(item.width), height:parseInt(item.height)})
                            })
                        })
                    }, 50)
                }
            } catch (error) {
                
            }
        },
        setImgStyle(index) {
            let style = {}
            if (this.imgStyles[index] && this.imgStyles[index].width && this.imgStyles[index].height) {
                style = {
                    width: this.imgStyles[index].width + 'px !important',
                    // height: this.imgStyles[index].height + 'px !important'
                }
            } else {
                style = { flex: 1 }
            }
            return style
        },
        async listBySkus(skus){
            try {
                this.$refs?.loading?.open();
                let res = await goodsHandler.getListBySkus({skus});

                if(res.state == 200 && res.data?.length > 0){
                    return Promise.resolve(res.data) 
                }else{
                    uni.showToast({
                        title: '当前商品暂时缺货，火速补货中，请稍后再试',
                        icon: 'none'
                    })
                    return Promise.resolve(null)
                }
            } catch (error) {
                return Promise.resolve(null)
            } finally {
                this.$refs?.loading?.close();
            }
        },
        setParamForStorageOfConfirm(products){
            const goodsData = []
            products.forEach( product => {
                let { 
                    ownShop, storeId, storeName, specValues, mainImage, stageId, number,
                    salePrice, sku, skuName, categoryId3, cidPath, promotionDes, promotionId, promotionType
                } = product;

                let productListItem = {
                    storeName,
                    skuName, 
                    specValues,
                    mainImage, 
                    buyNum: number,
                    price: salePrice,
                    sku,
                }

                let productsItem = {
                    storeName,
                    storeId,
                    sku,
                    number,
                    notAttendDiscount: false,
                    salePrice,
                    categoryId3,
                    cidPath,
                    // 秒杀、一起买、天天专场
                    specialOfferVO: !!promotionId? {
                        promotionDes,
                        promotionId,
                        promotionType,
                        stageId
                    }: null
                }
   
                let index = goodsData.findIndex(goods => goods.storeId == product.storeId);
                // 新建店铺商品信息已存在
                if(index >= 0){
                    let storeInfo = goodsData[index];
                    storeInfo.productList.push(productListItem)
                    storeInfo.products.push(productsItem)
                }else{
                    // 新建店铺商品信息
                    let storeInfo = {
                        ownShop,
                        storeId,
                        storeName,
                        productList: [ productListItem ],
                        products: [ productsItem ]
                    }

                    goodsData.push(storeInfo);
                }
            })

            // 先清空：购物车，鹅毛情，普通订单，抽奖兑换都会放置此缓存数据
            setStorageSync('orderConfirm', '')
            setStorageSync('orderConfirm', { goodsData })
        }
    }
}
</script>

<style lang='scss'>
    .img_warp{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        font-size: 0;
        width: 100%;
        .img_warp_item{
            display: flex;
            font-size: 0;
            .img_item{
                width: 100%;
                vertical-align: top;
                object-fit: unset;
            }
        }
        
    }
</style>