<template>
    <div class="footer fixed-dom-part">
        <div class="item"
            @click="changeLink(item, index)"
            v-for="(item, index) in options" :key="index">
            <div class="icon-box">
                <div class="iconItem" :style="{backgroundImage: 'url(' + (activeType==item.type?item.activeIconUrl:item.iconUrl)||'' + ')'}"></div>
            </div>
            <p :class="{active:activeType==item.type}">{{item.name}}</p>
        </div>
    </div>
</template>
<script>
import footerBarHandler from './js/footerBarHandler.js';
export default {
    name:'footerComp',
    props:{
        activeType:{
            type:String,
            default:''
        },
        indexPage:{
            type:String,
            default:''
        }
    },
    components:{
    },
    data(){
        return {
            options:[//配置信息
                { 
                    name:'',
                    type:'home',
                    iconUrl: require('./img/h5 svg_btn_tab_home_def@3x.png'),
                    activeIconUrl:require('./img/h5 svg_btn_tab_home_sel@3x.png')
                },
                { 
                    name:'行程',
                    type:'trip',
                    iconUrl: require('./img/h5 svg_btn_tab_trip_def@3x.png'),
                    activeIconUrl:require('./img/h5 svg_btn_tab_trip_sel@3x.png'),
                    path:'trip/index.html#/?pageFrom=footBar'
                },
                { 
                    name:'订单',
                    type:'order',
                    iconUrl: require('./img/h5 svg_btn_tab_order_def@3x.png'),
                    activeIconUrl:require('./img/h5 svg_btn_tab_order_sel@3x.png'),
                    path:'order/index.html#/?pageFrom=footBar'
                },
                { 
                    name:'我的',
                    type:'personal',
                    iconUrl: require('./img/h5 svg_btn_tab_my_def@3x.png'),
                    activeIconUrl:require('./img/h5 svg_btn_tab_my_sel@3x.png'),
                    path:'personal/index.html#/?pageFrom=footBar'
                }
            ],
            homeMap:{
                mobile: {
                    name: '出行'
                },
                hotel:{
                    name:'酒店'
                },
                flight:{
                    name:'机票'
                },
                train:{
                    name:'火车票'
                }
            }
        }
    },
    computed:{
    },
    created(){    
        //首页
        if (''!=this.indexPage && 'home' == this.activeType){
            this.options[0].name = this.homeMap[this.indexPage].name || '首页';
        } else { //非首页
            let footerBarHome = footerBarHandler.getStorage('footerBarHome') || "{}";
            let footerBarData = JSON.parse(footerBarHome);
            this.options[0].name = footerBarData.name || '首页';
        }
    },
    methods:{
        /**
        *切换底部导航栏的回调
        *@param item 当前切换的单个的导航栏
        *@param index 当前导航栏的索引
        */
        changeLink(item){
            let that = this;
            //点击当前页面按钮无响应
            if (this.activeType==item.type){
                return;
            }
            //从机票、酒店、火车票首页跳转出去保存首页地址用于点击首页后返回
            if (item.type!='home' && this.activeType =='home'){
                let footerBarHomeData = {
                    url:location.href,
                    name:that.homeMap[this.indexPage].name
                }
                footerBarHandler.setStorage('footerBarHome',JSON.stringify(footerBarHomeData));
            }
            //其他页面点击首页
            if (item.type=='home'){
                let footerBarHome = footerBarHandler.getStorage('footerBarHome') || "{}";
                let footerBarData = JSON.parse(footerBarHome);
                //因后退逻辑在不同渠道银行app上有不同现象的bug,统一调整为前进，2021年3月24日。todu后期商旅小应用合并后，此处逻辑需要重构
                //去除商云首页的pageFrom，首页返回时关闭所有页面而不是回退一步
                window.open(footerBarData.url.replace(/pageFrom=entryList/, "pageFrom=footerBar"));
            } else {
                footerBarHandler.handlerOpenPage(item.path);
            }
            this.$emit('changeMenu', item);
        }
    }
}
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
// 底部导航栏的动画
.animat{
    animation: mymove 0.1s ease-in-out 0s 1;
    -webkit-animation: mymove 0.1s ease-in-out 0s 1; /*Safari and Chrome*/
}

@keyframes mymove{
    0%{
        transform: scale(0);  /*开始为原始大小*/
    }
    50%{
        transform: scale(0.53);
    }
    100%{
        transform: scale(1.06);
    }
}
/*Safari and Chrome*/
@-webkit-keyframes mymove {
    0%{
        transform: scale(0);  /*开始为原始大小*/
    }
    50%{
        transform: scale(0.53);
    }
    100%{
        transform: scale(1.06);
    }
}

.footer{
    position: fixed;
    max-width: @max-content-width;
    z-index: 650;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 0 0.6rem;
    height: 1rem;
    box-shadow:0px -4px 12px 0px rgba(0,0,0,0.05);
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #fff;
    .item{
        cursor: pointer;
        text-align: center;
        font-size: 0.2rem;
        color: #999999;
        position: relative;
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        transition: all 1s;
        .icon-box{
            position: relative;
            .iconItem{
                height: 0.52rem;
                width: 0.52rem;
                background-repeat: no-repeat;
                background-size: 100%;
            }
        }
        p{
            line-height: 0.28rem;
            &.active{
                color: @base-theme-color;
            }
        }
        

        /deep/ .cart-num{
            right: -.2rem;
            &.middle{
                right: -.3rem;
            }
            &.big{
                right: -.46rem;
            }
        }
    }
}
</style>
