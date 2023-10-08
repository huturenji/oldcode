<template>
    <bottomSheet :options="options" @action="moreAction" @close="$emit('close','')"></bottomSheet>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
const bottomSheet = ()=>import('commonComp/bottomSheet');
export default {
    mixins:[scrollLockMixin],
    components: {
        bottomSheet
    },
    props: {
        newsItem: {//消息类型NEWS、VIDEO、AD等
            type: Object,
            default: ()=>{}
        } 
    },
    data() {
        return {
            options:[
                { name:'举报内容',type:'report',imgUrl: require('./img/icon_common_warning@2x.png'),pcShow:true}
            ]
        };
    },
    computed:{
    },
    created(){
    },
    mounted(){
    },
    methods: {
        /**
         * 分享界面点击动作
         */        
        moreAction(option) {
            let that = this;
            that.$emit('moreAction',option.type)
        }
    }
};
</script>
<style lang="less">
    @import "index.less";
</style>