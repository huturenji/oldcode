/*
 功能：扩展方法，公共方法
author：yangguang
date：2016年12月15日
 */
/*******************************原生方法 start*****************************************/

/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
/**
 * 日期增加天数 返回增加天数之后的日期
 * @param {Object} num
 */
Date.prototype.addDay = function (num) {
  if (!isNaN(num)) this.setDate(this.getDate() + parseInt(num));
  return this;
} //给日期原型加个方法
/**
 * 数组是否包含元素
 * @param {Object} ele
 */
Array.prototype.contains = function (ele) {
  for (var i in this) {
    if (this[i] == ele) return true;
  }
  return false;
}

/**
 * 字符串全部替换
 * @param {Object} s1
 * @param {Object} s2
 */
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, "gm"), s2); //g全局
}
//去尾法
Number.prototype.toFloor = function (num) {
  return Math.floor(this * Math.pow(10, num)) / Math.pow(10, num);
};

//进一法
Number.prototype.toCeil = function (num) {
  return Math.ceil(this * Math.pow(10, num)) / Math.pow(10, num);
};

//四舍五入法
Number.prototype.toRound = function (num) {
  return Math.round(this * Math.pow(10, num)) / Math.pow(10, num);
};

Array.prototype.findIndex = (Array.prototype.findIndex || function(data){
    var findIndex = (array, value) => {
        let _index = -1;
        if (!array || array.length == 0) {
            return _index;
        }
        let _value = value;
        let _key = null;
    
        //value是函数，则直接用函数匹配
        if (value.constructor === Function) {
            array.some((obj, index) => {
                if (value(obj)) {
                    _index = index;
                    return true;
                }
            })
            return _index;
        }
    
        //value是对象，则取第一个key进行过滤
        //其他情况，直接用value匹配过滤
        if (value.constructor === Object) {
            let keys = Object.keys(value);
            if (keys.length == 0) {
                return _index;
            }
            _key = keys[0];
            _value = value[_key];
        }
        array.some((obj, index) => {
            if (!!_key && obj.constructor === Object) {
                obj = obj[_key];
            }
            if (obj == _value) {
                _index = index;
                return true;
            }
        })
        return _index;
    }
    return findIndex(this, data)
})

Array.prototype.find = (Array.prototype.find || function(data){
    var find = (array, value) => {
        let _findEntry;
        if (!array || array.length == 0) {
            return _findEntry;
        }
        //value是函数，则直接用函数匹配
        if (value.constructor === Function) {
            array.some(obj => {
                if (value(obj)) {
                    _findEntry = obj;
                    return true;
                }
            })
            return _findEntry;
        }
        return _findEntry;
    }
    return find(this, data)
})

/**
 * 自己实现一个Promise.allSettled函数。因为有的浏览器不支持这个函数
 */
Promise.allSettled = Promise.allSettled || function (arr) {
    var P = this;
    return new P(function(resolve,reject) {
      if(Object.prototype.toString.call(arr) !== '[object Array]') {
    return reject(new TypeError(typeof arr + ' ' + arr +
        ' ' +' is not iterable(cannot read property Symbol(Symbol.iterator))'));
  }
  var args = Array.prototype.slice.call(arr);
  if (args.length === 0) return resolve([]);
  var arrCount = args.length;

  function resolvePromise(index, value) {
    if(typeof value === 'object') {
      var then = value.then;
      if(typeof then === 'function'){
        then.call(value,function(val) {
          args[index] = { status: 'fulfilled', value: val};
            if(--arrCount === 0) {
               resolve(args);
                }
         }, function(e) {
               args[index] = { status: 'rejected', reason: e };
           if(--arrCount === 0) {
                 resolve(args);
               }
             })
           }
         }
       }

        for(var i = 0; i < args.length; i++){
          resolvePromise(i, args[i]);
        }
     })
}
/*******************************原生方法 end*****************************************/


/******************************自定义方法 start**************************************/

/**加载js文件
 * @param {Object} data  //加载js文件的相关属性
 */
 let scriptLoader = {}
 export async function loadScript(data){
    if(!document.getElementById(data.id)){
        var script=document.createElement("script");
        script.setAttribute('id', data.id);
        script.type="text/javascript";
        script.src= data.src;
        
        //如果短时间内同时加载同一个js，则必须等待第一个js的onload执行完后，才能直接执行下一个的onload
        let scriptLoadedReslove = null;
        let scriptLoaded = new Promise(reslove=>{scriptLoadedReslove = reslove})
        script.onload = async function(){
            await data.onload();
            scriptLoadedReslove();
            delete scriptLoader[data.id];//执行完就删掉
        };
        scriptLoader[data.id] = scriptLoaded;

        document.getElementsByTagName('body')[0].appendChild(script);
    }else{
        let scriptLoaded = scriptLoader[data.id];
        //如果已加载了一个，则等待上一个执行完
        if(scriptLoaded){
            await scriptLoaded;
        }
        data.onload&&data.onload();
    }
}

/**
 * 
 */
export function firstLetterUpCase(str){
    if(!str){
        return str;
    }
    let firstLetter = str.substr(0,1).toUpperCase();
    return firstLetter+(str.length>1?str.substring(1):'');
}

/**
 * 转换星期
 * @param {*} index 天数
 * @param {*} type 1-星期 2-礼拜 其他周
 */
export function indexToWeek(index, type) {
    if(0>Number(index)||6<Number(index)) return '';
    let dayCycleArray = ['一','二','三','四','五','六'];
    (1==type||2==type)?dayCycleArray.unshift('天'):dayCycleArray.unshift('日');
    return (1==type?'星期':(2==type?'礼拜':'周')) + dayCycleArray[index];
}

//数字转中文
export function numToChinese(section) {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
  var chnUnitChar = ["", "十", "百", "千"];
  var strIns = '',
    chnStr = '';
  var unitPos = 0;
  var zero = true;
  while (section > 0) {
    var v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}

/**
 * 判断是否PC端
 */
export function isPC() {
  return getNavigatorType()=='pc';
}

/**
 * 判断浏览器类型
 * return pc，android，ios
 */
export function getNavigatorType() {
    var userAgentInfo = window.navigator.userAgent;
    if(/android/i.test(userAgentInfo)){
        return 'android';
    }else if(/(iPhone|iPad|iPod|iOS)/i.test(userAgentInfo)){
        return 'ios';
    }else if(/SymbianOS/i.test(userAgentInfo)){
        return 'symbian';
    }else if(/Windows Phone/i.test(userAgentInfo)){
        return 'winPhone';
    }else {
        return 'pc';
    }
}

//时间最后一位补零
export function addZero(time) {
  let result = time;
  if (time < 0) {
    return;
  }
  if (time >= 10 && (time % 10) == 0) {
    result = parseInt(time / 10) + '0';
  } else if (time < 10) {
    result = '0' + result;
  }
  return result;
}

//TODO 短时间调用多次只触发一次
/**
 * 获取当前函数的节流函数(就是在xx毫秒内只能触发一次func)
 *
 * @param {any} func
 * @param {any} context func的上下文环境
 * @param {Number} timeout 节流时间
 */
export var throttle = (function() {
    var Tready = true;
    return function(func, context,timeout){
        if(Tready){
            Tready = false;
            func.call(context);
            window.setTimeout(function(){
                Tready = true;
            },timeout||1000);
        }
    };
})();

/**
 * 给数字num前面补零，不足length的前面补length-num.length个零，超过length的前面截取
 * @param {Object} num
 * @param {Object} length
 */
export function prefixInteger(num, length) {
  var num = (num + '').replace(/d/g, '');
  return (Array(length).join('0') + num).slice(-length);
}


//数组补位
export function pad(num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

// 数组去重
export function removeDuplicatedItem(arr) { 
  for(var i = 0; i < arr.length-1; i++){
       for(var j = i+1; j < arr.length; j++){
           if(arr[i]==arr[j]){
             arr.splice(j,1)
              j--
           }
       }
   }
   return arr
}

/**
 * 插入特定位置的字符串
 * @param str 原字符串
 * @param flg 插入字符
 * @param sn  插入位置
 * @returns {String}
 */
export function insert_flg(str, flg, sn) {
  var newstr = "";

  if (3 > str.length) { //如果sn为负数
    str = pad(str, 3);
    sn = 1;
  }

  var arr = str.split("");

  for (var i = 0; i < arr.length; i++) {
    if (i == sn) {
      newstr += flg;
    }
    newstr += arr[i];
  }

  return newstr;
}

/**
 * 字符串整数相加
 * @param {Object} a
 * @param {Object} b
 */
export function sumStrings(a, b) {
  a = a + "";
  b = b + "";
  var res = '',
    c = 0;
  a = a.split('');
  b = b.split('');
  while (a.length || b.length || c) {
    c += ~~a.pop() + ~~b.pop();
    res = c % 10 + res;
    c = c > 9;
  }
  return res.replace(/^0+/, '');
}

/**
 * 格式化数据   100-->1.00元
 * @param {Object} ms
 */
export function moneyStringFixTwo(ms) {
  var moneyDis = "";
  ms = ms + "";
  if (ms.length < 3) { //小数
    ms = pad(ms, 3);
  }
  moneyDis = insert_flg(ms, ".", (ms.length - 2));
  var l = moneyDis.split(".")[0].split("").reverse(),
    r = moneyDis.split(".")[1],
    t = "";
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  var moneyDisBig = t.split("").reverse().join("") + "." + r + "元";
  return moneyDisBig;
}

/**
 * 转换Arr为加上str型数据
 * @param {Object} arr 列表字段
 * @param {Object} arrJson 列表数据
 * @param {Object} str  插入字符串
 */
export function transArrToStr(arr, arrJson, str) {
  var result = "";
  if (0 > arr.length) {
    return result;
  }
  arr.forEach(function (i) {
    result += "${" + (arrJson[i] || '0') + "}" + str;
  });

  if (0 < result.length) {
    result = result.substr(0, result.length - 1);
  }
  return result;
}

/**
 * 金额转大写 传入不带小数点的正整数   至少三位
 * @param {Object} num
 */
export function moneyUppercase(num) {
  var Num = num + "";
  Num = insert_flg(Num, ".", (Num.length - 2));
  var part = Num.split(".");
  var newchar = "";
  var perchar = "";
  var tmpnewchar = "";
  for (var i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 20) {
      tipsBox("数字过大，无法计算");
      return "";
    }
    tmpnewchar = "";
    perchar = part[0].charAt(i);
    switch (perchar) {
      case "0":
        tmpnewchar = "零" + tmpnewchar;
        break;
      case "1":
        tmpnewchar = "壹" + tmpnewchar;
        break;
      case "2":
        tmpnewchar = "贰" + tmpnewchar;
        break;
      case "3":
        tmpnewchar = "叁" + tmpnewchar;
        break;
      case "4":
        tmpnewchar = "肆" + tmpnewchar;
        break;
      case "5":
        tmpnewchar = "伍" + tmpnewchar;
        break;
      case "6":
        tmpnewchar = "陆" + tmpnewchar;
        break;
      case "7":
        tmpnewchar = "柒" + tmpnewchar;
        break;
      case "8":
        tmpnewchar = "捌" + tmpnewchar;
        break;
      case "9":
        tmpnewchar = "玖" + tmpnewchar;
        break;
    }
    switch ((part[0].length - i - 1) % 8) {
      case 0:
        switch ((part[0].length - i - 1) / 8) {
          case 0:
            tmpnewchar = tmpnewchar + "元";
            break;
          case 1:
            tmpnewchar = tmpnewchar + "亿";
            break;
          default:
            break;
        }

        break;
      case 1:
        if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
        break;
      case 2:
        if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
        break;
      case 3:
        if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
        break;
      case 4:
        if (part[0].substr(0, 4) > 0) tmpnewchar = tmpnewchar + "万";
        break;
      case 5:
        if (perchar != 0) tmpnewchar = tmpnewchar + "拾";
        break;
      case 6:
        if (perchar != 0) tmpnewchar = tmpnewchar + "佰";
        break;
      case 7:
        if (perchar != 0) tmpnewchar = tmpnewchar + "仟";
        break;
    }
    newchar = tmpnewchar + newchar;
  }
  if (Num.indexOf(".") != -1) {
    if (part[1].length > 2) {
      part[1] = part[1].substr(0, 2)
    }
    for (var i = 0; i < part[1].length; i++) {
      tmpnewchar = "";
      perchar = part[1].charAt(i)
      switch (perchar) {
        case "0":
          tmpnewchar = "零" + tmpnewchar;
          break;
        case "1":
          tmpnewchar = "壹" + tmpnewchar;
          break;
        case "2":
          tmpnewchar = "贰" + tmpnewchar;
          break;
        case "3":
          tmpnewchar = "叁" + tmpnewchar;
          break;
        case "4":
          tmpnewchar = "肆" + tmpnewchar;
          break;
        case "5":
          tmpnewchar = "伍" + tmpnewchar;
          break;
        case "6":
          tmpnewchar = "陆" + tmpnewchar;
          break;
        case "7":
          tmpnewchar = "柒" + tmpnewchar;
          break;
        case "8":
          tmpnewchar = "捌" + tmpnewchar;
          break;
        case "9":
          tmpnewchar = "玖" + tmpnewchar;
          break;
      }
      if (i == 0) tmpnewchar = tmpnewchar + "角";
      if (i == 1) tmpnewchar = tmpnewchar + "分";
      newchar = newchar + tmpnewchar;
    }
  }
  while (newchar.search("零零") != -1) {
    newchar = newchar.replace("零零", "零");
  }
  newchar = newchar.replace("零亿", "亿");
  newchar = newchar.replaceAll("零万", "万");
  newchar = newchar.replace("亿万", "亿");
  newchar = newchar.replace("零元", "元");
  newchar = newchar.replace("零角", "");
  newchar = newchar.replace("零分", "");
  if (newchar == "") {
    newchar = "零元";
  }
  if (newchar.charAt(newchar.length - 1) == "元") {
    newchar = newchar + "整";
  }
  if (newchar.charAt(newchar.length - 1) == "拾" || newchar.charAt(newchar.length - 1) == "佰" || newchar.charAt(newchar.length - 1) == "仟" || newchar.charAt(newchar.length - 1) == "万") {
    newchar = newchar + "元整";
  }
  if (newchar == "元整") {
    newchar = "零元";
  }
  if (newchar.substring(0, 1) == "元") {
    newchar = newchar.substring(1, newchar.length);
  }
  return newchar;
}

/**
 * 判断对象是否为空，为空返回true，否则返回false
 * @param {Object} e
 */
export function isEmptyObject(e) {
  for (var t in e) {
    return !1;
  }
  return !0
}

/**
 * 判断a与b是否相等 暂时用来比较对象，后续需要扩展为比较任意对象
 * @param {Object} x
 * @param {Object} y
 */
export function isEqual(x, y) {
  if (x === y) {
    return true;
  }

  // If they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  //They must have the exact same prototype chain,the closest we can do is
  //test the constructor.
  if (x.constructor !== y.constructor) {
    return false;
  }

  for (var p in x) {
    //Inherited properties were tested using x.constructor === y.constructor
    if (x.hasOwnProperty(p)) {
      // Allows comparing x[ p ] and y[ p ] when set to undefined
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      // If they have the same strict value or identity then they are equal
      if (x[p] === y[p]) {
        continue;
      }

      // Numbers, Strings, Functions, Booleans must be strictly equal
      if (typeof (x[p]) !== "object") {
        return false;
      }

      // Objects and Arrays must be tested recursively
      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }

  for (p in y) {
    // allows x[ p ] to be set to undefined
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

/**
 * 数据转换  utf16转utf8
 * @param {Object} str
 */
export function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}
/**
 * 获取类型名称
 * @param {Object} object
 * __getClass(5); // => "Number"
 * __getClass({}); // => "Object"
 * __getClass(/foo/); // => "RegExp"
 * __getClass(''); // => "String"
 * __getClass(true); // => "Boolean"
 * __getClass([]); // => "Array"
 * __getClass(undefined); // => "Window"
 * __getClass(Element); // => "Constructor"
 *
 */
export function getClass(object) {
  return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

/**
 * showToast方法
 * @param {*} tipsText 
 * @param {*} time 
 * @param {*} paramObj 
 */
function tipsBox(tipsText, time,paramObj={}) {
    let animateTime = paramObj.animateTime || 350;
    let animateLoop = paramObj.animateLoop || 25;
    let delayTime = time || 2000;
    //toast单例，多次弹出，只显示第一个
    if(document.getElementsByClassName('showToastBox').length>0){
        return;
    }
    //定义并加载样式
    let s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.setAttribute('class', 'showToastBox');
    s.innerHTML = '.showToastBox{display:block;position: fixed;right:0;bottom: 50%;left: 0;text-align: center;z-index: 100001;} .showToastBox span{max-width: 80%;min-height: 21px;margin: 0 auto;display: inline-block;border-radius: 10px;padding:15px 20px;font-size: 14px;line-height: 20px;text-align: justify;color: #fff;background: rgba(0,0,0,0.87);}';
   if(document.getElementsByClassName('showToastStyle').length == 0){
        document.getElementsByTagName('head')[0].appendChild(s);
    }
    //定义并加载Dom
    let d = document.createElement('div');
    d.setAttribute('class', 'showToastBox');
    d.setAttribute('id', 'animate');
    d.innerHTML = '<span onclick="this.remove();">'+tipsText+'</span>';
    document.body.appendChild(d);
    //延迟执行hide动画
    let setTimeoutFun = setTimeout(() => {
        let addNum = 0;
        let intervalFun = setInterval(()=>{
            if (addNum >= animateTime) {
                clearInterval(intervalFun);
                d.remove();
                s.remove();
            } else {
                addNum+=animateLoop; 
                d.style.opacity = (animateTime-addNum)/animateTime; 
            }
        }, animateLoop);                
    }, delayTime);
}

/**
 * 弹框提示
 * @param {Object} tips  提示内容
 * @param {Object} type  提示类型  text-普通文本  success-提示成功  error-失败提示
 */
export function showToast(tips, position, time, type) {
  tipsBox(tips, time);
  return;
}

/**
 * 通过身份证号码得到性别
 *  身份证号码 return 1/2 男/女
*/
export function getSexForCard(code){
  let inputStr = code.toString();
  let sex;
  if (inputStr.length == 18) {
      sex = inputStr.charAt(16);
      if (sex % 2 == 0) {
          return 2;
      } else {
          return 1;
      }
  } else {
      sex = inputStr.charAt(14);
      if (sex % 2 == 0) {
          return 2;
      } else {
          return 1;
      }
  }
}
//计算地球上两点之间距离(经纬度)  
export function getFlatternDistance(latS, lngS, latE, lngE) {
  let lat1 = parseFloat(latS);
  let lng1 = parseFloat(lngS);
  let lat2 = parseFloat(latE);
  let lng2 = parseFloat(lngE);
  var EARTH_RADIUS = 6378137.0; //单位M
  var PI = Math.PI;

  var f = ((lat1 + lat2) / 2) * PI / 180.0;
  var g = ((lat1 - lat2) / 2) * PI / 180.0;
  var l = ((lng1 - lng2) / 2) * PI / 180.0;

  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);

  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;

  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;

  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;

  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;

  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

/**
 * 计算两个时间的时间差，返回xx天xx小时xx分，以数组形式返回
 * @param {*} t1 endTime
 * @param {*} t2 startTime
 */
export function dateDiff(t1, t2) {
  if (t1 > t2) {
    let tdis = t1 - t2;
    let daysDis = tdis / (24 * 3600 * 1000);
    let days = Math.floor(daysDis); //天数

    let dayLeave = tdis % (24 * 3600 * 1000); //剩余小时数
    let hoursDis = dayLeave / (3600 * 1000);
    let hours = Math.floor(hoursDis); //小时数

    let hoursLeave = dayLeave % (3600 * 1000); //剩余分钟数
    let minutesDis = hoursLeave / (60 * 1000);
    let minutes = Math.floor(minutesDis); //分钟数
    return [days, hours, minutes];
  }
  return [];
}
/**
 * 
 * 
 * 查找指定年月的天数
 * @param year
 * @param month
 * @returns {number}
 */
export  function getLastDay(year,month){ // 例 year  2018 month 5  返回31 
  var new_year = year;    //取当前的年份          
  var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
  if(month>12) {         
   new_month -=12;        //月份减          
   new_year++;            //年份增          
  }
  var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天          
  return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期
}


/**
 * 将json字符串的首字母转为大写
 */
export function convertJSONFirstCha(jsonObj) {
  let ReturnJsonObj = {};
  for (var p in jsonObj) {
    ReturnJsonObj[convertFirstCha(p)] = isJsonString(jsonObj[p]) ? convertJSONFirstCha(jsonObj[p]) : jsonObj[p];
  }
  return ReturnJsonObj;
}

/**
 * 是否是JSON对象
 */
export function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {

  }
  return false;
}
/**
 * 将str字符串首字母改成大写
 */
export function convertFirstCha(str) {
  var replace = str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
  return replace;
}


/**
 * 生产随机数 函数
 */
export function GUID() {
    this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
    if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
        GUID.prototype.newGUID = function () {
            this.date = new Date();
            var guidStr = '';
            var sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
            var sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
            for (var i = 0; i < 9; i++) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            guidStr += sexadecimalDate;
            guidStr += sexadecimalTime;
            while (guidStr.length < 32) {
                guidStr += Math.floor(Math.random() * 16).toString(16);
            }
            return this.formatGUID(guidStr);
        }
        /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
        GUID.prototype.getGUIDDate = function () {
            return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
        }
        /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
        GUID.prototype.getGUIDTime = function () {
            return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
        }
        /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
        GUID.prototype.addZero = function (num) {
            if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                return '0' + Math.floor(num);
            } else {
                return num.toString();
            }
        }
        /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
            if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
            else { return parseInt(num.toString()).toString(x); }
        }
        /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
        GUID.prototype.formatGUID = function (guidStr) {
            var str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
            return str1 + str2 + str3 + str4 + str5;
        }
    }
}

/**
 * 获取客户端ip地址
 * @param {Object} onNewIP 监听获取ip的function ，如function(ip){alert(ip)}  
 */
export function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
  //compatibility for firefox and chrome
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var pc = new myPeerConnection({
      iceServers: []
    }),
    noop = function () {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function iterateIP(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  //create a bogus data channel
  pc.createDataChannel("");
  // create offer and set local description
  pc.createOffer().then(function (sdp) {
    sdp.sdp.split('\n').forEach(function (line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(iterateIP);
    });
    pc.setLocalDescription(sdp, noop, noop);
  }).catch(function (reason) {
    // An error occurred, so handle the failure to connect
  });
  //sten for candidate events
  pc.onicecandidate = function (ice) {
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
  };
}


export function sortedUniq(array, iteratee) {
    if(array == null || array.length==0){
        return [];
    }
    function eq(value, other) {
        return value === other || (value !== value && other !== other);
    }
    let seen
    let index = -1//循环索引
    let resIndex = 0//结果数组索引
  
    const { length } = array//数组长度
    const result = []//结果数组
  
    while (++index < length) {
      const value = array[index], computed = iteratee ? iteratee(value) : value
      //value是原数组的当前值，computed是遍历器处理后的当前值
      if (!index || !eq(computed, seen)) {//如果是第一个元素或者，与之前的元素不相等
        seen = computed//存下新出现的元素，然后给结果数组里赋值
        result[resIndex++] = value === 0 ? 0 : value
        //结果数组结尾插入新值，排除-0的影响
      }
    }
    return result
  }

  /**
   * 获取app版本 例如 window.navigator.appVersion为5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36/sinosun 0.1.7 Bizmate 66 121
   * @param {*} param 扩展参数
   */
  export function getAppVersion(param){
    let versionArr = ((window.navigator.userAgent.match(/[^\/]+$/)||[])[0]||'').split(' ');
    if(5>versionArr.length){
      return null;
    }
    let res = {
      platform:versionArr[0],//平台名称，相当于渠道  例子中结果为sinosun
      version:versionArr[1],//app版本  例子结果为0.1.7
      product:versionArr[2],//产品名称 例子结果为Bizmate
      statusBarHeight:versionArr[3],//statusBar高度，单位为px 例子结果为66px
      titleBarHeight:versionArr[4]//titleBar高度，单位为px  例子结果为121px
    }
    if(param){
      return res(param);
    }else{
      return res;
    }
  }
  const BIZMATE_NAME = 'BIZMATE'
  /**
   * 获取bizmate的版本号 如果没有版本号则返回null
   */
  export function getBizMateVersion(){
    let appVersion = getAppVersion() || {};
    if(BIZMATE_NAME==(appVersion.product||'').toUpperCase()){
      return appVersion.version;
    }
    return null;
  }
/******************************自定义方法 end**************************************/


/******************************页面url相关方法 start**************************************/

/**
 * 获取当前url的参数
 */
export function getUrlParams(url = window.location.href) {
    var regexP = /[^#&\?]+=[^#&\?]*/ig,
      res = {};
    var ms = url.match(regexP);
    if (ms) {
      for (var i = 0; i < ms.length; i++) {
        var arr = ms[i].split('=');
        res[arr[0]] = decodeURIComponent(arr[1]);
      }
    }
    return res;
  }
/**
 * 获取用户信息参数的值
 * @param {*} key 
 */
export function getUserPara(key, url = window.location.href){
    let _value = null;
    let urlParas = (getUrlParams(url) || {});
    Object.keys(urlParas).forEach((_key)=>{
        if(key.toUpperCase() == _key.toUpperCase()){
            _value = urlParas[_key];
        }
    });
    let para = _value;
    return para!=null && para!=undefined && para!='null' && para!='undefined' ? para : null;
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值
export function replaceUrlParamVal(paramName,replaceWith) {
  var oUrl = window.location.href.toString();
  var re=eval('/('+ paramName+'=)([^&]*)/gi');
  var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
  history.replaceState(null,null,nUrl)
}

/**
 * 自动对url中的斜线修正.
 * @url 如果不传，表示处理当前页面地址，处理完后直接替换；如果有值，则返回处理后的值
 */
export function autoFixUrl(url){
  let windowUrl = false;
  if(!url){
    url = location.href;
    windowUrl = true;
  }
  let protocol = '';
  ['https://', 'http://'].forEach(pro => {
    if(url.startsWith(pro)){
      protocol = pro;
      url = url.substring(pro.length);
    }
  })

  if(url.indexOf('//')>-1){
    url = url.replace(/\/\//g, '/');
    windowUrl && history.replaceState(null, null, protocol + url);
  }
  return protocol + url;
}
/**
 * 处理ios的兼容问题
 * 在ios中，会将一个窗口的第一个url作为原始url，此后所有的页面跳转（location.href,window.open,iframe）中，如果当前url和原始url不一致，就会新开窗口
 * 所以在此重写location.reload，每次reload前，都先加上sswbv_multipage=false，防止ios多开页面
 */
export function reloadPage(){
    if('ios'==getNavigatorType()){
        let currHref = location.href;
        let iosHackStr = 'sswbv_multipage=false'
        let replaceUrl = currHref + (currHref.indexOf('?')>-1 ? '&' : '?') + iosHackStr;
        //如果当前url没有sswbv_multipage=false，就加上，再reload
        if(currHref.indexOf(iosHackStr)==-1){
            location.replace(replaceUrl);
        } 
    }
    location.reload();
}
/******************************页面url相关方法 end**************************************/