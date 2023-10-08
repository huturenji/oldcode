<template>
    <div class="tripHistoryList-filter">
       <div class="filter_box">
           <div class="filter_item filter_type">
               <div class="title">类型</div>
               <ul class="clearfix">
                   <li @click="clickFilterOption(item.code)" v-for="(item,index) in tripTypes" :key="index" :class="{allOption:item.code==0,active:isSelected(item.code,selectedOption)}">{{item.name}}</li>
               </ul>
           </div>
           <div class="filter_item filter_type">
               <div class="title">出行时间</div>
               <div class="time" @click="onClick">
                    <span class="date begin-date">{{dataRange[0]?new Date(dataRange[0]).format('yyyy-MM-dd'):''}}</span>
                    <span>至</span>
                    <span class="date end-date">{{dataRange[1]?new Date(dataRange[1]).format('yyyy-MM-dd'):''}}</span>
                    <div v-transfer-dom>
                        <popup v-model="show">
                            <SnRangePickerView
                                v-if="forceUpdate"
                                v-model="dataRange"
                                @change="onCalendarValueChange"
                            />
                        </popup>
                    </div>
                </div>
                <div v-if="changeYearTime()" class="tips">
                    <i><icon type="icon_common_prompt" size=".28"/></i>
                    <span>目前仅支持查询最近一年内的历史行程</span>
                </div>
           </div>
       </div>
       <!-- 筛选底部的按钮 -->
       <div class="btm_btn">
           <div @click="clearFilter" class="reset">重置</div>
           <div @click="confirmFilter" class="confirm">确定</div>
       </div>
       <!-- mask蒙层 z-index 500 -->
        <div v-transfer-dom>
            <div v-if="showMask" class="mask_filter"></div>
        </div>
    </div>
</template>
<script>
import icon from 'components/icon';
import {tripTypes} from '../enum/excessEnum';
import {
    SnRangePickerView
} from 'sinosun-ui';
import {
    TransferDom,
    Popup
} from 'vux';
export default {
    directives: {TransferDom},
    components:{
        Popup,
        icon,
        SnRangePickerView
    },
    props:{
       
    },
    data(){
        return {
            tripTypes: tripTypes,
            selectedOption:[0],//选中的发票类型筛选条件 默认选中全部的
            dataRange: [],
            showMask :false,
            show:false,
            forceUpdate:false
        }
    },
    mounted(){
        this.initDate();
    },
    methods:{
        //在selectedOption里面是否被选中 存在返回true
        isSelected(code,selectedOption){
            return selectedOption.indexOf(code)!=-1; 
        },
        //点击的筛选条件
        clickFilterOption(code){
            let that = this;
            if (that.isSelected(code,that.selectedOption)){ //说明已被选中了
                if (code != 0){ //针对全部做特殊处理
                    let index = that.selectedOption.indexOf(code);
                    that.selectedOption.splice(index,1);
                    if (that.selectedOption.length==0){
                        that.selectedOption.push(0);
                    }
                }
            } else { //说明未被选中
                that.selectedOption.push(code);
                //将全部的类型样式移除
                if (code==0){
                    that.selectedOption = [0];
                } else {
                    let index = that.selectedOption.indexOf(0);
                    if (index>-1){
                        that.selectedOption.splice(index,1);
                    }
                }
            }
        },
        //重置筛选条件
        clearFilter(){
            this.selectedOption = [0];
            this.initDate();
        },
        //确认筛选
        confirmFilter(){
            //如果超过一年了提示不能进行筛选
            if (this.changeYearTime()){
                return
            }
            this.$emit('confirmFilter', this.selectedOption, this.dataRange);
        },

        //点击日历组件
        onClick() {  
            this.show = true;
            this.forceUpdate = true; 
            this.showMask = true;
        },
        onCalendarValueChange(val) {
            // console.log('onCalendarValueChange == ', val);
            this.dataRange = val;
            this.show = false;
            this.showMask = false;
            setTimeout(() => {
                this.forceUpdate = false;
            }, 150);
        },
        //初始化日期
        initDate(){
            let that = this;
            that.dataRange = [];
            var pre = new Date();
            pre.setFullYear(pre.getFullYear()-1); 
            that.dataRange.push(pre.format('yyyy-MM-dd'),new Date().format('yyyy-MM-dd'));
        },
        //计算超过一年的时间
        changeYearTime(){
            let flag = false;
            let disDays = new Date(this.dataRange[1]).getTime() - new Date(this.dataRange[0]).getTime();
            if (disDays > 366*24*3600*1000){
                flag = true;
            }
            return flag;
        }
    }
}
</script>
<style>
.vux-popup-mask.vux-popup-show{
    z-index: 490!important;
}
.mask_filter{
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 500;
}
</style>

<style lang="less" scoped>
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.clearfix:after{content:"";display:block;height:0;clear:both;}
*{
    box-sizing: border-box;
}
.tripHistoryList-filter{
    background-color: @sub-background-color;
}
.filter_box{
    padding-left:.3rem; 
    .filter_type{
        padding-top: 0.2rem;
        padding-bottom: 0.3rem;
        border-bottom: 1px solid @border-color-base; 
        &:last-child{
            border-bottom:none 0;
        }
        .title{
            font-size: .28rem;
            color: @text-color;
        }
        ul.clearfix{
            padding-left: 0.3rem;
            li{
                width: 1.9rem;
                font-size: .26rem;
                margin-right: 0.3rem;
                margin-top: 0.3rem;
                float: left;
                cursor: pointer;
                height: .64rem;
                line-height: .64rem;
                text-align: center;
                background: @background-color;
                border-radius:.32rem;
            }
            // allOption样式代表不浮动自己独占一行
            li.allOption{
                float: none;
                width: 1.9rem;
            }
            //active样式为选中的效果
            li.active{
                background: @theme-color;
                color: @sub-background-color;
            }
        }
    }
}
.btm_btn{
    border-top: 1px solid @border-color-base;
    margin-top: 0.3rem;
    height: .92rem;
    line-height: .92rem;
    font-size: .32rem;
    display: flex;
    .reset{
        flex: 2;
        text-align: center;
        background: @sub-background-color;
        cursor: pointer;
    }
    .reset:active{
        opacity: .8;
    }
    .confirm{
        flex: 3;
        text-align: center;
        background: @theme-color;
        color: @sub-background-color;
        cursor: pointer;
    }
    .confirm:active{
        opacity: .8;
    }
}
.time{
    font-size: .28rem;
    color: @text-color;
    margin-top: 0.3rem;
    padding:0 0.6rem 0 0.3rem;
    display: flex;
    align-items: center;
    .date{
        width:2.64rem;
        height:0.64rem;
        line-height: 0.64rem;
        border-radius:0.06rem;
        background:@background-color;
        text-align: center;
        color: @theme-color ;
    }
    .begin-date{
        margin-right: 0.35rem;
    }
    .end-date{
        margin-left: 0.35rem;
    }
}
.tips{
    i{
        display: flex;
        align-items: center;
    }
    .icon_common_prompt{
        fill: @price-color;
        margin-right: .1rem;
    }
    color: @price-color; 
    font-size: 0.26rem;
    margin-top: 0.2rem;
    display: flex;
}
</style>
