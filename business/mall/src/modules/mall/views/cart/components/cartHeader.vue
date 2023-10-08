<template>
<div class="cart-header-container fixed-dom-part">
    <div class="left">
        <p @click="changeAddress" class="address" v-if='isPc'>
            <Icon type='icon_clockin_locatoion' size=".3"/>
            <span v-if="!!addressDefault">{{addressDefault}}</span>
            <span v-else class="no-address">请选择收货地址</span>
        </p>
        <p class="address" v-else>
        全部 ({{allTypesNum}})
      </p>
    </div>
    <div class="right">
      <span v-show="editFlag" class="share" @click="$emit('shareCart', '')">分享</span>
      <span @click="editCart">{{ !!editFlag ? '管理' : '完成' }}</span>
    </div>
</div>
</template>

<script>
import extendUtils from 'common/lib/utils';
const Icon = ()=>import('common/components/base/Icon.vue');
export default {
  props:{
    addressDefault:{
      type: String
    },
    allTypesNum:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      editFlag: true, //true代表显示编辑 false代表显示完成
      isPc: extendUtils.isPC()
    }
  },
  components: {
    Icon
  },
  watch:{},
  created() {},
  methods:{

    /**
     * 点击购物车顶部的编辑功能的回调
     */
    editCart(){
      this.editFlag = !this.editFlag;
      this.$emit('dealCart', this.editFlag);
    },


    /**
     * 点击顶部地址模块的回调
     */
    changeAddress(){
      this.$emit('changeAddress');
    }
  },  
} 
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
.cart-header-container{
  position: fixed;
  width: 100%;
  top: @title-bar-height;
  left: 0;
  right: 0;
  height: 0.8rem;
  background: @background-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  padding: 0 0.2rem;
  max-width: @max-content-width;
  .left{
    flex: 1;
    padding-right: 0.2rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    p.address{
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .icon{
          color: @text-color;
      }
      span{
        display: inline-block;    
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;  
        font-size: 0.28rem;
        padding-left: 0.08rem;
        cursor: pointer;
        flex: 1;
      }
      .no-address{
        color: #c2c2c2;
      }
    }
  }
  .right{
    text-align: right;
    min-width: 1.8rem;
    font-size: 0.28rem;
    span{
      cursor: pointer;
    }
    span.share{
      margin-right: 0.2rem;
    }
  }
}
</style>
