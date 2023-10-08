<template>
  <view
    ref='container'
    class="no-wrap fix-img"
    :style='heightStyle'
    v-margin="decoItem"
  >
    <view class='background' :style="rootStyle"></view>
    <img
      class="img"
      v-if="decoInfo.img"
      :src="decoInfo.img"
    />
    <view v-else-if="decoInfo.title" class="text" :style="decoInfo.align == 'left' ? 'flex-start' : decoInfo.align == 'right' ? 'flex-end' : 'center'">{{
      decoInfo.title
    }}</view>
  </view>
</template>

<script>
import {isEmpty, isH5} from '@/utils/common.js'
import eventsMixin from '../common/mixin/eventsMixin'
export default {
    name: "deco-fix-image",
    mixins: [eventsMixin],
    props: {
        parentScrollTop: {
            type: Number
        },
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        isChildren: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            decoInfo: {
                img: null,
                text: null,
                align: null,
                opacity: 1,
                background: 'transparent'
            }
        }
    },
    computed: {
        rootStyle(){
            return {
                ...this.heightStyle,
                "opacity": this.decoInfo.opacity,
                "background": this.decoInfo.background
            }
        },
        heightStyle(){
            if (isEmpty(this.decoInfo.containerHeight)){
                return {"height": '100%'}
            }
            //如果没有titleHeight，就暂时写死44px
            let titleHeight = isH5() ? (window.titleHeight || 44) : 44;
            return {"height": (this.decoInfo.containerHeight == 'titleBar' ? (titleHeight) : this.decoInfo.containerHeight) +'px'}
        }
    },
    watch: {
        decoItem: {
            handler(val, oldVal){
                if (isEmpty(val) || JSON.stringify(val) == JSON.stringify(oldVal)){
                    return;
                }
                this.setDecoInfo();
                if (this.decoInfo.fixed){
                    this.$nextTick(()=>{
                        if (!this.isChildren){
                            this.$emit('addFixed', this.$refs.container?.$el, true)
                            this.custEvents.dispatch('addFixed', this.$refs.container?.$el, true)
                        }
                    })
                }
            },
            immediate: true
        }   
    },
    created(){
        //监听样式反转事件，并反转样式
        this.eventsId.decoReverse = this.custEvents.addListener('decoReverse', item => {
            this.setDecoInfo(item.reverse);
        })
    },
    beforeDestroy(){
        this.custEvents.remove('decoReverse', this.eventsId.decoReverse)
    },
    methods: {
        setDecoInfo(reverse){
            if (isEmpty(this.decoItem?.data)){
                return;
            }
            let index = reverse ? (this.decoItem?.data.length > 1 ? 1 : 0) : 0;
            this.decoInfo = this.decoItem.data[index];
        }
    }
};
</script>

<style lang="scss" scoped>
.fix-img {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  z-index: 900;

  .background{
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .img{
      opacity: 1;
      position: relative;
    //   height: 100%;
  }

  .text {
    position: relative;
    color: #222;
    font-size: 36rpx;
  }

  @media screen and (min-width: 616px) {
    height: 88rpx;
  }
}
</style>