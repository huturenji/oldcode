import base from "./base";
import injectErrorCode from '../errorcodehandler/pricecompare.js';

class pricecomparehandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    //获取商品列表
    listGood(param) {
        return this.sendApiRequest('/search/v1/searchForTag', param);
    }

    //获取联盟列表
    listUnions(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/list', param, 'GET');
    }

    //获取标签列表
    listPriceTag(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/page', param);
    }

    //获取标签详情
    getPriceTag(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/detail', param, 'GET');
    }

    //新增标签
    addPriceTag(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/add', param);
    }

    //编辑标签
    updatePriceTag(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/update', param);
    }

    //删除标签
    delPriceTag(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/delete', param, 'POST');
    }

    //获取vop的分类树
    getCategories(param) {
        return this.sendApiRequest('/product-pool/v1/listCategoryTree', param, 'GET', null, 60 * 1000);
    }

    //全量商品库中查详情接口
    getDetailBySkuInfo(param) {
        return this.sendApiRequest('/product/v1/getDetailBySkuInfo', param);
    }

    // 确认商品组
    confirmGroup(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/confirmGroup', param, 'POST');
    }

    // 领取未确认的标签组
    receiveGroup(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/receiveGroup', param, 'POST');
    }

    // 页查询待确认商品标签信息
    pageUnconfirmed(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/pageUnconfirmed', param, 'POST');
    }

    // 分页查询已确认商品标签信息
    pageConfirmed(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/pageConfirmed', param, 'POST');
    }

    // 分页查询操作记录
    listOperationRecord(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/listOperationRecord', param, 'GET');
    }

    //编辑已确认标签
    updateConfirmed(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/updateConfirmed', param);
    }

    // 合并已存在商品标签信息
    merge(param) {
        return this.sendApiRequest('/product-group/v1/skuGroup/merge', param, 'POST');
    }

}

export default new pricecomparehandler();
