<template>
    <view class="container">
        <view class="list_cell m_t mem_avatar_wrap flex_row_between_center" hover-class="cell_hover"
            :hover-stay-time="50" @click="setAvatar">
            <text class="cell_tit">{{$L('修改会员头像')}}</text>
            <view class="flex_row_end_center">
                <view class="avatar">
                    <img v-if="!loading" class="portrait" :src="(avatarError || !memberAvatar) ? defaultAvatar : memberAvatar" @error="avatarErrorFun"/>
                </view>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>

        <view class="list_cell m_t" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('会员名')}}</text>
            <view>
                <text class="cell_right_con">{{memberName}}</text>
            </view>
        </view>

        <view class="list_cell b_b m_t" @click="changeName('true')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{'真实姓名'}}</text>
            <view>
                <text class="cell_right_con">{{memberTrueName?memberTrueName:''}}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="list_cell b_b" @click="changeName('nick')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('昵称')}}</text>
            <view>
                <text class="cell_right_con">{{memberNickName || '未设置'}}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view hover-class="cell_hover" :hover-stay-time="50">
            <picker @change="selSex" :value="gender" :range="sexArray">
                <view class="list_cell b_b">
                    <text class="cell_tit">{{$L('性别')}}</text>
                    <view class="flex_row_end_center">
                        <view class="uni_birthday">{{sexArray[gender]}}</view>
                        <text class="cell_more iconfont icon_arrow_right"></text>
                    </view>
                </view>
            </picker>
        </view>
        <view hover-class="cell_hover" :hover-stay-time="50">
            <picker mode="date" :end="filters.getDateTime(endtime)" :value="memberBirthday" @change="selBirthDay">
                <view class="list_cell">
                    <text class="cell_tit">{{$L('生日')}}</text>
                    <view class="flex_row_end_center">
                        <view class="uni_birthday">{{memberBirthdayCon}}</view>
                        <text class="cell_more iconfont icon_arrow_right"></text>
                    </view>
                </view>
            </picker>
        </view>
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    import {
        mapState,
        mapMutations
    } from 'vuex';
    export default {
        data() {
            return {
                defaultAvatar: getApp().globalData.imgUrl + 'user/btn_common_touxiang_nor.png', //默认头像
                memberAvatarLocal: '',
                memberAvatar: '', //会员头像
                memberName: '',
                memberNickName: '', //昵称
                memberTrueName: '',
                gender: 0,
                sexArray: ['保密', '男', '女'],
                memberBirthday: '',
                memberBirthdayCon: '请选择生日',
                endtime: new Date().getTime(),
                avatarError: false, //头像图片加载报错的变量
                loading: true,
            };
        },
        mounted() {
            this.getMmeberInfo();
        },
        computed: {
            ...mapState(['userInfo', 'userCenterData'])
        },
        methods: {
            ...mapMutations(['setUserCenterData']),
            avatarErrorFun(){
                this.avatarError = true;
            },
            //获取会员信息
            getMmeberInfo() {
                let _this = this;
                _this.loading = true;
                this.$request({
                    url: 'v3/member/front/member/memberInfo',
                    method: 'GET'
                }).then(res => {
                    if (res.state == 200) {
                        let result = res.data;
                        _this.memberAvatar = result.memberAvatar;
                        _this.memberName = result.memberName;
                        _this.memberNickName = result.memberNickName;
                        _this.gender = result.gender;
                        _this.memberBirthdayCon = result.memberBirthday ? result.memberBirthday : '请选择生日';
                        this.memberTrueName = result.memberTrueName
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {

                }).finally(e => {
                    this.loading = false;
                })
            },
            navTo(url) {
                this.$Router.push(url)
            },
            //选择生日
            selBirthDay(e) {
                this.saveMemInfo('memberBirthday', e.detail.value);
            },
            //选择性别
            selSex(e) {
                this.saveMemInfo('gender', e.detail.value);
            },
            //更新会员昵称
            updateMemInfo(index,val) {
                this[index] = val;
                //更新个人信息数据
                this.userCenterData[index] = val;
                this.setUserCenterData(this.userCenterData);
            },
            //保存会员信息
            saveMemInfo(index, val) {

                if (val == this[index]) {
                    return
                }

                let param = {};
                param.url = 'v3/member/front/member/updateInfo';
                param.data = {};
                param.method = 'POST';
                param.data[index] = val;
                this.$request(param).then(res => {
                    this.$api.msg(res.msg);
                    if (res.state != 200) {
                        this.$api.msg(res.msg);
                    } else {
                        if (index == 'memberAvatar') {
                            this.memberAvatar = this.memberAvatarLocal;
                            this.avatarError = false; //重新上传头像 此时重置该变量
                            //更新个人信息数据
                            this.userCenterData.profilePic = this.memberAvatar;
                            this.userCenterData.memberAvatar = this.memberAvatar;
                            this.setUserCenterData(this.userCenterData);

                        } else if (index == 'memberBirthday') {
                            this[index] = val;
                            this.memberBirthdayCon = val;
                        } else {
                            this[index] = val;
                        }
                    }
                }).catch((e) => {
                    //异常处理
                })
            },
            //设置头像
            setAvatar() {
                let _this = this;
                uni.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    success: function(res) {
                        // 只上传图片类型文件
                        let fileExt = res.tempFiles[0].type
                        if (fileExt.indexOf('image') === -1) {
                            uni.showToast({
                                title: '只支持上传图片类型文件！',
                                icon: 'none',
                                duration: 1000
                            })
                            return
                        }
                        
                        uni.showLoading()
                        if (res.tempFiles[0].size > Math.pow(1024, 2) * 4) {
                            uni.hideLoading()
                            uni.showToast({
                                title: '超出了图片大小限制4M',
                                icon: 'none',
                                duration: 700
                            })
                        } else {
                            uni.uploadFile({
                                url: getApp().globalData.apiUrl + 'v3/oss/common/upload',
                                filePath: res.tempFilePaths[0],
                                name: 'file',
                                formData: {
                                    'source': 'headImg',
                                },
                                success: (uploadFileRes) => {
                                    let result = JSON.parse(uploadFileRes.data);
                                    if (result.state == 200) {
                                        _this.memberAvatarLocal = result.data.url;
                                        _this.saveMemInfo('memberAvatar', result.data.path);
                                        uni.hideLoading()
                                    } else {
                                        uni.hideLoading()
                                        uni.showToast({
                                            title: uploadFileRes.msg,
                                            icon: 'none',
                                            duration: 700
                                        })
                                    }
                                },
                                fail: (uploadFileRes) => {
                                    uni.showToast({
                                        title: uploadFileRes.msg,
                                        icon: 'none',
                                        duration: 700
                                    })
                                }
                            });
                        }
                    },
                });
            },
            //修改昵称事件
            changeName(type) {
                switch(type){
                    case 'nick':{
                        this.$Router.push({
                            path: '/pages/user/changeInfo',
                            query: {
                                name: (this.memberNickName ? encodeURIComponent(this.memberNickName) : ''), 
                                modifier:'nick'
                            }
                        })
                        break
                    }
                    case 'true':{
                        this.$Router.push({
                            path: '/pages/user/changeInfo',
                            query: {
                                name: (this.memberTrueName ? encodeURIComponent(this.memberTrueName) : ''),
                                modifier:'true'
                            }
                        })
                        break
                    }
                    
                }
                
            }
        }
    }
</script>

<style lang='scss'>
    page {
        background: $bg-color-split;
        width: 750rpx;
        margin: 0 auto;
    }

    .list_cell {
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        line-height: 100rpx;
        height: 100rpx;
        position: relative;
        background: #fff;
        justify-content: center;

        &.cell_hover {
            background: #fafafa;
        }

        &.b_b:after {
            left: 20rpx;
        }

        &.m_t {
            margin-top: 20rpx;
        }

        .cell_more {
            color: $main-third-color;
            font-size: 18rpx;
            margin-left: 10rpx;
        }

        .cell_tit {
            flex: 1;
            font-size: 28rpx;
            color: #2D2D2D;
            margin-right: 10rpx;
        }

        .cell_right_con,
        .uni_birthday {
            color: #949494;
            font-size: 26rpx;
        }

        &.mem_avatar_wrap {
            height: 120rpx;
            line-height: 120rpx;
        }

        .avatar {
            width: 82rpx;
            height: 82rpx;
            border-radius: 50%;
            overflow: hidden;
            background-color: #F8F6F7;
            img.portrait{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
</style>
