import Vue from 'vue'
import store from '@/store'
import request from '@/utils/request'
import config from '@/common/lib/config'
import {moduleGate} from '@/utils/auth.js'
import {
    hasMoreByPageCount,
    checkPaginationHasMore,
    checkSpace,
    replaceConByPosition,
    getPartNumber,
    checkMobile,
    checkPwd,
    loginGoPage,
    formatW,
    checkEmail,
    diyNavTo,
    setCookie,
    setStoreIsCookie,
    isWeiXinBrower,
    weiXinBrowerShare,
    weiXinAppShare,
    getQueryVariable,
    weiXinBrowerPay,
    bbcCommonTip,
    getLoginClient,
    formatPercent,
    setPointIsCookie,
    frequentyleClick,
    back,
    getCurLanguage,
    isShowTime,
    formatChatTime,
    checkTel,
    setStorage,
    setStorageSync,
    getStorage,
    getStorageSync,
    removeStorage,
    removeStorageSync,
    setSession,
    getSession,
    removeSession,
    assignUrlParam,
    isTransferPay,
    openBBCPage,
    openCustomerServicePage
} from '@/utils/common.js'
import {bbcStatEvent} from '@/utils/stat.js'

const msg = (title, duration = 1500, mask = false, icon = 'none') => {
    //统一提示方便全局修改
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}

const prePage = () => {
    let pages = getCurrentPages();
    let pre_page = pages[pages.length - 2];
    let page = pre_page.$vm;
    // #ifdef H5
    page = pre_page;
    // #endif
    return page;
}

//未见使用
// const updateToken = () => {
//     App.methods.updateAccessToken();
// }


let globalMethod = {}

globalMethod.$fire = new Vue();
globalMethod.$store = store;
globalMethod.$request = request;
globalMethod.$hasMoreByPageCount = hasMoreByPageCount;
globalMethod.$checkPaginationHasMore = checkPaginationHasMore;
globalMethod.$checkSpace = checkSpace;
globalMethod.$replaceConByPosition = replaceConByPosition;
globalMethod.$getPartNumber = getPartNumber;
globalMethod.$checkMobile = checkMobile;
globalMethod.$checkPwd = checkPwd;
globalMethod.$loginGoPage = loginGoPage;
globalMethod.$formatW = formatW;
globalMethod.$checkEmail = checkEmail;
globalMethod.$diyNavTo = diyNavTo;
globalMethod.$setCookie = setCookie;
globalMethod.$formatPercent = formatPercent;
globalMethod.$setStoreIsCookie = setStoreIsCookie;
globalMethod.$setPointIsCookie = setPointIsCookie;
globalMethod.$frequentyleClick = frequentyleClick;
globalMethod.$L = getCurLanguage;
globalMethod.$moduleGate = moduleGate;
globalMethod.$api = {
    msg,
    prePage
};
globalMethod.$isWeiXinBrower = isWeiXinBrower;
globalMethod.$weiXinBrowerShare = weiXinBrowerShare;
globalMethod.$weiXinAppShare = weiXinAppShare;
globalMethod.$getQueryVariable = getQueryVariable;
globalMethod.$weiXinBrowerPay = weiXinBrowerPay;
globalMethod.$bbcCommonTip = bbcCommonTip;
globalMethod.$getLoginClient = getLoginClient;
globalMethod.$back= back;
globalMethod.$isShowTime = isShowTime;
globalMethod.$formatChatTime = formatChatTime;
globalMethod.$bbcStatEvent = bbcStatEvent;
globalMethod.$checkTel = checkTel;
globalMethod.$setStorage = setStorage;
globalMethod.$setStorageSync = setStorageSync;
globalMethod.$getStorage = getStorage;
globalMethod.$getStorageSync = getStorageSync;
globalMethod.$removeStorage = removeStorage;
globalMethod.$removeStorageSync = removeStorageSync;
globalMethod.$setSession = setSession;
globalMethod.$getSession = getSession;
globalMethod.$removeSession = removeSession;
globalMethod.$config = config;
globalMethod.$assignUrlParam = assignUrlParam;
globalMethod.$isTransferPay = isTransferPay;
globalMethod.$openBBCPage = openBBCPage;
globalMethod.$openCustomerServicePage = openCustomerServicePage;

export default globalMethod;