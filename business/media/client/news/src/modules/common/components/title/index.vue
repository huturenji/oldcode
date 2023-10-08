<template>
    <div class="title-bar">
        <div class="side left">
            <Icon v-if="showBackIcon" @click.native="goBackTitle" type='icon_common_leftarrow' size=".36" />
        </div>
        <div class="title">{{titleText}}</div>
        <div class="side operation">
            <span v-if="showOperation" v-html="operationText" @click="operationFuna"></span>
        </div>
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
import Icon from 'commonComp/icon';
export default {
    components: {Icon},
    props: {
        //title文字显示
        titleText:{
            type: String
        },

        //右侧操作的text文字显示
        operationText:{
            type: String
        },

        //是否显示左侧的返回按钮
        showBackIcon:{
            type: Boolean,
            default: true
        },

        //是否显示右侧的操作部分
        showOperation:{
            type: Boolean,
            default: true
        },

        operationFun:{
            type: Function
        },

        titleGoBack:{
            type: Function
        }
    },
    data() {
        return {
           
        }
    },
    created() {},
    mounted() {},
    methods: {
        //操作右侧的回调
        operationFuna(){
            // eslint-disable-next-line no-unused-expressions
            this.operationFun && this.operationFun();
        },

        // 操作左侧返回的回调
        goBackTitle(){
            // eslint-disable-next-line no-unused-expressions
            this.titleGoBack && this.titleGoBack();
        }
    }
};
</script>
<style lang="less" scoped>
@import '~newsStyles/themes/default.less';
@import '~newsStyles/mixins/mixinsStyle.less';
.title-bar{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 200;
    width: 100%;
    background: #fff;
    height: .88rem;
    line-height: .88rem;
    padding: 0 .38rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid @border-color-base;
    .side{
        width: 20%;
    }
    .left{
        text-align: left;
        display: flex;
        align-items: center;
        .icon_common_leftarrow{
            fill: #333;
            cursor: pointer;
        }
    }
    .title{
        flex: 1;
        font-size: .36rem;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    .operation{
        text-align: right;
        span{
            cursor: pointer;
        }
    }
}
</style>
