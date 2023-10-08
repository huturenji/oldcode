<template>
    <div class="checkRecordList-filter">
       <div class="filter_box">
           <div class="filter_item filter_type">
               <div class="title">发票类型</div>
               <ul class="clearfix">
                   <li @click="clickFilterOption(item.code)" v-for="(item,index) in invoiceTypeList" :key="index" :class="{allOption:item.code==0,active:isSelected(item.code,selectedOption)}">{{item.name}}</li>
               </ul>
           </div>
       </div>
       <!-- 筛选底部的按钮 -->
       <div class="btm_btn">
           <div @click="clearFilter" class="reset">重置</div>
           <div @click="confirmFilter" class="confirm">确定</div>
       </div>
    </div>
</template>
<script>
import {invoiceTypeList} from '../common/checkInvoiceManagement';
export default {
    data(){
        return {
            invoiceTypeList:invoiceTypeList,
            selectedOption:[''] //选中的发票类型筛选条件 默认选中全部的
        }
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
                if (code != ''){ //针对全部做特殊处理
                    let index = that.selectedOption.indexOf(code);
                    that.selectedOption.splice(index,1);
                }
            } else { //说明未被选中
                that.selectedOption.push(code);
                //将全部的类型样式移除
                if (code==''){
                    that.selectedOption = [''];
                } else {
                    let index = that.selectedOption.indexOf('');
                    if (index>-1){
                        that.selectedOption.splice(index,1);
                    }
                }
            }
        },
        //重置筛选条件
        clearFilter(){
            this.selectedOption = [''];
            this.$emit('clearInvoiceCode');
        },
        //确认筛选
        confirmFilter(){
            this.$emit('confirmFilter',this.selectedOption);
        }
    }
}
</script>
<style lang="less" scoped>
@import '~themes/default/styles/checkRecordListFilter.less';
</style>
