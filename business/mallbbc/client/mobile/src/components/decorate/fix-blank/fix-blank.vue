<template>
  <view v-margin="decoItem"
    class="blank_wrap"
    :style="{ backgroundColor: decoItem.props.color, height: blankHeight + 'px' }"
  >
  </view>
</template>

<script>
import { skipTo } from "@/utils/common.js";
export default {
    name: "deco-fix-blank",
    components: {},
    props: {
    // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {};
    },
    computed:{
        blankHeight(){
            let height 
            if(this.decoItem.props.text == 'statusHeight'){
                height = window?.statusHeight || 0
            }else if(this.decoItem.props.text == 'titleHeight'){
                height = window?.titleHeight || 0
            }else{
                height = Number(this.decoItem.props.text)||30
            }
            return height
        }
    },
    methods: {
    // 相关跳转
        skipTo(item) {
            skipTo(item, this);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>