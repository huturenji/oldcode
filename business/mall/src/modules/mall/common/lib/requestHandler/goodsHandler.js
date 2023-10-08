import base from './base';
import extendUtils from '../utils';
import Config from 'common/lib/config.js';
import injectErrorCodeFavorite from '../errorCodeHandler/favorite';
import injectErrorCodeGoods from '../errorCodeHandler/goods';
class GoodsHandler extends base {
    constructor() {
        super();
        
        injectErrorCodeFavorite();
        injectErrorCodeGoods();
    }

    /**
     * 设置用户参数
     * @param {*} param 
     */
    setUserInfo(param){
        return Object.assign({}, param, {
            userId: this.userId
        })
    }

    /**
     * 设置cityId参数
     * @param {*} param  
     */
    async setCityId(param){
        
        if(!!param && !!param.cityId){
            return param;
        }else{
            return Object.assign({}, param, {
                cityId: await this.getCityId()
            })
        }
    }

    /**
     * 设置addressId参数
     * @param {*} param  
     */
    async setAddressId(param){
        let addressId = await this.getAddressId();
        let arr = addressId.split('/');
        let areaId1 = arr[0] || '';
        let areaId2 = arr[1] || '';
        let areaId3 = arr[2] || '';
        let areaId4 = arr[3] || '';
       
        return Object.assign({}, param, {
            areaId1, areaId2, areaId3, areaId4
        })
        
    }

    /**
     * 获取当前cityId的方法
     */	
    async getCityId(){
        let cityCode = '';
        await extendUtils.authInterceptor(); //等授权完成后，再进行后续的操作
        if(!!extendUtils.getStorage(this.primaryKey+'_cityId')){
            cityCode = extendUtils.getStorage(this.primaryKey+'_cityId');
        }else{
            let supplierId = this.supplierId;
            if(!!!supplierId){ //如果supplierId没有值的话，此时从urll面取值
                supplierId = extendUtils.getUserPara('supplierId');
            }
            cityCode = Config.SUPPLIER_Map[supplierId].defaultCityId;
        } 
        return cityCode;
    }

    /**
     * 获取当前addressId的方法
     */	
     async getAddressId(){
        let addressId = '';
        await extendUtils.authInterceptor(); //等授权完成后，再进行后续的操作
        if(!!extendUtils.getStorage(this.primaryKey+'_addressId')){
            addressId = extendUtils.getStorage(this.primaryKey+'_addressId');
        }else{
            let supplierId = this.supplierId;
            if(!!!supplierId){ //如果supplierId没有值的话，此时从urll面取值
                supplierId = extendUtils.getUserPara('supplierId');
            }
            addressId = Config.SUPPLIER_Map[supplierId].defaultAddressId;
        } 
        return addressId;
    }


    /******************************商品收藏部分 ***********************************/
    /**
     * 获取收藏列表的数据
     */
    async getFavoriteList(param) {
        return this.request('/follow/v1/listItem', await this.setCityId(param));
    }

    /**
     * 获取单个商品收藏的数据
     */
    getFavorite(param) {
        return this.request('/follow/v1/getItemDetail', param);
    }

    /**
     * 单个和批量新增商品收藏
     */
     async addFavoriteList(param) {
        return this.request('/follow/v1/addItem', await this.setCityId(param));
    }

    /**
     * 单个和批量删除商品收藏
     */
    deleteFavorites(param) {
        return this.request('/follow/v1/deleteItem', param);
    }


    /**
     * 获取常购清单的列表
     * @param {*} param
     */
    async getPurchasedList(param) {
        return []
    }

    /**
     * 查询商品分类的接口
     */
    getCategoryList(param) {
        return this.request('/product/v1/getCategories', param, Object.assign({
            noSSOFlag: true,
            method: 'get',
        }));
    }

    /**
     * 查询商品列表
     */
    async getProductList(param) {
        return this.request('/product/v1/search', await this.setAddressId(param), Object.assign({
            noSSOFlag: true,
            method: 'post',
            noZipFlag: true
        }));
    }

    /**
     * 查询商品详情
     */
     async getProductDetail(param) {
        return this.request('/product/v1/getDetail', await this.setCityId(param), Object.assign({
            noSSOFlag: true,
            method: 'post',
            noZipFlag: true
        }));
    }
    /**
     * 查询商品详情摘要
     */
    async getProductSimpleDetail(param) {
        return this.request('/product/v1/getSummary', await this.setCityId(param), Object.assign({
            noSSOFlag: true,
            method: 'post',
            noZipFlag: true
        }));
    }

    /**
     * 查询商品销售详情
     */
    getProductSpec(param) {
        return this.request('/product/v1/getSpec', param, Object.assign({
            noSSOFlag: true,
            method: 'post',
            noZipFlag: true
        }));
    }
    /**
     * 查询同类商品
     */
    getProductSpecList(param) {
        return this.request('/product/v1/getSimilar', param, {
            noSSOFlag: true,
            method: 'post',
            noZipFlag: true
        });
    }
    /**
     * 批量查询商品售价
     */
    async getlistUnitPrice(param) {
        return this.request('/product/v1/getRetailPrices', await this.setCityId(param), Object.assign({
            noSSOFlag: true,
            method: 'post',
            noZipFlag: true
        }));
    }
    /**
     * 批量查询供应商价格
     */
    getSupplierPrices(param) {
        return this.request('/product/v1/getPrice', param);
    }

    /**
     * 获取商品的库存
     */
    getlistStock(param) {
        return this.request('/product/v1/getStocks', this.setUserInfo(param));
    }   

    /**
     * 获取商品的赠品和附件
     */
    getGoodsGift(param) {
        return this.request('/product/v1/listSkuGift', this.setUserInfo(param));
    }   

    /**
     * 获取商品是否区域受限
     */
    checkAreaLimit(param) {
        return this.request('/product/v1/checkAreaLimit', this.setUserInfo(param));
    }    

    /**
     * 获取商品首页的推荐
     */
    getRecommendList(param) {
        return this.request('/product/v1/listRecommendProduct', this.setUserInfo(param));
    }    
    /**
     * 获取商品首页的推荐
     */
    getRecommendBrandList(param) {
        return this.request('/product/v1/listRecommendBrand', this.setUserInfo(param));
    }    
    /**
     * 搜索关键字补全
     */
    searchDropdown(param) {
        return this.request('/product/v1/searchDropdown', this.setUserInfo(param), {
            method: 'get',
        });
    }  

    /**
     * 搜索关键字补全 京东的接口 
     */
    getdropdownJd(data) {
        let param = {
            url: 'https://wq.jd.com/bases/searchdropdown/getdropdown',
            method: 'get',
            responseType: 'text',
            data,
        }
        return extendUtils.httpRequest(param);
    }  

    /**
     * 搜索关键字补全 苏宁的接口 
     */
    getdropdownSn(data) {
        let url = `https://ds.suning.com/ds/his/new/-${data.key}-0-2-autoComplateCallback.json`
        let param = {
            url: url,
            method: 'get',
            responseType: 'text',
            data,
        }
        return extendUtils.httpRequest(param);
    }    

    getComment(param={}) {
        param.callback= "fetchJSON_comment98";
        param.fold= 1;
        param.isShadowSku= 0;
        param.sortType= param.sortType || 5;
        param.pageSize= 10;
        param.currentSku = !!param.currentSku;

        return new Promise((reslove,reject)=>{
            this.request('/product/v1/getComment',param, {
                noSSOFlag: true,
                method: 'get'
            }).then(res=>{
                if(res && res.result){
                    let result=  res.result
                    result = result.replace("fetchJSON_comment98(","")
                    result = result.replace(");","")
                    res.result = JSON.parse(result)                    
                }
                reslove(res)                
            }).catch(e=>{
                reject(e)
            })
        })
    }    
}

export default new GoodsHandler(); 
