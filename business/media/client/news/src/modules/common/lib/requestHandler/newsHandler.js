import base from './base';
import injectErrorCode from '../errorCodeHandler/news.js';
// import extendUtils from 'common/lib/utils';
class newsHandler extends base{
    constructor(){
        //注入请求的全局配置
        injectErrorCode();
        super(); 
    }
    async getChannel(){
        return this.request('/channel/v1/getChannel',{channelId: this.channelId}, {method: 'get'});
    }
    /**
     * 获取频道配置信息
     * @returns 
     */
    getChannelAccessConfig () {
        return this.request('/channel/v1/getAccessConfig', {}, {method:'get'});
    }
    /**
     * 获取热搜
	 * @param {*} param 
    */
    hotSearchKeyword(param){
        return this.request('/content/v1/listHotKeyword', param);
    }
    /**
     * 获取资讯详情
	 * @param {*} param 
    */
    getNewsDetail(param, httpConfig){
        return this.request('/content/v1/getArticle', param, Object.assign({method:'get'}, httpConfig));
    }
    /**
     * 获取资讯详情
	 * @param {*} param 
    */
    getTopSpecification(param){
        return this.request('/content/v1//getTopSpecification', param, {method:'get'});
    }
    /**
     * 获取置顶资讯列表
	 * @param {*} param 
    */
    getTopNewsList(param){
        return this.request('/content/v1/listToppingArticle',param);
    }
    /**
     * 获取资讯列表
	 * @param {*} param 
    */
    getNewsList(param){
        return this.request('/content/v1/listArticle',param);
    }
    
    /**
     * 举报资讯
	 * @param {*} param 
    */
    reportNews(param){
        return this.request('/content/v1/reportArticle',param);
    }

    /**
     * 保存用户点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录LIKE-赞 HATE-踩 FAVORITE-收藏 HISTORY-历史记录 UNLIKE-不喜欢（不感兴趣）
	 * @param {*} param 
    */
    addRecord(param){
        return this.request('/customer-profile/v1/addRecord',param);
    }
    /**
     * 取消用户点赞、踩、收藏、浏览或不喜欢（不感兴趣）的记录LIKE-赞 HATE-踩 FAVORITE-收藏 HISTORY-历史记录 UNLIKE-不喜欢（不感兴趣）
	 * @param {*} param 
    */
    deleteRecord(param){
        return this.request('/customer-profile/v1/deleteRecord',param);
    }
    /**
     * 查询用户资讯私有信息，是否点赞、是否点踩、是否收藏
	 * @param {*} param 
    */
    getNewsUserPrivate(param){
        return this.request('/customer-profile/v1/listAction',param);
    }
    /**
     * 获取用户频道
     * @param {*} param 
     */
    getMyChannels(param){
        return this.request('/customer-profile/v1/getUserCategory',param);
    }
    /**
     * 保存用户频道
     * @param {*} param 
     */
    updateChannel(param){
        return this.request('/customer-profile/v1/updateUserCategory', param);
    }
    /**
     * 获取我的页面涉及的我的收藏/我的点赞/和阅读历史的数量
     * @param {*} param 
     */
    getPersonalNums(param){
        return this.request('/customer-profile/v1/recordCount',param);
    }
    /**
     * 获取我的收藏/我的点赞/我的阅读历史列表 此处通过参数区分
     * @param {*} param 
     */
    getRecord(param){
        return this.request('/customer-profile/v1/listRecord',param);
    }

    /**
     * 获取所有频道列表
     * @param {*} param 
     */
    getAllChannels(param){
        return this.request('/category/v1/listCategory',param);
    }
    /**
     * 获取行业网站资源列表
     * @param {*} param 
     */
    listAppIndustrySite(param){
        return this.request('/category/v1/searchIndustrySite',param);
    }
    /**
     * 获取行业网站资源列表
     * @param {*} param 
     */
    getWowList(param){
        return this.request('/customer-profile/v1/listUser',param);
    }
}
export default new newsHandler();