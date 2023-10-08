<template>
    <div class="emptyCompWrap" :class="position">
        <div class="emptyComp" v-bind:style="{backgroundImage: 'url(' + imgOptions[type] + ')'}">{{tipsText}}</div>
    </div>
</template>
<script>
export default {
    components: {
    },
    props:{
        tipsText:{
            type:String,
            default:'暂无数据'
        },
        type:{
            type:String,
            default:'nocontent'
        },
        position:{
            type:String,
            default:'normal'
        }
    },
    data() {
        return {
            imgOptions:{
                nocontent: require('./img/img_defpage_nocontent@2x.png'),
                datefail: require('./img/img_defpage_datefail@2x.png'),
                developing: require('./img/img_defpage_developing@2x.png'),
                error: require('./img/img_defpage_error@2x.png'),
                noaddress: require('./img/img_defpage_noaddress@2x.png')
            }
        }
    },
    created() {

    },
    mounted() {
    },
    methods: {

    }
}
</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
    @import '~styles/mixins/mixinsStyle.less';
    .emptyCompWrap{
        .emptyComp{
            padding-top: 3rem;
            text-align: center;
            font-size: 0.3rem;
            color: @third-text-color;
            background-repeat: no-repeat;
            background-position: center 0.36rem;
            background-size: 2.56rem 2.56rem;
            min-width: 2.56rem;
            max-width: 5.12rem;
            margin: 0 auto;
        }
        &.center{
            height: 100%;
            width: 100%;
            .flex-box();
            .align-items(center);
            .justify-content(center);
            .emptyComp{
                margin-top: -1.6rem;
                padding-top: 2.64rem;
                background-position: top;
                text-align: center;
            }
        }
    }


</style>

