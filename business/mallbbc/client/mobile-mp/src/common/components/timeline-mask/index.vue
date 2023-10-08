<template>
    <view>
        <view class="mask" @click="clickMask">
        </view>
    </view>
</template>

<script>
import config from '@/common/lib/config';
export default {
    data(){
        return {
            showUp: false,
        }
    },
    methods: {
        clickMask(){
            uni.navigateToMiniProgram({
                appId: config.MINI_CONFIG.APPID,
                path: 'pages/index/index',
                success(res) {
                    // 打开成功
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.mask{
    position: fixed;
    z-index: 99998;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

</style>