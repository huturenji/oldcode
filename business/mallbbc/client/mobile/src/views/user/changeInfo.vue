<!-- 修改昵称 -->
<template>
    <view class='edit_nick_name'>
        <view class='input_wrap flex_row_between_center'>
            <input type='text' v-model='memberName' maxlength='15' :placeholder='placeholder' placeholder-style='font-size:26rpx;color:#949494'
             @input='inputCon' confirm-type='done' @confirm='saveCon' />
            <text @click="clearCon" v-show="memberName" class='clear_con iconfont icon_close_fill' />
        </view>
        <view v-show="memberName" class='count'>
            <text class='cur_count'>{{memberName.length}}</text><text class="totla_count">/{{total}}</text>
        </view>
        <view class="member_nickname_btn" @click="saveCon">{{$L('保存')}}</view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data() {
        return {
            memberName: '',
            modifier:'',
            limitNum: 15,
            placeholder:'',
            total:0
        };
    },
    mounted(){
        this.memberName = decodeURIComponent(decodeURIComponent(this.$Route.query.name));
        this.modifier = this.$Route.query.modifier
        if (this.modifier=='nick'){
            this.total = 15
            this.placeholder = '这么好的你，应该拥有更好的昵称~'
            this.setTitle("修改昵称")
        } else {
            this.total = 4
            this.placeholder = '请输入真实姓名'
            this.setTitle("真实姓名")
                
        }
    },
    onLoad() {
        // this.memberName = decodeURIComponent(decodeURIComponent(this.$Route.query.name));
        // this.modifier = this.$Route.query.modifier
        // if(this.modifier=='nick'){
        //     this.total = 15
        //     this.placeholder = '这么好的你，应该拥有更好的昵称~'
        //     uni.setNavigationBarTitle({
        //         title:'修改昵称'
        //     })
        // }else{
        //     this.total = 4
        //     this.placeholder = '请输入真实姓名'
        //     uni.setNavigationBarTitle({
        //         title:'真实姓名'
        //     })
        // }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        setTitle(title){
            setTimeout(()=>{
                uni.setNavigationBarTitle({
                    title
                })

            },0)
        },
        //input输入事件
        inputCon(e) {
            let {
                limitNum
            } = this;
            let con = e.detail.value;
            if (con.length <= limitNum) {
                this.memberName = con;
            }
        },
        //保存数据
        saveCon() {
            let {
                memberName
            } = this;
                
            if (this.modifier=='nick'){
                if (memberName.trim().length == 0) {
                    this.$api.msg('请输入昵称');
                } else if (memberName.trim().length>15){
                    this.$api.msg('请输入15个字以内的昵称');
                } else {
                    this.saveMemInfo('memberNickName', memberName);
                }
            } else if (memberName.trim().length == 0) {
                this.$api.msg('请输入昵称');
            } else if (memberName.trim().length>4){
                this.$api.msg('请输入4个字以内的姓名');
            } else {
                this.saveMemInfo('memberTrueName', memberName);
            }
                
        },
        //清空输入值
        clearCon() {
            this.memberName = '';
        },
        navTo(url) {
            this.$Router.push(url)
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
                if (res.state == 200) {
                    uni.showToast({
                        title:'修改成功！',
                        icon:'none',
                        duration:500
                    })
                    setTimeout(()=>{
                        this[index] = val;
                        //更新上个页面的会员昵称
                        var pages = getCurrentPages(); //当前页面栈  
                        if (pages.length > 1) {
                            var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
                            beforePage.$vm.updateMemInfo(index,val); //触发上个面中的方法updateMemInfo()  
                        }
                        this.$Router.back(1)
                    },700)
                }
            }).catch(() => {
                //异常处理
            })
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

    .edit_nick_name {
        margin-top: 20rpx;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .member_nickname_btn{
            width: 680rpx;
            height: 80rpx;
            background: var(--confirmBtnBgColor);
            border-radius: 37rpx;
            margin: 40rpx auto 0;
            font-size: 34rpx;
            
            font-weight: 500;
            color: var(--confirmBtnTextColor);
            line-height: 80rpx;
            text-align: center;
        }
    }

    .edit_nick_name .input_wrap {
        height: 100rpx;
        padding: 0 20rpx;
        width: 100%;
        background-color: #fff;
    }

    .edit_nick_name .input_wrap input {
        width: 450rpx;
        color: #2D2D2D;
        font-size: 28rpx;
    }

    .edit_nick_name .input_wrap .clear_con {
        font-size: 35rpx;
        color: #DCDCDC;
    }

    .edit_nick_name .count {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        padding-right: 20rpx;
        margin-top: 20rpx;
    }

    .edit_nick_name .count text {
        font-size: 28rpx;
        color: #2D2D2D;
    }

    .edit_nick_name .count .cur_count {
        color: var(--radioCheckedColor);
    }
</style>
