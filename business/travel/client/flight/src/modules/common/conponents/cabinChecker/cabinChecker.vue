<template>
  <div style="height:100%">
    <div class="psg-list">
      <input type="text" ref="input" :value="value" @input="$emit('input', $event.target.value)" style="width:0px">
      <div v-for="(cabin,index) in cabinList" class="cabinListLable cursorp" @click="selectedItem(cabin)" :key="index">
        <div class="box">
          <span></span>
        </div>
        <div class="mainLable">
          <div>
            <div class="psg-name">{{cabin.text}}</div>
          </div>
        </div>
        <div class="box">
            <Icon type='icon_common_select' size='.32' v-if='currentValue.value==cabin.value'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'components/icon';
import { NOLIMIT} from 'flightCommon/enum/flightFilterEnum.js';
export default {
    name: 'citySelected',
    components: {
        Icon
    },
    props: {
        cabinList: {
            type: Array,
            default: () => { return [] }
        },
        value: {
            type: Object,
            default: NOLIMIT
        }
    },
    data() {
        return {
            currentValue:''
        }
    },
    created() {

    },
    mounted() {
        let _this = this;
        _this.currentValue = _this.value;
    },
    methods: {
        updateVal: function (val) {
            this.$emit('input', val);
        },
        selectedItem(cabin) {
            let that = this;
            that.currentValue = cabin;
            this.$emit('input', that.currentValue);
        }
    }
}

</script>
<style lang="less" scoped>
    @import '~themes/default/styles/cabinChecker/index.less';
</style>
