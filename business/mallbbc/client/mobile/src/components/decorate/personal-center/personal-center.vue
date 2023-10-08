<template>
    <view class="user-info" v-margin="decoItem">
        <view class="user-info-box">
            <!-- 左侧头像 -->
            <view class="portrait-box" @click="pageJump(decoItem.data[0].avatarData)" v-show="decoItem.props.showAvatarData">
                <view class="portrait-bgc">
                    <img class="portrait" :src="avatarError ? defaultAvatar : userAvatarBg" @error="avatarError = true" />
                </view>
            </view>
            <!-- 中间昵称 -->
            <view class="mem-info" v-show="decoItem.props.showNameData" @click="pageJump(decoItem.data[0].nameData)">
                <text
                    v-if="userCenterData && (userCenterData.memberName || userCenterData.memberNickName)"
                    class="nick-name"
                >
                    {{ isGuest ? '尊敬的游客' : (userCenterData.memberNickName || '未设置昵称') }}
                </text>
                <view
                    v-if="userCenterData && userCenterData.memberName"
                    class="member-name"
                >
                    {{ $L('会员名:') }}{{ userCenterData.memberName }}
                </view>
            </view>
            <!-- 右侧区域 -->
            <view class="user-my-kefu" @click="pageJump(decoItem.data[0].rightData)" v-show="showRightData">
                <img v-show="decoItem.data[0].rightData.img" :src="decoItem.data[0].rightData.img" :style="imgWidth(decoItem.data[0].rightData)" />
                <view class="kefu" v-if="decoItem.data[0].rightData.title">{{ decoItem.data[0].rightData.title }}</view>
            </view>
        </view>

        <view class="user_data_box" v-if="decoItem.props.showUserItems" :style="userDataBoxStyle">
            <view
                v-for="item in userDataList"
                class="user_data_item"
                :key="item.guid"
                :style="{ width: `${100 / decoItem.props.userItemProps.maxNum}%` }"
                @click="pageJump(item)"
            >
                <view :style="{ color: decoItem.props.userItemProps.numberColor || '#222' }">
                    {{ userInfo[item.source].number || 0 }}
                </view>
                <view :style="{ color: decoItem.props.userItemProps.titleColor || '#999' }">{{ item.title }}</view>
            </view>
        </view>
    </view>
</template>

<script>
// 引入客服的功能
import { mapGetters, mapState, mapMutations } from 'vuex'
import handler from '@/components/personal/handler'
import redpoint from '@/components/redpoint/index';
import { skipTo, isNotEmpty } from "@/utils/common.js";

export default {
    name: "deco-personal-center",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            avatarError: false, //头像图片加载报错的变量
            defaultAvatar: getApp().globalData.imgUrl + 'user/btn_common_touxiang_nor.png', //默认头像
            userDataList: [],
            userInfo: redpoint.config
        }
    },
    props: {
        decoItem:{
            type: Object,
            default: () => {}
        },
        isDecoReady: {}
    },
    watch: {
        decoItem: {
            handler(val){
                if (isNotEmpty(val) && this.isDecoReady){
                    this.initData();
                }
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        ...mapState(["userCenterData"]),
        ...mapGetters(['disabledModule', 'isGuest']),
        userAvatarBg() {
            let avatar = this.defaultAvatar;
            if (!this.isGuest){
                avatar = this.userCenterData && this.userCenterData.memberAvatar != undefined ? this.userCenterData.memberAvatar : this.defaultAvatar
            }
            return avatar;
        },
        showRightData() {
            return this.decoItem.props.showRightData && (this.decoItem.data[0].rightData.img || this.decoItem.data[0].rightData.title)
        },
        // 设置图片大小
        imgWidth() {
            return (data) => {
                let style = {
                    width: '44rpx',
                    height: '44rpx'
                }
                if (data.imgWidth && !isNaN(parseInt(data.imgWidth))) {
                    style.width = parseInt(data.imgWidth) * 2 + 'rpx'
                    style.height = parseInt(data.imgWidth) * 2 + 'rpx'
                }
                return style
            }
        },
        userDataBoxStyle() {
            let radius = this.decoItem.props.userItemProps.radius
            let margin = this.decoItem.props.userItemProps.margin
            let padding = this.decoItem.props.userItemProps.padding
            let style = {
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

            return style
        }
    },
    mounted() {
        // 获取个人信息
        handler.getInfo().then(res => {
            if (res.state === 200) {
                this.setUserCenterData(res.data)
            }
        })
    },
    methods: {
        ...mapMutations(['setUserCenterData']),
        initData() {
            if (this.decoItem.props.showUserItems) {
                this.userDataList = this.decoItem.data[0].userData
            }
        },
        pageJump(item) {
            skipTo(item, this)
        }
    }
}
</script>

<style lang='scss'>
    .user-info {
        position: relative;

        .user-info-box {
            height: 134rpx;
            position: relative;
            z-index: 1;

            .user-my-kefu {
                position: absolute;
                right: 10rpx;
                top: 0;
                min-width: 50rpx;
                height: 112rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .kefu{
                    margin-top: 4rpx;
                    height: 32rpx;
                    font-size: 24rpx;
                    color: #222;
                }
            }

            .portrait-box {
                position: absolute;
                top: 0;
                left: 0;
                width: 112rpx;
                height: 112rpx;
                border-radius: 50%;
                border: 8rpx solid rgba(255, 255, 255, .5);
                box-sizing: border-box;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;

                .portrait-bgc {
                    width: 124rpx;
                    height: 124rpx;
                    box-sizing: border-box;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    img.portrait {
                        width: 100rpx;
                        height: 100rpx;
                        border-radius: 50%;
                    }
                }
            }

            .mem-info {
                padding: 0 60rpx 0 130rpx;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;

                .nick-name {
                    color: #333;
                    font-size: 36rpx;
                    line-height: 56rpx;
                    font-weight: bold;
                    width: 520rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1; //文字上限行
                    -webkit-box-orient: vertical;
                    overflow: visible;
                }

                .member-name {
                    color: #666;
                    font-size: 26rpx;
                    border-radius: 13rpx;
                    margin-top: 10rpx;
                    min-height: 40rpx;
                    width: 400rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .login_btn {
                    background: transparent;
                    line-height: 44rpx;
                    height: 44rpx;
                    padding-left: 0;

                    &::after {
                        border: none;
                    }

                    text-align: left;
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
                    width: 100%;
                    height: 36rpx;
                    line-height: 36rpx;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                > view:first-child {
                    margin-bottom: 14rpx;
                    font-size: 36rpx;
                    font-family: sinosun number, sinosun number-Bold;
                    font-weight: 700;
                    color: #222;
                }

                > view:last-child {
                    font-size: 28rpx;
                    
                    font-weight: 400;
                    color: #999;
                }
            }
        }
    }
</style>