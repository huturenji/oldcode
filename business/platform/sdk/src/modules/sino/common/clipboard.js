const clipboard = window.navigator.clipboard;

/**
 * 获取剪切板文本
 * 【警告】 银行IOS上本方法会导致页面初次加载时出现粘贴按钮且白屏。需谨慎使用。
 * @returns 
 */
export async function readText(){
    try{
        return await clipboard.readText();
    }catch(e){
        let input = document.createElement('input')
        input.focus();
        document.body.appendChild(input)
        document.execCommand('paste');
        let value = input.value;
        input.remove();
        return value;
    }
}

/**
 * 向剪切板写入文本
 * @param {*} text 
 */
export async function writeText(text){
    try {
        await clipboard.writeText(text);
    } catch (e) {
        let input = document.createElement('input')
        input.value = text;
        input.readOnly = 'readonly';
        //visibility或display:none都会导致复制不成功，所以要让这个input在style上不可见
        input.style.opacity = '0'
        input.style.position = 'absolute'
        input.style.bottom = '-1000px'
        input.style.left = '-1000px'
        input.style.zIndex='-1'
        document.body.appendChild(input)
        input.select();
        document.execCommand('copy');
        input.remove();
    }
}

export async function clear(){
    try {
        await clipboard.writeText('');
    } catch (e) {
        let input = document.createElement('input')
        input.value = ' ';//execCommand无法写入空字符串，因此写入空格作为兼容方案
        input.readOnly = 'readonly';
        //visibility或display:none都会导致复制不成功，所以要让这个input在style上不可见
        input.style.opacity = '0'
        input.style.position = 'absolute'
        input.style.bottom = '-1000px'
        input.style.left = '-1000px'
        input.style.zIndex='-1'
        document.body.appendChild(input)
        input.select();
        document.execCommand('copy');
        input.remove();
    }
}