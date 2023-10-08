<template>
    <div class="progress-detail">
		<div class="timeline">
            <div class="timeline-item" v-for="(item, index) in progressList" :key="index">
                <div class="timeline-item-tail"></div>
                <div class="timeline-item-header"></div>
                <div class="timeline-item-content">
                    <div class="state">{{item.title}}</div>
                    <div class="desc" v-html="item.context"></div>
                    <div class="createtime">{{item.createDate}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';//工具类
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
const {
    getSession
} = extendUtils;

export default {
	mixins: [tChatEventMixin],
	components: {
	},
    data(){
		return {
			progressList: []
		}
    },
    created() {
		const serviceTrackInfo = getSession('afterSale/serviceTrackInfo') && JSON.parse(getSession('afterSale/serviceTrackInfo')) || [];
		this.progressList = serviceTrackInfo.reverse().map(item => {
            item.context = item.context.replace(/↵/g, '<br/>').replace(/\n/g, '<br/>').replace(/\n\r/g, '<br/>');
            return item;
        });
    },
    methods: {
		goBackFun(){
			this.$router.back();
		},
    },
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/order/afterSale/progressDetail.less';
</style>