/*
 * @Descripttion: 分享js
 * @version: 
 * @Author: 肖文川
 * @Date: 2021-9-7
 * @LastEditors: xiaowe
 * @LastEditTime: 2021-9-7
 */
class ShareHandler {
    /**
     * 异步获取登录用户名字
     */
    async getUserInfo() {
        return await sinosdk.sino.getUserInfo().then(function(data){
            if (!!data){ //用户存在
                return data;  
            }
        }).catch(()=>{
            return '';
        })
    }

    /**
     * 异步获取appId
     */
    async getAppConfig() {
        return await sinosdk.sino.getAppInfo({'key': 'msgSource'}).then(function(data){
            if (!!data){ //用户存在
                var jsonData = JSON.parse(data.value);
                return jsonData||{};
            }
        }).catch(()=>{
            return {};
        })
    }

    /**
     * 注册第三方分享信息
     * @param json 分享信息
     * @param json 游客header
     */ 
    setThirdShareInfo(shareInfo){
        let that = this;
        try {
            //伴正事分享
            let inApp = SnUtils?.getBizMateVersion();
            if (inApp) {
                that.registerBizmateShare(shareInfo);
            }
            //处理微信分享
            // if (isWeiXinBrower()){
            //     //分享到微信好友mobile提供的方法
            //     weiXinBrowerShare('',shareInfo)
            // }
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * 注册伴正事浏览器网页分享功能的数据
     */
    async registerBizmateShare(shareDate) {  
        let that = this;
        let typeList = ['bizmate','wechat','wechatTimeline','copylink','note'];
        let appInfo = {};
        try {
            appInfo = await that.getAppConfig();
        } catch (error) {
        }
        let appName = '抽奖';
        let appId = '268435729';
        let shareParam = {
            sharingType:'',//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
            title : shareDate.title || '', // 分享标题          
            desc : shareDate.desc || '', // 分享描述           
            link : shareDate.link || '', // 分享链接          
            imgUrl : shareDate.imgUrl || '', // 分享图标,图片绝对地址 
            appId: (appInfo.appId || appId) + '',//小应用Id
            appName: appInfo.appName || appName || '比N家',//小应用名字,无合法appId时使用appName
            contentType : 'link' // 分享类型,music、video或link，不填默认为link
        }  
        let registerListDate = typeList.map((item)=>{
            shareParam.sharingType = item;
            let tempObj = JSON.stringify(shareParam);
            return JSON.parse(tempObj);
        });
        sinosdk.sino.registerShare({dataList:registerListDate}).then(()=>{
        }).catch((e)=>{
            console.log(e)
        });
    } 

    /**
     * 注销伴正事浏览器网页分享功能的数据
     */   
    cancelBizmateShare(){
        try {
            let inApp = SnUtils?.getBizMateVersion?.();
            if (inApp){
                sinosdk.sino.registerShare({dataList:[]}).then(()=>{
                }).catch((e)=>{
                    console.log(e)
                });        
            }
        } catch (error) {
            
        }
    }
}
export default new ShareHandler();
