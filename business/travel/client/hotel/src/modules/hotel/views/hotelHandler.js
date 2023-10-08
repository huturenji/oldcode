/*
 * @Descripttion: 酒店js方法
 * @version: 
 * @Author: xwc
 * @Date: 2019年5月28日16:59:41
 * @LastEditors: yg
 * @LastEditTime: 2019-05-31 10:26:26
 */
let functional = SnTravel.functional;
let {openPage,loadScript,ErrorCodeMap,WhiteList,NoticeType,showToast} = functional;

const ORIGIN = functional.HTTP_CONT.ORIGIN;

/**
 * 英文名显示证件类型
 */
const surnameIDMap = {
    "1":'护照',
    "5": '台胞证',
    "8": '外国人永久居留身份证'
};
/**
 * 引入酒店新的服务端错误码
 * VERINVOICE_MODULE_ID = "01" 
 */
const CheckHotelErrorCodeMap = {
    "46240001": {
        text: '酒店已停用，敬请谅解',
        noticeType: NoticeType.TOAST
    },
    "46010001": {
        text: '信用卡已过有效期，无法下单，请更换其他信用卡重试',
        noticeType: NoticeType.TOAST
    },
    "46010002": {
        text: '当前已过入住时间，请更改查询条件',
        noticeType: NoticeType.TOAST
    },
    "46010003": {
        text:'房间价格变动，下单失败，请重新选购',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010004": {
        text:'该酒店已不可预订，请选择其他酒店',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        // showCode: true,
        noticeType: NoticeType.TOAST//todo 暂用toast
        // useServerMsg:true,
        // serverMsgName:'resultMessage',
    },
    "46010005": {
        text:'剩余房间数不足，下单失败，请重新选购',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010006": {
        text:'该商品预订失败，请重新选购其他商品',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010007": {
        text:'信用卡错误，请重新填写',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010008": {
        text:'该商品预订政策变动，下单失败，请重新选购其他商品',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010009": {
        text:'该商品预订政策变动，下单失败，请重新选购其他商品',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010010": {
        text:'该商品预订失败，请重新选购其他商品',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: NoticeType.TOAST,//todo 暂用toast
        useServerMsg:true,
        serverMsgName:'resultMessage'
    },
    "46010011": {
        text:'该商品预订失败，请重新选购其他商品',
        // noticeType:NoticeType.CONFIRM,
        // bisType:BisType.BACKPAGE,
        showCode: true,
        noticeType: NoticeType.TOAST//todo 暂用toast
    },
    "46010012": {
        text:'姓名只能输入英文或汉字，空格请用“/”代替',
        noticeType:NoticeType.TOAST
    },
    "46010013": {
        text: '网络异常，请稍后重试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46010014": { 
        text: '酒店预订失败，请联系客服',
        noticeType: NoticeType.TOAST,
        showCode: true,
        ignore:true
    },
    "46010015": { 
        text: '订单重复，下单失败，请将原单取消后重新预订',
        noticeType: NoticeType.TOAST
    },
    "46010016": { 
        text: '操作过于频繁，请稍后再试',
        noticeType: NoticeType.TOAST,
        showCode: true
    },
    "46010017": { 
        text: '请填写实际入住客人的真实姓名，确保顺利入住',
        noticeType: NoticeType.TOAST
    },
    "46010018": { 
        text: '乘客姓名/电话未通过供应商黑名单校验',
        noticeType: NoticeType.TOAST
    },
    "46010019": { 
        text: '您无可用的酒店供应商，请联系管理员进行配置',
        noticeType: NoticeType.TOAST
    },
    "46010020": { 
        text: '酒店旅客身份证号不合法',
        noticeType: NoticeType.TOAST
    }
}
Object.assign(ErrorCodeMap,CheckHotelErrorCodeMap);
WhiteList.global.push('getHotelSelfBooking');
/** ========================================errorCode end========================================== */

class hotelHandler extends functional.baseRequestHandler {
    /* eslint-disable */
    constructor() {
        super();
    }
    /* eslint-enable */

    /**
    * 拆小应用openpage跳转问题 重写
    */
    hotelOpenPage(url, href, oFlag = false) {
        let newUrl = '';
        let preUrl = null;
        let appName = 'hotel';
        if (process.env.NODE_ENV == 'production'){

            for (const key in functional.OPENPAGE_MAP) {
                if (url.indexOf(key) > -1) {
                    preUrl = functional.OPENPAGE_MAP[key];
                    break;
                }
            }
        } else {
            url = url.replace(appName+'/','');
        }
        newUrl = preUrl ? (ORIGIN + preUrl + url) : url;
        if (href && href == 'href') {
            window.location.href = functional.urlProxy(newUrl);
        } else {
            openPage(newUrl, oFlag);
        }
    }

    /**
     * 加载js
     * @id 加载js的id属性 swpPay
     * @type 代表加载sets.env.js 里面的js类型 如 pay invoice address passenger等等
     * @onload js加载完执行的回调
     */
    loadJs(id, type, onload) {
        const src = ORIGIN + functional.APP_URL_MAP.swplib.path + functional.APP_URL_MAP.swplib.child[type].prefix +
            (functional.APP_URL_MAP.swplib.child[type].version || '') + functional.APP_URL_MAP.swplib.child[type].entry;
        loadScript({
            id: id,
            src: src,
            onload: onload
        })
    }

    /**
     * 获取酒店热门城市
     */
    getHotCity(param) {
        return this.request('/hotel/v1/getHotCity', param, { method: 'get' });
    }

    /**
     * 获取酒店城市
     */
    getHotelCitys(param) {
        return this.request('/hotel/v1/getHotelCitys', param, { method: 'get' });
    }

    /**
     * 获取酒店列表
     */
    searchHotelList(param) {
        return this.request('/hotel/v1/searchHotelList', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 获取酒店列表区域商圈信息
     */
    getLocationArea(param) {
        return this.request('/hotel/v1/getLocationArea', param, { method: 'get' });
    }

    /**
     * 获取酒店列表筛选条件
     */
    getFilterInfo(param) {
        return this.request('/hotel/v1/getFilterInfo', param, { method: 'get' });
    }

    /**
     * 获取酒店详情
     */
    getHotelDetail(param) {
        return this.request('/hotel/v1/getHotelDetail', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 获取酒店优惠券
     * 优惠券暂时停用2020年6月9日
     */
    findPersonalCoupon(param) {
        return this.request('/bp/v1/travel/coupon/findPersonalCoupon', param);
    }

    /**
     * 酒店报销凭证
     */
    createInvoiceTitle(param) {
        return this.request('/invoice/v1/hotelCreateInvoiceTitle', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 酒店下单
     */
    createOrder(param) {
        return this.request('/hotel/v1/createOrder', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 获取申请出差地址
     */
    getApplyTravelUrl(param) {
        return this.request('/channel/v1/getChannel', param, { method: 'get' });
    }

    /**
     * 获取订单列表
     * @param param
     * @return {*}
     */
    getOrderList(param) {
        return this.request('/hotel/v1/getHotelSelfBooking', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 获取推荐价格区间
     * @param param
     * @return {*}
     */
    getRecommendPriceRange(param) {
        return this.request('/hotel/v1/getRecommendPriceRange', param, { method: 'post', noZipFlag: true });
    }

    /**
     * 新增查看历史
     * @param param
     * @return {*}
     */
    addHistory(obj) {
        if (!obj.id) {
            return;
        }
        const MAX_SIZE = 5;
        const key = this.primaryKey + '_searchHotelHistory';
        let storage = this.getStorage(key);
        storage = !!storage ? JSON.parse(storage) : [];
        //同一个酒店只记录一次
        let index = -1;
        if (storage.some((s, i) => {
            if (s.id == obj.id) {
                index = i;
                return true;
            }
            return false
        })) {
            storage = storage.splice(index, 1).concat(storage);
        } else {
            storage.unshift(obj);
        }
        //最多存5条
        if (storage.length > MAX_SIZE) {
            storage.splice(MAX_SIZE, storage.length - 1);
        }
        this.setStorage(key, JSON.stringify(storage));
    }

    /**
     * 数组去重
     * @param param
     * @return {*}
     */
    sortedUniq(array, iteratee) {
        if (array == null || array.length == 0) {
            return [];
        }
        function eq(value, other) {
            return value === other ;
        }
        let seen
        let index = -1//循环索引
        let resIndex = 0//结果数组索引
        const { length } = array//数组长度
        const result = []//结果数组
        while (++index < length) {
            const value = array[index], computed = iteratee ? iteratee(value) : value
            //value是原数组的当前值，computed是遍历器处理后的当前值
            if (!index || !eq(computed, seen)) { //如果是第一个元素或者，与之前的元素不相等
                seen = computed//存下新出现的元素，然后给结果数组里赋值
                result[resIndex++] = value === 0 ? 0 : value
                //结果数组结尾插入新值，排除-0的影响
            }
        }
        return result
    }

    /**
     * url http转https
     * @param {String} url
     */
    changUrlToHttps(url){
        let str = url || '';
        return str.replace(/http:/g, "https:")
    }

    /**
     * 显示英文名
     * iDCode  证件类型
     */
    showSurname(iDCode){
        return !!surnameIDMap[iDCode];
    }

    /**
     * 字符串复制功能
     */
    copyStr(str,tips='复制成功') {
        var input = document.createElement("input");
        input.value = str;
        input.readOnly = 'readonly';
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);
        document.execCommand('Copy');
        document.body.removeChild(input);
        showToast(tips);
    }    
}


Object.assign(hotelHandler.prototype, functional);
export default new hotelHandler();
