// 鹅毛情模块涉及的混入 参数和方法
import { setStorageSync } from '@/utils/common.js'
const mixin = {
    data() {
        return {
            giftUpdateStatusCacheKey: 'featherStatus' // 鹅毛情列表再次进入的时候，更新鹅毛情订单used 状态的缓存key
        }
    },  
    mounted() {},
    onShow() {
       
    },

    methods: {
        setGiftStatusToCache(featherObj){
            setStorageSync(this.giftUpdateStatusCacheKey, featherObj)
        }
    }
}
export default mixin;