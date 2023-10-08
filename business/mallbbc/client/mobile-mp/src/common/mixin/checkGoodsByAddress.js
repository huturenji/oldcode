import { isEmpty } from "@/utils/common";
import stockEnum from '@/common/lib/enum/stock';
import goodsHandler from "@/views/components/goods/handler.js";

export default {
    data() {
        return {}
    },    
    props: {
        /**
         * 获取默认收货地址（单例）
         */
        getDefaultAddress: {
            type: Object,
            default: () => {},
        }
    },
    methods: {
        //获取区域限售状态
        getListAreaLimit(skus, defaultAddress) {
            return new Promise(async resolve => {
                goodsHandler.checkAreaPurchase({
                    skus:skus,
                    provinceCode: defaultAddress.provinceCode,
                    cityCode: defaultAddress.cityCode,
                    districtCode: defaultAddress.districtCode,
                    townCode: defaultAddress.townCode
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
        getListStock(Info, defaultAddress) {
            return new Promise(async resolve => {
                goodsHandler.checkStock({
                    skuInfos: Info,
                    provinceCode: defaultAddress.provinceCode,
                    cityCode: defaultAddress.cityCode,
                    districtCode: defaultAddress.districtCode,
                    townCode: defaultAddress.townCode
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
        // 通过接口获取相关的商品信息区域限售和有货无货的状态
        updatePromotionGoodsByAddress(list){
            return new Promise(async resolve => {
                try {                     
                    let defaultAddress = this.getDefaultAddress
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    let newSku = list.map(temp => temp.sku)
                    if (newSku && newSku.length > 0){
                        let limitList = await this.getListAreaLimit(newSku, defaultAddress)
                        if (limitList && limitList.length > 0){
                            // list = list.map(temp => {
                            //     let index = limitList.findIndex(one => {
                            //         return one.sku == temp.sku
                            //     })
                            //     if (index > -1){
                            //         return {...temp, canPurchase: limitList[index].canPurchase}
                            //     }
                            //     return {...temp}
                                    
                            // })
                            list.forEach(temp => {
                                let index = limitList.findIndex(one => {
                                    return one.sku == temp.sku
                                })
                                if (index > -1){
                                    this.$set(temp, 'canPurchase', limitList[index].canPurchase)
                                }                                 
                            })
                        }
                    }
                                        
                    if (newSku && newSku.length > 0){
                        let param = newSku.map(item => { return {sku:item, num:1} })
                        let stockSkusList = await this.getListStock(param, defaultAddress)
                        if (stockSkusList && stockSkusList.length > 0){
                            // list = list.map(temp => {
                            //     let index = stockSkusList.findIndex(one => {
                            //         return one.sku == temp.sku
                            //     })
                            //     if (index > -1){
                            //         return {...temp, hasStock: stockEnum[stockSkusList[index].stockState].hasStock}
                            //     }
                            //     return {...temp}
                                    
                            // })
                            list.forEach(temp => {
                                let index = stockSkusList.findIndex(one => {
                                    return one.sku == temp.sku
                                })
                                if (index > -1){
                                    this.$set(temp, 'hasStock', stockEnum[stockSkusList[index].stockState].hasStock)
                                }                                 
                            })
                        }
                    }
                    resolve(list);
                } catch (error) {
                    console.log(error)
                    resolve([]);
                }
            })
        },
        // 通过接口获取相关的商品信息过滤掉域限售和有货无货的商品
        filterPromotionGoodsByAddress(list) {
            return new Promise(async resolve => {
                try {                     
                    let defaultAddress = this.getDefaultAddress
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    let newSku = list.map(temp => temp.sku) //只有京东和西域需要校验
                    if (newSku && newSku.length > 0){
                        let limitList = await this.getListAreaLimit(newSku, defaultAddress)
                        if (limitList && limitList.length > 0){
                            list = list.filter(item => limitList.some(one => one.sku === item.sku && one.canPurchase))
                        }
                    }

                    if (newSku && newSku.length > 0){
                        let param = newSku.map(item => { return {sku:item, num:1} })
                        let stockSkusList = await this.getListStock(param, defaultAddress)
                        if (stockSkusList && stockSkusList.length > 0){
                            list = list.filter(item => stockSkusList.some(one => one.sku == item.sku && stockEnum[one.stockState].hasStock))
                        }
                    }
                    resolve(list);
                } catch (error) {
                    console.log(error)
                    resolve([]);
                }
            })
        }
    }
}