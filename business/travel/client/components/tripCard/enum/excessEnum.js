
const orderType = {
    1: 'flight',
    2: 'hotel',
    3: 'train',
}

/**
 * 获取订单类型
 * @param type 订单类型 
 */
export function getOrderType (type) {
    return !!type ? orderType[type] : ''
}

