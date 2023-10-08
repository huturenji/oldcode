
<!-- 
    重定向测试页面

 -->
<template>
    <view></view>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    onShow() {
        // 重定向
        setTimeout(() => {
            this.$Router.replace({
                path: '/views/shop/cashResult',
                query: {
                    
                }

            })
        }, 0);

    }
} 
</script>

<style scoped lang="scss">

</style>
