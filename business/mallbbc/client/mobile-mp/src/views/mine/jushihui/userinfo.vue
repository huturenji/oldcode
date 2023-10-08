<template>
    <view class="userinfo_container">
        <w-loading ref="loading"></w-loading>
        <view class="item" @click="setAvatar">
            <view class="item_left">修改会员头像</view>
            <view class="item_right">
                <view class="image_wrapper">
                    <image :src="memberInfo.memberAvatar" />
                </view>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="item mt10">
            <view class="item_left">会员名</view>
            <view class="item_right">
                <text>{{ memberInfo.memberName || '' }}</text>
            </view>
        </view>
        <view class="item mt10" @click="changeInfo('memberTrueName', memberInfo.memberTrueName)">
            <view class="item_left">真实姓名</view>
            <view class="item_right">
                <text>{{ memberInfo.memberTrueName || '' }}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <hr style="height: 1px" />
        <view class="item" @click="changeInfo('memberNickName', memberInfo.memberNickName)">
            <view class="item_left">昵称</view>
            <view class="item_right">
                <text>{{ memberInfo.memberNickName || '' }}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <hr style="height: 1px" />
        <picker @change="selectSex" :value="memberInfo.gender" :range="sexArray">
            <view class="item">
                <view class="item_left">性别</view>
                <view class="item_right">
                    <text>{{ sexArray[memberInfo.gender] || '' }}</text>
                    <text class="cell_more iconfont icon_arrow_right"></text>
                </view>
            </view>
        </picker>

        <hr style="height:1px" />
        <picker mode="date" :value="memberInfo.memberBirthday" @change="selectBirthDay">
            <view class="item">
                <view class="item_left">生日</view>
                <view class="item_right">
                    <text>{{ memberInfo.memberBirthday || '' }}</text>
                    <text class="cell_more iconfont icon_arrow_right"></text>
                </view>
            </view>
        </picker>

    </view>
</template>

<script>
import { IMAGE_TYPES, uploadFile } from '@/utils/common.js';
import config from '@/common/lib/config';
import { updateMemberInfo } from '@/utils/auth/auth.js';
export default {
    data() {
        return {
            sexArray: ['保密', '男', '女'],
            memberInfo: {}
        }
    },
    onShow() {
        this.memberInfo = this.$store.state.memberInfo;
    },
    methods: {
        changeInfo(key, value) {
            value = (value == null || value == 'undefine') ? '' : value
            this.$Router.push({ path: '/views/mine/jushihui/changeInfo', query: { key, value } })
        },
        selectSex({ detail: { value } }) {
            // 请求接口
            updateMemberInfo(this, {
                gender: value,
                genderValue: this.sexArray[value]
            })
            this.memberInfo.gender = value;
        },
        selectBirthDay({ detail: { value } }) {
            updateMemberInfo(this, {
                memberBirthday: value
            })
            this.memberInfo.memberBirthday = value
        },
        //设置头像
        setAvatar() {
            let _this = this;
            uni.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                success: function (res) {
                    // 只上传图片类型文件
                    console.log(res);
                    // 只上传图片类型文件
                    if (res.tempFilePaths.some(item => !IMAGE_TYPES.includes(item.split('.')[item.split('.').length - 1].toLowerCase()))) {
                        uni.showToast({
                            title: '只支持上传图片类型文件！',
                            icon: 'none',
                            duration: 1000
                        })
                        return
                    }

                    _this.$refs?.loading?.open();
                    if (res.tempFiles[0].size > Math.pow(1024, 2) * 4) {
                        uni.showToast({
                            title: '超出了图片大小限制4M',
                            icon: 'none',
                            duration: 700
                        })
                    } else {
                        const param = {
                            url: getApp().globalData.apiUrl + config.SERVICE_NAME + '/v3/oss/common/upload',
                            name: 'file',
                            filePath: res.tempFilePaths[0],
                            formData: {
                                'source': 'headImg',
                                file: res.tempFilePaths[0]
                            },
                        }

                        // 上传头像到oss中，可能因为头像没有选择导致上传失败
                        uploadFile(param).then(async res => {
                            if (res.state == 200) {
                                _this.memberInfo.memberAvatar = res.data?.url || ''
                                updateMemberInfo(_this, { 'memberAvatar': res.data?.url });
                            }
                        }).catch(error => {
                            console.log('头像上传失败', error);
                        }).finally(() => {
                            _this.$refs?.loading?.close();
                        })
                    }
                },
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.userinfo_container {

    overflow: hidden;

    .mt10 {
        margin-top: 20rpx;
    }

    .item {
        background-color: #fff;
        height: 104rpx;
        padding: 0 20rpx;

        display: flex;
        justify-content: space-between;
        align-items: center;

        .item_left {
            font-size: 30rpx;
        }

        .item_right {
            color: #949494;
            font-size: 28rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .image_wrapper {
                width: 80rpx;
                height: 80rpx;

                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            .cell_more {
                font-size: 18rpx;
                margin-left: 10rpx;
            }
        }

    }
}
</style>