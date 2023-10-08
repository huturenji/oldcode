<template>
    <div class="indexWrap">
         <component :is='channelComp' @click='toReceive'/>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
export default {
    data() {
        return {
            channelComp: null,
            channelIdFromUrl: null
        }
    },

    created(){
        //trackId说明：[渠道基本信息]:[进入方式]:[业务信息]:[渠道定制信息]
        //[渠道基本信息]: 比如channelId、companyId等
        //[进入方式]：比如扫码、1.扫码2.弹窗 3.悬浮窗 4.app内直接进入商城
        //[业务信息]：比如活动id、装修id等
        //[渠道定制信息]：比如大连银行是场景值
        const [channelId, origin, promotionId, scene] = decodeURIComponent(this.$route.query.trackId)?.split(':') || []
        this.channelIdFromUrl = channelId;
        this.renderComp(channelId);
        this.unregistShareBtn();
    },
    methods: {
        /**
         * 隐藏app自带的分享按钮
         */
        unregistShareBtn(){
            sinosdk.sino.setMenu([{type: 5, menuId: 1}])
        },
        /**
         * 动态加载渠道组件
         */
        renderComp(channelId) {
            //获取channelId和文件夹名字的映射。
            //【注意】文件夹名字必须和sinosdk中的adapter中渠道的文件夹名一致
            const mapper = sinosdk.sino.getChannelMapper();
            const name = Object.keys(mapper)
                .find(_name => {
                    return mapper[_name].channelIds.map(id => id.replace(/\s/g,'')).indexOf(channelId) > -1
                })
            try{
                this.channelComp = () => ({
                    component: import(`./channelPage/${name}/index.vue`),
                    delay: 0,
                    timeout: 10000
                });
            }catch(e){
                console.error(e);
                extendUtils.showToast('加载失败')
            }
        },
        /**
         * 优惠券卡密去兑换
         */
        async toReceive(){
            //0：该企业已签约并且认证 1：该企业未签约 2：该企业已签约，未认证，当前用户不是老板 3：该企业已签约，未认证，当前用户是老板
            const isSign = (await sinosdk.sino.getCompanyStatus()).status;
            const userInfo = await sinosdk.sino.getUserInfo();
            const channelIdFromNative = await sinosdk.sino.getChannelId();
            //未签约和朋友圈不可领
            if(extendUtils.isEmpty(isSign) || isSign == 1 || userInfo.cpyId == -1){
                extendUtils.showToast('贵公司尚未签约大银掌柜~快去签约，领取礼包吧！')
                return;
            }
            //校验channelId
            if(this.channelIdFromUrl != channelIdFromNative){
                extendUtils.showToast('请使用大银掌柜打开')
                return;
            }
            //从url上获取ids
            this.openBbc(this.$route.query.ids)
        },
        openBbc(password){
            let platform = 'mallbbcg2bank'
            if(location.origin == 'https://bplussit.sinosun.com:18380'){
                platform = 'mallbbcg2'
            }
            sinosdk.sino.open(`${location.origin}/${platform}/static/mobile/index.html#/pages/coupon/slienceReceive?enableAgreement=false&password=${password}`)
        }
    }
};
</script>
<style lang='less' scoped>
@import '~commonStyles/themes/default.less';
@media screen and (min-width: @screen-sm) {
    .indexWrap{
        max-width: 7.5rem;
        position: relative;
        top: 0;
        left: 50% !important;
        transform: translateX(-50%);
    }
}
</style>