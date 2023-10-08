/*
 * 小圆点状态
 * @params type sucess   绿色 成功状态  
 * @params type failed   红色 失败状态  
 * @params type pending  黄色 中间状态  
 * @params type normal   灰色 起止状态 
 * */
import React from 'react';
import styles from './index.less';

// 图标展示
const DotTag = (props) => {
    const {type , children} = props
    return (
        <span className={`${styles['dot']} ${styles[type]}`}>{children}</span>
    )
}
export default DotTag;