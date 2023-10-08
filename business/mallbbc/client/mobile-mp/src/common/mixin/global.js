import { isNotEmpty, isHairSucreen, isIos } from '@/utils/common';
import config from '@/common/lib/config.js';
const mixin = {
    data() {
        return {
            iosHairPhone: false
        }
    },  
    mounted() {
        uni.getSystemInfo({
            success: (res)=>{
                // ios 刘海屏 才返回true
                this.iosHairPhone = isIos() && isHairSucreen();
            }
        })
    },
    computed: {
        isJushihuiApp(){
            return config.APP_KEY === 'jushihui'
        },
        isEmaoqingApp(){
            return config.APP_KEY === 'emaoqing'
        }
    },
    onShow() {
       
    },
    onLoad(){
        // 数据上报
        this.reportEvent()
    },
    methods: {
        reportEvent(){
            try {
                let sku = this.$Route.query.sku;
                let topicid = this.$Route.query.topicId;
                
                if(isNotEmpty(sku) || isNotEmpty(topicid)){ // 只有sku商品和专题页才进行上报
                    let reportOptions = {}
                    if(isNotEmpty(sku)){
                        reportOptions = {
                            ...reportOptions,
                            sku
                        }  
                    }
                    if(isNotEmpty(topicid)){
                        reportOptions = {
                            ...reportOptions,
                            topicid: String(topicid)
                        }  
                    }
                    wx.reportEvent("event_page_info", reportOptions)
                }
            } catch (error) {
                console.log('error', error);
            }
        }
    }
}
export default mixin;