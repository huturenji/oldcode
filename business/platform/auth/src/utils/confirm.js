/**
 *   title,
     content,
     confirmStyle,
     cancelStyle,
     confirmText,
     cancelText,
     showConfirmButton,
     showCancelButton,
     cancelColor,
     confirmColor,
     onConfirm,
     onCancel
 */

const PC_WIDTH = 616;
const BASE_ZINDEX = 90000;

function zIndex(value = 0){
    return BASE_ZINDEX + value
}

const DEFAULT_CONFIG = {
    content: '',
    cancelText: '取消',
    confirmText: '确定',
    onConfirm: null,
    onCancel: null,
    showCancelButton: true,
    showConfirmButton: true,
    cancelColor: '#222',
    confirmColor: '#262DD9',
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
        if (base.hasOwnProperty(key) === true) {
            result[key] = base[key];
        }
    }
    for (var key in target) {
      if (target.hasOwnProperty(key) === true && target[key]!=null && target[key]!=undefined) {
        result[key] = target[key];
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
    if(this.exsit()){
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
    const isPC = document.body.offsetWidth >= PC_WIDTH;
    let that = this;
    //父容器
    let container = document.createElement("div");
    container.classList.add('sino-auth-confirm');

    //遮罩
    let mask = document.getElementsByClassName('sino-auth-mask');
    if(!mask || mask.length==0){
      mask = document.createElement("div")
      mask.classList.add('sino-auth-mask');
      mask.style.cssText = `position: fixed;z-index: ${zIndex(2)};top: 0;right: 0;left: 0;bottom: 0;background: rgba(0, 0, 0, 0.6);`
      container.appendChild(mask);
    }
    
    //内容容器
    let dialog = document.createElement("div");
    dialog.classList.add('sino-auth-dialog');
    dialog.style.cssText = `position: fixed;display: table;z-index: ${zIndex(3)};width: 80%;max-width: 300px;left: 50%;top: 50%;transform: translate(-50%, -50%);margin: auto;background-color: #FFFFFF;`
    +`text-align: center;border-radius: .2rem;overflow: hidden;`;
    if(isPC){
        dialog.style.cssText += 'border-radius: 10px;'
    }
    //标题
    if(this.props.title){
      let titleDom = document.createElement("div");
      titleDom.innerHTML = this.props.title;
      titleDom.style.cssText = `font-size: .3rem;margin: .4rem auto -.1rem;color: #222;font-weight: bold;`
      if(isPC){
        titleDom.style.cssText += 'font-size: 15px;margin: 20px auto -5px;'
      }
      dialog.appendChild(titleDom);
    }

    //内容
    let content = document.createElement("div");
    content.classList.add('sino-auth-dialog__bd');
    content.innerHTML = this.props.content;
    content.style.cssText = `text-align: center;padding: .76rem .4rem;font-size: .3rem;overflow-wrap: break-word;word-break: break-all;color: #191919;display: inline-block;`
    if(isPC){
        content.style.cssText += 'padding: 38px 20px;font-size: 15px;'
    }

    //按钮容器
    let footer = document.createElement("div");
    footer.classList.add('sino-auth-dialog__ft');
    footer.style.cssText = `position: relative;line-height: .92rem;font-size: .32rem;display: -webkit-box;display: -webkit-flex;display: flex;`;
    if(isPC){
        footer.style.cssText += 'line-height: 46px;font-size: 16px;'
    }
    if(this.props.showCancelButton){
      //取消按钮样式
      let btnDefault = document.createElement("a");
      btnDefault.href = 'javascript:;'
      btnDefault.innerHTML = this.props.cancelText;
      btnDefault.classList.add('auth-confirm-btn');
      btnDefault.classList.add('sino-auth-btn_default');
      btnDefault.classList.add('normal-btn');
      btnDefault.style.cssText = 'display: block;-webkit-box-flex: 1;-webkit-flex: 1;flex: 1;color: '+this.props.cancelColor+';text-decoration: none;-webkit-tap-highlight-color: transparent;position: relative;'+(this.props.cancelStyle || '');
      btnDefault.onclick = ()=>{
        that.props.onCancel && that.props.onCancel();
        that.destory();
      }
      footer.appendChild(btnDefault);
    }
    if(this.props.showConfirmButton){
      //确定按钮样式
      let btnPrimary = document.createElement("a");
      let colorStyle = this.props.showCancelButton ? `color: #fff;background-color: ${this.props.confirmColor}` : `background-color: #fff;color: ${this.props.confirmColor}`
      btnPrimary.href = 'javascript:;'
      btnPrimary.innerHTML = this.props.confirmText;
      btnPrimary.classList.add('auth-confirm-btn');
      btnPrimary.classList.add('sino-auth-btn_primary');
      btnPrimary.classList.add('normal-btn');
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
    sheet.insertRule('.sino-auth-confirm .auth-confirm-btn::after { content: " ";position: absolute;left: 0;top: 0;width: 1px;bottom: 0;border-left: 1px solid #D5D5D6;color: #D5D5D6;'
      +'-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleX(0.5);transform: scaleX(0.5); }', 0); // 支持非IE的现代浏览器
    sheet.insertRule('.sino-auth-confirm .sino-auth-dialog__ft::after {content: " ";position: absolute;left: 0;top: 0;right: 0;height: 1px;border-top: 1px solid #d5d5d6;color: #d5d5d6;'
      +'-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scaleY(.5);transform: scaleY(.5);}', 0); // 支持非IE的现代浏览器


    dialog.appendChild(content);
    dialog.appendChild(footer);
    container.appendChild(dialog);
    document.body.appendChild(container);
    return container;
  }

  destory(){
    if(!!this.case){
      this.case.remove();
      this.case = null;
    }
  }
}
