<script>
import goodsHandler from '@/components/goods/handler';
import {skipTo, isNotEmpty} from '@/utils/common.js'
export default {
    data() {
        return {
            password: '',
            coupon: {}
        };
    },
    created(){
        this.getCouponByPwd();
    },
    methods:{
        async getCouponByPwd(){
            this.password = SnUtils.getUserPara('password');
            uni.showLoading()
            await this.getCoupon();
            //非可领取状态，则直接提示错误
            if(this.coupon.state != 4){
                uni.hideLoading();
                this.showErrorDialog();
                return;
            }
            if(this.coupon.pwdCouponState == 1){
                await this.receive();
            }
            this.goGoodsList();
            uni.hideLoading();
        },
        //获取优惠券详情
        getCoupon() {
            return new Promise((resolve, reject) => {
                let param = {
                    couponList: [{password: this.password}]
                };
                goodsHandler.batchGetCouponDetail(param).then(res => {
                    if (res.state == 200) {
                        this.coupon = res.data.couponList?.[0];
                        let userId = getApp().globalData.userParams.userId;
                        if(isNotEmpty(this.coupon.userId) && this.coupon.userId != userId){
                            throw '非优惠券持有者，持有者userId: ' + this.coupon.userId + ', 当期用户userId: ' + userId
                        }
                        resolve()
                    } else {
                        throw res.msg;
                    }
                }).catch((e) => {
                    uni.hideLoading();
                    this.showErrorDialog();
                    console.error('获取优惠券详情失败：', e)
                    reject()
                })
            })
        },
        receive(){
            return new Promise((resolve, reject) => {
                let param = {
                    couponList: [{password: this.password}]
                };
                goodsHandler.batchReceiveCoupon(param).then(res => {
                    if (res.state == 200) {
                        resolve()
                    } else {
                        throw res.msg
                    }
                }).catch((e) => {
                    uni.hideLoading();
                    this.showErrorDialog();
                    console.error('领取优惠券失败：', e)
                    reject()
                })
            })
        },
        //去优惠券对应的商品列表
        goGoodsList() {
            let item = this.coupon;
            if (item.linkInfo!=null){
                let skipUrl={};
                try {
                    skipUrl=JSON.parse(item.linkInfo);
                    skipTo(skipUrl,this,'self');
                } catch (error){
                    this.goDefaultGoodsList(item);
                }
            } else {
                this.goDefaultGoodsList(item);
            }

        },
        goDefaultGoodsList(item){
            let params = {}
            if (item.storeId > 0) {
                params.storeId=item.storeId
            }
            if (item.useType == 2 && item.skus) { ////指定商品 跳转到活动商品列表页面
                params.skus = item.skus;
                this.$Router.replace({
                    path: '/pages/activity/activity',
                    query: {
                        source: 'coupon',
                        ...params
                    }
                })
                return 
            } else if (item.useType == 3 && item.categoryIdList) { //指定分类 跳转到商品列表页面
                params.categoryIds = item.categoryIdList.join(',')
            }
            this.$Router.replace({
                path: '/standard/product/list',
                query: {
                    source: 'coupon',
                    ...params
                }
            })
        },
        showErrorDialog(){
            uni.showModal({
                title: '',
                content: '活动太火爆了，请稍后重试',
                showCancel: false,
                success: () => {
                    sinosdk.sino.back();
                }
            })
        }
    }
}
</script>
