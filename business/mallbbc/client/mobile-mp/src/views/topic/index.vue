<template>
    <view class="container" :key="topic_id">
        <w-loading ref="loading"></w-loading>
        <!-- 顶部导航栏组件 -->
        <u-navbar
            :bgColor="bgColor"
            :titleStyle="titleStyle"
            :title="title"
            :placeholder="placeholder"
            :leftIconSize="leftIconSize"
            :leftIconColor="leftIconColor"
            :titleWidth="titleWidth"
            autoBack
            :height="navigationBarHeight"
        >
            <template v-slot:left>
                <!-- 混入isShare:通过点击分享链接进来 -->
                <u-icon v-if="showHome" name="home" :size="leftIconSize" :color="leftIconColor" @click="goHome"></u-icon>
                <u-icon v-else name="arrow-left" :size="leftIconSize" :color="leftIconColor" @click="$Router.back()"></u-icon>
            </template>
        </u-navbar>
        <home-deco 
            ref="homeDecoComp" 
            :deco_info="deco_data" 
            :parentScrollTop="parentScrollTop"
            :requestDone="requestDone"
            @initNavbar="initNavbar"
            @updateShareImg="updateShareImg"
        />
    </view>
</template>

<script>
import homeDeco from '@/common/components/decorate'
import decorateHandler from '@/common/components/decorate/handler';
import { isNotEmpty } from '@/utils/common';
import shareMixin from '@/common/mixin/share';
import systemMixin from '@/common/mixin/system';
import changeMethods from '@/common/components/decorate/navbar/changeMethods';
export default {
    mixins: [shareMixin, systemMixin, changeMethods],
    data() {
        return {
            deco_data: null,
            topic_id: '', //专题id
            title: '',
            shareImg: '',
            parentScrollTop: 0,

            // 装修的titlebar相关配置项
            statusbar: {}, // 状态栏装修配置
            titlebar: {}, // title栏装修配置项
            bgColor: 'transparent',
            titleStyle: {}, 
            placeholder: false,
            leftIconSize: 0, // 左侧返回图标的大小
            leftIconColor: '', // 左侧返回图标的颜色
            titleWidth: 0, // titile文字的宽度
            requestDone: false, // 获取装修数据接口是否请求完成
        };
    },
    components: {
        homeDeco
    },
    // 设置当前页面分享到朋友
    onShareAppMessage() {
        let shareOptions = {
            title: "",    // 默认是小程序的名称(可以写slogan等) 必传
            path: `/views/topic/index?topicId=${this.topic_id}`    // 默认是当前页面，必须是以‘/'开头的完整路径 必传
        }
        if(isNotEmpty(this.shareImg)){ // 只有admin专题页装修了分享图片 此时做特殊处理
            shareOptions = Object.assign({}, shareOptions, {
                imageUrl: this.shareImg
            })
        }
        // 该方法在全局混入里面
        let share = this.setShareAppMessage(shareOptions)
        return share;
    },
    mounted(){
        const { topicId, scene } = this.$Route.query;
        this.topic_id = topicId;
        // 兼容扫码进入的场景
        if (!this.topic_id && scene) {
            this.topic_id = scene.split('topicId=')[1]
        }
        this.loadData(this.topic_id);
    },
    onShow() {
        
    },
    onHide(){
    },
    onPageScroll({ scrollTop }) {
        this.parentScrollTop = scrollTop;
        if(scrollTop > 3){
            let opacity = scrollTop / 100;
            opacity = opacity > 1 ? 1 : opacity;
            this.setStatusbar1();
            this.setTitlebar1(opacity);
        } else {
            this.setStatusbar0();
            this.setTitlebar0();
        }
    },
    onReachBottom(){
        uni.$emit('decoReachBottom')
    },
    methods: {
        // 根据装修的分享组件，适配小程序该专题页 转发朋友的分享图片
        updateShareImg(shareImg){
            if(isNotEmpty(shareImg)){
                this.shareImg = shareImg;
            }
        },

        /**
         */
        loadData(id) {
            let param = {
                decoId: id,
                type: 'topic'
            }
            this.$refs?.loading?.open();
            this.requestDone = false;
            decorateHandler.getTopicDeco(param).then(async res => {
                if (res.state == 200) {
                    if (res.data==null){
                        this.deco_data = []
                        return
                    }
                    if (res.data.data != ''){
                        this.deco_data = JSON.parse(res.data.data);
                    } else {
                        this.deco_data = []
                    }
                    this.title = res.data.showName || res.data.name;
                }
            }).finally(()=>{
                this.$refs?.loading?.close();
                this.requestDone = true;
            })
        },
        //根据装修数据 初始化顶部的导航栏相关的配置
        initNavbar(config){
            this.initStatusbar(config)
            this.initTitlebar(config)
        }
    }
}
</script>

<style lang="scss" scoped>
// 修复导航组件[navigation]自带下侧paddingbottom的问题
::v-deep .u-scroll-list{
    padding-bottom: 0 !important;
    font-size: 0;
}
::v-deep .u-tabs__wrapper__nav__item{
    padding: 0 12rpx !important;
}

::v-deep .floatingWindow {
    .cart-thumb {
        margin-top: 20rpx;
        position: relative;
        bottom: unset; 
        right: unset;   
        z-index: unset;
        pointer-events: auto;
    }

    .backTop {
        margin-top: 20rpx;
        position: relative;
        bottom: unset; 
        right: unset;   
        z-index: unset;
        pointer-events: auto;
    }
}
.container{
    ::v-deep .empty_container{
        margin-top: 300rpx;
    } 
}
</style>
