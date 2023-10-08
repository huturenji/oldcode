/**
 * 客户端长时间不操作（120分钟）退出程序，
 */
class IdleWatcher{
    constructor(){
        this.startTime = 0;
        this.KEY = 'mall_lastActiveTime';
        this.MAX_IDLE_TIME = 120 * 60;//最大空闲时间，单位：秒
        this.LOGOUT_FLAG_KEY = 'mall_logout';
    }

    /**
     * 标识启动时间
     * @param {*} timestamp 
     */
    start(timestamp){
        this.clear();
        this.startTime = timestamp || 0;
    }

    /**
     * 标记活动时间
     * @param {*} timestamp 
     */
    invoke(timestamp = (new Date()).getTime()){
        localStorage.setItem(this.KEY, timestamp);
    }

    /**
     * 是否超时
     */
    checkTimeout(){
        let lastActiveTime = localStorage.getItem(this.KEY) || this.startTime;//如果没有登录后没有操作过，则用启动时间计算
        if ((new Date()).getTime() - lastActiveTime >= this.MAX_IDLE_TIME*1000){
            this.clear();
            this.setTimeoutFlag()
            return true;
        }
        return false;
    }

    /**
     * 清理缓存
     */
    clear(){
        localStorage.removeItem(this.KEY);
    }

    /**
     * 清理标记位
     */
    clearTimeoutFlag(){
        sessionStorage.removeItem(this.LOGOUT_FLAG_KEY);
    }

    /**
     * 获取超时标记位
     */
    getTimeoutFlag(){
        sessionStorage.getItem(this.LOGOUT_FLAG_KEY);
    }

    /**
     * 设置超时标记位
     */
    setTimeoutFlag(){
        sessionStorage.setItem(this.LOGOUT_FLAG_KEY, 1);
    }
}

export default new IdleWatcher();