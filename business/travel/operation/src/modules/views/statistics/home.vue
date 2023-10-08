
<template>
  <div class="operationStatistics_container">
    <div class="top">
        <div class="title clear"><i v-if="pageType" @click="goBack" class="cursorp"></i><span v-if="pageType=='salesAmount'">销售金额明细</span><span v-else-if="pageType=='refundAmount'">退款金额明细</span><span v-else>运营统计</span></div>
        <div class="tips clear">
            <p>小贴士</p>
            <ul>
                <li>1.数据来源于商旅通平台发生交易订单（不包括机票、火车票出票失败和酒店预付确认失败和酒店预付确认失败的订单）；</li>
                <li>2.“交易日期”以订单支付时间为准；</li>
                <li>3.酒店到店付订单将在用户“已入住”后计入统计；</li>
                <li>4.支持查询一年内的运营数据；</li>
            </ul>
        </div>
    </div>
    <div class="filterWrap">
        <div class="chooseTop">
				<ul>
                    <li>
                        <label class="condition-item">交易日期:</label>
					    <DatePicker type="date"  v-model="dateStart" :clearable='false' :transfer="true" :options="startTimeOptions" id="scheduledBeginTime" placement="bottom-end" placeholder="请选择日期" class="date-picker"></DatePicker>
					    <span class="date-split">至</span>
					    <DatePicker type="date" v-model="dateEnd" :clearable='false' :transfer="true" :options="endTimeOptions" id="scheduledEndTime" placement="bottom-end" placeholder="请选择日期" class="date-picker"></DatePicker>
                    </li>
                    <li>
                        <label class="condition-item">分销渠道:</label>
                        <div class="channel content cursorp">
                            <input v-model.trim="productTypeArr[channelId]" type="text" name="" placeholder="请选择" readonly unselectable="on">
                            <i></i>
                            <select v-model="channelId">
							    <option v-for="(prodName,channelId,index) in productTypeArr" :key="index" :value="channelId">{{prodName}}</option>
					        </select>
                        </div>
                    </li>
                    <li>
                        <label class="condition-item">企业名称:</label>
                        <div class="company content cursorp">
                            <input  v-model.trim="companyArr[companyId]" type="text" name="" placeholder="请选择" readonly unselectable="on">
                            <i></i>
                            <select v-model="companyId">
							    <option v-for="(companyName,companyId,index) in companyArr" :key="index" :value="companyId">{{companyName}}</option>
					        </select>
                        </div>
                    </li>
				</ul>
		</div>
        <div class="chooseBot clear">
            <div v-if="userTypeFlag" class="tripType clear">
                <label class="condition-item">出行类型（因公/因私）:</label>
                <div class="tripTypeChoose content cursorp">
                    <input v-model.trim="userTypeArr[useTypeId]" type="text" name="" placeholder="请选择" readonly unselectable="on">
                    <i></i>
                    <select v-model="useTypeId">
							<option v-for="(typeName,useTypeId,index) in userTypeArr" :key="index" :value="useTypeId">{{typeName}}</option>
					</select>
                </div>
            </div>
            <div class="tripType clear">
                <label class="condition-item">支付方式:</label>
                <div class="tripTypeChoose content2 cursorp">
                    <Select 
                        class="inCascader" 
                        v-model="payTypes"
                        multiple 
                        :max-tag-count="3">
							<Option 
                                v-for="type in payTypeArrNet" 
                                :key="type.value" 
                                :value="type.value"
                            >
                            <div class="labelOption">{{type.label}}</div>
                            </Option>
                    </Select>
                </div>
            </div>            
            <div class="button" @click="search">
            查询
            </div>
        </div>
        <p class="total"><span v-if="pageType=='salesAmount'">销售金额：</span><span v-if="pageType=='salesAmount'">￥ {{totalPayAmount}}</span><span v-if="pageType=='refundAmount'">退款金额：</span><span v-if="pageType=='refundAmount'">￥ {{totalRefCount}}</span></p>
    </div>
        <router-view 
            :searchStatus="searchStatus"
            :useTypeId="useTypeId"
            :payTypes="payTypes"
            :companyId="companyId"
            :channelId="channelId"
            :dateStart="dateStart"
            :dateEnd="dateEnd"
        ></router-view>
  </div>
</template>
<script>
    import tmHandler from "bislibs/requesthandler/traveloperationhandler.js"; 
    import utils from "bislibs/utils";
    import  * as travelfun from "bislibs/traveloperationfun.js";
    
  export default {
    name:"operationStatistics",
    components: {
    },
    props: [],
    data () {
     return {
         startTimeOptions:{ // 起始日期禁用值
             disabledDate:date=>{
                 let month12=Date.now()-31536000*1000
                 return date&&date.valueOf()>this.dateEnd.getTime()||date.valueOf()<month12
             }
         },
        endTimeOptions:{ // 终止日期禁用值
             disabledDate:date=>{
                 return date&&date.valueOf()<this.dateStart.getTime()||date.valueOf()>Date.now()
             }
         },
         totalPayAmount:0, // 销售总金额
         totalRefCount:0, // 退款总金额
         searchStatus:1, // 搜索监听值
         isLoading:true,
        dateStart:new Date(new Date().format('yyyy/MM')+'/01'),
        dateEnd:new Date(),
         pageType:this.$route.query.pageType||null,// 子路由类型返回按钮显隐
         useTypeId: '', // 出行Id
         userTypeArr: {
             '0':'因公',
             '1':'因私',
             '':'全部'
         },
         companyId: '', // 企业id
         companyArr:'',
        //  companyArr: {
        //         // "1": "测试企业9",
        //         // "12": "你好。",
        //         // "20": "123123",
        //         // "230": "开发环境兆日科技",
        //         // "231": "开发环境创意工厂",
        //         // "232": "开发环境版本体验公司",
        //         '':'全部企业',
        //     },
         channelId:'', // 渠道id
         productTypeArr:'',
        //  productTypeArr:{
        //     // "1": "T信",
        //     // "4": "商旅通",
        //     // "4098": "金贝",
        //     null:'全部渠道'
        // }
        payTypes:[],
        userTypeFlag: utils.userTypeSwitch,
        payTypeArrNet:[],
        payTypeOffLine: {
            label: "到店付",
            value: "PAY_IN_CASH"
        },
      }
    },
    created: function () {
        let that=this
        console.log("alive.home.created");
    },
    methods: {
        search(){
            this.searchStatus++
        },
        goBack(){
            this.$router.back()
        },
        getfilterData(){ // 获取渠道
            let that=this
            let obj={};
            travelfun.getAllChannels(obj)
               .then((data)=>{
                     let arr={}
                    if(0 == data.resultCode && !!data.result.channelInfos) {
                        for(let i=0;i<data.result.channelInfos.length;i++){
                            arr[data.result.channelInfos[i].channelId]=data.result.channelInfos[i].channelName
                        }
                    }                     
                   arr['']='全部'
                   that.productTypeArr=arr
                   that.getCpyList() // 查询渠道列表之后查询企业列表
                    that.getPaymentPlatforms(that.channelId)   
               }).catch(err=>{
                   console.info(err)
               })           
        },
        /**
         * 查询支付方式
         */
        getPaymentPlatforms(productionChannelId) {
            let that = this;
            let request = {
                productionChannelId:
                    !!productionChannelId && parseInt(productionChannelId) > 0
                        ? productionChannelId
                        : undefined
            };
            tmHandler.getPaymentPlatforms(request).then(
                function(res) {
                    if (0 == res.resultCode && !!res.result) {
                        let paymentList = res.result.payTypes;
                        //先清除列表，添加默认的 全部 选项卡
                        that.payTypeArrNet.splice(0, that.payTypeArrNet.length);
                        // let defaultFull = {
                        //     label: "全部",
                        //     value: defaultFullVaule
                        // };
                        // that.payTypeArrNet.push(defaultFull);
                        // that.outData.payTypes = [that.payTypeArrNet[0].value];
                        // that.payTypes = [];
                        //全部的默认
                        paymentList.forEach(payment => {
                            //1=开启才是有效的
                            let arrItem = {};
                            arrItem.label = payment.payTypeName;
                            arrItem.value = payment.payType;

                            that.payTypeArrNet.push(arrItem);
                        });
                         //没有获取到渠道的支付方式，不添加 到店付 选择
                        if (that.payTypeArrNet.length > 1) {
                            that.payTypeArrNet.push(that.payTypeOffLine);
                        }
                        // if(utils.getSession('travelManagePayTypes')!=undefined||(utils.getSession('payTypesHome')!=undefined)
                        //     &&(window.location.hash.indexOf('salesAmount')==-1&&window.location.hash.indexOf('refundAmount')==-1)){ // 判断是否存储企业id                        
                        //     if(utils.getSession('travelManagePayTypes')!=undefined){ // 退款销售页面存储企业id
                        //         that.payTypes.splice(0, that.payTypes.length)
                        //         let tempList = JSON.parse(utils.getSession('travelManagePayTypes'))
                        //         tempList.forEach(element => {
                        //             for(let i= 0; i< that.payTypeArrNet.length; i++){
                        //                 if(element == that.payTypeArrNet[i].value){
                        //                      that.payTypes.push(that.payTypeArrNet[i].value)
                        //                      break;
                        //                 }
                        //             }                                    
                        //         });                               
                        //         utils.removeSession('travelManagePayTypes')
                        //         that.searchStatus++ // 刷新数据
                        //     }
                        //     if(window.location.hash.indexOf('salesAmount')==-1&&window.location.hash.indexOf('refundAmount')==-1){ // 在主页面
                        //         if(utils.getSession('payTypesHome')!=undefined){ // 主页面存储企业id
                        //             that.payTypes=JSON.parse(utils.getSession('payTypesHome'))
                        //             utils.removeSession('payTypesHome')
                        //             that.searchStatus++ // 刷新数据
                        //         }
                        //     }  
                        // }else{
                             that.payTypes.splice(0, that.payTypes.length)
                        // }
                    }
                },
                function(error) {
                    console.info(error);
                }
            );
        },        
        getCpyList(){ // 获取企业
            let that=this
            let req={};
            if(that.channelId){
                req.channelId=that.channelId;
            }
             let arr={}
                arr['']='全部'
                that.companyArr=arr
                tmHandler.getOrderCompanyIds(req)
                 .then((data)=>{
                let arr={}
                    
                if(data.result.companyNames && data.result.companyNames.length>0){
                    for(let i=0;i<data.result.companyNames.length;i++){
                        let key = data.result.companyNames[i].companyId
                        let value = data.result.companyNames[i].companyName
                        if(!key || !value) continue;
                        arr[key+""]=value
                    }
                        arr['']='全部'
                        that.companyArr=arr
                        // if(utils.getSession('travelManageCompanyId')!=undefined||(utils.getSession('companyIdHome')!=undefined)&&(window.location.hash.indexOf('salesAmount')==-1&&window.location.hash.indexOf('refundAmount')==-1)){ // 判断是否存储企业id
                        
                        //     if(utils.getSession('travelManageCompanyId')!=undefined){ // 退款销售页面存储企业id
                        //         that.companyId=utils.getSession('travelManageCompanyId')
                        //         utils.removeSession('travelManageCompanyId')
                        //        that.searchStatus++ // 刷新数据
                        //     }
                        //      if(window.location.hash.indexOf('salesAmount')==-1&&window.location.hash.indexOf('refundAmount')==-1){ // 在主页面
                        //          if(utils.getSession('companyIdHome')!=undefined){ // 主页面存储企业id
                        //             that.companyId=utils.getSession('companyIdHome')
                        //             utils.removeSession('companyIdHome')
                        //         that.searchStatus++ // 刷新数据
                        //         }
                        //      }  
                        // }else{
                            that.companyId=''
                        // }
                    }else if(!req.channelId){
                        //迁移前入参不传channelId，默认获取所有的企业数据。迁移后channelId必传，否则返回空数据，单独处理。
                        arr['']='全部'
                        that.companyArr=arr
                        that.companyId=''
                    }else{ // 无企业数据
                        arr['wuqiye']='无企业'
                        that.companyArr=arr
                        that.companyId='wuqiye'
                    }
                   
               }).catch(err=>{
                   console.info(err)
               })
        }
    },
    mounted () {
        console.log("alive.home.mounted");
        let that=this
        let hashsalesAmount=window.location.hash.indexOf('salesAmount')
        let hashrefundAmount=window.location.hash.indexOf('refundAmount')
        // if(utils.getSession('dateStartHome')!=undefined&&hashsalesAmount==-1&&hashrefundAmount==-1){ // 不在退款销售页面
        //     that.dateStart=new Date(parseInt(utils.getSession('dateStartHome'))) // 获取主页保存时间条件
        //     utils.removeSession('dateStartHome')
        // }
        // if(utils.getSession('dateEndHome')!=undefined&&hashsalesAmount==-1&&hashrefundAmount==-1){ // 不在退款销售页面
        //     that.dateEnd=new Date(parseInt(utils.getSession('dateEndHome'))) // 获取主页保存时间条件
        //     utils.removeSession('dateEndHome')
        // }
        // if(utils.getSession('useTypeIdHome')!=undefined&&hashsalesAmount==-1&&hashrefundAmount==-1){ // 不在退款销售页面
        //   that.useTypeId=utils.getSession('useTypeIdHome')
        //   utils.removeSession('useTypeIdHome')
        // }
        // if(utils.getSession('prodIdHome')||utils.getSession('travelManageProdId')){  // 有存储渠道
        //     if(utils.getSession('prodIdHome')!=undefined&&hashsalesAmount==-1&&hashrefundAmount==-1){ //不在退款销售页面的首页存储
        //         that.channelId=utils.getSession('prodIdHome')
        //         utils.removeSession('prodIdHome')
        //     }
        //     if(utils.getSession('travelManageProdId')!=undefined){ // 退款销售页面的存储
        //         that.channelId=utils.getSession('travelManageProdId')
        //         if(!utils.getSession('travelManageProdId')){
        //              that.getfilterData()
        //          }
        //          utils.removeSession('travelManageProdId')
                 
        //     }   
        // }else{ // 没有存储 channelId 初始化加载渠道企业
            this.$nextTick(()=>{
            this.getfilterData()
        })
        // }  
    },
    watch: {
        $route(val){ // 监听query判断页面与回退按钮
            if(val.query){
                this.pageType=val.query.pageType
            }
        },
        channelId(val){
            let that=this
            if(that.companyArr && JSON.stringify(that.companyArr)!="{}"){// 加载过渠道
                that.getCpyList()
                that.getPaymentPlatforms(that.channelId)
            }else{ // 未加载过渠道 初始化加载渠道企业
                that.getfilterData()
            }
        }
        
    },
    filters: {},

  }
</script>
<style scoped lang="less" type="text/less">
  @import '~styles/common.less';
  @import '~styles/mixins/mixins.less';
@import '~styles/common.less';
@line-height:32px;
@font-color: #191919;
@placeholder-color: #B2B2B2;
.operationStatistics_container{
    .button{
      margin-left: 110px;
      text-align: center;
      cursor: pointer;
      border-radius: @radius;
      white-space: nowrap;
      line-height: 36px;
      width: 153px;
      height: 36px;
      font-size: 14px;
      color: #fff;
      background-color: @primary;
      &:hover{
        background-color:#6782F5;
      }
    }

    margin-left: 16px;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    position: relative;
    .top{
        box-sizing: border-box;
        padding: 24px 30px;
        width: 100%;
        // height: 164px;
        border-radius: 2px;
        background: #FFFFFF;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
        .title{
            font-size: 18px;
            color: #333333;
            font-weight: bold;
            padding-bottom: 16px;
            i{
                float: left;
                margin-right: 16px;
                display: block;
                width: 24px;
                height: 24px;
                background: url('~assets//icon_turn_left_nor.png') no-repeat;
                background-size: 100% 100%;
                &:hover{
                    background: url('~assets//icon_turn_left_hov.png') no-repeat;
                }
            }
            span{
                float: left;
            }
        }
        .tips{
            width: 100%;
            // height: 76px;
            background: #FFFBF0;
            border: 1px solid #FFD38C;
            border-radius: 2px;
            padding: 8px 0 8px 16px;
            p{
                float: left;
                font-size: 12px;
                color: @fc-label;
                line-height: 22px;
            }
            ul{
                font-size: 12px;
                color: @fc-label;
                line-height: 20px;
                padding-left: 8px;
                float: left;
            }
        }
       
    }
    .filterWrap{
            background-color: #fff;
            z-index: 2;
            padding: 48px 24px 0;
            border-bottom: 1px solid #EBEBEB;
            color:@fc-normal;
            font-size: 14px;
            .chooseTop{
                .date-picker{
                    width: 140px;
                    // text-align: center;
                }
               ul{
                   display: flex;
                   justify-content: space-between;
                   align-items: center;
                   li{
                       display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .condition-item{
                            margin-right: 8px;
                        }
                        .date-split{
                            margin:0 8px;
                        }
                       .content{
                            width: 128px;
                            height: 32px;
                            border: 1px solid #DDDDDD;
                            border-radius: 2px;
                            display: flex;
                            justify-content:space-between;
                            align-items: center;
                            position: relative;
                            i{
                                display: inline-block;
                                width: 33px;
                                height: 32px;
                                background: url('~assets//icon_spread_nor.png') no-repeat;
                                background-size: cover;
                            }
                            input{
                                border:0;
                                width: 94px;
                                height: 32px;
                                text-align: center;
                                background: 0;
                                 &:focus+i{
                                background: url('~assets//icon_spread_pre.png') no-repeat;
                                background-size: cover;
                            }
                            }
                            select{
                                box-sizing: border-box;
                                padding: 5px 10px;
                                width: 128px;
                                height: 32px;
                                position: absolute;
                                opacity: 0;
                            }
                            &:hover i{
                                background: url('~assets//icon_spread_pre.png') no-repeat;
                                background-size: cover;
                            }
                       }
                     
                       
                   }
               }
            }
            .chooseBot{
                padding-top: 24px;
                display: flex;
                align-items: center;
                .tripType{
                    display: flex;
                    align-items: center;
                    float: left;
                    margin-right: 20px;
                    .condition-item{
                        margin-right: 8px;
                        float: left;
                    }
                    .content{
                        float: left;
                        width: 128px;
                        height: 32px;
                        border: 1px solid #DDDDDD;
                        border-radius: 2px;
                        display: flex;
                        justify-content:space-between;
                        align-items: center;
                        position: relative;
                        &:hover i{
                            background: url('~assets//icon_spread_pre.png') no-repeat;
                            background-size: cover;
                        }
                        i{
                            display: inline-block;
                            width: 33px;
                            height: 32px;
                            background: url('~assets//icon_spread_nor.png') no-repeat;
                            background-size: cover;
                        }
                        input{
                            border:0;
                            width: 94px;
                            height: 32px;
                            text-align: center;
                            background: 0;
                            &:focus+i{
                                background: url('~assets//icon_spread_pre.png') no-repeat;
                                background-size: cover;
                            }
                        }
                        select{
                            padding: 5px 10px;
                            width: 128px;
                            height: 32px;
                            position: absolute;
                            opacity: 0;
                        }
                      
                    }
                    .content2{
                        border: none;
                        border-radius: 0;
                        width: 230px;
                        .CascaderClass {
                            margin-left: 3px;
                            width: 230px;
                            font-size: 14px;
                        }
                        .labelOption{
                            white-space: normal;
                            width: 198px;
                            padding-right: 8px;
                        }    
                    }
                }
                .button{
                    float: left;
                }
            }
            .total{
                padding-top: 30px;
                font-size: 14px;
                color: #999;
                span:last-child{
                    color: @font-blue ;
                }
            }
        }
    
}
</style>
<style>
@import "~styles/myiview.less";
</style>


