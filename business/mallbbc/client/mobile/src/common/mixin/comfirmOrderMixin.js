// 引入客服的功能
import { mapState } from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import bottomPopup from '@/components/bottom-popup/index.vue'
import addressHandler from '@/components/address/handler';
// 引入客服的功能
import customerService from '@/common/lib/customer-service';
import config from '@/common/lib/config';
import orderHandler from '@/components/order/handler';
import goodsHandler from '@/components/goods/handler';
// #ifdef H5
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
// #endif
const ISDECORATE = config.ISDECORATE;

const mixin = {
    components: {
        uniPopup,
        bottomPopup
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            loadFlag: false,
            orderAddress: {}, //下单所用的地址信息
            goodsData: [], //商品数据
            allData: {}, //确认下单返回的所有数据信息
            desc: '', //备注
            payType: 1, //1微信 2支付宝
            isBottomShow: true, //底部是否显示
            windowHeight: '',
            remark: '',
            cartIds: '', //购物车id集合
            ifOnShow: false,
            invoiceId: '', //发票id
            invoiceContent: 1, //发票内容     1=商品明细 2=商品类别     
            currentStore: {},
            platformCouponList: [], //平台优惠券列表
            platformCouponCode: '',
            platformCouponCodeText: '',
            totalDiscount: '',
            totalCouponDiscount:'',
            store_show_no_good: false,
            no_good_info: {},
            timer: '',
            isVatInvoice: true,
            spellTeamId: 0,
            integral: 0,
            orderLock: false, //下单锁
            skuList: [],
            storeIndex: "",//选择配送时间的当前店铺的index
            productPromiseCalendars: [], //多个商品的配送时间的数组
            calendarList: [],//选择配送时间日历数据
            calendarInstallList: [],//选择安装时间日历数据
            installtimeRangeList: [], //选择的安装时间的data数据 日期
            timeRangeList: [], //选择的配送时间的data数据 小时
            deliveryTimeStr: "",
            installTimeStr: "",
            // multiDate:false,//是否多个配送时间
            showType: 0, // onshow 执行type，type: 0 啥都不执行；1：切换地址；2：地址页返回
            initPrice: 0, //商品原价
            afterPayInfoBusinessDone: false,//下单成功轮询查询成功后续业务是否完成
            isSubmitTo: true,//是否可以提交订单，用于下单前的check操作
            allAvailableCouponList:[],//可用优惠券列表-只作为页面展示使用
            allDisableCouponList:[],//不可用优惠券列表-只作为页面展示使用

            recommendCouponList:[],//推荐优惠券组合
            isRecommendCoupon:true,//是否是推荐优惠券组合

            currentCouponList:[],//当前店铺优惠券信息

            currentPlatformCouponCode:'',//当前平台优惠券code

            
            currentStoreCouponCode:'',//当前店铺优惠券code
            currentStoreId:0,//当前店铺id

            couponNum:0,//已选优惠券数量
            isRecommendCount:1,//计数器

            isCheckBack: false,
            getGiftList:[], //接口请求回来的未经处理的赠品附件列表
            no_good_info_data:null,
            confirmParams:null,
            isPC:SnUtils.isPC()
        }
    },
    computed: {
        ...mapState(['hasLogin', 'userInfo', 'addressList', 'addressDone', 'defaultAddress'])
    },
    onHide() {
        this.ifOnShow = true
        //清除定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    },
    onUnload() {
        //清除定时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        uni.$off('addressBack')
        uni.$off('addressRequestDone', this.getVuexAddress)
        uni.$off('checkEdit')
    },
    onShow() {
        if (this.showType == 1) {
            this.confirmOrder(2)
            this.showType = 0
        } else if (this.showType == 2) {
            this.getAddressList(true)
            this.showType = 0
        }

        if (this.isCheckBack) {
            this.getAddressList(true)
            this.isCheckBack = false
        }
    },
    filters:{
        dateFormat: function (value) {
            try {
                let startDate = new Date(value.replace(/-/g, '/'));
                let dateStr = startDate.format("MM月dd日");
                let weekday = ["周日","周一","周二","周三","周四","周五","周六"]
                let week = weekday[startDate.getDay()];
                return `${dateStr}(${week})`;
            } catch (e){
                return value ;
            }
        },
        formateTel: function (value) {
            let newValue
            try {
                newValue = ISDECORATE?maskingText(MASKING_TYPE.TEL,value):value;
            } catch (error) {
            }
            return newValue;
        }
    },
    methods: {
        IntegrateCalendars() {
            this.goodsData.forEach(temp =>{
                let productPromiseCalendars = []
                temp.products.forEach(item =>{
                    this.productPromiseCalendars.forEach(i =>{
                        if (i.skus.indexOf(item.sku)>-1&&(productPromiseCalendars.indexOf(i)==-1)){
                            productPromiseCalendars.push(i);
                        }
                    })
                    temp["productPromiseCalendars"] = productPromiseCalendars
                })
            })
            this.goodsData.forEach(temp =>{
                if (temp.productPromiseCalendars.length == 1){ //如果是一个商品 此时仅有一个配送时间
                    let item = temp.productPromiseCalendars[0];
                    if (!!item && !!item.calendarList && item.calendarList.length > 0){
                        temp.calendarList = item.calendarList; //更新配送时间的日历
                        let dataArr = temp.calendarList.filter(items => {
                            return items.selected;
                        })
                        if (!!dataArr[0]){
                            temp.timeRangeList = dataArr[0].timeRangeList
                        }
                    } else {
                        temp.calendarList = [];
                    }
                    if (!!item && !!item.installDays && item.installDays.length > 0){ //如果有安装时间，更新安装时间的日历
                        temp.calendarInstallList = item.installDays; 
                        let arr = temp.calendarInstallList.filter(items => {
                            return items.selected;
                        })
                        if (!!arr[0]){
                            temp.installtimeRangeList = arr[0].timeRangeList
                        }
                    } else {
                        temp.calendarInstallList = [];
                    }
                    
                    temp.deliveryTimeStr= this.setdeliveryTimeStr(temp.calendarList,1)
                    temp.installTimeStr = this.setdeliveryTimeStr(temp.calendarInstallList,2)

                }
                else if (temp.productPromiseCalendars.length > 1){
                    temp.deliveryTimeStr=`${'京东'}物流，送货上门`
                }
            })
        },
        addressFlag(Type){
            addressHandler.checkAddress({
                provinceCode: this.orderAddress.provinceCode,
                cityCode:  this.orderAddress.cityCode,
                districtCode:  this.orderAddress.districtCode,
                townCode:  this.orderAddress.townCode,
                supplierType:  Type
            }).then(res => {
                if (res.state == 200) {
                    this.isSubmitTo = true
                } else if (res.state == 89101002){
                    this.isSubmitTo = false
                    this.showCheck()
                } else {
                    this.isSubmitTo = false
                    this.$api.msg(res.msg);
                }
            })
        },
        showCheck(){
            uni.showModal({
                title: '',
                content: '地址无法匹配，请重新更新该地址。',
                confirmText: '更新地址',
                cancelText: '取消',
                success: result => {
                    if (result.confirm) {
                        this.$Router.push({path:'/pages/address/operate',query:{type:'checkEdit',addressId:this.orderAddress.addressId}})
                        uni.hideLoading();
                    } else {
                        uni.hideLoading();
                    }
                }
            })
            uni.hideLoading();
        },
        getVuexAddress() {
            this.addressDone && this.getAddressList()
        },
        /**
         * 查询配送时间日历
         */
        getPromiseCalendar() {
            let _this = this
            let param = {}
            let goodsList = []
            _this.goodsData.forEach(temp =>{
                temp.products.forEach(item =>{
                    item['storeId'] = temp.storeId
                    goodsList.push(item)
                })
            })
            let goodsFilter = []

            goodsList.forEach(item =>{
                let obj ={
                    sku:item.sku,
                    num:item.number,
                    storeId:item.storeId
                }
                goodsFilter.push(obj)
            })
            const { provinceCode, cityCode, districtCode, townCode } = _this.orderAddress
            param = {
                skuNumList: goodsFilter,
                provinceCode,
                cityCode,
                districtCode,
                townCode

            }
            orderHandler.getPromiseCalendar(param).then(res => {
                if (res.state == 200) {
                    //将新增installDays字段
                    let promiseCalendars = []
                    _this.productPromiseCalendars = res.data.productPromiseCalendars.map(item => {
                        //新增安装日历
                        if (item.calendarList.length > 0){
                            let arrDelivery = item.calendarList.filter(items=>{
                                return items.selected;
                            })

                            let arrInstall = item.calendarDayInstallDays.filter((items) => {
                                return arrDelivery[0].dateStr == items.dateStr;
                            })

                            if (arrInstall.length > 0){
                                _this.$set(item, 'installDays', arrInstall[0].installDays)
                            } else {
                                _this.$set(item, 'installDays', []);
                            }                                 
                        } else {
                            _this.$set(item, 'installDays', []);
                        }
                        let imgArr = [];
                        item.skus.forEach(element => {
                            promiseCalendars.push(element)

                            let selectedItem = goodsList.filter(items=>{
                                return element == items.sku;
                            })
                            selectedItem.length > 0 && imgArr.push(selectedItem[0].mainImage)
                        });
                        let deliveryTimeStr = _this.setdeliveryTimeStr(item.calendarList,1)
                        let installTimeStr = _this.setdeliveryTimeStr(item.installDays,2)
                        let filteredCalendars = _this.filterCalendars(item.calendarList); // 过滤掉不支持配送日历的日期
                        _this.$set(item, 'imgPathList', imgArr);
                        _this.$set(item, 'deliveryTimeStr', deliveryTimeStr);
                        _this.$set(item, 'installTimeStr', installTimeStr);
                        _this.$set(item, 'calendarList', filteredCalendars);
                        return item;
                    });
                    this.IntegrateCalendars()
                    
                } else {
                    _this.productPromiseCalendars = []
                    _this.goodsData.forEach(temp =>{
                        let productPromiseCalendars = []
                        temp.products.forEach(item =>{
                            _this.productPromiseCalendars.forEach(i =>{
                                if (i.skus.indexOf(item.sku)>-1&&(productPromiseCalendars.indexOf(i)==-1)){
                                    productPromiseCalendars.push(i);
                                }
                            })
                            temp["productPromiseCalendars"] = productPromiseCalendars
                        })
                    })
                }

            })
        },

        // 过滤掉不支持配送的日历日期
        filterCalendars(list){
            if(!!!list || !!!list.length){ return [] }
            return list.filter(item => {
                //部分配送日期没有配送时间段，只对原本有，过滤后没有的日期做过滤2023-2-23
                let beforeLength =item.timeRangeList.length;
                let timeRangeList = item.timeRangeList.filter(temp => {
                    return !!temp.enable
                })
                let afterLength = timeRangeList.length;
                if(beforeLength>0 && afterLength==0){ return false }
                this.$set(item, 'timeRangeList', timeRangeList)
                return true
            })
        },

        // 配送安装时间的字符串显示
        setdeliveryTimeStr(list,type){  
            let str = '';
                
            if (!list||list.length <=0 ){ return str }
            let timeStr = '';
            let dataArr = []
            if (type==3){
                dataArr = list[0].installDays.filter(item => {
                    return item.selected;
                })
            } else {
                dataArr = list.filter(item => {
                    return item.selected;
                })
            }

            if (dataArr.length>=1 && !!dataArr[0].dateStr){
                let startDate = new Date(dataArr[0].dateStr.replace(/-/g, '/'));
                let dateStr = startDate.format("MM月dd日");
                let weekday = ["周日","周一","周二","周三","周四","周五","周六"]
                let week = weekday[startDate.getDay()];
                dateStr = `${dateStr}<text>(${week})</text>`;
                if (!!dataArr[0].timeRangeList && dataArr[0].timeRangeList.length > 0){
                    let timeArr = dataArr[0].timeRangeList.filter(item => {
                        return item.selected;
                    })
                    if (timeArr.length>=1 && !!timeArr[0].timeRange){
                        timeStr = `${timeArr[0].timeRange}`
                    }
                }
                str = `${dateStr} ${timeStr}`;
            }
            return str;
        },
        //配送时间选择商品
        clickItem(item, index){
            let calendarList = item.calendarList
            this.dateIndex = index
            this.calendarList = calendarList
            this.timeRangeList = calendarList.filter(items => {
                return items.selected;
            })[0].timeRangeList
            this.closePopup()
            this.openPopup('','',1)
        },
        // 安装安装的时间
        clickInstallItem(item, index){
            let calendarInstallList = item.installDays;
            this.dateIndex = index
            this.calendarInstallList = calendarInstallList
            this.timeRangeList = calendarInstallList.filter(items => {
                return items.selected;
            })[0].timeRangeList
            this.closePopup()
            this.openPopup('','',2)
        },
        //点击每一个日期的选项 
        clickDateItem(item, index,type){
            if (type == 1){
                //将每一项置为false,将当前点击的项置为true
                this.calendarList.forEach((element, i) => {
                    let flag = false;
                    if (index == i){
                        flag = true;
                    }
                    this.$set(element, 'selected', flag);
                });
                this.timeRangeList = !!item.timeRangeList && item.timeRangeList;
            } else if (type == 2){
                //将每一项置为false,将当前点击的项置为true
                this.calendarInstallList.forEach((element, i) => {
                    let flag = false;
                    if (index == i){
                        flag = true;
                    }
                    this.$set(element, 'selected', flag);
                });
                this.installtimeRangeList = !!item.timeRangeList && item.timeRangeList;
            }
        },
        //点击每一个时间段的选项 
        clickTimeItem(item, index,type){
            if (type == 1){
                let dateIndex = this.calendarList.findIndex(temp => {
                    return !!temp.selected
                })
                this.calendarList.forEach((temp, i) => {
                    if (i == dateIndex){
                        this.calendarList[i].timeRangeList.forEach((element, j) => {
                            if (index == j){
                                this.$set(element, 'selected', true);
                            } else {
                                this.$set(element, 'selected', false);
                            }
                        });
                        this.timeRangeList = this.calendarList[i].timeRangeList
                    } else {
                        this.calendarList[i].timeRangeList.forEach(element => {
                            this.$set(element, 'selected', false);
                        });
                    }
                })
            } else if (type == 2){
                let dateIndex = this.calendarInstallList.findIndex(temp => {
                    return !!temp.selected
                })
                this.calendarInstallList.forEach((temp, i) => {
                    if (i == dateIndex){
                        this.calendarInstallList[i].timeRangeList.forEach((element, j) => {
                            if (index == j){
                                this.$set(element, 'selected', true);
                            } else {
                                this.$set(element, 'selected', false);
                            }
                        });
                        this.installtimeRangeList = this.calendarInstallList[i].timeRangeList
                    } else {
                        this.calendarInstallList[i].timeRangeList.forEach(element => {
                            this.$set(element, 'selected', false);
                        });
                    }
                })

            }
        },
        //选择完配送时间后的回调
        updatePromiseCalendar(list){
            let calendarList = JSON.parse(JSON.stringify(list));
            let calendarArr = calendarList.filter(item => {
                return item.selected;
            })
            let storeData = this.goodsData[this.storeIndex]
            if (!!storeData.productPromiseCalendars&&storeData.productPromiseCalendars.length>1){
                storeData.productPromiseCalendars.forEach((item, i) => {
                    if (this.dateIndex >= 0 && i == this.dateIndex){
                        this.$set(item, 'calendarList', calendarList);
                        this.$set(storeData,'calendarList', calendarList);
                        this.$set(item, 'timeRangeList', calendarArr[0].timeRangeList);
                        this.$set(storeData,'timeRangeList', calendarArr[0].timeRangeList);
                        let deliveryTimeStr = this.setdeliveryTimeStr(item.calendarList,1)
                        this.$set(item, 'deliveryTimeStr', deliveryTimeStr);
                        //更新完配送时间后，如果有安装时间，同时更新安装时间
                        if (item.calendarDayInstallDays.length > 0){
                            item.calendarDayInstallDays.forEach(temp => {
                                if (temp.dateStr == calendarArr[0].dateStr){ //根据dataStr匹配配送时间对应的安装时间
                                    this.$set(item, 'installDays', temp.installDays);
                                    this.$set(storeData, 'installDays', temp.installDays);
                                    this.$set(storeData, 'calendarInstallList', temp.installDays);
                                    let installTimeStr = this.setdeliveryTimeStr(temp.installDays,2)
                                    this.$set(item, 'installTimeStr', installTimeStr);
                                    this.$set(storeData, 'installTimeStr', installTimeStr);
                                }
                            })
                        }
                    }
                })
            } else { //只有一个日期的时候
                let item = storeData.productPromiseCalendars[0];
                this.$set(item, 'calendarList', calendarList);
                this.$set(storeData,'calendarList', calendarList);
                let deliveryTimeStr = this.setdeliveryTimeStr(calendarList,1)
                this.deliveryTimeStr = deliveryTimeStr
                this.$set(item, 'deliveryTimeStr', deliveryTimeStr);
                this.$set(storeData, 'deliveryTimeStr', deliveryTimeStr);
                this.$set(storeData,'timeRangeList', calendarArr[0].timeRangeList);
                if (!!item.calendarDayInstallDays && item.calendarDayInstallDays.length > 0){
                    item.calendarDayInstallDays.forEach(temp => {
                        if (temp.dateStr == calendarArr[0].dateStr){ //根据dataStr匹配配送时间对应的安装时间
                            this.calendarInstallList = temp.installDays;
                            this.$set(item, 'installDays', temp.installDays);
                            this.$set(storeData, 'installDays', temp.installDays);
                            this.$set(storeData, 'calendarInstallList', temp.installDays);
                            let installTimeStr = this.setdeliveryTimeStr(temp.installDays,2)
                            this.installTimeStr = installTimeStr
                            this.$set(item, 'installTimeStr', installTimeStr);
                            this.$set(storeData, 'installTimeStr', installTimeStr);
                        }
                    })
                }
            }
        },
        //选择完安装时间后的回调
        updatePromiseInstallCalendar(list){
            let storeData = this.goodsData[this.storeIndex]
            let installCalendarList = JSON.parse(JSON.stringify(list));
            storeData.productPromiseCalendars.forEach((item, i)=>{
                if (this.dateIndex>=0 && i == this.dateIndex){
                    this.$set(item, 'installDays', installCalendarList)
                    this.$set(storeData, 'installDays', installCalendarList);
                    this.$set(storeData, 'calendarInstallList', installCalendarList);
                    let installTimeStr = this.setdeliveryTimeStr(item.installDays,2)
                    this.$set(item, 'installTimeStr', installTimeStr);
                    this.$set(storeData, 'installTimeStr', installTimeStr);
                }
            })
            if (!!storeData.productPromiseCalendars&&storeData.productPromiseCalendars.length<=1){
                let installTimeStr = this.setdeliveryTimeStr(installCalendarList,2)
                this.installTimeStr = installTimeStr
                this.$set(storeData.productPromiseCalendars[0], 'installDays', installCalendarList);
                this.$set(storeData.productPromiseCalendars[0], 'calendarInstallList', installCalendarList);
                this.$set(storeData, 'calendarInstallList', installCalendarList);
                this.$set(storeData.productPromiseCalendars[0], 'installTimeStr', installTimeStr);
                this.$set(storeData, 'installTimeStr', installTimeStr);
            }
        },
        // 打开弹窗
        openPopup(storeData,storeIndex,type){
            if ((typeof storeIndex)=='number' ){
                this.storeIndex = storeIndex
            }
            if (type==1){
                if (!!storeData){
                    this.timeRangeList = JSON.parse(JSON.stringify(storeData.timeRangeList));
                    this.calendarList = JSON.parse(JSON.stringify(storeData.calendarList))
                }
                this.$refs.intSendDate.open()
            } else if (type==2){
                if (!!storeData){
                    this.calendarInstallList = JSON.parse(JSON.stringify(storeData.calendarInstallList))
                    this.installtimeRangeList = JSON.parse(JSON.stringify(storeData.installtimeRangeList))
                }
                this.$refs.intInstallDate.open()
            } else {
                if (!!storeData){
                    this.productPromiseCalendars = JSON.parse(JSON.stringify(storeData.productPromiseCalendars))
                }
                this.$refs.SendDatePop.open()
            }
        },
        // 关闭弹窗
        closePopup(type){
            if (type==1){
                this.$refs.intSendDate.close()
            } else if (type==2){
                this.$refs.intInstallDate.close()
            } else {
                this.$refs.SendDatePop.close()
            }
        },
        //配送点击确定按钮
        confirm(type) {
            //判断是否选中了时间段
            if (type==1){
                let arrDate = this.calendarList.filter(item => {
                    return item.selected;
                })
                if (arrDate.length > 0 && !!arrDate[0].timeRangeList && !!arrDate[0].timeRangeList.length > 0){
                    let timeArr = arrDate[0].timeRangeList.filter(item => {
                        return item.selected;
                    })
                    if (timeArr.length <= 0){
                        uni.showToast({
                            title: "请选择配送时间段",
                            icon:'none'
                        })
                        return
                    }
                }
                this.updatePromiseCalendar(this.calendarList)
                // this.deliveryTimeStr= this.setdeliveryTimeStr(this.calendarList,1)
                // this.installTimeStr = this.setdeliveryTimeStr(this.calendarInstallList,2)
                this.closePopup(1)
            } else if (type==2){
                let arrDate = this.calendarInstallList.filter(item => {
                    return item.selected;
                })
                if (arrDate.length > 0 && !!arrDate[0].timeRangeList.length > 0){
                    let timeArr = arrDate[0].timeRangeList.filter(item => {
                        return item.selected;
                    })
                    if (timeArr.length <= 0){
                        uni.showToast({
                            title: "请选择配送时间段",
                            icon:'none'
                        })
                        return
                    }
                }
                this.updatePromiseInstallCalendar(this.calendarInstallList)
                this.closePopup(2)
            }
        },
        operateAddress() {
            this.$Router.push({
                path: `/pages/address/list`,
                query: {
                    source: 1,
                    sourceId: (this.orderAddress.addressId != undefined ? this.orderAddress.addressId : '')
                }
            })
        },
        //解开订单锁
        openOrderLock(){
            this.orderLock = false;
        },
        //跳转到客服系统
        async gotoCustomerService(){
            if (!this.hasLogin) {
                // uni.showToast({
                //     title: '请登录',
                //     icon: 'none'
                // })
                return;
            }
            let url = await customerService.run(1, this.zcConfig(), 'product').catch(e=>{
                console.log(e)
            });
            this.$openCustomerServicePage(url)
        },
        /********
             * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
             */
        zcConfig(){
            let location = window.location;
            let locationHref = location.href;
            let callBackUrl = locationHref;
            return {
                card_title: '商品信息', //商品标题（必传）
                card_url: encodeURIComponent(callBackUrl), //商品信息的商品链接地址（必传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
                card_desc: encodeURIComponent(this.goodsData[0].products[0].skuName), //商品信息的简述内容（选传）
                card_note: '￥' + this.$getPartNumber(this.allData.totalAmount,'int')+this.$getPartNumber(this.allData.totalAmount,'decimal'), //2000元 商品标签例：价格（选传）
                card_picture: encodeURIComponent(this.goodsData[0].products[0].image || require('../../static/shared/user/logo.png')) //商品的缩略图（选传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败） 
            } 
        },
        // 定时查询是否可以支付
        async queryPayState(paySn) {
            if (this.timer){
                await this.getPayInfo(paySn);
            }
        },
        //根据收货地址id获取总的运费
        changeAddress(selAddress) {
            if (selAddress) {
                this.orderAddress = selAddress;
                this.$setStorageSync('addressId', this.orderAddress.addressId)
            } else {
                this.orderAddress = {}
                this.$setStorageSync('addressId', '')
            }
        },
        //备注输入框聚焦
        handleFocus() {
            // #ifdef MP-WEIXIN
            this.isBottomShow = false;
            // #endif

        },
        //失去焦点
        handleBlur() {
            this.isBottomShow = true;
        },
        integrateGiftList() {
            this.goodsData.forEach(temp =>{
                this.getGiftList.skuGiftAndAttachmentInfoList.forEach(temp1 => {
                    let targetIndex = temp.products.findIndex(item1 => item1.sku == temp1.sku)
                    if (targetIndex>-1) {
                        let tempGiftList = temp1.giftList.map( item2 => {
                            return {
                                skuName:item2.name,
                                buyNum:item2.num,
                                productType:2
                            }
                        })
                        let tempAttachmentList = temp1.attachmentList.map( item2 => {
                            return {
                                skuName:item2.name,
                                buyNum:item2.num,
                                productType:1
                            }
                        })
                        this.$set(temp.products[targetIndex],'giftList',tempGiftList.concat(tempAttachmentList))
                    }
                })
                
            })
        },
        // 获取赠品
        getListSkuGift(list) {
            if(!!this.orderAddress.provinceCode && !!this.orderAddress.cityCode && !!this.orderAddress.districtCode){
                goodsHandler.getGift({
                    skuInfos:list,
                    provinceCode: this.orderAddress.provinceCode,
                    cityCode:  this.orderAddress.cityCode,
                    districtCode:  this.orderAddress.districtCode,
                    townCode:  this.orderAddress.townCode
                }).then(res=>{
                    if(res.state == 200){
                        this.getGiftList = res.data
                        this.integrateGiftList()
                    }
                })
            }
        }
    }
}

export default mixin;