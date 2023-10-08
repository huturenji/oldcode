import { isEmpty, isNotEmpty } from "@/utils/common";
import stockEnum from '@/common/lib/enum/stock';
// import saleState from '@/common/lib/enum/saleState.js';
import goodsHandler from '@/components/goods/handler';
import { mapState } from 'vuex';
export default {
    data() {
        return {   
            tabList: [],
            tabPageSize: 10 
        }
    },    
    props: {
        /**
         * 获取默认收货地址（单例）
         */
        getDefaultAddress: {
            type: Function
        }
    },
    computed: {
        ...mapState(['addressPromise'])
    },
    methods: {
        /***
         * 处理商品切片数据生成如下格式：
         * [0, 10, 30, 70, 170, 270, 370, 470, 570, 670, 770, 870, 970, 1070, 1170] 
         * //分页切片先10 在20 在 40 在100， 后面都是100
         * @params numbers 装修的商品数量
         */
        dealGoodsSplit(numbers){
            let arr = [0];
            let temp = 0;
            for (let i =1; numbers>temp; i++) {
                temp += 10*Math.pow(2,i-1);
                temp>100?arr[i]=(arr[i-1]+100):arr[i] =temp ;
            }
            return arr;
        },
        /*====================更新装修商品实时数据 start======================= */
        /*=========说明: 1. 下述代码是重新拉取装修的商品数据后，刷新商品的实时信息========== */
        /*==============2. 商品信息分缓存和实时数据，只有实时数据才执行下面的逻辑========== */
        /*==============3. 【请后面修改的人注意维护该注释！！！！】========== */
            
        // 初始化装修的商品数据 isFilter 是否过滤不可售商品
        initDecoGoodsData(item, isFilter = false, filterNoSubstantialGoods = false){
            if (item.data && item.data.info && item.data.info.length > 0){             
                this.$set(item.data, 'pageIndex', 1);
                this.$set(item.data, 'totalPage', this.dealGoodsSplit(item.data.ids.length).length - 1);
                this.$set(item.data, 'done', false);
                this.$set(item.data, 'info', []);
                this.$set(item.data, 'goodsSplit', this.dealGoodsSplit(item.data.ids.length));
                
                // 获取装修数据
                this.getDecoGoodsData(item, isFilter, filterNoSubstantialGoods)
            } else {
                this.showSkeletonLoading = false;
            }
                
        },

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

        // 获取推荐商品的装修数据更新
        async getDecoGoodsData(item, isFilter, filterNoSubstantialGoods) {
            // 兼容lazy-load组件，图片懒加载
            // 此uOnReachBottom事件由加载更多时发出，目的是让页面到底时，保证所有图片都进行加载，做到绝对稳定且可靠
            uni.$emit('uOnReachBottom')
            const skus = item.data.ids.slice(item.data.goodsSplit[item.data.pageIndex-1], item.data.goodsSplit[item.data.pageIndex]);
            if (skus && skus.length > 0){
                if (item.data.pageIndex == 1){ //当前tab栏的第一页的时候 显示骨架图
                    this.showSkeletonLoading = true;
                } 
                // 通过接口获取更新和过滤相关的商品数据
                let list = await this.updateGoodsBySkus(skus, item.show_style);

                if(filterNoSubstantialGoods){
                    list = list.filter(temp => goodsHandler.isShowJdLable(temp))
                }

                // 对是否过滤不可售商品进行判断
                if (isFilter) {
                    list = await this.filterGoodsByAddress(list);
                    item.data.info.push(...list)
                } else {
                    list = await this.updateGoodsByAddress(list) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货            
                    item.data.info.push(...list)
                }
                // 只有查到了数据 再关闭骨架图
                if(item.data.info.length > 0){
                    this.showSkeletonLoading = false;
                }
            } else {
                this.showSkeletonLoading = false;
            }

            //当前页数+1
            this.$set(item.data, 'pageIndex', ++item.data.pageIndex)

            // 如果装修的商品未加载完成，加载下一页
            if (item.data.pageIndex <= item.data.totalPage) {
                this.getDecoGoodsData(item, isFilter, filterNoSubstantialGoods)
            } else {
                this.showSkeletonLoading = false;
                this.$set(item.data, 'done', true); // 说明加载完成
            }
        },  

        // 通过接口过滤或者更新相关的商品信息
        updateGoodsByAPI(skus, showStyle){
            return new Promise(async resolve => {
                try {
                    // 进行三个接口请求拿到骨架图中满足条件的商品
                    let list = await this.getGoodsDetails(skus, showStyle);
                       
                        
                    // 开始默认所有的商品都不限售 都有货，然后在进行后续的过滤
                    list = list.map(item => {
                        return {
                            ...item,
                            canPurchase: true,
                            hasStock: true
                        }
                    })
                    try {
                        await this.addressPromise;
                    } catch (error) {
                        
                    }
                    let defaultAddress = await this.getDefaultAddress?.()
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    let newSku = list.map(temp => { if (temp.supplierType == "JD"){ return temp.sku } return null; }).filter(item => isNotEmpty(item)) //只有京东企业购需要校验
                    if (newSku && newSku.length > 0){
                        let limitList = await this.getListAreaLimit(newSku, defaultAddress)
                        if (limitList && limitList.length > 0){
                            list = list.map(temp => {
                                let index = limitList.findIndex(one => {
                                    return one.sku == temp.sku
                                })
                                if (index > -1){
                                    return {...temp, canPurchase: limitList[index].canPurchase}
                                }
                                return {...temp}
                                    
                            })
                        }
                    }
                                        
                    if (newSku && newSku.length > 0){
                        let param = newSku.map(item => { return {sku:item, num:1} })
                        let stockSkusList = await this.getListStock(param, defaultAddress)
                        if (stockSkusList && stockSkusList.length > 0){
                            list = list.map(temp => {
                                let index = stockSkusList.findIndex(one => {
                                    return one.sku == temp.sku
                                })
                                if (index > -1){
                                    return {...temp, hasStock: stockEnum[stockSkusList[index].stockState].hasStock}
                                }
                                return {...temp}
                                    
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
        // 通过接口更新相关的商品信息
        updateGoodsBySkus(skus, showStyle){
            return new Promise(async resolve => {
                try {
                    // 进行三个接口请求拿到骨架图中满足条件的商品
                    let list = await this.getGoodsDetails(skus, showStyle);
                    // 开始默认所有的商品都不限售 都有货，然后在进行后续的过滤
                    list = list.map(item => {
                        return {
                            ...item,
                            canPurchase: true,
                            hasStock: true
                        }
                    })
                    resolve(list);
                } catch (error) {
                    console.log(error)
                    resolve([]);
                }
            })
        },

        // 通过接口获取相关的商品信息区域限售和有货无货的状态
        updateGoodsByAddress(list){
            return new Promise(async resolve => {
                try {                     
                   
                    try {
                        await this.addressPromise;
                    } catch (error) {
                        
                    }
                    let defaultAddress = await this.getDefaultAddress?.()
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    let newSku = list.map(temp => { if (temp.supplierType == "JD"){ return { sku: temp.sku, num: temp.lowestBuy || 1 } } return null; }).filter(item => isNotEmpty(item)) //只有京东企业购需要校验
                    if (newSku && newSku.length > 0){
                        let limitList = await this.getListAreaLimit(newSku.map(item => item.sku), defaultAddress)
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
                        let stockSkusList = await this.getListStock(newSku, defaultAddress)
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
        filterGoodsByAddress(list) {
            return new Promise(async resolve => {
                try {                 
                    try {
                        await this.addressPromise;
                    } catch (error) {
                        
                    }   
                    let defaultAddress = await this.getDefaultAddress?.()
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    // 只有京东企业购进行可售性判断
                    let newSku = list.map(temp => { if (temp.supplierType == "JD"){ return { sku: temp.sku, num: temp.lowestBuy || 1 } } return null; }).filter(item => isNotEmpty(item)) //只有京东企业购需要校验
                    if (newSku && newSku.length > 0){
                        let limitList = await this.getListAreaLimit(newSku.map(item => item.sku), defaultAddress)
                        if (limitList && limitList.length > 0){
                            let filterList = []
                            list.forEach(item => {
                                let index = limitList.findIndex(one => {
                                    return one.sku == item.sku
                                })

                                if (index === -1) {
                                    filterList.push(item)
                                } else if(limitList[index].canPurchase) {
                                    filterList.push(item)
                                }
                            })
                            list = filterList
                        }
                    }

                    if (newSku && newSku.length > 0){
                        let stockSkusList = await this.getListStock(newSku, defaultAddress)
                        if (stockSkusList && stockSkusList.length > 0){
                            let filterList = []
                            list.forEach(item => {
                                let index = stockSkusList.findIndex(one => {
                                    return one.sku == item.sku
                                })

                                if (index === -1) {
                                    filterList.push(item)
                                } else if(stockEnum[stockSkusList[index].stockState].hasStock) {
                                    filterList.push(item)
                                }
                            })
                            list = filterList
                        }
                    }
                    resolve(list);
                } catch (error) {
                    console.log(error)
                    resolve([]);
                }
            })
        },

        //后台更改价格重新拉取数据
        getGoodsDetails(ids){
            return new Promise(async resolve => {
                let param = {}
                param.skus = ids
                goodsHandler.getListBySkus(param).then(res => {
                    if (res.state == 200 && res.data.length > 0){
                        resolve(res.data)
                    } else {
                        resolve([])
                    }
                }).catch(e => {
                    resolve([]);
                    console.error('getGoodsDetails error! ', e)
                })
            })
        }
        /*====================更新装修商品实时数据 end======================= */
    }
}