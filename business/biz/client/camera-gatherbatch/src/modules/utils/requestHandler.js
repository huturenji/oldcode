class request{
    constructor(){

    }
    get(url,params){
        //将参数拼接到url上面
        return new Promise((res,rej)=>{
            fetch(url).then(response=>{
                if(response.ok){
                    return response.json();
                }else{
                    throw new Error(response.statusText)
                }}).then(json=>res(json)).catch(err=>rej(err))
        })
    }
    post(url,params,header){
        return new Promise((res,rej)=>{
            fetch(url,{
                method:'POST',
                body:JSON.stringify(params)
            })
            .then(response=>{
                if(response.ok){
                    return response.json();
                }else{
                    return Promise.reject(response.statusText)
                 }})
            .then(json=>res(json))
            .catch(err=>rej(err))
        })
    }
}
export default new request(); 