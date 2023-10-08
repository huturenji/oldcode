<template>
    <div class="SendTimeWrap">
        <div class="roomInfoWrap" @touchmove.prevent>
            <div class="insuranceTitle lineBorderB">
                <div class="title">{{insurance.productShortName}}</div>
                <div class="price-tip">共 <span class="rmb">￥{{insurance.farePrice*insurancesUser.length}}</span> {{insurancesUser.length}}份</div>
                <div class="closeBut cursorp" @click="$emit('cloose','')"></div>
            </div>                  
            <div class="sendTimeListWrap">
                <!-- <div class="leftWrap">
                    <template  v-for="(group,ind) in SendTimeMap" >
                        <div v-if=" ind > 0 || !todayTabIsHiden" class="tabMenu cursorp" :class="{active:groupIndex == ind}" :key="ind" @click="groupIndex = ind">{{group.name}}</div>
                    </template>
                </div> -->
                <div class="rightWrap">
                    <div class="itemMenu cursorp" :class="{Unselectable:getIsUnableChoosed(item.passengerId)}" v-for="(item,index) in customerList" :key="index" @click="choosed(item)">
                        {{item.name || item.firstName+item.lastName}}
                        <Icon :type='getIsUnableChoosed(item.passengerId) ? "btn_common_checkbox_dis" : arrhaveitem(item.passengerId,insurancesUser,"passengerId") ? "btn_common_checkbox_sel" : "btn_common_checkbox_nor"'
                         size='.38' class='icon-check'/>
                    </div>
                </div>
            </div>
            <div class="bottomButWrap">
                <span class="rsetButton cursorp" @click="resetData(true)">取消</span>
                <span class="okButton cursorp" @click="ok">完成</span>
            </div>
        </div>        
    </div>
</template>
<script>
import Icon from 'components/icon';
export default {
    components: {
        Icon
    },
    props:{
        value: {//选中的乘客数据
            type: Array,
            default(){
                return []
            }
        },
        customerList:{//乘客数组
            type: Array,
            default(){
                return []
            }
        },
        showInsurancesUser:{
            type:Boolean,
            default:false
        },
        insurance:{//保险信息
            type: Object,
            default(){
                return {}
            }
        },
        unableChooseList: {//不可操作的列表
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        return {
            insurancesUser:JSON.parse(JSON.stringify(this.value))
            // unableChooseList:this.unableChooseList,//不可操作的列表
            // insurance:this.insurance//保险信息
        };
    },
    watch: {
        showInsurancesUser: function (newValue) {
            let _this = this;
            if (!newValue) { //界面关闭时重置数据
                _this.resetData(true);
            } else {
                _this.insurancesUser = JSON.parse(JSON.stringify(this.value));
            }
        }
    },   

    mounted() {

    }, 
    methods: {
        /**
        * 维数组是否包含元素
        */
        arrhaveitem(item, arr, key) {
            var isInArr = false;
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (!!key ? arr[i][key] == item : arr[i] == item) {
                    isInArr = true;
                    break;
                }
            }
            return isInArr;
        },
        /**
        * 元素在数组中的索引
        */
        indexOfArr(val, arr, key) {
            for (var i = 0; i < arr.length; i++) {
                if (!!key ? arr[i][key] == val : arr[i] == val) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * 选择选项
         */
        choosed(item){
            let _this = this;
            if (_this.getIsUnableChoosed(item.passengerId)){
                return;
            }
            if (_this.arrhaveitem(item.passengerId,_this.insurancesUser,'passengerId')){
                _this.insurancesUser.splice(_this.indexOfArr(item.passengerId, _this.insurancesUser,'passengerId'), 1);
            } else {
                _this.insurancesUser.push(item);
            }
        },
        /**
         * 确认
         */
        ok(){
            let _this = this;
            _this.$emit('input',_this.insurancesUser);
            _this.$emit('cloose','');
        },
        /**
         * 重置数据，未点击确认前数据只在组件内部
         */
        resetData(isOnlyClose){
            let _this = this;
            if (!!isOnlyClose){
                _this.insurancesUser = JSON.parse(JSON.stringify(this.value));
            }
        },
        /**
        * 判断保险所属人员是否可以勾选
        */
        getIsUnableChoosed(user){
            let _this = this;
            let res = false;
            let len = _this.unableChooseList.length;
            for (let i=0;i<len;i++){
                if (_this.insurance.productNo == _this.unableChooseList[i].productNo && user == _this.unableChooseList[i].passengerId){
                    res = true;
                }
            }
            return res;
        }
    }
};
</script>
<style scoped lang="less">
    @import '~themes/default/styles/common/index.less';
    @import '~styles/mixins/hairLine.less';
.SendTimeWrap{
    .roomInfoWrap {
        background: #Fff;
        .insuranceTitle {
            padding: 0.06rem 0.06rem 0.06rem 0.3rem;
            font-size: 0.32rem;
            font-weight: bold;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            .title{
                flex: 1;
                padding:0.3rem 0;
            }
            .price-tip{
                font-size: 0.3rem;
                font-weight: normal;
                span{
                    color: @danger-color-light; 
                    font-size: 0.32rem;
                    font-weight: bold;
                }
            }
            .closeBut {
                width: 0.9rem;
                height: 0.9rem;
                background: url(~assets/img/common/icon_comp_close.png) no-repeat right 0.3rem center;
                background-size: 0.3rem;
                &:active{
                    background: url(~assets/img/common/icon_comp_close_pre.png) no-repeat right 0.3rem center;
                    background-size: 0.3rem;
                }
            }
        }
        .sendTimeListWrap{
            display: flex;
            font-size: 0.3rem;
            background: #fff;
            min-height: 5.3rem;
            .leftWrap{
                width: 2.55rem;
                .tabMenu{
                    line-height: 0.88rem;
                    text-align: center;
                    &.active{
                        color: @theme-color;
                        background: #fff;
                    }
                }
            }
            .rightWrap{
                flex: 1;
                padding: 0 .3rem;
                .icon-check{
                    fill: @theme-color;
                }
                .itemMenu{
                    line-height: 0.88rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
            }
        }
    }
    .bottomButWrap {
        display: flex;
        box-shadow:0px 0px 0.1rem 0px rgba(0, 0, 0, 0.1);
        span {
            flex: 1;
            line-height: 1rem;
            font-size: 0.32rem;
            text-align: center;
            &:active{
                background: #e5e5e5;
            }
        }
        .okButton {
            color: #fff;
            background: @theme-color;
            &:active{
                background: @theme-color;
            }
        }
    }    
}

</style>
