import React from 'react';
// eslint-disable-next-line no-unused-vars
import styles from '../common/css/index-edit.less';


export default function SnTitle(props) {
    let { label, style = {} } = props

    return (
        <div className={`${styles.subtitle}`} style={style}>{ label }</div>
    )
}