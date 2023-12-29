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
                }}).then(json=>res(json)).catch(err=>res(err))
        })
    }
    post(url,params,header){
        let headers = new Headers();
        for (const key in header) {
            headers.append(key,header[key])
        }
        return new Promise((res,rej)=>{
            fetch(url,{
                method:'POST',
                body:JSON.stringify(params),
                headers:headers
            }).then(response=>{
                if(response.ok){
                    if(header&&header['Content-Type']=='image/jpeg'){
                        return response.blob();
                    }else{
                        return response.json();
                    }
                }else{
                    throw new Error(response.statusText)
                }}).then(json=>res(json)).catch(err=>res(err))
        })
    }
}
export default new request();