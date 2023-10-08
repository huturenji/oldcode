import { isTransferPay } from '@/utils/common.js'
import { getThemeStyle } from '@/utils/theme/index.js';

export const orderListEnum = (item) => {
    const btnList = []
    // 取消订单
    if (
        (item.orderState == 10 || item.orderState == 20) &&
        (!isTransferPay(item.paymentCode) || (item.orderType==106 && item.promotionStatus==0 && item.orderState == 20))
    ) {
        btnList.push({
            type: 'cancelOrder',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 立即支付
    if (item.orderState == 10&&!((item.orderType==105||item.orderType==103)&&item.orderSubState==102&&item.depositRemainTime>0)) {
        btnList.push({
            type: 'payOrder',
            bgColor: getThemeStyle('confirmBtnBgColor2'),
            textColor: getThemeStyle('confirmBtnTextColor'),
            borderColor: getThemeStyle('confirmBtnBgColor2')
        })
    }
    // 修改地址
    if (item.orderState == 10 || item.orderState == 20) {
        // btnList.push({
        //     type: 'editAddress',
        //     bgColor: '#fff',
        //     textColor: '#222',
        //     borderColor: '#c2c2c2'
        // })
    }
    // 联系客服退款
    if (item.orderState == 30 && !(item.orderType==106) && item.orderProductListVOList[0] && item.orderProductListVOList[0].productType == 0) {
        btnList.push({
            type: 'customer',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 删除订单
    if (item.orderState==0||item.orderState==40 || item.orderState==50) {
        btnList.push({
            type: 'delOrder',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 查看物流(因待收货和交易完成的查看物流和补开发票的前后顺序不一致，所以这里写了两次查看物流。仅仅是为了区分顺序)
    if (item.orderState == 40) {
        btnList.push({
            type: 'logistics',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 补开发票
    if ((item.orderState == 30 || item.orderState == 40) && item.orderProductListVOList[0] && item.orderProductListVOList[0].productType == 0) {
        btnList.push({
            type: 'addInvoice_l',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 查看发票
    if ((item.orderState == 30 || item.orderState == 40) && item.orderProductListVOList[0] && item.orderProductListVOList[0].productType == 0) {
        btnList.push({
            type: 'viewInvoice_l',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 换开发票
    if ((item.orderState == 30 || item.orderState == 40) && item.orderProductListVOList[0] && item.orderProductListVOList[0].productType == 0) {
        btnList.push({
            type: 'resInvoice_l',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 查看物流
    if (item.orderState == 30) {
        btnList.push({
            type: 'logistics',
            bgColor: '#fff',
            textColor: '#222',
            borderColor: '#c2c2c2'
        })
    }
    // 再次购买
    if (
        (item.orderState == 0 || item.orderState == 40 ||
        item.orderState == 30 || item.orderState == 20 || item.orderState == 50) && (
            item.orderProductListVOList[0] &&
            item.orderProductListVOList[0].productType == 0
        )
    ) {
        btnList.push({
            type: 'buyAgain',
            bgColor: item.orderState != 30 ? getThemeStyle('confirmBtnBgColor2') : '#fff',
            textColor: item.orderState != 30 ? getThemeStyle('confirmBtnTextColor') : '#222',
            borderColor: item.orderState != 30 ? getThemeStyle('confirmBtnBgColor2') : '#c2c2c2'
        })
    }
    // 确认收货
    if (item.orderState == 30) {
        btnList.push({
            type: 'confirmOrder',
            bgColor: getThemeStyle('confirmBtnBgColor2'),
            textColor: getThemeStyle('confirmBtnTextColor'),
            borderColor: getThemeStyle('confirmBtnBgColor2')
        })
    }
    // 评价
    if (item.orderState == 40 && item.evaluateState != 3) {
        // btnList.push({
        //     type: 'assessOrder',
        //     bgColor: '#fff',
        //     textColor: getThemeStyle('tagColor'),
        //     borderColor: getThemeStyle('tagColor')
        // })
    }
    // 分享
    if (item.orderState == 20 && item.orderType==106 && item.promotionStatus==0) {
        btnList.push({
            type: 'shareOrder',
            bgColor: '#fff',
            textColor: getThemeStyle('tagColor'),
            borderColor: getThemeStyle('tagColor')
        })
    }

    return btnList
}

export const orderDetailEnum = (item) => {
    let btnList = []

    if (item.orderState == 10) {

        btnList = [
            // {
            //     type: 'editAddress',
            //     bgColor: '#fff',
            //     textColor: '#222',
            //     borderColor: '#c2c2c2'
            // },
            {
                type: 'cancelOrder_d1', // 取消订单
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'payOrder_d', // 立即支付
                bgColor: getThemeStyle('confirmBtnBgColor2'),
                textColor: getThemeStyle('confirmBtnTextColor'),
                borderColor: getThemeStyle('confirmBtnBgColor2')
            }
        ]
    }
    
    if (item.orderState == 20) {
        btnList = [
            // {
            //     type: 'editAddress',
            //     bgColor: '#fff',
            //     textColor: '#222',
            //     borderColor: '#c2c2c2'
            // },
            {
                type: 'cancelOrder_d2', // 取消订单
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'buyAgain_d', // 再次购买
                bgColor: getThemeStyle('confirmBtnBgColor2'),
                textColor: getThemeStyle('confirmBtnTextColor'),
                borderColor: getThemeStyle('confirmBtnBgColor2')
            }
        ]
    }

    if (item.orderState == 30) {
        // 补开发票
        btnList = [
            {
                type: 'customer_d', // 联系客服退款
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'addInvoice_d', // 补开发票
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'resInvoice_d', // 换开发票
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'viewInvoice_d', // 查看发票
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'logistics', // 查看物流
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'buyAgain_d', // 再次购买
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'confirmOrder', // 确认收货
                bgColor: getThemeStyle('confirmBtnBgColor2'),
                textColor: getThemeStyle('confirmBtnTextColor'),
                borderColor: getThemeStyle('confirmBtnBgColor2')
            }
        ]
    }

    if (item.orderState == 40) {
        btnList = [
            {
                type: 'delOrder', //删除订单
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'logistics', // 查看物流
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'addInvoice_d', // 补开发票
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'resInvoice_d', // 换开发票
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'viewInvoice_d', // 查看发票
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'buyAgain_d', // 再次购买
                bgColor: getThemeStyle('confirmBtnBgColor2'),
                textColor: getThemeStyle('confirmBtnTextColor'),
                borderColor: getThemeStyle('confirmBtnBgColor2')
            }
            // {
            //     type: 'assessOrder', // 评价
            //     bgColor: '#fff',
            //     textColor: getThemeStyle('tagColor'),
            //     borderColor: getThemeStyle('tagColor')
            // }
        ]
    }

    if ( item.orderState == 0 || item.orderState == 50) {
        btnList = [
            {
                type: 'delOrder', // 删除订单
                bgColor: '#fff',
                textColor: '#222',
                borderColor: '#c2c2c2'
            },
            {
                type: 'buyAgain_d', // 再次购买
                bgColor: getThemeStyle('confirmBtnBgColor2'),
                textColor: getThemeStyle('confirmBtnTextColor'),
                borderColor: getThemeStyle('confirmBtnBgColor2')
            }
        ]
    }

    return btnList
}