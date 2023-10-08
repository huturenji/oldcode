"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,r,t,n){void 0===n&&(n=t);var a=Object.getOwnPropertyDescriptor(r,t);a&&("get"in a?r.__esModule:!a.writable&&!a.configurable)||(a={enumerable:!0,get:function(){return r[t]}}),Object.defineProperty(e,n,a)}:function(e,r,t,n){e[n=void 0===n?t:n]=r[t]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,r){Object.defineProperty(e,"default",{enumerable:!0,value:r})}:function(e,r){e.default=r}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&__createBinding(r,e,t);return __setModuleDefault(r,e),r},__awaiter=this&&this.__awaiter||function(e,i,u,l){return new(u=u||Promise)(function(t,r){function n(e){try{o(l.next(e))}catch(e){r(e)}}function a(e){try{o(l.throw(e))}catch(e){r(e)}}function o(e){var r;e.done?t(e.value):((r=e.value)instanceof u?r:new u(function(e){e(r)})).then(n,a)}o((l=l.apply(e,i||[])).next())})},__generator=this&&this.__generator||function(n,a){var o,i,u,l={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]},c={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function e(t){return function(e){var r=[t,e];if(o)throw new TypeError("Generator is already executing.");for(;l=c&&r[c=0]?0:l;)try{if(o=1,i&&(u=2&r[0]?i.return:r[0]?i.throw||((u=i.return)&&u.call(i),0):i.next)&&!(u=u.call(i,r[1])).done)return u;switch(i=0,(r=u?[2&r[0],u.value]:r)[0]){case 0:case 1:u=r;break;case 4:return l.label++,{value:r[1],done:!1};case 5:l.label++,i=r[1],r=[0];continue;case 7:r=l.ops.pop(),l.trys.pop();continue;default:if(!(u=0<(u=l.trys).length&&u[u.length-1])&&(6===r[0]||2===r[0])){l=0;continue}if(3===r[0]&&(!u||r[1]>u[0]&&r[1]<u[3]))l.label=r[1];else if(6===r[0]&&l.label<u[1])l.label=u[1],u=r;else{if(!(u&&l.label<u[2])){u[2]&&l.ops.pop(),l.trys.pop();continue}l.label=u[2],l.ops.push(r)}}r=a.call(n,l)}catch(e){r=[6,e],i=0}finally{o=u=0}if(5&r[0])throw r[1];return{value:r[0]?r[1]:void 0,done:!0}}}},__read=this&&this.__read||function(e,r){var t="function"==typeof Symbol&&e[Symbol.iterator];if(!t)return e;var n,a,o=t.call(e),i=[];try{for(;(void 0===r||0<r--)&&!(n=o.next()).done;)i.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(t=o.return)&&t.call(o)}finally{if(a)throw a.error}}return i},__spreadArray=this&&this.__spreadArray||function(e,r,t){if(t||2===arguments.length)for(var n,a=0,o=r.length;a<o;a++)!n&&a in r||((n=n||Array.prototype.slice.call(r,0,a))[a]=r[a]);return e.concat(n||Array.prototype.slice.call(r))},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},bogus_1=(Object.defineProperty(exports,"__esModule",{value:!0}),exports.unwrap=exports.wrap=void 0,__importDefault(require("./bogus"))),webcrypto_1=__importStar(require("./webcrypto"));function checkKeySize(e,r){if(e.algorithm.length!==parseInt(r.substr(1,3),10))throw new TypeError("invalid key size for alg: ".concat(r))}var wrap=function(a,o,i){return __awaiter(void 0,void 0,void 0,function(){var r,t,n;return __generator(this,function(e){switch(e.label){case 0:return((0,webcrypto_1.ensureSecureContext)(),o instanceof Uint8Array)?[4,webcrypto_1.default.subtle.importKey("raw",o,"AES-KW",!0,["wrapKey"])]:[3,2];case 1:return r=e.sent(),[3,3];case 2:r=o,e.label=3;case 3:return checkKeySize(r,a),[4,(n=webcrypto_1.default.subtle).importKey.apply(n,__spreadArray(["raw",i],__read(bogus_1.default),!1))];case 4:return n=e.sent(),t=Uint8Array.bind,[4,webcrypto_1.default.subtle.wrapKey("raw",n,r,"AES-KW")];case 5:return[2,new(t.apply(Uint8Array,[void 0,e.sent()]))]}})})},unwrap=(exports.wrap=wrap,function(a,o,i){return __awaiter(void 0,void 0,void 0,function(){var r,t,n;return __generator(this,function(e){switch(e.label){case 0:return((0,webcrypto_1.ensureSecureContext)(),o instanceof Uint8Array)?[4,webcrypto_1.default.subtle.importKey("raw",o,"AES-KW",!0,["unwrapKey"])]:[3,2];case 1:return r=e.sent(),[3,3];case 2:r=o,e.label=3;case 3:return checkKeySize(r,a),[4,(n=webcrypto_1.default.subtle).unwrapKey.apply(n,__spreadArray(["raw",i,r,"AES-KW"],__read(bogus_1.default),!1))];case 4:return n=e.sent(),t=Uint8Array.bind,[4,webcrypto_1.default.subtle.exportKey("raw",n)];case 5:return[2,new(t.apply(Uint8Array,[void 0,e.sent()]))]}})})});exports.unwrap=unwrap;