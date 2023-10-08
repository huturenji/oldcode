"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.bitLengths=void 0;var errors_1=require("../util/errors"),bitLengths=new Map([["A128CBC-HS256",256],["A128GCM",128],["A192CBC-HS384",384],["A192GCM",192],["A256CBC-HS512",512],["A256GCM",256],["G128CBC-HG128",256]]),factory=(exports.bitLengths=bitLengths,function(e){return function(t){var r=bitLengths.get(t);if(r)return e(new Uint8Array(r>>3));throw new errors_1.JOSENotSupported("Unsupported JWE Algorithm: ".concat(t))}});exports.default=factory;