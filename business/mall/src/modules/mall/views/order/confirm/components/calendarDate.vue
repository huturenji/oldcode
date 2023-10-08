<!-- 提交订单页面的选择发票信息弹窗页-->
<template>
    <div class="promise-date-container">
        <template>
            <div class="title-box">
                <AddressTitle title="配送时间" @closePopup='closePopup' :showBottomBorder='true'></AddressTitle>
            </div>
        </template>
        <template>
            <div class="express_name">
                <div class="item">送货时间</div>
            </div>

            <div class="time_container">
                <div class="left_date" :class="{singleLeft: !hasTimeRange}">

                    <template v-if="hasTimeRange > 0"> 
                        <div class="item" :class="{active: item.selected}" @click="clickDateItem(item, index)" v-for="(item, index) in list" :key="index">
                            {{item.dateStr | dateFormat}}
                        </div>
                    </template>

                    <template v-else> 
                        <div class="item" :class="{active: item.selected}" @click="clickDateItem(item, index)" v-for="(item, index) in list" :key="index">
                            <span>{{item.dateStr | dateFormat}}</span>
                            <span>
                                <Icon v-if="item.selected" type='icon_mall_yixiadan' size=".4"/>
                                <Icon v-else type='icon_mall_checkbox_nor' size=".4"/>
                            </span>
                        </div>
                    </template>
                </div>
                <div v-if="hasTimeRange > 0" class="right_date">
                    <div class="item" @click="clickTimeItem(item, index)" v-for="(item, index) in timeRangeList" :key="index">
                        <span>{{item.timeRange}}</span>
                        <span>
                            <Icon v-if="item.selected" type='icon_mall_yixiadan' size=".4"/>
                            <Icon v-else type='icon_mall_checkbox_nor' size=".4"/>
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template>
            <div class="btn-box">
                <div class="btn-handler cursor-btn normal-btn" @click="confirm">
                    <span class="btn-text">确定</span>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import Icon from 'common/components/base/Icon';
import AddressTitle from 'common/components/base/AddressTitle.vue';
import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';

export default {
    name:'promise-date',
    components: {
        AddressTitle,
        Icon,
    },
    mixins: [scrollLockMixin],
    props: {
        //传进来的数据
        value: {
           type: Array,
           default: () => [],
           require: true
        },
        show: {
           type: Boolean
        },
        dateType:{
            type: String
        }

    },
    filters:{
        dateFormat: function (value) {
            try{
                let startDate = new Date(value.replace(/\-/g, '/'));
                let dateStr = startDate.format("MM月dd日");
                let week = extendUtils.indexToWeek(startDate.getDay());
                return `${dateStr}(${week})`;
            }catch(e){
                return value;
            }
        }
    },
    computed:{
        //是否有时间段的选择
        hasTimeRange(){
            return this.timeRangeList.length > 0;
        },
    },
    data(){
        return {
            dateRangeList: [], //选择的时间的data数据 日期
            timeRangeList: [], //选择的时间的data数据 小时
            list: [], //列表数据
        } 
    },
    created(){

        
    },
    mounted(){
       this.initData();
    },

    watch:{

    },
    methods: {
        //初始化相关的数据
        initData(){
            this.list = JSON.parse(JSON.stringify(this.value));
            
            let selectedArr = this.list.filter(item=>{
                return !!item.selected
            })
            if(selectedArr.length == 1){
                this.timeRangeList = !!selectedArr[0].timeRangeList && selectedArr[0].timeRangeList;
            }else{
                this.timeRangeList = [];
            }
        },
        
        //点击每一个日期的选项 
        clickDateItem(item, index){
            //将每一项置为false,将当前点击的项置为true
            this.list.forEach((element, i) => {
                let flag = false;
                if(index == i){
                    flag = true;
                }
                this.$set(element, 'selected', flag);
            });
            this.timeRangeList = !!item.timeRangeList && item.timeRangeList;
        },

        //点击每一个时间段的选项 
        clickTimeItem(item, index){
            let dateIndex = this.list.findIndex(temp => {
                return !!temp.selected
            })

            this.list.forEach((temp, i) => {
                if(i == dateIndex){
                     this.list[i].timeRangeList.forEach((element, j) => {
                         if(index == j){
                            this.$set(element, 'selected', true);
                         }else{
                            this.$set(element, 'selected', false);
                         }
                    });
                }else{
                    this.list[i].timeRangeList.forEach(element => {
                        this.$set(element, 'selected', false);
                    });
                }
            })
        },

        // 关闭弹窗
        closePopup(){
            this.$emit('closeCalendarDatePopup');
        },

        //点击确定按钮
        confirm(){
           //判断是否选中了时间段
           let flag = true;
           let arrDate = this.list.filter(item => {
               return item.selected;
           })
           
           if(arrDate.length > 0 && !!arrDate[0].timeRangeList.length > 0){
               let timeArr = arrDate[0].timeRangeList.filter(item => {
                   return item.selected;
               })
               if(timeArr.length <= 0){
                   extendUtils.showToast('请选择配送时间段')
                   return
               }
           }

           this.$emit('input', this.list);
           this.$emit('closeCalendarDatePopup')
        }
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/confirm/calendarDate.less';
</style>