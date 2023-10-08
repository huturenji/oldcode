<template>
    <div class="after-sale-send-sku">
        <div class="content">
            <div class="package-info">
                <div class="title">包裹信息</div>
                <SnListItem 
                    title="快递公司" 
                    title-class="form-title" 
                    :label-number="5"
                    value-position="left"
                    right-icon="right"
                    required
                    @click="openExpress"
                >
                    <div v-if="!expressCompany" class="placeholder">请选择快递公司</div>
                    <div v-else>{{expressCompany}}</div>
                </SnListItem>
                <SnListItem 
                    title="快递单号"
                    title-class="form-title" 
                    :label-number="5"
                    value-position="left"
                    required
                >
                    <input type="text" v-model="expressCode" placeholder="请输入快递单号" />
                </SnListItem>
            </div>
            <div class="ware-info">
                <div class="title">包裹内商品信息</div>
                <SnListItem 
                    title="服务单号:"
                    title-class="form-title" 
                    :label-number="5"
                    value-position="left"
                    :value="item.serviceId"
                />
                <SnListItem 
                    title="申请时间:"
                    title-class="form-title" 
                    :label-number="5"
                    value-position="left"
                    :value="applyTime"
                />
            </div>
            <div class="product-title">商品信息</div>
            <div class="card-list-item">
                <div class="wrap-img">
                    <!-- dealImg 在globalMixin里面-->
                    <img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(item.skuImagePath)">
                    
                </div>
                <div class="card-list-item-content">
                    <div class="card-list-item-content-title">{{item.wareName}}</div>
                    <div class="card-list-item-content-footer">
                        <span class="price">单价:&nbsp;<span>¥{{item.unitPrice}}</span></span>
                        <span class="quantity">数量:&nbsp;<span>{{item.skuNum}}</span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <SnButton 
                type="primary" 
                shape="round"
                :loading="saveLoading"
                @click="onSave"
            >保存</SnButton>
        </div>
        <!-- 选择快递 -->
		<div v-transfer-dom>
			<SnPopup v-model="showExpress" position="right" class="express">
                <div class="popup-content">
                    <SnListItem
                        v-for="(item, index) in expressCompanyList" 
                        :key="index"
                        :title="item"
                        :right-icon="item === activeExpressCompany ? 'check' : ''"
                        @click="onSelectExpress(item)"
                    />
                </div>
			</SnPopup>
		</div>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';//工具类
import {
    SnListItem,
    SnButton,
    SnPopup,
    TransferDom
} from "sinosun-ui";
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler.js';
const {
    stateManager,
    showToast,
    getSession
} = extendUtils;

const expressCompanyList = [
    '京东快递', '圆通快递', '邮政EMS', '顺丰快递', '申通快递', '韵达快递', '宅急送', '中通快递', '优速快递', '百世快递', '天天快递', '全峰快递',
    '快捷速递', '全一快递', '速尔快递', '邮政快递包裹', '国通快递', '德邦快递', '如风达', '安得快递', '跨越速递', '中铁CRE', '安能快递', '中通快运',
    '增速益', '集成', '品骏快递', '珠海广丰', '韵达快运', '京东快运', '京东同城速配', '京东云递',
    '其它'
];

export default {
	mixins: [tChatEventMixin],
	components: {
        SnListItem,
        SnButton,
        SnPopup
    },
    directives: {
		TransferDom
	},
    data(){
		let that = this;
		//stateManager用于存放弹窗对象，具体用法参见popStateManager.js
		return Object.assign(stateManager.setData([
			{
                name: 'showExpress',
                show: {//弹窗显示时的操作
                    callback(){
                        
                    },
                    title: '',
                },
                hide: {//弹窗关闭时的操作
                    callback(){
                        that.expressCompany = that.activeExpressCompany;
						that.showExpress = false;
                    },
                    title: '填写发运信息',
                }
			}
		], this), {
            item: {},
            expressCompany: '',
            expressCompanyList,
            activeExpressCompany: '',
            showExpress: false,
            expressCode: '',
            applyTime: '',
            saveLoading: false,
        })
    },
    created() {
        const item = getSession('afterSale/wareInfo') && JSON.parse(getSession('afterSale/wareInfo')) || {};
        this.item = item;
        this.applyTime = item.applyTime && new Date(item.applyTime).format('yyyy-MM-dd HH:mm:ss');
        const serviceExpressInfoDTO = item.serviceExpressInfoDTO || {};
        this.expressCompany = serviceExpressInfoDTO.expressCompany || '';
        this.expressCode = serviceExpressInfoDTO.expressCode || '';
	},
    methods: {
        goBackFun(){
			this.$router.back();
		},
        openExpress() {
            this.activeExpressCompany = this.expressCompany;
            this.showExpress = true;
            document.title = '选择快递';
        },
        onSelectExpress(item) {
            this.activeExpressCompany = item;
            this.$nextTick(() => {
                this.expressCompany = this.activeExpressCompany;
                this.showExpress = false;
            });
        },
        onSave() {
            const {
                item,
                expressCompany,
                expressCode
            } = this;

            if(expressCompany.trim() === '') {
                showToast('请选择快递公司');
                return;
            }
            if(expressCode.trim() === '') {
                showToast('请填写快递单号');
                return;
            }

            const params = {
                serviceId: item.serviceId,
                freightMoney: '0',
                expressCompany,
                expressCode,
                deliverDate: +new Date()
            };
            this.saveLoading = true;
            afterSaleHandler.updateSendSku(params).then(res => {
                this.$router.back();
            }).finally(() => {
                this.saveLoading = false;
            });
            
        }
    },
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/order/afterSale/sendSku.less';
</style>