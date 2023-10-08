import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import bottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'
import orderHandler from '@/views/components/order/handler';
import { setStorageSync } from '@/utils/common.js';
import goodsHandler from '@/views/components/goods/handler';
import { mapMutations } from 'vuex';

const mixin = {
    components: {
        uniPopup,
        bottomPopup
    },
    data() {
        return {
            addressLoading: true, // 地址列表的loading
            loadFlag: false,
            orderAddress: {}, //下单所用的地址信息
            goodsData: [], //商品数据
            allData: {}, //确认下单返回的所有数据信息
            desc: '', //备注
            payType: 1, //1微信 2支付宝
            isBottomShow: true, //底部是否显示
            windowHeight: '',
            remark: '',
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
            // 支付相关的几个参数
            orderSn: '',
            featherId: '',
            timer: '',
            afterPayInfoBusinessDone: false, // 下单成功轮询查询成功后续业务是否完成

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
            availableCouponList:[],//可用优惠券列表-只作为页面展示使用
            disabledCouponList:[],//不可用优惠券列表-只作为页面展示使用

            recommendCouponList:[],//推荐优惠券组合
            isRecommendCoupon:true,//是否是推荐优惠券组合

            currentCouponList:[],//当前店铺优惠券信息

            currentPlatformCouponCode:'',//当前平台优惠券code

            
            currentStoreCouponCode:'',//当前店铺优惠券code
            currentStoreId:0,//当前店铺id

            couponNum:0,//已选优惠券数量
            isRecommendCount:1,//计数器

            isCheckBack: false,
            remarkMap: {}, // 保存所有店铺的备注信息
            currentStoreId: '', // 当前编辑备注的店铺id
            remark: '', // 备注内容
            remarkMaxlength: 100, // 备注长度限制
        }
    },
    // computed: {
    //     ...mapState(['addressDone'])
    // },
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
                const newDate = value.replace(/-/g, '/');

                let dateStr = new Date(newDate).format("MM月dd日");

                let date = new Date(newDate).getDay()
                
                let weekday = ["周日","周一","周二","周三","周四","周五","周六"]
                let week = weekday[date];
                return `${dateStr}(${week})`;
            } catch (e){
                return value ;
            }
        }
    },
    methods: {
        ...mapMutations(['updateSelectedAddress']),
        /**
         * 获取赠品
         */
         async getSendProductBySkus(skuInfos) {
            const param = {
                skuInfos,
                provinceCode:this.orderAddress.provinceCode,
                cityCode:this.orderAddress.cityCode,
                districtCode:this.orderAddress.districtCode,
                townCode:this.orderAddress.townCode,
            };

            const defaultV = [{
                giftList:[],
                attachmentList:[]
            }]

            let res = await goodsHandler.getGift(param);

            if(res.state == 200){
                let infoList = res.data.skuGiftAndAttachmentInfoList;
                infoList.forEach(item => {
                    item.giftList?.forEach(giftItem => {
                        giftItem.productType = 2;
                    });

                    item.attachmentList?.forEach(attachmentItem => {
                        attachmentItem.productType = 3;
                    })
                })
                return Promise.resolve(infoList)
            }else{
                return Promise.resolve(defaultV)
            }
            
        },
        // 每个商品的赠品信息集成
        integrateProductGiftList(){
            this.goodsData.forEach(async storeItem => {
                // 批量查询满减信息的参数
                let skuInfos = storeItem.products?.map(product => {
                    return {
                        sku: product.sku, 
                        num: product.number
                    }
                })

                // 满减信息
                let sendProductList = await this.getSendProductBySkus(skuInfos);

                // 将满减信息填充到productList的item中
                sendProductList.forEach(sp => {
                    // 赠品
                    if(sp.giftList?.length > 0){
                        let targetProducts = storeItem.productList.filter(p => p.sku == sp.sku);
                        targetProducts.forEach(tp => {
                            this.$set(tp, 'giftList', sp.giftList);
                        })
                    }

                    // 附件
                    if(sp.attachmentList?.length > 0){
                        let targetProducts = storeItem.productList.filter(p => p.sku == sp.sku);
                        targetProducts.forEach(tp => {
                            this.$set(tp, 'giftList', sp.attachmentList);
                        })
                    }
                })

                this.$forceUpdate();
            })
        },
        IntegrateCalendars() {
            this.goodsData.forEach(temp =>{
                let productPromiseCalendars = []
                temp.productList.forEach(item =>{
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
       
        /**
         * 查询配送时间日历
         */
        getPromiseCalendar() {
            let _this = this
            let param = {}
            let goodsList = []
            _this.goodsData.forEach(temp =>{
                temp.productList.forEach(item =>{
                    item['storeId'] = temp.storeId
                    goodsList.push(item)
                })
            })
            let goodsFilter = []

            goodsList.forEach(item =>{
                let obj ={
                    sku:item.sku,
                    num:item.buyNum,
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
                    // 为了修复bug 75737
                    this.IntegrateCalendars()
                } else {
                    _this.productPromiseCalendars = []
                    _this.goodsData.forEach(temp =>{
                        let productPromiseCalendars = []
                        temp.productList.forEach(item =>{
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
                if(!Date.prototype.format) {
                    Date.prototype.format = function(formatString){
                        let handleDate = formatString;
                        handleDate = handleDate.replace('yyyy',this.getFullYear()).replace('MM',this.getMonth()+1).replace('dd',this.getDate()).replace('HH',this.getHours()).replace('mm',this.getMonth()).replace('ss',this.setSeconds());
                        return handleDate;
                    }
                }

                let startDate = new Date(dataArr[0].dateStr.replace(/-/g, '/'));
                let weekday = ["周日","周一","周二","周三","周四","周五","周六"]
                let week = weekday[startDate.getDay()];
                let dateStr = startDate.format("MM月dd日");
                dateStr = `${dateStr}(${week})`;
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
                path: `/views/address/list`,
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
        //根据收货地址id获取总的运费
        changeAddress(selAddress) {
            if (selAddress) {
                this.orderAddress = selAddress;
                this.updateSelectedAddress(selAddress);
                setStorageSync('addressId', this.orderAddress.addressId)
            } else {
                this.orderAddress = {}
                setStorageSync('addressId', '')
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
        showItem(info){
            console.log('info',info);
            
        }
    }
}

export default mixin;