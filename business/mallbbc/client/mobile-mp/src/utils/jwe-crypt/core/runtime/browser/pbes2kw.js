"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var a=Object.getOwnPropertyDescriptor(t,r);a&&("get"in a?t.__esModule:!a.writable&&!a.configurable)||(a={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,a)}:function(e,t,r,n){e[n=void 0===n?r:n]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t},__awaiter=this&&this.__awaiter||function(e,s,u,o){return new(u=u||Promise)(function(r,t){function n(e){try{i(o.next(e))}catch(e){t(e)}}function a(e){try{i(o.throw(e))}catch(e){t(e)}}function i(e){var t;e.done?r(e.value):((t=e.value)instanceof u?t:new u(function(e){e(t)})).then(n,a)}i((o=o.apply(e,s||[])).next())})},__generator=this&&this.__generator||function(n,a){var i,s,u,o={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]},c={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function e(r){return function(e){var t=[r,e];if(i)throw new TypeError("Generator is already executing.");for(;o=c&&t[c=0]?0:o;)try{if(i=1,s&&(u=2&t[0]?s.return:t[0]?s.throw||((u=s.return)&&u.call(s),0):s.next)&&!(u=u.call(s,t[1])).done)return u;switch(s=0,(t=u?[2&t[0],u.value]:t)[0]){case 0:case 1:u=t;break;case 4:return o.label++,{value:t[1],done:!1};case 5:o.label++,s=t[1],t=[0];continue;case 7:t=o.ops.pop(),o.trys.pop();continue;default:if(!(u=0<(u=o.trys).length&&u[u.length-1])&&(6===t[0]||2===t[0])){o=0;continue}if(3===t[0]&&(!u||t[1]>u[0]&&t[1]<u[3]))o.label=t[1];else if(6===t[0]&&o.label<u[1])o.label=u[1],u=t;else{if(!(u&&o.label<u[2])){u[2]&&o.ops.pop(),o.trys.pop();continue}o.label=u[2],o.ops.push(t)}}t=a.call(n,o)}catch(e){t=[6,e],s=0}finally{i=u=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},random_1=(Object.defineProperty(exports,"__esModule",{value:!0}),exports.decrypt=exports.encrypt=void 0,__importDefault(require("./random"))),buffer_utils_1=require("../../lib/buffer_utils"),base64url_1=require("./base64url"),aeskw_1=require("./aeskw"),check_p2s_1=__importDefault(require("../../lib/check_p2s")),webcrypto_1=__importStar(require("./webcrypto")),encrypt=function(u,o,c,l,_){return void 0===l&&(l=Math.floor(2049*Math.random())+2048),void 0===_&&(_=(0,random_1.default)(new Uint8Array(16))),__awaiter(void 0,void 0,void 0,function(){var t,r,n,a,i,s;return __generator(this,function(e){switch(e.label){case 0:return((0,webcrypto_1.ensureSecureContext)(),(0,check_p2s_1.default)(_),r=(0,buffer_utils_1.p2s)(u,_),t=parseInt(u.substr(13,3),10),r={hash:"SHA-".concat(u.substr(8,3)),iterations:l,name:"PBKDF2",salt:r},n={length:t,name:"AES-KW"},o instanceof Uint8Array)?[4,webcrypto_1.default.subtle.importKey("raw",o,"PBKDF2",!1,["deriveBits"])]:[3,2];case 1:return a=e.sent(),[3,3];case 2:a=o,e.label=3;case 3:return a.usages.includes("deriveBits")?(s=Uint8Array.bind,[4,webcrypto_1.default.subtle.deriveBits(r,a,t)]):[3,5];case 4:return i=new(s.apply(Uint8Array,[void 0,e.sent()])),[3,8];case 5:return a.usages.includes("deriveKey")?[4,webcrypto_1.default.subtle.deriveKey(r,a,n,!1,["wrapKey"])]:[3,7];case 6:return i=e.sent(),[3,8];case 7:throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');case 8:return[4,(0,aeskw_1.wrap)(u.substr(-6),i,c)];case 9:return[2,{encryptedKey:e.sent(),p2c:l,p2s:(0,base64url_1.encode)(_)}]}})})},decrypt=(exports.encrypt=encrypt,function(u,o,c,l,_){return __awaiter(void 0,void 0,void 0,function(){var t,r,n,a,i,s;return __generator(this,function(e){switch(e.label){case 0:return((0,webcrypto_1.ensureSecureContext)(),(0,check_p2s_1.default)(_),r=(0,buffer_utils_1.p2s)(u,_),t=parseInt(u.substr(13,3),10),r={hash:"SHA-".concat(u.substr(8,3)),iterations:l,name:"PBKDF2",salt:r},n={length:t,name:"AES-KW"},o instanceof Uint8Array)?[4,webcrypto_1.default.subtle.importKey("raw",o,"PBKDF2",!1,["deriveBits"])]:[3,2];case 1:return a=e.sent(),[3,3];case 2:a=o,e.label=3;case 3:return a.usages.includes("deriveBits")?(s=Uint8Array.bind,[4,webcrypto_1.default.subtle.deriveBits(r,a,t)]):[3,5];case 4:return i=new(s.apply(Uint8Array,[void 0,e.sent()])),[3,8];case 5:return a.usages.includes("deriveKey")?[4,webcrypto_1.default.subtle.deriveKey(r,a,n,!1,["unwrapKey"])]:[3,7];case 6:return i=e.sent(),[3,8];case 7:throw new TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"');case 8:return[2,(0,aeskw_1.unwrap)(u.substr(-6),i,c)]}})})});exports.decrypt=decrypt;