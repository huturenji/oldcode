const rule = {
    flight: {
        time: 30
    },
    hotel: {
        time: 30
    },
    train: {
        time: 30
    }
}
const errorText = {
    time: {
        flight: '航班起飞' + rule.flight.time + '天后，不再支持补开报销凭证',
        hotel: '离店' + rule.hotel.time + '天后，不再支持补开报销凭证',
        train: '下单成功' + rule.train.time + '天后，不再支持补开报销凭证'
    }
}
function isReopen (type, obj) {
    let flag = checkTime(type, obj)
    if (flag !== 'success') {
        return flag
    }
}

function checkTime (type, obj) {
    let beginTime = ''
    if (type === 'car') {
        return 'success'
    } else if (type === 'flight') {
        beginTime = obj.departTime.split(' ')[0]; //起飞时间
    } else if (type === 'train') {
        beginTime = obj.orderTime.split(' ')[0]; //下单时间
    } else if (type === 'hotel'){
        beginTime = obj.departDate.split(' ')[0]; //离店时间
    }
    let nowTime = new Date().getTime()
    beginTime = new Date(beginTime).getTime()
    if ((nowTime - beginTime) / 1000 / 60 / 60 / 24 >= rule[type].time) {
        return errorText.time[type]
    }
    return 'success'
}
export {isReopen}