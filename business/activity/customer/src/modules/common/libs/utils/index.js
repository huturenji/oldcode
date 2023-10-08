export const downLoad_front = (fileType) => {
    var a = document.createElement('a');
    if (fileType == 'coupon_code') {
        a.href = './thirdparty/coupon_code.xls';
        a.download = '优惠券兑换码.xls';
    } else if(fileType=='exchange_code'){
        a.href = './thirdparty/exchange_code.xls';
        a.download = '兑换码.xls';
    }else if(fileType=='redpacket_code'){
        a.href = './thirdparty/redpacket_code.xls';
        a.download = '红包兑换码.xls';
    }else if(fileType=='inviteUser'){
        a.href = './thirdparty/inviteUser.xls';
        a.download = '抽奖资格.xls';
    }
    a.click();

}

/*
 * @param x {Object} 对象1
 * @param y {Object} 对象2
 * @return  {Boolean} true 为相等，false 为不等
 */
export const deepEqual = (x, y) => {
    // 指向同一内存时
    if (x === y) {
      return true;
    } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
      if (Object.keys(x).length !== Object.keys(y).length) {
        return false;
      }
      for (var prop in x) {
        if (y.hasOwnProperty(prop)) {  
          if (!deepEqual(x[prop], y[prop])) return false;
        } else {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
}