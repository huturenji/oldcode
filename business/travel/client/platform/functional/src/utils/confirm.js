const DEFAULT_CONFIG = {
    content: '',
    cancelText: '取消',
    confirmText: '确定',
    onConfirm: null,
    onCancel: null,
    showCancelButton: true,
    showConfirmButton: true,
    cancelColor: '#222',
    confirmColor: '#262DD9'
}

export default class Confirm {
    constructor(props){
        this.init(props);
        return this;
    }

    init(props){
        this.props = this.assign(DEFAULT_CONFIG, props || {});
    }

    assign(base, target) {
        let result = {}
        for (var key in base) {
            // eslint-disable-next-line no-prototype-builtins
            if (base.hasOwnProperty(key) === true) {
                result[key] = base[key];
            }
        }
        for (var key2 in target) {
            // eslint-disable-next-line no-prototype-builtins
            if (target.hasOwnProperty(key2) === true && target[key2]!=null && target[key2]!=undefined) {
                result[key2] = target[key2];
            }
        }
        return result;
    }

    show(props){
        this.init(props);
        this.destory();
        this.case = this.create();
        this.case.style.display = 'block';
    }

    hide(){
        if (this.exsit()){
            this.case.remove()
        }
    }

    /**
   * 是否存在一个弹窗实例
   */
    exsit(){
        return !!this.case
    }

    create(){
        const pcWidth = '616';
        const isPC = document.body.offsetWidth >= pcWidth;
        let that = this;
        //父容器
        let container = document.createElement("div");
        container.classList.add('sino-pay-confirm');

        //遮罩
        let mask = document.getElementsByClassName('sino-pay-mask');
        if (!mask || mask.length==0){
            mask = document.createElement("div")
            mask.classList.add('sino-pay-mask');
            mask.style.cssText = `position: fixed;z-index: 9998;top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.6);`
            container.appendChild(mask);
        }
    
        //内容容器
        let dialog = document.createElement("div");
        dialog.classList.add('sino-pay-dialog');
        dialog.style.cssText = `position: fixed;display: table;z-index: 9999;width: 80%;max-width: 300px;left: 50%;top: 50%;transform: translate(-50%, -50%);margin: auto;background-color: #FFFFFF;`
    +`text-align: center;border-radius: .2rem;overflow: hidden;`;
        if (isPC){
            dialog.style.cssText += 'border-radius: 10px;'
        }
        //标题
        if (this.props.title){
            let titleDom = document.createElement("div");
            titleDom.innerHTML = this.props.title;
            titleDom.style.cssText = `font-size: .3rem;margin: .4rem auto -.1rem;color: #222;font-weight: bold;`
            if (isPC){
                titleDom.style.cssText += 'font-size: 15px;margin: 20px auto -5px;'
            }
            dialog.appendChild(titleDom);
        }

        //内容
        let content = document.createElement("div");
        content.classList.add('sino-pay-dialog__bd');
        content.innerHTML = this.props.content;
        content.style.cssText = `text-align: left;padding: .76rem .4rem;font-size: .3rem;overflow-wrap: break-word;word-break: break-all;color: #191919;display: inline-block;`
        if (isPC){
            content.style.cssText += 'padding: 38px 20px;font-size: 15px;'
        }

        //按钮容器
        let footer = document.createElement("div");
        footer.classList.add('sino-pay-dialog__ft');
        footer.style.cssText = `position: relative;line-height: .92rem;font-size: .32rem;display: -webkit-box;display: -webkit-flex;display: flex;`;
        if (isPC){
            footer.style.cssText += 'line-height: 46px;font-size: 16px;'
        }
        if (this.props.showCancelButton){
            //取消按钮样式
            let btnDefault = document.createElement("a");
            btnDefault.href = 'javascript:;'
            btnDefault.innerHTML = this.props.cancelText;
            btnDefault.classList.add('sino-pay-btn');
            btnDefault.classList.add('sino-pay-btn_default');
            btnDefault.classList.add('normal-btn');//TODO 样式要重新写成stylesheet的模式，不然这里没法用自己的样式
            btnDefault.style.cssText = 'display: block;-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;color: '+this.props.cancelColor+';text-decoration: none;-webkit-tap-highlight-color: transparent;position: relative;'+(this.props.cancelStyle || '');
            btnDefault.onclick = ()=>{
                that.props.onCancel && that.props.onCancel();
                that.destory();
            }
            footer.appendChild(btnDefault);
        }
        if (this.props.showConfirmButton){
            //确定按钮样式
            let btnPrimary = document.createElement("a");
            let colorStyle = this.props.showCancelButton ? `color: #fff;background-color: ${this.props.confirmColor}` : `background-color: #fff;color: ${this.props.confirmColor}`
            btnPrimary.href = 'javascript:;'
            btnPrimary.innerHTML = this.props.confirmText;
            btnPrimary.classList.add('sino-pay-btn');
            btnPrimary.classList.add('sino-pay-btn_primary');
            btnPrimary.classList.add('normal-btn');//TODO 样式要重新写成stylesheet的模式，不然这里没法用自己的样式
            btnPrimary.style.cssText = 'display: block;-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;' + colorStyle + ';text-decoration: none;-webkit-tap-highlight-color: transparent;position: relative;'+(this.props.confirmStyle || '');
            btnPrimary.onclick = ()=>{
                that.props.onConfirm && that.props.onConfirm();
                that.destory();
            }
            footer.appendChild(btnPrimary);
        }
        var style = document.createElement("style");
        document.head.appendChild(style);
        var sheet = style.sheet;
        sheet.insertRule('.sino-pay-confirm .sino-pay-btn::after { content: " ";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;'
      +'-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5); }', 0); // 支持非IE的现代浏览器
        sheet.insertRule('.sino-pay-confirm .sino-pay-dialog__ft::after {content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #d5d5d6;color: #d5d5d6;'
      +'-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(.5);transform: scaleY(.5);}', 0); // 支持非IE的现代浏览器


        dialog.appendChild(content);
        dialog.appendChild(footer);
        container.appendChild(dialog);
        document.body.appendChild(container);
        return container;
    }

    destory(){
        if (!!this.case){
            this.case.remove();
            this.case = null;
        }
    }
}
