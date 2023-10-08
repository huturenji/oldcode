import base from "./base";
import injectErrorCode from '../errorcodehandler/channel.js';

class productHandler extends base {
    constructor() {
        super();
        injectErrorCode()
    }

    getPriceRule(param) {
        return this.sendApiRequest('/rule/v1/getPriceRule', param, "GET");
    }

    listSupplier(param) {
        return this.sendApiRequest('/supplieraccess/v1/supplier/list', param, 'GET');
    }

    addPriceRule(param) {
        return this.sendApiRequest('/rule/v1/addPriceRule', param);
    }

    updatePriceRule(param) {
        return this.sendApiRequest('/rule/v1/updatePriceRule', param);
    }

    productSearch(param) {
        return this.sendApiRequest('/search/v1/searchForOperation', param, 'GET');
    }

    getProductPrices(param) {
        return this.sendApiRequest('/rule/v1/calculateProductPrice', param);
    }

    listPriceRule(param) {
        return this.sendApiRequest('/rule/v1/listPriceRule', param);
    }

    listDetailWithSupplierInfo(param) {
        return this.sendApiRequest('/product/v1/listDetailWithSupplierInfo', param);
    }

    getOffShelfRule(param) {
        return this.sendApiRequest('/rule/v1/getOffShelfRule', param, 'GET');
    }

    getCategoryList(param) {
        return this.sendApiRequest('/xuanpin/v1/pullCategory', param, 'POST');
    }
    
    getSelectionPool(param) {
        return this.sendApiRequest('/xuanpin/v1/search', param, 'POST');
    }

    getLowestPrice(param) {
        return this.sendApiRequest('/xuanpin/v1/exportLowestPrice', param, 'POST');
    }

    getLowestPriceBySku(param) {
        return this.sendApiRequest('/xuanpin/v1/exportLowestPriceList', param, 'POST');
    }
    
    getExportSkuInfo(param) {
        return this.sendApiRequest('/xuanpin/v1/exportSkuInfo', param, 'POST');
    }
    
    exportSkuInfoBySkuList(param) {
        return this.sendApiRequest('/xuanpin/v1/exportSkuInfoBySkuList', param, 'POST');
    }

    updateCategory(param) {
        return this.sendApiRequest('/xuanpin/v1/updateSkuByCategory', param, 'GET');
    }
    
    getExportInfoList(param) {
        return this.sendApiRequest('/xuanpin/v1/exportInfoList', param, 'POST');
    }

    removeInfoList(param) {
        return this.sendApiRequest('/xuanpin/v1/exportInfoListInfo/removeByIds', param, 'POST');
    }

    getExportJobInfoList(param) {
        return this.sendApiRequest('/xuanpin/v1/exportLowestPriceJob/exportInfoList', param, 'POST');
    }

    exportJobStatistics(param) {
        return this.sendApiRequest('/ppricehub/v1/statistics', param, 'POST');
    }

    getExportFileListByInfoId(param) {
        return this.sendApiRequest('/xuanpin/v1/exportFileListByInfoId', param, 'POST');
    }

    getCategories(param) {
        return this.sendApiRequest('/product-pool/v1/listCategoryTree', param, 'GET', null, 60*1000);
    }

    listChannel(param) {
        return this.sendApiRequest('/channel/v1/channelList', param, 'GET');
    }

    addOffShelfRule(param) {
        return this.sendApiRequest('/rule/v1/addOffShelfRule', param);
    }

    updateOffShelfRule(param) {
        return this.sendApiRequest('/rule/v1/updateOffShelfRule', param);
    }  

    enableRule(param) {
        return this.sendApiRequest('/rule/v1/enableRule', param);
    }

    listRuleLogs(param) {
        return this.sendApiRequest('/rule/v1/listRuleLogs', param);
    }

    listOffShelfRule(param) {
        return this.sendApiRequest('/rule/v1/listOffShelfRule', param);
    }

    deleteOffShelfRule(param) {
        return this.sendApiRequest('/rule/v1/deleteOffShelfRule', param, 'GET');
    }

    getGatherTaskList(param) {
        return this.sendApiRequest('/pprocesshub/v1/taskList', param, 'POST');
    }

    copyGatherTask(param) {
        return this.sendApiRequest('/pprocesshub/v1/taskCopy', param, 'POST');
    }

    endTask(param) {
        return this.sendApiRequest('/pprocesshub/v1/endTask', param, 'GET');
    }

    delTask(param) {
        return this.sendApiRequest('/pprocesshub/v1/delTask', param, 'GET');
    }

    getScheduleList(param) {
        return this.sendApiRequest('/pprocesshub/v1/scheduleList', param, 'POST');
    }

    endSchedule(param) {
        return this.sendApiRequest('/pprocesshub/v1/endSchedule', param, 'GET');
    }

    delSchedule(param) {
        return this.sendApiRequest('/pprocesshub/v1/delSchedule', param, 'GET');
    }


    /**
   * 设置京东联盟cookie(运营接口)
   */
    addCookie(param) {
        return this.sendApiRequest('/search/v1/addCookie', param);
    }

    /**
   * 查询京东联盟cookie(运营接口)
   */
    getCookie(param) {
        return this.sendApiRequest('/search/v1/getCookie', param, "get");
    }

    // 实时搜索
    getSearchProduct(param) {
        return this.sendApiRequest('/xuanpin/v1/searchProduct', param);
    }

    // 实时搜索的商品导出
    exportProduct(param) {
        return this.sendApiRequest('/xuanpin/v1/exportProduct', param);
    }

    // 获取最低价--根据动销库导出
    exportSalesWarehouse(param) {
        return this.sendApiRequest('/xuanpin/v1/exportSalesWarehouse', param);
    }

    // 获取动销库列表
    getSalesWarehouseList(param) {
        return this.sendApiRequest('/xuanpin/v1/sales/page', param);
    }

    // 删除指定动销库
    delSalesWarehouse(param) {
        return this.sendApiRequest('/xuanpin/v1/sales/remove', param);
    }

    // 创建动销库
    createSalesWarehouse(param) {
        return this.sendApiRequest('/xuanpin/v1/sales/create', param);
    }
  
}

export default new productHandler();
