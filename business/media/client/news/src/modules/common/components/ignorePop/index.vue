<template>
    <div class="ignorePopWrap">
        <div class="ignorePopBg cursorP" @click.stop="$emit('close','')"></div>
        <div class="actionWrap" :style="positionStyle">
            <div :class="arrowDirection" :style="arrowStyleLeft"></div>
            <div class="buttonsWrap">
                <div class="actionBut normal-btn" @click="ignoreNews">
                    <Icon class="foorbarIcon" type='icon_zixun_pingbi' size=".32" />
                    <span class="butText pingbi">不感兴趣</span>
                    <Icon class="rightBut" type='icon_common_rightarrow' size=".25" />
                </div>
                <div class="actionBut normal-btn " @click="reportNews">
                    <Icon class="foorbarIcon" type='icon_zixun_jubao' size=".32" />
                    <span class="butText jubao">举报</span>
                    <Icon class="rightBut" type='icon_common_rightarrow' size=".25" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
import Icon from 'commonComp/icon';
export default {
    mixins:[scrollLockMixin],
    components: {
        Icon
    },
    props: {
        newsItem: {//消息类型NEWS、VIDEO、AD等
            type: Object,
            default:()=>{}
        } 
    },
    data() {
        return {
            positionStyle:'',
            arrowStyleLeft:'',
            arrowDirection:''
        };
    },
    computed:{
    },
    created(){
        let that = this;
        that.setPosition(that.newsItem.posAndSize)
    },
    mounted(){
    },
    watch: {
        "newsItem.posAndSize":{
            handler(newValue){
                let that = this;
                that.setPosition(newValue)
            }
        }
    },
    methods: {
        /**
         * 计算弹框位置和箭头位置
         */  

        setPosition(item){
            let that = this;
            let pos = item;
            //直角箭头left修正,因为x按钮与x图片之前有空隙
            let zjXCorrection = 3;
            //设置偏移量即弹框与x按钮的距离，按ui设计目前取值px为20
            let offsety = 20; 
            //箭头宽度px为等腰16，直角12
            let arrowWidth = pos.arrowType=='mid'?16:12
            let windowH = document.body.clientHeight;
            if(pos.y < windowH/2){
                that.positionStyle = {top: pos.y+offsety+'px'};
                that.arrowStyleLeft = pos.arrowType=='mid'?{left: pos.x-arrowWidth/2+'px'}:{left: pos.x-arrowWidth+zjXCorrection+'px'};
                that.arrowDirection = pos.arrowType=='mid'?'dyjiantouup':'zjjiantouup';
            }else{
                that.positionStyle = {bottom: windowH-pos.y+pos.h+offsety+'px'}
                that.arrowStyleLeft = pos.arrowType=='mid'?{left: pos.x-arrowWidth/2+'px'}:{left: pos.x-arrowWidth+zjXCorrection+'px'};
                that.arrowDirection = pos.arrowType=='mid'?'dyjiantoudown':'zjjiantoudowm';
            }

        },
        /**
         * 屏蔽
         */        
        ignoreNews() {
            let that = this;
            that.$emit('ignoreNews','')
        },
        /**
         * 举报
         */        
        reportNews() {
            let that = this;
            that.$emit('reportNewsShow','')
        }

    }
};
</script>
<style lang="less">
    @import "index.less";
</style>