<template>
    <!-- 拼团 查看更多 start  拼单-->
    <view>
        <div class="goods-detail-team teams" v-if="pinTeam.length>0">
            <view class="make_group">
                <text class="make_group_num"><text class="pin_title">拼团</text>{{joinedNum}}{{$L("人正在拼单,可直接参与")}}</text>
                <view class="make_groip_more" @tap="make_group_more_fun">
                    <text>{{$L("查看更多")}}></text>
                </view>
            </view>
            <block v-for="(pin_team_item, i) in pinTeam" :key="i">
                <block>
                    <view v-if="i<=1" class="make_group_content">
                        <view class="make_group_content_left">
                            <view class="make_group_content_left">
                                <image :src="pin_team_item.avatar" class="make_group_avator"></image>
                                <view :data-id="pin_team_item.id" class="make_group_name">{{pin_team_item.member_name}}</view>
                            </view>
                        </view>
                        <view class="make_group_right">
                            <view class="make_group_right1">
                                <div class="make_group_right1">
                                    <span class="make_group_missing">{{$L('还差')}}<text>{{pin_team_item.missingNum}}</text>人</span>
                                    <view class="make_group_end">{{$L('距结束')}}<text>{{pin_team_item.distanceEndTime}}</text></view>
                                </div>
                            </view>
                            <view class="make_group_right2" v-if="pin_team_item.isSelf" @tap="handleJoinGroup" :data-teamid="pin_team_item.spellTeamId"
                             :data-isown="pin_team_item.isSelf ? true : false">{{$L("我的团")}}</view>
                            <view class="make_group_right2" v-else @tap="handleJoinGroup" :data-isown="pin_team_item.isSelf? true : false" :data-teamid="pin_team_item.spellTeamId">去参团</view>
                        </view>
                    </view>
                </block>
                <!-- <block v-else>
                    <view :data-time="pin_team_item.endd" v-if="i<=1" class="make_group_content" :tid="pin_team_item.id">
                        <view class="make_group_content_left">
                            <image :src="pin_team_item.avatar" :data-id="pin_team_item.id" class="make_group_avator"></image>
                            <view :data-id="pin_team_item.id" class="make_group_name">{{pin_team_item.member_name}}</view>
                        </view>
                        <view class="make_group_right">
                            <view class="make_group_right1" :data-id="pin_team_item.id">
                                <span class="make_group_missing">还差<text>{{pin_team_item.sheng}}</text>人</span>
                                <view class="make_group_end">距结束<text>{{pin_team_item.end_time}}</text></view>
                            </view>
                            <view class="make_group_right2" v-if="pin_team_item.is_own" @tap="handleJoinGroup" :data-teamid="pin_team_item.id"
                             :data-isown="pin_team_item.is_own ? true : false">我的团</view>
                            <view class="make_group_right2" v-else @tap="handleJoinGroup" :data-teamid="pin_team_item.id" :data-isown="pin_team_item.is_own ? true : false">去参团</view>
                        </view>
                    </view>
                </block> -->
            </block>
        </div>
        <!-- 拼团 查看更多 end -->
        
        
        <view class="join_group" v-if="join_group" @touchmove.stop.prevent="moveHandle">
            <view class="join_group_title">
                <text>{{$L("参与")}}{{pinDetail.leaderMemberName}}拼单</text>
                <image :src="imgUrl + 'common/icon/close2.png'" @tap="hidden_mask"></image>
            </view>
            <view class="join_group_content">
                <view class="join_group_des">
                    <view class="group_des_title">{{$L("参与")}}{{pinDetail.leaderMemberName}}{{$L("的拼单")}}</view>
                    <view class="group_des_miss">还差<text>{{pinDetail.missingNum}}</text>人</view>
                </view>
                <view class="join_group_time">
                    <text>{{$L("距离结束")}}</text>
                    <text>{{pinDetail.distanceEndTime}}</text>
                </view>
                <view class="join_group_pro">
                    <template v-for="(item, index) in pinDetail.memberList">
                        <view  :key="index" class="join_group_pre" v-if="index < 1">
                            <image :src="item.memberAvatar"></image>
                            <text v-if="item.isLeader == 1">{{$L("团长")}}</text>
                        </view>
                    </template>
                    <view class="add_group">
                        <image :src="imgUrl + 'activity/add_group.png'"></image>
                    </view>
                </view>
                <image class="handleAddGroup" v-if="!pinDetail.isSelf" :data-id="pinDetail.id" @tap="switchSpecifications" data-type="join_group"
                 :src="imgUrl + 'activity/join_group.png'"></image>
            </view>
        </view>
        <view class="make_order_more" v-if="make_group_more" @touchmove.stop.prevent="moveHandle">
            <view class="make_order_title">
                <text>{{$L("正在拼单")}}</text>
                <image :src="imgUrl + 'common/icon/close2.png'" @tap="hidden_mask"></image>
            </view>
            <scroll-view class="make_order_content" scroll-y>
                <view v-for="(pin_team_item, index) in pinTeam" :key="index" class="make_order_pre">
                    <view class="make_order_pre_left">
                        <image class="make_order_image" :src="pin_team_item.avatar"></image>
                        <view class="make_order_des">
                            <view class="make_order_des_top">
                                <text>{{pin_team_item.member_name}}</text>
                                <text>{{$L("还差")}}{{pin_team_item.missingNum}}{{$L("人")}}</text>
                            </view>
                            <view class="make_order_des_bot">
                                {{$L("剩余")}} <text id="make_order_des_pre">{{pin_team_item.distanceEndTime}}</text>
                            </view>
                        </view>
                    </view>
                    <view class="my_group" v-if="pin_team_item.isSelf" @tap="handleJoinGroup"
                     :data-teamid="pin_team_item.spellTeamId" :data-isown="pin_team_item.is_own ? true : false">{{$L("我的团")}}</view>
                    <view class="my_group" v-else @tap="handleJoinGroup" :data-teamid="pin_team_item.spellTeamId"
                     :data-isown="pin_team_item.isSelf ? true : false">{{$L("去参团")}}</view>
                </view>
            </scroll-view>
        </view>
        
    </view>
    
</template>

<script>
import goodsHandler from '@/components/goods/handler';   
export default {
    props:['spu','spellId'],
    data(){
        return {
            imgUrl:getApp().globalData.imgUrl,
            pinTeam:[],
            pinDetail:{},
            join_group:false,
            make_group_more:false,
            joinedNum:''
        }
    },
    created() {
        this.getPinTeam()
    },
    methods:{
            
        getPinTeam(){
            let {spu,spellId} = this
            let param = {
                spu,
                spellId
            }
            goodsHandler.getPinTeamList(param).then(res=>{
                if (res.state==200){
                    this.pinTeam = res.data.list
                    if (res.data.list[0]){
                        this.joinedNum=res.data.list[0].joinedNum;
                    }
                    this.pinTeam.forEach(i=>{
                        i.avatar = i.memberList[0].memberAvatar
                        i.member_name = i.memberList[0].memberName
                    })
                    this.calTime(this.pinTeam)
                }
            })
        },
            
        calTime(zbcp) {
            zbcp.forEach(item => {
                let counttime = item.distanceEndTime;
                let days = 0
                let hours = 0
                let minutes = 0
                let seconds = 0
                this.secInterval = setInterval(() => {
                    if (counttime == 0) {
                        clearInterval(this.secInterval);
                    } else {
                        counttime--;
                        days = parseInt(counttime / 60 / 60 / 24)>0?parseInt(counttime / 60 / 60 / 24):0;
                        hours = parseInt(counttime / 60 / 60 % 24)>0?parseInt(counttime / 60 / 60 % 24):0;
                        minutes = parseInt(counttime / 60 % 60)>0?parseInt(counttime / 60 % 60):0;
                        seconds = parseInt(counttime % 60)>0?parseInt(counttime % 60):0;
                        let arr = [days,hours,minutes,seconds].map(i=>
                            i.toString().length>1?i:'0'+i
                        )
                        item.distanceEndTime = arr.join(':')
                    }
                }, 1000)
            })
        },
            
        switchSpecifications(){
            this.$emit('handleJoinGroup',{pinState:3})
            this.join_group = false
            this.make_group_more = false
        },
            
        hidden_mask(){
            this.$emit('handleJoinGroup',{pinState:2})
            this.join_group = false
            this.make_group_more = false
        },
        handleJoinGroup(e) {
            let spellTeamId = e.currentTarget.dataset.teamid
            this.$emit('handleJoinGroup',{pinState:1,spellTeamId})
            this.join_group = true
            this.make_group_more = false
            this.pinDetail = this.pinTeam.find(i=>i.spellTeamId == spellTeamId)
            this.$forceUpdate()
        },
            
        make_group_more_fun() {
            this.$emit('make_group_more_fun')
            this.make_group_more = true
                
        }
    }
}
</script>

<style lang="scss">
    .goods-detail-team {
        background: #fff;
        margin-top: 17.94rpx;
        padding: 20rpx 20rpx 0;
        box-sizing: border-box;
    }
    
    .goods-detail-team>.teams_h4 {
        font-size: 27.6rpx;
        color: #333;
    }
    
    .goods-detail-team .teams_a {
        display: block;
        border: 1px #ee1b21 solid;
        border-radius: 100px;
        height: 49px;
        width: 100%;
        overflow: hidden;
        margin-top: 15px;
    }
    
    .pin_title{
        font-size: 28rpx;
        
        font-weight: 500;
        color: #666666;
        margin-right: 36rpx;
    }
    
    .goods-detail-team b {
        width: 100%;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 25.3rpx;
        color: #888;
        font-weight: normal;
        margin-top: 10px;
    }
    
    .goods-detail-team .teams_a image {
        float: left;
        width: 45px;
        height: 45px;
        margin: 2px;
        border-radius: 92rpx;
    }
    
    .goods-detail-team .teams_a .team_item_h2,
    .goods-detail-team .teams_a .team_item_h4 {
        font-size: 27.6rpx;
        line-height: 15px;
        display: block;
    }
    
    .goods-detail-team .teams_a .team_item_h3,
    .goods-detail-team .teams_a .team_item_h5 {
        font-size: 24rpx;
        
        font-weight: 500;
        color: #333333;
        line-height: 36rpx;
    }
    
    .make_group_end {
        font-size: 24rpx;
        
        font-weight: 500;
        color: #333333;
        line-height: 36rpx;
    }
    
    .make_group_end text {
        color: #999999;
    }
    
    .goods-detail-team .teams_a .team_item_h3 {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 19px;
    }
    
    .goods-detail-team .teams_a .fl {
        float: left;
        width: 21%;
        padding: 5px 0 5px 4px;
    }
    
    .goods-detail-team .teams_a .team_item_h6,
    .goods-detail-team .teams_a .fr {
        float: right;
    }
    
    .goods-detail-team .teams_a .fr {
        text-align: right;
        padding: 12rpx 10rpx 12rpx 0;
        height: 49px;
        line-height: 49px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
    }
    
    .goods-detail-team .teams_a .team_item_h6 {
        line-height: 49px;
        background: #ee1b21;
        color: #fff;
        display: block;
        padding: 0 15px;
        font-size: 32.2rpx;
    }
    
    .goods-detail-team .teams_a .team_item_h6:before {
        content: '去参团';
        display: inline-block;
    }
    
    .goods-detail-team .teams_a .team_item_h6:after {
        display: inline-block;
        margin-left: 10px;
        width: 5px;
        content: ' ';
        height: 5px;
        border-left: 1px #fff solid;
        border-top: 1px #fff solid;
        transform: rotate(135deg);
        vertical-align: middle;
    }
    
    .goods-detail-team .teams_a.on .team_item_h6:before {
        content: '已选择';
    }
    
    .goods-detail-team .teams_a .team_item_h6.own:before {
        content: '我的团';
    }
    
    .goods-detail-team .teams_a .team_item_h6.oth:before {
        content: '其他团';
    }
    
    .goods-detail-team .teams_a .team_item_h4 {
        color: #ee1b21;
    }
    
    .goods-detail-team .teams_a .team_item_h5 {
        line-height: 12px;
    }
    
    .make_group {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
    }
    
    .make_group_num {
        font-size: 26rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 45rpx;
    }
    
    .make_groip_more {
        display: flex;
        align-items: center;
    }
    
    .make_groip_more text {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(251, 27, 27, 1);
    }
    
    .make_groip_more image {
        width: 12rpx;
        height: 20rpx;
    }
    
    .make_group_content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 125rpx;
        border-bottom: 1rpx solid #E5E5E5;
    }
    
    .make_group_content:nth-last-of-type(1) {
        border-bottom: 0;
    }
    
    .make_group_content_left {
        display: flex;
        align-items: center;
    }
    
    .make_group_avator {
        width: 64rpx;
        height: 64rpx;
        background: rgba(208, 208, 208, 1);
        border-radius: 50%;
    }
    
    .make_group_name {
        font-size: 32rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 45rpx;
        margin-left: 20rpx;
    }
    
    .make_group_missing {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 36rpx;
    }
    
    .make_group_missing text {
        color: #FC1C1C;
    }
    
    .make_group_right {
        display: flex;
        align-items: center;
    }
    
    .make_group_right1 {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-right: 20rpx;
    }
    
    .make_group_right2 {
        width: 120rpx;
        height: 50rpx;
        background: rgba(252, 28, 28, 1);
        border-radius: 25rpx;
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 50rpx;
        text-align: center;
    }
    
    .make_rroup_time {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 36rpx;
    }
    
    .make_rroup_time text {
        color: #999999;
    }
    
    .join_group {
        width: 580rpx;
        height: 415rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        position: fixed;
        z-index: 100;
        left: 50%;
        top: 50%;
        margin-left: -290rpx;
        margin-top: -207rpx;
    }
    
    .join_group_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        box-sizing: border-box;
        height: 80rpx;
        border-bottom: 1rpx solid #F7F7F7;
    }
    
    .join_group_title text {
        font-size: 32rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 45rpx;
    }
    
    .join_group_title image {
        width: 22rpx;
        height: 22rpx;
    }
    
    .join_group_content {
        padding-top: 38rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .join_group_des {
        display: flex;
        align-items: center;
    }
    
    .group_des_title {
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 45rpx;
        margin-right: 30rpx;
    }
    
    .group_des_miss {
        font-size: 28rpx;
        
        font-weight: 500;
        color: #999;
        line-height: 45rpx;
    }
    
    .group_des_miss text {
        color: #FC1D1B;
    }
    
    .join_group_time {
        display: flex;
        align-items: center;
        margin-top: 19rpx;
    }
    
    .join_group_time text:nth-child(1) {
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(148, 148, 148, 1);
        line-height: 45rpx;
    }
    
    .join_group_time text:nth-child(2) {
        font-size: 24rpx;
        
        font-weight: 500;
        color: #FF0000;
        line-height: 45rpx;
        margin-left: 20rpx;
    }
    
    .join_group_pro {
        display: flex;
        align-items: center;
        margin: 25rpx 0 20rpx;
    }
    
    .join_group_pre {
        position: relative;
    }
    
    .join_group_pre image {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
    }
    
    .join_group_pre text {
        position: absolute;
        bottom: 13rpx;
        left: 10rpx;
        width: 54rpx;
        height: 26rpx;
        background: rgba(255, 0, 0, 1);
        border-radius: 13rpx;
        font-size: 20rpx;
        
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .add_group,
    .add_group image {
        width: 80rpx;
        height: 80rpx;
    }
    
    .handleAddGroup {
        width: 240rpx;
        height: 50rpx;
    }
    
    .make_order_more {
        width: 580rpx;
        height: 773rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 15rpx;
        position: fixed;
        z-index: 100;
        left: 50%;
        top: 50%;
        margin-left: -290rpx;
        margin-top: -386rpx;
    }
    
    .make_order_title {
        width: 100%;
        height: 80rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #F7F7F7;
    }
    
    .make_order_title text {
        font-size: 32rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 45rpx;
    }
    
    .make_order_title image {
        width: 22rpx;
        height: 22rpx;
    }
    
    .make_order_content {
        width: 100%;
        height: 630rpx;
    }
    
    .make_order_pre {
        width: 100%;
        height: 95rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30rpx;
        box-sizing: border-box;
        border-bottom: 1rpx solid #F5F5F5;
    }
    
    .make_order_image {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        margin-right: 19rpx;
    }
    
    .make_order_des {
        display: flex;
        flex-direction: column;
    }
    
    .make_order_des_top {
        display: flex;
    }
    
    .make_order_des_top text:nth-child(1) {
        font-size: 28rpx;
        
        font-weight: 500;
        color: rgba(45, 45, 45, 1);
        line-height: 45rpx;
    }
    
    .make_order_des_top text:nth-child(2) {
        font-size: 24rpx;
        
        font-weight: 500;
        color: #999999;
        line-height: 45rpx;
        margin-left: 10rpx;
    }
    
    .make_order_des_bot {
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        line-height: 45rpx;
    }
    
    .my_group {
        width: 120rpx;
        height: 50rpx;
        background: rgba(255, 0, 0, 1);
        border-radius: 25rpx;
        font-size: 24rpx;
        
        font-weight: 500;
        color: rgba(248, 248, 248, 1);
        line-height: 50rpx;
        text-align: center;
    }
    
    .group_pre_num {
        display: fixed;
        bottom: 0;
        z-index: 250;
        font-size: 22rpx;
        
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        line-height: 45rpx;
        text-align: center;
    }
    
    .make_order_pre_left {
        display: flex;
        align-items: center;
    }
    
</style>
