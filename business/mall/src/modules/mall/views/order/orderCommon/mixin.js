/*
 * 订单混入的公共参数
 */
import extendUtils from 'common/lib/utils';
var orderMixins = {
    methods: {
        /****
         * 处理快递物流信息的展示
         */
        formatedDomStr(domStr, phone){
            let that = this;
            if(!!!domStr || !!!phone){return domStr};
            //以下的逻辑是为了 将电话添加拨打电话的功能
            window.callPhone = function(event){
                const e = event || window.event;
                e.stopPropagation(); //阻止事件冒泡
                extendUtils.callNativeTel(phone)
            }
            let reg = eval("/" + phone + "/ig");
            let replaceHtml = `<a class='call_phone' onclick="callPhone(event)">${phone}</a>`;
            return domStr.replace(reg, replaceHtml);
        },
    },
}
  
export default orderMixins;
  
     
  
      
      
  
  