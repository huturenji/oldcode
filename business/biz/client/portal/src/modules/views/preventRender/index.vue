<template>
    <div class="preventRender-page">
        <div class="preventRender-box">
            <div class="img"></div>
            <p class="tips">
                <span>{{tips}}</span>
            </p>
        </div>
    </div>
</template>
<script>
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin.js';
export default {
    mixins: [tChatEventMixin],
    data() {
        return {
            appName:'正确的移动应用',
            tips:`请使用正确的移动应用打开`
        }
    },
    async created(){
        try {
            this.appName = await sinosdk.sino.getAppName(this.$route.query.preventRenderId||'') || '正确的移动应用';
        } catch (error) {
        }
        this.tips = `请使用${this.appName}打开`;
    },
    methods: {
        goBackFun(){
            sinosdk.sino.back()
        }
    }
}
</script>
<style lang="less" scoped>
@import '~commonStyles/themes/default.less';
.preventRender-page{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: #fff;


    .preventRender-box{
        @media screen and (min-width: @screen-sm){
            max-width: 375px;
        }
        width: 100%;
        text-align: center;
        .tips{
            font-size: 0.3rem;
            line-height: .42rem;
            color: #222222;
        }
        .img {
            width: 100%;
            height: 9.32rem;
            background: url('@/themes/default/img/preventRender/icon_bg.png') no-repeat top;;
            background-size: 100% 100%;
            margin-bottom: .24rem;
        }
    }
}
</style>