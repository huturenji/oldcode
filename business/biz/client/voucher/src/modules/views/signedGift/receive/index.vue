<template>
    <div class="indexWrap">
         <component :is='channelComp' :received='received' @click='getPassword'/>
    </div>
</template>
<script>
import Loading from 'common/components/loading/loading'
import couponHandler from 'common/lib/requestHandler/couponHandler'
import extendUtils from 'common/lib/utils';
export default {
    components: {Loading},
    data() {
        return {
            channelComp: null,
            scene: null,
            receivedInfo: false,
            channelIdFromUrl: null,
            promotionId: null
        }
    },
    computed: {
        /**
         * 是否已领取
         */
        received(){
            return this.receivedInfo?.state == 1;
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
        this.promotionId = promotionId;
        this.renderComp(channelId);
        this.getReceiveState();
        this.scene = scene;
        this.cacheOrigin(origin);
        sinosdk.sino.pageActived(()=>{
            this.getReceiveState();
        })
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
         * 缓存进入方式（为今后扩展用）
         */
        cacheOrigin(origin){
            localStorage.setItem('signedGifg-receive-origin', origin)
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
                    loading: Loading,
                    delay: 0,
                    timeout: 10000
                });
            }catch(e){
                console.error(e);
                extendUtils.showToast('加载失败')
            }
        },
        /**
         * 企业是否已领取卡密
         */
        async getReceiveState(){
            try{
                //1-已领取 2-未领取
                this.receivedInfo = (await couponHandler.getReceiveState({promotionId: this.promotionId})).result || {};
            }catch(e){
                console.error(e);
            }
        },
        /**
         * 获取优惠券卡密
         */
        async getPassword(){
            //如果已领取就直接打开商城
            if(this.received){
                this.openBbc(this.receivedInfo.password)
                return;
            }
            try{
                //0：该企业已签约并且认证 1：该企业未签约 2：该企业已签约，未认证，当前用户不是老板 3：该企业已签约，未认证，当前用户是老板
                const isSign = (await sinosdk.sino.getCompanyStatus()).status;
                const userInfo = await sinosdk.sino.getUserInfo();
                const channelIdFromNative = await sinosdk.sino.getChannelId();
                //未签约和朋友圈不可领
                if(extendUtils.isEmpty(isSign) || isSign == 1 || userInfo.cpyId == -1){
                    extendUtils.showToast('亲，系统显示贵司还未签约喔~签约成功即可免费领取礼包，快去签约吧')
                    return;
                }
                //校验channelId
                if(this.channelIdFromUrl != channelIdFromNative){
                    extendUtils.showToast('请使用大银掌柜打开')
                    return;
                }
                this.$loading.show()
                //领取卡密
                const response = await couponHandler.getCouponVoucher({
                    companyName: userInfo.cpyName,
                    isSign: 1,//1-已签约 2-未签约
                    scene: this.scene,
                    thirdUserId: userInfo.UAId,
                    thirdUserName: userInfo.uName,
                    thirdUserPhone: userInfo.uPhone,
                    promotionId: this.promotionId
                });
                this.openBbc(response.result.password)
            }catch(e){
                if(e?.resultCode == 88103108){ //已被他人领取
                    extendUtils.showToast('啊哦，您来晚了~贵司签约礼包已被领取，感谢支持')
                }else{
                    extendUtils.showToast('活动太火爆了，请稍后重试')
                }
                console.error(e)
            }finally{
                this.$loading.hide()
            }
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