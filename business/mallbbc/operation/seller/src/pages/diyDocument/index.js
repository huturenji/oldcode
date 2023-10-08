import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

// 介绍文档 ，必须是严格json
const docJson = require('./diydoc.json');
// 文档介绍
const Index = () => (
    <div className={`${styles['warp']}`}>
        <div className={`${styles['title']}`}>
            装修组件说明文档
        </div>
        <div className={`${styles['url']}`}>
            图标名称地址：https://bplussit.sinosun.com:18380/mallbbcg2/static/admin/index.html#/showicon
            <span>（没有具体规范，与项目名称相符即可）</span>
        </div>
        <Row>
            {
                docJson.map((item)=><Col span={24} className={`${styles['item']}`}>
                    <div className={`${styles['name']}`}>
                        {item.name}
                    </div>
                    <div className={`${styles['used']}`}>
                            项目类型：{item.type} <span style={{color:'red'}}>（新建组件时填入，需要正确输入，否则组件无法展示）</span>
                    </div>
                    <div className={`${styles['describe']}`}>
                            描述：{item.describe}
                    </div>
                    <div className={`${styles['used']}`}>
                            使用：{item.used}
                    </div>
                </Col>)
            }
        </Row>
    </div>
)

export default Index;
