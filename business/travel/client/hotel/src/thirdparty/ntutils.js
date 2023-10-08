var ua = navigator.userAgent.toLowerCase();

var callbackHandlers = {};

//function jinbeiLogin() {
//	//	alert("开始调用 jinbeiLogin");
//	return new Promise(function(res, rej) {
//		toLogin(function(userSeq, userPhone, name, idcardNo) {
//			var response = {
//				'userSeq': userSeq,
//				'userPhone': userPhone,
//				'name': name,
//				'idcardNo': idcardNo
//			};
//			res(response);
//		});
//	}).catch(function(error) {
//		console.log("jinbeiLogin.error=" + JSON.stringify(error));
//	});
//}
//
//function jinbeiPay(no, amount) {
////		alert("开始调用 jinbeiPay");
//	return new Promise(function(res, rej) {
//		toPay(no, amount, function(no, state) {
//			//			alert("支付成功返回页面.：" + no + ";" + state);
//			var response = {
//				'no': no,
//				'state': state
//			};
//			res(response);
//		});
//	}).catch(function(error) {
//		console.log("jinbeiPay.error=" + JSON.stringify(error));
//	});
//}
/**
 *调用该接口去获取登录信息 
 */
function toLogin(callback) {
	//	alert("开始调用登录接口");
	callbackHandlers['toLogin'] = callback;
	if(/iphone|ipad|ipod|ios/.test(ua)) {
		window.webkit.messageHandlers.getUser.postMessage(null);
	} else if(/android/.test(ua)) {
		window.banFunding.getUser();
	} else {
		//其他暂不支持 
	}
}

/**
 *登录信息返回 
 *userSeq  用户id唯一
 *userPhone 用户手机号
 *name 用户姓名 不一定存在
 *idcardNo 用户身份证信息 不一定存在
 */
function getUser(userSeq, userPhone, name, idcardNo) {
	//	alert("登录回调成功：" + userSeq + "," + userPhone + "," + name + "," + idcardNo);
	//处理登录成功流程
	var callback = callbackHandlers['toLogin'];
	callback(userSeq, userPhone, name, idcardNo);
}

/**
 *调用支付页面 
 *no     订单号
 *amount 订单金额 string类型
 */
function toPay(no, amount, callback) {
	//	alert("开始调用支付页面");
	callbackHandlers['toPay'] = callback;
	var ntnsShopId = "070002"; //商户号固定
	var prodid = "ntbank0005"; //交易代码固定
	var prodname = "火车票订购"; //商品名称固定
	if(/iphone|ipad|ipod|ios/.test(ua)) {
		var params = {
			shopId: ntnsShopId,
			no: no,
			amount: amount,
			prodid: prodid,
			prodname: prodname
		}
		window.webkit.messageHandlers.bankPay.postMessage(params);
	} else if(/android/.test(ua)) {
		window.banFunding.bankPay(ntnsShopId, no, amount, prodid, prodname);
	} else {
		//其他暂不支持 
	}
}
/**
 *支付成功返回页面
 *no     订单号
 *state  支付结果 000000成功 其他失败 请以后台异步通知为准
 */
function bankPay(no, state) {
	//	alert("支付成功返回页面.state=" + state);
	//	if(state != '000000') {
	//		alert("支付失败!");
	//	} else {
	//		alert("支付成功!");
	//		//处理支付成功流程
	//	}
	var callback = callbackHandlers['toPay'];
	callback(no, state);
}