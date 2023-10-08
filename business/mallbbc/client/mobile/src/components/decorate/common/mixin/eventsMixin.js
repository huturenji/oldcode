import CustEvent from '@/utils/custEvent.js'

export default {
    inject: ['rootId'],//装修根容器id
    data(){
        return {
            custEvents: CustEvent.init('deco'+this.rootId),
            eventsId: {}
        }
    }
}