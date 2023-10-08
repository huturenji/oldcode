<template>
    <view class="activity_container">
        <template v-if="goodsList.length > 0">
            <!-- 竖向的商品瀑布流展示 -->
            <goodsListWaterfall 
                :list="goodsList"
                :icon_type="1"
                :addTime="0"
                :showCart="false"
                
            />
            <loadingState :state='loadingState'/>
        </template>

        <template v-if="!loading && goodsList.length <= 0">
            <view
                class="empty_part flex_column_start_center">
                <view class="img"></view>
                <text>{{$L('暂无数据')}}</text>
            </view>
        </template>
    </view>
</template>

<script>
import goodsListWaterfall from "@/components/goods/waterfallList.vue";
import loadingState from "@/components/loading/loading.vue";
import stockEnum from '@/common/lib/enum/stock';
import saleState from '@/common/lib/enum/saleState.js';
import goodsHandler from '@/components/goods/handler';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            skus: '',
            skuList: [],
            goodsList: [], // 商品列表
            imgUrl:getApp().globalData.imgUrl,
            stepNum: 20, // 前端假分页，显示切片数据，目前按照20条数据进行切片
            totlePage: 1, // 总页数
            current: 1, // 当前页
            hasMore: true, // 是否还有下一页
            loadingState: '', //是否第一次加载
            loading: true
        }
            
    },
    
    components: {goodsListWaterfall, loadingState},
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
        ...mapState(['defaultAddress'])
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
                let limitSkus = list.map((temp) => { if (temp.supplierType == "JD") { return temp.sku } return undefined }).filter(item => item != undefined) //只有京东企业购需要校验
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

            if (this.current == 1){
                this.goodsList = list;
            } else {
                this.goodsList = this.goodsList.concat(...list)
            }
        },

        //后台更改价格重新拉取数据
        getGoodsList(ids){
            return new Promise((resolve) => {
                let param = {}
                param.skus = ids;
                param.current = this.current;
                this.current == 1 && uni.showLoading()
                this.loadingState = 'loading';
                goodsHandler.getListBySkus(param).then(res => {
                    uni.hideLoading()
                    if (res.state == 200 && res.data.length > 0){
                        this.hasMore = this.totlePage - this.current > 0; 
                        if (!this.hasMore){
                            this.loadingState = 'no_more_data';
                        }
                        resolve(res.data);
                    }
                }).catch(() => {
                    this.hasMore = false;
                    this.loading = false;
                    uni.hideLoading()
                    resolve([])
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
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        text {
            color: $main-third-color;
            font-size: 26rpx;
        }
    }
    
</style>

