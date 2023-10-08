import request from './request'
import store from '../store';
import { base64Encode } from './common';

/** 
 * 统计事件
 */
export async function statEvent(data) {
    //将data和公共属性合并得到最终要发送的数据
    let { channelId, companyId } = getApp().globalData.userParams;
    let targetParams = {
        ...data,
        equipmentType: 2, //设备类型，1-pc，2-移动设备，3-其他
        source: 'xcx', //终端名称，pc-pc；h5-H5；android-Android；ios-IOS；xcx-微信小程序
        memberId: store.state.memberInfo.memberId || 0, //会员id默认为0
        ip: '', //移动端ip默认都为空
        channelId,
        companyId,
    };
    //发送请求
    let params = {
        url: '/v3/statistics/front/member/behavior/save',
        method: 'POST',
        data: {
            u: base64Encode(JSON.stringify(targetParams))
        },
        header: {
            "Content-Type": "application/json"
        }
    }
    request(params).then(() => {}).catch(()=>{})
}