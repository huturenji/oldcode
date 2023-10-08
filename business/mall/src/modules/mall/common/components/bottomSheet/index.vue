<template>
    <div class="bootomSheetWrap">
        <div class="btnWrap">
            <template v-for="(option,index) in options">
                
                <div v-if="!isPc || !!option.pcShow" class="btn normal-btn" @click="$emit('action',option)" :key="index" :style="{backgroundImage: 'url(' + option.imgUrl||'' + ')'}">{{option.name}}</div>
            </template>
        </div>
        <div class="cancelBtn normal-btn" @click="$emit('close','')">取消</div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
export default {
    components: {
    },
    props: {
        options: {//options
            type: Array,
            default: {}
        }, 
    },
    data() {
        return {
            isPc: extendUtils.isPC()
        };
    },
    computed:{
    },
    created(){
    },
    mounted(){
    },
    methods: {
    }
};
</script>
<style lang="less">
    @import "index.less";
</style>