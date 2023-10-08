/**
 * 根据key获取cookie的值
 * @param {Object} key
 */
export function getCookie(key) {
    var str = document.cookie; // 获取Cookie字符串
    if (!str || str.indexOf(key + "=") < 0) // 寻找name=
      return;
    var cookies = str.split("; "); // 用;将所有的Cookie分隔开
    for (var i = 0; i < cookies.length; i++) {
      // 遍历每个Cookie
      var cookie = cookies[i]; // 当前Cookie
      if (cookie.indexOf(key + "=") == 0) {
        // 如果名字为name
        var value = cookie.substring(key.length + 1); // 获取value
        return decodeURI(value); // 将value解码，并返回
      }
    }
  }
  
  /**
   * 设置cookie
   * @param {Object} key      key
   * @param {Object} value       值
   * @param {Object} expiredays  失效时间
   */
  export function setCookie(key, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = key + "=" + encodeURI(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/");
  }
  
  /**
   * 删除cookie
   * @param {Object} key
   */
  export function delCookie(key) {
    var curVal = getCookie(key);
    var exp = new Date();
    exp.setTime(exp.getTime() - 10);
    if (null != curVal) {
      document.cookie = key + '=' + encodeURI(curVal) + ';expires=' + exp.toGMTString();
    }
  }
  
  /**
   * 设置storage
   * @param {Object} key
   * @param {Object} value
   */
  export function setStorage(key, value) {
    var storage = window.localStorage;
    storage.setItem(key, value)
  }

    /**
 * 获取storage
 * @param {Object} key
 */
export function getStorage(key) {
    if (window.localStorage) {
      var storage = window.localStorage;
      return storage.getItem(key);
    } else {
      getCookie(key);
    }
}
  /**
 * 删除storage
 * @param {Object} key
 */
export function removeStorage(key) {
    if (window.localStorage) {
      var storage = window.localStorage;
      return storage.removeItem(key);
    } else {
      delCookie(key);
    }
  
  }
  
  /**
   * 删除storage  
   * todo  需要弃用
   * @param {Object} key
   */
  export function deleteStorage(key) {
    if (window.localStorage) {
      var storage = window.localStorage;
      // var cpy = storage.getItem('cpyId');
      var UAId = storage.getItem('uaid');
      if (!!UAId) {
        if ("undefined" != typeof (storage.getItem(UAId + '_' + key)) && null != storage.getItem(UAId + '_' + key) && "" != storage.getItem(UAId + '_' + key)) {
          return storage.removeItem(UAId + '_' + key);
        } else {
          return "";
        }
      } else {
        //alert('请先登录！');//调试用，上线前去掉。
      }
    } else {
      delCookie(key);
    }
  }
  
  /**
   * 设置session
   * @param {Object} key
   * @param {Object} value
   */
  export function setSession(key, value) {
    var storage = window.sessionStorage;
    storage.setItem(key, value)
  }


  /**
   * 获取session
   * @param {Object} key
   */
  export function getSession(key) {
    if (window.sessionStorage) {
      var storage = window.sessionStorage;
      return storage.getItem(key);
    } else {
      getCookie(key);
    }
  
  }
  
  /**
   * 删除session
   * @param {Object} key
   */
  export function removeSession(key) {
      try{
          if (window.sessionStorage) {
              var storage = window.sessionStorage;
              return storage.removeItem(key);
            }
      }catch(e){console.info('removeSession error: '+e)}
  }

