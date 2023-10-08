<template>
    <view class="container">
        <w-loading ref="loading"></w-loading>
        <!-- 顶部导航栏组件 -->
        <navbar-comp 
            :parentScrollTop="parentScrollTop"
            :title="title"
            :decoItem="navbarDeco"
        />
        <view class="deco_container" :class="{'deco_container_ios': isIos}">
            <!-- 装修我的页面 -->
            <home-deco
                ref="homeDecoComp"
                :deco_info="deco_data"
                :parentScrollTop="parentScrollTop"
                :requestDone="requestDone"
                @initNavbar="initNavbar"
            />
        </view>
    </view>
</template>

<script>
import decorateHandler from '@/common/components/decorate/handler';
import config from '@/common/lib/config.js';
import { isIos } from '@/utils/common';
import systemMixin from '@/common/mixin/system';
import homeDeco from '@/common/components/decorate';
import navbarComp from '@/common/components/decorate/navbar/index';
export default {
    mixins: [systemMixin],
    components: { homeDeco, navbarComp },
    data() {
        return {
            title: '',
            deco_data: null,
            parentScrollTop: 0,
            navbarDeco: {} , //titlebar装修数据
            requestDone: false, // 获取装修数据接口是否请求完成
        }
    },
    mounted() {
        this.getDecoInfo();
    },
    computed: {
        isIos(){ 
            return isIos();
        },
    },
    onPageScroll({ scrollTop }) {
        this.parentScrollTop = scrollTop
    },
    onShow() {
        // 点击tab，效果切换bug(官方bug)
        this.setTabBarIndex(3);
        this.refreshData();
        this.$statEvent({
            behaviorType: 'pv',
            pageUrl: this.$Route.path,
            referrerPageUrl: '',
        })
    },
    methods: {
        async refreshData() {
            // 更新红点数据
            uni.$emit('updateRedpoint');
            // 更新物流卡片信息
            uni.$emit('loadLogistics')
        },
        //获取装修数据
        async getDecoInfo() {
            let data = await this.getDecoInfoRequest();

            // 更新title
            if (data.showName) {
                this.title = data.showName
            }
            if (data && data.data) {
                let decoList = JSON.parse(data.data)
                if (!!decoList) {
                    this.deco_data = decoList;
                }
            } else {
                this.deco_data = [];
            }

        },
        getDecoInfoRequest() {
            return new Promise((resolve) => {
                let param = {
                    decoId: config.MINE_TOPIC_ID,
                    type: 'topic',
                }
                this.$refs?.loading?.open();
                this.requestDone = false;
                decorateHandler.getTopicDeco(param, {}).then(async res => {
                    if (res.state == 200 && res.data.data != '') {
                        resolve(res.data)
                    } else {
                        resolve({})
                    }
                }).catch(() => {
                    resolve({})
                }).finally(() => {
                    this.$refs?.loading?.close();
                    this.requestDone = true;
                })
            })
        },
        //根据装修数据 初始化顶部的导航栏相关的配置
        initNavbar(config){
            this.navbarDeco = config;
        }
    }
}

</script>

<style lang="scss" scoped>
.deco_container{
    padding-bottom: calc(#{$tabbar-height-android} + 40rpx);
}

.deco_container_ios{
    padding-bottom: calc(#{$tabbar-height-ios} + 40rpx) !important;
}

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