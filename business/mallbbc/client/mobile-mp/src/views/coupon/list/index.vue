<template>
    <view class="activity_container">
        <w-loading ref="loading"></w-loading>
        <template v-if="goodsList.length > 0">
            <goods-display :goods-list="goodsList" :type="DISPLAY_TYPE.masonry" />
            <loadingState :state='loadingState'/>
        </template>

        <template v-if="!loading && goodsList.length <= 0">
            <view
                class="empty_part flex_column_start_center">
                <view class="img"></view>
                <text>暂无数据</text>
            </view>
        </template>
    </view>
</template>

<script>
import loadingState from "@/common/components/loading/loading.vue";
import goodsHandler from '@/views/components/goods/handler';
import goodsDisplay from '@/views/components/goods/goods-display';
import { DISPLAY_TYPE } from '@/common/lib/enum/goods.js';
import { promotionEnum } from '@/common/lib/enum/promotion';
export default {
    mixins: [],
    data() {
        return {
            imgUrl:getApp().globalData.imgUrl,
            skus: '',
            skuList: [],
            goodsList: [], // 商品列表
            stepNum: 20, // 前端假分页，显示切片数据，目前按照20条数据进行切片
            totlePage: 1, // 总页数
            current: 1, // 当前页
            hasMore: true, // 是否还有下一页
            loadingState: '', //是否第一次加载
            loading: true,
            DISPLAY_TYPE,
            defaultAddress: {} // 默认地址
        }
    },
    
    components: { loadingState, goodsDisplay},
    props: {},
    mounted(){
        this.skus = this.$Route.query.skus;
        if (!!this.skus){
            try {
                this.skuList = this.skus.split(',');
                this.totlePage = Math.ceil(this.skuList.length/this.stepNum); 
                this.initData(this.skuList.slice(0, this.current*this.stepNum));
            } catch (error) {
                console.log(error)
            }
        } else {
            this.loading = false;
        }
    },
    onReachBottom(){
        if (this.hasMore){
            this.current++;
            this.loadingState = 'allow_loading_more';
            this.initData(this.skuList.slice((this.current-1) * this.stepNum, (this.current) * this.stepNum));
        } else {
            this.loadingState = 'no_more_data';
        }
    },
    computed:{
    },
    
    methods: {
        //获取区域限售状态
        getListAreaLimit(skus) {
            return new Promise((resolve) => {
                goodsHandler.checkAreaPurchase({
                    skus:skus,
                    provinceCode:this.defaultAddress.provinceCode,
                    cityCode:this.defaultAddress.cityCode,
                    districtCode:this.defaultAddress.districtCode,
                    townCode:this.defaultAddress.townCode
                }).then(res=> {
                    if (res.state == 200 && res.data && res.data.skuPurchaseList && res.data.skuPurchaseList.length > 0){
                        resolve(res.data.skuPurchaseList)
                    } else {
                        resolve([])
                    }
                }).catch(e=> {
                    console.log(e)
                    resolve([])
                })
            })
        },
        // 获取商品的库存状态
        getListStock(Info) {
            return new Promise((resolve) => {
                goodsHandler.checkStock({
                    skuInfos:Info,
                    provinceCode:this.defaultAddress.provinceCode,
                    cityCode:this.defaultAddress.cityCode,
                    districtCode:this.defaultAddress.districtCode,
                    townCode:this.defaultAddress.townCode
                }).then(res=>{
                    if (res.state == 200 && res.data && res.data.skuStockList && res.data.skuStockList.length > 0){
                        resolve(res.data.skuStockList);
                    } else {
                        resolve([])
                    }
                }).catch(e=> {
                    console.log(e)
                    resolve([])
                })
            })
        },
        // 初始化商品列表
        async initData(ids){
            let list = await this.getGoodsList(ids);
            if (list && this.defaultAddress && this.defaultAddress.provinceCode && this.defaultAddress.cityCode && this.defaultAddress.districtCode){
                let newInfos = JSON.parse(JSON.stringify(list));
                let limitSkus = list.map((temp) => { if (temp.supplierType == "JD" || temp.supplierType == "EHSY") { return temp.sku } return undefined }).filter(item => item != undefined) //只有京东和西域需要校验
                let stockSkus = limitSkus.map(item => { return {sku:item, num:1} })//查库存需要特殊值
                if (limitSkus && limitSkus.length > 0){
                    let limitList = await this.getListAreaLimit(limitSkus)
                    if (limitList && limitList.length > 0){
                        newInfos = newInfos.map(temp => {
                            let index = limitList.findIndex(one => {
                                return one.sku == temp.sku
                            })
                            if (index == -1){
                                return {...temp, canPurchase: true}
                            }
                            return {...temp, canPurchase: limitList[index].canPurchase}
                                
                        })
                            
                    }
                }
                if (stockSkus && stockSkus.length > 0){
                    let stockSkusList = await this.getListStock(stockSkus)
                    if (stockSkusList && stockSkusList.length > 0){
                        newInfos = newInfos.map(temp => {
                            let index = stockSkusList.findIndex(one => {
                                return one.sku == temp.sku
                            })
                            if (index == -1){
                                return {...temp, hasStock: true}
                            }
                            return {...temp, hasStock: stockEnum[stockSkusList[index].stockState].hasStock}
                                
                        })
                            
                    }
                }
                if (limitSkus && limitSkus.length > 0 ){
                    let newInfosFilter = newInfos.filter(item => { return saleState[item.state].onSale && item.hasStock && item.canPurchase && !!item.salePrice });
                    list = newInfosFilter;
                    if (list && list.length <=0 ){
                        this.loading = false
                    }
                }
            }
            this.loading = false;
            if (this.current == 1){
                this.goodsList = list;
            } else {
                this.goodsList = this.goodsList.concat(...list)
            }

            if(this.hasMore){

            }
        },

        //后台更改价格重新拉取数据
        getGoodsList(ids){
            return new Promise((resolve) => {
                if(!!!ids){resolve([])}
                let param = {}
                param.skus = ids;
                param.current = this.current;
                this.current == 1 && this.$refs?.loading?.open();
                this.loadingState = 'loading';
                goodsHandler.getListBySkus(param).then(res => {
                    if (res.state == 200 && res.data.length > 0){
                        this.hasMore = this.totlePage - this.current > 0; 
                        if (!this.hasMore){
                            this.loadingState = 'no_more_data';
                        }
                        // 鹅毛情的商品要过滤掉正在进行一起买活动的商品
                        let list = res.data.filter(item => {
                            // 查找出一起买活动
                            let activityECBUY = item.activityList?.find(activity => {
                                return activity.promotionGrade == 1 && activity.promotionType == promotionEnum.ECBUY.type && activity.state == 2;
                            })
                            return !activityECBUY;
                        });
                        resolve(list);
                    }
                }).catch(() => {
                    this.hasMore = false;
                    this.loading = false;
                    resolve([])
                }).finally(() => {
                    this.$refs?.loading?.close();
                })
            })
        }
            
    }
}
</script>

<style lang="scss">
    .empty_part {
        margin-top: 276rpx;
        width: 100%;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwnr.png') center no-repeat;
            background-size: 100% 100%;
        }

        text {
            color: #999;
            font-size: 26rpx;
        }
    }
    
</style>

