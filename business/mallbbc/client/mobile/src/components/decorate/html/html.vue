<template>
    <view class="html-container" v-html="decoItem.data[0]">
    </view>
</template>
<script>
export default {
    name: 'deco-html',
    data() {
        return {
            
        };
    },
    props: {
        decoItem: {
            type: Boolean,
            default: false
        }
            
    },
    computed: {
    },
    created() {
            
    },
    methods: {
    }
}
</script>

<style lang='scss'>
.html-container{
    height: 100%;
}
</style>
