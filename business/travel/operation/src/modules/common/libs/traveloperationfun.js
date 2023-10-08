/*
 功能：运营管理订单中心的公用方法
author：liguanqun
date：2019年01月11日
 */
import tmHandler from 'bislibs/requesthandler/traveloperationhandler.js';
import utils from 'bislibs/utils'
import Vue from 'vue';
//TODO 统一使用vux控件
/**
 *
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} type         类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法
 */
export function showConfirm(content, rightFunction, type, strLeftBtn, strRightBtn, title, leftFunction, H5Flag) {
	var type = type || 2; //默认两个按钮  
	Vue.$vux.confirm.show({ //显示confirm弹窗   暂时屏蔽H5方法
		title: title || '',
		content: content,
		confirmText: strRightBtn,
		cancelText: strLeftBtn,
		showCancelButton: type == 2,
		onShow() {
			console.log('show')
		},
		onHide() {
			console.log('hide')
		},
		onCancel() {
			leftFunction();
		},
		onConfirm() {
			rightFunction();
		}
	});
}
export function simpleShowConfirm(content, rightFunction) {
	Vue.$vux.confirm.show({
		title: '',
		content: content,
		showCancelButton: false,
		onShow() {
			console.log('show')
		},
		onHide() {
			console.log('hide')
		},
		onCancel() { },
		onConfirm() {
			rightFunction();
		}
	});
}
export function getPushTemplateTypes() {
	return [{ businessType: 1, businessTypeDesc: "机票" }, { businessType: 2, businessTypeDesc: "酒店" }, { businessType: 3, businessTypeDesc: "火车票" }
		// , {businessType:4,businessTypeDesc:"快递"} , {businessType:5,businessTypeDesc:"保险"}
		, { businessType: 6, businessTypeDesc: "用车" }]
}

/**
 * 机票订单所有的改签补款金额之和，用于页面展示 和 退款业务
 */
export function getFilghtOrderAllAddMoney(flightOrder) {
	let result = 0;
	if (!!flightOrder.changeOrderList && flightOrder.changeOrderList.length > 0) {
		for (let i = 0; i < flightOrder.changeOrderList.length; i++) {
			if (flightOrder.changeOrderList[i].chaStatus == 4 || flightOrder.changeOrderList[i].chaStatus == 6) {
				result += flightOrder.changeOrderList[i].realAddMoneyAmount;
			}
		}
	}
	return result;
}

/**
 * 查询快递公司
 */
export function getExpressCpyList4Net() {
	return new Promise(function (reslove) {
		let data = {};
		tmHandler.getExpressCompanies(data)
			.then(
				function (res) {
					if (res && 0 == res.resultCode && !!res.result.expressCompanies && res.result.expressCompanies.length > 0) {
						//将快递公司列表储存到本地
						utils.setStorage("expressCompanies", JSON.stringify(res.result.expressCompanies));
					}
					reslove(res)
				}, function (error) {
					console.info(error);
					reslove(error)
				});
	});
}

/**
 * 查询企业列表名称
 */
export function getOrderCompanyList4Net(productionChannelId) {
	return new Promise(function (reslove) {
		let data = {
			channelId: !!productionChannelId && parseInt(productionChannelId) > 0 ? productionChannelId : undefined,
		};
		tmHandler.getOrderCompanyIds(data)
			.then(function (res) {
				if (0 == res.resultCode && !!res.result) {
					//将企业列表名称储存到本地
					//utils.setStorage("companyArr"+,JSON.stringify(res.result));
				}
				reslove(res)
			}, function (error) {
				console.info(error);
				reslove(error)
			});
	});
}
/**
 * 查询分销商渠道
 */
export function getAllChannels() {
	return new Promise(function (reslove) {
		let data = { pageSize: 1000, pageNum: 1 };
		tmHandler.getProductionChannels(data)
			.then(function (res) {
				if (0 == res.resultCode && !!res.result.channelInfos) {
					//将分销商渠道储存到本地
					utils.setStorage("productionChannels", JSON.stringify(res.result.channelInfos));
				}
				reslove(res)
			}, function (error) {
				console.info(error);
				reslove(error)
			});
	});
}
/**
* 查询供应商
*/
export function getProviderInfos4Net() {
	return new Promise(function (reslove) {
		let request = {};
		tmHandler.getProviderInfos(request)
			.then(function (res) {
				if (0 == res.resultCode && !!res.result.providerInfos) {
					//将供应商储存到本地
					utils.setStorage("providerInfos", JSON.stringify(res.result.providerInfos));
				}
				reslove(res)
			}, function (error) {
				console.info(error);
				reslove(error)
			});
	});
}

/**
 * 页面上的 数据转换
 */
export function getCascaderList(sData, isDir = true) {
	let resultArray = [];
	for (let i = 0; i < sData.length; i++) {
		let key = sData[i].companyId || sData[i].channelId
		let value = sData[i].companyName || sData[i].channelName
		if (!key || !value) {
			continue
		}

		let item = {
			// value: parseInt(key),
			value: key,
			label: value
		};
		if (isDir) {
			item.loading = false;
			item.children = [];
		}
		resultArray.push(item);
	}
	return resultArray;
}
/**
 * 获取分销渠道名称，从本地缓存取数据
 */
export function getProdNameForId(channelId) {
	let prodName = channelId;

	if (!!utils.getStorage("productionChannels")) {
		let channels = JSON.parse(utils.getStorage("productionChannels"));
		for (let i = 0; i < channels.length; i++) {
			if (channels[i].channelId == channelId) {
				prodName = channels[i].channelName
				break
			}
		}
	}
	return prodName;
}
/**
 * 获取企业名称，从本地缓存取数据
 */
export function getCompanyNameForId(companyId) {
	let result = companyId;
	if (!!utils.getStorage("companyArr")) {
		let providerInfos = JSON.parse(utils.getStorage("companyArr"));
		result = providerInfos[parseInt(companyId) + ""]
	}
	return result;
}

/**
 * 获取供应商名称，从本地缓存取数据
 */
export function getProviderNameForId(providerType) {
	let prodName = "";
	if (!!utils.getStorage("providerInfos")) {
		let providerInfos = JSON.parse(utils.getStorage("providerInfos"));
		for (let i = 0; i < providerInfos.length; i++) {
			if (parseInt(providerInfos[i].providerType) == parseInt(providerType)) {
				prodName = providerInfos[i].providerShortName;
				break;
			}
		}
	} else {
		switch (parseInt(providerType)) {
			case 0:
				prodName = '365商旅';
			case 1:
				prodName = '神兽';
			case 2:
				prodName = '艺龙';
			default:
				prodName = '';
		}
	}
	return prodName;
}

export function getDefaultName() {
	return "---";
}
/**
* 获取支付方式显示的名字
*/
export function getPaymentName(payment, PayType) {
	let result = "---";
	if (!!payment && !!payment.paymentPlatformName) {
		result = payment.paymentPlatformName;
		if (payment.subPaymentPlatforms) {
			for (let i = 0; i < payment.subPaymentPlatforms.length; i++) {
				if (payment.subPaymentPlatforms[i].paymentPlatformType == PayType) {
					result += "(" + payment.subPaymentPlatforms[i].paymentPlatformName + ")"
					break;
				}
			}
		}
	}
	return result;
}
/**
 * 获取支付状态
 */
export function getPayStatus(payStatus) {
	switch (parseInt(payStatus)) {
		case 0:
			return '未支付';
		case 1:
			return '已支付';
		case 2:
			return '已退款';
		default:
			return;
	}
}

/**
 * 获取支因公因私
 */
export function getUserType(UseType) {
	switch (parseInt(UseType)) {
		case 0:
			return '因公';
		case 1:
			return '因私';
		default:
			return;
	}
}
// 思路：获取没重复的最右一值放入新数组
/*
* 推荐的方法
*
* 方法的实现代码相当酷炫，
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）*/
export function uniqArray(array, isUniq) {
	var temp = [];
	var index = [];
	var l = array.length;
	for (var i = 0; i < l; i++) {
		for (var j = i + 1; j < l; j++) {
			if (isUniq(array[i], array[j])) {
				i++;
				j = i;
			}
		}
		temp.push(array[i]);
		index.push(i);
	}
	// console.log(index);
	return temp;
}
/**
 * 由日期 2018-11-21 格式获取 星期几 周几
 */
export function getDateDays(src) {
	var weekArray = ["日", "一", "二", "三", "四", "五", "六"];
	let num = new Date(src).getDay();
	return weekArray[num]
}

/**
 * 获取舱位名称
 */
export function getCabinTypeName(cabinType) {
	switch (parseInt(cabinType)) {
		case 1:
			return '头等舱';
		case 2:
			return '商务舱';
		case 3:
			return '经济舱';
		default:
			return '';
	}
}

/**
 * 获取快递公司的logo
 */
export function getExpressLogo(expressInfo, from) {
	//类似于飞机票的logo，拼接成本地的图片
	let result = require("assets///cpy_mail_1.png");
	let mailImgMax = 3;
	if (from == 1) {
		let imgIndex = parseInt(expressInfo.expressCompanyCode || 1) > mailImgMax ? 1 : (expressInfo.expressCompanyCode || 1)
		result = require("assets///cpy_mail_" + imgIndex + ".png");
	} else {
		//快递公司编码 expressCompanyCode,1=顺丰，2=中通，3=圆通
		if (!!expressInfo && !!expressInfo.expressCompanyInfo) {
			let imgIndex = parseInt(expressInfo.expressCompanyInfo.expressCompanyCode || 1) > mailImgMax ? 1 : (expressInfo.expressCompanyInfo.expressCompanyCode || 1)
			result = require("assets///cpy_mail_" + imgIndex + ".png");
		}
		if (!!expressInfo && !!expressInfo.expressCompany) {
			let imgIndex = parseInt(expressInfo.expressCompany.expressCompanyCode || 1) > mailImgMax ? 1 : (expressInfo.expressCompany.expressCompanyCode || 1)
			result = require("assets///cpy_mail_" + imgIndex + ".png");
		}
	}
	return result;
}

/**
*将数组省市区拼装成 字符串
*/
export function getArrayToArea(source) {
	let result = "";
	if (!!source) {
		for (let i = 0; i < source.length; i++) {
			result += source[i];
			if (i != source.length - 1) {
				result += "/";
			}
		}
	}
	return result;
}

/**
*将字符串省市区拼装成数组 
*/
export function getAreaToArray(source) {
	let result = [];
	result = !!source ? source.split("/") : [];
	return result;
}


/**
*根据tag来获取订单状态列表
*/
export function getStatusByCategoryUniq(category) {
	let result = utils.getStatusByCategory(category, "2");
	result = uniqArray(result, function (a, b) {
		return a == b;
	});
	return result;
}

/**
 * 查询全国省市区
 */
export function getProvinceCityCounty4Net() {
	return new Promise(function (reslove) {
		let data = {};
		tmHandler.getProvinceCityCounty(data)
			.then(function (res) {
				if (0 == res.resultCode && !!res.result) {
					//将全国省市区储存到本地
					utils.setStorage("proviceCityCounty", JSON.stringify(res.result.proviceCityCounty));
				}
				reslove(res)
			}, function (error) {
				console.info(error);
				reslove(error)
			});
	});
}

/**
 * 领取按钮文字显示
 */
export function getProcessOrderName(pStatus, customeServiceStaffId, customeServiceStaff, proFailReason) {
	let result = "领取";
	//程序自动处理的出票失败，显示领取,但是置灰。
	if (pStatus >= 1 && !!customeServiceStaffId) {
		result = isTheSameAccount(customeServiceStaffId, customeServiceStaff) ? "您已领取"
			: (customeServiceStaff || "") + "已领取"
	}
	return result;
}

/**
 * 判断是否是同一个登录账户，id 和 name一起判断
 */
export function isTheSameAccount(id, name) {
	// var loginInfo = JSON.parse(utils.getStorage("TOMLoginInfo"));
	// console.log("isTheSameAccount;id=" + id + ",name=" + name)
	if (!!id && tmHandler.userInfo) {//id存在，就通过ID判断
		return id == tmHandler.userInfo.userId;
	} else {//否则 通过名字判断 
		return name == tmHandler.userInfo.userName;
	}
}
