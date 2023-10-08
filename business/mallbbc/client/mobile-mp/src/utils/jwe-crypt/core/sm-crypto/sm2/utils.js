var _a=require("jsbn"),BigInteger=_a.BigInteger,SecureRandom=_a.SecureRandom,ECCurveFp=require("./ec").ECCurveFp,rng=new SecureRandom,_b=generateEcparam(),curve=_b.curve,G=_b.G,n=_b.n;function getGlobalCurve(){return curve}function generateEcparam(){var F=new BigInteger("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFF",16),e=new BigInteger("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000FFFFFFFFFFFFFFFC",16),r=new BigInteger("28E9FA9E9D9F5E344D5A9E4BCF6509A7F39789F515AB8F92DDBCBD414D940E93",16),F=new ECCurveFp(F,e,r),e=F.decodePointHex("0432C4AE2C1F1981195F9904466A39C9948FE30BBFF2660BE1715A4589334C74C7BC3736A2F4F6779C59BDCEE36B692153D0A9877CC62A474002DF32E52139F0A0");return{curve:F,G:e,n:new BigInteger("FFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFF7203DF6B21C6052B53BBF40939D54123",16)}}function generateKeyPairHex(){var F=new BigInteger(n.bitLength(),rng).mod(n.subtract(BigInteger.ONE)).add(BigInteger.ONE),e=leftPad(F.toString(16),64),F=G.multiply(F);return{privateKey:e,publicKey:"04"+leftPad(F.getX().toBigInteger().toString(16),64)+leftPad(F.getY().toBigInteger().toString(16),64)}}function parseUtf8StringToHex(F){for(var e=(F=unescape(encodeURIComponent(F))).length,r=[],t=0;t<e;t++)r[t>>>2]|=(255&F.charCodeAt(t))<<24-t%4*8;for(var n=[],t=0;t<e;t++){var a=r[t>>>2]>>>24-t%4*8&255;n.push((a>>>4).toString(16)),n.push((15&a).toString(16))}return n.join("")}function parseArrayBufferToHex(F){return Array.prototype.map.call(new Uint8Array(F),function(F){return("00"+F.toString(16)).slice(-2)}).join("")}function leftPad(F,e){return F.length>=e?F:new Array(e-F.length+1).join("0")+F}function arrayToHex(F){for(var e=[],r=0,t=0;t<2*F.length;t+=2)e[t>>>3]|=parseInt(F[r],10)<<24-t%8*4,r++;for(var n=[],t=0;t<F.length;t++){var a=e[t>>>2]>>>24-t%4*8&255;n.push((a>>>4).toString(16)),n.push((15&a).toString(16))}return n.join("")}function arrayToUtf8(F){for(var e=[],r=0,t=0;t<2*F.length;t+=2)e[t>>>3]|=parseInt(F[r],10)<<24-t%8*4,r++;try{for(var n=[],t=0;t<F.length;t++){var a=e[t>>>2]>>>24-t%4*8&255;n.push(String.fromCharCode(a))}return decodeURIComponent(escape(n.join("")))}catch(F){throw new Error("Malformed UTF-8 data")}}function hexToArray(F){for(var e=[],r=(F=(r=F.length)%2!=0?leftPad(F,r+1):F).length,t=0;t<r;t+=2)e.push(parseInt(F.substr(t,2),16));return e}module.exports={getGlobalCurve:getGlobalCurve,generateEcparam:generateEcparam,generateKeyPairHex:generateKeyPairHex,parseUtf8StringToHex:parseUtf8StringToHex,parseArrayBufferToHex:parseArrayBufferToHex,leftPad:leftPad,arrayToHex:arrayToHex,arrayToUtf8:arrayToUtf8,hexToArray:hexToArray};