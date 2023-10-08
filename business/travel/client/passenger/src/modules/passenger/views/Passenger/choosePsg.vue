<template>
  <div>
     <!-- 新增的乘客列表 -->
    <div class="psg_box">
      <div class="psg_box_title">
        <span class="title">{{title}}</span>
        <span class="title_tips">已选择：成人{{customerList.length}}人</span>
      </div>
      <ul>
        <li 
          @click="clickPsgItem(psgItem)" 
          v-for="(psgItem,index) in newPsgList" 
          :key='index' 
          :class="{selected: handlePsg(psgItem, customerList)}">
          {{psgItem.name ? psgItem.name: (psgItem.firstName + psgItem.lastName)}}
        </li>
        <li @click="addCustomer" class="add_psg">
          <icon type="icon_common_add" size='.32' />
          <span>新增</span>
        </li>
      </ul>
    </div> 
  </div>
</template>
<script>
// import passengerHandler from './passengerHandler.js';
import icon from "components/icon/index.vue"
export default {
    name:'swp-psg-choose',
    data: function() {
        return {};
    },
    props:{
        title: String,
        //乘客列表
        psgList:{
            type:Array,
            default:()=>{
                return []
            }
        },
        customerList:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    components:{
        icon
    },
    computed: {
        newPsgList(){
            let newArr = [];
            for (let i=0;i<this.psgList.length;i++){
                if (i<=6){
                    newArr.push(this.psgList[i])
                }

            }
            return newArr;
        }
    },
    mounted() {},
    methods: {
        addCustomer(){
            this.$emit('addCustomer');
        },
        clickPsgItem(psgItem){
            let that = this;
            that.$emit('cliPsgItem', psgItem);
        },
        // pagItem是否在customerList存在  返回true or false
        handlePsg(psgItem, customerList){
            let flag = false;
            for (let i=0;i<customerList.length;i++){
                if (customerList[i].passengerId == psgItem.passengerId){
                    flag = true;
                    break;
                }
            }
            return flag;
        }
    }
};
</script>
<style lang="less" scoped>
@import '~themes/default/styles/choosePsg.less';
</style>
