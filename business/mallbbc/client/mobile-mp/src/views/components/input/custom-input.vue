<template>
    <view class="input-wrapper">
        <view class="icon prefix">
            <icon type="search" size="15" @click.stop="$emit('confirm', $event)" />
        </view>

        <!-- 一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件 -->
        <input type="text" :value="value" :placeholder="placeholder" confirm-type="搜索"
            :disabled="disabled" 
            @input="$emit('input', $event.target.value)"
            @confirm="$emit('confirm', $event)"
            @click="$emit('search', $event)"
            @focus="$emit('focus', $event)"/>

        <view class="icon suffix" @click.stop="clearAndToSearch">
            <icon v-show="clearable && value" type="clear" size="15" />
        </view>
    </view>
</template>

<script >
export default {
    data() {
        return {
            clearable: true
        }
    },
    props: {
        value: {
            type: String | Number | Boolean,
            default: ''
        },
        placeholder: {
            type: String,
            default: '输入搜索内容'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    watch:{
        value:{
            handler(n){
                // value为空时
                if(!n){
                    this.$emit('empty-value')
                }
            }
        }
    },
    methods: {
        clearAndToSearch($event){
            this.$emit('input', '');
            this.$emit('search', $event);
        }
    }
}
</script>

<style lang="scss" scoped>
.input-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #EFF2F5;
    border-radius: 20rpx;
    height: 68rpx;
    padding: 0 10rpx;

    .icon {
        width: 50rpx;
        height: 50rpx;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &>input {
        height: 100%;
        font-size: 26rpx;
        flex-grow: 1;
    }
}
</style>