<template>
	<div class="flightInsurance" v-if="!!insuranceList && insuranceList.length>0">
		<div class="title">出行保险</div>
        <div class="detailBox">
            <div class="detail"  v-for="(item,index) in insuranceArray" :key="index">
                <div class="insurance-info" v-if="item.insuranceProduct">
                    <span class="icon icon2" v-if="!!item.airLineBriefInfo && item.airLineBriefInfo.specificVoyage==0">去程</span>
                    <span class="icon" v-else-if="!!item.airLineBriefInfo && item.airLineBriefInfo.specificVoyage==1">返程</span>
                    <span class="name">{{item.insuranceProduct.productShortName}}(￥{{item.insuranceProduct.farePrice}}/份)</span>
                    <span v-if="amountIsNotZero(item.insuranceProduct.insuranceAmount)">{{getInsuranceTypeDesc(item.insuranceProduct)}}</span>
                    <InfoLabel class="spanT" infoName="保险订单号" :infoValue="item.orderBase && item.orderBase.orderNo" classForName="infoLabel5" classForValue="infoLabel2">
                        <span class="spanT2" slot="middlePoint" >:</span>
                    </InfoLabel>                    
                </div>
                <div class="insurance-child" v-if="!!item.insuredInfos && item.insuredInfos.length > 0">
                    <div v-for="child in item.insuredInfos" :key="child.insuredId">
                        <div>
                            <InfoLabel class="spanT" infoName="被保险人" :infoValue="child.name" classForName="infoLabel5" classForValue="infoLabel2">
                                <span class="spanT2" slot="middlePoint" >:</span>
                            </InfoLabel> 
                            <InfoLabel class="spanT" infoName="数量" :infoValue="child.insuranceNum+'份'" classForName="infoLabel5" classForValue="infoLabel2">
                                <span class="spanT2" slot="middlePoint" >:</span>
                            </InfoLabel>   
                            <InfoLabel class="spanT" infoName="保费" :infoValue="'￥'+child.premium" classForName="infoLabel5" classForValue="infoLabel2">
                                <span class="spanT2" slot="middlePoint" >:</span>
                            </InfoLabel>  
                            <InfoLabel class="spanT" infoName="保单状态" :infoValue="getChildStatus(child.status)" classForName="infoLabel5" classForValue="infoLabel2">
                                <span class="spanT2" slot="middlePoint" >:</span>
                            </InfoLabel>              
                            <span v-if="hasErrMsg(child.status)" class="errmsg">{{getErrMsg(child)}}</span>                                                                                                     
                        </div>
                        <div>
                            <span class="btn" @click.stop="showChildDetailPop(child,item.airLineBriefInfo,item.insuranceProduct)">保单详情</span>
                        </div>                    
                    </div>                 
                </div>
                <div class="insurance-cpy" v-if="item.insuranceProduct">
                    <span>本产品由{{item.insuranceProduct.companyName||""}}承保</span>
                    <span v-if="!!item.insuranceProduct.supplierPhone">,咨询电话：{{item.insuranceProduct.supplierPhone}}</span>
                </div>             
            </div>
        </div>
        <div v-transfer-dom>
            <div id="childDetailDiabg" v-if="showChildDetail"></div>
            <div id="childDetailDiabox" v-if="showChildDetail">
                    <div class="closeBtn" @click="closeChildDetailDia"></div>
                    <p class="boxhead">保单详情</p>
                    <div class="content">
                        <p class="textarea"><span>保单编号：</span>{{popInsurance.policyNo || ""}}</p>
                        <p class="textarea"><span>被保险人：</span>{{popInsurance.name || ""}}</p>
                        <p class="textarea"><span>保单状态：</span>{{getChildStatus(popInsurance.status)}}</p>
                        <p class="textarea"><span>航程信息：</span>
                            <span>{{popAirLine.airCompanyName + popAirLine.flightNo}}</span>
                            <span>{{getFormatDeDate(popAirLine.departTime)}}</span>
                            <span>{{popAirLine.departCityName+"-"+popAirLine.arriveCityName}}</span>
                        </p>
                        <div class="descbox">
                            <div class="title">保险详情</div>
                            <div>保险费用：￥{{popInsurance.premium}}/份</div>
                            <div v-html="getFormatDesc(popRspInsProduct.detailDescription||popRspInsProduct.shortDescription)"></div>
                        </div>
                    </div>
                    <div class="boxbtn">
                        <!-- <a class="clickbtn cancel" href="javascript:void(0);" @click="closePictureVerifiCode">取消</a> -->
                        <a class="clickbtn confirm" href="javascript:void(0);" @click="closeChildDetailDia">确定</a>
                    </div>
            </div>
        </div>
	</div>
</template>

<script>
	import InfoLabel from 'biscomponents/infolabel/msglabel.vue'; 
    import utils from "bislibs/utils";
    import NP from "number-precision";

	export default {
		directives:{
        },   
		components: {
			InfoLabel,
		},                 
		props: {
			insuranceList: {
				type: Array,
				required: true,
			},
		},
		computed: {
            insuranceDescription:function(){
                return "理赔说明：因航空意外伤害导致的身故、伤残累计赔偿额度360万人民币/份，因航空意外伤害导致的医疗费累计赔偿额度2万人民币/份。"
            },
			//动态的title拼接
			cardNumber: function() {
				return this.insuranceList.length;
            },
            //页面展示的数据列表，需要深拷贝一次，保证不改变原来的入参的值。
			insuranceArray:function(){
                let myList = JSON.parse(JSON.stringify(this.insuranceList));
				for(let i=0;i<myList.length;i++){
                    myList[i].isClosed = true;
                    // if(myList[i].orderBase){
                    //     myList[i].airLineBriefInfo.flightNo =  myList[i].orderBase.flightNo
                    // }
				}
				return myList
            },
		},
		data() {
			return {
				listSwitch: false, //控制 伸缩和展开的按钮
                showTips: false, //
                insuranceTypeMap:{
                    1:"航意险",
                    2:"航延险",
                    3:"航意/航延险",      
                    4:"误机险",                
                },    
                insuranceTypeDesMap:{
                    1:"旅行有保障，最高赔付￥",
                    2:"您等待我来赔，最高赔付￥",
                    3:"意外延误全保障，更划算",      
                    4:"您等待我来赔，最高赔付￥",   
                    AIRLINE_ACCIDENT_INSURANCE:"旅行有保障，最高赔付￥", 
                    AIRLINE_DELAY_INSURANCE:"您等待我来赔，最高赔付￥",
                    IRLINE_ACCIDENT_AND_DELAY_INSURANCE:"意外延误全保障，更划算",      
                    AIRLINE_MISSED_INSURANCE:"您等待我来赔，最高赔付￥",                           
                    ACCIDENT_INSURANCE:"旅行有保障，最高赔付￥", 
                    TRAIN_INSURANCE: "旅行有保障，最高赔付￥",           
                },                   
                showChildDetail:false,   
                popInsurance:{},
                popAirLine:{},  
                popRspInsProduct:{},      
			}
		},
		created() {
			console.log("created");
		},
		mounted() {},
		methods: {
			/**
			 * 通过OrderType获取明细的名字
			 */
			openCloseDiv(item) {
				item.isClosed = !item.isClosed
				//需要强制刷新
				this.$forceUpdate();						
            },
            /**
             * 子保单的状态
             */
            getChildStatus(status){
                return utils.getInsuranceOrderStatus(status) ||"---" ;
            },
            /**
             * 保险的类型
             */
            getInsuranceTypeName(type){
                let restult;
                for (const key in this.insuranceTypeMap) {
                    if (key == parseInt(type)) {
                        restult = this.insuranceTypeMap[key];  
                        break;                      
                    }
                }
                return restult;
            },
            /**
             * 保险的类型
             */
            getInsuranceTypeDesc(insurance){
                let restult = this.insuranceTypeDesMap[1] + (insurance.insuranceAmount||"") + "元";
                for (const key in this.insuranceTypeDesMap) {
                    if (key == parseInt(insurance.productType)) {
                        restult = this.insuranceTypeDesMap[key] + (insurance.insuranceAmount||"") + "元";  
                        break;                      
                    }
                }
                return restult;
            },            
            /**
             * 证件的名字
             */
            // getCarType(type){
            //     return getCardTypeName(parseInt(type));
            // },
            // getCardNo(cardNo){
            //     return getFormatCardNo(cardNo+"");
            // },

            showChildDetailPop(child,airLine,rspInsProduct){
                this.popInsurance = JSON.parse(JSON.stringify(child));
                this.popAirLine = JSON.parse(JSON.stringify(airLine));
                this.popRspInsProduct = JSON.parse(JSON.stringify(rspInsProduct));

                this.showChildDetail = true;
            },
            closeChildDetailDia(){
                this.showChildDetail = false;
            },
            getFormatDesc(remark){
                if(remark){
                    var result= remark.replaceAll("\n","<br>");
                    result= remark.replaceAll("\r","<br>");
                    result= result.replaceAll(" ","&nbsp");
                    return result;
                }else{
                    return remark;
                }                
            },
            getFormatDeDate(time){
                if(!!time){
                    let result = new Date(time).format("MM月dd日 EE HH:mm")
                    var a = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");  
                    var week = new Date(time).getDay();  
                    var str = a[week];   
                    result = result.replaceAll("EE",str);
                    return result;
                }
                return time;
            },
            hasErrMsg(status){
                let result = false;
                if(!!status){
                    return parseInt(status) == 6 || parseInt(status) == 99;
                }
                return result;
            },
            getErrMsg(child){
                let result = "";
                if(!!child.status){
                    if(parseInt(child.status) == 6){
                        result = "退款将在1-7个工作日内原路退回"
                    }else if(parseInt(child.status) == 99){
                        result = child.errorMessage
                    }                   
                }
                return result;
            },
            amountIsNotZero(amount){
                return NP.round(amount, 0) != 0
            }
		},
	}
</script>

<style lang="less">
	.flightInsurance {
		background: white;
		margin-bottom: 40px;
		.title {
           font-size: 14px;
            color: #333333;
            padding: 20px 0px 0px 40px;
        }
        .detailBox{
            padding: 0px 40px;
            .detail{
                padding: 10px 0px;
                font-size: 14px;    
                .insurance-info{
                    margin-top: 20px;
                    display: flex;
                    align-items: baseline;
                    border-bottom: 1px dashed #7F7F7F;
                    padding-bottom: 20px;
                    >span{
                        margin-right: 20px;
                    }
                    .spanT {
                        margin-right: 40px;
                    }
                    .spanT2 {
                        margin-right: 10px;
                    }                    
                    .icon{
                        text-align: center;
                        cursor: pointer;
                        white-space: nowrap;
                        padding: 3px 3px;
                        color: #fff;
                        font-size: 12px;
                        background-color: #478aee;
                    }
                    .icon2{
                         background-color:#F39800;
                    }
                    .name{
                        font-weight: bold;
                        // font-size: 18px;
                    }
                    .orderNO{
                        margin-left: 40px;
                    }
                }        
                .insurance-child{
                    margin-top: 15px;
                    >div{
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0px;
                        >div{
                            margin-right: 30px;
                            display: flex;
                        }
                        .spanT {
                            margin-right: 40px;
                        }
                        .spanT2 {
                            margin-right: 10px;
                        } 
                        .errmsg{
                            max-width: 300px;
                            padding-left: 20px;
                            background-size: 18px;    
                            background: url(~assets//icon_mail_alert.png) no-repeat left;
                        }                          
                    }
                    .btn{
                        text-align: center;
                        cursor: pointer;
                        border-radius: 2px;
                        white-space: nowrap;
                        padding: 0px 20px;
                        height: fit-content;
                        color: #fff;
                        font-size: 14px;
                        background-color: #478aee;       
                    }
                }    
                .insurance-cpy{
                    color: #333333;
                    margin-bottom: 20px;
                }   
            }
        }
	}
    #childDetailDiabg {
      position: fixed;
      left: 0px;
      top: 0px;
      bottom: 0px;
      background-color: #000;
      width: 100%;
      /*宽度设置为100%，这样才能使隐藏背景层覆盖原页面*/
      height: 100%;
      filter: alpha(opacity=60);
      /*设置透明度为60%*/
      opacity: 0.6;
      /*非IE浏览器下设置透明度为60%*/
      z-Index: 200;
    }
    
    #childDetailDiabox {
    position: fixed;
    _position: absolute;
    margin: 0;
    width: 40%;
    height: -webkit-fit-content;
    height: fit-content;
    top: 10%;
    min-width: 500px;
    left: 30%;
    background-color: #fff;
    cursor: pointer;
    z-Index: 201;
    text-align: center;
    font-size: 14px;   
        .closeBtn{
            background: url(~assets//icon_close_simple.png) no-repeat right #fff;
            height: 20px;
        margin: 10px 10px 0 0;
        background-size: contain;
        }
        .boxhead{
            color: #191919;
            font-weight: bold;
            margin: 10px;
            font-size: 16px;
            text-align: center;
        }
        .content{
            padding: 0 40px;
            .textarea{
                color: #333333;
                margin: 0px 0px 10px 0px;
                text-align: left;
                >span{
                    margin-right: 20px;
                }
                span:first-child{
                    color: #7f7f7f;
                     margin-right: 0px;
                }
            }
            .descbox{
                border:1px solid #DDDDDD;
                height: 300px;
                border-radius: 2px;
                padding: 10px;
                overflow-y: scroll;
                text-align: left;
                .title{
                    font-size: 16px;
                    margin-bottom: 10px;
                }
            }
        }
        .pic-vercode{
            margin: 15px 40px;
            text-align: left;
            .tips{
                text-align: left;
            }
            input{
                border: 1px solid #e5e5e5;
                border-radius: 2px;
                height: 32px;
                line-height: 32px;
                padding-left: 10px;
                font-size: 14px;
                color: #333;
                width: 100%;
                margin: 5px 0px;
            }
            .vercode{
                display: flex;
                align-items: flex-end;
                u{
                    color:#478aee;
                    margin-left: 15px;
                }
                .pic-code{
                    width: 100px;
                    height: 32px; 
                    display: inline-block;
                }
            }
        }
        .boxbtn{
            margin: 30px 0px;
            display: flex;
            justify-content: space-evenly;
            .clickbtn{
                padding: 5px 40px;
                border: 1px solid #e2e2e2;
                border-radius: 2px;
                color: white;
            }
            .cancel{
                background: #7f7f7f;
            }
            .confirm{
                background: #478aee;
            }
        }
    }        
</style>