<!-- 接收设置 -->
<template>
    <view class="container">
        <!-- 资产消息 -->
        <view class="setting_item_wrap" v-for="(item,index) in settingList" :key="index">
            <view class="setting_title">{{item.tplName}}</view>
            <view class="setting_item" v-for="(item2,index2) in item.memberTplList" :key="index2">
                <text>{{item2.tplName}}</text>
                <switch color="#FC2521" :checked="item2.isReceive==1?true:false" class="switch_btn" @change="modifySetting(item2.tplCode,item2.isReceive)"/>
            </view>
        </view>
    </view>
</template>

<script>
import {
    mapState
} from 'vuex';
export default {
    data(){
        return {
            settingList:[] //接收设置列表
        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    onLoad(){
        // this.loadData()
    },
    mounted(){
        this.loadData()
    },
    methods:{
        loadData(){
            let param = {}
            param.url = 'v3/msg/front/msg/setting/list'
            param.method = 'GET'
            this.$request(param).then(res=>{
                if (res.state == 200){
                    this.settingList = res.data
                } else {
                    this.$api.msg(res.msg)
                }
            })
        },
        // 接收设置开关
        modifySetting(tplCode,isReceive){
            let param = {}
            param.url = 'v3/msg/front/msg/setting/isReceive'
            param.method = 'POST'
            param.data = {
                tplCode,
                isReceive:isReceive == 0?1:0
            }
            this.$request(param).then(res=>{
                if (res.state == 200){
                    this.loadData()
                } else {
                    this.$api.msg(res.msg)
                }
            })
        }
    }
}
</script>

<style lang="scss">
    page,
    .container{
        width: 750rpx;
        margin: 0 auto;
        // height:100%;
        // background-color: #f5f5f5;
    }
    .setting_item_wrap{
        width:750rpx;
        box-sizing: border-box;
        padding-left:20rpx;
        background:#fff;
        margin-top:20rpx;
        .setting_title{
            width:100%;
            height:81rpx;
            font-size:32rpx;
            color:#333;
            font-weight: bold;
            display:flex;
            align-items: center;
            border-bottom:1rpx solid rgba(0,0,0,0.05);
        }
        .setting_item{
            display:flex;
            align-items: center;
            height:110rpx;
            justify-content: space-between;
            font-size:28rpx;
            color:#333;
            font-weight: 600;
        }
    }
    .switch_btn ::v-deep .uni-switch-wrapper ::v-deep .uni-switch-input{
        width:80rpx;
        height:40rpx;
        margin-right:30rpx;
    }
    .switch_btn ::v-deep .uni-switch-wrapper ::v-deep .uni-switch-input:after{
        width:36rpx;
        height:36rpx;
    }
    .switch_btn ::v-deep .uni-switch-wrapper ::v-deep .uni-switch-input:before{
        width:36rpx;
        height:36rpx;
    }
    
</style>
