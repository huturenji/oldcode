
// 优惠券 方法，判断机票火车票酒店
// author: ruansheng
// data:2019年4月15日


let typeArr=[
    {code:1,type:'flight',name:'机票',name2:'国内机票',name3:'机票优惠券',urlName:'SWP-Flight'},
    {code:2,type:'hotel',name:'酒店',name2:'酒店',name3:'酒店优惠券',urlName:'SWP-Hotel'},
    {code:3,type:'train',name:'火车票',name2:'火车票',name3:'火车票优惠券',urlName:'SWP-Train'},
    {code:4,type:'transferAmount',name:'转账',name2:'转账',name3:'转账优惠券',urlName:'SWP-TransferAmount'}
]

/**
 * 根据pathname 获取 机票酒店火车票code/type/name
 * @param {string} inner 
 * @param {boolean} orText 
 */
export function getProductType(inner){
    let pathname=location.pathname
    let num=null
    typeArr.map((item,index)=>{
        if (pathname.indexOf(item.type)!=-1){
            num= typeArr[index][inner]
        }
    })
    return num 
}

/**
 * 根据ProductType (例:1234) 默认返回中英文名称，链接文件名称 <br>
 *  returnType可选（"code" "type" "name" "name2" "name3" "urlName"）
 * @param {number} ProductType  
 * @param {string} returnType   
 */
export function getCouponProduct(ProductType,returnType){
    if (!!ProductType){
        return !!returnType?typeArr[ProductType-1][returnType]:typeArr[ProductType-1].name
    }
}


// getProductName(code){
//     return getCouponProduct(code)
//  },