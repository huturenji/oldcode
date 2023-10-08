var functional = SnTravel.functional;

class Handler extends functional.baseRequestHandler{
    constructor(){
        super();
    }

    /**
     * 结束当前智齿客服会话
     */
    endConservation(param){
        return this.request('/notice/v1/endConservation', param, {method:'post'});
    }

}
Object.assign(Handler.prototype, functional);

export default new Handler();