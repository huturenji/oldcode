(window.webpackJsonpsinosdk=window.webpackJsonpsinosdk||[]).push([[6],{196:function(n,a,t){"use strict";t.r(a);var e=t(9),s=t(3);a.default={BRIDGE_CODE:"6",LAUNCH_PRIORITY:[{type:"url",func:e.a.LAUNCH_FUNC.APP},{type:"url",func:s.a.getNavigatorType()==e.a.NAVIGATOR_TYPE.IOS?e.a.LAUNCH_FUNC.H5:e.a.LAUNCH_FUNC.FRAME}],SHARE_LINK:{deconstruction:function(n){var a=n.indexOf("https://");if(-1!=a)try{var t=n.substring(0,a),e=new URL(n.substring(a)),s=e.pathname.lastIndexOf("/");return{sku:e.pathname.substring(s+1,e.pathname.indexOf(".html")).replace(/\b(0+)/gi,"")+"-"+e.pathname.substring(e.pathname.lastIndexOf("/",s-1)+1,s),productName:t,originalText:n}}catch(n){console.warn("sdk解析url失败："+n)}}}}}}]);