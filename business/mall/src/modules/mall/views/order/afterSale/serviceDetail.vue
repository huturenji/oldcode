<template>
    <div class="service-detail">
		<div class="content" :class="{'content-footer': allowOperations.length || serviceInfoDTO.state === 8}"
			v-if="serviceInfoDTO.serviceId"
		>
			<div class="service-tip">
				<span>本次售后服务将由供应商为您提供</span>
			</div>
			<!-- 暂时不显示进度条 -->
			<!-- <div class="progress">
				<div 
					class="progress-item" 
					v-for="(item, index) in progressList" 
					:key="index" 
					:class="item.active ? 'active' : ''"
				>
					<Icon :type="item.active ? 'radio-check' : 'radio-empty'" />
					<label>{{item.label}}</label>
				</div>
			</div> -->
			<SnListItem
                v-if="serviceTrackInfoDTOs.length" 
				value-position="left" 
				right-icon="right" 
				:border="false" 
				class="service-result"
				@click="viewProgressDetail"
			>
				<div class="status">{{serviceTrackInfoDTOs[serviceTrackInfoDTOs.length - 1].title}}</div>
				<div class="review">审核留言:&nbsp;<span>{{serviceTrackInfoDTOs[serviceTrackInfoDTOs.length - 1].context}}</span></div>
			</SnListItem>
			<!-- 退款信息 -->
			<div class="cost-info" v-if="serviceFinanceDetailInfoDTOs.length>0 && !!serviceFinanceDetailInfoDTOs[0].refundPrice">
				<SnListItem 
					title="退款总额" 
					:value="serviceFinanceDetailInfoDTOs[0].refundPrice | formatMoney" 
					:border="false" 
					value-class="num-font total" 
				/>
			</div>
            <!-- 发货单信息 -->
            <div class="express-info" v-if="serviceExpressInfoDTO">
                <SnListItem 
                    class="send-back-title"
					title="发货单信息" 
					:border="false" 
				>
                    <SnButton 
                        class="update-sku"
                        type="link" 
                        ghost
                        shape="round"
                        @click="updateSendSku"
                    ><i class="edit"></i>修改发货单</SnButton>
                </SnListItem>
				<SnListItem 
					title="快递单号: "
					:value="serviceExpressInfoDTO.expressCode" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="快递公司: " 
					:value="serviceExpressInfoDTO.expressCompany" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
			</div>
            <!-- 商品回寄信息 -->
            <div class="product-send-back-info" v-if="servicepostSalesAddressInfoDTO">
                <SnListItem 
                    class="send-back-title"
					title="商品回寄信息" 
					:border="false" 
				>
                    <SnButton 
                        class="copy"
                        type="primary" 
                        ghost
                        shape="round"
                    >复制</SnButton>
                </SnListItem>
				<SnListItem 
					title="寄回地址: "
					label-number="5" 
					value-position="left" 
					:border="false"
				>
                    <span id="address">{{servicepostSalesAddressInfoDTO.address}}</span>
                </SnListItem>
				<SnListItem 
					title="收件人: " 
					:value="servicepostSalesAddressInfoDTO.linkMan" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="联系电话: " 
					:value="servicepostSalesAddressInfoDTO.tel" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
			</div>
			<!-- 商品信息 -->
			<div class="product-title">商品信息</div>
			<div class="card-list-item">
				<div class="wrap-img">
					<!-- dealImg 在globalMixin里面-->
					<img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(serviceDetailInfoDTO.skuImagePath)">
					
				</div>
				<div class="card-list-item-content">
					<div class="card-list-item-content-title">{{serviceDetailInfoDTO.wareName}}</div>
					<div class="card-list-item-content-footer">
						<span class="price">单价:&nbsp;<span>¥{{serviceDetailInfoDTO.unitPrice}}</span></span>
						<span class="quantity">数量:&nbsp;<span>{{serviceInfoDTO.skuNum}}</span></span>
					</div>
				</div>
			</div>
			<!-- 服务单信息 -->
			<div class="service-detail-info">
				<SnListItem 
					title="服务单号: "
					:value="serviceInfoDTO.serviceId" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="申请时间: " 
					:value="serviceInfoDTO.formatApplyTime" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="服务类型: " 
					:value="serviceInfoDTO.customerExpectName" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
			</div>
			<div class="service-detail-info personal">
				<SnListItem
                    v-if="serviceInfoDTO.customerExpect === 10"
					title="退款方式: " 
					value="原支付返回" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="商品退回: " 
					:value="asPickwareDTO.pickwareName" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
                    v-if="asPickwareDTO.pickwareType === 4"
					title="取件地址: " 
					:value="asPickwareDTO.pickwareFullAddress" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
                    v-if="serviceInfoDTO.customerExpect !== 10"
					title="收货地址: " 
					:value="asReturnwareDTO.returnwareFullAddress" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="联系人: " 
					:value="serviceCustomerInfoDTO.customerContactName" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
				<SnListItem 
					title="联系电话: " 
					:value="serviceCustomerInfoDTO.customerTel | sensitiveHide" 
					label-number="5" 
					value-position="left" 
					:border="false" 
				/>
			</div>

			<div class="service-detail-info contact zhiCustomBtn" @click="gotoCustomerService">
				<Icon type="kefu1" size='.32'/><span>联系客服</span>
			</div>
		</div>
        <!-- 底部按钮组 -->
		<div class="footer" v-if="allowOperations.length || serviceInfoDTO.state === 8">
			<SnButton
				v-if="allowOperations.indexOf(1) > -1"
				inline 
				shape="round" 
				@click="auditCancel"
			>取消申请</SnButton>
			<SnButton
				v-if="allowOperations.indexOf(2) > -1 && !serviceExpressInfoDTO"
				type="primary" 
				inline 
				shape="round" 
				@click="updateSendSku"
			>填写发货单</SnButton>
            <SnButton
				v-if="serviceInfoDTO.state === 8"
				type="primary" 
				inline 
				shape="round" 
				@click="confirm"
			>确认完成</SnButton>
		</div>
    </div>
</template>
<script>
import { 
	SnListItem,
	SnIcon,
	SnButton,
	SnModal
} from "sinosun-ui";
import Icon from 'common/components/base/Icon';
import ClipboardJS from 'clipboard';
import customerService from 'common/lib/customer-service/index.js'; //客服系统
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import extendUtils from 'common/lib/utils';//工具类
import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler.js';
import {formatMoney} from 'common/lib/filter/currency';
import {
    CUSTOMER_EXPECT_LIST,
    PICKWARE_TYPE_LIST,
    STATE_LIST,
    SERVICE_STEP_LIST
} from 'common/lib/enum/postSaleEnum.js';
const {
    showToast,
    getSession,
    setSession,
    sensitiveHide
} = extendUtils;

export default {
	mixins: [tChatEventMixin],
	components: {
		SnListItem,
		SnIcon,
		SnButton,
		SnModal,
		Icon
	},
	filters: {
		sensitiveHide: sensitiveHide,
		formatMoney: val => '¥' + formatMoney(val)
	},
    data(){
		return {
			loading: true,
			item: {},
			progressList: [],
			serviceInfoDTO: {},
			serviceCustomerInfoDTO: {},
			servicepostSalesAddressInfoDTO: null,
			serviceExpressInfoDTO: null,
			serviceFinanceDetailInfoDTOs: [],
			serviceTrackInfoDTOs: [],
			serviceDetailInfoDTO: {},
			asPickwareDTO: {},
			asReturnwareDTO: {},
			allowOperations: [],
		}
	},
	created() {
        //推送过来的场景serviceId通过url传递
        if(!!this.$route.query.serviceId && ''!=this.$route.query.serviceId){
            this.item['serviceId'] = this.$route.query.serviceId;
        }else{
            const item = getSession('afterSale/wareInfo') && JSON.parse(getSession('afterSale/wareInfo')) || {};
            let info = getSession('afterSale/orderInfo') && JSON.parse(getSession('afterSale/orderInfo')) || {};
            item.serviceId = item.serviceId || info.serviceId;
            this.item = item;
        }
	},
	mounted() {
		this.getServiceDetailInfo();
	},
	computed:{
		/********
		 * 整合在线客服需要拼接的参数（用的在线客服事智齿科技） 服务单详情的卡片参照订单的卡片实现
		 */
		zcConfig(){
			let goods = []; //商品详情数组
			goods.push({
				name: encodeURIComponent(this.serviceDetailInfoDTO.wareName), //商品名称
				pictureUrl: encodeURIComponent(this.dealImg(this.serviceDetailInfoDTO.skuImagePath)), //商品图片链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
			})			
			return {
				create_time: new Date(this.serviceInfoDTO.formatApplyTime.replace(/\-/g, '/')).getTime(), //创建时间（毫秒）此处需特别注意，ios时间格式如果是-的话转换有兼容性问题，应该转为/
				order_code: this.serviceInfoDTO.serviceId, //服务单号
				order_url: encodeURIComponent(window.location.href + '&pageFrom=customerService&serviceId=' + this.serviceInfoDTO.serviceId), //订单链接（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
				goods_count: this.serviceInfoDTO.skuNum, //商品数量 
				total_fee: (this.serviceInfoDTO.skuNum * this.serviceDetailInfoDTO.unitPrice) * 100, //订单金额（以分为单位，total_fee=1000相当与total_fee=10.00元，不支持小数）
				goods: JSON.stringify(goods),
			}
		}
	},
    methods: {
		//跳转到客服系统
        async gotoCustomerService(){  
            let url = await customerService.run(1, this.zcConfig, 'order').catch(e=>{
                console.log(e)
            });
            window.open(url);
            // extendUtils.openApplet({
            //     appId: this.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].appId,
            //     url,
            // });
        },


		goBackFun(){
            const { origin } = this.$route.query;
            if(origin === 'result') {
                this.$router.replace({
                    name:'orderAfterSaleList',
                    query: this.$route.query
                });
            }else if('push' == this.$route.query.pageFrom || 'customerService' == this.$route.query.pageFrom){
                extendUtils.goBackPage(null, 1);
            }else {
                this.$router.back();
            }
		},
		// 查询服务单明细
		getServiceDetailInfo() {
			const { serviceId } = this.item;
			const params = {
				serviceId: serviceId,
				appendInfoSteps: [1, 2, 3, 4, 5, 6, 7]
			};
			this.$loading.show();
			afterSaleHandler.getServiceDetailInfo(params).then(res => {
				if(res) {
					const result = res.result || {};
					let {
						serviceInfoDTO,
						serviceCustomerInfoDTO,
						servicepostSalesAddressInfoDTO,
						serviceExpressInfoDTO,
						serviceFinanceDetailInfoDTOs,
						serviceTrackInfoDTOs,
						serviceDetailInfoDTOs,
						asPickwareDTO,
						asReturnwareDTO,
						...rest
					} = result;
					serviceInfoDTO = serviceInfoDTO || {};
					serviceInfoDTO.stateName = this.findByCode(STATE_LIST, serviceInfoDTO.state).name;
					serviceInfoDTO.formatApplyTime = new Date(serviceInfoDTO.applyTime).format('yyyy-MM-dd HH:mm:ss');
					serviceInfoDTO.customerExpectName = this.findByCode(CUSTOMER_EXPECT_LIST, serviceInfoDTO.customerExpect).name;
					serviceCustomerInfoDTO = serviceCustomerInfoDTO || {};
					servicepostSalesAddressInfoDTO = servicepostSalesAddressInfoDTO;
					serviceExpressInfoDTO = serviceExpressInfoDTO;
					serviceFinanceDetailInfoDTOs = serviceFinanceDetailInfoDTOs || [];
					serviceTrackInfoDTOs = serviceTrackInfoDTOs || [];
					serviceDetailInfoDTOs = serviceDetailInfoDTOs || [];
					asPickwareDTO = asPickwareDTO || {};
					asPickwareDTO.pickwareName = this.findByCode(PICKWARE_TYPE_LIST, asPickwareDTO.pickwareType).name;
					asReturnwareDTO = asReturnwareDTO || {};

					this.serviceCustomerInfoDTO = serviceCustomerInfoDTO;
					this.servicepostSalesAddressInfoDTO = servicepostSalesAddressInfoDTO;
					this.serviceExpressInfoDTO = serviceExpressInfoDTO;
					this.serviceFinanceDetailInfoDTOs = serviceFinanceDetailInfoDTOs;
					this.serviceInfoDTO = serviceInfoDTO;
					this.serviceTrackInfoDTOs = serviceTrackInfoDTOs;
					this.serviceDetailInfoDTO = serviceDetailInfoDTOs && serviceDetailInfoDTOs[0];
					this.asPickwareDTO = asPickwareDTO;
					this.asReturnwareDTO = asReturnwareDTO;
					this.allowOperations = serviceInfoDTO.allowOperations || [];
					this.detail = rest;

                    if(servicepostSalesAddressInfoDTO) {
                        // 复制寄回地址
                        this.$nextTick(() => {
                            const clipboard = new ClipboardJS('.copy', {
                                target: trigger => document.getElementById('address'),
                                text: trigger => {
                                    showToast('复制寄回地址信息成功');
                                    return servicepostSalesAddressInfoDTO.address;
                                }
                            });
                        });
                    }

					// 存储进度详情信息
					setSession('afterSale/serviceTrackInfo', JSON.stringify(serviceTrackInfoDTOs));
				}
			}).finally(() => {
				this.loading = false;
				this.$loading.hide();
			});
		},
		getCustomAddress(val, type) {
			if(typeof val === 'object') {
				return `${val[type + 'wareProvince']} ${val[type + 'wareCity']} ${val[type + 'wareCounty']} ${val[type + 'wareVillage']}${val[type + 'wareAddress']}`
			} else {
				return '';
			}
		},
		findByCode(list, val) {
			for(let i = 0; i < list.length; i++) {
				if(list[i].code === val) {
					return list[i];
				}
			}
			return {};
		},
		// 进度详情查看
		viewProgressDetail() {
			this.$router.push({
				path: '/order/afterSale/progressDetail'
			});
		},
		// 取消服务单 
		auditCancel(type, item, index) {
			SnModal({
				message: '确认取消售后申请？',
				showCancelButton: true
			}).then(res => {
				const { serviceId } = this.serviceInfoDTO;
				const params = {
					serviceIdList: [serviceId],
					approveNotes: '取消售后'
				};
				this.$loading.show();
				afterSaleHandler.auditCancel(params).then(res => {
					this.getServiceDetailInfo();
				}).finally(() => {
					this.$loading.hide();
				});
			}).catch(rej => {
			});
		},
		// 填写服务单
		updateSendSku() {
            setSession('afterSale/wareInfo', JSON.stringify(Object.assign(
                {}, 
                this.item, 
                {serviceExpressInfoDTO: this.serviceExpressInfoDTO}, 
                {applyTime: this.serviceInfoDTO.applyTime}
            )));
			this.$router.push({
				path: '/order/afterSale/sendSku'
			});
		},
        // 确认完成
        confirm() {
            SnModal({
				message: '确认完成服务单？',
				showCancelButton: true
			}).then(res => {
				const { channelId, companyId, userId } = afterSaleHandler;
                const { serviceId } = this.serviceInfoDTO;
                const params = {
                    channelId,
                    companyId,
                    userId,
                    serviceId
                };
                this.$loading.show();
                afterSaleHandler.confirmOrder(params).then(res => {
                    this.getServiceDetailInfo();
                }).finally(() => {
                    this.$loading.hide();
                });
			}).catch(rej => {
			});
        }
    },
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/order/afterSale/serviceDetail.less';
</style>