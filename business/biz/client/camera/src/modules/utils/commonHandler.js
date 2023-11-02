class CommonHandler{
    constructor(){

    }
    
    getScanIndex(value){
         return value%10+1;
    }
}

export default new CommonHandler();