export var PRODUCT_TYPE = {
    personal: {
        code: 0,
        path: ['personal/index.html', 'personal.html'],
        route: '/'
    },
    criterion: {
        code: 1,
        path: ['personal/index.html', 'personal.html'],
        route: '/criterion'
    },
    trip: {
        code: 2,
        path: ['trip/index.html', 'trip.html'],
        route: '/'
    },
    flight: {
        code: 3,
        path: ['flight/index.html', 'flight.html'],
        route: '/'
    },
    train: {
        code: 4,
        path: ['train/index.html', 'train.html'],
        route: '/'
    },
    hotel: {
        code: 5,
        path: ['hotel/index.html', 'hotel.html'],
        route: '/'
    },
    car: {
        code: 6,
        path: ['car/index.html', 'car.html'],
        route: '/'
    },
    order: {
        code: 7,
        path: ['order/index.html', 'myOrder.html'],
        route: '/'
    },
    express: {
        code: 8,
        path: ['express/index.html', 'express.html'],
        route: '/'
    },
    invoice: {
        code: 9,
        path: ['invoice/index.html', 'invoiceManage.html'],
        route: ['/','/check/pc','/check/app']
    }
}


export function getCurrBisType(){
    let pathname = location.pathname;
    let hash = location.hash;
    let startInd = hash.indexOf('#');
    let endInd = hash.indexOf('?');
    hash = hash.substring(startInd+1, endInd==-1?hash.length:endInd);//只截取路由部分
    let bisKeys = Object.keys(PRODUCT_TYPE).filter(key => {
        let type = PRODUCT_TYPE[key];
        //1.先判断html路径匹配
        if(type.path.some(path => pathname.indexOf(path) > -1)){
            //2.再判断路由匹配
            if (type.route instanceof Array) { //路由可配置为数组
                return type.route.some(route => {
                    return hash == route;
                })
            }
            return hash == type.route;
        }
        return false
    })
    //一个url只可能匹配一种类型
    return bisKeys.length>0 ? PRODUCT_TYPE[bisKeys[0]].code : null;
}
