<template>
    <div class="check-rules" @click="$emit('closeDesc')">
       <div class="rule_item">
           <div class="rule_item_title"><icon type="icon_common_check-circle" size=".28"/>可查验发票类型</div>
           <ul class="rule_item_des">
              <li>1.增值税专票，包含增值税专用发票、增值税专用发票（电子）、机动车销售统一发票、二手车销售统一发票、全电纸票（增值税专用发票）；</li>
              <li>2.增值税普票，包含增值税普通发票、增值税普通发票（电子）、增值税普通发票（卷式）、增值税普通发票（通行费）；</li>
              <li>3.区块链发票；</li>
              <li>4.电子发票，包含电子发票（增值税专用发票）、电子发票（普通发票）；</li>
              <li>5.全电纸票 （普票）；</li>
              <li>6.通用电子发票；</li>
           </ul>
       </div>
       <div class="rule_item">
           <div class="rule_item_title"><icon type="icon_common_check-circle" size=".28"/>查验时间范围</div>
           <ul class="rule_item_des">
              <li>1.可查验最近五年内增值税发票管理系统开具的发票</li>
              <li>2.当日开具的发票最快可以在次日进行查验</li>
           </ul>
       </div>
       <div class="rule_item">
           <div class="rule_item_title"><icon type="icon_common_check-circle" size=".28"/>查验次数</div>
           <ul class="rule_item_des">
              <li>每天每张发票可在线查询次数为5次，超过次数后请于次日再进行查验操作</li>
           </ul>
       </div>
       <div class="rule_item">
           <div class="rule_item_title"><icon type="icon_common_check-circle" size=".28"/>查验结果</div>
           <ul class="rule_item_des">
              <li>平台仅提供所查询发票票面信息的查验结果。如对查验结果有疑议，请持发票原件至当地税务机关进行鉴定</li>
           </ul>
       </div>
       <div class="rule_item">
           <div class="rule_item_title"><icon type="icon_common_prompt" size=".28"/>特别提示</div>
           <ul class="rule_item_des">
              <li>不符合规定的发票，不得作为财务报销凭证，任何单位和个人有权拒收。付款方取得发票后应及时核对发票开具内容是否真实、项目填写是否齐全、加盖的发票专用章是否与收款方一致。对于违反发票管理法规的行为，任何单位和个人有权向税务机关举报。</li>
           </ul>
       </div>
    </div>
</template>
<script>
import icon from 'components/icon';
export default {
    directives: {},
    components: {
        icon
    },
    data(){
        return {
        
        }
    },
    created: function () {

    },
    mounted: function () {
    },
    methods: {
    }
}

</script>
<style lang="less" scoped>
@import '~themes/default/styles/checkRule.less';
</style>
