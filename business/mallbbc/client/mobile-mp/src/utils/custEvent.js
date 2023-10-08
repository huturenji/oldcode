class EventNameSpace{
    constructor(){
        this.eventContainer = {}
    }

    init(namespace = 'DEFAULT_NAMESPACE'){
        if (!this.eventContainer[namespace]){
            this.eventContainer[namespace] = new CustEvent();
        }
        return this.eventContainer[namespace];
    }
}

class CustEvent{
    constructor() {
        this.events = {}
    }

    addListener(name, callback){
        if (!this.events[name]){
            this.events[name] = []
        }
        callback.custEventId = new Date().getTime();
        this.events[name].push(callback)
        return callback.custEventId;
    }

    dispatch(name, ...args){
        this.events[name]?.forEach(func => {
            func?.(...args);
        })
    }

    remove(name, callback){
        this.events[name]?.findIndex(eventCb => {
            return (eventCb.custEventId == callback) || (eventCb === callback)
        })
    }
}

export default new EventNameSpace();