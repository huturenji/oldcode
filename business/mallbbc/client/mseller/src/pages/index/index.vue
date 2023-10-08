<template>
    <view class="container"></view>
</template>
<script>

export default {
    mixins: [],
    data() {
        return {};
    },
    components: {},
    computed: {},
    mounted() {},
    onShow() {
        this.redirect();
    },
    methods: {
        redirect(){
            uni.redirectTo({
                url: '/views/shop/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
