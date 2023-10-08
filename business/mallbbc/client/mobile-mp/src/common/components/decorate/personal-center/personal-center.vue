<template>
    <view :style="[styles]">
        <view class="personal-center-container">
            <view class="left" @click="skipTo(decoItem.data[0].avatarData)" v-if="decoItem.props.showAvatarData">
                <image :src="memberAvatar"></image>
            </view>
            <view class="center" @click="skipTo(decoItem.data[0].nameData)" v-if="loadingSuccess && authenticated">
                <text class="nick_name">{{ memberInfo.memberNickName }}</text>
                <text class="member_name">会员名: {{ memberInfo.memberName }}</text>
            </view>
            <view class="center" @click="skipTo(decoItem.data[0].nameData)" v-else-if="loadingSuccess && !authenticated">
                <text class="nick_name">未登录</text>
            </view>
            <view class="right" @click="skipTo(decoItem.data[0].rightData)">
                <image class="image" v-if="decoItem.data[0].rightData.img" :src="decoItem.data[0].rightData.img"
                    :width="imageWidth(decoItem.data[0].rightData.imgWidth)" />
                <view class="extra_info" v-if="decoItem.data[0].rightData.title">{{ decoItem.data[0].rightData.title }}
                </view>
            </view>


            <!-- 未登录遮罩 -->
            <view class="mask" v-if="!authenticated" @click="toLoginPage"></view>
        </view>

        <!-- 用户数据 -->
        <view class="user_data_box" v-if="decoItem.props.showUserItems && authenticated" :style="[userDataBoxStyle]">
            <view
                v-for="item in userDataList"
                class="user_data_item"
                :key="item.guid"
                :style="{ flex: `0 1 ${100 / maxNum}%` }"
                @click="skipTo(item)"
            >
                <view :style="{ color: decoItem.props.userItemProps.numberColor || '#222' }">
                    {{ redpointConfig[item.source].number || 0 }}
                </view>
                <view :style="{ color: decoItem.props.userItemProps.titleColor || '#999' }">{{ item.title }}</view>
            </view>
        </view>
    </view>
</template>

<script>
import { skipTo, isNotEmpty } from "@/utils/common";
import { login } from '@/utils/auth/auth.js';
import indexMixin from "@/common/components/decorate/common/mixin/index";
import redpointConfig from '@/views/components/redpoint/enum';

export default {
    mixins: [indexMixin],
    data() {
        return {
            defaultMemberAvatar: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/personal/avatar.png',
            memberInfo: {},
            authenticated: false,
            loadingSuccess: false,
            userDataList: [],
            maxNum: 4,
            redpointConfig
        }
    },
    async mounted() {
        // 初始化数据
        this.initData()
        // 如果未登录, 则登录
        if (!this.$store.state.hasLogin) {
            await this.login();
        } else {
            this.memberInfo = this.$store.state.memberInfo;
            this.authenticated = true;
            this.loadingSuccess = true;
        }

        uni.$off('relogin')
        uni.$on('relogin', this.login);
    },
    props: {
        decoItem: {
            type: Object,
            default: () => { }
        }
    },
    methods: {
        initData() {
            this.initBackgroud(this.decoItem)
            this.initSpace(this.decoItem)
            if (this.decoItem.props.showUserItems) {
                this.userDataList = this.decoItem.data[0].userData
                this.maxNum = Math.min(this.userDataList.length, this.decoItem.props.userItemProps.maxNum)
            }
        },
        imageWidth(pixel) {
            return pixel || '22px'
        },
        // 相关跳转
        skipTo(item) {
            skipTo(item, this);
        },
        async login() {
            this.authenticated = await login();
            this.loadingSuccess = true;
            this.memberInfo = this.$store.state.memberInfo;
        },
        toLoginPage() {
            this.$Router.push({
                path: '/views/mine/login-page'
            })
        },
    },
    watch: {
        '$store.state.memberInfo': {
            handler(val) {
                if (isNotEmpty(val)) {
                    this.memberInfo = this.$store.state.memberInfo;
                }
            },
            deep: true
        }
    },
    computed: {
        memberAvatar() {
            return this.memberInfo.memberAvatar || this.defaultMemberAvatar;
        },
        userDataBoxStyle() {
            let style = {}
            if (this.decoItem.props.showUserItems) {
                let radius = this.decoItem.props.userItemProps.radius
                let margin = this.decoItem.props.userItemProps.margin
                let padding = this.decoItem.props.userItemProps.padding
                style = {
                    'border-top-left-radius': `${Number(radius[0]) * 2 || 0}rpx`,
                    'border-top-right-radius': `${Number(radius[1]) * 2 || 0}rpx`,
                    'border-bottom-left-radius': `${Number(radius[2]) * 2 || 0}rpx`,
                    'border-bottom-right-radius': `${Number(radius[3]) * 2 || 0}rpx`,
                    'margin-top': `${Number(margin[0]) * 2 || 0}rpx`,
                    'margin-right': `${Number(margin[1]) * 2 || 0}rpx`,
                    'margin-bottom': `${Number(margin[2]) * 2 || 0}rpx`,
                    'margin-left': `${Number(margin[3]) * 2 || 0}rpx`,
                    'padding-top': `${Number(padding[0]) * 2 || 0}rpx`,
                    'padding-right': `${Number(padding[1]) * 2 || 0}rpx`,
                    'padding-bottom': `${Number(padding[2]) * 2 || 0}rpx`,
                    'padding-left': `${Number(padding[3]) * 2 || 0}rpx`,
                    'background-color': this.decoItem.props.userItemProps.background
                }
            }
            return style
        }
    }
}
</script>

<style lang="scss" scoped>
.personal-center-container {
    display: flex;
    justify-content: space-between;

    .left {
        width: 100rpx;
        height: 100rpx;

        image {
            border-radius: 50%;
        }
    }

    .center {
        margin-left: 20rpx;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .nick_name {
            font-size: 36rpx;
            font-weight: bold;
        }

        .member_name {
            font-size: 28rpx;
            color: #666;
        }

        button::after {
            display: none !important;
        }

        button {
            background: none;
            margin-left: 0;
        }

    }

    .right {
        margin-right: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .image {
            width: 24rpx;
            height: 24rpx;
        }
    }
}

.user_data_box {
    display: flex;
    flex-wrap: wrap;

    .user_data_item {
        position: relative;
        text-align: center;
        margin-bottom: 20rpx;

        view {
            height: 36rpx;
            line-height: 36rpx;
        }

        > view:first-child {
            margin-bottom: 14rpx;
            font-size: 36rpx;
            font-family: sinosun number, sinosun number-Bold;
            font-weight: 700;
        }

        > view:last-child {
            font-size: 28rpx;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
        }
    }
}

.mask {
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
}
</style>