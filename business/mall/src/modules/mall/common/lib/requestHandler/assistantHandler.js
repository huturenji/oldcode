import base from './base';
class AssistantHandler extends base{
    constructor() {
        super();
    }

    //获取虚拟用户列表
    getTestAssistant(params){
        return this.request('/test-assistant/v1/testassistant/getTestAssistant',params,{method: 'get'})
    }

    //删除虚拟用户列表
    cancelGrayRelease(params){
        return this.request('/test-assistant/v1/testassistant/cancelTestAssistant',params,{method: 'get'})
    }

    //新增虚拟用户
    addTestAssistant(params){
        return this.request('/test-assistant/v1/testassistant/addTestAssistant',params,{method: 'post'})
    }
}

export default new AssistantHandler();