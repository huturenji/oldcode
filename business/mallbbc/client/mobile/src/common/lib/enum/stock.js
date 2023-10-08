/****
 * stockEnum  商品库存状态枚举
 * @param {boolean} hasStock  是否有库存
 * @param {string} originText  服务端定义的枚举值代表的含义
 * @param {string} text  客户端该枚举值状态下展示给用户显示的文字信息
 * 
 */

const stockEnum = {
    33: {
        hasStock: true,
        originText: '现货，下单后立即发货',
        text: '现货，下单后立即发货' 
    },
    39: {
        hasStock: true,
        originText: '内部配货中，预计2~6天到达仓库',
        text: '下单后可以调货，预计2-6天发货，具体以物流信息为准' 
    },
    40: {
        hasStock: true,
        originText: '有货，下单后从有货仓库配货',
        text: '下单后可以调货，预计2-6天发货，具体以物流信息为准' 
    },
    // 13: {
    //     hasStock: false,
    //     originText: '库存不足',
    //     text: '库存不足', 
    // },
    34: {
        hasStock: false,
        originText: '无货',
        text: '无货'
    },
    // 30: {
    //     hasStock: false,
    //     originText: '暂不销售',
    //     text: '暂不销售',
    // },
    36: {
        hasStock: false,
        originText: '预定',
        text: '预定'
    },
    99: {
        hasStock: false,
        originText: '无货开预定',
        text: '无货开预定'
    }
}

export default stockEnum;