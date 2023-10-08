<template>
    <div class="hotelListWrap">
        <div ref="hotelListWrap" class="hotelListScroll" @scroll="loadMore()" @touchmove="isListScrolling()" @touchend="listScrollover">
            <div ref="hotelListIn">
                <div class="lineWrap hoteListItem animated-background" v-for="(item,index) in hoteList" :key="index">
                    <div class="iconWrap">
                        <div class="iconImg"></div>
                    </div>
                    <div class="textBoxWrap">
                        <div class="titWrap"></div>
                        <div class="textWrap"></div>
                        <div class="textWrap bigbt"></div>
                        <div class="rightWrap">
                            <span class="rightitem"></span>
                        </div>
                        <div class="redWrap">
                            <span class="reditem"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="quickFilterWrap">
            <div class="quickFilterItem cursorp">在线支付</div>
            <div class="quickFilterItem cursorp">到店支付</div>
        </div>
        <div>
            <div class="searchAndFilterWrap">
                <div class="search-component">
                    <div class="componentOut">
                        <div class="contentWrap">
                            <div class="content">
                                <div class="position"></div>
                                <div class="travel-time">
                                    <div class="topline">
                                        <span class="label">住</span>
                                        <span class="time"></span>
                                    </div>
                                    <div>
                                        <span class="label">离</span>
                                        <span class="time"></span>
                                    </div>
                                </div>
                                <div class="input-block">
                                    <input type="search" placeholder="酒店/位置/品牌"/>
                                </div>
                            </div>
                        </div>
                        <!-- 酒店地图 -->
                        <div class="map"></div>
                    </div>
                </div>
                <div class="filterWrap">
                    <div class="tabItemWrap">
                        <div class="tabItem"><span>推荐排序</span></div>
                        <div class="tabItem"><span>位置区域</span></div>
                        <div class="tabItem"><span>价格/星级</span></div>
                        <div class="tabItem"><span >筛选</span></div>
                    </div>
                </div>
            </div>
        </div> 

    </div>
</template>
<script>
export default {  
    data: function () {
        return {
            hoteList: [
                { index:1 },
                { index:2 },
                { index:3 },
                { index:4 },
                { index:5 },
                { index:6 },
                { index:7 },
                { index:8 },
                { index:9 },
                { index:10 }
            ]
        }
    },
    mounted() {
    },
    methods: {
    }
}
</script>
<style lang="less" scoped>
       @import './hotelList.less';
   .animated-background {
        animation-name: placeHolderShimmer;
        animation-duration: 0.75s;
        animation-iteration-count: infinite;
        animation-direction: alternate;
        animation-timing-function: ease;
        background: #f2f3f5;
        position: relative;
    }
    @keyframes placeHolderShimmer {
        0% {
            opacity:1;
        }
        100% {
            opacity:0.14;
        }
    }
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
@bggray:#EAEFF4;
@bgred:#FFADAD;
.lineWrap.hoteListItem{
    .flex-box(); 
    padding: 0.2rem 0.3rem; 
    background: @sub-background-color;
    box-sizing: border-box;
    .bbpx(1px, @border-color-base, 0.3rem, 0.3rem, solid);
    .coupon-label{
        font-size: .2rem;
        color: @danger-color-light;
        text-align: center;
        border-radius: .04rem;
        min-width: 1.36rem;
        padding: 0 .08rem;
        margin-right: .16rem;
    }
    .iconWrap{
        width: 2.04rem;
        height: 2.72rem;
        background: url(~assets/img/hotel/empty.png) no-repeat center;
        background-size: cover;
        border-radius: 0.08rem;
        .iconImg{
            width: 2.04rem;
            height: 2.72rem;
            background: url(~assets/img/hotel/empty.png) no-repeat center;
            background-size: cover;
            border-radius: 0.08rem;
        }
    }
    .textBoxWrap{
        padding-left: 0.24rem;
        padding-top: 0.25rem;
        width:calc(~'100% - 1.99rem');
    }  
    .titWrap{
        height: 0.44rem;
        margin-right: 0.76rem;
        background: @bggray;
        border-radius: 0.06rem;
        margin-bottom: 0.18rem;
    } 
    .textWrap{
        height: 0.28rem;
        width: 3.02rem;
        background: @bggray;
        border-radius: 0.06rem;
        margin-bottom: 0.18rem;
        &.bigbt{
            margin-bottom: 0.5rem;
        }
    }
    .rightWrap{
        text-align: right;
        margin-bottom: 0.12rem;
        .rightitem{
            display: inline-block;
            height: 0.28rem;
            width: 1.78rem;
            background: @bggray;
            border-radius: 0.06rem;
        }
    }
    .redWrap{
        text-align: right;
        .reditem{
            display: inline-block;
            height: 0.44rem;
            width: 1.8rem;
            background: @bgred;
            border-radius: 0.22rem;
        }
    }
}    
</style>