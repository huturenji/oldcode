<template>
    <view>
        <view class="empty_wrapper" v-if="isWxPcBrower">
            <empty
                emptyImg="icon_defpage_zrcc"
                tips="微信电脑客户端不支持该方式拉起小程序，请移至移动端查看!"
            ></empty>
        </view>
    </view>
</template>
<script>
// 用来跳转微信小程序的中转页面  通过服务端生成URL Scheme的形式拉起来微信的小程序
import { closePageOnWinxin, isWeiXinPCBrower} from '@/utils/common';
import wxHandler from "@/components/wechat/handler";
import empty from '@/components/empty/index';
export default {
    data() {
        return {
            jump_wx: false,
            isWxPcBrower: isWeiXinPCBrower() //是否是微信pc端打开 因为目前经过调试发现微信pc端scheme是拉不起来小程序的
        };
    },
    components: {
        empty
    },
    created(){
        this.init();
    },
    mounted() {
        
    },

    computed:{
            
    },
    onShow(){
        try {
            !!this.jump_wx && closePageOnWinxin();
        } catch (error) {
            
        }
    },
        
    methods: {
        async init(){
            if (this.isWxPcBrower){
                return
            }
            // 重定向到新的地址
            let url = await this.getScheme();
            this.jump_wx = true;
            location.href = url;
        },
        /***
         * 获取微信小程序的urlScheme
         */
        getScheme(){
            return new Promise(async resolve => {
                try {
                    let shareInfoStr = this.$Route.query.shareInfo;
                    let shareInfo = JSON.parse(decodeURIComponent(shareInfoStr));
                    let openlink = await wxHandler.getScheme(shareInfo)
                    if (openlink){
                        resolve(openlink)
                    } else {
                        resolve(null)
                    }
                } catch (error) {
                    console.log(error);
                    resolve(null)
                }
            })
        }
    }
        
}
</script>

<style lang="scss" scoped>
.empty_wrapper{
    padding: 0 60rpx;
    text-align: center;
}
</style>
