<!-- 提交订单页面的选择发票信息弹窗页-->
<template>
    <div class="promise-date-container">
        <template>
            <div class="title-box">
                <AddressTitle title="配送时间" @closePopup='closePopup' :showBottomBorder='true'></AddressTitle>
            </div>
        </template>
        <template>
            <div class="date-wrap">
                <div class="item-container" v-for="(item, index) in list" :key="index">
                    <div class="imgList">
                        <span v-for="(temp, i) in item.imgPathList" :key="i"><thumbnail :src="temp"/></span>
                    </div>
                    <div v-if="!!item.deliveryTimeStr" @click="clickItem(item, index)" class="des-box">
                        <div class="des-content">
                            <p class="name">{{item.showName}}送货时间</p>
                            <p class="time">{{item.deliveryTimeStr}}</p>
                        </div>
                        <div>
                            <Icon type='icon_common_rightarrow' size=".24"/>
                        </div>
                    </div>
                    <div v-else class="des-box">
                        <div class="des-content">
                            <p class="name">{{item.showName}}送货时间</p>
                            <p class="time">{{factoryDateTips}}</p>
                        </div>
                    </div>
                    <!-- 当大件安装时间日历存在时，才显示 -->
                    <div @click="clickInstallItem(item, index)" class="des-box" v-if="item.calendarDayInstallDays.length > 0">
                        <div class="des-content">
                            <p class="name">{{item.showName}}安装时间</p>
                            <p class="time">{{item.installTimeStr}}</p>
                        </div>
                        <div>
                            <Icon type='icon_common_rightarrow' size=".24"/>
                        </div>
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
import {skuClassifyMap, factoryDateTips} from 'common/lib/enum/orderStatusEnum';
import thumbnail from 'commonComp/goodsThumb/thumbnail.vue';
import invoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
import Icon from 'common/components/base/Icon';
import AddressTitle from 'common/components/base/AddressTitle.vue';
import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
import baseHandler from 'common/lib/requestHandler/base.js'
export default {
    name:'promise-date',
    components: {
        AddressTitle,
        Icon,
        thumbnail,
    },
    mixins: [scrollLockMixin],
    props: {
        //传进来的数据
        productPromiseCalendars: {
           type: Array,
           default: () => [],
           require: true
        },
        //传进来的商品列表数据，目前是用来显示弹窗顶部的图片的
        productList: {
           type: Array,
           default: () => [],
           require: true
        },
        show:{
            type: Boolean
        }
    },
    data(){
        return {
            list: [],
            factoryDateTips: factoryDateTips,
        } 
    },
    created(){
       
    },
    mounted(){
        this.list = JSON.parse(JSON.stringify(this.productPromiseCalendars));
        this.dealData();
    },
    computed:{
       
    },
    watch:{
        productPromiseCalendars: {
            handler(val){
                this.list = JSON.parse(JSON.stringify(this.productPromiseCalendars));
                this.dealData();
            },
            deep: true
        }
    },
    methods: {
        // 处理相关显示信息
        dealData(){
            this.list.forEach((item, index) => {
                let imgArr = [];
                item.skus.forEach(element => {
                    let selectedItem = this.productList.filter(item=>{
                        return element == item.sku;
                    })
                    selectedItem.length > 0 && imgArr.push(selectedItem[0].imagePath)
                });

                //处理配送时间展示
                let deliveryTimeStr = '';
                let dataArr = [];
                let installDays = [];
                if(item.calendarList && item.calendarList.length > 0){//说明有配送日历
                    let dateStr = '';
                    let timeStr = '';
                    dataArr = item.calendarList.filter(item => {
                        return item.selected;
                    })

                    if(dataArr.length >= 1 && !!dataArr[0].dateStr){
                        dateStr = this.formateDateTime(dataArr[0].dateStr);
                        if(!!dataArr[0].timeRangeList && dataArr[0].timeRangeList.length > 0){
                            let timeArr = dataArr[0].timeRangeList.filter(item => {
                                return item.selected;
                            })
                            if(timeArr.length>=1 && !!timeArr[0].timeRange){
                                timeStr = `${timeArr[0].timeRange}`
                            }
                        }
                        deliveryTimeStr = `${dateStr} ${timeStr}`;
                    }
                }

                //处理安装时间展示
                let installTimeStr = '';
                if(item.installDays && item.installDays.length > 0){//说明有安装日历                        
                    let selectedInstallArr = item.installDays.filter(item => {
                        return item.selected;
                    })

                    if(selectedInstallArr.length >= 1 && !!selectedInstallArr[0].dateStr){
                        let timeStr = '';
                        let dateStr = this.formateDateTime(selectedInstallArr[0].dateStr);
                        if(!!selectedInstallArr[0].timeRangeList && selectedInstallArr[0].timeRangeList.length > 0){
                            let timeArr = selectedInstallArr[0].timeRangeList.filter(item => {
                                return item.selected;
                            })
                            if(timeArr.length>=1 && !!timeArr[0].timeRange){
                                timeStr = `${timeArr[0].timeRange}`
                            }
                        }
                        installTimeStr = `${dateStr} ${timeStr}`;
                    }  
                }

                this.$set(item, 'imgPathList', imgArr);
                this.$set(item, 'deliveryTimeStr', deliveryTimeStr);
                this.$set(item, 'installTimeStr', installTimeStr);
                if(!!!item.skuClassify){ //如果没有大小件，此时显示快递1 2 3
                    item.skuClassify = 100;
                }
                let showName = item.skuClassify == 100 ?`${skuClassifyMap[item.skuClassify]}${++index}` : skuClassifyMap[item.skuClassify];

                this.$set(item, 'showName', showName);
            })
        },

         //格式化送货时间安装的日期
        formateDateTime(date){  
            let startDate = new Date(date.replace(/\-/g, '/'));
            let dateStrFor = startDate.format("MM月dd日");
            let week = extendUtils.indexToWeek(startDate.getDay());
            return `${dateStrFor} (${week})`;
        },

        //点击确定按钮的回调
        confirm(){
            this.$emit('input', this.list);
            this.$emit('closeDetailDatePopup');
        },

        closePopup(){
            this.$emit('closeDetailDatePopup');
        },
        
        clickItem(item, index){
            let calendarList = item.calendarList
            this.$emit('showCalendarPop', calendarList, index);
        },

        //安装安装的时间
        clickInstallItem(item, index){
            let installDays = item.installDays;
            this.$emit('showCalendarInstallPop', installDays, index);
        },
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/confirm/deliveryDetailPop.less';
</style>