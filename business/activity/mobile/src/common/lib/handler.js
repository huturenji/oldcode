import request from '@/utils/request';

/*
 * 获得活动详情
 * data：请求参数
 */
export function getActivityDetail(data){
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/activityDetail',
        header:{"Content-Type": "application/json"},
        data
    })
}

/*
 * 预览抽奖详情
 * data：请求参数
 */
export function getPreActivityDetail(data){
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/preActivityDetail',
        header:{"Content-Type": "application/json"},
        data
    })
}

/*
 * 开始抽奖
 * data：请求参数
 */
export function startToDraw(data){
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/draw',
        header:{"Content-Type": "application/json"},
        data
    })
}

/*
 * 奖品兑换详情
 * data：请求参数
 */
export function getPrizeDetail(data){
    return request({
        url: 'activitystudio/lottery/v1/prizeDetail',
        data
    })
}

/*
 * 我的奖品列表
 * data：请求参数
 */
export function myWinList(data){
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/myWinList',
        header:{"Content-Type": "application/json"},
        data
    })
}

/*
 * 判断分页是否还有数据
 */
export function checkPaginationHasMore(
    pageIndex,
    pageSize,
    total
) {
    return pageIndex * pageSize < total * 1;
}

/*
 * 根据id获取奖品详情
 */
export function getPrizeDetailByRecordId(data){
    return request({
        url: 'activitystudio/lottery/v1/getPrizeDetailByRecordId',
        data
    })
}

/*
 * 获取剩余抽奖次数
 * data：请求参数
 */
export function remainCount(data) {
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/remainCount',
        header: {"Content-Type": "application/json"},
        data
    })
}

// 线下奖品兑奖
export function redeem(data) {
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/redeem',
        header: { "Content-Type": "application/json" },
        data
    })
}

// 现场抽奖报名校验
export function userRegistrationValid(data) {
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/userRegistrationValid',
        data
    })
}

// 现场抽奖报名
export function userRegistration(data) {
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/userRegistration',
        data
    })
}

// 现场抽奖详情
export function liveRaffleDetail(data) {
    return request({
        method: 'GET',
        url: 'activitystudio/lottery/v1/detail',
        data
    })
}

/**
 * 获取用户中奖状态
 */
export function userDrawState(data){
    return request({
        method: 'POST',
        url: 'activitystudio/lottery/v1/userDrawState',
        data
    });
}

/**
 * 获取大屏配置
 */
export function getLiveRaffleConfig(data){
    return request({
        method: 'GET',
        url: 'activitystudio/lottery/v1/getScreenConfig',
        data
    });
}