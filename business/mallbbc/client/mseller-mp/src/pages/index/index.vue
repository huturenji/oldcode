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
    created() {
        this.redirect();
    },
    onShow() {   
    },
    methods: {
        redirect(){
            setTimeout(() => {
                uni.redirectTo({
                    url: '/views/shop/index'
                })
            }, 0);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
