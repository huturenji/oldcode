import Confirm from '../components/confirm/index.js'
import store from '../store'
var Utils = {}

/**
 * 获取弹窗实例，如果已存在实例，则返回空对象。也就是说，一个页面，只会有一个弹窗
 */
const comfirmObj = new Confirm();
Utils.showConfirm = obj => {
  if(obj === false){
      comfirmObj.hide();
      return;
  }  
  comfirmObj.show({
    title: obj.title,
    content: obj.content,
    confirmStyle: obj.confirmStyle,
    cancelStyle: obj.cancelStyle,
    confirmText: obj.confirmText,
    cancelText: obj.cancelText,
    showConfirmButton: obj.showConfirmButton,
    showCancelButton: obj.showCancelButton,
    cancelColor: obj.cancelColor,
    confirmColor: obj.confirmColor || (store.state.config || {}).primaryColor,
    onConfirm: function () {
      obj.onConfirm && obj.onConfirm();
    },
    onCancel: function(){
      obj.onCancel && obj.onCancel();
    }
  });
}

Utils.loadScript = data => {
    var script=document.createElement("script");
    script.setAttribute('id', data.id);
    if(!document.getElementById(data.id)){
        script.type="text/javascript";
        script.src= data.src;
        script.onload = data.onload;
        script.onerror = data.onerror;
        document.getElementsByTagName('body')[0].appendChild(script);
    }else{
        data.onload&&data.onload();
    }
}

Utils.merge = (object, source)=>{
    if(source==null || source==undefined){
        return object;
    }
    if(object==null || object==undefined){
        object = source
        return object;
    }
    Object.keys(source).forEach(key=>{
        let value = source[key];
        let type = Object.prototype.toString.call(value);
        if(type == '[object Object]'){
            object[key] = Utils.merge(object[key], value);
        }else{
            object[key] = value;
        }
    })
    return object;
}

Utils.isEmpty = obj => {
    if(obj==null || obj==undefined){
        return true;
    }
    if(Utils.isString(obj)){
        return obj.replace(/\s/g, '') == '';
    }
    if(Utils.isArray(obj)){
        return obj.length == 0;
    }
    if(Utils.isObject(obj)){
        return Object.keys(obj).length == 0;        
    }
    return false;
}


Utils.isStrictEmpty = obj => {
    return Utils.isEmpty(obj) || obj == 'undefined' || obj == 'null'
}

Utils.isNotEmpty = obj => {
    return !Utils.isEmpty(obj);
}

Utils.isNotStrictEmpty = obj => {
    return !Utils.isStrictEmpty(obj);
}

Utils.isString = obj => {
    return Object.prototype.toString.call(obj) == '[object String]';
}

Utils.isArray = obj => {
    return Object.prototype.toString.call(obj) == '[object Array]';
}

Utils.isObject = obj => {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

Utils.isNumber = obj => {
    return Object.prototype.toString.call(obj) == '[object Number]';
}

Utils.isFunction = obj => {
    return Object.prototype.toString.call(obj) == '[object Function]';
}

export default Utils