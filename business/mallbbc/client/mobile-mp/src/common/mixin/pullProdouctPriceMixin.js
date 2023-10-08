import { isEmpty, isNotEmpty } from "@/utils/common";
import stockEnum from '@/common/lib/enum/stock';
import goodsHandler from '@/views/components/goods/handler';
export default {
    data() {
        return {   
         
        }
    },    
    props: {
        /**
         * 获取默认收货地址（单例）
         */
        getDefaultAddress: {
            type: Object,
            default: () => {}
        }
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
            
        // 初始化装修的商品数据
        initDecoGoodsData(item, isFilter = false, filterNoSubstantialGoods = false) {
            let goods = item.data[0];
            if (goods && goods.info && goods.info.length > 0){             
                this.$set(goods, 'pageIndex', 1);
                this.$set(goods, 'totalPage', this.dealGoodsSplit(goods.ids.length).length - 1);
                this.$set(goods, 'done', false);
                this.$set(goods, 'info', []);
                this.$set(goods, 'goodsSplit', this.dealGoodsSplit(goods.ids.length));
                
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
            let goods = item.data[0]
           
            const skus = goods.ids.slice(goods.goodsSplit[goods.pageIndex-1], goods.goodsSplit[goods.pageIndex]);
            if (skus && skus.length > 0){
                if (goods.pageIndex == 1){ //当前tab栏的第一页的时候 显示骨架图
                    this.showSkeletonLoading = true;
                } 
                // 通过接口获取更新和过滤相关的商品数据
                let list = await this.updateGoodsBySkus(skus, item.show_style);
                if(filterNoSubstantialGoods){
                    list = list.filter(item => goodsHandler.isShowJdLable(item))
                }

                // 对是否过滤不可售商品进行判断
                if (isFilter) {
                    list = await this.filterGoodsByAddress(list);
                    goods.info.push(...list)
                } else {
                    goods.info.push(...list)
                    this.updateGoodsByAddress(list) //在pullProdouctPriceMixin中 再更新商品的区域限售和有货无货   
                }
                // 只有查到了数据 再关闭骨架图
                if(goods.info.length > 0){
                    this.showSkeletonLoading = false;
                }
            } else {
                this.showSkeletonLoading = false;
            }

            //当前页数+1
            this.$set(goods, 'pageIndex', ++goods.pageIndex)

            // 如果装修的商品未加载完成，加载下一页
            if (goods.pageIndex <= goods.totalPage) {
                this.getDecoGoodsData(item, isFilter, filterNoSubstantialGoods)
            } else {
                this.showSkeletonLoading = false;
                this.$set(goods, 'done', true); // 说明加载完成
                this.$forceUpdate();
            }
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
                    let defaultAddress = this.getDefaultAddress
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    let newSku = list.map(temp => { if (temp.supplierType == "JD" || temp.supplierType == "EHSY"){ return { sku: temp.sku, num: temp.lowestBuy || 1 } } return null; }).filter(item => isNotEmpty(item)) //只有京东和西域需要校验
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
                            this.$forceUpdate();
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
                    let defaultAddress = this.getDefaultAddress
                    if (isEmpty(defaultAddress)){
                        resolve(list);
                        return;
                    }
                    // 只有京东企业购和西域进行可售性判断
                    let newSku = list.map(temp => { if (temp.supplierType == "JD" || temp.supplierType == "EHSY"){ return { sku: temp.sku, num: temp.lowestBuy || 1 } } return null; }).filter(item => isNotEmpty(item)) //只有京东和西域需要校验
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
        getGoodsDetails(ids, showStyle='bijia'){
            return new Promise(async resolve => {
                let param = {}
                param.includeGroup = false; //是否查询比价的组信息 
                param.skus = ids;
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
        },
    }
}