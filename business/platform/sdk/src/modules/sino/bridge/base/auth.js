import * as bridge from "sino/bridge/lib/handler";
export default {
    /**
     * 授权：获取accessToken(原名getAccessTokenFunction)
     * @param {*} data 
     * @returns 
     */
    getAccessToken(data){
        return bridge.callHandler('GetAccessTokenFunction', data);
    },

    /**
     * 授权：获取idToken（原名getIdTokenFunction）
     * @param {*} data 
     * @returns 
     */
    getIdToken(data){
        return bridge.callHandler('GetIdTokenFunction', data);
    },

    /**
     * 获取伴正事用户信息(原名getUserInfoFunction)
     * @param {*} data 
     * @returns 
     */
    getUserInfo(data){
        return bridge.callHandler('GetUserInfoFunction', data);
    },

    /**
     * 获取签名（weboa上专用）
     * @returns 
     */
    getSign(){
        return bridge.callHandler('GetSignFunction');
    }
}