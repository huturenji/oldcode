<template>
<div class="filter-container">
    <div class="filter-box">

        <!-- 配送地址的筛选条件 包括仅看有货 和 京东配送的基础的筛选选项 目前该功能实现不了暂时不做 注释掉 -->
        <!-- <div>
            <filterAddressAndBasic v-model="filterOptionsObj.basicFilter" @showAddressComp="showAddressComp" :addressDefault="addressDefault"></filterAddressAndBasic>
        </div> -->

        <!-- 价格区间的筛选条件 -->
        <div>
            <filterPrice v-model="filterOptionsObj.priceRange"></filterPrice>
        </div>

         <!-- 品牌筛选条件 -->
        <div class="top_solit_bar">
            <filterItem :filterItem = 'brandFilterListCopy' :brandSearchType="brandSearchType"></filterItem>
        </div>

        <!-- 通用筛选条件 一期目前不支持 -->
        <!-- <div>
            <filterItem v-for="(item, index) in filterOptionsObj.filterOptionList" :key="index" :filterItem = 'item'></filterItem>
        </div> -->
    </div>
     <!-- 底部的重置和确认按钮  -->
    <div class="bottom-btns">
        <p @click="clearOptions" class="clear-btn red-btn">重置</p>
        <p @click="confirmFun" class="confirm-btn normal-btn">确定</p>
    </div>
</div>
</template>

<script>
import { Popup } from 'vux';
const filterItem = ()=>import('./filterItem.vue');
const filterPrice = ()=>import('./filterPrice.vue');
import extendUtils from 'common/lib/utils';
// import filterAddressAndBasic from "./filterAddressAndBasic.vue";
export default {
    props:{
        value: {
           type:Object,
           default(){
               return {}
           }
        },
        brandFilterList: { //品牌列表筛选的参数
            type: Object,
            default(){
                return {
                    name: '品牌', //筛选标题title
                    selectedName:'全部', //右上角展示的名称
                    showAll: true, //是否显示右上角的全部内容
                    number: 6, //默认显示的数量
                    children:[]
                };
            }
        },
        showfilterPop:{
            type:Boolean,
            default:false,
        },
        brandSearchType:{ //确定筛选支持单选还是多选 single代表单选 multiple代表多选 此处是在config.js配置的
            type:String,
            defaule:true
        }
    },
    data() {
        return {
            filterOptionsObj: JSON.parse(JSON.stringify(this.value)), //所有筛选项的深拷贝
            isClickConfirmBtn: false, //是否是点击确认按钮关闭的弹窗 是的话为true 其余的方式为false
            brandFilterListCopy: JSON.parse(JSON.stringify(this.brandFilterList)), //深拷贝传递过来的品牌筛选的值
            addressDefault: '上海长宁区城区', //默认显示的地址
        }
    },
    components: {
       Popup,
       filterItem,
       filterPrice,
       //filterAddressAndBasic,
    },
    watch:{
        showfilterPop(val){ 
            if(!!val){
                this.isClickConfirmBtn = false;
                this.brandFilterListCopy = JSON.parse(JSON.stringify(this.brandFilterList));//此时必须重新赋值，因为data深拷贝的对象并没有及时更新
                this.filterOptionsObj = JSON.parse(JSON.stringify(this.value));
            }else if(!val && !this.isClickConfirmBtn){//此情况说明是点击非确认按钮关闭的弹窗
                this.filterOptionsObj = JSON.parse(JSON.stringify(this.value));
            }
        },
    },
    created() {
        
    },
    mounted(){
       
    },
    methods:{
        /**
         * 将所有选项的choosed变为false
         */
        clearOptions(){
            //清空所有的选项筛选项
            let that = this;
            //清空价格区间的
            this.filterOptionsObj.priceRange.minPrice = this.filterOptionsObj.priceRange.maxPrice = '';

            //清空基本选项 一期暂时不做
            // this.clearChoosed(this.filterOptionsObj.basicFilter);

            //清空品牌列表的选项
             this.clearChoosed(this.brandFilterListCopy.children);

            //清空所有的基本的筛选项 一期暂时不做
            // this.filterOptionsObj.filterOptionList.forEach(item=>{
            //     that.clearChoosed(item.children);
            // })
              
        },

        /**
         * 将所有选项的choosed变为false
         */
        clearChoosed(arr, key='choosed'){
            if(!!Array.isArray(arr) && arr.length > 0){
                arr.forEach(item=>{
                    item[key] = false;
                })
            }
        },

        /**
         * 点击筛选弹框的确认筛选按钮
         */
        confirmFun(){
            this.isClickConfirmBtn = true;
            //最低价和最高价非必填，若有没填的，不必比较大小
            let min = this.filterOptionsObj.priceRange.minPrice*1;
            let max = this.filterOptionsObj.priceRange.maxPrice*1;
            //价格如果输入0   置为空
            if(this.filterOptionsObj.priceRange.maxPrice === '0'){
                this.filterOptionsObj.priceRange.maxPrice = '';
            }
            if(this.filterOptionsObj.priceRange.minPrice === '0'){
                this.filterOptionsObj.priceRange.minPrice = '';
            }

            if(max != 0){
                 //判断价格区间是否合理
                if(min > max){
                    extendUtils.showToast('价格区间填写错误');
                    this.filterOptionsObj.priceRange.minPrice = this.filterOptionsObj.priceRange.maxPrice = '';
                    return
                }
            }

            //将品牌的数据绑定上 为了产生联动效果
            let newFilterOptionsObj = JSON.parse(JSON.stringify(this.filterOptionsObj));
            newFilterOptionsObj.brandFilterList = JSON.parse(JSON.stringify(this.brandFilterListCopy));
            this.$emit('input', newFilterOptionsObj);
            this.$emit('closeFilterListPop'); //关闭筛选的弹窗
        },
        
    }
} 
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
@btn-linear-gradient-confirm:linear-gradient(140deg,rgba(244,159,93,1) 0%,rgba(232,43,41,1) 100%);
.filter-container{
    background: #fff;
    height: 100%;
    position: relative;
    .filter-box{
        max-height: calc(~ '100% - 1.1rem');
        padding-bottom: 0.2rem;
        overflow-x: hidden;
        overflow-y: scroll;
        .top_solit_bar{
            position: relative;
            &::before{
                position: absolute;
                top: 0;
                display: inline-block;
                height: 0.1rem;
                content: '';
                background: @background-color;
                width: 100%;
            }
        }
    }
    .bottom-btns{
        box-sizing: border-box;
        width: 100%;
        display: flex;
        justify-content: space-around;
        height: 1.1rem;
        padding: 0.16rem 0.2rem;
        position: absolute;
        bottom: 0;
        box-shadow:0px 3px 10px 0px rgba(101,112,242,0.12);
        & > p{
            font-size: 0.28rem;        
            width: 42%;
            border-radius: 0.4rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .clear-btn{
            border: 1px solid @theme-color;
            color: @theme-color;
        }
        .confirm-btn{
            color: #fff;
            .linear-gra-mall-btn(140deg);
        }
    }
}
</style>
