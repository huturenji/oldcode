var BigInteger=require("jsbn").BigInteger,SM3Digest=require("./sm3"),_=require("./utils"),SM2Cipher=function(){function t(){this.ct=1,this.p2=null,this.sm3keybase=null,this.sm3c3=null,this.key=new Array(32),this.keyOff=0}return t.prototype.reset=function(){this.sm3keybase=new SM3Digest,this.sm3c3=new SM3Digest;var t=_.hexToArray(_.leftPad(this.p2.getX().toBigInteger().toRadix(16),64)),e=_.hexToArray(_.leftPad(this.p2.getY().toBigInteger().toRadix(16),64));this.sm3keybase.blockUpdate(t,0,t.length),this.sm3c3.blockUpdate(t,0,t.length),this.sm3keybase.blockUpdate(e,0,e.length),this.ct=1,this.nextKey()},t.prototype.nextKey=function(){var t=new SM3Digest(this.sm3keybase);t.update(this.ct>>24&255),t.update(this.ct>>16&255),t.update(this.ct>>8&255),t.update(255&this.ct),t.doFinal(this.key,0),this.keyOff=0,this.ct++},t.prototype.initEncipher=function(t){var e=_.generateKeyPairHex(),i=new BigInteger(e.privateKey,16),e=e.publicKey;return this.p2=t.multiply(i),this.reset(),e=128<e.length?e.substr(e.length-128):e},t.prototype.encryptBlock=function(t){this.sm3c3.blockUpdate(t,0,t.length);for(var e=0;e<t.length;e++)this.keyOff===this.key.length&&this.nextKey(),t[e]^=255&this.key[this.keyOff++]},t.prototype.initDecipher=function(t,e){this.p2=e.multiply(t),this.reset()},t.prototype.decryptBlock=function(t){for(var e=0;e<t.length;e++)this.keyOff===this.key.length&&this.nextKey(),t[e]^=255&this.key[this.keyOff++];this.sm3c3.blockUpdate(t,0,t.length)},t.prototype.doFinal=function(t){var e=_.hexToArray(_.leftPad(this.p2.getY().toBigInteger().toRadix(16),64));this.sm3c3.blockUpdate(e,0,e.length),this.sm3c3.doFinal(t,0),this.reset()},t.prototype.createPoint=function(t,e){t="04"+t+e;return _.getGlobalCurve().decodePointHex(t)},t}();module.exports=SM2Cipher;