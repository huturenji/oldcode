<template>
    <view class="content">
        <!-- 左侧竖向导航 -->
        <scroll-view scroll-y class="left_aside">
            <view v-for="(item_l,index_l) in leftData" :key="index_l" class="f_item" :class="{active: item_l.categoryId === currentId}"
             @click="initData(item_l.categoryId,index_l)">
                {{item_l.categoryName}}
            </view>
        </scroll-view>
        <!-- 右侧商品显示 -->
        <scroll-view scroll-with-animation scroll-y class="right_aside" @scroll="scrollChange" :scroll-top="scrollTop">
            <!-- 每个分类上部轮播图 -->
            <view class="cat_swiper" v-if="topSwiperData && topSwiperData.length>0 && topSwiperData[0].imgUrl != ''">
                    <swiper class="swiper-box" @change="change" circular autoplay="true">
                        <swiper-item v-for="(item_top ,index_top) in topSwiperData" :key="index_top">
                            <view class="swiper-item flex_row_center_center" @click="goPage(item_top)">
                                <image class="item_img" :src='item_top.imgUrl' mode="aspectFit"/>
                            </view>
                        </swiper-item>
                    </swiper>
                    <!-- 这里轮播点用组件，不用自带的 -->
                    <customSwiperDot :dotNum="topSwiperData.length" :currentIndex="current" background="rgba(0,0,0,0.18)" :swiperDotStyle="{position:'absolute',bottom:'12rpx'}"></customSwiperDot>
            </view>
            <block v-if="!rightData || (rightData && rightData.length == 0 && noData)">
                <view class="noData">
                    <view class="img"></view>
                    <text>{{$L('暂无任何商品~')}}</text>
                </view>
            </block>
            <block v-else>
                <!-- 每个二级分类盒子 -->
                <view v-for="item_r in rightData" :key="item_r.categoryId" class="s_list" :id="'main-'+item_r.categoryId">
                    <!-- 二级分类标题 -->
                    <text class="s_item" @click="navToList(item_r)">{{item_r.categoryName}}</text>
                    <!-- 二级分类列表 -->
                    <view class="t_list" v-if="item_r.children && item_r.children.length!=undefined">
                        <view @click="navToList(item_r_3)" class="t_item" v-for="item_r_3 in item_r.children" :key="item_r_3.categoryId">
                            <view v-if="item_r_3.categoryImage" class="cat_img" :style="{backgroundImage: 'url('+item_r_3.categoryImage+')'}"></view>
                            <text class="">{{item_r_3.categoryName}}</text>
                        </view>
                    </view>
                </view>
            </block>

        </scroll-view>
    </view>
</template>

<script>
import customSwiperDot from '@/components/swiper-dot/index.vue';
import { skipTo } from '@/utils/common.js';
import goodsHandler from '@/components/goods/handler';
let app = getApp()
export default {
    components: {
        customSwiperDot
    },
    data() {
        return {
            current: 0,
            currentId: '',
            leftData: [], //左侧分类数据
            rightData: [], //右侧分类数据
            topSwiperData: [], //一级分类轮播图
            imgUrl: getApp().globalData.imgUrl, //全局图片地址
            dotsStyles: {
                selectedBackgroundColor: '#fff',
                width: 6,
                height: 6,
                selectedBorder: 'none',
                backgroundColor: 'rgba(0, 0, 0, .2)',
                border: 'none',
                bottom: 8
            },
            noData: false, //无分类数据
            ifOnShow: false,
            scrollTop:0,
            lastScrollY:0
        }
    },
    onLoad() {
        // this.initData();
    },
    mounted(){
        this.initData();
    },
    onShow() {
        // #ifdef MP-WEIXIN
        let url = getApp().globalData.apiUrl.substring(0,getApp().globalData.apiUrl.length-1);
        this.$bbcStatEvent({behaviorType:'pv',pageUrl:url+'/pages/category/category',referrerPageUrl:''});
        // #endif
    },
    methods: {
        scrollChange(e){
            this.lastScrollY = e.detail.scrollTop;
        },
        goPage(e) {
            e.url_type = e.link_type
            e.url = e.link_value
            skipTo(e,this)
        },
        initData(pid = '', index = 0) {
            this.scrollTop = this.lastScrollY
            this.$nextTick(()=>{
                this.scrollTop = 0;
            })
            let param = {};
            if (pid) {
                param.categoryId = pid;
                this.currentId = pid;
                let tmp_data = this.leftData.filter(item => item.categoryId == pid);
                this.rightData = tmp_data[0].children;
                if (this.leftData[index].mobileImage != null){
                    if (this.leftData[index].mobileImage.substr(0,1) == '['){
                        this.topSwiperData = JSON.parse(this.leftData[index].mobileImage);
                    } else {
                        this.topSwiperData.push(this.leftData[index].mobileImage);
                    }
                    this.topSwiperData = this.topSwiperData.filter(item=>item.imgUrl != '');
                } else {
                    this.topSwiperData = []
                }
            } else {
                goodsHandler.getCategoryTree(param).then(res => {
                    this.leftData = res.data.list;
                    if (this.leftData && this.leftData.length>0){
                        if (pid == '') {
                            pid = res.data.list[0].categoryId;
                            if (app.globalData.cateId != '') {
                                this.currentId = app.globalData.cateId
                            } else {
                                this.currentId = pid;
                            }
                        }
                        let tmp_data = res.data.list.filter(item => item.categoryId == pid);
                        this.rightData = tmp_data[0].children;
                        if (this.rightData.length == 0) {
                            this.noData = true;
                        } else {
                            this.noData = false;
                        }
                        this.current = 0;
                        console.log(this.leftData);
                        if (this.leftData[index].mobileImage != null){
                            if (this.leftData[index].mobileImage.substr(0,1) == '['){
                                this.topSwiperData = JSON.parse(this.leftData[index].mobileImage);
                            } else {
                                this.topSwiperData.push(this.leftData[index].mobileImage);
                            }
                            this.topSwiperData = this.topSwiperData.filter(item=>item.imgUrl != '');
                        } else {
                            this.topSwiperData = []
                        }
                    }
                })
            }
            param.pageSize = 100;
        },
        navToList(item) {
            // showStoreTabs 添加该参数的原因是因为 是否显示顶部的店铺列表， 默认从分类进去的都不显示 20022/04/13
            this.$Router.push({path:'/standard/product/list',query:{categoryIds:item.categoryId, showStoreTabs: false}})
        },
        change(e) {
            this.current = e.detail.current;
        }
    }
}
</script>

<style lang='scss'>
    page,
    .content {
        height: 100%;
        background-color: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }

    .content {
        display: flex;
    }

    .left_aside {
        flex-shrink: 0;
        width: 190rpx;
        height: 100%;
        background-color: #fff;
    }

    .f_item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 190rpx;
        min-height: 100rpx;
        padding: 0 12rpx;
        color: #666;
        position: relative;
        font-size: 28rpx;

        &.active {
            color: var(--tagColor);
            background: #F8F8F8;
            font-size: 32rpx;
            font-weight: bold;

            &:before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                height: 100%;
                width: 5rpx;
                background-color: var(--tagColor);
                border-radius: 0 4px 4px 0;
                opacity: .8;
            }
        }
    }

    .right_aside {
        flex: 1;
        overflow: hidden;
        padding-left: 20rpx;
    }

    .s_item {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        color: #333;
        margin-top: 30rpx;
        margin-bottom: 20rpx;
        padding-left: 6rpx;
        font-weight: bold;
    }

    .t_list {
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        border-radius: 6rpx;
        padding-top: 20rpx;

        &:after {
            content: '';
            flex: 99;
            height: 0;
        }
    }

    .t_item {
        flex-shrink: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 26rpx;
        color: #666;
        // line-height: ;
        border: 1px solid #e8e8e8;
        border-radius: 8rpx;
        margin-left:20rpx;
        margin-bottom:20rpx;
        .cat_img {
            width: 133rpx;
            height: 133rpx;
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            overflow: hidden;
        }

        text {
            color: #666;
            font-size: 24rpx;
            padding:20rpx;
            font-weight: 600;
        }
    }

    .cat_swiper {
        width: 520rpx;
        height: 210rpx;
        margin-top: 20rpx;
        position: relative;
        display: flex;
        justify-content: center;

        .swiper-box {
            width: 520rpx;
            height: 210rpx;
            border-radius: 10rpx;
            overflow: hidden;

            .swiper-item {
                .item_img {
                    width: 520rpx;
                    height: 210rpx;
                    border-radius: 10rpx;
                    overflow: hidden;
                }
            }
        }
    }

    .noData {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 265rpx;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        text {
            font-size: 28rpx;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: $main-third-color;
        }
    }
</style>
