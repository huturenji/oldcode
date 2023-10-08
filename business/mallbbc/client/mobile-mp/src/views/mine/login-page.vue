<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-04 09:35:25
 * @LastEditTime: 2023-04-10 16:49:34
 * @FilePath: \mobile-miniprogram\src\views\mine\login-page.vue
-->
<template>
    <view class="login_page">
        <AuthComp @confirm="confirm" @cancel="cancel" mode="page" />
    </view>
</template>

<script>
import AuthComp from '@/common/components/auth/auth-comp'
export default {
    components: { AuthComp },
    methods: {
        confirm(authRes) {
            if (authRes) {
                uni.$emit('relogin');
                setTimeout(() => {
                    // 用户授权登录成功
                    uni.switchTab({
                        url: '/pages/mine/index'
                    })
                }, 500)
            } else {
                // 用户授权登录失败或者拒绝
            }
        },
        // 暂不成为会员
        cancel() {
            uni.switchTab({
                url: '/pages/mine/index'
            })
        }
    }
}
</script>

<style scoped lang="scss">
.login_page {
    padding: 26rpx 20rpx 0;
    height: 100%;
    background-color: #fff;
}
</style>