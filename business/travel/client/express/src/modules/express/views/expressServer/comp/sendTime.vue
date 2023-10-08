<template>
    <div class="SendTimeWrap">
        <div class="roomInfoWrap" @touchmove.prevent>
            <div class="roomTit bbpxs">上门时间<div class="but cursorp" @click="$emit('cloose','')"></div>
            </div>                  	
            <div class="sendTimeListWrap">
                <div class="leftWrap">
                    <template  v-for="(group,ind) in sendTimeMap" >
                        <div v-if=" ind > 0 || !todayTabIsHiden" class="tabMenu cursorp" :class="{active:groupIndex == ind}" :key="ind" @click="groupIndex = ind">{{group.name}}</div>
                    </template>
                </div>
                <div class="rightWrap">
                    <div class="itemMenu cursorp" :class="{active:sendTimeId == item.id,Unselectable:((9 > todayHour && item.id == -1) || (groupIndex == 0 && item.id+1 < todayHour && item.id > 0))}" v-for="(item,index) in sendTimeMap[groupIndex].list" :key="index" @click="choosedSendTime(item)">{{item.text}}</div>
                </div>
            </div>
            <div class="bottomButWrap">
                <span class="rsetButton normal-btn" @click="resetData(true)">重置</span>
                <span class="okButton icon-btn" @click="ok">完成</span>
            </div>
        </div>        
    </div>
</template>
<script>
import {sendTimeData} from '../enum/expressEnum.js';
export default {
    components: {
    },
    props:{
        value: {//上门时间id
            type: Number,
            default:0
        },	
        showSendTimeInfo:{
            type:Boolean,
            defaule:false
        },
    },
    data() {
        return {
            sendTimeMap:sendTimeData,//上门时间参数
            groupIndex:0,//默认为今天
            sendTimeId:this.value,//默认选第一个
            todayHour:0,//今天的小时
            todayTabIsHiden:false,//是否隐藏今天
        };
    },
    watch: {
        showSendTimeInfo: function (newValue) {
        let _this = this;
            if (!newValue) {//界面关闭时重置数据
                _this.resetData(true);
            }
        },
    },   
    created() {
        let _this = this;
        _this.initData();
    },
    mounted() {

    }, 
    methods: {
         /**
         * 数据初始化
         */	
        initData(){
            let _this = this;
            let myDate = new Date();
            _this.todayHour = myDate.getHours(); 
            if(9 <= _this.todayHour && _this.todayHour <= 19){
                _this.sendTimeId = -1;
            }
            if(_this.todayHour >= 19){
                _this.groupIndex = 1;
                _this.todayTabIsHiden = true;
            }
        },
         /**
         * 选择选项
         */	
        choosedSendTime(item){
            let _this = this;
            if((9 > _this.todayHour && item.id == -1) || (_this.groupIndex == 0 && item.id+1 < _this.todayHour && item.id > 0)){
                return;
            }
            _this.sendTimeId = item.id;
        },
         /**
         * 确认
         */	
        ok(){
            let _this = this;
            _this.$emit('input',_this.sendTimeId);
            _this.$emit('cloose','');
        },
         /**
         * 重置数据，未点击确认前数据只在组件内部
         */	
        resetData(isOnlyClose){
            let _this = this;
            if(!!isOnlyClose){
                _this.sendTimeId = JSON.parse(JSON.stringify(this.value));
            }
        }
    }
};
</script>
<style scoped lang="less">
@import '~themes/default/styles/expressServer/comp/sendTime.less';
</style>
