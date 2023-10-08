function utf8Encode(string) {
    string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    let utftext = '',
        start,
        end;
    let stringl = 0,
        n;

    start = end = 0;
    stringl = string.length;

    for (n = 0; n < stringl; n++) {
        let c1 = string.charCodeAt(n);
        let enc = null;

        if (c1 < 128) {
            end++;
        } else if ((c1 > 127) && (c1 < 2048)) {
            enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

function utf8Decode(utftext) {
    var string = "";  
    var i = 0;  
    var c = 0,c2=0,c3=0; 
    while ( i < utftext.length ) {  
        c = utftext.charCodeAt(i);  
        if (c < 128) {  
            string += String.fromCharCode(c);  
            i++;  
        } else if((c > 191) && (c < 224)) {  
            c2 = utftext.charCodeAt(i+1);  
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
            i += 2;  
        } else {  
            c2 = utftext.charCodeAt(i+1);  
            c3 = utftext.charCodeAt(i+2);  
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
            i += 3;  
        }  
    }  
    return string;  
}

/**
 * base64加解密
 */
class Base64 {
    constructor() {
        
    }

    base64Encode(data) {
        let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let o1,
            o2,
            o3,
            h1,
            h2,
            h3,
            h4,
            bits,
            i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];
        if (!data) {
            return data;
        }
        data = utf8Encode(data);
        do {
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);
    
            bits = o1 << 16 | o2 << 8 | o3;
    
            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
    
        enc = tmp_arr.join('');
    
        switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
        default:    
        }
    
        return enc;
    }

    base64Decode(data) {
        let b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        data = data.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < data.length) {  
            enc1 = b64.indexOf(data.charAt(i++));  
            enc2 = b64.indexOf(data.charAt(i++));  
            enc3 = b64.indexOf(data.charAt(i++));  
            enc4 = b64.indexOf(data.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = utf8Decode(output);  
        return output; 
    }

}

export default new Base64()