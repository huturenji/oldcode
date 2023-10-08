<template>
    <div class="after-sale-result">
        <div class="result-info">
            <div class="wrap-icon">
                <Icon type="icon_common_success" class="success" size='1.1'/>
            </div>
            <p class="success-desc">售后服务点申请成功</p>
            <div class="btn-group">
                <SnButton inline shape="round" @click="viewDetail">查看详情</SnButton>
                <SnButton type="primary" inline shape="round" @click="viewHome">售后主页</SnButton>
            </div>
        </div>
        <div class="order-info">
            <SnListItem 
                title="退款方式 :"
                value="原支付返回" 
                label-number="5" 
                value-position="left" 
                :border="false" 
            />
            <SnListItem 
                v-if="activeBackWay"
                title="商品退回 :" 
                :value="activeBackWay.name" 
                label-number="5" 
                value-position="left" 
                :border="false" 
            />
            <SnListItem 
                v-if="asPickwareDTO.pickwareType === 4"
                title="取件地址 :" 
                :value="asPickwareDTO.pickwareFullAddress" 
                label-number="5" 
                value-position="left" 
                :border="false" 
            />
            <SnListItem 
                v-if="serviceInfoDTO.customerExpect !== 10"
                title="收货地址 :" 
                :value="asReturnwareDTO.returnwareFullAddress" 
                label-number="5" 
                value-position="left" 
                :border="false" 
            />
            <SnListItem 
                class="contract"
                title="联系人 :" 
                :value="asCustomerDTO.customerContactName" 
                label-number="5" 
                value-position="left" 
                :border="false" 
            />
            <SnListItem 
                title="联系电话 :" 
                :value="asCustomerDTO.customerTel | sensitiveHide" 
                label-number="5" 
                value-position="left" 
                :border="false" 
            />
        </div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';//工具类
import Icon from 'commonComp/base/Icon';
import {
    SnButton,
    SnListItem
} from "sinosun-ui";
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
const {
    getSession,
    setSession
} = extendUtils;

export default {
	mixins: [tChatEventMixin],
	components: {
        SnButton,
        SnListItem,
        Icon
    },
    filters: {
		// 手机号敏感隐藏
		sensitiveHide: extendUtils.sensitiveHide
	},
    data(){
		return {
            orderInfo: {},
            serviceInfoDTO: {},
            asCustomerDTO: {},
            asPickwareDTO: {},
            asReturnwareDTO: {},
            activeBackWay: null
        }
    },
    created() {
        let info = getSession('afterSale/orderInfo') && JSON.parse(getSession('afterSale/orderInfo')) || {};
        const {
            serviceInfoDTO,
            asCustomerDTO,
            asPickwareDTO,
            asReturnwareDTO,
            activeBackWay = {},
            serviceId
        } = info;

        this.orderInfo = info;
        this.serviceInfoDTO = serviceInfoDTO || {};
        this.asCustomerDTO = asCustomerDTO || {};
        this.asPickwareDTO = asPickwareDTO || {};
        this.asReturnwareDTO = asReturnwareDTO || {};
        this.activeBackWay = activeBackWay;
        this.serviceId = serviceId;
    },
    methods: {
        goBackFun(){
            setSession('afterSale/activeTab', 1);
			this.$router.replace({
                path: '/order/afterSale/list',
                query: {
                    origin: 'result'
                }
            });
		},
        viewDetail() {
            setSession('afterSale/activeTab', 1);
            this.$router.push({
                path: '/order/afterSale/serviceDetail',
                query: {
                    origin: 'result'
                }
            });
        },
        viewHome() {
            this.goBackFun();
        }
    },
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/order/afterSale/result.less';
</style>