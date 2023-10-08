import tripHandler from "./tripHandler.js";
/*
 * 行程混入js
 */
var tripMixin = {
    data(){
        return {
            pageIndex:'', //全局参数
            pageSize:'' , //全局参数
            totalPages: '', //总的页数
            popLoading: false //行程删除的loading  
        }
    },
    methods: {
 
        /**
       * 查询行程列表
       * queryType  0标识历史  1标识正常行程
       * @isHis true 代表历史行程 false代表行程助手
       */
        getTripList(type, isHis, page,mescroll,selectedOptionCopy, dateRangeCopy) {
            let that = this;
            that.noFlag = false;
           
            if (type && type == 'delete'){ //删除行程的时候loading显示不一样
                console.log("delete")
                that.popLoading = true;
                that.pageIndex = 1;

            } else if (type && type == 'page'){ //分页下拉加载
                console.log("page")
                that.pageIndex = page.num;
                that.pageSize = page.size;     
            } else { //init
                console.log("init")
                that.loading = true;
                that.pageIndex = 1;//第一页
                that.pageSize = that.pageSize || page.size;
            }

            //区别历史行程还是 正常的行程 1代表正常的 0代表历史行程
            let queryType = 1;
            if (isHis){ 
                queryType = 0;  
            }

            let param = {
                queryType: queryType,
                pageIndex: that.pageIndex,
                pageSize: that.pageSize,
                orderType: selectedOptionCopy ? selectedOptionCopy : [0]
            }
            // 行程历史的筛选参数
            let filterObj = {};
            if (dateRangeCopy){
                filterObj.departTimeStart = dateRangeCopy[0]?dateRangeCopy[0].replace(/-/g,'/'):'';
                filterObj.departTimeEnd = dateRangeCopy[1]?dateRangeCopy[1].replace(/-/g,'/'):'';
                param = Object.assign({}, param, filterObj);
            }
            
            //获取uaId的相关信息
            let uaId = tripHandler.uaId;//该方法继承的base.js里面的方法
            if (!!uaId){
                param = Object.assign({}, param, {
                    uaId: uaId
                });
            }
            // console.log("请求接口 "+param.queryType,param.pageIndex,param.pageSize)
            tripHandler.getTripList(param).then((res) => {
                that.loading = false;
                that.popLoading = false;
                if (0 == res.resultCode && res.result){
                    //每次更新总的页数
                    that.totalPages = res.result.totalPages;
                    if (type == 'delete' || type == 'init'){
                        that.tripList = res.result.tripList;
                    } else {
                        that.tripList = [...that.tripList, ...res.result.tripList];
                    }
                    if (0 == that.tripList.length) {
                        that.noFlag = true;
                    } else {
                        that.tripList = that.tripList.map((trip)=>{
                            trip.isSelf = true;
                            if (trip.userId!=(trip.founderInfo || {}).founderUserId){
                                trip.isSelf = false;
                            }
                            return trip;
                        });
                    }
                } else {
                    that.noFlag = true;
                }
                mescroll.endByPage(that.tripList.length, res.result.totalPages);
            }).catch(function() {
                mescroll.endErr();
                console.log("从服务器获取行程失败");
                that.loading = false;
                that.popLoading = false;
                that.noFlag = true;
            });
        }

    }
}

export default tripMixin;
    

