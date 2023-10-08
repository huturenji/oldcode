/*
 * @Descripttion: 商城的公共js方法
 * @version: 
 * @Author: 张斌
 * @Date: 2019-12-24 11:08:51
 * @LastEditors: zb
 * @LastEditTime: 2019-05-24 11:26:34
 */
import base from './base';
import extendUtils from '../utils';
import injectErrorCodeShare from '../errorCodeHandler/share';
class ShareHandler extends base{
	constructor(){
        super();
        injectErrorCodeShare();
	}
	/**
	 * 分享聊天上下文到T信
	 * @param {json} shareData 分享所需参数
	 */
	shareToTchat(shareData){
		//选择通讯录,第一个参数是屏蔽的数组,第二个参数0单选,1多选
		extendUtils.selectContact([], '0').then((data) => {
			if (0 < data.length) {
				try {
					let userListLength = data.length;
					for(let i=0;i<userListLength;i++){
						if(1 == data[i].isActive){
							this.openChat(shareData,{UAId: data[i].UAId, UAName: data[i].uName})
						}else{
							extendUtils.showToast(data[i].uName+'已被删除，无法分享')
						}
					}
				} catch (e) {
					console.log('从T信通讯录中获取人员信息失败')
				}
			}
		});
	}
	/**
	 * 发送聊天上下文
	 * @param {json} shareData 分享所需的参数
	 */
	openChat(shareData,toUserItem) {
		var date = shareData.OrderTime || new Date().format('yyyy/MM/dd hh:mm');
		date = date.substring(0,10);    
		date = date.replace(/-/g,'/'); 
		var timestamp = new Date(date).getTime() / 1000;
		var flowInfor = {
			"flowUrl":shareData.callBackUrl,//从聊天上下文跳转回来的url
			"flowId":0,
			"flowName":shareData.bisName,//业务名称,XXX的bisName
			"applyId": shareData.fromUAId,//申请人Id
			"applyName": shareData.fromUname,//申请人名字 
			"approveId":toUserItem.UAId,//审批人Id
			"approveName":toUserItem.UAName,//审批人名字
			"flowStatus":-1,//表单状态，目前无实际作用
			"flowCreateTime": timestamp,//分享时间
			"iconId": 0,//默认图标类型对应审批的模板类型id,效果会被appIconPath和pcIconPath覆盖
			"toChatuName":shareData.fromUname,//发起聊天人名字
			"toChatUAId":shareData.fromUAId,//发起聊天人id
			"appIconPath": shareData.iconPath,//聊天上下文图标调用web资源——app
			"pcIconPath": shareData.iconPath,//聊天上下文图标调用web资源——pc
			"appId": shareData.appId,
			"whereMsgFrom": '通知',
			"content":"新消息",
		};

		let reg = /^[0-9]*$/;
		let UAIdType= "string";
		if(!!reg.test(toUserItem.UAId)){
			UAIdType="long"
		}

		let openJson = {
			action  : 'IntentAction_SSChatActivity',// OpenActionFunction 聊天上下文action
			dataList: [{key: 'EXTRA_CONV_ID', value: toUserItem.UAId, type: UAIdType},// 会话ID  值是long型 toChatUAId
				{key: 'EXTRA_IS_GROUP', value: false, type: "bool"},// 是否群组  值是布尔型 false
				{key: 'EXTRA_CONVER_NAME', value: toUserItem.UAName, type: "string"},// 会话名称   值是String型 toChatuName
				{key: 'EXTRA_CONV_UNREAD_NUMBER', value: 0, type: "int"},// 消息未读数  值是int型 0
				{key: 'EXTRA_MSG_TYPE', value: 'OA', type: "string"},//OA消息类型   值是String型 “OA”
				{key: 'EXTRA_OAFORM_CONTEXTKEY', value: JSON.stringify(flowInfor), type: "string"}]//OA内容   值是String型
        }	
		extendUtils.OpenActionFunction(JSON.stringify(openJson))
	}
	/**
	 * 异步获取登录用户名字
	 */	
	async getUserInfo() {
		return await extendUtils.GetUserInfoFunction().then(function(data){
			if(!!data){//用户存在
				return data;  
			}
		}).catch((err)=>{
			return '';
		})
	}
	/**
	 * 异步获取appId
	 */	
	async getAppConfig() {
		return await extendUtils.GetAppConfigFunction({'key':'msgSource'}).then(function(data){
			if(!!data){//用户存在
				var jsonData = JSON.parse(data.value);
				return jsonData||{};
			}
		}).catch((err)=>{
			return {};
		})
    }
    /**
     * 获取微信ticket
     */
    proxyWxTicket(param) {
        return this.request('/product/v1/proxyWxTicket', param, Object.assign({
            noSSOFlag: true,
            method: 'get',
            noZipFlag: true
        }));
    }
    /**
     * 注册第三方分享信息
     * @param json 分享信息
     * @param json 游客header
     */ 
    setThirdShareInfo(shareInfo){
        //伴正事分享
        try {
            this.registerBizmateShare(shareInfo);
        } catch (error) {
        }
        //处理微信分享
        this.setWxShare(shareInfo);
    }
    /**
     * 注册微信分享信息
     * @param json 分享信息
     * @param json 游客header
     */ 
    setWxShare(shareInfo){
        let that = this;
        wx.ready(function(){
            that.registerMicromessengerShare(shareInfo);
        });
        wx.error(function(res){
            console.log(res)
        }); 
        if(this.checkMicromessenger()){
            //注册微信验证通过后的回调事件
            this.proxyWxTicket({}).then((res)=>{
                if(0==res.resultCode && !!res.result && !!res.result.ticket){
                    this.getSignature(res.result.ticket)
                }
            }).catch((e)=>{
                console.log(e)
            });
        } 
    }
    /**
     * 获取微信ticket加密签名
     * @param string ticket
     */ 
    getSignature(ticket){
        let timestamp = parseInt(new Date().getTime()/1000);
        let nonceStr = this.randomString(16);
        let url = location.origin + location.pathname;
        let beforeStr = 'jsapi_ticket='+ticket+'&noncestr='+nonceStr+'&timestamp='+timestamp+'&url='+url;
        this.initMicromessengerConfig(this.sha1(beforeStr),timestamp,nonceStr)
    }
    /**
     * 微信公众号鉴权config
     */    
    initMicromessengerConfig(signature,timestamp,nonceStr){
        let wxConfig = {
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wx0108d32d827d1a98', // 必填，公众号的唯一标识
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名
            jsApiList: ['updateAppMessageShareData','updateTimelineShareData','onMenuShareAppMessage','onMenuShareTimeline'] // 必填，需要使用的JS接口列表
        }
        wx.config(wxConfig);
    }
     /**
     * 注册微信分享事件
     * @param json 分享信息
     */ 
    registerMicromessengerShare(shareData){
        let shareInfo = shareData;
        wx.updateAppMessageShareData({ 
            title: shareInfo.title, // 分享标题
            desc: shareInfo.desc, // 分享描述
            link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareInfo.imgUrl, // 分享图标
            success: function () {
            },
            fail:function (e) {
            },
        })
        wx.updateTimelineShareData({ 
            title: shareInfo.title, // 分享标题
            link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareInfo.imgUrl, // 分享图标
            success: function () {
            },
            fail:function (e) {
            },
        })
        try {//微信sdk1.4.0之前的分享微信pc版本使用
            wx.onMenuShareTimeline({
                title: shareInfo.title, // 分享标题
                link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareInfo.imgUrl, // 分享图标
                success: function () {
                // 用户点击了分享后执行的回调函数
                }
            })
            wx.onMenuShareAppMessage({
                title: shareInfo.title, // 分享标题
                desc: shareInfo.desc, // 分享描述
                link: shareInfo.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareInfo.imgUrl, // 分享图标
                success: function () {
                    // 用户点击了分享后执行的回调函数
                }
            })                 
        } catch (error) {
            console.log(error)
        }
    }
    /** 
    * 判断是否是在微信打开
    */
    checkMicromessenger(){
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        }
        return false;
    }
    /**
     * 获取随机字符串
     * @param length 长度
     */	
    randomString(length) {  
        let e = length || 32;
        var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
        a = t.length,
        n = '';
        for (let i = 0; i < e; i++) {n += t.charAt(Math.floor(Math.random() * a))};
        return n;
    }

    /**
     * encodeUTF8
     * @param s string
     */	
    encodeUTF8(s) {
        var i, r = [], c, x;
        for (i = 0; i < s.length; i++)
            if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
            else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
            else {
            if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
                c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
                r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
            else r.push(0xE0 + (c >> 12 & 0xF));
            r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
            };
        return r;
    }
    /**
     * 字符串加密成 hex 字符串(sha1)
     * @param s string
     */	
    sha1(s) {
        var data = new Uint8Array(this.encodeUTF8(s))
        var i, j, t;
        var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
        s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
        for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
        s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
        s[l - 1] = data.length << 3;
        var w = [], f = [
            function () { return m[1] & m[2] | ~m[1] & m[3]; },
            function () { return m[1] ^ m[2] ^ m[3]; },
            function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
            function () { return m[1] ^ m[2] ^ m[3]; }
        ], rol = function (n, c) { return n << c | n >>> (32 - c); },
            k = [1518500249, 1859775393, -1894007588, -899497514],
            m = [1732584193, -271733879, null, null, -1009589776];
        m[2] = ~m[0], m[3] = ~m[1];
        for (i = 0; i < s.length; i += 16) {
            var o = m.slice(0);
            for (j = 0; j < 80; j++)
            w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
            for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
        };
        t = new DataView(new Uint32Array(m).buffer);
        for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

        var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
            return (e < 16 ? '0' : '') + e.toString(16);
        }).join('');
        return hex;
    }  

    /**
     * 注册伴正事浏览器网页分享功能的数据
     */	
    async registerBizmateShare(shareDate) {  
        let that = this;
        let typeList = ['bizmate','wechat','wechatTimeline','copylink','note'];
        let typeListLength = typeList.length;
        let appInfo = {};
        try {
            appInfo = await that.getAppConfig();
        } catch (error) {
        }
        let appName = window.BMallConfig.SUPPLIER_Map[that.supplierId].name+'企业购';
        let appId = window.BMallConfig.SUPPLIER_Map[that.supplierId].appId+'';
        let shareParam = {
            sharingType:'',//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
            title : shareDate.title||'', // 分享标题          
            desc : shareDate.desc||'', // 分享描述           
            link : shareDate.link||'', // 分享链接          
            imgUrl : shareDate.imgUrl||'', // 分享图标,图片绝对地址 
            appId: (appInfo.appId||appId)+'',//小应用Id
            appName: appInfo.appName||appName||'企业购',//小应用名字,无合法appId时使用appName
            contentType : 'link' // 分享类型,music、video或link，不填默认为link
        }  
        let registerListDate = typeList.map((item)=>{
            shareParam.sharingType = item;
            let tempObj = JSON.stringify(shareParam);
            return JSON.parse(tempObj);
        });
        extendUtils.registerShare({dataList:registerListDate}).then((res)=>{
        }).catch((e)=>{
            console.log(e)
        });
    } 

    /**
     * 注销伴正事浏览器网页分享功能的数据
     */	    
    cancelBizmateShare(){
        extendUtils.registerShare({dataList:[]}).then((res)=>{
        }).catch((e)=>{
            console.log(e)
        });        
    }


}
export default new ShareHandler();
