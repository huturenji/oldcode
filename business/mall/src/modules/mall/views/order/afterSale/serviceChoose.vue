<template>
    <div class="service-choose">
		<div class="content">
			<div class="service-tip" v-if='SUPPLIER_CONFIG.name'>
				<span>本次售后服务将由{{SUPPLIER_CONFIG.name}}为您提供</span>
			</div>
			<div class="card-list-item">
				<div class="wrap-img">
					<!-- dealImg 在globalMixin里面-->
					<img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(item.imageUrl)">
				</div>
				<div class="card-list-item-content">
					<div class="card-list-item-content-title">{{item.name}}</div>
					<div class="card-list-item-content-footer">
						<span class="price">单价:&nbsp;<span>¥{{item.unitPrice}}</span></span>
						<span class="quantity">数量:&nbsp;<span>{{item.quantity}}</span></span>
					</div>
				</div>
			</div>
			<SnListItem
				v-if="codeList.indexOf('30') > -1"
				title="维修" 
				center 
				right-icon="right"
				@click="applyService('maintain', '30', '维修')"
            >

				<Icon class="maintain" size='.44' type='icon_mall_weixiu' slot="icon" />
				<div class="value">维修收到的商品</div>
			</SnListItem>
			<SnListItem 
				v-if="codeList.indexOf('10') > -1"
				title="退货" 
				center
				right-icon="right" 
				@click="applyService('return', '10', '退货')"
			>
				<Icon class="return" type='icon_mall_tuihuo' size='.44' slot="icon" />
				<div class="value">退回收到的商品</div>
			</SnListItem>
			<SnListItem 
				v-if="codeList.indexOf('20') > -1"
				title="换货" 
				center
				right-icon="right" 
				@click="applyService('exchange', '20', '换货')"
			>
				<Icon class="exchange" size='.44' type='icon_mall_huanhuo' slot="icon" />
				<div class="value">更换收到的商品</div>
			</SnListItem>
		</div>
		<div class="footer" @click="contractService">
			<Icon type="kefu1" size='.32'/><span>联系客服</span>
		</div>
    </div>
</template>
<script>
import Icon from 'common/components/base/Icon';
import { 
	SnListItem,
	SnModal
} from "sinosun-ui";
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler.js';
import extendUtils from 'common/lib/utils';//工具类
const {
    getSession,
    setSession
} = extendUtils;

export default {
	mixins: [tChatEventMixin],
	components: {
		SnListItem,
		Icon,
		SnModal
	},
    data(){
		return {
			item: {},
			codeList: [],
            servicePhone: this.BMallConfig.BIS_CUSTOMER_SERVICE_PHONE,//客服电话
            SUPPLIER_CONFIG: afterSaleHandler.supplierId ? this.BMallConfig.SUPPLIER_Map[afterSaleHandler.supplierId] : {}
		}
	},
	created() {
		const item = getSession('afterSale/wareInfo') && JSON.parse(getSession('afterSale/wareInfo')) || {};
		this.item = item;
	},
	mounted() {
		this.getCustomerExpectComp();
	},
    methods: {
		goBackFun(){
			this.$router.back();
		},

		// 查询商品的售后类型
		getCustomerExpectComp() {
			const { supplierId = '', supplierOrderNo = '', sku = '', parentSupplierOrderNo = '', receiverInfo = {} } = this.item;
			const params = {
				supplierId,
				spOrderId: supplierOrderNo,
                skuId: sku,
                cityCode: receiverInfo.cityCode || null,
                districtCode: receiverInfo.districtCode || null,
                parentSupplierOrderNo: parentSupplierOrderNo || null,
			};
			this.$loading.show();
			afterSaleHandler.getCustomerExpectComp(params).then(res => {
				const result = res.result || {};
				const postsaleTypes = result.postsaleTypes || [];
				if(postsaleTypes.length) {
					this.codeList = postsaleTypes.map(item => item.code);
				}
			}).finally(() => {
				this.$loading.hide();
			});
		},
		// 申请售后
		applyService(key, code, name) {
			setSession('afterSale/serviceChooseInfo', JSON.stringify({
				key,
				code,
				name
			}));
			this.$router.push({
				path: '/order/afterSale/apply'
			});
		},
		// 联系客服
		contractService() {
			const that = this;
			// SnModal({
			// 	message: `拨打电话  ${BIS_CUSTOMER_SERVICE_PHONE}`,
			// 	confirmButtonText: '我知道了'
			// });
			SnModal({
				message: `拨打电话  ${this.servicePhone}`,
				showCancelButton: true
			}).then(res => {
				console.log('res === ', res);
				that.callTel()
			}).catch(rej => {
				console.log('rej === ', rej);
			});
		},
		callTel(){
			extendUtils.callNativeTel(this.servicePhone)
		}
    },
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/order/afterSale/serviceChoose.less';
</style>