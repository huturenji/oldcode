<template>
    <div class="page-index-order">
        <div class="main-content">
            <header>
                <nav>
                    <ul>
                        <li class="cursorp" :class="!payStatus && showActiveBar && 'selected'">全部</li>
                        <li class="cursorp" :class="payStatus=='0' && 'selected'">待支付</li>
                        <li class="cursorp" :class="payStatus=='1' && 'selected'">待出行</li>
                        <li class="cursorp" :class="payStatus=='2' && 'selected'">退款/售后</li>
                    </ul>
                </nav>
            </header>
            <div class="search-container">
                <div class='condition'>
                     <div class='search-block icon-btn'>
                        <Icon type="search" class="icon" size='.3'/>
                        <span>搜索</span>
                    </div>
                    <div class="filter icon-btn cursorp">
                        <Icon type="filter" class="icon" size='.3'/>
                        <span class="filter-content">筛选</span>
                    </div>
                </div>
            </div>
            <div class="orderListWraper">
                <div class="orderItem" v-for="item in orderList" :key="item">
                    <div class="firstLine">
                        <div class="FLLeft">
                            <div class="FLDiv1"></div>
                            <div class="FLDiv2"></div>
                        </div>
                        <div class="FLDiv3"></div>
                    </div>
                    <div class="secondLine"></div>
                    <div class="thirdLine">
                        <div class="TLDiv1"></div>
                        <div class="TLDiv2"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="invoice-btn cursorp" :class="{footerBar:showFooter}"></div>
    </div>
</template>
<script>
const Icon = ()=>import('components/icon');
export default {
    components: {Icon},
    data: function() {
        return {
            payStatus: this.$route.params.payStatus, //订单状态
            pageSize: 3, //默认页面Item数量
            showActiveBar: false,
            showFooter:false//是否展示底部导航栏
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
    created(){
        let _this = this;
        if (!!this.$route.query.pageFrom && this.$route.query.pageFrom=='footBar'){
            _this.showFooter = true;
        }
        _this.initPayStatus();
    },
    activated(){
        let _this = this;
        _this.initPayStatus();
    },
    mounted() {
        
    },
    methods: {
        /**
         * 初始化payStatus参数
         */
        initPayStatus(){
            this.showActiveBar = false;
            let enumType = this.$route.query.enumType;
            if (enumType!=undefined && enumType!=null && enumType!=''){ //此分支是从 商云首页的跳转到我的商旅后点击订单条转过来的
                this.payStatus = enumType;
            } else {
                this.payStatus = this.$route.params.payStatus;
            }
            this.showActiveBar = true;
        }
    }
};
</script>
<style lang="less" scoped>
@charset "utf-8";
@import '~themes/default/styles/indexOrder/indexOrder.less';
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
.orderListWraper {
    height: calc(~"(100vh - 1.48rem)");
    .orderItem {
        margin-top: 0.2rem;
        background: #ffffff;
        height: 3.62rem;
        width: 100%;
        .firstLine {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0.19rem 0.28rem 0 0.31rem;
            .FLLeft {
                display: flex;
                .FLDiv1 {
                    .animated-background;
                    background: #f2f3f5;
                    height: 0.32rem;
                    width: 0.32rem;
                }
                .FLDiv2 {
                    .animated-background;
                    background: #f2f3f5;
                    height: 0.32rem;
                    margin-left: 0.1rem;
                    width: calc(~"(18vw)");
                }
            }
            .FLDiv3 {
                .animated-background;
                background: #f2f3f5;
                height: 0.32rem;
                width: calc(~"(18vw)");
                float: right;
            }
        }
        .secondLine {
            .animated-background;
            background: #f9f9fa;
            height: 1.82rem;
            width: 100%;
            margin: 0.2rem 0 0.34rem 0;
        }
        .thirdLine {
            display: flex;
            width: 100%;
            justify-content: flex-end;
            padding: 0 0.25rem 0.31rem 0.31rem;
            .TLDiv1 {
                .animated-background;
                background: #f2f3f5;
                height: 0.44rem;
                width: calc(~"(19vw)");
                margin-right: 0.35rem;
            }
            .TLDiv2 {
                .animated-background;
                background: #f2f3f5;
                height: 0.44rem;
                 width: calc(~"(19vw)");
            }
        }
    }
}
</style>
<style>
    .child-view{
        overflow: hidden;
    }
</style>
