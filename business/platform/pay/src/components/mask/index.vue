<template>
    <div v-if="value" class="mask" @click="close" :style='{zIndex: zIndex()}'></div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'pay-mask',
        model: {
            prop: 'value',
            event: 'close'
        },
        props: {
            value: {
                type: Boolean,
            },
        },
        computed: {
            ...mapGetters(['zIndex'])
        },
        methods: {
            close(){
                this.$emit('close', false);
            }
        }
    }
</script>
<style scoped lang='less'>
    .mask{
        animation:fade 0.5s ease-in-out 0s 1 alternate forwards;;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        bottom:0;
        right:0;
        left:0;
    }
</style>