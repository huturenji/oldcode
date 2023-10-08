import extendUtils from './extend.js';

extendUtils.WhiteList.global.push('/travel-management/v1/getServiceReminders');

class requestHandler extends extendUtils.baseRequestHandler{
    getServiceReminder(data){
        return this.request('/travel-management/v1/getServiceReminders', data, {notAssignUserParam: true});
    }
}

var handler = new requestHandler();

export default handler;
