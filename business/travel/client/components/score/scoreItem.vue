<template>
    <div class="score-item-container" v-if='!!(orderScore||{}).ScoreValue && !!productType'>
        <div class='title'>会员积分</div>
        <div class='score-des'>{{when}}将获得{{(orderScore||{}).ScoreValue}}会员积分，请前往“我的商旅-会员积分”查看</div>
        <div class='goPage cursorp' @click="goMyScore"></div>
    </div>
</template>
<script>
import requestHandler from 'orderCommon/requestHandler.js';
export default {
    directives: {
    },
    components: {
    },
    props: {
        orderScore: {
            type: Object,
            default: () => { return {} }
        },
        productType: {
            type: String,
            default: ''
        }
    },
    data: function () {
        return {
            when: ''//获得积分的时间描述
        }
    },
    created: function () {
        this.getProductDes();
    },
    mounted() {
    },
    watch: {
    },
    methods: {
        getProductDes() {
            if (this.productType == 'flight') {
                this.when = '航班起飞后';
            } else if (this.productType == 'train') {
                this.when = '列车发车后';
            } else if (this.productType == 'hotel') {
                this.when = '离店后';
            }
        },
        /**
             * 跳转到我的积分页面
             */
        goMyScore() {
            requestHandler.openPage('score.html#/memberScore');
        }
    }
}
</script>
<style scoped lang="less">
    @import '~styles/core/common.less';
    @import '~styles/mixins/mixinsStyle.less';

    * {
        box-sizing: border-box;
    }

    .score-item-container {
        position: relative;
        height: 1.94rem;
        width: 100%;
        padding: .32rem .3rem .38rem;

        .title {
            background: url(./img/icon_score.png) .03rem center no-repeat;
            background-size: contain;
            font-size: .32rem;
            text-indent: .49rem;
            line-height: .32rem;
            color: @text-color;
        }

        .score-des {
            font-size: .28rem;
            text-align: left;
            margin-top: .22rem;
            color: #999;
            margin-right: 1.1rem;
        }

        .goPage {
            position: absolute;
            right: .3rem;
            top: 0;
            height: 100%;
            width: .3rem;
            background: url(./img/icon_arrow.png) right center no-repeat;
            background-size: .14rem .22rem;
        }
    }
</style>
