

<template>
<!-- todo -->
<view></view>
 </template>

<script>
export default {
    data() {
        return {};
    },
    onShow() {
        this.transfer();
    },
    methods: {
        transfer(){
            uni.redirectTo({
                url: `${this.$config.TOPIC_PATH}?id=${this.$config.COUPON_TOPIC_ID}` 
            });
        }
    }   
}
</script>

