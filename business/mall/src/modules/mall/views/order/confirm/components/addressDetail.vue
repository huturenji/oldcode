<!-- 提交订单页面的选择收货人信息页面-->
<template>
<div @click="chooseAddress" class="address-detail-container">

   <div v-if="!!!addressItem.name" class="no-address">
     请选择收货地址
   </div>
   
   <div v-else class="address-detail">
     <p class="address-area">
        <symbolComp v-if='addressItem.defaultFlag' symbol="默认"></symbolComp>
        <span class="area">{{addressItem.area}}</span>
      </p>
      <p class="address-msg">
        <span>{{addressItem.fullAddress2}}</span>
      </p>
      <p class="person-msg">
        <span>{{addressItem.name}}</span>
        <span>{{dealxing(addressItem.phone || '')}}</span>
      </p>
   </div>
   <Icon type='icon_common_rightarrow' size=".24"/>
</div>
</template>
<script>
import symbolComp from 'common/components/base/symbol';
import Icon from 'common/components/base/Icon';
import extendUtils from 'common/lib/utils';
export default {
  components: {
    Icon,
    symbolComp
  },
  props: {

    //父组件传递的地址对象
    addressItem:{
      type:Object,
      default:() => {
        return {
          name:'',
          phone:'',
          area: '',
          fullAddress :'',
          defaultFlag : false,
        }
      }
    }

  },
  data(){
    return {
      
    }
  },
  watch:{
    //深度监听传递进来的地址对象，当其变化的时候更新地址的信息
    addressItem:{
      handler(val){
        
      },
      deep: true
    }
  },
  methods: {

    /**
     * 电话号码显示的脱敏处理
     * @param str 完整的电话号码字符串
     */
     dealxing(str){
       return extendUtils.sensitiveHide(str);
     },

     /**
     * 选择地址的回调
     */
     chooseAddress(){
       this.$emit('chooseAddress');
     }
  }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/confirm/addressDetail.less';
</style>