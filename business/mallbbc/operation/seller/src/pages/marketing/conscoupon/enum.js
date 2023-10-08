import React from 'react';
import Tag from '@/components/DotTag/tag.js';
import DotTag from '@/components/DotTag';
import { accDiv } from '@/utils/utils';

export const num2week = {
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '7': '周日'
};

export const week2num = {
    '周一':'1' ,
    '周二':'2' ,
    '周三':'3' ,
    '周四':'4' ,
    '周五':'5' ,
    '周六':'6' ,
    '周日':'7' 
};

export const couponContent = (couponType,publishValue,discountLimitAmount)=>{
    let content = ''
    // 固定金额
    if(couponType==1){
        content = `面值${publishValue}元`
    }
    // 折扣
    if(couponType==2){
        content = `${accDiv(publishValue,10)}折，最多优惠${discountLimitAmount}元`
    }
    return content
}


export const showShopName = (shopInfo,shopList=[])=>{
    let shopNames = ''
    if(shopInfo=='-1'){
        shopNames = '全部门店可用'
        return shopNames
    }
    if(shopInfo){
        let shopNameArr = []
        let arr = shopInfo.split(',')
        arr.forEach((item)=>{
            let ele = shopList.find(el=>el.shopId==item)
            if(ele){
                shopNameArr.push(ele.shopName)
            }   
        })
        shopNames = shopNameArr.join(',')
    }
    return shopNames
}

// 各个时间段一共选取的周数
export const hasselectWeek = (availableTime)=>{
    let _hasselectWeek = []
    availableTime.forEach((item)=>{
        _hasselectWeek = _hasselectWeek.concat(item.week)
    })
    return _hasselectWeek
}

// [1,2,3,4,5,6,7] 和  hasselectWeek 的差集 即可用周数
export const leaveWeek = (_hasselectWeek)=>{
    let week = ['1','2','3','4','5','6','7']
    let complement = week.filter(x => !new Set(_hasselectWeek).has(x))
    return complement
}

// 并集
export const myweekAndleaveWeek = (myweek,_leaveWeek)=>{
    let union=myweek.concat(_leaveWeek.filter(item=>myweek.indexOf(item)==-1));
    return union
}

// 检查是不是子集
export const checkSubset = (parentArray, subsetArray) => subsetArray.every((el) => parentArray.includes(el))

// { validator: (rule, value, callback) => validatorweek(rule, value, callback,availableTime,item) } 没法联动校验 废弃
export function validatorweek(rule, value, callback,availableTime,item) {

    let _hasselectWeek = hasselectWeek(availableTime)
    let _leaveWeek = leaveWeek(_hasselectWeek)
    let myOptional= myweekAndleaveWeek([...item.week],_leaveWeek)
    // 如果我选择的 在我可选里面   即value是myOptional的子集 验证通过 ,否则提示
    if(checkSubset(myOptional,value)){
        callback()
    }else{
        callback('周数存在交叉')
    }
}

// 检查时间是否存在交叉
export const checkTime = (timeArr,msg,text)=>{
    for (var i = 0; i < timeArr.length; i++) {
        var d1 = timeArr[i].startPoint;
        var d2 = timeArr[i].endPoint;
        for (var j = i + 1; j < timeArr.length; j++) {
            // j=i+1:使其不要与自身比较
            var t1 = timeArr[j].startPoint;
            var t2 = timeArr[j].endPoint;
            if ((d1 >= t1 && d1 < t2) || (d1 < t1 && d2 > t1)) {
                msg.push(`${text},时间段 ${ timeArr[i].index } 与 ${ timeArr[j].index } 的时间有交叉！`)
                console.log(`时间段 ${ timeArr[i].index } 与 ${ timeArr[j].index } 的时间有交叉！`);
            }else{console.log("无冲突")}
        }
    }
}

// 消费券状态
export const mapstate = (text)=>{
    switch(text) {
    case 2:
        return <Tag type='normal'>已失效</Tag>
    case 5:
        return <Tag type='normal'>已过期</Tag>
    case 6:
        return <Tag type='pending'>待审核</Tag>
    case 7:
        return <Tag type='failed'>审核拒绝</Tag>
    case 8:
        return <Tag type='sucess'>生效中</Tag> 
    default:
        return ''
    }
}

// 消费券使用状态
export const mapUseState = (text)=>{
    switch(text) {
                       
    case 1:
        return <Tag type='pending'>未使用</Tag>
    case 2:
        return <Tag type='sucess'>已使用</Tag>
    case 3:
        return <Tag type='normal'>已过期</Tag> 
    case 5:
        return <Tag type='normal'>已失效</Tag>
                 
    default:
        return ''
    }
}
