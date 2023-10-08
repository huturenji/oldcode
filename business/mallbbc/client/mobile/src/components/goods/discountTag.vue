<!-- 实惠标签 -->
<template>
    <img
        v-if="discountTag[type] && discountTag[type][source]"
        :class="`shihuiIcon_${source}`"
        :src="discountTag[type][source]"
    />
</template>

<script>
import discountTag from '@/common/lib/enum/discountTag.js'

export default {
    name: "discountTag",
    data() {
        return {
            discountTag
        }
    },
    props: {
        type: {
            type: [Number, String],
            require: true
        },
        source: {
            type: String,
            require: true
        }
    },
    mounted() {
        
    },
    methods: {
        
    }
}
</script>

<style lang='scss' scoped>
.shihuiIcon_list {
    vertical-align: top;
    margin-top: 4rpx;
    margin-right: 8rpx;
}

.shihuiIcon_detail {
    vertical-align: top;
    margin-top: 7rpx;
    margin-right: 10rpx;
    display: inline-block;
}
</style>