/*
 * 小圆点状态
 * @params type sucess   绿色 成功状态  
 * @params type failed   红色 失败状态  
 * @params type pending  黄色 中间状态  
 * @params type normal   灰色 起止状态 
 * */
import React from 'react';
import styles from './tag.less';

// 图标展示
const Tag = (props) => {
    const {type , children} = props
    return (
        <span className={`${styles['tag']} ${styles[type]}`}>{children}</span>
    )
}
export default Tag;