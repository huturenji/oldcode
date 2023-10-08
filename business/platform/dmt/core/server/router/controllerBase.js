/**
 *控制器基类，封装一些模板操作和数据
 */
class controllerBase {
    constructor() {
        this.host = {
            dev: "https://bplusdev.sinosun.com:18180/",
            black: "https://bplusdev.sinosun.com:18180/",
            sand: "https://bplusdev.sinosun.com:18180/",
            prod: "https://bplusdev.sinosun.com:18180/"
        };
        this.server = {
            product: "product/v1",
            cart: "cart/v1",
            follow: "follow/v1",
            order: "order/v1",
            address: "address/v1",
            payment: "payment/v1",
            channel: "channel/v1",
        };
    }
    /**
     * 从请求获取body和header字段
     * @param {*} req 
     */
    copyReqBodyAndHeader(req) {
        return {
            body: JSON.parse(JSON.stringify(req.body)),
            header: this.copyReqHeader(req)
        }
    }
    /**
     * 从请求获取header字段
     * @param {*} req 
     */
    copyReqHeader(req) {
        return {
            "content-type": req.get('content-type'),
            bplusAppkey: req.get('bplusAppkey'),
            channelId: req.get('channelId'),
            companyId: req.get('companyId'),
            userId: req.get('userId'),
            authorization: req.get('authorization'),
        }
    }
}

export default controllerBase;
