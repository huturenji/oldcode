//动态声明publicPath
const PUBLIC_PATH = (function(){
    let script = document.currentScript;
    return script.src.substring(0, script.src.lastIndexOf('/')+1)
})();
__webpack_public_path__ = PUBLIC_PATH