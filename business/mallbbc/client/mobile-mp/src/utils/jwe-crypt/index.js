"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},encrypt_1=(Object.defineProperty(exports,"__esModule",{value:!0}),__importDefault(require("./core/jwe/compact/encrypt"))),decrypt_1=__importDefault(require("./core/jwe/compact/decrypt")),buffer_utils_1=require("./core/lib/buffer_utils");module.exports={CompactEncrypt:encrypt_1.default,compactDecrypt:decrypt_1.default,encoder:buffer_utils_1.encoder,decoder:buffer_utils_1.decoder};