<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-04 09:35:25
 * @LastEditTime: 2023-04-14 16:25:03
 * @FilePath: \mobile-miniprogram\src\views\components\tab\tabs.vue
-->
<template>
    <view>
        <scroll-view class="scroll-view" scroll-x="true">
            <view class="tabs">
                <view class="tab-item" @click="clickTab(index)" :style="[{
                    width: itemWidth
                }]" v-for="(item, index) in list" :key="index">
                    <view :class="{ 'tab-item-active': index === current }"
                        :style="{ 'color': index === current ? activeColor : '' }">{{ item.name }}</view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>

export default {
    data() {
        return {
            last: 0
        }
    },
    props: {
        current: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default: () => []
        },
        itemWidth: {
            type: String,
            default: '20%'
        },
        activeColor: {
            type: String,
            default: '#f30300'
        },
    },
    methods: {
        clickTab(index) {
            this.last = this.current;
            this.$emit('clickTab', index, this.last)

        },
        moveItemCenter(index) {
            if (index > 0 && index < this.list.length - 1) {
                if (index > this.last) {
                    // 点击了当前激活item的右侧 左移
                } else {
                    // 点击了当前激活item的左侧 右移
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.scroll-view {
    white-space: nowrap;

    .tabs {
        display: flex;

        .tab-item {
            font-size: 30rpx;
            flex-shrink: 0;
            text-align: center;
        }

        .tab-item-active {
            position: relative;
            color: $main-color;
            font-weight: bold;
            font-size: 32rpx;
            height: 60rpx;
            &::after {
                position: absolute;
                content: ' ';
                width: 40rpx;
                height: 8rpx;
                background: #f30300;
                border-radius: 4rpx;
                left: 50%;
                bottom: 6rpx;
                transform: translateX(-50%);
            }
        }
    }
}
</style>