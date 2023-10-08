<template>
    <scroll-list
        :indicatorWidth="indicatorWidth"
        :indicatorBarWidth="indicatorBarWidth"
        :indicator="indicator"
        :indicatorColor="indicatorColor"
        :indicatorActiveColor="indicatorActiveColor"
        :indicatorStyle="indicatorStyle"
    >
        <view class="scroll-list">
            <view
                class="scroll-list__goods-item"
                v-for="(item, index) in list"
                :key="index"
                @click="skipTo(item)"
            >
                <image v-if="item.img" class="scroll-list__goods-item__image" :src="item.img"></image>
                <text v-if="item.name" class="scroll-list__goods-item__text" :style="textStyle">{{ item.name }}</text>
            </view>
        </view>
    </scroll-list>
</template>

<script>
import scrollList from './scroll-list.vue'

import {
    skipTo
} from '@/utils/common.js'
import props from './props.js';
export default {
    name: 'scroll_list',
    components:{
        scrollList
    },
    props:{
        list:{
            type: Array,
            default:() => []
        },
        textStyle:{
            type: Object,
            default: () => {
                return {
                    color: '#333',
                    fontSize: '14px'
                }
            }
        },
        ...props.props
    },
    data(){
        return {
        }
    },
    mounted(){
        
    },
    methods: {
        left() {
            console.log('left');
        },
        right() {
            console.log('right');
        },
        // 相关跳转
        skipTo(item) {
            skipTo(item, this)
        }
    }
}
</script>

<style lang="scss" scoped>
.scroll-list {
    display: flex;
    &__goods-item {
        margin-right: 60rpx;
        &:first-child{
            margin-left: 44rpx;
        }
        &:last-child{
            margin-right: 44rpx;
        }
        &__image {
            width: 84rpx;
            height: 84rpx;
            // border-radius: 50%;
        }
        &__text {
            display: block;
            color: #fff;
            text-align: center;
            font-size: 12px;
            margin-top: 5px;
        }
    }
    &__show-more {
        background-color: #fff0f0;
        border-radius: 3px;
        padding: 3px 6px;
        display: flex;
        flex-direction: column;
        align-items: center;

        &__text {
            font-size: 12px;
            width: 12px;
            color: #f56c6c;
            line-height: 16px;
        }
    }
}
</style>