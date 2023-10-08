<template>
    <div class="textDetail">
        <div class="bp_textWrap">
            <div class="textLeft">
                <div class="textLeftInput">{{label}}</div>
                </div>
            <div class="textMid">
                <div class="textInput colorNomorl" v-if="text=='' && tips==''">--</div>
                <template v-else>
                    <div class="textInput">{{text}}</div>
                    <div class="textInput" v-if="''!=tips">{{tips}}</div>
                </template>
                
            </div>
        </div>        
    </div>
</template>
<script>
export default {
    props:{
        text: {
            type: String,
            default:''
        },
        tips: {
            type: String,
            default:''
        },
        label:{
            type: String,
            default:''
        },		
    },
    data() {
        return {
        };
    },
    methods: {

    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/textDetail.less';
</style>

