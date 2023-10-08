<template></template>
<script>
import AddressTitle from 'common/components/base/AddressTitle.vue';
import invoiceCard from 'commonComp/invoice/invoice.vue';
import symbolGift from 'common/components/base/symbolGift.vue';
import addressDetail from './addressDetail.vue';
import addressComp from 'commonComp/address/address.vue';
import thumb06 from 'commonComp/goodsThumb/thumb06.vue';
import thumb07 from 'commonComp/goodsThumb/thumb07.vue';//下单前商品下架、缺货、变价的弹窗提示操作
import counter from 'commonComp/base/counter.vue';
import priceLabel from 'commonComp/base/priceLabel.vue';
import billDetail from './billDetail.vue';
import calendarInstallDate from './calendarInstallDate.vue';
import calendarDate from './calendarDate.vue';
import deliveryDetailPop from './deliveryDetailPop.vue';
import Icon from 'common/components/base/Icon.vue';
import { Popup, Confirm } from 'vux';
import extendUtils from 'common/lib/utils';
import orderHandler from 'common/lib/requestHandler/orderHandler.js';
import cartHandler from 'common/lib/requestHandler/cartHandler.js';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import activityHandler from 'common/lib/requestHandler/activityHandler.js';
import invoiceHandler from 'common/lib/requestHandler/invoiceHandler.js';
import {ProductStockStatus, ProductStatus, ProductActivityStatus} from 'common/lib/enum/productStatusEnum';
import { SnModal } from 'sinosun-ui';
import { factoryDateTips } from 'common/lib/enum/orderStatusEnum';

export default {
    components: {
        addressDetail,
        thumb06,
        thumb07,
        billDetail,
        Popup,
        Confirm,
        addressComp,
        counter,
        Icon,
        priceLabel,
        invoiceCard,
        AddressTitle,
        SnModal,
        symbolGift,
        calendarDate,
        calendarInstallDate,
        deliveryDetailPop
    },
    props: {

    },
    data(){
        return {
            productList:[], //购买的商品列表 用于页面展示渲染
            productTotal:0, //商品金额
            totalWeight:0, //商品的总重量 kg
            expressPrice: 0,//运费金额
            addressItem: {}, //选择显示的地址对象
            provinceCode: '', //省份编码
            province: '', //省份名称
            cityCode: '', //城市编码
            city: '', //城市名称
            districtCode: '', //县区编码
            district: '', //县区名称
            townCode: '', //乡镇编码
            town: '', //乡镇名称
            productSkuList: [], //商品sku List 用来拉取订单详情 在sessionStorage里面
            promiseTime: '', //预计什么时候到达
            totalNum: 0, //购买商品数量
            orderNo: '', //生成的订单号
            orderNoList:[],  //订单号列表
            productStatusMap:ProductStatus,//商品上下架状态
            stockList: [], //商品的有货无货列表数据
            skuGiftAndAttachmentInfoList: [], //商品的赠品和附件列表数据
            skuAreaRestrictList: [], //商品的区域限售列表数据
            skuClassifyList:[], //查询的商品大小件
            stopSales: false, //代表该商品是否已下架 true已下架 false未下架（只要商品中存在下架的 该变量就为true）
            noStock: false, //该变量用来判断该商品是否有库存 true缺货 false有货 只要商品存在缺货的情况 该变量就变为true
            areaRestrict: false, //该变量用来判断该商品是否区域限售 true限售 false不限售 只要商品存在限售的情况 该变量就变为true
            orderLock: false,//下单锁
            showProductChange: false, //商品上架、缺货、变价的confirm弹窗
            productChangeList:[],
            promiseTimePromise: null, //查询预计送达时间promise对象
            promiseCalendarPromise: null, //查询配送日历promise对象
            freightPromise: null, //查询运费promise对象
            skuClassifyPromise: null, //查询商品大小件promise对象
            giftPromise: null, //查询商品赠品和附件promise对象
            productPromise: null, //查询商品详情的promise对象
            popTitle: '选择发票抬头',
            invoiceDetail: {},//选择的发票抬头相关信息 
            orderInvoice: {
                invoiceContent: 1, //发票内容 1代表商品明细 2代表商品类别
                invoiceCategory: 3, //发票种类2=增值税专用发票，3=电子发票 目前仅支持3
                invoiceState: 0 //发票状态，0=未开票，1=已开票 此处均为未开发票
            }, //发票的相关信息 （包括收票人电话、邮箱和发票内容）
            invoiceReceiver: {}, //收票人的相关信息 目前是手机号和邮箱
            invoicePopHeight:'80%', //下单页面选择发票弹窗的样式height 
            isInvoice: true,//下单是否需要开发票
            goodsDetailList:[],//批量获取订单详情的列表数据
            calendarList:[],//选择配送时间日历数据
            calendarInstallList:[],//选择安装时间日历数据
            productPromiseCalendars: [], //多个商品的配送时间的数组
            dateIndex: -1, 
            factoryDateTips: factoryDateTips,
            dateLoaded: false,
            showImportInvoice: false, //是否显示导入企业发票抬头的按钮 变量 true=显示 false=不显示 默认是false
        }
    },
    filters: {

    },
    watch:{
        /**
         * 监听商品列表数据的变化，开更新相关的变量字段
         */
        productList:{
            handler(val, oldVal){
                if(!!val && val.length > 0){
                    let total = 0;
                    let totalWeight = 0;
                    this.totalNum = 0;
                    val.forEach(item => {
                        total += (this.dealNum(this.realPrice(item)) * item.num);
                        this.totalNum +=  (item.num*1);
                        !!item.weight && (totalWeight += (this.dealNum(item.weight) * item.num));
                        //更新sessionStorage缓存的productSkuList 防止数量更改了刷新页面的话数量还原了
                        this.updateProductSkuList(item);
                    });

                    //更新sessionStorage缓存 主要更新商品的数量
                    extendUtils.setSession('productSkuList', JSON.stringify(this.productSkuList));

                    this.totalWeight = totalWeight/100;//更新总重量单位是kg
                    this.productTotal = total/100; //更新商品总价
                   
                }
            },
            deep: true
        },
        
        //监听发票弹窗  每次打开 初始化发票信息数据
        showBillDetailModel(val){
            document.body.style.overflow = !!val ? 'hidden' : 'auto';
        },

        /**
         * 监听地址的变化
         */
        addressItem:{
            
            handler(val, oldVal){
                let codeArr = [];
                let nameArr = [];
                if(!!val.areaCode && val.areaCode.indexOf('/') > -1){
                    codeArr = val.areaCode.split('/');
                }
                if(!!val.area && val.area.indexOf('/') > -1){
                    nameArr = val.area.split('/');
                }
                //更新地址编码 用来查询预计配送时间 和 查询快递费
                this.provinceCode = codeArr[0] || '';
                this.province = nameArr[0] || '';
                this.cityCode = codeArr[1] || '';
                this.city = nameArr[1] || '';
                this.districtCode = codeArr[2] || '';
                this.district = nameArr[2] || '';
                this.townCode = codeArr[3] || '';
                this.town= nameArr[3] || '';
                //地址变更查询商品的库存有无
                this.getlistStockConfirm();
                //地址变更查询商品的区域限售状态
                this.checkAreaLimit();
 

                //地址变更重新更新商品的价格
                this.goodsDetailList.length > 0 && this.getlistUnitPrice(this.goodsDetailList); //监听地址的变化，重新更新商品的相关属性的变化(目前是苏宁的价格会变) 
            },
            deep: true
        },

        /** 
        * 监听下单时商品下架，变价，无货的弹窗变化，用来控制父级页面滚动的
        */
        showProductChange(val){
            document.body.style.overflow = !!val ? 'hidden' : 'auto';
        }
    },
    computed: {
 
        /**
         * 该变量用来判断当该商品下架或者缺货的时候，相关按钮不能操作的
         */
        disabledOperate(){
            return !!this.noStock || !!this.stopSales || !!this.areaRestrict;
        },  

        /**
         * 是否显示商品下架/无货/变价的确定按钮
         */
        showProductChangeConfirm(){
            return this.productSkuList.length != this.downAndNostockProductList.length;
        },

        /**
         * 商品下架和缺货的商品列表
         */
        downAndNostockProductList(){
            if(this.productChangeList <= 0){return []}
            return this.productChangeList.filter(item => {
                return !!this.checkProductChangeStatus(item);
            })
        },

        /** 
        *需要支付的合计金额
        */
        paymentAmount(){
            return (this.dealNum(this.productTotal) + this.dealNum(this.expressPrice))/100; //更新需支付的总价
        },

        //有货的时候显示的有货提示文字 当订单中商品存在不同配送规则时 
        //优先显示“内部配货中，预计2～6天到达仓库”>然后显示“有货，下单后从有货仓库配货”>最后显示“现货，下单后立即发货”
        stockText(){
            if(!!!this.stockList || this.stockList.length <= 0){return ''}
            let firstTurnIndex = this.stockList.findIndex(item => {
                return ProductStockStatus[item.stockState].turn == 1;
            })
            if(firstTurnIndex > -1){ //按照顺序显示不同的文字提示
                return ProductStockStatus[this.stockList[firstTurnIndex].stockState].text;
            }else{
               let secondTurnIndex = this.stockList.findIndex(item => {
                   return ProductStockStatus[item.stockState].turn == 2;
               }) 
               if(secondTurnIndex > -1){
                   return ProductStockStatus[this.stockList[secondTurnIndex].stockState].text;
               }else{
                    let thirdTurnIndex = this.stockList.findIndex(item => {
                        return ProductStockStatus[item.stockState].turn == 3;
                    })
                    if(thirdTurnIndex > -1){
                         return ProductStockStatus[this.stockList[thirdTurnIndex].stockState].text;
                    }else{
                        return ''
                    }
               }
            }
        },


        //显示有无货相关的文字
        showStockText(){
            return !!this.stockText && !this.areaRestrict && !this.noStock && !this.stopSales;
        },

        //是否是多个商品 有多个配送时间 true=是 false=否
        multiDate(){
            return this.productPromiseCalendars.length > 1;
        },

        // 配送时间的字符串显示
        deliveryTimeStr(){  
            let str = '';
            if(!!this.multiDate){ //如果是多个商品的话，此处展示京东快递或者苏宁快递
                str = `${this.BMallConfig.SUPPLIER_Map[orderHandler.supplierId].name}物流，送货上门`;
            }else{
                if(this.calendarList.length <=0 ){return str};
                let dateStr = '';
                let timeStr = '';
                let dataArr = this.calendarList.filter(item => {
                    return item.selected;
                })

                if(dataArr.length>=1 && !!dataArr[0].dateStr){
                    let startDate = new Date(dataArr[0].dateStr.replace(/\-/g, '/'));
                    let dateStr = startDate.format("MM月dd日");
                    let week = extendUtils.indexToWeek(startDate.getDay());
                    dateStr = `${dateStr}<i style="color: var(--themeColor)">(${week})</i>`;
                    if(!!dataArr[0].timeRangeList && dataArr[0].timeRangeList.length > 0){
                        let timeArr = dataArr[0].timeRangeList.filter(item => {
                            return item.selected;
                        })
                        if(timeArr.length>=1 && !!timeArr[0].timeRange){
                            timeStr = `${timeArr[0].timeRange}`
                        }
                    }
                    str = `${dateStr} ${timeStr}`;
                }
            }
            return str;
        },
        

        // 安装时间的字符串显示
        installTimeStr(){  
            let str = '';
            if(!!this.multiDate){ //如果是多个商品的话，此处展示京东快递或者苏宁快递
                str = ``;
            }else{
                if(this.calendarInstallList.length <=0 ){return str};
                let dateStr = '';
                let timeStr = '';
                let dataArr = this.calendarInstallList.filter(item => {
                    return item.selected;
                })

                if(dataArr.length>=1 && !!dataArr[0].dateStr){
                    let startDate = new Date(dataArr[0].dateStr.replace(/\-/g, '/'));
                    let dateStr = startDate.format("MM月dd日");
                    let week = extendUtils.indexToWeek(startDate.getDay());
                    dateStr = `${dateStr}<i style="color: var(--themeColor)">(${week})</i>`;
                    if(!!dataArr[0].timeRangeList && dataArr[0].timeRangeList.length > 0){
                        let timeArr = dataArr[0].timeRangeList.filter(item => {
                            return item.selected;
                        })
                        if(timeArr.length>=1 && !!timeArr[0].timeRange){
                            timeStr = `${timeArr[0].timeRange}`
                        }
                    }
                    str = `${dateStr} ${timeStr}`;
                }
            }
            return str;
        },

        //如果是厂家配送的没有配送时间日历，此时展示“工作日、双休日遇节假日均可送货”，字样
        showFactoryDateTips(){
            let flag = false;
            if(!!!this.multiDate && this.calendarList.length <= 0){ //没有配送日历，此时展示上述提示语
                flag = true;
            }
            return flag;
            
        },


        //是否显示配送时间和安装时间前面的‘大件’字样
        showKeyBig(){
            let flag = false;
            if(!!!this.multiDate){ //如果只有以类商品
                let item = this.productPromiseCalendars[0];
                if(item.skuClassify == 2){
                    flag = true;
                }
            }
            return flag;
        }

    },
    created(){
        let that = this;
        this.initData(); 
        this.initInvoiceInfo();//查询发票收件人的相关信息 手机号和邮箱和发票内容
    },
    methods: {
        /** 
        * 监听是新增还是编辑发票抬头，用来更新弹窗顶部的title 即 popTitle 变量
        */
        changeTitle(type){
            if(!type){ return }
            if(type == 'add'){
                this.popTitle = '新增发票抬头'
            }else if(type == 'edit'){
                this.popTitle = '编辑发票抬头'
            }else if(type == 'choose'){
                this.popTitle = '选择发票抬头'
            }
        },
        

        /** 
        * 是否展示赠品和附件
        */
        showDiscount(item){
            return (!!item.attachmentList && item.attachmentList.length > 0) || (!!item.giftList && item.giftList.length > 0);
        },
        /** 
        * 是否展示赠品
        */
        showGiftList(item){
            return (!!item.giftList && item.giftList.length > 0);
        },
        /** 
        * 是否展示附件
        */
        showAttachmentList(item){
            return (!!item.attachmentList && item.attachmentList.length > 0) ;
        },

        /** 
        * 选择是否开发票的按钮，控制弹窗的高度变化
        */
        changeInvoicePopHeight(isInvoice){
            this.invoicePopHeight = isInvoice ? '80%' : '45%';
        },

        /** 
        * 关闭发票抬头选择的弹窗
        */
        closeInvoiceList(){
            this.showInvoiceChoose = false;
        },

        /** 
        * 关闭发票新增和编辑的弹窗
        */
        closeInvoiceAddOrEdit(){
            if(!!this.$refs.invoiceComp.showAddInvoice){
                this.$refs.invoiceComp.showAddInvoice = false;
            }else{
                this.showInvoiceChoose = false;
            }
        },

        //根据运维后台是否配置了企业发票抬头的地址url来判断，导入企业发票抬头按钮是否显示 
        checkImportInvoiceBtn(flag){
            this.showImportInvoice = flag;
        },


        /** 
        * 显示发票抬头选择的弹窗
        */
        showInvoicePop(){
            this.showInvoiceChoose = true;
        },

        /** 
        * 初始化发票收件人的电话和邮箱
        */
        initInvoiceInfo(){
            let param = {
                channelId: invoiceHandler.channelId,
                companyId: invoiceHandler.companyId,
                userId: invoiceHandler.userId,
            }
            invoiceHandler.getInvoiceReceiverInfo(param).then(res=>{
                if(res.resultCode == 0 && res.result && Object.keys(res.result).length > 0){
                    this.invoiceReceiver = Object.assign({}, this.invoiceReceiver, res.result);
                }else{
                    this.invoiceReceiver = {
                        phone: '',
                        email: ''
                    };
                }
            }).catch(e=>{
                console.log(e);
            })
        },
        
   

        /**
         * 初始化数据
         */
        async initData(){
            let that = this;
            that.productChangeList = [];
            //初始化以下两个变量
            that.productSkuList = !!extendUtils.getSession('productSkuList') ? JSON.parse(extendUtils.getSession('productSkuList')) : []; //从sessionStorage里面取购买的商品信息

            //初始化商品详情
            let skuList = [];
            if(that.productSkuList.length > 0){
                that.productSkuList.forEach(item => {
                    !!item.sku && skuList.push(item.sku);
                    !!item.sku && (item.skuId = item.sku);//新增skuId字段用来获取预计到达时间、大小件查询、运费三个接口的入参
                });
                //通过sku获取商品详情
                that.productPromise = that.getProductDetail(skuList).then(list => {
                    that.goodsDetailList = list;
                    return that.getlistUnitPrice(list);
                });
            }       
        },

        /**
         * 获取商品详情
         */
        getProductDetail(skuList){
            const that = this;
            that.$loading.show();
            let param = {
                channelId: goodsHandler.channelId,
                sku: skuList,
                supplierId: that.productSkuList[0].supplierId
            }
            return new Promise((resolve, reject) => {
                goodsHandler.getProductDetail(param).then(res=>{
                    that.$loading.hide();
                    if(res.resultCode == 0 && !!res.result && !!res.result.detail){
                        this.productList = that.insertData(res.result.detail, that.productSkuList, 'num');
                        let newList = that.insertData(this.productList, that.productSkuList, 'productSpec');
                        //批量查询商品售价并对应的赋值给商品详情price字段
                        newList.length>0 ? resolve(newList) : resolve([]);
                    }
                }).catch(e=>{
                    that.$loading.hide();
                    console.log(e);
                    reject('查询商品详情报错')
                })
            })
        },
        /**
         * 批量查询商品售价并对应的赋值给商品详情price字段
         */
        getlistUnitPrice(list){
            if(list.length <= 0){ return };
            let ids = list.map(function(value){
            　　return {
                    sku: value.sku,
                    categoryId1: value.categoryId1 || '',
                    categoryId2: value.categoryId2 || '',
                    categoryId3: value.categoryId3 || '',
                }
            })
            let param = {
                spId: goodsHandler.supplierId,
                businessType: 'COMMODITY',
                productInfos: ids,
                cityId: this.cityCode || ''
            }
            this.$loading.show();
            return new Promise((resolve, reject) => {
                goodsHandler.getlistUnitPrice(param).then(async res=>{
                    this.$loading.hide();
                    if(res.resultCode == 0 && !!res.result.productPrice){
                        this.insertData(this.productList, res.result.productPrice, 'unitPrice'); //更新价格
                        this.insertData(this.productList, res.result.productPrice, 'tax'); //更新税率

                        //查询商品活动的相关信息。
                        await this.listProductMarketing();

    
                        //判断商品的上下架状态 更新stopSales变量
                        this.judgeStopSales(this.productList); 
    
                        //将hasStock字段插入productList每一项中
                        if(this.stockList.length>0){
                            this.insertData(this.productList, this.stockList, 'hasStock');
                            this.insertData(this.productList, this.stockList, 'remainNum');
                            this.insertData(this.productList, this.stockList , 'stockText');
                            //判断商品的购买数量和库存的关系
                            this.productList = this.dealGoodsNum(this.productList);
                        }
                        //将areaRestrict字段插入productList每一项中
                        if(this.skuAreaRestrictList.length>0){
                            this.insertData(this.productList, this.skuAreaRestrictList, 'areaRestrict');
                        }
                        //将attachmentList字段和giftList插入productList每一项中
                        if(this.skuGiftAndAttachmentInfoList.length>0){
                            this.insertData(this.productList, this.skuGiftAndAttachmentInfoList , 'attachmentList');
                            this.insertData(this.productList, this.skuGiftAndAttachmentInfoList , 'giftList');
                        }
                        resolve('price_done');
                    }
                }).catch(e=>{
                    this.$loading.hide();
                    console.log(e);
                    reject('price_wrong');
                })
            })
        },

        // 处理真实的价格 没有活动用unitPrice  有活动用promotionalPrice
        realPrice(item){
            return !!item.marketingId ? item.promotionalPrice : item.unitPrice
        },


        /**
         * 根据商品编号和channelId批量获取商品的活动信息
         */
        listProductMarketing(){
          const that = this;
          return new Promise((resolve, reject)=>{
              if(!this.productList || 0 == this.productList.length){
                resolve([]);
              }
              let skuList = this.productList.map(function(value){
              　　return value.sku
              })
              let param = {
                  channelId: activityHandler.channelId,
                  skuList: skuList
              }
              activityHandler.listProductMarketing(param).then(res=>{
                  if(res.resultCode == 0 && res.result && res.result.list && res.result.list.length>0){
                      let tempList = res.result.list;
                      for (let i = 0; i < this.productList.length; i++) {
                        const element = this.productList[i];
                        let index = tempList.findIndex(item=>{
                          return item.sku == element.sku
                        })
                        if(index > -1){
                          // 只有当活动进行中的时候，才更新活动价格
                          if(!!ProductActivityStatus[tempList[index].marketingState].isGoingOn){
                            this.$set(element, 'promotionalPrice', tempList[index].promotionalPrice);
                            this.$set(element, 'marketingId', tempList[index].marketingId);
                          }
                        }
                      }
                  }
                  resolve(this.productList)
              }).catch(e=>{
                  console.log(e);
                  resolve(this.productList)
              })
          })
          
        }, 

        /**
         * 将num,productSpec,skuClassify通过sku插入到productList对应的每一项里面里面
         * @param list 需要插入字段的list
         * @param dataList 提供插入字段的list
         * @param key 要插入的key
         */
        insertData(list, dataList, key){
            if(dataList.length <= 0){return []};
            for(let i = 0; i < dataList.length; i++){
                const item = dataList[i];
                let index = list.findIndex(temp=>{
                    return item.sku == temp.sku;
                })
                if(index > -1){
                    if(item.hasOwnProperty(key)){
                        let obj = Object.assign({}, list[index], {[key]: item[key]});
                        list.splice(index, 1, obj)
                    }
                }
            }
            return list;
        },

        /**
         * 查询预计配送时间
         */
        getPromiseTime(){
            let param = {
                skuList: this.productSkuList,
                provinceCode: this.provinceCode,
                cityCode: this.cityCode,
                districtCode: this.districtCode,
                townCode: this.townCode || '',
                addrDetail: this.addressItem.address,
                supplierId: orderHandler.supplierId 
            };
            return new Promise((resolve, reject) => {
                orderHandler.getPromiseTime(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result){
                        this.promiseTime = res.result.promiseTips[0].promiseTip;
                        resolve('promiseTime');
                    }
                }).catch(e=>{
                    console.log(e);
                    reject('promiseTime_wrong')
                })
            })
        },

        /**
         * 查询配送时间日历
         */
        getPromiseCalendar(){
            let param = {
                skuList: this.productSkuList,
                provinceCode: this.provinceCode,
                cityCode: this.cityCode,
                districtCode: this.districtCode,
                townCode: this.townCode || '',
                addrDetail: this.addressItem.address,
                supplierId: orderHandler.supplierId 
            };
            return new Promise((resolve, reject) => {
                orderHandler.getPromiseCalendar(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result){
                        //将新增installDays字段
                        this.productPromiseCalendars = res.result.productPromiseCalendars.map(item => {
                            //新增安装日历
                            if(item.calendarList.length > 0){
                                let arrDelivery = item.calendarList.filter(item=>{
                                    return item.selected;
                                })

                                let arrInstall = item.calendarDayInstallDays.filter(item => {
                                    return arrDelivery[0].dateStr == item.dateStr;
                                })

                                if(arrInstall.length > 0){
                                    this.$set(item, 'installDays', arrInstall[0].installDays)
                                }else{
                                    this.$set(item, 'installDays', []);
                                }                                 
                            }else{
                                this.$set(item, 'installDays', []);
                            }
                            return item;
                        });


                        if(this.productPromiseCalendars.length == 1){//如果是一个商品 此时仅有一个配送时间
                            let item = this.productPromiseCalendars[0];
                            if(!!item && !!item.calendarList && item.calendarList.length > 0){
                                this.calendarList = item.calendarList; //更新配送时间的日历
                            }else{
                                this.calendarList = [];
                            }
                            if(!!item && !!item.installDays && item.installDays.length > 0){  //如果有安装时间，更新安装时间的日历
                                this.calendarInstallList = item.installDays; 
                            }else{
                                this.calendarInstallList = [];
                            }
                        }
                        this.dateLoaded = true;
                        resolve('promiseCalendar');
                    }
                }).catch(e=>{
                    console.log(e);
                    reject('promiseCalendar_wrong')
                })
            })
        },

        /**
         * 查询运费
         */
        getFreight(){
            let param = {
                skuList: this.productSkuList,
                provinceCode: this.provinceCode,
                cityCode: this.cityCode,
                districtCode: this.districtCode,
                townCode: this.townCode || '',
                addrDetail: this.addressItem.address,
                supplierId: orderHandler.supplierId 
            };
            return new Promise((resolve, reject) => {
                orderHandler.getFreight(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result){
                        this.expressPrice = res.result.freight;
                        resolve('Freight');
                    }
                }).catch(e=>{
                    console.log(e);
                    reject('Freight_wrong');
                })
            })
        },

        /**
         * 查询商品大小件标记
         */
        getSkuClassify(){
            let param = {
                skuList: this.productSkuList,
                provinceCode: this.provinceCode,
                cityCode: this.cityCode,
                districtCode: this.districtCode,
                townCode: this.townCode || '',
                supplierId: orderHandler.supplierId 
            };
            return new Promise((resolve, reject) => {
                orderHandler.getSkuClassify(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result && !!res.result.skuClassifyMaps){
                        this.skuClassifyList = res.result.skuClassifyMaps;
                        resolve('SkuClassify');
                    }
                }).catch(e=>{
                    console.log(e);
                    reject('SkuClassify_wrong');
                })
            })
        },
        /**
         * 下单页查询商品库存量
         */
        getlistStockConfirm(item){
            //如果没选择地址，直接return
            if(!this.provinceCode){return}
            let ids = [];
            if(!!item && Object.keys(item).length > 0){//如果是单个商品的数量变化，此时只需要查询该商品的库存状态即可
                ids = [
                    {
                        sku: item.sku,
                        num: item.num
                    }
                ]
            }else{
                ids = this.productSkuList;
            }


            let param = {
                stockRequire: ids,
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId 
            }
            this.$loading.show();
            goodsHandler.getlistStock(param).then(res=>{
                this.$loading.hide();
                if(res.resultCode == 0 && !!res.result && res.result.stock.length > 0){
                    this.stockList = res.result.stock.map(item => {
                        item = Object.assign({}, item, {hasStock: ProductStockStatus[item.stockState].hasStocks})
                        item = Object.assign({}, item, {stockText: ProductStockStatus[item.stockState].textConfirm})
                        return item;
                    });
                    //将hasStock字段和remainNum和stockText插入productList每一项中
                    if(this.productList.length>0){
                        this.insertData(this.productList, this.stockList , 'hasStock');
                        this.insertData(this.productList, this.stockList , 'remainNum');
                        this.insertData(this.productList, this.stockList , 'stockText');
                        //判断商品的购买数量和库存的关系
                        this.productList = this.dealGoodsNum(this.productList);
                    }

                    let index = this.stockList.findIndex(item => {
                        return !item.hasStock;
                    })

                    this.noStock = false;
                    if(index > -1){ //说明存在无货的情况
                        this.noStock = true;
                    }
                    //查完有货无货再查其他的, 在保证有货的时候再查其他的
                    !this.noStock && this.getPromiseTimeAndFreight(item)
                }
            }).catch(e=>{
                this.$loading.hide();
                console.log(e)
            })
        },

        /**
         * 下单页查询商品赠品和附件
         */
        getGoodsGift(item){
            //如果没选择地址，直接return
            if(!this.provinceCode){return}
            let ids = [];
            if(!!item && Object.keys(item).length > 0){//如果是单个商品的数量变化，此时只需要查询该商品的库存状态即可
                ids = [
                    {
                        sku: item.sku,
                        num: item.num
                    }
                ]
            }else{
                ids = this.productSkuList;
            }


            let param = {
                skuIds: ids,
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId,
                show: false, //购买量不足时是否展示赠品，true-展示 false-不展示
            }

             return new Promise((resolve, reject) => {
                goodsHandler.getGoodsGift(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result && !!res.result.skuGiftAndAttachmentInfoList && res.result.skuGiftAndAttachmentInfoList.length > 0){
                        this.skuGiftAndAttachmentInfoList = res.result.skuGiftAndAttachmentInfoList.map(item => {
                            item = Object.assign({}, item, {sku: item.primirySku})
                            return item;
                        });
                        //将attachmentList和giftList字段插入productList每一项中
                        if(this.productList.length > 0){
                            this.insertData(this.productList, this.skuGiftAndAttachmentInfoList , 'attachmentList');
                            this.insertData(this.productList, this.skuGiftAndAttachmentInfoList , 'giftList');
                        }
                        resolve('gift');
                    }
                }).catch(e=>{
                    console.log(e)
                    reject('Gift_wrong');
                })
            }) 
        },

        dealGoodsNum(list){
            if(!!!list || list.length <= 0){return []}
            return list.map((item, index) => {
                if(!!item.num && !!item.remainNum && item.remainNum>0 && item.num>item.remainNum){ //如果当前选择的商品数量大于库存的此时需要更新商品数量为最大的
                    item = Object.assign({}, item, {num: item.remainNum})
                }
                return item;
            }) 
        },
        /**
         * 下单页查询商品是否存在区域限售
         */
        checkAreaLimit(){
            //如果没选择地址，直接return
            if(!this.provinceCode){return};
            let ids = this.productSkuList.map(item=>{
                return item.sku
            })
            let param = {
                skuIds: ids,
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId 
            }
            this.$loading.show();
            goodsHandler.checkAreaLimit(param).then(res=>{
                this.$loading.hide();
                if(res.resultCode == 0 && !!res.result && res.result.skuAreaRestrictList.length > 0){
                    this.skuAreaRestrictList = res.result.skuAreaRestrictList;
                    //将areaRestrict插入productList每一项中
                    if(this.productList.length > 0){
                        this.insertData(this.productList, this.skuAreaRestrictList , 'areaRestrict');
                    }

                    let index = this.skuAreaRestrictList.findIndex(item => {
                        return !!item.areaRestrict;
                    })

                    this.areaRestrict = false;
                    if(index > -1){ //说明存在区域限售的情况
                        this.areaRestrict = true;
                    }
                }
            }).catch(e=>{
                this.$loading.hide();
                console.log(e)
            })
        },

        /**
         * 判断商品的上下架状态
         * @param list 商品列表
         */
        judgeStopSales(list){
            if(list.length>0){
                let flag = false;
                for(let i = 0; i < list.length; i++){
                    const item = list[i];
                    if(!!this.productStatusMap[item.state].stopSales){
                        flag = true;
                        break;
                    }
                }
                this.stopSales = flag;
            }
        },

        /**
         *处理下单的时候前端传递的物流展示信息
         */
        dealExpressRemark(stockText){
            if(!!!stockText || stockText == ProductStockStatus[10].text){
                return '';
            }else{
                return ProductStockStatus[11].text;
            }
        },

        /**
         *提交订单参数整合
         */
        dealParam(){
            //整合提交订单的参数
            //整合商品products参数 类型：Array
            let param = {};
            if(this.productList.length > 0){
                let products = [];
                this.productList.forEach(item => {
                    let obj = {
                        sku: item.sku, //商品sku编号
                        supplierId: item.supplierId, //供应商Id
                        name: item.name, //买商品名称
                        imageUrl: item.imagePath, //商品图片
                        productTotal: (this.dealNum(this.realPrice(item)) * item.num)/100, //商品总价格
                        unitPrice: item.unitPrice, //商品销售单价
                        taxRate: item.tax, //税率,税率为15%时，该值为15
                        quantity: item.num, //商品数量
                        productType: 0, //商品类型，0=主商品，1=附件，2=赠品
                        specification: item.productSpec, //商品销售属性
                        categoryId: item.categoryId3 || '', //商品三级分类
                        unitWeight: item.weight, //每个商品重量，单位：kg,单位不返回
                        saleUnit: item.saleUnit, //每个商品单位
                        factoryShip: item.factoryShip, //是否厂直商品
                        canVat: item.canVat, //是否可以开专票, false-否；true-是
                    }
                    //供应商有大小件数据的情况下下单才传
                    if(0 < this.skuClassifyList.length){
                        obj['skuClassify'] = this.getSpecificKey(this.skuClassifyList, item, 'skuClassify')//大小件标记，1=中小件，2=大家电
                    }

                    if(!!this.showGiftList(item)){//如果有赠品的话 此时新增needGift字段
                        obj['needGift'] = true; //是否需要赠品true-需要,false-不需要
                    }

                    //当该商品有参加活动的时候，新增活动id和活动价格字段
                    if(!!item.marketingId){
                        obj['marketingId'] = item.marketingId; 
                        obj['promotionalPrice'] = item.promotionalPrice; 
                    }

                    products.push(obj);

                    //处理赠品和附件相关，下单时需要和煮商品铺开
                    if(!!this.showGiftList(item)){
                        item.giftList.forEach(temp => {
                            let objItem = {
                                masterSku:item.sku,
                                sku: temp.sku, //商品sku编号
                                supplierId: orderHandler.supplierId, //供应商Id
                                name: temp.name, //买商品名称
                                imageUrl: temp.imagePath, //商品图片
                                productTotal: 0, //商品总价格
                                unitPrice: 0, //商品销售单价
                                quantity: temp.num, //商品数量
                                productType: 2, //商品类型，0=主商品，1=附件，2=赠品
                            }
                            products.push(objItem);
                        })
                    }
                    if(!!this.showAttachmentList(item)){
                        item.attachmentList.forEach(temp => {
                            let objItem = {
                                masterSku:item.sku,
                                sku: temp.sku, //商品sku编号
                                supplierId: orderHandler.supplierId, //供应商Id
                                name: temp.name, //买商品名称
                                imageUrl: temp.imagePath, //商品图片
                                productTotal: 0, //商品总价格
                                unitPrice: 0, //商品销售单价
                                quantity: temp.num, //商品数量
                                productType: 1, //商品类型，0=主商品，1=附件，2=赠品
                            }
                            products.push(objItem);
                        })
                    }
                })
                param.products = products;
            }

            //整合订单order参数
            param.order = {
                channelId: orderHandler.channelId,
                companyId: orderHandler.companyId,
                userId: orderHandler.userId,
                orderType: 7, //订单类型：0=所有订单类型 1=机票，2=酒店，3=火车票，4=快递，5=保险，6=用车，7=商品
                orderSource: 0, //订单来源，0=正常单，1=售后服务单产生的订单,2=秒杀单
                productTotal: this.productTotal, //商品销售价之和
                paymentAmount: this.paymentAmount, //订单实付金额
                quantity: this.totalNum, //购买商品数量商品总数量
                needApprove: 0,//是否需要审批，0=不需要，1=需要 该confirm页面仅需要写死0即可
                freightAmount: this.expressPrice, //运费
                weightAmount: this.totalWeight, ////货物总重量,单位：kg,单位不返回
                remark: this.dealExpressRemark(this.stockText),
            }
            let userInfo = goodsHandler.getUserParam();
            param.order = Object.assign({}, param.order, {
                channelName: userInfo.channelName || '',
                companyName: userInfo.companyName || '',
                userName: userInfo.userName || '',
            })

            //整合快递orderExpress参数
            param.orderExpress = {
                freight: this.expressPrice, //运费
                weight: this.totalWeight, //货物总重量,单位：kg,单位不返回
            };

            //整合地址收货人相关的参数receiverInfo
            param.receiverInfo = {
                provinceCode: this.provinceCode, //省份编码
                province: this.province, //省份名称
                cityCode: this.cityCode, //城市编码
                city: this.city, //城市名称
                districtCode: this.districtCode, //县区编码
                district: this.district, //县区名称
                address: this.addressItem.address, //收货人详细地址
                name: this.addressItem.name, //收货人姓名
                phone: this.addressItem.phone, //收货人电话
            };
            if(!!this.townCode){
                param.receiverInfo = Object.assign({}, param.receiverInfo, {
                    townCode: this.townCode, //乡镇编码
                    town: this.town, //乡镇名称
                })
            }

            if(Object.keys(this.isInvoice && this.orderInvoice).length > 0 && Object.keys(this.invoiceDetail).length > 0 && Object.keys(this.invoiceReceiver).length > 0){
                //整合发票的相关参数orderInvoice
                let objCommon = {
                    invoiceContent: this.orderInvoice.invoiceContent == 1 ? '商品明细' : '商品类别', //发票内容
                    invoiceState: this.orderInvoice.invoiceState, //发票状态，0=未开票，1=已开票 此处均为未开发票
                    invoiceCategory: this.orderInvoice.invoiceCategory, //票种类2=增值税专用发票，3=电子发票 目前仅支持3
                    phone: this.invoiceReceiver.phone, //收票人手机号
                    email: this.invoiceReceiver.email, //收票人手机号
                    invoiceTitle: this.invoiceDetail.name , //发票抬头
                    invoiceType: this.invoiceDetail.type, //发票类型，1=个人，2=企业
                }

                if(this.invoiceDetail.type == 2){//2代表企业
                    param.orderInvoice = Object.assign({}, objCommon, {
                        taxNo: this.invoiceDetail.tax, //纳锐人识别码,invoiceType = 2时，必填
                        registerAddress: this.invoiceDetail.address, //注册地址
                        registerPhone: this.invoiceDetail.phone, //注册电话
                        account: this.invoiceDetail.account, //银行账户
                        bank: this.invoiceDetail.bank, //开户银行
                    })
                }else{//个人
                    param.orderInvoice = objCommon;
                }                
            }
            //整合下单配送时间和安装的相关参数
            let dateList = [];
            if(!!this.multiDate){
                dateList = this.productPromiseCalendars.map(item => {
                    if(item.calendarList.length > 0){
                        let dateArr = item.calendarList.filter(item => {
                            return item.selected;
                        })
                        item = Object.assign({}, item, {'calendarDay': dateArr[0]})
                    }
                    if(item.installDays && item.installDays.length > 0){
                        let dateArr = item.installDays.filter(item => {
                            return item.selected;
                        })
                        item = Object.assign({}, item, {'installDay': dateArr[0]})
                    }
                    item.calendarList && delete item.calendarList;
                    item.calendarDayInstallDays && delete item.calendarDayInstallDays;
                    item.installDays && delete item.installDays;
                    return item;
                })
            }else{ //只有一种类型的商品时                    
                let productPromiseCalendarsObj = this.productPromiseCalendars[0];
                if(this.calendarList.length > 0){
                    let arr = this.calendarList.filter(item => {
                        return item.selected;
                    })
                    productPromiseCalendarsObj = Object.assign({}, productPromiseCalendarsObj, {'calendarDay': arr[0]});

                }

                if(this.calendarInstallList.length > 0){
                    let arr = this.calendarInstallList.filter(item => {
                        return item.selected;
                    })
                    productPromiseCalendarsObj = Object.assign({}, productPromiseCalendarsObj, {'installDay': arr[0]});
                }
                
                dateList = [productPromiseCalendarsObj];
            }
            param.productPromiseCalendars = dateList;

            return param;
        },

        /**
         * 提交订单的相关必传参数的校验
         */
        checkParam(){
            if(!this.addressItem.areaCode){
                // extendUtils.showToast('请选择收货地址');
                SnModal({
                    message: '您还没有收货地址，赶快去设置一个吧',
                    showCancelButton: true,
                    confirmButtonText:'去设置',
                }).then(res => {
                    this.gotoAddress();
                }).catch(rej => {
                    console.log('rej === ', rej);
                });
                return false
            }

            //todo userId为空目前暂时前端拦截下单
            let userId = orderHandler.userId;
            if(userId == 'null' || userId == 'undefined' || !!!userId){
                extendUtils.showToast('userId不能为空' + this.BMallConfig.FRONTEND_ERROR.FRONTEND_ERROR_CODE);
                return false
            }
            return true;
        },

        /**
         * 处理金额计算 小数点失真的问题
         */
        dealNum(num=0){
            return Math.round(parseFloat(num).toFixed(2)*100);
        },
        
        /**
         * 真正的下单接口
         */
        createOrderApiFun(type=false, dealedParams){
            let param;
            if(!!dealedParams){ //如果是商品的赠品或者附件无货，此时用已经移除掉赠品的参数
                param = dealedParams
            }else{
                param = this.dealParam();
            }
            if(!!type && type == 'applyPurchase'){ //如果是提交订单页面申请采购过来的，此时需要将参数变更
                param.order.needApprove = 1;//是否需要审批，0=不需要，1=需要 申请采购此时需要传1
            }
            // console.log('param', param);
            this.orderLock = true;
            this.$loading.show();
            orderHandler.createOrder(param).then(res=>{
                this.$loading.hide();
                if(res.resultCode == 0 && !!res.result){                        
                    if(!!res.result.orderNo){
                        this.orderNo = res.result.orderNo;
                        //下单成功后，如果是从购物车页面跳转过来的，要把购物车里面涉及的商品删掉
                        //说明是从哪一个页面跳转过来的，用来判断如果是购物车页面过来的，下单成功后将购物车页面的商品信息删除掉
                        //购物车页面跳转过来的话 from=cart
                        let from = this.$route.query.from || '';
                        if( !!from && from == 'cart' && !type){ //正常下单的场景才会删除购物车商品。申请采购此时不能删除
                            this.deleteGoodsFromCart();
                        }
                        this.$nextTick(()=>{
                            this.afterCreateOrder(res.result.orderNo, type);
                        })

                        //清空选中的发票抬头的缓存
                        extendUtils.removeSession('choosedInvoiceDetail') 
                    }
                }
            }).catch(e=>{
                this.$loading.hide();
                this.orderLock = false;//打开订单锁
                console.log(e);
                if(!!e && e.resultCode == '80102008'){ //针对下单前商品下架、无货、变价、区域限售的错误码业务侧单独特殊处理
                    !!e.result && this.dealProductChangeList(e.result);
                }else if(!!e && e.resultCode == '80102011'){ //供应商停用，直接展示服务端的提示
                    !!e.resultMessage && extendUtils.showToast(e.resultMessage);
                }else if(!!e && e.resultCode == '80115022'){ //赠品已赠完（或部分赠品已赠完的弹窗），是否继续提交订单
                    !!e.resultMessage && this.dealGiftPop(e.resultMessage, param, type);
                }else if(!!e && e.resultCode == '80115029'){ //附件无货
                    this.dealAttachmentPop(e.resultMessage);
                }
            })
        },

        /**
         * 显示赠品无货的弹窗
         * @param result 下单赠品无货相关的错误信息
         * @param param 下单拼接的所有的参数
         * @param type 下单时传递的参数 如果是申请采购该值为字符串：applyPurchase  如果是正常下单什么都不传
         */
        dealGiftPop(result, param, type){
            result = (extendUtils.getClass(result)=='String') ? JSON.parse(result) : result;
            let that = this;
            let text = '抱歉赠品已赠完，是否继续提交订单？';
            SnModal({
                message: text,
                showCancelButton: true,
            }).then(res => {
                //目前result里面返回的sku是主商品的sku  订的规则是主商品A 有赠品A1/A2/A3  如果A1无货了 直接将A的所有赠品（A1/A2/A3）全部删除;
                //同时只要报这个错，所有商品的赠品全部都不要了
                //针对附件无货的场景暂时没有处理
                let noGiftSku = result.sku || '';
                let newProducts = param.products.filter(item => { //此时剔除所有的赠品
                    return item.productType != 2;
                })

                newProducts = newProducts.map(item=>{ //将主商品的needGift改为false
                    if(item.productType == 0){
                        item.needGift = false;
                    }
                    return item;
                })
                

                let newParam = Object.assign({}, param, {products: newProducts});
                that.createOrderApiFun(type, newParam);//重新下单
                
            }).catch(rej => {
                console.log('rej === ', rej);
            });
        },
        /**
         * 显示附件无货的弹窗
         * @param result 下单赠品无货相关的错误信息
         */
        dealAttachmentPop(result){
            result = (extendUtils.getClass(result)=='String') ? JSON.parse(result) : result;
            let that = this;
            let text = '附件已无货';
            SnModal({
                message: text,
                showCancelButton: false,
                confirmButtonText:'返回购物车',
            }).then(res => {
                //附件无货的话，直接返回购物车
                that.onCancelProductChange();
            }).catch(rej => {
                console.log('rej === ', rej);
            });
        },

        /**
         * 提交订单接口
         */
        createOrder(type){
             //下单锁
            if(!!this.orderLock){
                return;
            }
            if(!!this.checkParam()){
                this.apiPromiseAll(type);
            }
        },
        /**
         * 等下单需要的所有参数接口全部返回的时候，再去掉真正的下单API接口,
         */
        apiPromiseAll(type){
            this.$loading.show();
            Promise.all([this.productPromise,  this.promiseCalendarPromise, this.freightPromise, this.skuClassifyPromise, this.giftPromise]).then(result => {
                // console.log('result',  result)
                this.$loading.hide();
                this.createOrderApiFun(type); //等promise.all接口全部返回的时候，才回去调创建订单的接口
                
            }).catch(e => {
                this.$loading.hide();
                console.log(e)
            });        
        },

        //处理下架、无货、变价的数据按顺序返回 优先及下架》无货》变价
        deleteSameItem(arr, list){
            arr.forEach(item => {
                let index = list.findIndex(temp => {
                    return  temp.sku == item.sku
                })
                if(index>-1){
                    list.splice(index,1);
                }
            })
            return list;
        },
        
        /** 
        * 处理商品下架、无货、变价的列表数据
        */
        dealProductChangeList(resultObj){
            this.productChangeList = [];
            let downProducts = []; //下架商品的列表
            let areaRestrictProducts = []; //商品区域受限商品的列表
            let stockOutProducts = []; //无货商品的列表
            let unitePriceChangedProducts = []; //变价商品的列表
            
            //判断下架商品
            if(!!resultObj.downProducts && resultObj.downProducts.length > 0){
                downProducts = this.getProductItem(this.productList, resultObj.downProducts, 'downProducts');
            }
            //判断区域限售的商品
            if(!!resultObj.areaRestrictProducts && resultObj.areaRestrictProducts.length > 0){
                //过滤掉下架的
                let areaRestrictList = this.deleteSameItem(downProducts, resultObj.areaRestrictProducts);
                areaRestrictProducts = this.getProductItem(this.productList, areaRestrictList, 'areaRestrictProducts');
            }
            //判断无货商品
            if(!!resultObj.stockOutProducts && resultObj.stockOutProducts.length > 0){
                //过滤掉下架的
                let firstStockOutList = this.deleteSameItem(downProducts, resultObj.stockOutProducts);
                //过滤掉区域限售的
                let stockOutList = this.deleteSameItem(areaRestrictProducts, firstStockOutList);
                stockOutProducts = this.getProductItem(this.productList, stockOutList, 'stockOutProducts');
            }
      
            let allOutList = [...downProducts, ...areaRestrictProducts, ...stockOutProducts]; //下架/区域限售和缺货的商品列表
            //判断变价商品
            if(!!resultObj.unitePriceChangedProducts && resultObj.unitePriceChangedProducts.length > 0){
                //过滤掉下架区域限售和无货的
                let unitPriceChangeList = this.deleteSameItem(allOutList, resultObj.unitePriceChangedProducts)
                unitePriceChangedProducts = this.getProductItem(this.productList, unitPriceChangeList, 'unitePriceChangedProducts');
            }

            let newArr = [...downProducts, ...areaRestrictProducts, ...stockOutProducts, ...unitePriceChangedProducts];
            this.productChangeList = extendUtils.repeatArray(newArr, 'sku');//根据sku去重
            console.log('this.productChangeList', this.productChangeList)
            this.showProductChange = true;
        },

        /** 
        * 获取商品项
        */
        getProductItem(list, dataList, errorType){
            let newArr = JSON.parse(JSON.stringify(list));//深拷贝列表数据
            if(dataList.length<=0){return []}
            let newList = [];
            for(let i = 0; i < dataList.length; i++){
                const item = dataList[i];
                let index = list.findIndex(temp=>{
                    return item.sku == temp.sku;
                })
                if(index > -1){
                    newArr[index].errorType = errorType;
                    if(errorType == 'unitePriceChangedProducts'){//如果是变价的话需要更新新旧价格字段
                        newArr[index].unitPrice = item.newUnitPrice;
                        newArr[index].oldUnitPrice = item.oldUnitPrice;
                    }
                    newList.push(newArr[index])
                }
            }
            return newList;
        },
        /**
         * 同时查询运费和查询配送时间和查询商品大小件
         * 下单必须的参数
         */
        getPromiseTimeAndFreight(item){
            // this.promiseTimePromise = this.getPromiseTime(); //查询预计送达时间
            this.promiseCalendarPromise = this.getPromiseCalendar(); //查询配送时间日历
            this.freightPromise = this.getFreight(); //查询运费
            this.skuClassifyPromise = this.getSkuClassify(); //查询商品大小件
            this.giftPromise = this.getGoodsGift(item); //查询商品赠品和附件
        },

        /**
         * 调起支付列表
         */
        async afterCreateOrder(orderNo, type){
            let that = this;
            if(!!type && type == 'applyPurchase'){ //申请采购成功后的回调
                let param = {
                    "applyUserId": cartHandler.userId,
                    "companyId": cartHandler.companyId,
                    "channelId": cartHandler.channelId,
                    "orderNo": orderNo
                 }
                that.gotoPurchaseApply(Base64.encodeURI(JSON.stringify(param)), orderNo);

            }else{ //提交订单直接拉起支付
                this.orderNoList.push(this.orderNo);
                let orderDetail = await orderHandler.getOrderDetail({orderNo: this.orderNo})
                orderDetail = orderDetail.result.order;
                this.$router.push({
                    path: '/pay',
                    query: {
                        expiredTime: (orderDetail || {}).paymentExpiredDeadline,
                        orderNo: this.orderNo,
                        amount: parseFloat(this.paymentAmount),
                        goodsDesc: `订单号: ${this.orderNo}`,
                        tradeType: '4',
                        pageFrom: this.$route.path
                    }
                })
            }
        },

        /** 
        * 定义从审批跳转回来的url新增参数
        * （applyPage == confirm 说明是从提交订单页面去申请采购的）
        * （applyPage == cart 说明是从购物车页面去申请采购的）
        */
        setQuery(url){
            return url + '&applyPage=confirm';
        },

        /*****
        * 前往审批申请采购
        */
		async gotoPurchaseApply(applayData, orderNo){
			let that = this;
			//获取content
            let tempContent = that.getPurchaseApplyInfo();

			
            //拼装跳转申请采购所需参数
            let products = this.productList.map(function(item){
                return {
                    sku: item.sku, //商品sku编号
                    supplierId: item.supplierId, //供应商id
                }
            })
            let callBackUrl = location.origin + location.pathname + "#/entrance/"+orderNo+'?applayData='+applayData+'&channelId='+orderHandler.channelId+'&nextAll_multipage=false&supplierId='+products[0].supplierId+'&entranceType=snapshot';

			let param = {
				content: tempContent,//商品信息
				callback: that.setQuery(callBackUrl),//回调地址
                approvalCallback: false,//审批过程中不回调
                products:products//商品数据，用于后续流程页面处理
			} 
            let obj = {
                "type":"string",//存储数据类型
                "key":applayData,//存储的key
                "value":JSON.stringify(param),//数据
                // "fileName":that.BMallConfig.APPSTORAGE_FILENAME,//文件名
            }
            let  yqtApplyAddress = '';
            try{
                //获取渠道配置的审批地址
                let channelInfo = await that.getchannelInfo();
                //审批的出差地址处理成采购
                yqtApplyAddress = channelInfo.approvalRequestUrl;
                
            }catch(e){
                if(1==cartHandler.channelId){//兼容内部环境
                    yqtApplyAddress = that.BMallConfig.YQTAPPLY;
                }else{
                    extendUtils.showToast('还未设置采购申请地址，请前往运营后台设置')
                    return;
                }
            }
            let yqturl = yqtApplyAddress+'&orderNo='+applayData;


            //存储数据并跳转审批
            that.putPropertyAndGotoYQT(obj, yqturl)
			
        },

        /**
         * 存储app缓存信息
         * @param {*} param 参数
         */
        putPropertyAndGotoYQT(obj, url){
            let that = this;
            extendUtils.putPropertyFunction(obj).then((res)=>{
                if(0 == res){
                    //存储数据成功跳转审批
                    window.open(url);
                    that.$emit('closePopup');
                    that.$loading.hide();
                }else{
                    console.log('数据存储失败')
                }
            }).catch((err)=>{
                console.log(err)
            })
        },

        /**
         * 获取渠道配置的审批地址
         */
        getchannelInfo(){
            let that = this;
            return new Promise((resolve, reject) => {
                let param = {
                    channelId: cartHandler.channelId,
                }
                cartHandler.getchannelInfo(param).then(res=>{
                    if(res.resultCode == 0 && res.result && !!res.result.approvalRequestUrl && '' != res.result.approvalRequestUrl){
                        resolve(res.result);
                    }else{
                        resolve();
                    }
                }).catch(e=>{
                    console.log(e);
                    reject();
                })
            })
        },

        /*****
        * 获取前往审批申请采购的商品信息
        */
		getPurchaseApplyInfo(){
			let that = this;
            let tempArr = [];
			//总金额分
			let totlePrice = 0;
			//总商品件数
			let psum = 0;
            //总list长度
			let plength = that.productList.length;
			for(let i = 0; i < plength; i++){
                const item = that.productList[i];
                let price = that.dealNum(this.realPrice(item));
                tempArr.push({
                    pName: item.name,
                    price: price,
                    num: item.num,
                    sum: price * item.num
                })
				psum += item.num;
				totlePrice += (price * item.num);
            }
			return {
				pList: tempArr,
				pSum: psum,
                totalPrice: totlePrice+that.dealNum(that.expressPrice),
                freight: that.dealNum(that.expressPrice),   
			};
        },

        /**
         * 取消订单调取接口
         * @param orderNo
         */
        cancelOrder(orderNo){
            let that = this;
            orderHandler.cancelOrder({orderNo: orderNo}).then(res=>{
                if(res.resultCode == 0){
                    console.log('取消成功');
                }
            }).catch(e=>{
                console.log(e);
            })
        },

        /**
         * 购物车页面跳转过来的，下单成功后，需要把购物车里面带过来的商品删掉
         */
        deleteGoodsFromCart(){
            const that = this;
            let goods =  this.productList.map(item => {
                return {
                    "sku": item.sku,
                    "supplierId":item.supplierId
                }
            })
            let param = {
                "userId": orderHandler.userId,
                "companyId": orderHandler.companyId,
                "channelId": orderHandler.channelId,
                "delAll":false,
                "goods":goods,
                "supplierId":cartHandler.supplierId
            }
            cartHandler.deleteGoodsFromCartList(param).then(data=>{
                if(data.resultCode == 0){
                    //暴露给购物车分享采购页面处理刷新数据的方法
                    this.adterDeleteGoodsFromCart();
                    //触发底部图标购物车的更新
                    this.$store.dispatch('getCartNum');
                }
            }).catch(rej => {
                console.log('rej === ', rej);
            });
        },
        /**
         * 暴露给购物车分享采购页面处理刷新数据的方法,当前页面无用
         */
        adterDeleteGoodsFromCart(){

        },

        /*****
         * 关闭发票信息弹窗
         */
        closeInvoicePopup(){
            this.showBillDetailModel = false;
        },

        /*****
         * 关闭地址选择信息弹窗
         */
        closeAddressPopup(){
            this.showAddressChoose = false;
        },

        /*****
         * 选择地址的显示弹窗
         */
        chooseAddress(){
            this.showAddressChoose = true;
        },

        /*****
         * 获取发票弹窗返回的数据
         */
        getBillDetail(isInvoice, invoiceReceiver, orderInvoice){
            this.isInvoice = isInvoice;
            if(isInvoice){//需要开发票
                this.orderInvoice = orderInvoice;
                this.invoiceReceiver = Object.assign({},invoiceReceiver,{id: true});
            }else{//不需要开发票
                // this.invoiceDetail = {};
            }

            //关闭弹窗
            this.closeInvoicePopup();
        },

         /*****
         * 选择完地址关闭弹窗
         */
        closeAddressList(){
            this.closeAddressPopup();
        },

        /**
         * 更新sessionStorage中productSkuList的缓存，主要是数量变化
         */
        updateProductSkuList(item){
            let index = this.productSkuList.findIndex(temp => {
                return item.sku == temp.sku;
            })
            if(index > -1 && item.num > 0){
                this.productSkuList[index].num = item.num || 1;
            }
        },
        
        /**
         * 判断单个商品的上下架和库存状态
         * @param item 单个的商品item
         */
        judgeProductStatus(item){
            if(!item || Object.keys(item).length <= 0){  return {} };
            let statusObj = {};
            if(item.hasOwnProperty('state')){
                if(!!this.productStatusMap[item.state].stopSales){ //表示已下架
                    statusObj = {
                        noSale: true, //下架
                    }
                }else{ //表示已上架
                    statusObj = {
                        noSale: false, //上架
                        noStock: !!item.hasOwnProperty('hasStock') ? !item.hasStock : false,
                    }
                }
            }
            statusObj = Object.assign({}, statusObj, {remainNum: item.remainNum, areaRestrict: item.areaRestrict}); //将剩余的商品数量和区域限售加进去
            return statusObj;
        },

        /** 
        *判断下单时候，商品下架，无货，变价的弹窗显示 
        */
        judgeChangeProductStatus(item){
            if(!item || Object.keys(item).length <= 0){  return {} };
            let statusObj = {};
            if(!!item.errorType && item.errorType == 'downProducts'){
                statusObj = {
                   noSale: true, //下架
                }
            }else if(!!item.errorType && item.errorType == 'areaRestrictProducts'){
                statusObj = {
                   areaRestrict: true, //区域限售
                }
            }else if(!!item.errorType && item.errorType == 'stockOutProducts'){
                statusObj = {
                   noStock: true, //无货
                }
            }else if(!!item.errorType && item.errorType == 'unitePriceChangedProducts'){
                statusObj = {
                   unitPriceChange: true, //变价
                }
            }
            return statusObj;
        },

        /**
         * 获取指定的key
         */
        getSpecificKey(list, item, key){
            if(list.length > 0){
                let index = list.findIndex(temp => {
                    return temp.sku == item.sku;
                })
                if(index > -1){
                    return list[index][key];
                }
            }
        },

        /**
         * 监听商品数量的变化
         * 商品数量的变化触发查询商品库存的有无
         */
        setNum(item, val){
            //更新商品的数量
            this.$set(item, 'num', val)
            this.getlistStockConfirm(item);
        },

        //新增地址成功回调
        saveSuccess(param){
            this.addressItem = param;
            this.showAddressEdit = false;
        },

        /** 
        * 点击商品变动的弹窗 返回购物车按钮
        */
        onCancelProductChange(){
            extendUtils.removeSession('productSkuList'); //清空缓存
            this.$router.push({
                path: '/iCart',
            })
        },
        
        /** 
        * 点击商品变动的弹窗 确定按钮
        */
        onConfirmProductChange(){
            this.orderLock = false; //解开订单锁
            if(this.productChangeList.length <= 0){ return };
            for(let i = 0; i < this.productChangeList.length ;i++){
                const item = this.productChangeList[i];
                if(!!this.checkProductChangeStatus(item)){
                    let index = this.productSkuList.findIndex(temp => {
                        return temp.sku == item.sku
                    })
                    if(index > -1){
                        this.productSkuList.splice(index, 1)
                    }
                }
            }
            //更新缓存
            extendUtils.setSession('productSkuList', JSON.stringify(this.productSkuList));

            //重新查询商品的运费、商品大小件和预计到达时间
            this.getPromiseTimeAndFreight();

            //重新更新获取相关数据
            this.initData();
        },

        /**********
         * 检测商品是否存在下架 无货和区域销售的商品
         */
        checkProductChangeStatus(item){
            return item.errorType == 'downProducts' || item.errorType == 'stockOutProducts' || item.errorType == 'areaRestrictProducts';
        },

        /****************************配送时间相关的方法开始******************/

        //打开配送时间的弹窗
        showDatePop(type){
            if(this.multiDate){ //如果是多个商品的话，此时需要弹出多个商品配送时间的展示弹窗
                this.showDeliveryDetailPop = true;
            }else{
                if(type == 1){ //配送时间弹窗展示
                    this.showCalendarDate = true;
                }else if(type == 2){ //安装时间弹窗展示
                    this.showCalendarInstallDate = true;
                }
            }
        },

        //关闭配送时间选择的弹窗
        closeCalendarDatePopup(){
            this.showCalendarDate = false;
        },

        //关闭安装时间选择的弹窗
        closeCalendarInstallDatePopup(){
            this.showCalendarInstallDate = false;
        },


        //点击多个商品配送时间显示的时间段选的的弹窗
        showDateCalendarPop(list, index){
            this.calendarList = list;
            this.dateIndex = index;
            this.showCalendarDate = true;
        },

        //点击多个商品配送时间显示的安装的弹窗
        showCalendarInstallPop(list, index){
            this.calendarInstallList = list;
            this.dateIndex = index;
            this.showCalendarInstallDate = true;
        },


        //选择完配送时间后的回调
        updatePromiseCalendar(calendarList){
            let calendarArr = calendarList.filter(item => {
                return item.selected;
            })

            if(!!this.multiDate){
                this.productPromiseCalendars.forEach((item, i) => {
                    if(this.dateIndex >= 0 && i == this.dateIndex){
                        this.$set(item, 'calendarList', calendarList);
                        //更新完配送时间后，如果有安装时间，同时更新安装时间
                        if(item.calendarDayInstallDays.length > 0){
                            item.calendarDayInstallDays.forEach(temp => {
                                if(temp.dateStr == calendarArr[0].dateStr){ //根据dataStr匹配配送时间对应的安装时间
                                    this.$set(item, 'installDays', temp.installDays);
                                }
                            })
                            
                        }
    
                    }
                })
            }else{ //只有一个日期的时候
                let item = this.productPromiseCalendars[0];
                if(!!item.calendarDayInstallDays && item.calendarDayInstallDays.length > 0){
                    item.calendarDayInstallDays.forEach(temp => {
                        if(temp.dateStr == calendarArr[0].dateStr){//根据dataStr匹配配送时间对应的安装时间
                            this.calendarInstallList = temp.installDays;
                        }
                    })
                }
            }
           
         
        },

        //选择完安装时间后的回调
        updatePromiseInstallCalendar(installCalendarList){
            this.productPromiseCalendars.forEach((item, i)=>{
                if(this.dateIndex>=0 && i == this.dateIndex){
                    this.$set(item, 'installDays', installCalendarList)
                }
            })
        },

        //点击多个商品配送时间相关的弹窗
        updatePromiseDateList(list){
            this.productPromiseCalendars = list;
        },

        //导入企业发票抬头
        async importInvoiceFun(){
            let flag = await this.$refs.invoiceComp.gotoImportInvoice('single');
        }
    }
};
</script>

