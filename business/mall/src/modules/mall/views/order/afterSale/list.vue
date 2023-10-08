<template>
    <div class="after-sale-list">
    	<SnTabs v-model="active" sticky @change="onTabChange">
			<!-- 售后/申请页签 -->
        	<SnTab title="售后/申请">
        		<div class="tab-content">
          			<searchComp 
					  	placeholderText="商品名称/订单编号/商品编号" 
						v-model="apply.keyword"
						@search="onApplySearch"
                        @cancleEmit="onCancelSearch('apply')"
					/>
					<div class="card-list">
						<SnList
                            v-if="apply.loading || apply.data.length"
							v-model="apply.loading"
							:finished="apply.finished"
                            :immediate-check="false"
							@load="onApplyLoad"
						>
							<div 
								class="card-list-item" 
								v-for="(item, index) in apply.data" 
								:key="index"
							>
								<div 
									class="card-list-item-body product" 
									v-for="(product, subIndex) in item.products"
									:key="subIndex"
									@click="viewGoodsDetail(product)"
								>
									<div class="wrap-img">
										<!-- dealImg 在globalMixin里面-->
										<img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(product.imageUrl)">
									</div>
									<div class="card-list-item-body-content">
										<div class="card-list-item-body-content-title">{{product.name}}</div>
										<div class="card-list-item-body-content-num">数量:&nbsp;{{product.quantity}}</div>
										<SnButton 
											inline 
											shape="round"
											:disabled="!product.applyable"
											@click.stop="applyService(item, product, index)"
										>申请售后</SnButton>
									</div>
								</div>
							</div>
						</SnList>
                        <SnEmpty v-else :image="emptyImage" />
					</div>
        		</div>
      		</SnTab>
			<!-- 处理中页签 -->
      		<SnTab title="处理中" :info="processing.total > 0 ? (processing.total > 99 ? '99+' : processing.total) : null">
        		<div class="tab-content">
          			<searchComp 
					  	placeholderText="商品名称/订单编号/服务单号"
						v-model="processing.keyword"
						@search="onProcessingSearch"
                        @cancleEmit="onCancelSearch('processing')"
					/>
					<div class="card-list">
						<SnList
                            v-if="processing.loading || processing.data.length"
							v-model="processing.loading"
							:finished="processing.finished"
							finished-text="没有更多了~"
							@load="onProcessingLoad"
						>
							<div 
								class="card-list-item" 
								v-for="(item, index) in processing.data" 
								:key="index"
							>
								<div class="card-list-item-header">
									<div class="">服务单号:&nbsp;{{item.serviceId}}</div>
									<div class="card-list-item-header-status"><Icon class="icon" :type="item.customerExpectObj && item.customerExpectObj.key" size='.32'/>{{item.customerExpectObj && item.customerExpectObj.name}}</div>
								</div>
								<div class="card-list-item-body" @click="viewServiceDetail(item)">
									<div class="wrap-img">
										<!-- dealImg 在globalMixin里面-->
										<img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(item.skuImagePath)">
									</div>
									<div class="card-list-item-body-content">
										<div class="card-list-item-body-content-title">{{item.wareName}}</div>
										<div class="card-list-item-body-content-num">数量:&nbsp;{{item.skuNum}}</div>
									</div>
								</div>
								<div class="card-list-item-extra" @click="viewServiceDetail(item)">
									<div class="state-info">
										<div class="state">{{item.serviceStepObj && item.serviceStepObj.name}}</div>
									</div>
									<Icon type="icon_common_rightarrow" size='.24'/>
								</div>
                                <!-- 交互按钮组，allowOperations包含1则允许“取消申请”按钮动作，包含2则允许“填写发货单”按钮动作 -->
								<div class="card-list-item-footer" v-if="item.allowOperations && item.allowOperations.indexOf(1) > -1">
									<SnButton inline shape="round" @click="auditCancel(item, index)">取消申请</SnButton>
								</div>
							</div>
						</SnList>
                        <SnEmpty v-else :image="emptyImage" />
					</div>
        		</div>
      		</SnTab>
			<!-- 申请记录页签 -->
      		<SnTab title="申请记录">
        		<div class="tab-content">
          			<searchComp 
					  	placeholderText="商品名称/订单编号/服务单号"
						v-model="record.keyword"
						@search="onRecordSearch"
                        @cancleEmit="onCancelSearch('record')"
					/>
					<div class="card-list">
						<SnList
                            v-if="record.loading || record.data.length"
							v-model="record.loading"
							:finished="record.finished"
							finished-text="没有更多了~"
							@load="onRecordLoad"
						>
							<div 
								class="card-list-item" 
								v-for="(item, index) in record.data" 
								:key="index"
							>
								<div class="card-list-item-header">
									<div class="">服务单号:&nbsp;{{item.serviceId}}</div>
									<div class="card-list-item-header-status"><Icon class="icon" :type="item.customerExpectObj && item.customerExpectObj.key" size='.32'/>{{item.customerExpectObj.name}}</div>
								</div>
								<div class="card-list-item-body" @click="viewServiceDetail(item)">
									<div class="wrap-img">
										<!-- dealImg 在globalMixin里面-->
										<img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(item.skuImagePath)">
									</div>
									<div class="card-list-item-body-content">
										<div class="card-list-item-body-content-title">{{item.wareName}}</div>
										<div class="card-list-item-body-content-num">数量:&nbsp;{{item.skuNum}}</div>
									</div>
								</div>
								<div class="card-list-item-extra" @click="viewServiceDetail(item)">
									<div class="state-info">
										<div class="state">{{item.serviceStepObj.name}}</div>
									</div>
									<Icon type="icon_common_rightarrow" size='.24'/>
								</div>
							</div>
						</SnList>
                        <SnEmpty v-else :image="emptyImage" />
					</div>
        		</div>
      		</SnTab>
    	</SnTabs>
  	</div>
</template>
<script>
import { 
	SnTabs,
	SnTab,
	SnList,
	SnButton,
	SnModal,
    SnEmpty
} from "sinosun-ui";
import Icon from 'common/components/base/Icon';
const searchComp = () => import("commonComp/search/simpleSearch.vue"); //搜索组件
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler.js';
import config from 'common/lib/config.js';
import extendUtils from "common/lib/utils"; //工具类
import {
    CUSTOMER_EXPECT_LIST,
    PICKWARE_TYPE_LIST,
    STATE_LIST,
    SERVICE_STEP_LIST
} from 'common/lib/enum/postSaleEnum.js';
const {
    PAGE_SIZE
} = config;
const {
    showToast,
    getSession,
    setSession
} = extendUtils;

export default {
	mixins: [tChatEventMixin],
	components: {
		SnTabs,
		SnList,
		SnTab,
		SnButton,
		Icon,
		SnModal,
        SnEmpty,
		searchComp,
	},
    data() {
		return {
			active: 0,
			apply: {
				keyword: '',
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: PAGE_SIZE.DEFAULT,
				pages: 0,
				total: 0,
				data: []
			},
			processing: {
				keyword: '',
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: PAGE_SIZE.DEFAULT,
				pages: 0,
				total: 0,
				data: []
			},
			record: {
				keyword: '',
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: PAGE_SIZE.DEFAULT,
				pages: 0,
				total: 0,
				data: []
			},
            emptyImage: require('themes/default/img/defaultPage/img_defpage_nocontent@2x.png')
		};
	},
	created() {
        // 如果已存在切换的页签，则锁定活动页签
        const activeTab = getSession('afterSale/activeTab') || 0;
        this.active = parseInt(activeTab);
	},
    mounted() {
        this.onApplySearch();
        this.onProcessingSearch();
        this.onRecordSearch();
    },
    methods: {
		goBackFun(){
            setSession('afterSale/activeTab', 0);
			const { origin } = this.$route.query;
            if(origin === 'result') {
                delete this.$route.query.origin;
                this.$router.replace({
                    path: '/personal'
                });
            } else {
                this.$router.back();
            }
		},

		onApplySearch(params) {
			this.apply = {
				keyword: this.apply.keyword,
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: this.apply.pageSize,
				pages: 0,
				total: 0,
				data: [],
                ...params
			};
			this.onApplyLoad();
		},
		onProcessingSearch(params) {
			this.processing = {
				keyword: this.processing.keyword,
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: this.processing.pageSize,
				pages: 0,
				total: this.processing.total,
				data: [],
                ...params
			};
			this.onProcessingLoad();
		},
		onRecordSearch(params) {
			this.record = {
				keyword: this.record.keyword,
				loading: false,
				finished: false,
				pageNum: 1,
				pageSize: this.record.pageSize,
				pages: 0,
				total: 0,
				data: [],
                ...params
			};
			this.onRecordLoad();
		},
	    onCancelSearch(type) {
            this[type].keyword = '';
            this[`on${type.charAt(0).toUpperCase() + type.slice(1)}Search`]();
        },
        onApplyLoad() {
			let apply = this.apply;
			const { channelId, companyId, userId, supplierId} = afterSaleHandler;
			const params = {
				channelId,
				companyId,
				userId,
				supplierId,
				queryExt: {
					ext: apply.keyword,
					orderState: 5,
				},
				pageNum: apply.pageNum,
				pageSize: apply.pageSize
			};
            apply.loading = true;
			afterSaleHandler.getOrderList(params).then(res => {
				const result = res.result || {};
				const {
					pages,
					total
				} = result;
				let orders = result.orders || [];
				orders.map(item => {
					item.products.map(product => {
						product.applyable = true;
					});
				});

				apply.pageNum++;
				apply.pages = pages;
				apply.total = total;
				apply.data.push(...orders);
                this.apply = apply;

				if(apply.pageSize >= total || apply.data.length >= total) {
					apply.finished = true;
				}
			}).catch(e => {
				apply.finished = true;
			}).finally(() => { 
				// 加载状态结束
				apply.loading = false;
			});
		},
		onProcessingLoad() {
			let processing = this.processing;
			const { channelId, companyId, userId, supplierId } = afterSaleHandler;
			const params = {
				pageNum: processing.pageNum,
				pageSize: processing.pageSize,
				channelId,
				companyId,
				userId,
				serviceStatus: 1,
				searchKey: processing.keyword,
                supplierId: supplierId
			};
            processing.loading = true;
			afterSaleHandler.getServiceListPage(params).then(res => {
				const result = res.result || {};
				const {
					pages,
					total
				} = result;
				let serviceInfoList = result.serviceInfoList || [];

				serviceInfoList.map(item => {
					item.customerExpectObj = this.findByCode(CUSTOMER_EXPECT_LIST, item.customerExpect) || {};
					item.serviceStepObj = this.findByCode(SERVICE_STEP_LIST, item.serviceStep) || {};
				});

				processing.pageNum++;
				processing.pages = pages;
                if(processing.keyword === '') {
                    processing.total = total;
                }
				processing.data.push(...serviceInfoList);
                this.processing = processing;

				if(processing.pageSize >= total || processing.data.length >= total) {
					processing.finished = true;
				}
			}).catch(e => {
				processing.finished = true;
                showToast(e && e.resultMessage);
			}).finally(() => {
				// 加载状态结束
				processing.loading = false;
			});
		},
		onRecordLoad() {
			let record = this.record;
			const { channelId, companyId, userId, supplierId } = afterSaleHandler;
			const params = {
				pageNum: record.pageNum,
				pageSize: record.pageSize,
				channelId,
				companyId,
				userId,
                searchKey: record.keyword,
                supplierId: supplierId
			};
            record.loading = true;
			afterSaleHandler.getServiceListPage(params).then(res => {
				const result = res.result || {};
				const {
					pages,
					total
				} = result;
				let serviceInfoList = result.serviceInfoList || [];

				serviceInfoList.map(item => {
					item.customerExpectObj = this.findByCode(CUSTOMER_EXPECT_LIST, item.customerExpect) || {};
					item.serviceStepObj = this.findByCode(SERVICE_STEP_LIST, item.serviceStep) || {};
				});

				record.pageNum++;
				record.pages = pages;
				record.total = total;
				record.data.push(...serviceInfoList);
                this.record = record;

				if(record.pageSize >= total || record.data.length >= total) {
					record.finished = true;
				}
			}).catch(e => {
				record.finished = true;
			}).finally(() => {
				// 加载状态结束
				record.loading = false;
			});
		},
		// 页签切换
        onTabChange(val) {
            setSession('afterSale/activeTab', val);
			document.documentElement.scrollTop = 0;
		},
		// 申请售后
		applyService(item, product, index) {
			const params = {
				supplierId: product.supplierId,
				spOrderId: item.supplierOrderNo,
                skuId: product.sku,
                skuNum: product.quantity,
                cityCode: (item.receiverInfo || {}).cityCode || null,
                districtCode: (item.receiverInfo || {}).districtCode || null,
                parentSupplierOrderNo: item.parentSupplierOrderNo || null,
                masterSku: product.masterSku
			};
			this.$loading.show();
			product.orderNo = item.orderNo;
            product.supplierOrderNo = item.supplierOrderNo;
            product.receiverInfo = item.receiverInfo || {};
            product.parentSupplierOrderNo = item.parentSupplierOrderNo;
			afterSaleHandler.getAvailableNumberComp(params).then(res => {
				const result = res.result || {};
				if(result.availableNum) {
					product.availableNum = result.availableNum
					setSession('afterSale/wareInfo', JSON.stringify(product));
					this.$router.push({
						path:'/order/afterSale/serviceChoose'
					});
				} else {
                    showToast('不可售后');
                }
			}).catch(e => {
                this.apply.data[index].applyable = false;
            }).finally(() => {
				this.$loading.hide();
			});
		},
		// 取消服务单 
		auditCancel(item, index) {
			SnModal({
				message: '确认取消售后申请？',
				showCancelButton: true
			}).then(res => {
				const { serviceId } = item;
				const params = {
					serviceIdList: [serviceId],
					approveNotes: '取消售后'
				};
				this.$loading.show();
				afterSaleHandler.auditCancel(params).then(res => {
                    this.onProcessingSearch();
                    this.onRecordSearch();
				}).finally(() => {
					this.$loading.hide();
				});
			}).catch(rej => {
			});
		},
		findByCode(list, val) {
			for(let i = 0; i < list.length; i++) {
				if(list[i].code === val) {
					return list[i];
				}
			}
			return {};
		},
		// 跳转查看商品详情
		viewGoodsDetail(product) {
            setSession('afterSale/activeTab', this.active);
			this.$router.push({
				path: '/product/detail',
				query: {
                    supplierId: product.supplierId,
					sku: product.sku
				}
			});
		},
        // 查看服务单详情
		viewServiceDetail(item) {
            setSession('afterSale/activeTab', this.active);
			setSession('afterSale/wareInfo', JSON.stringify(item));
			this.$router.push({
				path: '/order/afterSale/serviceDetail'
			});
		},
    }
};
</script>
<style scoped lang="less">
@import "~themes/default/styles/order/afterSale/list.less";
</style>