"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var a=Object.getOwnPropertyDescriptor(t,r);a&&("get"in a?t.__esModule:!a.writable&&!a.configurable)||(a={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,a)}:function(e,t,r,n){e[n=void 0===n?r:n]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t},__awaiter=this&&this.__awaiter||function(e,o,i,s){return new(i=i||Promise)(function(r,t){function n(e){try{u(s.next(e))}catch(e){t(e)}}function a(e){try{u(s.throw(e))}catch(e){t(e)}}function u(e){var t;e.done?r(e.value):((t=e.value)instanceof i?t:new i(function(e){e(t)})).then(n,a)}u((s=s.apply(e,o||[])).next())})},__generator=this&&this.__generator||function(n,a){var u,o,i,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]},l={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(l[Symbol.iterator]=function(){return this}),l;function e(r){return function(e){var t=[r,e];if(u)throw new TypeError("Generator is already executing.");for(;s=l&&t[l=0]?0:s;)try{if(u=1,o&&(i=2&t[0]?o.return:t[0]?o.throw||((i=o.return)&&i.call(o),0):o.next)&&!(i=i.call(o,t[1])).done)return i;switch(o=0,(t=i?[2&t[0],i.value]:t)[0]){case 0:case 1:i=t;break;case 4:return s.label++,{value:t[1],done:!1};case 5:s.label++,o=t[1],t=[0];continue;case 7:t=s.ops.pop(),s.trys.pop();continue;default:if(!(i=0<(i=s.trys).length&&i[i.length-1])&&(6===t[0]||2===t[0])){s=0;continue}if(3===t[0]&&(!i||t[1]>i[0]&&t[1]<i[3]))s.label=t[1];else if(6===t[0]&&s.label<i[1])s.label=i[1],i=t;else{if(!(i&&s.label<i[2])){i[2]&&s.ops.pop(),s.trys.pop();continue}s.label=i[2],s.ops.push(t)}}t=a.call(n,s)}catch(e){t=[6,e],o=0}finally{u=i=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},__read=this&&this.__read||function(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,a,u=r.call(e),o=[];try{for(;(void 0===t||0<t--)&&!(n=u.next()).done;)o.push(n.value)}catch(e){a={error:e}}finally{try{n&&!n.done&&(r=u.return)&&r.call(u)}finally{if(a)throw a.error}}return o},__spreadArray=this&&this.__spreadArray||function(e,t,r){if(r||2===arguments.length)for(var n,a=0,u=t.length;a<u;a++)!n&&a in t||((n=n||Array.prototype.slice.call(t,0,a))[a]=t[a]);return e.concat(n||Array.prototype.slice.call(t))},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},subtle_rsaes_1=(Object.defineProperty(exports,"__esModule",{value:!0}),exports.decrypt=exports.encrypt=void 0,__importDefault(require("./subtle_rsaes"))),bogus_1=__importDefault(require("./bogus")),webcrypto_1=__importStar(require("./webcrypto")),check_key_length_1=__importDefault(require("./check_key_length")),encrypt=function(a,u,o){return __awaiter(void 0,void 0,void 0,function(){var t,r,n;return __generator(this,function(e){switch(e.label){case 0:return((0,webcrypto_1.ensureSecureContext)(),(0,check_key_length_1.default)(a,u),u.usages.includes("encrypt"))?(t=Uint8Array.bind,[4,webcrypto_1.default.subtle.encrypt((0,subtle_rsaes_1.default)(a),u,o)]):[3,2];case 1:return[2,new(t.apply(Uint8Array,[void 0,e.sent()]))];case 2:return u.usages.includes("wrapKey")?[4,(n=webcrypto_1.default.subtle).importKey.apply(n,__spreadArray(["raw",o],__read(bogus_1.default),!1))]:[3,5];case 3:return n=e.sent(),r=Uint8Array.bind,[4,webcrypto_1.default.subtle.wrapKey("raw",n,u,(0,subtle_rsaes_1.default)(a))];case 4:return[2,new(r.apply(Uint8Array,[void 0,e.sent()]))];case 5:throw new TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation')}})})},decrypt=(exports.encrypt=encrypt,function(a,u,o){return __awaiter(void 0,void 0,void 0,function(){var t,r,n;return __generator(this,function(e){switch(e.label){case 0:return((0,webcrypto_1.ensureSecureContext)(),(0,check_key_length_1.default)(a,u),u.usages.includes("decrypt"))?(t=Uint8Array.bind,[4,webcrypto_1.default.subtle.decrypt((0,subtle_rsaes_1.default)(a),u,o)]):[3,2];case 1:return[2,new(t.apply(Uint8Array,[void 0,e.sent()]))];case 2:return u.usages.includes("unwrapKey")?[4,(n=webcrypto_1.default.subtle).unwrapKey.apply(n,__spreadArray(["raw",o,u,(0,subtle_rsaes_1.default)(a)],__read(bogus_1.default),!1))]:[3,5];case 3:return n=e.sent(),r=Uint8Array.bind,[4,webcrypto_1.default.subtle.exportKey("raw",n)];case 4:return[2,new(r.apply(Uint8Array,[void 0,e.sent()]))];case 5:throw new TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation')}})})});exports.decrypt=decrypt;