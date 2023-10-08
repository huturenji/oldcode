<template>
    <!-- 顶部的导航组件 -->
    <view class="nav">
         <!-- 透明遮罩层 防止操作的遮罩层-->
         <view class="transparent-mask" v-if="transparent_mask" @tap="hideMask"></view>

        <!-- 顶部右侧的导航 start-->
        <view class="go_more" v-if="right_nav_show">
                <view class="more_con" @tap="rightMenushow" v-show="!right_menu_show">
                    <text class="iconfont icon_more"></text>
                </view>
                <block v-show="right_menu_show">
                    <view class="tips" :class="{leftMove: right_menu_show}">
                        <template v-for="(item, index) in navMenus">
                            <button v-if="item.guestShow || !disabledModule" :key="index" class="tips_pre" @tap.stop="handleLink"
                                :data-link="item.tips_link" :data-tipsName="item.tips_name" :open-type="item.type" :data-type="item.type" plain="true">
                                <view class="moreIcon"><text class="iconfont" :class="item.tips_img"></text></view>
                                <view class="moreText fontScaleIgnore">{{item.tips_name}}</view>
                            </button>
                        </template>
                    </view>
                </block>
        </view>
        <!-- 顶部右侧的导航 end-->

       
        <!-- 顶部的导航 start -->
        <view class="nav_list" v-if="top_nav_show" 
            :style="{
                height: immersive ? (titleBarHeight + 'px') : '50px',
                background: opacityObj.navListOpacity,
                padding: immersive ? '0 248rpx 0 190rpx' : '0 190rpx'
            }"
        >
            <view class="nav_list_content" :style="{height: immersive?(titleHeight+'px'):'50px'}">
                
                <view 
                    v-for="item in navList"    
                    :key="item.id"
                    class="nav_list_pre"
                    :class="{nav_list_pre_active:currentNav == item.id}"   
                    :style="{color:opacityObj.textOpacity, opacity:opacityObj.imgOpacity}"
                    @click="clickNav(item.id)">
                    {{item.text}}
                </view>
                <view class="more_tips" >
                    <text class="more iconfont icon_more" @tap="topMenuShow" :style="{opacity:opacityObj.imgOpacity}"></text>
                    <block v-if="top_menu_show">
                        <view class="triangle-up"></view>
                        <view class="tips">
                            <template v-for="(item, index) in navMenus">
                                <button v-if="item.guestShow || !disabledModule" :key="index" class="tips_pre" @tap.stop="handleLink"
                                    :data-link="item.tips_link" :open-type="item.type" :data-tipsName="item.tips_name" :data-type="item.type" plain="true">
                                    <view class="moreIcon"><text class="iconfont" :class="item.tips_img"></text></view>
                                    <view class="moreText fontScaleIgnore">{{item.tips_name}}</view>
                                </button>
                            </template>
                        </view>
                    </block>
                </view>
            </view>
        </view>
        <!-- 顶部的导航 end -->
    </view>
</template>
<script>
import { mapGetters } from 'vuex';
import {getUrlStableParamValue, updateStableParams} from '@/utils/common.js'
export default {
    props:{  
        // 是否是沉浸式
        immersive:{
            type:Boolean,
            default: true
        },
        
        // 是否有推荐商品
        hasRecommendGoods:{
            type:Boolean,
            default: false
        },

        //titleBar高度
        titleBarHeight:{
            type: Number,
            default: 0
        },
        //titleHeight高度
        titleHeight:{
            type: Number,
            default: 0
        },

        //当前选中的nav
        currentNav:{
            type: Number,
            default: 0
        },

        //右侧的nav展示
        right_nav_show:{
            type: Boolean,
            default: true
        },

        //顶部的nav展示
        top_nav_show:{
            type: Boolean,
            default: false
        },

        //顶部的nav展示
        opacityObj:{
            type: Object,
            default: () => {}
        }
    },
    data(){
        return {
            transparent_mask: false, //透明遮罩蒙层
            // 导航配置项
            navMenus: [
                {
                    tips_img: 'icon_bnj',
                    tips_name: '首页',
                    tips_link: '/',
                    type: 'switchTab',
                    guestShow: true
                },
                {
                    tips_img: 'icon_cart',
                    tips_name: '购物车',
                    tips_link: '/pages/cart/cart',
                    type: 'switchTab',
                    guestShow: false
                },
                {
                    tips_img: 'icon_collect',
                    tips_name: '我的收藏',
                    tips_link: '/pages/member/collect',
                    type: 'switchTab',
                    guestShow: true
                }
            ],
            right_menu_show: false, //是否展示右侧菜单栏
            top_menu_show: false //是否展示顶部菜单栏
        }
    },

    computed: {
        ...mapGetters(['disabledModule']),
        navList(){
            let list = [
                {
                    text: '商品',
                    id: 0
                },
                {
                    text: '推荐',
                    id: 2
                },
                {
                    text: '详情',
                    id: 3
                }
            ];
            // 没有推荐商品，将这一栏移出去
            if (!this.hasRecommendGoods){
                list.splice(1, 1)
            }
            return list;
        }
    },

    methods: {
        //点击跳转每一个菜单栏
        handleLink(e) {
            let that = this;
            console.log(e);
            let link = e.currentTarget.dataset.link;
            let type = e.currentTarget.dataset.type;
            if (type != 'share') {
                //首页使用重定向，不要使用路由
                //关联bug 67385,66939. 同时也会引起首页statuBar显示不正常。疑似uniapp内部有bug导致
                if (link == '/'){
                    let hash = updateStableParams(location.hash, getUrlStableParamValue())
                    if (hash.indexOf('?') > -1){
                        hash = '#/' + hash.substring(hash.indexOf('?'))
                    }
                    location.href = location.origin + location.pathname + location.search + hash
                } else {
                    that.$Router.push(link)
                }
            }
        },

        //隐藏透明遮罩层
        hideMask() {
            this.transparent_mask = false;
            this.right_menu_show = false;
            this.top_menu_show = false;
        },

        //显示右侧的菜单
        rightMenushow() {
            this.transparent_mask = true;
            this.right_menu_show = true;
        },

        // 显示下侧的菜单
        topMenuShow() {
            this.transparent_mask = true;
            this.top_menu_show = true;
        },

        //点击nav的导航
        clickNav(navId) {
            this.$emit('clickNav', navId)
        }
    }
}
</script>
<style scoped lang='scss'>
/* 透明遮罩层 */
.transparent-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background: #000;
    opacity: 0;
    top: 0;
    left: 0;
    z-index: 10;
}

.go_more {
    width: 60rpx;
    height: 60rpx;
    position: absolute;
    /* #ifdef H5 */
    top: calc(var(--titleBarHeight) + 40rpx);
    // top: 40rpx;
    /* #endif */
    /* #ifdef APP-PLUS */
    top: calc(var(--titleBarHeight) + 40rpx);
    // top: 40rpx;
    /* #endif */
    right: 0rpx;
    z-index: 99;
    .more_con{
        width: 60rpx;
        height: 60rpx;
        background: rgba(0,0,0,0.30);
        border-radius: 100rpx 0px 0px 100rpx;
        backdrop-filter: blur(1px);
        display: flex;
        align-items: center;
        justify-content: center;
        .iconfont{
            font-size: 44rpx;
            color:#fff;
        }
    }
    image {
        width: 44rpx;
        height: 44rpx;
    }

    .tips {
        width: 112rpx;
        height: 368rpx;
        position: absolute;
        z-index: 20;
        top: 0rpx;
        right: -112rpx;
        background: rgba(0, 0, 0, 0.8);
        box-shadow: 0px 0px 10rpx 0px rgba(102, 102, 102, 0.2);
        opacity: 0.94;
        border-radius: 8px 0px 0px 16rpx;
        display: flex;
        flex-direction: column;
        white-space:nowrap;
        justify-content:flex-start;
        transition: right 0.2s linear;
        &.leftMove{
            right: 0rpx;
        }
        &>button:nth-of-type(2){
            image{
                width: 44rpx;
                height: 44rpx;
            }
        }
        .tips_pre {
            width: 112rpx;
            height: 112rpx;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 8rpx;
        }
        .moreIcon{
            width: 52rpx;
            height: 52rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .moreText.fontScaleIgnore{
            height: 34rpx;
            line-height: 34rpx;
            font-size: 24rpx;
            
            color: #eef4f9;
            margin-top: 4rpx;
        }

        button[plain] {
            border: none;
        }

        .iconfont {
            font-size:52rpx;
            color:#fff;
        }
    }
}
.nav_list {
    display: flex;
    justify-content: space-between;
    position: fixed;
    width: 750rpx;
    // height: calc(var(--titleBarFillHeight));
    // top: calc(var(--titleBarFillHeight));
    padding: 0 248rpx 0 200rpx;
    /* #ifdef MP-WEIXIN */
    padding-left: 20rpx;
    /* #endif */
    align-items: flex-end;
    z-index: 20;
    .nav_list_content{
        width: 100%;
        display: flex;
        height: 100%;
        justify-content: space-between;
        align-items: center;
    }
    .go_back_nav {
        width: 50rpx;
        height: 50rpx;

        image {
            width: 20rpx;
            height: 32rpx;
        }
    }

    .nav_list_pre {
        font-size: 32rpx;
        
        font-weight: 500;
        color: #333333;
        line-height: 32rpx;
        padding-bottom: 5rpx;
    }

    .nav_list_pre_active {
        border-bottom: 5rpx solid var(--radioCheckedColor);
    }

    /* 三点更多分享 */
    .more_tips {
        position: relative;
        display: flex;
        align-items: center;
        width: 50rpx;
        height: 50rpx;

        .more {
            font-size: 50rpx;
        }

        .triangle-up {
            position: absolute;
            display: block;
            top: 40rpx;
            left: 60rpx;
            width: 0rpx;
            height: 0rpx;

            &::before {
                box-sizing: content-box;
                width: 0;
                height: 0;
                position: absolute;
                top: 2px;
                right: 14rpx;
                padding: 0;
                border-bottom: 8px solid #333333;
                border-top: 8px solid transparent;
                border-left: 12px solid transparent;
                border-right: 12px solid transparent;
                display: block;
                content: '';
                z-index: 12;
            }

        }

        .tips {
            width: 340rpx;
            height: 112rpx;
            position: absolute;
            top: 70rpx;
            right: -140rpx;
            background: #333333;
            border-radius: 16rpx;
            display: flex;
            white-space:nowrap;
            justify-content:space-between;
            transition: right 0.2s linear;
            .tips_pre {
                width: 112rpx;
                height: 112rpx;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .moreIcon{
                width: 52rpx;
                height: 52rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size:52rpx;
                color:#fff;
            }
            .moreText.fontScaleIgnore{
                height: 34rpx;
                line-height: 34rpx;
                font-size: 24rpx;
                
                color: #eef4f9;
                margin-top: 4rpx;
            }

            button::after {
                border: none;
            }

            button[plain] {
                border: none;
            }
            .iconfont {
                font-size:52rpx;
                color:#fff;
            }
        }
    }
}
</style>