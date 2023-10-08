<!--
 * @Descripttion: your project
 * @Author: mawenshu
 * @Date: 2023-04-21 14:04:33
-->

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
                path: '/activitystudio/index/index',
                query: {
                    activityId: '456780492648448'
                }

            })
        }, 0);

    }
} 
</script>

<style scoped lang="scss">

</style>
