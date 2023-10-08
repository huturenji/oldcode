import base from './base';
import injectErrorCode from '../errorcodehandler/bosspay.js';
class virtualHandler extends base {
    constructor() {
        super();
        injectErrorCode()
        this.httpConfigPost = 'post'
        this.httpConfigGet = 'get'
    }

    setBaseUrl(type) {
        console.log(type)
        this.baseUrl = "/virtualsupplier/config"
    }
    /* eslint-disable */

    apiRequest(url, param, method, loadFile = false, headerObj = {}, timeout, notAuth) {
        return this.sendApiRequest(url, param, method, headerObj = {}, timeout, true, true, loadFile);
    }
    /* eslint-enable */
    
    //查询京东vp通用配置
    queryConfig(params) {
        return this.apiRequest(this.baseUrl + '/query', params, this.httpConfigPost)
    }

    //设置京东vp通用配置
    updateConfig(params) {
        return this.apiRequest(this.baseUrl, params, this.httpConfigPost)
    }

    //查询京东vp库存配置
    queryStockById(params) {
        return this.apiRequest(this.baseUrl + '/getNewStockById/query', params, this.httpConfigPost)
    }

    //设置京东vp库存配置
    updateStockById(params) {
        return this.apiRequest(this.baseUrl + '/getNewStockById/update', params, this.httpConfigPost)
    }

    //删除京东vp库存配置
    delStockById(params) {
        return this.apiRequest(this.baseUrl + '/getNewStockById/del', params, this.httpConfigPost)
    }

    //查询京东vp上下架配置
    querySkuState(params) {
        return this.apiRequest(this.baseUrl + '/skuState/query', params, this.httpConfigPost)
    }

    //设置京东vp上下架配置
    updateSkuState(params) {
        return this.apiRequest(this.baseUrl + '/skuState/update', params, this.httpConfigPost)
    }

    //删除京东vp上下架配置
    delSkuState(params) {
        return this.apiRequest(this.baseUrl + '/skuState/del', params, this.httpConfigPost)
    }

    //查询京东vp价格配置
    querySellPrice(params) {
        return this.apiRequest(this.baseUrl + '/SellPrice/query', params, this.httpConfigPost)
    }

    //设置京东vp价格配置
    updateSellPrice(params) {
        return this.apiRequest(this.baseUrl + '/SellPrice/update', params, this.httpConfigPost)
    }

    //删除京东vp价格配置
    delSellPrice(params) {
        return this.apiRequest(this.baseUrl + '/SellPrice/del', params, this.httpConfigPost)
    }

    //查询京东vp限售配置
    querySkuSellArea(params) {
        return this.apiRequest(this.baseUrl + '/SkuSellArea/query', params, this.httpConfigPost)
    }

    //设置京东vp限售配置
    updateSkuSellArea(params) {
        return this.apiRequest(this.baseUrl + '/SkuSellArea/update', params, this.httpConfigPost)
    }

    //删除京东vp限售配置
    delSkuSellArea(params) {
        return this.apiRequest(this.baseUrl + '/SkuSellArea/del', params, this.httpConfigPost)
    }

    //设置苏宁的基础地址
    setBaseUrlSN(type) {
        this.type = type
        this.baseUrl = "/virtualsupplier/snConfig"
    }

    //查询苏宁vp通用配置
    querysnConfig(params) {
        return this.apiRequest(this.baseUrl + '/snConfig/query', params, this.httpConfigPost)

    }

    //更新苏宁vp通用配置
    updatesnConfig(params) {
        return this.apiRequest(this.baseUrl + '/snConfig', params, this.httpConfigPost)

    }

    //查询苏宁vp库存配置
    querysnStock(params) {
        return this.apiRequest(this.baseUrl + '/skuStockConfig/query', params, this.httpConfigPost)
    }

    //查询苏宁vp库存配置
    delsnStock(params) {
        return this.apiRequest(this.baseUrl + '/skuStockConfig/del', params, this.httpConfigPost)
    }

    //更新苏宁vp库存配置
    updatesnSkuStock(params) {
        return this.apiRequest(this.baseUrl + '/skuStockConfig', params, this.httpConfigPost)
    }

    //查询苏宁vp上下架状态配置
    querysnSkuState(params) {
        return this.apiRequest(this.baseUrl + '/skuStateConfig/query', params, this.httpConfigPost)
    }

    //更新苏宁vp上下架状态配置
    updatesnSkuState(params) {
        return this.apiRequest(this.baseUrl + '/skuStateConfig', params, this.httpConfigPost)
    }

    //删除苏宁vp上下架状态配置
    delsnSkuState(params) {
        return this.apiRequest(this.baseUrl + '/skuStateConfig/del', params, this.httpConfigPost)
    }

    //查询苏宁vp价格配置
    querysnSkuPrice(params) {
        return this.apiRequest(this.baseUrl + '/skuPriceConfig/query', params, this.httpConfigPost)
    }

    //更新苏宁vp价格配置
    updatesnSkuPrice(params) {
        return this.apiRequest(this.baseUrl + '/skuPriceConfig', params, this.httpConfigPost)
    }

    //删除苏宁vp价格配置
    delsnSkuPrice(params) {
        return this.apiRequest(this.baseUrl + '/skuPriceConfig/del', params, this.httpConfigPost)
    }

    //查询苏宁vp限售配置
    querysnSellArea(params) {
        return this.apiRequest(this.baseUrl + '/skuSellAreaConfig/query', params, this.httpConfigPost)
    }

    //更新苏宁vp限售配置
    updatesnSellArea(params) {
        return this.apiRequest(this.baseUrl + '/skuSellAreaConfig', params, this.httpConfigPost)
    }

    //删除苏宁vp限售配置
    delsnSellArea(params) {
        return this.apiRequest(this.baseUrl + '/skuSellAreaConfig/del', params, this.httpConfigPost)
    }

    //查询苏宁不在商品池配置
    querysnNotINPool(params) {
        return this.apiRequest(this.baseUrl + '/skuNotInPoolConfig/query', params, this.httpConfigPost)
    }

    //更新苏宁不在商品池配置
    updatesnNotINPool(params) {
        return this.apiRequest(this.baseUrl + '/skuNotInPoolConfig', params, this.httpConfigPost)
    }

    //删除苏宁不在商品池配置
    delsnNotINPool(params) {
        return this.apiRequest(this.baseUrl + '/skuNotInPoolConfig/del', params, this.httpConfigPost)
    }

    //西域的虚拟供应商
    // eslint-disable-next-line no-unused-vars
    setBaseUrlSY(type) {
        this.baseUrl = "/virtualsupplier/ehsyconfig"
    }

    //查询西域vp通用配置
    queryConfigSY(params) {
        return this.apiRequest(this.baseUrl + '/query', params, this.httpConfigPost)
    }

    //设置西域vp通用配置
    updateConfigSY(params) {
        return this.apiRequest(this.baseUrl + '/add', params, this.httpConfigPost)
    }

    //查询西域vp库存配置
    queryStockByIdSY(params) {
        return this.apiRequest(this.baseUrl + '/getNewStockById/query', params, this.httpConfigPost)
    }

    //设置西域vp库存配置
    updateStockByIdSY(params) {
        return this.apiRequest(this.baseUrl + '/getNewStockById/update', params, this.httpConfigPost)
    }

    //删除西域vp库存配置
    delStockByIdSY(params) {
        return this.apiRequest(this.baseUrl + '/getNewStockById/del', params, this.httpConfigPost)
    }

    //查询西域vp上下架配置
    querySkuStateSY(params) {
        return this.apiRequest(this.baseUrl + '/skuState/query', params, this.httpConfigPost)
    }

    //设置西域vp上下架配置
    updateSkuStateSY(params) {
        return this.apiRequest(this.baseUrl + '/skuState/update', params, this.httpConfigPost)
    }

    //删除西域vp上下架配置
    delSkuStateSY(params) {
        return this.apiRequest(this.baseUrl + '/skuState/del', params, this.httpConfigPost)
    }

    //查询西域vp价格配置
    querySellPriceSY(params) {
        return this.apiRequest(this.baseUrl + '/SellPrice/query', params, this.httpConfigPost)
    }

    //设置西域vp价格配置
    updateSellPriceSY(params) {
        return this.apiRequest(this.baseUrl + '/SellPrice/update', params, this.httpConfigPost)
    }

    //删除西域vp价格配置
    delSellPriceSY(params) {
        return this.apiRequest(this.baseUrl + '/SellPrice/del', params, this.httpConfigPost)
    }

    //查询西域vp限售配置
    querySkuSellAreaSY(params) {
        return this.apiRequest(this.baseUrl + '/SkuSellArea/query', params, this.httpConfigPost)
    }

    //设置西域vp限售配置
    updateSkuSellAreaSY(params) {
        return this.apiRequest(this.baseUrl + '/SkuSellArea/update', params, this.httpConfigPost)
    }

    //删除西域vp限售配置
    delSkuSellAreaSY(params) {
        return this.apiRequest(this.baseUrl + '/SkuSellArea/del', params, this.httpConfigPost)
    }

    // 查可售查询接口(通过导入文件查)
    queryFileDetail(params) {
        return this.sendApiRequest('/xuanpin/v1/importMarketability', params, this.httpConfigPost)
    }

    // 查可售查询接口(通过输入sku列表查)
    querySkuListDetail(params) {
        return this.sendApiRequest('/xuanpin/v1/listMarketability', params, this.httpConfigPost)
    }

    // 查可售导出接口
    getDownloadUrl(params) {
        return this.sendApiRequest('/xuanpin/v1/exportMarketability', params, this.httpConfigGet)
    }

    getProvince(params) {
        return this.sendApiRequest('/address/v1/getProvince', params, this.httpConfigGet)
    }

    getCity(params) {
        return this.sendApiRequest('/address/v1/getCity', params, this.httpConfigGet)
    }

    getDistrict(params) {
        return this.sendApiRequest('/address/v1/getDistrict', params, this.httpConfigGet)
    }

    getTown(params) {
        return this.sendApiRequest('/address/v1/getTown', params, this.httpConfigGet)
    }

    // 新建查询京东价格/优惠任务
    addTask(params) {
        return this.sendApiRequest('/crawinfo/v1/addTask', params, this.httpConfigPost)
    }

    // 删除查询京东价格/优惠任务
    deleteTask(params) {
        return this.sendApiRequest('/crawinfo/v1/deleteTask', params, this.httpConfigGet)
    }

    // 查询京东价格/优惠任务列表
    listTask(params) {
        return this.sendApiRequest('/crawinfo/v1/listTask', params, this.httpConfigGet)
    }

    // 新建查询京东价格/优惠任务对应的商品列表
    listTaskSkuInfo(params) {
        return this.sendApiRequest('/crawinfo/v1/listTaskSkuInfo', params, this.httpConfigGet)
    }

    // 导出任务下商品信息数据
    exportTaskSkuInfo(params) {
        return this.sendApiRequest('/crawinfo/v1/exportTaskSkuInfo', params, this.httpConfigGet)
    }

    // 启用/停用任务
    setTaskState(params) {
        return this.sendApiRequest('/crawinfo/v1/setTaskState', params, this.httpConfigPost)
    }
}

export default new virtualHandler();