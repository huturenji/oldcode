(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{142:function(t,e,n){"use strict";n.r(e)},212:function(t,e,n){"use strict";n.r(e);var a={components:{},data:function(){return{meun:[{name:"注册纸纹",bgName:"register",path:"/register"},{name:"核验纸纹",bgName:"verify",path:"/verify"},{name:"查看注册列表",bgName:"registerList",path:"/register/list"}]}},beforeCreate:function(){sessionStorage.getItem("userInfo")||this.$router.replace("/login")},created:function(){},mounted:function(){},methods:{gotoPage:function(t){this.$router.push({path:t.path})}}},r=n(34);var s=function(t){n(142)},i=Object(r.a)(a,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"entry"},[n("div",{staticClass:"gridbox"},t._l(t.meun,(function(e,a){return n("div",{key:a,staticClass:"lotterybox",class:e.bgName,on:{click:function(n){return t.gotoPage(e)}}})})),0),t._v(" "),n("div",{staticClass:"logoWrap"})])}),[],!1,s,"data-v-1bcb43a7",null);e.default=i.exports}}]);