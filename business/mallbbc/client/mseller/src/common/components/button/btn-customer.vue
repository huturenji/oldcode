<template>
    <view class="btn-box">
        <button class="btn" :session-from="sessionFrom" :show-message-card="showCard" :send-message-title="titleStr"
            hover-class="none" :send-message-path="path" :send-message-img="image" open-type="contact">
            <slot>
                <view class="btn-content">
                    <image class="icon" :src="imgUrl + 'common/icon/btn_wode_kefu.svg'"></image>
                    <view class="btn-txt">联系客服</view>
                </view>
            </slot>
        </button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl
        }
    },
    props: {
        sessionFrom: {
            type: String,
            default: `sobot||||` // "sobot|昵称|头像|自定义字段" 为固定字段 https://codecenter.sobot.com/pages/6c0905/#%E2%97%8F-%E5%AE%A2%E6%9C%8D%E5%8F%91%E9%80%81%E5%8D%A1%E7%89%87%E6%8E%A5%E5%8F%A3
        },
        showCard: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        path: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: '订单号'
        }
    },
    computed: {
        titleStr() {
            return `${this.name} ${this.title}`
        }
    }
}
</script>

<style scoped lang="scss">
.btn-box {
    button {
        margin: 0;
        padding: 0;
        line-height: none;
        border: none;
        background: none;
        outline: none;
    }

    button::after {
        display: none;
    }

    .btn-content {
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            width: 18px;
            height: 18px;
            margin-right: 5px;
        }

        .btn-txt{
            font-size: 16px;
        }
    }

}
</style>