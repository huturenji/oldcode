import passengerHandler from './passengerHandler.js';
let mixins = {
    methods: {
        /** 
         * 获取验证信息
         */
        identityVerification(item){
            let param = {
                passengerId: item.passengerId,
                countryAbb: item.abbreviation
            }
            this.showCheckLoading = true;
            return new Promise((resolve, reject) => {
                passengerHandler.identityVerification(param).then(res=>{
                    this.showCheckLoading = false;
                    if (res.resultCode == 0){
                        resolve(res)
                    } else {
                        resolve(false)
                    }
                }).catch(e=>{
                    this.showCheckLoading = false;
                    console.log(e);
                    reject(false)
                })
            })
        },

        //筛选不可用的IDCode 和 火车票核验身份信息和手机号核验
        checkUnAvailableIDCode(item){
            let that = this;
            let idCode = item.idCode;
            // let idNum = item.idNum;
            let birthday =item.birthday ? item.birthday.split('/')[0]:0 ;
            // flag true 说明 显示不能选择的错误提示
            let flag = that.errorIDCodeList.indexOf(idCode) > -1;
            if (!!flag){
                let newErrorMsg = '当前行程不支持使用该证件，请更换证件';
                that.$set(item, 'errorMsg', newErrorMsg);
            } else if (!!that.isFlight){ //购买飞机票 有乘客年龄的限制
                let myDate = new Date();
                let nowYear = myDate.getFullYear(); 
                if (parseInt(birthday) >= (nowYear-12)){ //说明年龄小于12岁
                    flag = true;
                    let newErrorMsg = '当前行程不支持12岁以下儿童购票';
                    that.$set(item, 'errorMsg', newErrorMsg)
                }
            }
            return flag;
        }
    }
}

export default mixins;