import bnj from "./config/bnj";
import jushihui from "./config/jushihui";
import { isNotEmpty } from '@/utils/common.js';

//主题enum
let themeEnum = {
    'bnj':{
        type:'bnj',
        name:'喜庆红',
        config:bnj
    },
    'jushihui':{
        type:'jushihui',
        name:'格调青',
        config:jushihui
    }
}
// 当前主题
let projectTheme = 'bnj'

//设置主题样式并暴露主题对象到window下
function setThemeStyle(theme){
    let themeObj = window.themeObj = themeEnum[theme];
    Object.keys(themeObj.config).forEach(key=>{
        document.body.style.setProperty(`--${key}`, themeObj.config[key]);
    })
}

function setGrayscale(channelOptions){
    if (isNotEmpty(channelOptions.grayscaleFull) && channelOptions.grayscaleFull){
        document.getElementsByTagName('html')[0].classList.add('grayscaleFull');
    }
}

export function getThemeStyle(key) {
    return themeEnum[projectTheme].config[key]
}

//设置主题,从渠道获取配置
export async function changeTheme(){
    try {
        let channelOptions = await window.getChannelOptions; 
        if (isNotEmpty(channelOptions.theme)){
            projectTheme = channelOptions.theme;
        }
        setThemeStyle(projectTheme);
        setGrayscale(channelOptions);
    } catch (error) {
        setThemeStyle(projectTheme);
    }
}