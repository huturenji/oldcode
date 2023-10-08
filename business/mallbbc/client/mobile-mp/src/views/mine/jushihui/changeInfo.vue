<!-- 修改昵称 -->
<template>
    <view class="changeInfo_container">
        <view class="input_wrapper">
            <input v-model="value" :placeholder="placeholder">
            <text @click="clear" v-show="value" class='clear_con iconfont icon_close_fill' />
        </view>
        <view class="submit_btn" @click="confirm">保存</view>
    </view>
</template>

<script>
import { updateMemberInfo } from '@/utils/auth/auth.js';

export default {
    data() {
        return {
            value: '',
            key: '',
            placeholder: ''
        };
    },
    mounted() {
        this.key = this.$Route.query.key;
        this.value = this.$Route.query.value || '';

        if (this.key == 'memberNickName') {
            this.total = 15
            this.placeholder = '这么好的你，应该拥有更好的昵称~'
            this.setTitle("修改昵称")
        } else {
            this.total = 10
            this.placeholder = '请输入真实姓名'
            this.setTitle("真实姓名")
        }
    },

    methods: {
        confirm() {
            const param = {
                [this.key]: this.value
            }
            this.verify() && updateMemberInfo(this, param, true);
        },
        clear() {
            this.value = ''
        },
        verify() {
            if (this.value.length <= this.total) {
                return true
            } else {
                uni.showToast({
                    title: `输入长度不能超过${this.total}位!`,
                    icon: 'none',
                })
                return false;
            }
        },
        setTitle(title) {
            setTimeout(() => {
                uni.setNavigationBarTitle({
                    title
                })

            }, 0)
        }
    }
}
</script>

<style lang='scss' scoped>
.changeInfo_container {
    overflow: hidden;
}

.input_wrapper {
    position: relative;
    margin-top: 20rpx;
    background-color: #fff;
    height: 80rpx;
    padding: 0 40rpx;

    input {
        height: 100%;
        background-color: #fff;
    }

    .clear_con {
        position: absolute;
        right: 10rpx;
        top: 20rpx;
        font-size: 36rpx;
        color: #DCDCDC;
    }
}

.submit_btn {
    font-size: 30rpx;
    margin: 40rpx;
    color: #fff;
    background-color: $main-color;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
