(window.webpackJsonpsinopay=window.webpackJsonpsinopay||[]).push([[8],{140:function(t,e,n){"use strict";n.r(e);var a=n(19),i=n.n(a),o=n(6),r=n.n(o),s=n(37),u=n.n(s),c=n(144),p=(c.a,{mixins:[c.a],components:{},props:{},data:function(){return{}},created:function(){this.payTypeCase=this.payType.TRANSFER_PAY,this.notifyCreatePay()},mounted:function(){},activated:function(){},methods:{afterCreateOrder:function(t){var e=this;this.lockPage(!1);var n=(t||{}).content;this.toThreePayDo(this.payTypeCase.appFuncName,this.reloadExtraData(n)).then((function(){e.noticeServerAfterPay(),e.operationEnd()}))},reloadExtraData:function(t){return t?(t=JSON.parse(t),u()(r()({},t,{extra:u()(i()({paymentNo:t.paymentNo},this.config.appExtraData))}))):null}}}),f=function(){var t=this.$createElement;return(this._self._c||t)("div")};f._withStripped=!0;var l=n(16),h=Object(l.a)(p,f,[],!1,null,null,null);h.options.__file="src\\payType\\transferPay.vue";e.default=h.exports},144:function(t,e,n){"use strict";var a,i=n(145),o=n.n(i),r=n(5),s=n.n(r),u=n(19),c=n.n(u),p=n(10),f=n(3),l=n(0);e.a=(a={props:{amount:{type:Number,default:0}},data:function(){return{payType:Object(l.e)(),payTypeCase:null}},computed:c()({},Object(p.b)(["zIndex","isBizMateEnv"]),Object(p.d)({limitTime:"limitTime",config:"config",currPayType:"currPayType",sinosdk:function(t){return t.depends.sinosdk},snutils:function(t){return t.depends.snutils}})),watch:{},created:function(){this.loadComplete()}},o()(a,"watch",{limitTime:function(t,e){this.limitStop(t)&&this.stopPay()}}),o()(a,"filters",{limitTimeFormat:function(t){if(t&&t>=0){var e=parseInt(t/864e5),n=parseInt(t%864e5/36e5),a=parseInt(t%36e5/6e4),i=parseInt(t%6e4/1e3),o="";return e&&(o+=e+"天"),n&&(o+=n+"小时"),a&&(o+=a+"分"),!e&&(o+=i+"秒"),o||0}return""}}),o()(a,"methods",c()({},Object(p.c)(["setCurrPayType","setOperationStage","lockPage","useQRCode"]),{notifyCreatePay:function(){this.$emit("createPay")},noticeServerAfterPay:function(){this.$emit("noticeServerAfterPay")},loadComplete:function(){this.$emit("loadComplete")},beforeCreateOrder:function(){},afterCreateOrder:function(){},stopPay:function(){this.setOperationStage(l.b.BREAK)},payUnknown:function(){this.setOperationStage(l.b.UNKNOW)},operationWaiting:function(){this.setOperationStage(l.b.WAITING)},operationEnd:function(){this.setOperationStage(l.b.END)},beforeH5Pay:function(){this.$emit("beforeH5Pay")},h5PayOperaEnd:function(){this.$emit("h5PayOperaEnd")},limitStop:function(t){return t&&t<=0},toThreePayDo:function(t,e){var n=this,a=this;return new s.a((function(i,o){n.isBizMateEnv||(f.a.showConfirm({content:"不支持该支付方式",showCancelButton:!1}),o()),n.sinosdk[t](e).then((function(t){t&&0==t.ret?i(t):(a.stopPay(),t&&-2!=t.ret&&f.a.showConfirm({content:"支付方式不可用<br/>原因："+(t.errorMsg||"支付失败，请稍后重试"),showCancelButton:!1}),o(t))})).catch((function(t){a.stopPay(),n.snutils.showToast("支付失败，请稍后重试"),o(t)}))}))}})),a)},145:function(t,e,n){"use strict";e.__esModule=!0;var a,i=n(70),o=(a=i)&&a.__esModule?a:{default:a};e.default=function(t,e,n){return e in t?(0,o.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}}}]);