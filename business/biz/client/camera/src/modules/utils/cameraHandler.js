class CameraHandler{
    constructor(){

        this.cameraInterval = null//TODO 只需要一个定时器  

        this.qrTimer = null;

        this.PREVIEW_OPTIONS = [300,139,0,0];//预览窗口参数x,y,width,height

        this.takenPhotoing = false;//是否正在拍照

        this.isShow = false;//是否打开

        this.options = {};
    }
   
    /**
     * 初始化纸纹仪窗口
     * @returns 
     */
    init(options){
        this.options = options;
        this.options.defaultCameraOption = JSON.parse(JSON.stringify(this.options.cameraOptions));
        
        return new Promise((reslove,reject)=>{
            try {
                this.cameraInterval = setInterval(async()=>{//TODO值没有返回
                    let res = await  ipcRenderer.sendSync('openDevice');
                    if(res==0){
                        this.cameraInterval&&clearInterval(this.cameraInterval);
                        let result = await this.createNativeWindow(this.options.cwnd);
                        if(0==result){
                            this.setDefaultOption(this.options.defaultCameraOption);
                            reslove(result);
                        }else{
                            reslove(result);
                        }
                        const event = new CustomEvent('cameraInit',{detail:{//TODO 将结果通过事件抛给业务 ，业务监听事件
                            type:this.options.type,
                            created:!!!result
                        }});
                        window.dispatchEvent(event);
                    }else{
                        reslove(res);
                    }
                },1500);
            } catch (error) {
                reslove(-999);
            }
        })
    }
     /**
      * 创建纸纹仪窗口
      * @returns 
      */
     async createNativeWindow(options){
        return new Promise(async(reslove,reject)=>{
            try {
                let res = await ipcRenderer.sendSync('createNativeWindow',options||this.PREVIEW_OPTIONS);
                if (res==0) {
                    reslove(res);
                }else{
                    reslove(res);
                }
            } catch (error) {
                reslove(-999);
            }
        })
    }
    /**
     * 设置默认参数
     * @param {*} options 
     */
    setDefaultOption(options){
        //TODO先设置自动曝光  验证是否光线会好些 待厂家固件修复后代码还原  2023年10月17日15:31:26
        // this.setCameraOption('exposure',[0]);
        let optionsKeyMap = ['whitebalance','exposure'];
        optionsKeyMap.forEach((key)=>{
            let key_auto = key+"_auto";
            let value = options[key_auto];
            if(1===value){//1表示不设置自动
                this.setCameraOption(key,[options[key]]);
            }else{
                this.setCameraOption(key_auto,[value]);
            }
        })
    }
     /**
     * 设置参数
     */
     setOption(options){ 
        Object.assign(this.options.cameraOption,options);
        for(key in this.options.cameraOption){
            this.setCameraOption(key,[this.options.cameraOption[key]]);
        }
    }

    /**
     * 还原设置参数
     */
    resetOption() {
        let options = this.options.cameraOption;
        let defaultOptions = this.options.defaultCameraOption;
        for (const key in options) {
            if (Object.hasOwnProperty.call(options, key)) {
                const element = defaultOptions[key];
                if(element != options[key]){ 
                    options[key] = element;
                    this.setCameraOption(key,[element]);
                }
            }
        }
    }
    /**
     * 设置纸纹仪参数
     * @param {*} type 
     * @param {*} value 
     */
    setCameraOption(type,value){
        ipcRenderer.sendSync('setCameraOption',{type,value})
    }
    //拍摄图片
    getPhoto(path='captured_image.jpg') {
        this.takenPhotoing = true;
        return new Promise(async(reslove,reject)=>{
            try {
                let res = await ipcRenderer.sendSync('takePhoto',path);
                this.takenPhotoing = false;
                if (res==0) {
                    setTimeout(() => {
                        this.hide();
                    }, 250);
                    reslove(res);
                }else{
                    this.hide();
                    reslove(res);
                }
            } catch (error) {
                reslove(-999);
            }
        })
    }

    //拍摄图片
    getQRPhoto(callbackFun,path='preview_temp.jpg') {
        return new Promise(async(reslove,reject)=>{
            try {
                let res = await ipcRenderer.sendSync('takePhoto',path);
                if (res==0) {
                    reslove(res);
                }else{
                    await this.close();
                    reslove(res);
                }
            } catch (error) {
                reslove(-999);
            }
        })
    }
    /**
     * 透射
     */
    transmitInit(){

    }
    /**
     * 反射
     */
    reflexInit(){
        return this.getQRFromImage();       
    }
    /**
     * 判断视频流中照片是否有二维码
     * @returns 
     */
    async getQRFromImage(){
        return new Promise(async (res)=>{
            if(!this.takenPhotoing){
                try{
                    //拍照之后进行判断是否有二维码
                    let gQRes = await this.getQRPhoto('preview_temp.jpg');
                    if(gQRes == 0){

                        let pQRes = await ipcRenderer.sendSync('parseQrCodeImage','preview_temp.jpg')
                        if(this.takenPhotoing){
                            res('');
                            return;
                        }
                        if(pQRes && pQRes.code==0 && !!pQRes.data && !!pQRes.data.content){
                            res(pQRes.data.content);
                        }else{
                            res('');
                        }
                    }
                }catch(e){
                    res('')
                }
            }
        });
    }
     /**
      * 关闭纸纹仪
      */
     async close(){
        this.cameraInterval&&clearInterval(this.cameraInterval);
        await this.hide();
        await ipcRenderer.sendSync('closeNativeWindow');
    }

    /**
     * 显示纸纹仪
     */
    async show(){
        await ipcRenderer.sendSync('showChildWindow');
        this.isShow = true;
    }

    /**
     * 隐藏纸纹仪
     */
    async hide(){
        await ipcRenderer.sendSync('hideChildWindow');
        this.isShow = false;
    }

    /**
     * 打开纸纹仪
     */
    async open(){

    }

}

export default new CameraHandler();