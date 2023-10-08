<template>
    <!--导航组件-->
    <view class="nav_wrap" :style="[styles]">
        <!--导航（不显示图标）-->
        <view
            class="cate-section"
            v-if="decoItem.props.style_set === 'nav' && decoItem.props.icon_set === 'no-icon'"
            :style="[{ justifyContent: decoItem.data.length > 4 ? 'flex-start' : 'space-around'}]"
        >
            <view
                class="cate-item"
                v-for="(item, index) in decoItem.data"
                :key="index"
                @click="skipTo(item)"
            >
                <text>{{ toSubstring(item.name, 0, 9) }}</text>
            </view>
        </view>

        <!-- 导航（图标在左）-->
        <view
            class="cate-section"
            v-if="decoItem.props.style_set === 'nav' && decoItem.props.icon_set === 'left'"
            style="justify-content: flex-start; padding: 20rpx 2rpx"
        >
            <view
                class="cate-item2"
                v-for="(item, index) in decoItem.data"
                :key="index"
                @click="skipTo(item)"
            >
                <image
                    :src="item.img"
                    mode="aspectFit"
                    :style="[dealStyle(decoItem.props.slide)]"
                />
                <view class="cate_name">{{ toSubstring(item.name, 0, 9) }}</view>
            </view>
        </view>

        <!-- 导航（图标在上） -->
        <view v-if="decoItem.props.style_set === 'nav' && decoItem.props.icon_set === 'up'">
            <u-scroll-list
                :indicator="indicator"
                :indicatorColor="decoItem.props.indicatorColor"
                :indicatorActiveColor="decoItem.props.indicatorActiveColor"
                :indicatorStyle="{marginTop: '24rpx'}"
                indicatorWidth="60rpx"
                indicatorBarWidth="26rpx"
            >
                <view class="scroll-list">
                    <view
                        class="scroll_list_goods_item"
                        v-for="(item, index) in decoItem.data"
                        :key="index"
                    >
                        <image @click="skipTo(item)" style="width: 84rpx; height: 84rpx;" :src="item.img"></image>
                        <view class="nav_group_name">{{ toSubstring(item.name, 0, 9) }}</view>
                    </view>
                </view>
            </u-scroll-list>
        </view>
        
        <!-- 导航分组 -->
        <view class="nav_group" v-if="decoItem.props.style_set === 'tag-nav'">
            <view
                class="nav_group_item"
                v-for="(item, index) in decoItem.data"
                :key="index"
                @click="skipTo(item)"
            >
                <image :src="item.img"></image>
                <view class="nav_group_name">{{ item.name }}</view>
            </view>
        </view>
    </view>
</template>

<script>
import { skipTo } from "@/utils/common.js";
import mixin from "@/common/components/decorate/common/mixin/index";
export default {
    mixins: [mixin],
    name: "navigation",
    props: {
        // 导航数据
        decoItem: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            indicator: true,
        };
    },
    mounted(){
        this.initBackgroud(this.decoItem)
        this.initSpace(this.decoItem)
    },
    methods: {
        toSubstring(value, start, end) {
            return value.substring(start, end);
        },
        dealStyle(imgSize) {
            try {
                return {
                'margin-right': '10rpx',
                'width': `${imgSize * 2}rpx`,
                'height': `${imgSize * 2}rpx`
                }
            } catch (error) {}
        },
        // 相关跳转
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>

<style lang="scss" scoped>

.scroll-list {
	display: flex;
	
    .scroll_list_goods_item {
        margin-right: 60rpx;
        text-align: center;

        &:first-child {
            margin-left: 44rpx;
        }

        .nav_group_name {
            font-size: 26rpx;
            color: #333;
        }
    }
}

.cate-section {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20rpx 0 26rpx 52rpx;
    overflow-x: auto;
    flex-wrap: nowrap;
    width: 100%;

    .cate-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 28upx;
        color: #303133;
        flex-shrink: 0;
        margin-right: 64rpx;

        image {
            overflow: visible;
        }
    }

    .cate-item2 {
        display: flex;
        align-items: center;
        font-size: 26upx;
        color: #303133;
    }

    .cate_name {
        -webkit-writing-mode: vertical-rl;
        writing-mode: vertical-rl;
    }

    /* 原图标颜色太深,不想改图了,所以加了透明度 */
    image {
        margin-bottom: 14upx;
        border-radius: 50%;
        border: 6upx solid #ffffff;
    }
}

// 导航分组
.nav_group {
    padding: 0 86rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .nav_group_item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 40rpx;
        margin-bottom: 40rpx;

        image {
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            margin-right: 20rpx;
        }

        .nav_group_name {
            font-size: 26rpx;
            color: #333;
        }
    }

    .nav_group_item:nth-last-child(1) {
        margin-right: 0;
    }
}

.nav_group > view:nth-child(2n) {
    margin-right: 0;
}
</style>
