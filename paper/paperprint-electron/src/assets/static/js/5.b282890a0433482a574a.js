(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{104:function(e,t,n){e.exports=n.p+"static/img/img_Viewfinder.934f914.png"},105:function(e,t,n){var a={"./0/register.png":123,"./1/register.png":124,"./10/register.png":125,"./2/register.png":126,"./3/register.png":127,"./4/register.png":128,"./5/register.png":129,"./6/register.png":130,"./7/register.png":131,"./8/register.png":132,"./9/register.png":133};function r(e){var t=i(e);return n(t)}function i(e){if(!n.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}r.keys=function(){return Object.keys(a)},r.resolve=i,e.exports=r,r.id=105},108:function(e,t,n){"use strict";var a=n(139),r=n.n(a),i=n(102),s=n.n(i),c=n(103),o=n.n(c),u=n(35),p=n.n(u),l=n(15),g=n.n(l),d=n(36),f=n.n(d),v=n(37),m=n.n(v),h=function(){function e(){f()(this,e),this.cameraInterval=null,this.qrTimer=null,this.PREVIEW_OPTIONS=[300,139,0,0],this.takenPhotoing=!1,this.isShow=!1,this.options={}}var t,n,a,i,c,u;return m()(e,[{key:"init",value:function(e){var t=this;return this.options=e,this.options.defaultCameraOption=JSON.parse(g()(this.options.cameraOptions)),new p.a((function(e,n){try{t.cameraInterval=setInterval(o()(s.a.mark((function n(){var a,r,i;return s.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,ipcRenderer.sendSync("openDevice");case 2:if(0!=(a=n.sent)){n.next=13;break}return t.cameraInterval&&clearInterval(t.cameraInterval),n.next=7,t.createNativeWindow(t.options.cwnd);case 7:0==(r=n.sent)?(t.setDefaultOption(t.options.defaultCameraOption),e(r)):e(r),i=new CustomEvent("cameraInit",{detail:{created:!r}}),window.dispatchEvent(i),n.next=14;break;case 13:e(a);case 14:case"end":return n.stop()}}),n,t)}))),1500)}catch(t){e(-999)}}))}},{key:"createNativeWindow",value:(u=o()(s.a.mark((function e(t){var n=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new p.a(function(){var e=o()(s.a.mark((function e(a,r){var i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,ipcRenderer.sendSync("createNativeWindow",t||n.PREVIEW_OPTIONS);case 3:i=e.sent,a(i),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),a(-999);case 10:case"end":return e.stop()}}),e,n,[[0,7]])})));return function(t,n){return e.apply(this,arguments)}}()));case 1:case"end":return e.stop()}}),e,this)}))),function(e){return u.apply(this,arguments)})},{key:"setDefaultOption",value:function(e){var t=this;["whitebalance","exposure"].forEach((function(n){var a=n+"_auto",r=e[a];1===r?t.setCameraOption(n,[e[n]]):t.setCameraOption(a,[r])}))}},{key:"setOption",value:function(e){for(key in r()(this.options.cameraOption,e),this.options.cameraOption)this.setCameraOption(key,[this.options.cameraOption[key]])}},{key:"resetOption",value:function(){var e=this.options.cameraOption,t=this.options.defaultCameraOption;for(var n in e)if(Object.hasOwnProperty.call(e,n)){var a=t[n];a!=e[n]&&(e[n]=a,this.setCameraOption(n,[a]))}}},{key:"setCameraOption",value:function(e,t){ipcRenderer.sendSync("setCameraOption",{type:e,value:t})}},{key:"getPhoto",value:function(){var e,t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"captured_image.jpg";return this.takenPhotoing=!0,new p.a((e=o()(s.a.mark((function e(a,r){var i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,ipcRenderer.sendSync("takePhoto",n);case 3:i=e.sent,t.takenPhotoing=!1,0==i?(setTimeout((function(){t.hide()}),250),a(i)):(t.hide(),a(i)),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(0),a(-999);case 11:case"end":return e.stop()}}),e,t,[[0,8]])}))),function(t,n){return e.apply(this,arguments)}))}},{key:"getQRPhoto",value:function(e){var t,n=this,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"preview_temp.jpg";return new p.a((t=o()(s.a.mark((function e(t,r){var i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,ipcRenderer.sendSync("takePhoto",a);case 3:if(0!=(i=e.sent)){e.next=8;break}t(i),e.next=11;break;case 8:return e.next=10,n.close();case 10:t(i);case 11:e.next=16;break;case 13:e.prev=13,e.t0=e.catch(0),t(-999);case 16:case"end":return e.stop()}}),e,n,[[0,13]])}))),function(e,n){return t.apply(this,arguments)}))}},{key:"transmitInit",value:function(){}},{key:"reflexInit",value:function(){return this.getQRFromImage()}},{key:"getQRFromImage",value:(c=o()(s.a.mark((function e(){var t=this;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new p.a(function(){var e=o()(s.a.mark((function e(n){var a;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.takenPhotoing){e.next=18;break}return e.prev=1,e.next=4,t.getQRPhoto("preview_temp.jpg");case 4:if(0!=e.sent){e.next=13;break}return e.next=8,ipcRenderer.sendSync("parseQrCodeImage","preview_temp.jpg");case 8:if(a=e.sent,!t.takenPhotoing){e.next=12;break}return n(""),e.abrupt("return");case 12:a&&0==a.code&&a.data&&a.data.content?n(a.data.content):n("");case 13:e.next=18;break;case 15:e.prev=15,e.t0=e.catch(1),n("");case 18:case"end":return e.stop()}}),e,t,[[1,15]])})));return function(t){return e.apply(this,arguments)}}()));case 1:case"end":return e.stop()}}),e,this)}))),function(){return c.apply(this,arguments)})},{key:"close",value:(i=o()(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.cameraInterval&&clearInterval(this.cameraInterval),e.next=3,this.hide();case 3:return e.next=5,ipcRenderer.sendSync("closeNativeWindow");case 5:case"end":return e.stop()}}),e,this)}))),function(){return i.apply(this,arguments)})},{key:"show",value:(a=o()(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ipcRenderer.sendSync("showChildWindow");case 2:this.isShow=!0;case 3:case"end":return e.stop()}}),e,this)}))),function(){return a.apply(this,arguments)})},{key:"hide",value:(n=o()(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ipcRenderer.sendSync("hideChildWindow");case 2:this.isShow=!1;case 3:case"end":return e.stop()}}),e,this)}))),function(){return n.apply(this,arguments)})},{key:"open",value:(t=o()(s.a.mark((function e(){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:case"end":return e.stop()}}),e,this)}))),function(){return t.apply(this,arguments)})}]),e}();t.a=new h},109:function(e,t,n){"use strict";var a=n(36),r=n.n(a),i=n(37),s=n.n(i),c=function(){function e(){r()(this,e)}return s()(e,[{key:"getScanIndex",value:function(e,t){return!isNaN(parseFloat(e))&&isFinite(e)?e%10+1:t%10+1}}]),e}();t.a=new c},110:function(e,t,n){var a={"./0/register_fuzzy.png":111,"./1/register_fuzzy.png":112,"./10/register_fuzzy.png":113,"./2/register_fuzzy.png":114,"./3/register_fuzzy.png":115,"./4/register_fuzzy.png":116,"./5/register_fuzzy.png":117,"./6/register_fuzzy.png":118,"./7/register_fuzzy.png":119,"./8/register_fuzzy.png":120,"./9/register_fuzzy.png":121};function r(e){var t=i(e);return n(t)}function i(e){if(!n.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}r.keys=function(){return Object.keys(a)},r.resolve=i,e.exports=r,r.id=110},111:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.88d17c4.png"},112:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.1560c71.png"},113:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.d627447.png"},114:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.e3a5687.png"},115:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.2f418b0.png"},116:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.af9153b.png"},117:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.9d79fc3.png"},118:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.047e5a6.png"},119:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.4dad4c3.png"},120:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.5ca2d44.png"},121:function(e,t,n){e.exports=n.p+"static/img/register_fuzzy.d2d3742.png"},122:function(e,t,n){e.exports=n.p+"static/img/index.5591751.png"},123:function(e,t,n){e.exports=n.p+"static/img/register.e45094e.png"},124:function(e,t,n){e.exports=n.p+"static/img/register.158ad13.png"},125:function(e,t,n){e.exports=n.p+"static/img/register.46458bb.png"},126:function(e,t,n){e.exports=n.p+"static/img/register.5ef6238.png"},127:function(e,t,n){e.exports=n.p+"static/img/register.0ca7e0e.png"},128:function(e,t,n){e.exports=n.p+"static/img/register.5b013ed.png"},129:function(e,t,n){e.exports=n.p+"static/img/register.cd818a2.png"},130:function(e,t,n){e.exports=n.p+"static/img/register.94d033f.png"},131:function(e,t,n){e.exports=n.p+"static/img/register.6cf305a.png"},132:function(e,t,n){e.exports=n.p+"static/img/register.dab4d32.png"},133:function(e,t,n){e.exports=n.p+"static/img/register.b86f0bc.png"},143:function(e,t,n){"use strict";n.r(t)},144:function(e,t,n){"use strict";n.r(t)},213:function(e,t,n){"use strict";n.r(t);var a=n(102),r=n.n(a),i=n(103),s=n.n(i),c=(n(134),n(135),n(136)),o=n.n(c),u=n(108),p=n(109),l={components:{headBreadcrumb:function(){return n.e(0).then(n.bind(null,217))},namedcomp:function(){return n.e(2).then(n.bind(null,218))}},data:function(){return{bisType:"register",title:"注册纸纹",bisTitle:"核验纸纹",tagNum:"0000001",tagName:"",haveCamera:!1,optionsWrapShow:!1,bisRuning:!1,takenPhotoing:!1,coveImgData:n(104),scan_light_img:null,scan_base_img:null,PREVIEW_OPTIONS:[300,139,480,360],timer:null,interval:null,haveQrCode:null,appEnv:{},localAssetsPreStr:"../../../../",sourceTypeName:"凭证",active:!1,zoomStyle:window.devicePixelRatio>=1.5,gradientWrapper:!1,fadeAway:!1,scanIndex:0,labelId:0}},created:function(){this.sequence()},mounted:function(){this.getAppEnv(),this.deviceInit()},beforeDestroy:function(){this.timer&&clearInterval(this.timer),o.a.closeAll(),u.a.close()},watch:{tagName:function(e,t){this.active=e&&e.trim()&&this.haveCamera,this.handleInput(e)}},methods:{getAppEnv:function(){sessionStorage.getItem("appEnv")&&(this.appEnv=JSON.parse(sessionStorage.getItem("appEnv")),this.localAssetsPreStr=this.appEnv.isPackaged?"../../../../":"../../"),this.appEnv.preview_model?this.PREVIEW_OPTIONS=[300,139,480,360]:this.PREVIEW_OPTIONS=[300,139,0,0]},deviceInit:function(){var e=this;return s()(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return window.addEventListener("cameraInit",(function(t){t.detail.created&&e.bisInit()})),t.next=3,u.a.init({cwnd:e.PREVIEW_OPTIONS,cameraOptions:e.appEnv.defaultCameraOptions});case 3:0==t.sent?e.bisInit():e.alert("未发现纸纹仪，请检查设备是否正常","warning");case 5:case"end":return t.stop()}}),t,e)})))()},bisInit:function(){var e=this;return s()(r.a.mark((function t(){var n;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.haveCamera=!0,!e.appEnv.use_perspective){t.next=5;break}u.a.transmitInit(),t.next=11;break;case 5:return t.next=7,u.a.reflexInit();case 7:n=t.sent,e.tagName=e.tagName||n,e.timer=setInterval(s()(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,u.a.reflexInit();case 2:n=t.sent,e.tagName=e.tagName||n;case 4:case"end":return t.stop()}}),t,e)}))),5e3),e.tagName?o.a.closeAll():o()({message:"请把纸纹仪对准"+e.sourceTypeName,type:"warning",duration:3e3});case 11:case"end":return t.stop()}}),t,e)})))()},btnCallback:function(){var e=this;return s()(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.closeAnimation(),!e.appEnv.preview_model){t.next=4;break}return t.next=4,u.a.show();case 4:e.bisRuning=!1;case 5:case"end":return t.stop()}}),t,e)})))()},closeAnimation:function(){this.scan_light_img=null,this.gradientWrapper=!1,this.fadeAway=!1},register:function(){var e=this;return s()(r.a.mark((function t(){var n,a,i;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!e.takenPhotoing&&!e.bisRuning){t.next=2;break}return t.abrupt("return");case 2:if(t.prev=2,n=e.haveCamera,e.takenPhotoing=!0,t.t0=!n,!t.t0){t.next=9;break}return t.next=9,u.a.init(e.PREVIEW_OPTIONS);case 9:if(!e.haveCamera){t.next=30;break}if(e.tagName.trim().length){t.next=14;break}return o()({message:"请输入"+e.sourceTypeName+"号",type:"warning"}),e.takenPhotoing=!1,t.abrupt("return");case 14:if(e.active){t.next=16;break}return t.abrupt("return");case 16:return e.bisRuning=!0,t.next=19,u.a.getPhoto("captured_image.jpg");case 19:if(0!=t.sent){t.next=28;break}return e.appEnv.preview_model&&(e.coveImgData=e.localAssetsPreStr+"captured_image.jpg?t="+(new Date).getTime()),t.next=24,ipcRenderer.sendSync("checkFileExist",e.tagName);case 24:a=t.sent,e.checkFileExistReply(a),t.next=30;break;case 28:i={confirmButtonText:"确定",text:"<div  class='result warning'>注册失败，请确认纸纹仪是否连接正常</div>",type:"warning",center:!0,needRecord:!1,textUsedHtml:!0},e.confirm(i.confirmButtonText,i.text,i.type,e.btnCallback,i.center,"",i.textUsedHtml);case 30:t.next=37;break;case 32:t.prev=32,t.t1=t.catch(2),e.bisRuning=!1,e.takenPhotoing=!1,console.log(t.t1);case 37:case"end":return t.stop()}}),t,e,[[2,32]])})))()},checkFileExistReply:function(e){var t=this;return s()(r.a.mark((function n(){return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:0==e.code?(t.takenPhotoing=!1,t.confirm("确认覆盖","<div class=coverText><span>凭证号已存在，是否覆盖</span></div>","warning",t.register_core,!0,"",!0,t.btnCallback,"取消",!0)):t.register_core();case 1:case"end":return n.stop()}}),n,t)})))()},register_core:function(){var e=this;return s()(r.a.mark((function t(){return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.scanIndex=p.a.getScanIndex(e.tagName,e.labelId),e.scan_base_img=n(110)("./"+e.scanIndex+"/register_fuzzy.png"),e.scan_light_img=n(122),e.gradientWrapper=!0,setTimeout(s()(r.a.mark((function t(){var n;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ipcRenderer.sendSync("register",e.tagName);case 2:n=t.sent,e.registerReply(n);case 4:case"end":return t.stop()}}),t,e)}))),0);case 5:case"end":return t.stop()}}),t,e)})))()},registerReply:function(e){var t=this;return s()(r.a.mark((function n(){var a;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:a=document.getElementById("scanBaseImgWrap"),t.animationendListener=t.createAnimationendListener(e),a.addEventListener("animationend",t.animationendListener);case 3:case"end":return n.stop()}}),n,t)})))()},createAnimationendListener:function(e){var t=this;return function(a){t.scan_light_img=null,t.fadeAway?(t.takenPhotoing=!1,0==e.code?t.registerAddRecord(e):-2==e.code?t.msg("注册失败,请填写"+t.sourceTypeName+"号","error"):t.msg("注册失败","error"),a.target.removeEventListener("animationend",t.animationendListener)):(t.scan_base_img=n(105)("./"+t.scanIndex+"/register.png"),t.fadeAway=!0,t.gradientWrapper=!1)}},openOptionContent:function(){this.haveCamera?this.optionsWrapShow=!0:this.alert("未发现纸纹仪，请检查设备是否正常","warning")},closeOptionsContent:function(){this.optionsWrapShow=!1},alert:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",n=arguments[2],a=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"提示",i=arguments.length>5&&void 0!==arguments[5]&&arguments[5];this.$alert(e,r,{confirmButtonText:"确定",type:t,center:a,dangerouslyUseHTMLString:i,callback:function(e){n&&n()}})},msg:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500;o()({message:e,type:t,duration:n,onClose:this.btnCallback,customClass:"el_msg"})},confirm:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"success",a=arguments[3],r=arguments.length>4&&void 0!==arguments[4]&&arguments[4],i=arguments.length>6&&void 0!==arguments[6]&&arguments[6],s=arguments[7],c=arguments.length>8&&void 0!==arguments[8]?arguments[8]:"取消",o=arguments.length>9&&void 0!==arguments[9]&&arguments[9];this.$confirm(t,"",{confirmButtonText:e,showCancelButton:o,cancelButtonText:c,type:n,center:r,showClose:!1,dangerouslyUseHTMLString:i,customClass:"el_confirm",cancelButtonClass:"el_cancel_btn",confirmButtonClass:"el_ok_btn",closeOnClickModal:!1}).then((function(){a&&a()})).catch((function(){s&&s()}))},registerAddRecord:function(e){var t=this;return s()(r.a.mark((function n(){var a;return r.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return a=null,sessionStorage.getItem("userInfo")&&(a=JSON.parse(sessionStorage.getItem("userInfo"))),n.next=4,ipcRenderer.sendSync("register_add_record",{labelNo:t.tagNum,labelName:t.tagName,labelHash:e.data.labelHash,registerUserId:a.userId||"HD7891",registerUserName:a.userName||"超级管理员",registerImg:e.data.registerImg||""});case 4:0==n.sent.code?(t.msg("注册成功","success"),t.sequence()):t.msg("注册失败","error");case 6:case"end":return n.stop()}}),n,t)})))()},sequence:function(){var e=this;return s()(r.a.mark((function t(){var n;return r.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,ipcRenderer.sendSync("register_sequence");case 2:(n=t.sent)&&0==n.code&&(e.tagNum=n.data.seq);case 4:case"end":return t.stop()}}),t,e)})))()},gotoBack:function(){this.$router.replace("/entry")},toggleBisType:function(){this.$router.replace("/verify")},handleInput:function(e){var t=this;return s()(r.a.mark((function a(){var i;return r.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:if(console.log("event is "+e),e.trim()&&t.haveCamera){a.next=5;break}t.coveImgData=n(104),a.next=10;break;case 5:return a.next=7,ipcRenderer.sendSync("register_search_record_precise",{labelName:e});case 7:"0"==(i=a.sent).code&&i.data&&i.data.pageList&&i.data.pageList.length>0?t.labelId=i.data.pageList[0].labelId:t.labelId=t.tagNum,t.appEnv.preview_model&&(t.coveImgData=null);case 10:case"end":return a.stop()}}),a,t)})))()}}},g=n(34);var d=function(e){n(143),n(144)},f=Object(g.a)(l,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"registerWrap",class:{zoomStyle:e.zoomStyle}},[n("div",{staticClass:"card_box"},[n("headBreadcrumb",{attrs:{title:"首页",tips:e.title,showbtn:!1,bistips:e.bisTitle,bisType:e.bisType},on:{goback:e.gotoBack,verifyFun:e.toggleBisType}}),e._v(" "),n("div",{staticClass:"contcentWrap",attrs:{"element-loading-text":e.loadingText,"element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0.7)"}},[n("div",{staticClass:"concent"},[n("div",{staticClass:"videoWrap"},[n("div",{staticClass:"videoContent",class:{gradientWrapper:e.gradientWrapper,fadeAway:e.fadeAway}},[n("div",{staticClass:"scanBaseImgWrap",attrs:{id:"scanBaseImgWrap"}},[e.scan_base_img?n("div",{staticClass:"scanBaseImg",style:{backgroundImage:"url("+e.scan_base_img+")"}}):e._e()]),e._v(" "),e.scan_light_img?n("img",{staticClass:"scan",attrs:{id:"scanLight",src:e.scan_light_img}}):e._e(),e._v(" "),e.coveImgData?n("div",{style:{backgroundImage:"url("+e.coveImgData+")"},attrs:{id:"coveImg"}}):e._e(),e._v(" "),e.optionsWrapShow?n("div",{staticClass:"optionsWrap"},[n("div",{staticClass:"line"},[n("div",{staticClass:"label"},[e._v("曝光：")]),e._v(" "),n("el-slider",{staticClass:"slider",attrs:{min:-13,max:0,step:1},on:{change:function(t){e.setCameraOption("exposure",[t])}},model:{value:e.options.exposure,callback:function(t){e.$set(e.options,"exposure",t)},expression:"options.exposure"}}),e._v(" "),n("span",{staticClass:"sliderRightText"},[e._v(e._s(e.options.exposure))])],1),e._v(" "),n("div",{staticClass:"line"},[n("div",{staticClass:"label"},[e._v("自动曝光")]),e._v(" "),n("el-slider",{staticClass:"slider",attrs:{min:0,max:1,step:1},on:{change:function(t){e.setCameraOption("exposure_auto",[t])}},model:{value:e.options.exposure_auto,callback:function(t){e.$set(e.options,"exposure_auto",t)},expression:"options.exposure_auto"}}),e._v(" "),n("span",{staticClass:"sliderRightText"},[e._v(e._s(e.options.exposure_auto))])],1),e._v(" "),n("div",{staticClass:"line"},[n("div",{staticClass:"label"},[e._v("白平衡")]),e._v(" "),n("el-slider",{staticClass:"slider",attrs:{min:2700,max:6500,step:100},on:{change:function(t){e.setCameraOption("whitebalance",[t])}},model:{value:e.options.whitebalance,callback:function(t){e.$set(e.options,"whitebalance",t)},expression:"options.whitebalance"}}),e._v(" "),n("span",{staticClass:"sliderRightText"},[e._v(e._s(e.options.whitebalance))])],1),e._v(" "),n("div",{staticClass:"line"},[n("div",{staticClass:"label"},[e._v("自动白平衡")]),e._v(" "),n("el-slider",{staticClass:"slider",attrs:{min:0,max:1,step:1},on:{change:function(t){e.setCameraOption("whitebalance_auto",[t])}},model:{value:e.options.whitebalance_auto,callback:function(t){e.$set(e.options,"whitebalance_auto",t)},expression:"options.whitebalance_auto"}}),e._v(" "),n("span",{staticClass:"sliderRightText"},[e._v(e._s(e.options.whitebalance_auto))])],1),e._v(" "),n("div",{staticClass:"bottomBar"},[n("div",{staticClass:"reset",on:{click:function(t){return e.reset()}}},[e._v("重置")]),e._v(" "),n("div",{staticClass:"getList",on:{click:function(t){return e.closeOptionsContent()}}},[e._v("确认")])])]):e._e()])]),e._v(" "),n("div",{staticClass:"formArea"},[n("namedcomp",{attrs:{compName:e.sourceTypeName+"号"}},[n("div",{attrs:{slot:"component"},slot:"component"},[n("el-input",{staticClass:"formAreaInpurt",attrs:{clearable:"",maxlength:"50",disabled:!e.haveCamera,placeholder:"请输入"+e.sourceTypeName+"号（必填）"},on:{input:function(t){return e.handleInput(t)}},model:{value:e.tagName,callback:function(t){e.tagName="string"==typeof t?t.trim():t},expression:"tagName"}})],1)])],1),e._v(" "),n("div",{staticClass:"bisBottomBar"},[n("div",{staticClass:"bisButton",class:{active:e.active},attrs:{disabled:!e.active},on:{click:function(t){return e.register()}}},[e._v("注册")])])])])],1)])}),[],!1,d,"data-v-71490483",null);t.default=f.exports}}]);