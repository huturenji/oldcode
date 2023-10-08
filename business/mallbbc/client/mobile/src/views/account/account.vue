<!-- 账号安全页面 -->
<template>
    <view class="container">
        <view class="list_cell b_b m_t" @click="goBindModile" hover-class="cell_hover" :hover-stay-time="50" v-if="!isBindMobile">
            <text class="cell_tit">{{$L('绑定手机号码')}}</text>
            <view>
                <text class="cell_right_con active">{{$L('尚未绑定手机号')}}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="list_cell b_b m_t" @click="navTo('/pages/account/changeMobile')" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('修改手机号')}}</text>
            <view>
                <text class="cell_right_con">{{userCenterData.memberMobile?this.$replaceConByPosition(this.userCenterData.memberMobile,4,6,'****'):''}}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="list_cell b_b" @click="navTo(userCenterData.hasMemberEmail?`/pages/account/changeEmail`:`/pages/account/bindEmail`)" hover-class="cell_hover" :hover-stay-time="50" >
            <text class="cell_tit">{{userCenterData.hasMemberEmail?'修改电子邮箱':'绑定电子邮箱'}}</text>
            <view>
                <text class="cell_right_con">{{userCenterData.memberEmail?userCenterData.memberEmail:''}}</text>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="list_cell" @click="navTo(userCenterData.hasLoginPassword?`/pages/account/changePwd?source=change_login`:`/pages/account/managePwd?source=set_login`)" hover-class="cell_hover" :hover-stay-time="50" >
            <text class="cell_tit">{{userCenterData.hasLoginPassword?'修改登录密码':'设置登录密码'}}</text>
            <view>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>

        <template v-if="userCenterData.hasPayPassword">
        <view class="list_cell b_b m_t" @click="navTo({path:`/pages/account/changePwd`,query:{source:'change_pay'}})" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('修改支付密码')}}</text>
            <view>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        <view class="list_cell" @click="navTo({path:`/pages/account/managePwd`,query:{source:'reset_pay'}})" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('重置支付密码')}}</text>
            <view>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>
        </template>

        <view v-if="!userCenterData.hasPayPassword" class="list_cell m_t" @click="navTo(`/pages/account/managePwd?source=set_pay`)" hover-class="cell_hover" :hover-stay-time="50">
            <text class="cell_tit">{{$L('设置支付密码')}}</text>
            <view>
                <text class="cell_more iconfont icon_arrow_right"></text>
            </view>
        </view>

    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
import personalHandler from '@/components/personal/handler';
export default {
    data() {
        return {
            memberAvatarLocal: '',
            memberAvatar: getApp().globalData.imgUrl+'user/member-avatar.png', //会员头像
            memberName: '',
            memberNickName: '', //昵称
            gender: 0,
            sexArray: ['保密', '男', '女'],
            memberBirthday: '',
            memberBirthdayCon: '请选择生日',
            isBindMobile:true
        };
    },
    computed: {
        ...mapState(['userInfo','userCenterData','hasLogin'])
    },
    onLoad() {
        // this.getMmeberInfo();
        // this.getIsBindMobile();
    },
    mounted(){
        this.getMmeberInfo();
        this.getIsBindMobile();
    },
    methods: {
        //获取个人中心数据
        initData() {
            if (this.hasLogin){
                personalHandler.getInfo().then(res => {
                    if (res.state == 200) {
                        this.setUserCenterData(res.data);
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch(() => {})
            }
        },
        //获取会员是否绑定手机号
        getIsBindMobile(){
            let param = {};
            param.url = 'v3/member/front/member/isBindMobile';
            param.data = {};
            param.method = 'GET';
            this.$request(param).then(res => {
                if (res.state == 200){
                    // let result = res;
                    this.isBindMobile = true;
                } else if (res.state == 267){
                    this.isBindMobile = false;
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //去绑定手机号
        goBindModile(){
            this.$Router.push('/pages/public/bindMobile?source=account')
        },
        //获取会员信息
        getMmeberInfo() {
            let _this = this;
            this.$request({
                url: 'v3/member/front/member/memberInfo',
                method: 'GET'
            }).then(res => {
                if (res.state == 200) {
                    let result = res.data;
                    _this.memberAvatar = result.memberAvatar;
                    _this.memberName = result.memberName;
                    _this.memberNickName = result.memberName;
                    _this.gender = result.gender;
                    _this.memberBirthday = result.memberBirthday;
                    _this.memberBirthdayCon = result.memberBirthday ? result.memberBirthday : '请选择生日';
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
            })
        },
        navTo(url) {
            if (this.isBindMobile){
                this.$Router.push(url)
            } else {
                uni.showModal({
                    title:'提示',
                    content:'请先进行手机号绑定',
                    cancelText:'返回',
                    confirmText:'前往绑定',
                    success: (res) => {
                        if (res.confirm){

                        } else if (res.cancel){

                        }
                    }
                })
            }
        },
        //选择生日
        selBirthDay(e) {
            this.saveMemInfo('memberBirthday', e.detail.value);
        },
        //选择性别
        selSex(e) {
            this.saveMemInfo('gender', e.detail.value);
        },
        //保存会员信息
        saveMemInfo(index, val) {
            let param = {};
            param.url = 'v3/member/front/member/updateInfo';
            param.data = {};
            param.method = 'POST';
            param.data[index] = val;
            this.$request(param).then(res => {
                this.$api.msg(res.msg);
                if (res.state != 200) {
                    this.$api.msg(res.msg);
                } else if (index == 'memberAvatar') {
                    this.memberAvatar = this.memberAvatarLocal;

                } else if (index == 'memberBirthday') {
                    this[index] = val;
                    this.memberBirthdayCon = val;
                } else {
                    this[index] = val;
                }
            }).catch(() => {
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
                    uni.uploadFile({
                        url: getApp().globalData.apiUrl + 'v1/front/commons/uploadImg',
                        filePath: res.tempFilePaths[0],
                        name: 'imageFile',
                        formData: {
                            'source': 'headImg'
                        },
                        success: (uploadFileRes) => {
                            let result = JSON.parse(uploadFileRes.data);
                            if (result.state == 200) {
                                _this.memberAvatarLocal = result.data.url;
                                _this.saveMemInfo('memberAvatar', result.data.path);

                            }
                        }
                    });
                }
            });
        },
        //修改昵称事件
        changeNickName(){
            this.$Router.push({path:'/pages/user/changeInfo',query:{nickName:encodeURIComponent(this.memberNickName)}})
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
        .active{
            color: #FC1C1C;
        }

        &.mem_avatar_wrap {
            height: 120rpx;
            line-height: 120rpx;
        }

        .avatar {
            width: 82rpx;
            height: 82rpx;
            border-radius: 50%;
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            overflow: hidden;
            background-color: #F8F6F7;
        }
    }
</style>
