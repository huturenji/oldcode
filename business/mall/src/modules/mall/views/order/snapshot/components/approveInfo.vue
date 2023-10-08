<!-- 提交订单页面-->
<template>
	<!-- 审批过来显示的页面 -->
	<div class="approve-box">
		<div class="approve-content">
			<img :src="FlowStatus[status].src">
			<p class="tips" :class="FlowStatus[status].tipsColor">{{FlowStatus[status].text}}</p>
			<p class="des">{{FlowStatus[status].tips}}</p>
		</div> 
		<!-- 确定按钮 -->
		<div @click="goBack" class="confirmBtn">
			确定
		</div>
	</div>
</template>

<script>
import {FlowStatus} from 'common/lib/enum/orderStatusEnum';
import extendUtils from 'common/lib/utils'
export default {
    components: {
    },
    props: {
		status:{
			type:Number,
			default:''
        },
        isCanceled:{
            type:Boolean,
            default:false
        },
    },
    data(){
        return {
            FlowStatus:FlowStatus,//审批状态枚举配置
        }
    },
    watch:{
    },
    created(){
        if(this.isCanceled){
            this.status = 'canceled';
        }
    },
    methods: {
		//审批情况下的返回 回退两步
		goBack(){
			this.$emit('goBackFunction')
		},
    }
};
</script>

<style scoped lang="less">
@import '~themes/default/styles/order/snapshot/components/approveInfo.less';
</style>