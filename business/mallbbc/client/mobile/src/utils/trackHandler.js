/**
 * 日期：2022年12月2日
 * 对外提供的url加上参数trackid，参数值的格式用英文冒号分隔 channelId:origin，例如海峡银行 ：trackid=5125:1,其中5125表示渠道id，1表示来源的扫描
 * 如渠道id与当前app不一致则提示请使用对应的app打开
*/
import { isNotEmpty, setUserParamOnUrl} from '@/utils/common.js';

class TrackHandler {
    constructor(){
        this.trackParamsEnum = ['channelId','origin'];
    }

    /**
     * 初始化trackHandler
     */
    initTracker(){
        //数据埋点上报
        return new Promise(async resolve => {
            try {
                let isPC = SnUtils.isPC();
                let channelId = await sinosdk.sino.getChannelId();
                let urlParam = SnUtils.getUrlParams();
                if (isNotEmpty(channelId) && isNotEmpty(urlParam.trackid) && urlParam.trackid !=''){
                    let trackObj = this.getTracker();
                    setUserParamOnUrl({origin: trackObj.origin});//追加到url上
                    //只在手机端做渠道和url追踪判断
                    if (!isPC && trackObj.channelId != channelId){
                        resolve({res:true,channelId:trackObj.channelId});
                    } else {
                        resolve({res:false});
                    }
                } else {
                    resolve({res:false});
                }
    
            } catch (error) {
                console.log('初始化initTracker失败',error)
                resolve({res:false})
            }
        })
    }

    /**
     * 获取trackObj
     */  
    getTracker(){
        let urlParam = SnUtils.getUrlParams();
        let trackObj = {};
        if (isNotEmpty(urlParam.trackid) && urlParam.trackid !=''){
            urlParam.trackid.split(':')?.forEach((item,index)=>{
                if (item.endsWith('/')){
                    item = item.substring(0, item.length - 1)
                }
                trackObj[this.trackParamsEnum[index]] = item;
            });
        }
        return trackObj;
    }

}
export default new TrackHandler();
