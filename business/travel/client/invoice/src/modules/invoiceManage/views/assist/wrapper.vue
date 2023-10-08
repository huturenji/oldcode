

<!-- 发票助手首页的骨架图页面-->
<template>
    <div class="main">
        <div class="topMenu">
            <span class="menuItem">
                <i class="icon my"></i>
                <span>我的发票</span>
            </span>
            <span class="menuItem">
                <i class="icon isTrue"></i>
                <span>发票查验</span>
            </span>
        </div>
        
        <div class="bottom-wrap">
            <div class="orderListWraper">
                <div class="orderItem" v-for="item in orderList" :key="item">
                    <div class="firstLine">
                        <div class="FLDiv1"></div>
                        <div class="FLDiv2"></div>
                    </div>
                    <div class="secondLine">
                        <div class="SLDiv1"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="addNewWrap noPadding">
            <div class="addNewWrapIn">
                <div class="addNew cursorp">
                    <span>新增发票抬头</span>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            pageSize: 20 //默认页面Item数量
        };
    },
    computed: {
        // 默认按照indexOrder.vue列表分页，一页20条、
        orderList: function() {
            let resutl = [];
            for (let i = 0; i < this.pageSize; i++) {
                resutl.push(i + 1);
            }
            return resutl;
        }
    },
    mounted() {},
    methods: {}
};
</script>
<style lang="less" scoped>
@import '~themes/default/styles/common/index.less';
@import '~styles/mixins/mixinsStyle.less';

.animated-background {
    animation-name: placeHolderShimmer;
    animation-duration: 0.75s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease;
    background: #f2f3f5;
    // background: red;
    position: relative;
}
@keyframes placeHolderShimmer {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.14;
    }
}
.main {
    position: relative;
    .topMenu {
        width: 100%;
        background: url(~themes/default/img/bg_invoice_top2.png) no-repeat top;
        background-size: 100% auto;
        background-color: @theme-color;
        box-sizing: border-box;
        padding: .44rem 0 .74rem 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .menuItem {
            width: 50%;
            font-size: 0.26rem;
            text-align: center;
            cursor: pointer;
            color: #fff;
            .icon {
                display: block;
                width: .8rem;
                height: .8rem;
                margin: 0 auto 0.14rem;
                &.my {
                    background: url(~themes/default/img/icon_invoice_myinvoice@2x.svg) no-repeat center;
                    background-size: 100% auto;
                }
                &.isTrue {
                    background: url(~themes/default/img/icon_invoice_myinvoice@2x.svg) no-repeat center;
                    background-size: 100% auto;
                }
            }
        }
    }
    .bottom-wrap{
        margin-top: -.3rem;
        padding: .3rem;
        background-color: @background-color;
        border-radius: .2rem .2rem 0 0 ;
        width: 100%;
    }
}
.orderListWraper {
    height: calc(~"100vh - 3rem");
    overflow: hidden;
    .orderItem {
        border-radius: .2rem;
        background: #ffffff;
        height: 1.78rem;
        width: 100%;
        margin-bottom: 0.2rem;
        .firstLine {
            display: flex;
            justify-content: space-between;
            padding: 0.34rem 0.32rem 0 0.31rem;

            .FLDiv1 {
                .animated-background;
                background: #f2f3f5;
                height: 0.44rem;
                margin-right: 1.42rem;
                flex: 1;
                border: 1px solid #ffffff;
                border-radius: 8px;
            }
            .FLDiv2 {
                .animated-background;
                background: #f2f3f5;
                height: 0.44rem;
                width: 0.44rem;
            }
        }
        .secondLine {
            display: flex;
            justify-content: space-between;
            padding: 0.34rem 0.32rem 0.32rem 0.31rem;
            .SLDiv1 {
                .animated-background;
                background: #f2f3f5;
                height: 0.32rem;
                margin-right: 1.86rem;
                flex: 1;
                border: 1px solid #ffffff;
                border-radius: 8px;
            }
        }
    }
}
.addNewWrap {
    background: #fff;
    left: 0 !important;
    .addNewWrapIn {
        padding: 0.3rem;
    }
    position: fixed;
    bottom: 0;
    width: 100%;
    &.noPadding {
        padding: 0;
    }
}

.addNew {
    border-radius: 0.2rem;
    background: @theme-color;
    color: #fff;
    height: 0.84rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 0.32rem;
}

</style>