/*
 * 火车票混入js
 */
var trainMixin = {
    data(){
        return {
            /**
             * 火车票所有的坐席数组 数据源 
             * @name 代表坐席的名字
             * @letter 代表坐席的拼音缩写
             * @mapCode 代表坐席映射的码 下单时传给后台的seatType
             */
            seatDataArr: [
                {
                    name: '高软',
                    letter: 'gjrw',
                    mapCode: 14
                },
                {
                    name: '商务座',
                    letter: 'swz',
                    mapCode: 11
                },
                {
                    name: '特等座',
                    letter: 'tdz',
                    mapCode: 12
                },
                {
                    name: '一等卧',
                    letter: 'ydw',
                    mapCode: 22
                },
                {
                    name: '一等座',
                    letter: 'ydz',
                    mapCode: 3
                },
                {
                    name: '二等卧',
                    letter: 'edw',
                    mapCode: 24
                },
                {
                    name: '二等座',
                    letter: 'edz',
                    mapCode: 4
                },
                {
                    name: '软卧',
                    letter: 'rw',
                    mapCode: 9
                },
                {
                    name: '软座',
                    letter: 'rz',
                    mapCode: 2
                },
                {
                    name:'硬卧',
                    letter:'yw',
                    mapCode: 6
                },
                {
                    name: '硬座',
                    letter: 'yz',
                    mapCode: 1
                },
                {
                    name: '无座',
                    letter: 'wz',
                    mapCode: 10
                }, 
            ]
        }
    },
    methods: {
        /**
         * 解析坐席列表
         */
        handleTrainBanning2List(train) {
            const that = this;
            let array = [];
            //所有的坐席英文前缀名称及code
            for(let i = 0; i < that.seatDataArr.length; i++){
                const item = that.seatDataArr[i];
                if(train[item.letter + 'Price'] > 0){
                    array.push({
                        name: item.name,
                        leave: train[item.letter + 'Num'],
                        price: train[item.letter + 'Price'],
                        letter: item.letter,
                        couponList:train.CanUseCoupon ? train.CanUseCoupon[item.letter + 'CanUseCoupon'] : null
                    });
                }
            }
            return array;
        },
         /**
         * 距离发车时间不足半小时，已停止网络售票 检查是否举例发车不足半个小时
         */
        checkIsNearGo(train) {
            const that = this;     
            const nowDate = new Date();
            let currYear = nowDate.getFullYear();
            let searchYear = currYear;
            let currMonth = nowDate.getMonth();
            let _searchDate = new Date(that.searchDate + " " + train.goTime);
            let searchMonth = _searchDate.getMonth();
            if (currMonth > searchMonth) { //不能解决跨一整年
                searchYear = searchYear + 1;
                _searchDate.setFullYear(searchYear);
            }
            if (_searchDate.getTime() - nowDate.getTime() < 0.5 * 3600 * 1000) {
                return true
            } else {
                return false
            }
        },
        /**
         * 针对带卧字的和高软做特殊处理 暂时屏蔽掉
         */
        shieldWo(name){
            return (name.indexOf('卧')!=-1) || (name.indexOf('高软')!=-1);
        },
         /**
         * 获取坐席的名字 code坐席中文名的映射mapCode
         */
        selectSeatType2Code() {
            const that = this;
            let newArr = that.seatDataArr.filter(item=>{
                return item.name == that.seatLevel
            })
            return newArr[0].mapCode;
        },
         //数据脱敏的方法
        desensitization(num){
            if(num){
              let length = num.length;
              if(length>2){
                let str = '';
                str = str + num.slice(0,1) + '************' + num.slice(length-1);
                return str;
              }else{
                return num;
              }
            }else{
              return num;
            } 
        },

        /**
        * 确定该车次是否是 SaleFlag1.列车运行图调整 4.列车停运
        * @return flag = true 代表是1和4 
        */
       judgeSaleFlagNo(train){
            let flag = false;
            if(train.saleFlag == '1' || train.saleFlag == '4'){
                flag = true;
            }   
            return flag;
       }
    },
  }

export default trainMixin;

   

    
    

