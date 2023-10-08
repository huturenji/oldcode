/**
 * 商品所有状态在这里声明和转换
 * 拒绝在业务代码中硬编码状态值。所有状态都应使用这个枚举中的对象属性
 */

//针对商品的上下架
export const ProductStatus = {
    1:{text:'已上架', stopSales:false},
    0:{text:'已下架', stopSales:true}
}

/*********库存接口返回状态
1x:有货
 10：现货-下单立即发货
 11：正在内部配货，预计2-6天到达本仓库
 12：可配货-下单后从有货仓库配货
 13：库存不足

2x：无货
 20：无货

3x：不可售
 30：暂不销售

4x：预定
 40：预定
 41：无货开预定 此时desc返回的数值代表预计到货天数，并且该功能需要依赖合同上有无货开预定权限的用户，到货周期略长，谨慎采用该功能。
***********/

//商品库存状态的相关枚举类
export const ProductStockStatus = {

    10: {
        text: '现货，下单后立即发货',
        textConfirm: '现货，下单后立即发货', //下单页面和商品详情页面显示的配货信息
        hasStocks: true,
        turn: 3, //该字段用展示在下单页面显示的文字提示顺序
    },
    11: {
        text: '内部配货中，预计2~6天到达仓库',
        textConfirm: '下单后可以调货，预计2-6天发货，具体以物流信息为准', //下单页面和商品详情页面显示的配货信息
        hasStocks: true,
        turn: 1, //该字段用展示在下单页面显示的文字提示顺序
    },
    12: {
        text: '有货，下单后从有货仓库配货',
        textConfirm: '下单后可以调货，预计2-6天发货，具体以物流信息为准', //下单页面和商品详情页面显示的配货信息
        hasStocks: true,
        turn: 2, //该字段用展示在下单页面显示的文字提示顺序
    },
    13: {
        text: '库存不足',
        textConfirm: '库存不足', //下单页面和商品详情页面显示的配货信息
        hasStocks: true
    },
    20: {
        text: '无货',
        hasStocks: false
    },
    30: {
        text: '暂不销售',
        hasStocks: false
    },
    40: {
        text: '预定中',
        hasStocks: false
    },
    41: {
        text: '无货开预定',
        hasStocks: false
    },
}

//商品活动状态的相关枚举类
export const ProductActivityStatus = {
    'NOT_STARTED': {
        text: '未开始',
        isPreheat: true, //是否是活动预热
        isGoingOn: false, //是否是活动进行中
        isEnded: false, //是否是活动已结束
        isGetSupplierPrice: true, //是否需要查询供应商的价格
    },
    'IN_PROGRESS': {
        text: '进行中',
        isPreheat: false, //是否是活动预热
        isGoingOn: true, //是否是活动进行中
        isEnded: false, //是否是活动已结束
        isGetSupplierPrice: true, //是否需要查询供应商的价格
    },
    'ENDED': {
        text: '已结束',
        isPreheat: false, //是否是活动预热
        isGoingOn: false, //是否是活动进行中
        isEnded: true, //是否是活动已结束
        isGetSupplierPrice: false, //是否需要查询供应商的价格
    },
}
