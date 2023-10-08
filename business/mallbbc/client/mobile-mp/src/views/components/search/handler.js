
export default {
    getSearch(param){
        return new Promise((resolve,reject)=>{
            uni.request({
                url: `https://wq.jd.com/bases/searchdropdown/getdropdown?terminal=m&zip=1&newjson=1&key=${param.key}&callback=jsonpCBKD`,
                data: {},
                method: 'GET',
                success: async res => {
                    if (res.statusCode == 200){
                        resolve(res.data);
                    }else {
                        console.log('getSearch 请求出错：', res);
                        reject(res);
                    }
                },
                fail: async err => {
                    console.log('getSearch 请求出错：', err);
                },
                complete: (res) => {
                }
            })
        })
        
    }
}
