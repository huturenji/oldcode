<!--提交申请页面-->
<template>
    <div class="after-sale-apply">
		<div class="card-list-item">
			<div class="wrap-img">
				<!-- dealImg 在globalMixin里面-->
				<img :src="BMallConfig.GOODS.DEFAULT_THUMBNAIL" v-real-img="dealImg(item.imageUrl)">
			</div>
			<div class="card-list-item-content">
				<div class="card-list-item-content-title">{{item.name}}</div>
				<div class="card-list-item-content-footer">
					<span class="price">单价:&nbsp;<span>¥{{item.unitPrice}}</span></span>
					<span class="quantity">购买数量:&nbsp;<span>{{item.quantity}}</span></span>
					<span class="quantity">申请数量:&nbsp;<span>{{applyNum}}</span></span>
				</div>
			</div>
		</div>
		<SnListItem class="apply-amount" title="申请数量" :border="false">
			<counter v-model="applyNum" :showLable="false" :max="item.availableNum" />
		</SnListItem>
		<div class="apply-detail">
			<SnListItem 
				title="申请原因" 
				title-class="form-title" 
				right-icon="right"
				:border="false"
				@click="chooseReason"
			>
				<div v-if="!activeReason.code" class="placeholder">请选择申请原因</div>
				<div v-else>{{activeReason.name}}</div>
			</SnListItem>
            <!-- 退货时为必填项 -->
			<SnListItem 
			 	v-if="serviceType.key === 'return'"
				title="商品状态"
				title-class="form-title"
				:border="false"
				:label-number="5"
			>
				<SnRadioGroup v-model="packageDesc">
                    <SnRadio :name="20" shape="check">已拆封</SnRadio>
                    <SnRadio :name="10" shape="check">未拆封</SnRadio>
                </SnRadioGroup>
			</SnListItem>
			<div v-if="serviceType.key === 'return' && SUPPLIER_CONFIG.name" class="ware-status-tip">{{SUPPLIER_CONFIG.name}}会在收货时再次确认商品状态</div>
			<div class="detail">
				<x-textarea 
					v-model="reason" 
					:max="500" 
					:rows="5" 
					autosize 
					:placeholder="'请描述申请' + serviceType.name + '服务的具体原因'" 
				/>
                <!-- 上传附件 -->
				<Uploader
                    action="/mall/file/v1/upload"
                    @success="onSuccess"    
					@remove="onRemove"
                >
				</Uploader>
				<div class="upload-tip"><Icon type="icon-clamation-circle" size='.24'/>为了您更好的解决问题，请务必上传照片凭证</div>
			</div>
		</div>
        <!-- 返回方式 -->
		<div class="back-way">
			<SnListItem
                v-if="serviceType.key === 'return'"
                title="退款方式" 
                title-class="form-title" 
                value="原支付返回" 
                :border="false" 
            />
			<SnListItem 
				title="返回方式" 
				title-class="form-title" 
				:value="activeBackWay.name" 
				:right-icon="isRepair ? null : 'right'"
				:border="activeBackWay.code === 4"
				@click="chooseBackWay"
			/>
        </div>

        <!-- 上门维修 -->
        <template v-if='isRepair'>
            <div class="repair">
                <SnListItem value-position="left" title="维修地址">
                </SnListItem>
                <SnListItem icon="location" value-position="left" right-icon="right" @click="editAddress('pickWare')">
                    <div class="address">{{pickWare | area}}{{pickWare.address}}</div>
                </SnListItem>
            </div>
            <div class="repair-time" @click="showServiceTime=true">
                <SnListItem 
                    title="上门时间"
                    :value="serviceTime.wholeText" 
				    right-icon="right">
                </SnListItem>
            </div>
        </template>
        <template v-else-if='activeBackWay.code === 4'>
		<!-- 上门取件客户信息 -->
		    <div class="pick-up" v-if="activeBackWay.code === 4" @click="canChangeReciveAddress && editAddress('pickWare')">
                <SnListItem icon="location" value-position="left" :right-icon="canChangeReciveAddress ? 'right' : null">
                    <div><span>{{customerContactName}}</span><span class="telephone">{{customerTel | sensitiveHide}}</span></div>
                    <div class="address">{{pickWare | area}}{{pickWare.address}}</div>
                </SnListItem>
            </div>
        </template>
		<!-- 收货地址 -->
		<div class="receive-address" v-if="serviceType.key !== 'return' && !isRepair">
			<SnListItem :label-number="activeBackWay.code === 4 ? 5 : 0">
				<div slot="title">
					收货地址<span class="receive-address-tip" v-if="activeBackWay.code !== 4 && SUPPLIER_CONFIG.name">（该地址是{{SUPPLIER_CONFIG.name}}回寄给您的地址）</span>
				</div>
				<div v-if="activeBackWay.code === 4 && canChangeReciveAddress" class="keep-receive-address">
					<span>与取件地址保持一致</span><SnSwitch v-model="keepWithReceiveAddress" />
				</div>
			</SnListItem>
			<SnListItem
				v-if="!keepWithReceiveAddress"
				icon="location" 
				value-position="left" 
				:right-icon="canChangeReciveAddress ? 'right' : null"
				@click="canChangeReciveAddress && editAddress('returnWare')"
			>
				<div>{{returnWare | area}}{{returnWare.address}}</div>
			</SnListItem>
		</div>
		<!-- 返回方式不是选择上门取件则应展示联系人和手机号填写项 -->
		<div class="personal-info" v-if="!(activeBackWay.code == 4 && !isRepair)">
			<SnListItem title-class="form-title" center>
				<i class="icon user" slot="icon" />
				<input 
                    type="text"
                    maxlength="64"
                    v-model="customerContactName" 
                    placeholder="请输入联系人"
                    @focus="onFocus('user')" 
                />
			</SnListItem>
			<SnListItem center>
				<i class="icon phone" slot="icon" />
				<input 
                    type="text"
                    maxlength="16"
                    placeholder="请输入联系电话"
                    :value="customerTel | sensitiveHide"
                    @focus="onFocus('phone')"
                    @input="e => customerTel = e.target.value"
                />
			</SnListItem>
		</div>
		<div class="wrap-footer-btn">
			<div class="after-apply-tip">提交服务单后，售后专员可能与您电话沟通，请保持手机畅通</div>
			<SnButton type="primary" shape="round" @click="onSubmit">提交</SnButton>
		</div>
		<!-- 申请原因列表选择 -->
		<div v-transfer-dom>
			<SnPopup v-model="showReason" class="popup">
				<div class="popup-header">
					<span>申请原因</span>
					<i class="close" @click="closeReasonPopup" />
				</div>
				<SnRadioGroup v-model="activeReason.code">
					<SnListItem
						v-for="item in reasonList"
						:key="item.code"
						:title="item.name"
						:border="false"
						@click="chooseActiveReason(item)"
					>
						<SnRadio slot="right-icon" :name="item.code" shape="check" />
					</SnListItem>
				</SnRadioGroup>
			</SnPopup>
		</div>
		<!-- 返回方式列表选择 -->
		<div v-transfer-dom>
			<SnPopup v-model="showBackWay" class="popup">
				<div class="popup-header">
					<span>返回方式</span>
					<i class="close" @click="closeBackWayPopup" />
				</div>
				<SnRadioGroup v-model="activeBackWay.code">
					<SnListItem
						v-for="item in backWayList"
						:key="item.code"
						:title="item.name"
						:border="false"
						@click="chooseActiveBackWay(item)"
					>
						<SnRadio slot="right-icon" :name="item.code" shape="check" />
					</SnListItem>
				</SnRadioGroup>
			</SnPopup>
        </div>
        <!-- 上门维修时间列表选择 -->
		<div v-transfer-dom>
			<SnPopup v-model="showServiceTime" class="popup" @closed='selectServiceTime = serviceTime'>
				<div class="popup-header">
					<span>上门时间</span>
					<i class="close" @click="closeServiceTimePopup" />
                </div>
                <div class='service-time-content'>
                    <div class='service-date'>
                        <ul>
                            <li v-for='serviceTime in serviceTimeList' @click='chooseServiceDate(serviceTime.key)' :class='{"selected": selectServiceDate == serviceTime.key}'>
                                {{serviceTime.text}}
                            </li>
                        </ul>
                    </div>
                    <template v-for='serviceTime in serviceTimeList'>
                        <SnRadioGroup v-model="selectServiceTime.key" v-show='selectServiceDate == serviceTime.key' class='service-quantum-panel'>
                            <SnListItem
                                v-for="item in serviceTime.timeQuantum"
                                :key="item.key"
                                :title="item.text"
                                :border="true"
                                right-icon="right"
                                @click="selectServiceTime = item"
                            >
                                <SnRadio slot="right-icon" :name="item.key" shape="check" />
                            </SnListItem>
                        </SnRadioGroup>
                        <div class='btn-group'>
                            <SnButton type="primary" shape="round" @click="confirmServiceTime()">提交</SnButton>
                        </div>
                    </template>
                </div>
			</SnPopup>
		</div>
		<!-- 编辑地址 -->
		<div v-transfer-dom>
			<SnPopup v-model="showEditAddress" position="right" class="edit-address">
				<div class="popup-content">
					<div class="form">
						<SnListItem
							title="所在地区"
							title-class="form-title"
							:label-number="5"
							:value="editAddressInfo | area"
							value-position="left"
							right-icon="right"
							required
							@click="showArea"
						/>
						<SnListItem
							title="详细地址"
							title-class="form-title"
							:label-number="5"
							value-position="left"
							required
						>
							<x-textarea 
								v-model="editAddressInfo.address"  
								:rows="2"
								autosize 
								placeholder="请输入详细地址"
							/>
						</SnListItem>
						<SnListItem
							v-if="editAddressType === 'pickWare'"
							title="联系人"
							title-class="form-title"
							:label-number="5"
							value-position="left"
							required
						>
							<input 
                                type="text" 
                                maxlength="64"
                                v-model="editAddressInfo.customerContactName" 
                                placeholder="请输入联系人" 
                            />
						</SnListItem>
						<SnListItem
							v-if="editAddressType === 'pickWare'"
							title="联系电话"
							title-class="form-title"
							:label-number="5"
							value-position="left"
							required
						>
							<input 
								type="text"
								maxlength="16"
								placeholder="请输入联系电话"
								:value="editAddressInfo.customerTel | sensitiveHide"
								@focus="onFocus('phone')"
								@input="e => editAddressInfo.customerTel = e.target.value"
							/>
						</SnListItem>
					</div>
					<div class="wrap-btn">
						<SnButton type="primary" shape="round" @click="onSubmitAddress">提交</SnButton>
					</div>
				</div>
			
				<SnPopup v-model="chooseAreaShow" class="popup choose-area">
                    <div class="popup-content">
                        <AddressComp
							ref="addressCompChoose"
							:showTitle="true"
							titleName='选择地址'
                            @closePop="chooseAreaShow = false"
                            @selectAddress="selectAddress"
                        />
                    </div>
				</SnPopup>
			</SnPopup>
		</div>
    </div>
</template>
<script>
import { 
	SnListItem,
	SnButton,
	SnRadio,
	SnRadioGroup,
	SnPopup,
	SnSwitch,
	TransferDom
} from "sinosun-ui";
import Icon from 'common/components/base/Icon';
import { XTextarea } from 'vux';
import counter from 'common/components/base/counter';//数量加减的组件
import Uploader from './uploader';
import AddressComp from 'common/components/base/AddressComp.vue'; //三级联动的组件
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import afterSaleHandler from 'common/lib/requestHandler/afterSaleHandler.js';
import Config from 'common/lib/config.js';
import extendUtils from 'common/lib/utils';//工具类
import Bus from 'common/lib/bus/bus.js';
const {
    stateManager,
    showToast,
    getSession,
    setSession,
    sensitiveHide,
    isPC,
    debounce
} = extendUtils;

let isFocused = false;

export default {
	mixins: [tChatEventMixin],
    components: {
		SnListItem,
		SnButton,
		SnRadio,
		SnRadioGroup,
		SnPopup,
		Icon,
		SnSwitch,
		Uploader,
		counter,
		XTextarea,
		AddressComp
	},
	directives: {
		TransferDom
	},
	filters: {
		// 地区展示
		area: val => {
			if(val && typeof val === 'object' && JSON.stringify(val) !== '{}') {
				const {
					province = '',
					city = '',
					county = '',
					village = ''
				} = val;

				return `${province || ''} ${city || ''} ${county || ''} ${village || ''}`;
			}
			return '';
		},
		// 手机号敏感隐藏
		sensitiveHide:  val => {
            if(isFocused) {
                return val;
            } else {
                return sensitiveHide(val);
            }
        }
    },
    computed: {
        isRepair(){
            return this.activeBackWay.code === 4 && this.activeBackWay.serviceTime && this.activeBackWay.serviceTime.length>0
        },
        /**
         * 苏宁返回的服务时间格式为20201123090000
         * 090000表示上午，150000表示下午，180000表示全天
         */ 
        serviceTimeList(){
            if(!this.isRepair){
                return null;
            }
            let result = [];
            this.activeBackWay.serviceTime.split(',').forEach(time => {
                let hit = result.find(r => r.key.replace(/\//g,'') == time.substring(0,8));
                let timeQuantumStr = Config.SERVICE_TIME[time.substring(8)];
                if(!hit){
                    let timeStr = time.substring(0, 4) + '/' + time.substring(4, 6) + '/' + time.substring(6, 8);
                    let date = new Date(timeStr);
                    let dateStr = date.format('MM月dd日') + "(" + extendUtils.indexToWeek(date.getDay()) + ")"; 
                    //计算时间段
                    let timeQuantum = [];
                    result.push({
                        key: timeStr,
                        text: dateStr,
                        timeQuantum: [{
                            key: time,
                            text: timeQuantumStr,
                            wholeText: dateStr + ' ' +timeQuantumStr
                        }]
                    })
                }else{
                    hit.timeQuantum.indexOf(timeQuantumStr)==-1 && hit.timeQuantum.push({
                        key: time,
                        text: timeQuantumStr,
                        wholeText: hit.text + ' ' +timeQuantumStr
                    })
                }
            })
            return result;
        },

        //是否能修改收货地址
        canChangeReciveAddress(){
            try{
                //苏宁的上门取件不可修改地址
                return !(this.SUPPLIER_CONFIG.changeReceiveAddress[this.serviceType.key] === false)
            }catch(e){
                console.info(e)
            }
            return false;
        }
    },
    data(){
        let that = this;
		//stateManager用于存放弹窗对象，具体用法参见popStateManager.js
		return Object.assign(stateManager.setData([
            "chooseAreaShow",
            {
                name: "showEditAddress",
                hide: {
                    callback:  function() {
                        that.showEditAddress = false;
                        document.title = that.serviceType.name;
                    }
                }
            },
            "showReason",
            "showBackWay",
            "showServiceTime",
        ], this), 
        {
			//其他的data属性写这里
			item: {},
			applyNum: 1,
			packageDesc: 0,
			reason: '',
			questionPic: [],
			reasonList: [],
			activeReason: {
				code: null,
				name: ''
			},
			backWayList: [],
			activeBackWay: {},
			keepWithReceiveAddress: false,
			// 取件地址
			pickWare: {},
			// 返件地址
			returnWare: {},
			customerContactName: '',
			customerTel: '',
            editAddressInfo: {},
            selectServiceDate: '',//选中的维修日期
            selectServiceTime: '',//选中的维修时段
            serviceTime: {},//最终确认的维修时段
            SUPPLIER_CONFIG: afterSaleHandler.supplierId ? Config.SUPPLIER_Map[afterSaleHandler.supplierId] : {}
		})
    },
    created() {
		const wareInfo = getSession('afterSale/wareInfo') && JSON.parse(getSession('afterSale/wareInfo')) || {};
		const {key, code, name = ''} = getSession('afterSale/serviceChooseInfo') && JSON.parse(getSession('afterSale/serviceChooseInfo')) || {};
		this.item = {...wareInfo};
		this.serviceType =  {
			key,
			code: parseInt(code),
			name
		};
        this.innerHeight = window.innerHeight;
        isFocused = false;
        document.title = name;
	},
	mounted() {
        
		const code = this.serviceType.code;
        
        if(code) {
            this.getApplyReasonTypes(code);
            this.getWareReturnComp();
            this.getOrderDetail();
        }

        window.addEventListener('resize', this.scrollIntoView);
	},
    beforeDestroy() {
        window.removeEventListener('resize', this.scrollIntoView);
    },
    methods: {
		goBackFun(){
			this.$router.back();
		},

        scrollIntoView() {
            if(!isPC() && window.innerHeight === this.innerHeight) {
                if(/iphone/i.test(navigator.userAgent)) return;
                if(document.activeElement.tagName === 'INPUT' || document.activeElement.tagName ===  'TEXTAREA') {
                    setTimeout(() => {
                        document.activeElement.blur();
                    }, 350);
                }
            }
        },
		// 查询申请原因类型
		getApplyReasonTypes(code) {
			const params = {
                customerExpect: code,
                supplierId: this.item.supplierId
			};
			afterSaleHandler.getApplyReasonTypes(params).then(res => {
				const result = res.result || {};
                const applyReasons = result.applyReasons || [];
                if(applyReasons.length) {
                    this.reasonList = applyReasons.map((item, index) => {
                        return {
                            code: `${index + 1}`,
                            name: item
                        };
                    });;
                }
			});
		},
		// 查询商品逆向配送
		getWareReturnComp() {
			const { supplierId = '', supplierOrderNo = '', sku = '', parentSupplierOrderNo = '', receiverInfo = {} } = this.item;
			const params = {
				supplierId,
				spOrderId: supplierOrderNo,
				skuId: sku,
                cityCode: receiverInfo.cityCode || null,
                districtCode: receiverInfo.districtCode || null,
                parentSupplierOrderNo: parentSupplierOrderNo || null,
                serviceCategory: this.serviceType.code
			};
			afterSaleHandler.getWareReturnComp(params).then(res => {
				if(res) {
					const result = res.result || {};
					const pickwareTypes = result.pickwareTypes || [];
					if(pickwareTypes.length) {
						pickwareTypes.map(item => {
							item.code = parseInt(item.code);
						});
						this.backWayList = pickwareTypes;
                        this.activeBackWay = pickwareTypes[0];

                        if(this.serviceTimeList && this.serviceTimeList.length>0){
                            this.selectServiceDate = this.serviceTimeList[0].key;
                            this.serviceTime = this.serviceTimeList[0].timeQuantum[0];
                            this.selectServiceTime = this.serviceTimeList[0].timeQuantum[0];
                        }
					}
				}
			});
		},
		// 查询订单信息
		getOrderDetail() {
            const { channelId, companyId, userId } = afterSaleHandler;
			const { orderNo } = this.item;
			const params = {
                channelId,
                companyId,
                userId,
				orderNo: orderNo
			};
			afterSaleHandler.getOrderDetail(params).then(res => {
				const result = res.result || {};
				const receiverInfo = result.receiverInfo || {};
				let {
					provinceCode,
					cityCode,
					districtCode,
					townCode,
					province,
					city,
					district,
					town,
					address,
					name,
					phone
				} = receiverInfo;

                townCode = townCode || 0;
				const addressInfo = {
					code: [provinceCode, cityCode, districtCode, townCode],
					province: province,
					city: city,
					county: district,
					village: town,
					address: address
				};
				this.pickWare = {...addressInfo};
				this.returnWare = {...addressInfo};
				this.customerContactName = name;
				this.customerTel = phone;
				this.editAddressInfo = {
					...addressInfo,
					customerContactName: name,
					customerTel: phone
				};
			});
		},
		// 上传成功
        onSuccess(fileObj) {
            this.questionPic.push(fileObj.downLoadUrl);
		},
		//用户删除一个图
		onRemove(index){
			if(index < 0 || index >= this.questionPic.length){
				return
			}
			this.questionPic.splice(index, 1);
		},
        chooseReason() {
			this.showReason = true;
		},
		closeReasonPopup() {
			this.showReason = false;
		},
		chooseActiveReason(item) {
			this.activeReason = item;
			this.closeReasonPopup();
		},
		chooseBackWay() {
            if(this.isRepair){
                return;
            }
			this.showBackWay = true;
		},
		closeBackWayPopup() {
			this.showBackWay = false;
		},
		chooseActiveBackWay(item) {
			this.activeBackWay = item;
			this.closeBackWayPopup();
        },
        closeServiceTimePopup(){
            this.showServiceTime = false;
        },
        chooseServiceDate(date){
            this.selectServiceDate = date
        },
        confirmServiceTime(){
            this.serviceTime = this.selectServiceTime;
            this.closeServiceTimePopup();
        },
        // 联系人、手机号输入框获取焦点时
        onFocus(type) {
            // 只针对手机号获取焦点时清空内容
            if(type === 'phone') {
                if(!isFocused) {
                    if(this.showEditAddress) {
                        this.editAddressInfo.customerTel = '';
                    } else {
                        this.customerTel = '';
                    }
                }
                isFocused = true;
            }
            // 输入框获取焦点时让活动元素进入可视区域
            // setTimeout(() => {
            //     document.activeElement.scrollIntoView({
            //         behavior: "smooth",
            //         block: "center"
            //     });
            // }, 500);
        },
		// 打开编辑地址弹窗
		editAddress(type) {
			this.editAddressInfo = {
				...this[type],
				customerContactName: this.customerContactName,
				customerTel: this.customerTel
			}
			if(type === 'pickWare') {
				document.title= "编辑取件地址";
			} else {
				document.title= "编辑收货地址";
			}
			this.editAddressType = type;
            Bus.$emit('CLEAR_CODE');
			this.showEditAddress = true;
		},
		// 打开地址选择
		showArea() {
			this.chooseAreaShow = true;
			let code = this.editAddressInfo.code;
            code && code.length === 4 && code[3] === 0 && code.pop();
            this.$nextTick(() => {
                Bus.$emit('AUTO_SELECT_CITYS', this.editAddressInfo.code.join('/'));
            });
			
		},
        // 选中地址
		selectAddress(idArr, nameArr) {
            this.editAddressInfo.code = idArr.map(item => parseInt(item));
            this.editAddressInfo.province = nameArr[0];
            this.editAddressInfo.city = nameArr[1] || '';
            this.editAddressInfo.county = nameArr[2] || '';
            this.editAddressInfo.village = nameArr[3] || '';
            this.chooseAreaShow = false;
		},
		// 提交编辑地址
		onSubmitAddress() {
			const {
                code = [],
				province,
				city,
				county,
				village,
				address = '',
				customerContactName = '',
				customerTel = ''
			} = this.editAddressInfo;
			const editAddressType = this.editAddressType;

            if(code.length === 0) {
                showToast(`请选择地区`);
                return;
            }
            if(address.trim() === '') {
                showToast(`请填写详细地址`);
                return;
            }

            if(this.editAddressType === 'pickWare') {
                if(customerContactName.trim() === '') {
                    showToast(`请填写联系人`);
                    return;
                }
                if(customerTel.trim() === '') {
                    showToast(`请填写联系电话`);
                    return;
                }

                if(this.keepWithReceiveAddress) {
                    this.returnWare = {
                        code,
                        province,
                        city,
                        county,
                        village,
                        address
                    };
                }
            }

			this[editAddressType] = {
				code,
				province,
				city,
				county,
				village,
				address
			};

			this.customerContactName = customerContactName;
			this.customerTel = customerTel;
			this.showEditAddress = false;
		},
		// 提交申请
		onSubmit() {
			const {
				serviceType,
				applyNum,
				reason,
				questionPic,
				activeReason,
				activeBackWay,
				packageDesc,
				pickWare,
				returnWare,
                keepWithReceiveAddress,
				customerContactName,
				customerTel
			} = this;
			const { 
				supplierId, 
				orderNo, 
				supplierOrderNo, 
				sku,
				imageUrl,
				quantity,
				name,
                unitPrice,
                parentSupplierOrderNo,
                masterSku
			} = this.item;
			const { channelId, companyId, userId } = afterSaleHandler;

			if(!activeReason.code) {
				showToast('请选择申请原因');
				return;
			}
			if(reason.trim() === '') {
				showToast(`请填写${serviceType.name}具体原因`);
				return;
			}
			if(serviceType.code === 10 && packageDesc === 0) {
				showToast(`请选择商品状态`);
				return;
			}
            if(customerContactName.trim() === '') {
                showToast(`请填写联系人`);
				return;
            }
            if(customerTel.trim() === '') {
                showToast(`请填写联系电话`);
				return;
            }

			const params = {};
			params.userInfo = {
				"channelId": channelId,
				"companyId": companyId,
				"userId": userId
			};
			params.serviceInfoDTO = {
				"orderId": orderNo,
				"supplierId": supplierId,
				"spOrderId": supplierOrderNo,
				"customerExpect": serviceType.code,
				"applyReasonType": activeReason.name,
				"questionDesc": reason,
				"questionPic": questionPic.join(','),
				"needDetectionReport": 0,
				"hasPackage": 0,
                "packageDesc": packageDesc,
                "parentSupplierOrderNo": parentSupplierOrderNo,
            };
            //上面维修的serviceTime参数（如果有）
            if(!!this.serviceTime){
                params.serviceInfoDTO.serviceTime = this.serviceTime.key;
            }
			params.asCustomerDTO = {
				"customerContactName": customerContactName,
				"customerTel": customerTel,
				"customerMobilePhone": customerTel,
				"customerEmail": "",
				"customerPostcode": ""
			};
            if(activeBackWay.code === 4) {
                params.asPickwareDTO = {
                    "pickwareType": activeBackWay.code,
                    "pickwareProvince": pickWare.code[0],
                    "pickwareCity": pickWare.code[1],
                    "pickwareCounty": pickWare.code[2],
                    "pickwareVillage": pickWare.code[3] || 0,
                    "pickwareAddress": pickWare.address,
                    "pickwareFullAddress": `${pickWare.province || ''} ${pickWare.city || ''} ${pickWare.county || ''} ${pickWare.village || ''}${pickWare.address || ''}`
                };
            } else {
                params.asPickwareDTO = {
                    "pickwareType": activeBackWay.code
                };
            }
            // 如果选中收货地址与取件地址保持一致，就将取件地址赋给收货地址
            if(keepWithReceiveAddress) {
                params.asReturnwareDTO = {
                    "returnwareType": 10,
                    "returnwareProvince": pickWare.code[0],
                    "returnwareCity": pickWare.code[1],
                    "returnwareCounty": pickWare.code[2],
                    "returnwareVillage": pickWare.code[3] || 0,
                    "returnwareAddress": pickWare.address,
                    "returnwareFullAddress": `${pickWare.province || ''} ${pickWare.city || ''} ${pickWare.county || ''} ${pickWare.village || ''}${pickWare.address || ''}`
                };
            } else {
                params.asReturnwareDTO = {
                    "returnwareType": 10,
                    "returnwareProvince": returnWare.code[0],
                    "returnwareCity": returnWare.code[1],
                    "returnwareCounty": returnWare.code[2],
                    "returnwareVillage": returnWare.code[3] || 0,
                    "returnwareAddress": returnWare.address,
                    "returnwareFullAddress": `${returnWare.province || ''} ${returnWare.city || ''} ${returnWare.county || ''} ${returnWare.village || ''}${returnWare.address || ''}`
                };
            }
			params.asDetailDTO = {
				"skuId": sku,
				"skuNum": applyNum,
				"skuImagePath": imageUrl,
				"quantity": quantity,
				"wareName": name,
				"wareBrand": "",
				"detailType": 10,
				"wareDescribe": name,
				"warePrice": unitPrice,
                "warePayMoney": unitPrice,
                "masterSku": masterSku
			};
            this.$loading.show();
			afterSaleHandler.createApply(params).then(res => {
                const result = res.result || {};
                setSession('afterSale/orderInfo', JSON.stringify(Object.assign({}, params, {activeBackWay, serviceId: result.serviceId})));

                this.$router.push({
                    path: '/order/afterSale/result'
                });
			}).finally(() => {
				this.$loading.hide();
			});
		}
    },
}
</script>
<style scoped lang="less">
  	@import '~themes/default/styles/order/afterSale/apply.less';
</style>