(window.webpackJsonpsinopay=window.webpackJsonpsinopay||[]).push([[3],{135:function(t,e,n){"use strict";n.r(e);var i=n(146),a=n(20),o=n(3),r=(i.a,{mixins:[i.a],created:function(){this.payTypeCase=this.payType.ALI_PAY_H5,o.a.isNotEmpty(this.config.redirectUri)&&(this.currPayType.thirdPayInfo.frontUrl=this.config.redirectUri),this.notifyCreatePay()},methods:{afterCreateOrder:function(t){this.lockPage(!1),this.beforeH5Pay(),this.h5Pay(t.content)},h5Pay:function(t){a.a.innerHTMLForm(t)&&this.h5PayOperaEnd()}}}),s=function(){var t=this.$createElement;return(this._self._c||t)("div")};s._withStripped=!0;var c=n(17),u=Object(c.a)(r,s,[],!1,null,null,null);u.options.__file="src\\payType\\aliPayH5.vue";e.default=u.exports},146:function(t,e,n){"use strict";var i,a=n(147),o=n.n(a),r=n(5),s=n.n(r),c=n(16),u=n.n(c),f=n(10),p=n(3),h=n(0);e.a=(i={props:{amount:{type:Number,default:0}},data:function(){return{payType:Object(h.f)(),payTypeCase:null}},computed:u()({},Object(f.b)(["zIndex","isBizMateEnv"]),Object(f.d)({limitTime:"limitTime",config:"config",currPayType:"currPayType",sinosdk:function(t){return t.depends.sinosdk},snutils:function(t){return t.depends.snutils}})),watch:{},created:function(){this.loadComplete()}},o()(i,"watch",{limitTime:function(t,e){this.limitStop(t)&&this.stopPay()}}),o()(i,"filters",{limitTimeFormat:function(t){if(t&&t>=0){var e=parseInt(t/864e5),n=parseInt(t%864e5/36e5),i=parseInt(t%36e5/6e4),a=parseInt(t%6e4/1e3),o="";return e&&(o+=e+"天"),n&&(o+=n+"小时"),i&&(o+=i+"分"),!e&&(o+=a+"秒"),o||0}return""}}),o()(i,"methods",u()({},Object(f.c)(["setCurrPayType","setOperationStage","lockPage","useQRCode"]),{notifyCreatePay:function(){this.$emit("createPay")},noticeServerAfterPay:function(){this.$emit("noticeServerAfterPay")},loadComplete:function(){this.$emit("loadComplete")},beforeCreateOrder:function(){},afterCreateOrder:function(){},stopPay:function(){this.setOperationStage(h.b.BREAK)},payUnknown:function(){this.setOperationStage(h.b.UNKNOW)},operationWaiting:function(){this.setOperationStage(h.b.WAITING)},operationSucc:function(){this.setOperationStage(h.b.SUCCESS)},operationEnd:function(){this.setOperationStage(h.b.END)},beforeH5Pay:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.$emit("beforeH5Pay",t)},h5PayOperaEnd:function(){this.$emit("h5PayOperaEnd")},limitStop:function(t){return t&&t<=0},toThreePayDo:function(t,e){var n=this,i=this;return new s.a((function(a,o){n.isBizMateEnv||(p.a.showConfirm({content:"不支持该支付方式",showCancelButton:!1}),o()),n.sinosdk[t](e).then((function(t){t&&0==t.ret?a(t):(i.stopPay(),t&&-2!=t.ret&&p.a.showConfirm({content:"支付方式不可用<br/>原因："+(t.errorMsg||"支付失败，请稍后重试"),showCancelButton:!1}),o(t))})).catch((function(t){i.stopPay(),n.snutils.showToast("支付失败，请稍后重试"),o(t)}))}))}})),i)},147:function(t,e,n){"use strict";e.__esModule=!0;var i,a=n(70),o=(i=a)&&i.__esModule?i:{default:i};e.default=function(t,e,n){return e in t?(0,o.default)(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}}}]);