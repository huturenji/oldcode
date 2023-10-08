<template>
  <!--2019.1.30修改添加 xg14-->
    <div class="indexWrap">
        <div class="indexbg">
            <!-- 小红包入口 不能加到index层级中iphone6 IOS兼容 -->
            <RedPocket ref="redPocket"></RedPocket>
            <div class="topButtonWrap xg14">
            </div>
            <div class="contentWrap">
                <div class="top_bg"></div>
                <div class='swiperWrap'>
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RedPocket from 'components/coupon/redPocket.vue'
import extendUtils from 'flightCommon/extend.js';
export default {
    components: {
        RedPocket
    },
    data() {
        return {

        };
    },
    created(){
        extendUtils.setStorage('homePageType','mini');
    },
    methods:{
        showActivityCenter(){
            this.$router.push({path:'/activityCenter'})
        }
    }
}
</script>

<style lang="less">
    @import '~styles/core/normalize.css';
    @import '~styles/core/common.less';
.indexWrap {
        height: 100%;
        overflow-y: auto;
        .textButton{
            font-size:0.28rem;
            color: @theme-color;
            padding: 0 0.7rem;
            text-align: right;
            cursor: pointer;
        }

        .indexbg {
            background: url(~assets/img/flightList/banner.png) no-repeat top;
            background-size: 100% auto;
            padding-bottom: 1.5rem;
        }
  .topButtonWrap.xg14{
    height: 0.88rem;
  }
        .topButtonWrap {
            height: 0.54rem;
            padding: 0.2rem 0.3rem 1.54rem;
            display: -ms-flexbox;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            -webkit-box-pack: space-between;
            -webkit-justify-content: space-between;
            -moz-justify-content: space-between;
            -ms-justify-content: space-between;
            -o-justify-content: space-between;
            justify-content: space-between;
        }
        .top_bg {
            height: 0.84rem;
            margin: 0 0.3rem;
            background: rgba(255, 255, 255, 0.7);
            margin-bottom: -0.84rem;
            border-top-left-radius: 0.1rem;
            border-top-right-radius: 0.1rem;
        }
        .swiperWrap {
            padding: .6rem 0rem;
            margin: 0 0.3rem;
            background: #fff;
            border-radius: 0.1rem;
            box-shadow: 0 0.13rem 0.27rem rgba(141,141,141,0.17);
        }
    }
</style>
