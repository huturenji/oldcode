import Mock from "mockjs";
//统一设置异步耗时
Mock.setup({ timeout: 1200 });

let customerList = [];
// let customerList111 = [];
// let newCustomer=[];
const count = 46;
for (let i = 0; i < count; i++) {
    customerList.push(
        Mock.mock({
            countId: Mock.Random.id(),
            customCount: "@cname",
            customCompany: '@ctitle(8)公司',
            phone: /^1(5|3|7|8)[0-9]{9}$/,
            password:/^1(5|3|7|8)[0-9]{9}$/,
            version: Mock.mock("V@increment(10)"),
            creatTime: Mock.Random.natural(1655050000, 1657109251),
            state: Mock.Random.natural(1, 3),
            note:''
        })
    );
}

// 获取列表
Mock.mock('/media/admin/v1/getCustomerList', 'post',(req) => {
    // const pageList = JSON.parse(req.body);
    // console.log('req',JSON.parse(req.body))
    // customerList111 = customerList;
    // if (pageList.hasOwnProperty('state')){
    //     customerList.forEach((item)=>{
    //         if (pageList.state == item.state){
    //             newCustomer.push(item)
    //         }
    //     })
    //     customerList = newCustomer;
    // }
    const { pageIndex, pageSize, state} = JSON.parse(req.body);

    const mockList = customerList.filter((obj) =>state ? obj.state == state : obj)
    const pageList = mockList.filter(
        (item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
    );
    // customerList111 = customerList.slice((pageList.pageIndex - 1)*pageList.pageSize, pageList.pageIndex * pageList.pageSize)
    return {
        resultCode: 0,
        resultMessage: "ok",
        result:{
            "pageCount": Math.ceil(mockList.length/pageSize),//总页数
            "pageSize": pageSize,//每页数量
            "pageIndex": pageIndex,
            "resultCount": mockList.length,//总条数
            "hitResultVOList":pageList
        }
    }
})

// 新增
Mock.mock('/media/admin/v1/addCustomerInfo', 'post',(req) => {
    let addJSON = JSON.parse(req.body)
    let item = Object.assign({
        countId: Mock.Random.id(),
        customCount: addJSON.company,
        customCompany: addJSON.company,
        phone: addJSON.phone,
        password:addJSON.password,
        version: Mock.mock("V@increment(10)"),
        creatTime: Mock.Random.natural(1655050000, 1657109251),
        state: addJSON.state,
        note:addJSON.note

    },addJSON)
    customerList.unshift(item)
    return {
        resultCode: 0,
        resultMessage: "新增成功",
        result:{}
    }
})

// 编辑状态和添加备注
Mock.mock('/media/admin/v1/editCustomerInfo', 'post',(req) => {
    let editJSON = JSON.parse(req.body);
    customerList = customerList.map((item) => {
        if (item.countId == editJSON.countId) {
            item.state = editJSON.type=='reject'?'3':editJSON.type=='pass'?'2':editJSON.type=='lock'?'3':editJSON.type=='cancelLock'?'2':''
            if (editJSON.note){
                item.note = editJSON.note;
            }     
        }
        return item
    })
    return {
        resultCode: 0,
        resultMessage: '状态修改成功',
        result:{}
    }
})

// 重置密码
Mock.mock('/media/admin/v1/resetCustomerPassword', 'post',(req) => {
    let resetJSON = JSON.parse(req.body);
    customerList = customerList.map((item) => {
        if (item.countId == resetJSON.countId) {
            item.password = resetJSON.password;
        }
        return item
    })
    return {
        resultCode: 0,
        resultMessage: '密码重置成功',
        result:{}
    }
})


// 删除
Mock.mock('/media/admin/v1/del', 'post',(req) => {
    const { id } = req.body
    customerList = customerList.filter((row) => !id.includes(row.id))
    return {
        resultCode: 0,
        resultMessage: "删除成功",
        result:{}
    }
})

// ---------------------------------------------------------------------------------------

//获取账号详情
Mock.mock('/media/admin/v1/getCustomerDetail', 'post',(req) => {
    let temp = [];
    let getJson = JSON.parse(req.body)
    customerList.forEach(item=>{
        if (item.countId == getJson.countId){
            temp.push(item)
        } 
    })
    return {
        resultCode: 0,
        resultMessage: "ok",
        result:{
            "customCompany": temp[0].customCompany,
            "phone": temp[0].phone,
            "creatTime": temp[0].creatTime,
            "state": temp[0].state,
            "note":temp[0].note
        }
    }
})


// 操作记录--------------------------------------------------------------------
let getOperationLogList=[];
for (let i = 0; i < 12; i++) {
    getOperationLogList.push(
        Mock.mock({
            content: "@ctitle(4)",
            creator: "@cname(4)",
            updateTime: Mock.Random.natural(1655050000, 1657109251)
        })
    );
}
Mock.mock('/media/admin/v1/getOperationLogList', 'post',(req) => {
    const { pageIndex, pageSize, state} = JSON.parse(req.body);
    const mockList = getOperationLogList;
    const pageList = mockList.filter(
        (item, index) => index < pageSize * pageIndex && index >= pageSize * (pageIndex - 1)
    );
    return {
        resultCode: 0,
        resultMessage: "ok",
        result:{
            "pageCount": Math.ceil(mockList.length/pageSize),//总页数
            "pageSize": pageSize,//每页数量
            "pageIndex": pageIndex,
            "resultCount": mockList.length,//总条数
            "hitResultVOList":pageList
        }
    }
})