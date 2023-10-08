"use strict";var __awaiter=this&&this.__awaiter||function(e,a,u,l){return new(u=u||Promise)(function(r,t){function n(e){try{o(l.next(e))}catch(e){t(e)}}function i(e){try{o(l.throw(e))}catch(e){t(e)}}function o(e){var t;e.done?r(e.value):((t=e.value)instanceof u?t:new u(function(e){e(t)})).then(n,i)}o((l=l.apply(e,a||[])).next())})},__generator=this&&this.__generator||function(n,i){var o,a,u,l={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]},c={next:e(0),throw:e(1),return:e(2)};return"function"==typeof Symbol&&(c[Symbol.iterator]=function(){return this}),c;function e(r){return function(e){var t=[r,e];if(o)throw new TypeError("Generator is already executing.");for(;l=c&&t[c=0]?0:l;)try{if(o=1,a&&(u=2&t[0]?a.return:t[0]?a.throw||((u=a.return)&&u.call(a),0):a.next)&&!(u=u.call(a,t[1])).done)return u;switch(a=0,(t=u?[2&t[0],u.value]:t)[0]){case 0:case 1:u=t;break;case 4:return l.label++,{value:t[1],done:!1};case 5:l.label++,a=t[1],t=[0];continue;case 7:t=l.ops.pop(),l.trys.pop();continue;default:if(!(u=0<(u=l.trys).length&&u[u.length-1])&&(6===t[0]||2===t[0])){l=0;continue}if(3===t[0]&&(!u||t[1]>u[0]&&t[1]<u[3]))l.label=t[1];else if(6===t[0]&&l.label<u[1])l.label=u[1],u=t;else{if(!(u&&l.label<u[2])){u[2]&&l.ops.pop(),l.trys.pop();continue}l.label=u[2],l.ops.push(t)}}t=i.call(n,l)}catch(e){t=[6,e],a=0}finally{o=u=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},decrypt_1=(Object.defineProperty(exports,"__esModule",{value:!0}),__importDefault(require("../flattened/decrypt"))),errors_1=require("../../util/errors"),buffer_utils_1=require("../../lib/buffer_utils");function compactDecrypt(u,l,c){return __awaiter(this,void 0,void 0,function(){var t,r,n,i,o,a;return __generator(this,function(e){switch(e.label){case 0:if("string"!=typeof(u=u instanceof Uint8Array?buffer_utils_1.decoder.decode(u):u))throw new errors_1.JWEInvalid("Compact JWE must be a string or Uint8Array");if(a=u.split("."),t=a[0],r=a[1],n=a[2],i=a[3],o=a[4],5!==a.length)throw new errors_1.JWEInvalid("Invalid Compact JWE");return[4,(0,decrypt_1.default)({ciphertext:i||void 0,iv:n||void 0,protected:t||void 0,tag:o||void 0,encrypted_key:r||void 0},l,c)];case 1:return[2,{plaintext:(a=e.sent()).plaintext,protectedHeader:a.protectedHeader}]}})})}exports.default=compactDecrypt;