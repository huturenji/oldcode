// 引入mockjs
import Mock from "mockjs";

//获取mock.Random对象 Mock.Random 是一个工具类，用于生成各种随机数据。
const Random = Mock.Random;

// mock一组数据
const psgsData = function () {
  let articles = [];
  for (let i = 0; i < 100; i++) {
    let newArticleObject = {
      title: Random.csentence(5, 30), //  Random.csentence( min, max )
      thumbnail_pic_s: Random.dataImage('300x250', 'mock的图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      author_name: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
      date: Random.date() + ' ' + Random.time() // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    }
    articles.push(newArticleObject)
  }
  return {
    articles: articles
  }
}

// Mock.mock( url, post/get , 返回的数据)；
// Mock.mock('/news/index', 'post', psgsData);

//Mock.mock(/train\/query/, 'post', trainQueryData);
var hotelData ={
	"code": 0,
	"rdesc": null,
	"zip": 0,
	"base64": 0,
	"data": {
		"OrderPsgs": [
			{
				"PsgId": "BM8GiGNqEo5PxiGFfKa",
				"TuiOrderList": [
					{
						"SeatRefundDeduction": 12.63,
						"RefPsgName": "杜丽莎",
						"OpRemark": "取消",
						"RefTicketAmount": 144.87,
						"OrderNo": "LZsOjRvXDD0AvD8wLkh",
						"TuiOrderType": "1",
						"TicketFareAmount": 152.5,
						"InsuranseRefundDeduction": 0,
						"OpTime": "2018-12-27 15:49",
						"RefundNo": "TO181227150338078139T2839",
						"OrderStatus": 3,
						"RefPoundage": 7.63,
						"IsRef": true,
						"RefOutTrade": "",
						"RefDate": "2018-12-27 15:50",
						"InsuranseConsumptionAmount": 0.0,
						"SeatConsumptionAmount": 157.5
					}
				],
				"InsOrderNo": "",
				"TicketPurchasePrice": 152.5,
				"SaleServicePrice": 5.0,
				"UserUaId": 0,
				"TicketSalePrice": 152.5,
				"PurchaseServicePrice": 2.0,
				"OutTicketPoundage": 5.0,
				"PsgName": "杜丽莎",
				"CardNo": "54545455454",
				"PurchaseInsurancePrice": 0,
				"SaleInsurancePrice": 0.0,
				"IsuProductCode": "1,2",
				"SeatPrice": 152.5,
				"CardType": "港澳通行证",
				"Phone": "13647236610",
				"SeatType": "硬座",
				"TicketType": "成人票"
			}
		],
		"OrderInfo": {
			"OrderTime": "2018/12/27 15:02:47",
			"Policy": "购票说明1、我司接受二代身份证及护照、台胞证、港澳通行证预订，其他证件暂不支持。2、一张有效身份证件同一乘车日期同一车次限购一张车票。（儿童用成人的证件号情况除外）取票说明1、使用二代身份证预订的客户，可持预订时所使用的乘车人有效二代身份证到车站售票窗口、铁路客票代售点或车站自动售票机上办理取票手续，部分高铁站可持二代居民身份证直接检票进站，以各铁路站点实际情况为准。2、如预订时使用的乘车人二代身份证无法识别或使用护照预订的客户，请持预订时留下的有效证件原件及本公司给您发送的火车票订单号至火车站售票点，由售票员核实后办理换票手续。3、若您在预订成功后、换票前，不慎遗失有效身份证件，须由您本人到乘车站铁路公安制证口办理临时身份证明。4、纸质火车票作为唯一的报销凭证，如您需要报销，请提前至火车站换取纸质车票并妥善保管。如您未提前换票或纸质票遗失，我司概不提供火车票票款发票。退票及改签说明1、在线申请退票须同时满足以下条件：①服务时间：7:00—22:55；②发车时间外35分钟；③未取纸质票2、根据铁路局规定，开车前16天22点不收取退票费。开车前48小时以上，手续费5%；开车前24-48小时之间，手续费10%；开车前24小时内，手续费20%。最终退票手续费以铁路局实际收取为准。3、支持在线改签（热门线路除外），一张车票只能改签一次，且须同时满足以下条件：①服务时间：7:00—22:55；②发车时间外35分钟；③未取纸质票。开车前48小时（不含）以上，可改签预售期内的其他列车；开车前48小时以内，可改签至票面日期当日24:00之间的列车；不办理票面日期次日及以后的改签。开车前48小时-15天期间内，改签至距开车15天以上的其他列车，又在距开车15天前退票的，仍核收5%的退票费。铁路部门规定，对于改签后新车票价格低于原车票价格的，退还差额，并对差额部分收取改签手续费：新票距发车时间15天以上的，差额不收改签费；48小时-15天（含）的，收取差额5%的改签费；24-48小时（含）的，收取10%；不足24小时（含）的，收取20%。4、如发生网络技术故障等情形，造成我司临时性暂停在线退票、改签服务，您可以在发车前携带纸质车票及购票时使用的有效身份证件至火车站的退票窗口办理。",
			"EndTime": "2018-12-28 04:11:00 星期五",
			"TicketTime": "",
			"ScheduledPersonDepartMent": "开发3",
			"OrderNo": "LZsOjRvXDD0AvD8wLkh",
			"ProdId": 1,
			"ScheduledPersonPhone": "13647236610",
			"UaId": 4294967310,
			"StartDate": "2018/12/27",
			"ContactPhone": "13647236610",
			"ProviderShortName": "际珂国际",
			"CompanyName": "浪咩咩",
			"TaxAmount": 5.0,
			"Runtime": 623,
			"OrderStatus": "ALREADY_REFUND",
			"ScheduledPersonName": "杜丽莎",
			"ProviderPhone": "4000900966",
			"TrainStartTime": 1545904080000,
			"TrainNo": "Z3",
			"OrderAmount": 157.5,
			"IsuFareAmount": 0.0,
			"InvoiceContent": "现代服务*服务费",
			"StartStation": "北京西",
			"EndCity": "武汉",
			"PayStatus": 1,
			"IsHasRefundOrder": true,
			"CompanyId": 13,
			"PayAmount": 157.5,
			"UseType": 0,
			"StartTime": "2018-12-27 17:48:00 星期四",
			"InvoiceJpgUrl": "https://invtest.jss.com.cn/group1/M00/01/BF/wKjScVxQLz2AAfPKAAGLUh1x6a0445.jpg",
			"PayType": 3,
			"InvoicePdfUrl": "https://invtest.jss.com.cn/group1/M00/01/BF/wKjScVxQLz2AZ4zqAABr5X6nrNc212.pdf",
			"ProviderName": "上海际珂国际旅行社",
			"TotalFare": 152.5,
			"StartCity": "北京",
			"EndStation": "汉口",
			"TrainEndTime": 1545941460000,
			"PaymentPlatform": {
				"PaymentPlatformName": "老板付",
				"SubPaymentPlatforms": [
					{
						"ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
						"PaymentPlatformName": "钱包直接扣款",
						"IsDirectory": 0,
						"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs",
						"PaymentPlatformSwitch": 1,
						"PaymentPlatformType": 3
					}
				],
				"IsDirectory": 1,
				"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
				"PaymentPlatformSwitch": 1,
				"PaymentPlatformType": -1
			},
			"RemainPayTime": 0,
			"ChangeAndRefundStatus": "NONE",
			"ProviderType": 0,
			"ContactName": "杜丽莎",
			"OuterOrderNo": "TO181227150338078139",
			"SellerName": "深圳兆日国际旅行社有限责任公司"
		}
	}
}
Mock.mock(/travelmanagement\/operationservice.getTrainOrderDetail/, 'post', hotelData);
var voipData = {
  "code": 0,
  "data": {
    "TotalElements": 2,
    "AuthInfos": [{
        "Vendor": "agora",
        "AuthInfo": {
          "Id": 1986533,
          "AgoraAccount": "一个账户",
          "AuthType": 1,
          "AgoraAppId": "jkcdmdc444cd4d",
          "ProductId": "1",
          "CompanyId": "15522",
          "AgoraAppCert": ""
        }
      },
      {
        "Vendor": "agora",
        "AuthInfo": {
          "Id": 54151454,
          "AgoraAccount": "等你拿的",
          "AuthType": 2,
          "AgoraAppId": "jkcdmdc444cd4djkcdmdc444cd4d",
          "ProductId": "1",
          "CompanyId": "45555",
          "AgoraAppCert": "s1441s454sd44sd"
        }
      }
    ],
    "TotalPages": 1
  },
  "ecode": "0",
  "time": 1563414912
}
//Mock.mock(/getVoIPAuthInfo/, 'post', voipData);
// 设置4秒后再响应
//Mock.setup({ timeout: 4000 }); 
var refundFa = {
  "code": -1,
  "rdesc": "订单不存在",
  "zip": 0,
  "base64": 0,
  "data": null
};
var refundOk = {
  "code": 0,
  "data": {
    "ApplyState": "APPLY_SUCCESS",
  },
  "ecode": "0",
  "time": 1563414912
}
//Mock.mock(/applyRefund/, 'get', Random.integer(1, 10) >5 ?refundOk:refundFa);
Mock.mock(/getChangeNo/, 'get', {"timestamp":1572399709367,"status":500,"error":"Internal Server Error","exception":"com.sinosun.exception.DataException","message":"tGC may not be empty","path":"/v1/travel/orderManagement/getDataStatistics"});
var channelData = {
  "code": 0,
  "data": {
    "PaymentPlatforms": [{
        "PaymentPlatformName": "企业代付",
        "SubPaymentPlatforms": [{
            "ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
            "PaymentPlatformName": "钱包直接扣款",
            "IsDirectory": 0,
            "PaymentPlatformNo": "xq7iKtfEXawo7awPTvs",
            "PaymentPlatformSwitch": 0,
            "PaymentPlatformType": 3
          },
          {
            "PaymentPlatformName": "行内转账",
            "IsDirectory": 0,
            "PaymentPlatformNo": "4kSLi91ENMfG0aGzK6D",
            "PaymentPlatformSwitch": 1,
            "PaymentPlatformType": 8
          },
        ],
        "IsDirectory": 1,
        "PaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
        "PaymentPlatformSwitch": 0,
        "PaymentPlatformType": -1
      },
      {
        "ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
        "PaymentPlatformName": "银联支付",
        "IsDirectory": 0,
        "PaymentPlatformNo": "lVKY9QfwwYAKlWXGEeG",
        "PaymentPlatformSwitch": 0,
        "PaymentPlatformType": 7
      },
      {
        "ParentPaymentPlatformNo": "",
        "PaymentPlatformName": "信用卡支付",
        "IsDirectory": 0,
        "PaymentPlatformNo": "lVKY9QfwwYAKlWXGEeG2",
        "PaymentPlatformSwitch": 0,
        "PaymentPlatformType": 6
      },
      {
        "PaymentPlatformName": "微信支付",
        "IsDirectory": 0,
        "PaymentPlatformNo": "mP8tbbriHzATuJ8x9Zp",
        "PaymentPlatformSwitch": 1,
        "PaymentPlatformType": 1
      },
      {
        "PaymentPlatformName": "支付宝支付",
        "IsDirectory": 0,
        "PaymentPlatformNo": "QOdKrzZubGRwY72u2em",
        "PaymentPlatformSwitch": 1,
        "PaymentPlatformType": 2
      },
      {
        "PaymentPlatformName": "金贝支付",
        "IsDirectory": 0,
        "PaymentPlatformNo": "UOpAfMspaFqq7gexU8g",
        "PaymentPlatformSwitch": 0,
        "PaymentPlatformType": 4
      },
      {
        "PaymentPlatformName": "厦门国际银行支付",
        "IsDirectory": 0,
        "PaymentPlatformNo": "xq7iKtfEXawo7awPTvs2",
        "PaymentPlatformSwitch": 0,
        "PaymentPlatformType": 5
      }
    ]
  },
  "ecode": "0",
  "time": 1564978010
}
Mock.mock(/operationservice.getPaymentPlatforms/, 'post', channelData);
var upload = {
  "retcode": 0,
  "path": "http://sss.ssss",
  "ecode": "0",
  "time": 1563414912
}
//Mock.mock(/fileserver\/upload/, 'post', upload);
var flight = {
  "code": 0,
  "data": {
    "AirLines": [{
      "Sale": 490.0,
      "ArriveTime": "08:15",
      "EAirportName": "天河机场",
      "ETerminal": "T3",
      "Discount": "34",
      "SCityName": "西安",
      "BeginTime": "06:40",
      "CabinName": "经济舱",
      "SAirportName": "咸阳机场",
      "Tax": 50.0,
      "AfterTwoHoursRechangeFee": 0.0,
      "FlightNo": "MU2125",
      "STerminal": "T3",
      "SpecificVoyage": 0,
      "IsShare": false,
      "Cabin": "V",
      "ECityCode": "WUH",
      "ArriveDate": "2019/09/16",
      "StopItems": [{}],
      "PlaneType": "空客320(其他机型)",
      "AirLineCode": "DRRR",
      "AfterTwoHoursRefundFee": 0.0,
      "SAirportCode": "XIY",
      "SCityCode": "SIA",
      "StopNum": "0",
      "ShortPlaneType": "其他",
      "BeforeTwoHoursRechangeFee": 0.0,
      "CabinRank": 3,
      "Duration": "1小时35分钟",
      "BeginDate": "2019/09/16",
      "Fare": 490.0,
      "BeforeTwoHoursRefundFee": 0.0,
      "AirLineName": "东方航空",
      "Oil": 0.0,
      "AirLineID": "3liXGOuRlhcCjKP2l05",
      "ECityName": "武汉",
      "OnTimeRate": "",
      "Passengers": [{
        "Status": "0",
        "PsgID": "dMn7RUvqfPIjPoq9gOp",
        "IsHasBaby": false,
        "CompanyId": "",
        "BirthDay": "1995-03-21 00:00:00",
        "GaiNos": [],
        "Mobile": "17520067047",
        "PsgName": "赵明林",
        "CardNo": "410323199503210535",
        "CompanyName": "",
        "TuiNos": [],
        "TicketNumber": "",
        "CardType": 0,
        "PsgType": "1"
      }],
      "IsDirectSale": true,
      "IsHasMeal": true,
      "EAirportCode": "WUH"
    }],
    "InvoiceInfo": {},
    "ExpressFlag": 0,
    "OrderBase": {
      "OrderTime": "2019-08-15 13:47:26",
      "OrderNo": "F49409698910633984",
      "ExtraMoneyAmount": 0.0,
      "IsOutTicket": false,
      "ProdId": "1",
      "ScheduledPersonId": "4294968849",
      "CompanyName": "开发环境兆日科技",
      "ProviderShortName": "八千翼",
      "CouponReduceAmount": 0.0,
      "OrderStatus": "ALREADY_OUT_TICKET",
      "ScheduledPersonName": "赵明林",
      "ProviderPhone": "028-65500000",
      "IsHasIns": false,
      "Pnr": "",
      "RealPayAmount": 0,
      "TotalTax": 50.0,
      "FlightType": 0,
      "ContactMobile": "17555556666",
      "RetailerShortName": "兆日国际旅行",
      "PayStatus": 1,
      "RetailerName": "深圳兆日国际旅行社有限责任公司",
      "CompanyId": "230",
      "Amount": 555.0,
      "UseType": 0,
      "TicketFareAmount": 540.0,
      "PayType": 3,
      "ScheduledPersonMobile": "17520067047",
      "ProviderName": "四川神兽国际旅行社有限公司",
      "TotalFare": 490.0,
      "IsHasTui": false,
      "IsHasGai": false,
      "ExpressFareAmount": 15.0,
      "IsExceptionOrder": false,
      "PaymentPlatform": {
        "PaymentPlatformName": "兆日老板付",
        "SubPaymentPlatforms": [{
            "ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
            "PaymentPlatformName": "行内转账",
            "IsDirectory": 0,
            "PaymentPlatformNo": "4kSLi91ENMfG0aGzK6D",
            "PaymentPlatformSwitch": 1,
            "PaymentPlatformType": 8
          },
          {
            "ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
            "PaymentPlatformName": "钱包直接扣款",
            "IsDirectory": 0,
            "PaymentPlatformNo": "xq7iKtfEXawo7awPTvs",
            "PaymentPlatformSwitch": 1,
            "PaymentPlatformType": 3
          }
        ],
        "IsDirectory": 1,
        "PaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
        "PaymentPlatformSwitch": 1,
        "PaymentPlatformType": -1
      },
      "RemainPayTime": 0,
      "RetailerPhone": "0755-83415666-1142",
      "DepartmentName": "研发部",
      "PayTime": "2019-08-15 13:47:38",
      "ContactName": "赵明林",
      "OuterOrderNo": "911908151347418754",
      "InsFareAmount": 0.0,
      "TotalOil": 0.0
    },
    "ExpressInfo": {
      "ExpressStatusAndTime": []
    }
  },
  "ecode": "0",
  "time": 1565946407
}
//Mock.mock(/operationservice.getFlightOrderDetail/, 'post', flight);
var AlarmInfo = {
  "code": 0,
  "data": {
    "TotalPage": 20,
    "TotalNumber": 300,
    "Data": [{
        "AlarmInfoId": "222",
        "ReportService": "PROVIDER_ALM",
        "AlarmService": "神兽",
        "AlarmType": "商旅订单号生成服务商旅订单号生成服务",
        "AlarmCount": 14,
        "AlarmLevel": 1,
        "AlarmStatus": 1,
        "AlarmStartTime": "2019-08-13 10:30:36",
        "AlarmEndTime": "2019-08-13 10:30:36",
        "Handler": "222",
        "AlarmHandleTime": "2019-08-13 10:30:36",
      },
      {
        "AlarmInfoId": "222",
        "ReportService": "PROVIDER_ALM",
        "AlarmService": "神兽",
        "AlarmType": "222",
        "AlarmCount": 14,
        "AlarmLevel": 1,
        "AlarmStatus": 2,
        "AlarmStartTime": "2019-08-13 10:30:36",
        "AlarmEndTime": "2019-08-13 10:30:36",
        "Handler": "商旅订单号生成服务商旅订单号生成服务",
        "AlarmHandleTime": "2019-08-13 10:30:36",
      },
    ],
  },
  "ecode": "0",
  "time": 1563414912
}
Mock.mock(/alarm\/queryAlarmInfo/, 'post', {"base64":0,"code":46000004,"data":"","zip":0});
var AlarmInfoDetail = {
  "code": 0,
  "data": {
    "AlarmDetailList": [{
        "Id": "222",
        "Detail": "商旅订单号生成服务商旅订单号生成服务商旅订单号生成服务商旅订单号生成服务商旅订单号生成服务商旅订单号生成服务商旅订单号生成服务商旅订单号生成服务",
        "HappenTime": "2019-08-13 10:30:36",
      },
      {
        "Id": "222",
        "Detail": "商旅订单号生成服务商旅订单号生成服务",
        "HappenTime": "2019-08-13 10:30:36",
      },
    ],
  },
  "ecode": "0",
  "time": 1563414912
}
Mock.mock(/alarm\/queryAlarmDetail/, 'post', AlarmInfoDetail);
var AlarmInfoRes = {
  "code": 0,
  "data": {
    "HandleStatus": false,
  },
  "ecode": "0",
  "time": 1563414912
}
Mock.mock(/alarm\/processAlarmInfo/, 'post', AlarmInfoRes);

var recodeData = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    "OperationRecords": [{
        "OperationDate": "2018-10-26   08:32:10",
        "OperationDesc": "报销凭证已开出"
      },
      {
        "OperationDate": "2018-10-07   18:50:14",
        "OperationDesc": "商旅通推送【订单-吴彦祖退票成功】"
      },
      {
        "OperationDate": "2018-10-07   18:40:50",
        "OperationDesc": "商旅通推送【订单-吴彦祖退票失败】"
      },
      {
        "OperationDate": "2018-10-07   14:59:59",
        "OperationDesc": "商旅通推送【订单-机票改签成功】"
      },
      {
        "OperationDate": "2018-10-07   14:59:32",
        "OperationDesc": "乘客【吴彦祖】改签成功"
      },
      {
        "OperationDate": "2018-10-07   14:45:32",
        "OperationDesc": "乘客【吴彦祖】改签失败，原因：改签车次余票不足，占座失败"
      },
      {
        "OperationDate": "2018-10-06   15:30:42 ",
        "OperationDesc": "商旅通推送【订单-机票出票成功】"
      },
      {
        "OperationDate": "2018-10-06   15:30:16",
        "OperationDesc": "【神兽】出票成功"
      },
    ]
  }
}
// Mock.mock(/operationservice.getOperationRecords/, 'post', recodeData);



var detailData = {
  base64: 0,
  code: 507,
  rdesc: "请求参数错误",
  zip: 0
}

// Mock.mock(/operationservice.getTrainOrderDetail/, 'post', detailData);


//分页获取告警规则
var putNotifyRule = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    "TotalPage": 1,
    "TotalNumber": 2,
    "Data": [{
        "Email": "zhuangpan@wistronits.com",
        "ReportService": "VerInvoice",
        "Phone": "15527810225",
        "NotifyCount": 30,
        "NotifyInterval": 10,
        "NotifyModes": [
          1,
          3
        ],
        "NotifyRuleId": "DVFrDKhvf94erLJYeEI",
        "Wnc": "9999",
        "Name": "panzhuang"
      },
      {
        "Email": "zhuangpan@wistronits.com",
        "ReportService": "VerInvoice",
        "Phone": "15527810225",
        "NotifyCount": 30,
        "NotifyInterval": 10,
        "NotifyModes": [
          1,
          3
        ],
        "NotifyRuleId": "DVFrDKhvf94erLJYeEI",
        "Wnc": "9999",
        "Name": "panzhuang"
      },
      {
        "Email": "zhuangpan@wistronits.com",
        "ReportService": "VerInvoice",
        "Phone": "15527810225",
        "NotifyCount": 30,
        "NotifyInterval": 10,
        "NotifyModes": [
          1,
          3
        ],
        "NotifyRuleId": "DVFrDKhvf94erLJYeEI",
        "Wnc": "9999",
        "Name": "panzhuang"
      },
      {
        "Email": "ping.ren@sinosun.com.cn",
        "ReportService": "Hotel",
        "Phone": "15771765171",
        "NotifyCount": 4,
        "NotifyInterval": 1440,
        "NotifyModes": [
          1,
          3
        ],
        "NotifyRuleId": "plnPyiQqFn3qzRyyfIr",
        "Wnc": "0621",
        "Name": "renping"
      }
    ]
  }
}
Mock.mock(/alarm\/queryNotifyRule/, 'post', putNotifyRule);

//查询服务上报服务
var queryService = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    "ServiceInstances": [{
        "Metadata": {
          "Name": "酒店业务服务"
        },
        "ServiceId": "Hotel"
      },
      {
        "Metadata": {
          "Name": "发票核验服务"
        },
        "ServiceId": "VerInvoice"
      }
    ]
  }
}
Mock.mock(/alarm\/queryServiceInstance/, 'post', queryService);

//新增通知规则
var notifyRule = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    "Email": "zhuangpan@wistronits.com",
    "ReportService": "VerInvoice",
    "Phone": "15527810225",
    "NotifyCount": 30,
    "NotifyInterval": 10,
    "NotifyModes": [
      1,
      3
    ],
    "NotifyRuleId": "DVFrDKhvf94erLJYeEI",
    "Wnc": "9999",
    "Name": "panzhuang"
  }
}
Mock.mock(/alarm\/putNotifyRule/, 'post', notifyRule);

//修改通知规则
var editRule = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    "Email": "zhuangpan@wistronits.com",
    "ReportService": "VerInvoice",
    "Phone": "15527810225",
    "NotifyCount": 30,
    "NotifyInterval": 60,
    "NotifyModes": [
      1,
      3
    ],
    "NotifyRuleId": "DVFrDKhvf94erLJYeEI",
    "Wnc": "9999",
    "Name": "panzhuang"
  }
}
Mock.mock(/alarm\/updateNotifyRule/, 'post', editRule);

//删除告警规则
var delRule = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    "HandleStatus": true
  }
}
Mock.mock(/alarm\/deleteNotifyRule/, 'post', delRule);
//邮寄报销凭证获取收件人地址
var receiverAddress = {
  "code": 0,
  "ecode": "0",
  "time": 1563414912,
  "data": {
    ReceiverInfo: {
      Address: "智慧",
      Area: "湖北省/武汉市/洪山区",
      Name: "jfk ldj",
      Phone: "13260693509",
    },
    SenderInfo: {
      Address: "车公庙泰然八路泰然大厦C座1605",
      Area: "广东省/深圳市/福田区",
      Name: "深圳兆日国际旅行社有限责任公司",
      Phone: "0755-83415666",
    }
  }
}
//Mock.mock(/operationservice.getSenderAndReceiverInfo/, 'post', receiverAddress);

//获取邮寄报销凭证订单列表
var orders ={"result":{"flightOrders":[			
  {
    "exceptionOrderId": "ewww232",
    "bpProductExceptionProcessedStatus": 1,
    "customeServiceStatff": "haolaiwude0011dee3",
    "orderTime": "2019/11/19 17:01",
    "arriveTime": "2019/11/19 23:30",
    "eAirportName": "首都机场",
    "departCityName": "武汉",
    "sAirportName": "天河机场",
    "orderNo": "f120758253977518080",
    "expressFlag": 0,
    "prodId": "6914",
    "flightNo": "cA8215",
    "scheduledPersonPhone": "18163526539",
    "expressInfo": {},
    "uaId": 4294972362,
    "companyName": "无锡农商黑盒测试",
    "orderStatus": "aLREADY_OUT_TICKET",
    "scheduledPersonName": "张斌",
    "providerPhone": "13201701990",
    "departTime": "2019/11/19 19:15",
    "isHasIns": false,
    "contactMobile": "18163526539",
    "cabinType": 3,
    "payStatus": 1,
    "arriveCityName": "北京",
    "companyId": 2017107050,
    "payAmount": 450.0,
    "useType": 0,
    "payType": 8,
    "airLineName": "中国国航",
    "isHasTui": false,
    "isHasGai": false,
    "passengers": "张斌",
    "paymentPlatform": {
      "paymentPlatformName": "老板付",
      "subPaymentPlatforms": [
        {
          "parentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
          "paymentPlatformName": "行内转账",
          "isDirectory": 0,
          "paymentPlatformNo": "4kSLi91ENMfG0aGzK6D",
          "paymentPlatformSwitch": 1,
          "paymentPlatformType": 8
        }
      ],
      "isDirectory": 1,
      "paymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
      "paymentPlatformSwitch": 1,
      "paymentPlatformType": -1
    },
    "providerType": 5,
    "outerOrderNo": "VF120758692064182272"
  }
],"hotelOrders":null,"trainOrders":null,"insuranceOrders":null,"totalRecord":0,"totalPageCount":0},"resultMessage":"执行成功","resultCode":0}
Mock.mock(/getBpOrderForPlatforms/, 'post', orders);
var orderFlighht = {
	"base64": 0,
	"code": 0,
	"data": {
		"AirLines": [
			{
				"Sale": 0.0,
				"ArriveTime": "09:15",
				"EAirportName": "虹桥机场",
				"ETerminal": "T2",
				"Discount": "73",
				"SCityName": "北京",
				"BeginTime": "07:00",
				"CabinName": "经济舱",
				"SAirportName": "首都机场",
				"Tax": 50.0,
				"AfterTwoHoursRechangeFee": 0.0,
				"FlightNo": "HO3883",
				"ShareAirlineName": "东方航空",
				"STerminal": "T2",
				"ShareFlightNo": "MU5138",
				"SpecificVoyage": 0,
				"IsShare": true,
				"Cabin": "Q",
				"ECityCode": "SHA",
                "ArriveDate": "2019/11/20",
				"StopItems": [
                    {"StopCityName":"上海"},
                    {"StopCityName":"北京"}
				],
				"PlaneType": "空客33L(其他机型)",
				"AirLineCode": "HO",
				"AfterTwoHoursRefundFee": 0.0,
				"SAirportCode": "PEK",
				"SCityCode": "BJS",
				"StopNum": "2",
				"ShortPlaneType": "其他",
				"BeforeTwoHoursRechangeFee": 0.0,
				"CabinRank": 3,
				"Duration": "2小时15分钟",
				"BeginDate": "2019/11/20",
				"Fare": 1090.0,
				"BeforeTwoHoursRefundFee": 0.0,
				"AirLineName": "吉祥航空",
				"Oil": 0.0,
				"AirLineID": "aGpHj0hvMEAPkoY4AsI",
				"ECityName": "上海",
				"OnTimeRate": "",
				"Passengers": [
					{
						"Status": "0",
						"PsgID": "hCV1pe5FtF0sYYtob4c",
						"IsHasBaby": false,
						"CompanyId": "",
						"BirthDay": "1994-11-19 00:00:00",
						"GaiNos": [],
						"Mobile": "15923444444",
						"PsgName": "潘帅",
						"CardNo": "34444",
						"CompanyName": "",
						"TuiNos": [],
						"CardType": 4,
						"PsgType": "1"
					}
				],
				"IsDirectSale": false,
				"IsHasMeal": true,
				"EAirportCode": "SHA"
			}
		]
	},
	"zip": 0
}
Mock.setup({ timeout: 4000 }); 
var proviInfo={"result":{providerInfos: [
  {
      providerName: "365",
      providerUrl: "",
      providerType: 0
  },
  {
      providerName: "神兽",
      providerUrl: "http://ht.c2b168.com/ ",
      providerType: 1
  }
]},"resultMessage":"执行成功","resultCode":0};
Mock.mock(/getBpProductProviderInfo/, 'post', proviInfo);
Mock.mock(/order\/getBpProduct/, 'post', orderFlighht);

var orderReceiver = {
    "code": 0,
    "data": {
      "TotalPageCount": 9,
      "OrderNoAndReceiverInfos": [
        {
          "Area": "北京市/东城区/东湖区",
          "Address": "噜噜噜",
          "Phone": "15594958797",
          "OrderNo": "F64980690525372416",
          "Name": "胡亚倬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "黑龙江省/哈尔滨市/道里区",
          "Address": "的方式东风风神",
          "Phone": "12345678954",
          "OrderNo": "F62824823101210624",
          "Name": "发斯蒂芬斯蒂芬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "黑龙江省/哈尔滨市/道里区",
          "Address": "的方式东风风神",
          "Phone": "12345678954",
          "OrderNo": "F62693491591233536",
          "Name": "发斯蒂芬斯蒂芬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "北京市/东城区/东湖区",
          "Address": "噜噜噜",
          "Phone": "15594958797",
          "OrderNo": "F62673373964419072",
          "Name": "胡亚倬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "黑龙江省/哈尔滨市/道里区",
          "Address": "的方式东风风神",
          "Phone": "12345678954",
          "OrderNo": "F62667644478046208",
          "Name": "发斯蒂芬斯蒂芬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "北京市/朝阳区",
          "Address": "嗯摸摸",
          "Phone": "18710890988",
          "OrderNo": "F49306336227606528",
          "Name": "薛羽",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "黑龙江省/哈尔滨市/道里区",
          "Address": "的方式东风风神",
          "Phone": "12345678954",
          "OrderNo": "F42795956080820224",
          "Name": "发斯蒂芬斯蒂芬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "黑龙江省/哈尔滨市/道里区",
          "Address": "的方式东风风神",
          "Phone": "12345678954",
          "OrderNo": "F42795329015595008",
          "Name": "发斯蒂芬斯蒂芬",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "福建省/福州市",
          "Address": "哈哈",
          "Phone": "15963256326",
          "OrderNo": "jOBwrEOFVtzxhLVRaNE",
          "Name": "是你",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        },
        {
          "Area": "福建省/福州市",
          "Address": "哈哈",
          "Phone": "15963256326",
          "OrderNo": "AYJUxRqlakBEbCB8R3t",
          "Name": "是你",
          "ProdId": "1",
          "CpyId": "2",
          "UaId": "2013",
          
        }
      ],
      "TotalRecord": 83
    },
    "ecode": "0",
    "time": 1568083156
  }
//Mock.mock(/operationservice.getOrderNoAndReceiverInfos/, 'post', orderReceiver);
var CityData = {
	"base64": 0,
	"code": 0,
	"data": {
		"PayAmountOfCity": {
			"上海": 192777.0,
			"武汉": 42734.5,
			"重庆": 26490.0,
			"北京": 20897.0,
			"西安": 19061.02,
			"咸阳": 8018.0,
			"广州": 7468.0,
			"延安": 4733.0,
			"南京": 3930.0,
			"渭南": 3046.28,
			"成都": 1468.0,
			"厦门": 1000.0,
			"银川": 590.0,
			"中卫": 580.0,
			"蔡家坡": 563.5,
			"岐山": 498.0,
			"咸宁": 400.0,
			"宝鸡": 226.0,
			"长沙": 206.0,
			"襄阳": 176.0,
			"韶关": 163.0,
			"安康": 91.0,
			"苏州": 60.0,
			"杨凌": 39.0,
			"杭州": 32.0
		}
	},
	"zip": 0
}
//Mock.mock(/operationservice.getPayAmountOfCity/, 'post', CityData);
var Channels = {
	"code": 0,
	"data": {
		"TotalElements": 12,
		"ProductionChannels": [
			{
				"PaymentPlatforms": [],
				"ProductionChannelNo": "ohP7bV28E2CXYhGb4qC",
				"ProductionChannelPath": "https://bpdev.sinosun.com:18195/bp/tcm/pages/welcomesys.jsp",
				"ProductionSecretKey": "268435518",
				"ProductionAppId": "268435518",
				"ProductionChannelId": 3333,
				"ProductionMsgPushPath": "https://bpdev.sinosun.com:18195/bp/tcm/pages/welcomesys.jsp",
				"ProductionChannelName": "dd",
				"SYS_UTIME": "2019-09-24 10:29:48"
			},
			{
				"PaymentPlatforms": [
					{
						"PaymentPlatformName": "djytest",
						"SubPaymentPlatforms": [
							{
								"ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
								"PaymentPlatformName": "行内转账",
								"IsDirectory": 0,
								"PaymentPlatformNo": "4kSLi91ENMfG0aGzK6D",
								"PaymentPlatformSwitch": 0,
								"PaymentPlatformType": 8
							},
							{
								"ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
								"PaymentPlatformName": "钱包直接扣款",
								"IsDirectory": 0,
								"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs",
								"PaymentPlatformSwitch": 1,
								"PaymentPlatformType": 3
							}
						],
						"IsDirectory": 1,
						"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
						"PaymentPlatformSwitch": 1,
						"PaymentPlatformType": -1
					},
					{
						"PaymentPlatformName": "银联支付",
						"IsDirectory": 0,
						"PaymentPlatformNo": "lVKY9QfwwYAKlWXGEeG",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 7
					},
					{
						"ParentPaymentPlatformNo": "",
						"PaymentPlatformName": "信用卡支付",
						"IsDirectory": 0,
						"PaymentPlatformNo": "lVKY9QfwwYAKlWXGEeG2",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 6
					},
					{
						"PaymentPlatformName": "微信支付",
						"IsDirectory": 0,
						"PaymentPlatformNo": "mP8tbbriHzATuJ8x9Zp",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 1
					},
					{
						"PaymentPlatformName": "支付宝支付",
						"IsDirectory": 0,
						"PaymentPlatformNo": "QOdKrzZubGRwY72u2em",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 2
					},
					{
						"PaymentPlatformName": "金贝支付",
						"IsDirectory": 0,
						"PaymentPlatformNo": "UOpAfMspaFqq7gexU8g",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 4
					},
					{
						"PaymentPlatformName": "厦门国际银行支付",
						"IsDirectory": 0,
						"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs2",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 5
					}
				],
				"AuthorizationAgreement": {
					"AuthorizationAgreementAbstract": [
						"用户账户信息（通过厦行e企管授权登录到商旅",
						"用户联系方式（如姓名、通讯地址、手机号码等）"
					],
					"AuthorizationAgreement": "厦门国际银行支付厦门国际银行支付厦门国际银行支付厦门国际银行支付"
				},
				"ProductionChannelNo": "scAVdGrC0nMhR585Qzq",
				"ProductionChannelPath": "11",
				"ProductionSecretKey": "268435518",
				"ProductionAppId": "268435518",
				"ProductionChannelId": 111,
				"ProductionApprovalPath": "wwwwwwwwwwwwww",
				"ProductionMsgPushPath": "11",
				"PaymentPlatformTypesIcon": "{\"xq7iKtfEXawo7awPTvs3\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAZCAYAAAAiwE4nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJUSURBVEhL7VW7bhNREOUzsnfteF0EKRHkUYGggAIKSD4DBOnTQR3gJ6JAkcpev+J4lQiQQhWUh5t0sZAdHkKCFKCVIsXew5y7u8hrnGsLWYgixxppNHNmjue+9hL+MS4ER47/U7ATdCIvxFlwBr/ta6PfjV5uLwYKBvKLUftSw1J9CXdf38Hcxqw2+owxF6O7phdGwfjf7n3bw8L2PFTFgqqKlcVKkdFnTHLkkEucN+nACd993cbljQnd0CqOwa4pKNeCnVfatC8x5sghlzXnwSj4yf+Imeo0rNIY0uUUFt7O48Xhc0xVpqAKMpUYfcaYI4dc1rC2H4yCT+tPYFcVMu64Xjbvs6fji+8XdZxGn2COHHIZZ20/GAWve9dglxTSbgp2WeH+m3t4drgsU012TTipY8yRk3ZtXcPafjAKZgsOVF4axyZ7ZG/KvlEsjomvYzxQXdxs0Ym6JGEUnKvOhg1daShNUvLvx910ojGNMeboa67UzKxPR12SMApyf7gvqXzYbBjTXKl5vPMo6pKEUbB+coBsyYFdlAMSTWnl5fj3iMQxTpkq2XDKGRyc7EddkjAKEquN1fBEFsJ7p+9ejyBjeqm5/J7CSmMlqv4TRsH4tXjVeAmnkgknKYqIXPbfgvTlxbE9C1e9K1j7sKZrOp2/eGmCQF5FsabfhFqXV6Q8gZubN+AURDwXLiOX/PbWLSzL1Wj+bOo60wM+1IS5Vg4Pdx7g6McRTjunaPkt7H7fxb7s07F/nPhimMSIgXtIUGQQ2kHb+JWIMZTgKHEhOGIAvwDfD5NC0h3l1AAAAABJRU5ErkJggg==\"}",
				"ProductionChannelName": "djytest111",
				"ProductionChannelAlias": "{\"xq7iKtfEXawo7awPTvs3\":\"djytest\"}",
				"SYS_UTIME": "2019-09-24 09:49:53"
			}
		],
		"TotalPages": 1
	},
	"ecode": "0",
	"time": 1569304457
}
Mock.mock(/operationservice.getProductionChannels/, 'post', Channels);
var  ChannelById ={
	"code": 0,
	"data": {
		"PaymentPlatforms": [
			{
				"PaymentPlatformName": "djytest",
				"SubPaymentPlatforms": [
					{
						"ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
						"PaymentPlatformName": "行内转账",
						"IsDirectory": 0,
						"PaymentPlatformNo": "4kSLi91ENMfG0aGzK6D",
						"PaymentPlatformSwitch": 0,
						"PaymentPlatformType": 8
					},
					{
						"ParentPaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
						"PaymentPlatformName": "钱包直接扣款",
						"IsDirectory": 0,
						"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs",
						"PaymentPlatformSwitch": 1,
						"PaymentPlatformType": 3
					}
				],
				"IsDirectory": 1,
				"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs3",
				"PaymentPlatformSwitch": 1,
				"PaymentPlatformType": -1
			},
			{
				"PaymentPlatformName": "银联支付",
				"IsDirectory": 0,
				"PaymentPlatformNo": "lVKY9QfwwYAKlWXGEeG",
				"PaymentPlatformSwitch": 0,
				"PaymentPlatformType": 7
			},
			{
				"ParentPaymentPlatformNo": "",
				"PaymentPlatformName": "信用卡支付",
				"IsDirectory": 0,
				"PaymentPlatformNo": "lVKY9QfwwYAKlWXGEeG2",
				"PaymentPlatformSwitch": 0,
				"PaymentPlatformType": 6
			},
			{
				"PaymentPlatformName": "微信支付",
				"IsDirectory": 0,
				"PaymentPlatformNo": "mP8tbbriHzATuJ8x9Zp",
				"PaymentPlatformSwitch": 0,
				"PaymentPlatformType": 1
			},
			{
				"PaymentPlatformName": "支付宝支付",
				"IsDirectory": 0,
				"PaymentPlatformNo": "QOdKrzZubGRwY72u2em",
				"PaymentPlatformSwitch": 0,
				"PaymentPlatformType": 2
			},
			{
				"PaymentPlatformName": "金贝支付",
				"IsDirectory": 0,
				"PaymentPlatformNo": "UOpAfMspaFqq7gexU8g",
				"PaymentPlatformSwitch": 0,
				"PaymentPlatformType": 4
			},
			{
				"PaymentPlatformName": "厦门国际银行支付",
				"IsDirectory": 0,
				"PaymentPlatformNo": "xq7iKtfEXawo7awPTvs2",
				"PaymentPlatformSwitch": 0,
				"PaymentPlatformType": 5
			}
		],
		"AuthorizationAgreement": {
			"AuthorizationAgreementAbstract": [			
                "用户联系方式（如姓名、通讯地址、手机号码等）",
                "用户联系方式（如姓名、通讯地址、手机号码等ssss）"
			],
			"AuthorizationAgreement": "厦门国际银行支付厦门国际银行支付厦门国际银行支付厦门国际银行支付"
		},
		"ProductionChannelNo": "scAVdGrC0nMhR585Qzq",
		"ProductionChannelPath": "11",
		"ProductionSecretKey": "268435518",
		"ProductionAppId": "268435518",
		"ProductionChannelId": 111,
		"ProductionApprovalPath": "",
		"ProductionMsgPushPath": "11",
		"PaymentPlatformTypesIcon": "{\"xq7iKtfEXawo7awPTvs3\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAZCAYAAAAiwE4nAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJUSURBVEhL7VW7bhNREOUzsnfteF0EKRHkUYGggAIKSD4DBOnTQR3gJ6JAkcpev+J4lQiQQhWUh5t0sZAdHkKCFKCVIsXew5y7u8hrnGsLWYgixxppNHNmjue+9hL+MS4ER47/U7ATdCIvxFlwBr/ta6PfjV5uLwYKBvKLUftSw1J9CXdf38Hcxqw2+owxF6O7phdGwfjf7n3bw8L2PFTFgqqKlcVKkdFnTHLkkEucN+nACd993cbljQnd0CqOwa4pKNeCnVfatC8x5sghlzXnwSj4yf+Imeo0rNIY0uUUFt7O48Xhc0xVpqAKMpUYfcaYI4dc1rC2H4yCT+tPYFcVMu64Xjbvs6fji+8XdZxGn2COHHIZZ20/GAWve9dglxTSbgp2WeH+m3t4drgsU012TTipY8yRk3ZtXcPafjAKZgsOVF4axyZ7ZG/KvlEsjomvYzxQXdxs0Ym6JGEUnKvOhg1daShNUvLvx910ojGNMeboa67UzKxPR12SMApyf7gvqXzYbBjTXKl5vPMo6pKEUbB+coBsyYFdlAMSTWnl5fj3iMQxTpkq2XDKGRyc7EddkjAKEquN1fBEFsJ7p+9ejyBjeqm5/J7CSmMlqv4TRsH4tXjVeAmnkgknKYqIXPbfgvTlxbE9C1e9K1j7sKZrOp2/eGmCQF5FsabfhFqXV6Q8gZubN+AURDwXLiOX/PbWLSzL1Wj+bOo60wM+1IS5Vg4Pdx7g6McRTjunaPkt7H7fxb7s07F/nPhimMSIgXtIUGQQ2kHb+JWIMZTgKHEhOGIAvwDfD5NC0h3l1AAAAABJRU5ErkJggg==\"}",
		"ProductionChannelName": "djytest111",
		"ProductionChannelAlias": "{\"xq7iKtfEXawo7awPTvs3\":\"djytest\"}",
		"SYS_UTIME": "2019-09-24 09:49:53"
	},
	"ecode": "0",
	"time": 1569304457
}
Mock.mock(/operationservice.getProductionChannelById/, 'post', ChannelById);
//var switchP={"code":0,"rdesc":null,"zip":0,"base64":0,"data":{"GrayRuleId":"F2","Enabled":false}}
//Mock.setup({ timeout: 4000 }); 
//Mock.mock(/switchProviderGrayRule/, 'post', switchP);
var rangeData = {"code":0,"rdesc":null,"zip":0,"base64":0,"data":{"PayAmountOfDateRange":{"2019-06":{"PayDate":"2019-06","TotalOrderNum":140,"RefundAmount":7363.0500,"TotalAmount":17804.5500},"2019-05":{"PayDate":"2019-05","TotalOrderNum":177,"RefundAmount":9861.8500,"TotalAmount":47547.3500},"2019-08":{"PayDate":"2019-08","TotalOrderNum":281,"RefundAmount":33550.1100,"TotalAmount":76789.1100},"2019-07":{"PayDate":"2019-07","TotalOrderNum":175,"RefundAmount":11212.8700,"TotalAmount":31571.8700},"2018-11":{"PayDate":"2018-11","TotalOrderNum":61,"RefundAmount":0.0000,"TotalAmount":62774.5000},"2019-02":{"PayDate":"2019-02","TotalOrderNum":36,"RefundAmount":1664.0000,"TotalAmount":6805.5000},"2018-12":{"PayDate":"2018-12","TotalOrderNum":112,"RefundAmount":0.0000,"TotalAmount":221832.0000},"2019-01":{"PayDate":"2019-01","TotalOrderNum":63,"RefundAmount":1215.0000,"TotalAmount":26349.0000},"2019-04":{"PayDate":"2019-04","TotalOrderNum":168,"RefundAmount":7908.5400,"TotalAmount":73089.9100},"2019-03":{"PayDate":"2019-03","TotalOrderNum":72,"RefundAmount":2342.1400,"TotalAmount":42816.5000},"2019-10":{"PayDate":"2019-10","TotalOrderNum":136,"RefundAmount":7576.9700,"TotalAmount":60408.6300},"2019-09":{"PayDate":"2019-09","TotalOrderNum":282,"RefundAmount":9696.2600,"TotalAmount":46877.2600}}}}
Mock.mock(/getPayAmountStatisticByDateRange/, 'post', rangeData);

var getBusinessType ={
	"code": 0,
	"rdesc": null,
	"zip": 0,
	"base64": 0,
	"data": {
		"BusinessTypes": [
			{
				"BusinessTypeDesc": "365,神兽,兆日虚拟供应商",
				"BusinessType": "1"
			},
			{
				"BusinessTypeDesc": "艺龙",
				"BusinessType": "2"
			},
			{
				"BusinessTypeDesc": "同程",
				"BusinessType": "3"
			},
			{
				"BusinessTypeDesc": "暂无可用的供应商",
				"BusinessType": "4"
			}
		]
	}
}
Mock.mock(/getBusinessType/, 'post', getBusinessType);
var selectServiceReminder ={
	"code": 0,
	"rdesc": null,
	"zip": 0,
	"base64": 0,
	"data": {
		"ServiceList": [
			{
				"RemindNo": "12",
				"StartRemindTime": "2019-10-22",
				"EndRemindTime": "2019-10-24",
				"BusinessTypeDesc": "酒店",
				"RemindContent": "暂无可用的供应商暂无可用的供应商",
				"BusinessType": "1"
			},
			{
				"RemindNo": "122",
				"StartRemindTime": "2019-10-22",
				"EndRemindTime": "2019-10-24",
				"BusinessTypeDesc": "酒店",
				"RemindContent": "暂无可用的供应商暂无可用的供应商",
				"BusinessType": "1"
			},
			{
				"RemindNo": "123",
				"StartRemindTime": "2019-10-22",
				"EndRemindTime": "2019-10-24",
				"BusinessTypeDesc": "酒店",
				"RemindContent": "注意：自2019年10月24日起至2019年11月4日税局服务器维护，包括但不限于以下地区：北京、上海、广东、天津、重庆、浙江、山东、青岛、江苏、河南、福建江西、安徽、山西、湖北、广西、云南、宁夏、内蒙古、黑龙江。 具体恢复时间可查询各地方税务局，期间会影响发票验真产品的调用，请您提前做好准备以及应对工作。",
				"BusinessType": "1"
			},
			{
				"RemindNo": "124",
				"StartRemindTime": "2019-10-22",
				"EndRemindTime": "2019-10-24",
				"BusinessTypeDesc": "酒店",
				"RemindContent": "暂无可用的供应商暂无可用的供应商",
				"BusinessType": "1"
			}
		]
	}
}
Mock.mock(/selectServiceReminder/, 'post', selectServiceReminder);
var getOrdersRes={"base64":0,"code":46000004,"data":"","zip":0}
Mock.mock(/getOrders/, 'post', getOrdersRes);


