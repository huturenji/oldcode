<template>
  <view
    ref='container'
    class="no-wrap fix-img"
    :style='[rootStyle, styles]'
  >
    <view class='background' :style="[bgStyle]"></view>
    <image
      class="img"
      v-if="decoInfo.img"
      :src="decoInfo.img"
      mode="heightFix"
    />
    <view v-else-if="decoInfo.title" class="text" :style="decoInfo.align == 'left' ? 'flex-start' : decoInfo.align == 'right' ? 'flex-end' : 'center'">{{
      decoInfo.title
    }}</view>
  </view>
</template>

<script>
import { isEmpty } from '@/utils/common.js'
import mixin from "@/common/components/decorate/common/mixin";
import systemMixin from '@/common/mixin/system.js';
export default {
    name: "deco-fix-image",
    mixins: [mixin, systemMixin],
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        parentScrollTop: {
            type: Number,
            default: 0
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
        bgStyle() {
            return {
                ...this.rootStyle,
                "opacity": this.decoInfo.opacity,
                "background": this.decoInfo.background
            }
        },
        rootStyle() {
            const style = {};
            const { fixed, containerHeight } = this.decoInfo;
            if (fixed) {
                style.position = "fixed";
                style.top =  this.statusBarHeight + 'px';
                style.left = 0;
            }
            if (isEmpty(containerHeight)) {
                style.height = "100%"
                return style
            }

            let titleHeight = 44;

            const height = containerHeight == 'titleBar' ? titleHeight : containerHeight;
            style.height = height + "px";
            return style;
        }
    },
    watch: {
        decoItem: {
            handler(val, oldVal) {
                if (isEmpty(val) || JSON.stringify(val) == JSON.stringify(oldVal)) {
                    return;
                }
                // 初始化背景和margin padding
                this.initBackgroud(val);
                this.initSpace(val);
                this.setDecoInfo();
            },
            immediate: true
        },   
        parentScrollTop: {
            handler(val, oldVal) {
                if(val>0){
                    this.setDecoInfo(true)
                }else{
                    this.setDecoInfo(false)
                }
            },
            immediate: true
        }   
    },
    methods: {
        setDecoInfo(reverse) {
            if (isEmpty(this.decoItem?.data)) {
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
  text-align: left;
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
      height: 48rpx;
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