// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './index.less';

/**
 * @name 按钮权限模块
 * @param {string} eventKey 当前权限点，四类权限"view", "add", "edit", "delete","audit"
 * @param {Array<String>} btnAuth 所有权限点
 * 用法：
 *  import AuthBtn from '@/components/AuthBtn';
 *  <AuthBtn eventKey="audit" btnAuth={['view','audit']}>
      <Button type="primary" >审核</Button>
    </AuthBtn>
    如果当前页面有"audit"这个权限则该按钮显示，反之则隐藏
 */
const AuthBtn = ({ btnAuth, eventKey, showPage, children}) => {
    if (eventKey) {
        if(!Array.isArray(eventKey)){eventKey = [eventKey]}
        if (Array.isArray(btnAuth) && btnAuth.some(val => eventKey.includes(val))) {
            return children;
        }
        if(eventKey.some(item => item.includes('view')) && showPage){
            return <div className={`${styles.noway}`}>暂无访问权限</div>
        } 
        return null;
    }
    return children;
}

export default AuthBtn;

