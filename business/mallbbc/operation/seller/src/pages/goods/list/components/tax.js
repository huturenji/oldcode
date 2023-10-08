import React, { Component } from 'react';
import { Input, Button, Row, Col } from 'antd';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';

import {
    failTip
} from '@/utils/utils';


export default class Tax extends Component {  
    

    constructor(props) {
        super(props);
        this.state = {
            link_type:''
        }
    }

    search = ()=>{
        this.setState({
            link_type:'tax'
        })
    }

    seleSku = (val) => {
        const {onChange } = this.props
        this.setState({ link_type: '' },()=>{onChange(val,'both')});
    };

    sldHandleLinkCancle = () => {
        this.setState({ link_type: '' });
    };

    checkRate = (val)=>{
        const { onChange } = this.props
        let reg = /^(100(\.00?)?|[1-9]?\d(\.\d\d?)?)%$/
        if(val && reg.test(val)){
            // todo
        }else{
            failTip('请输入正确的百分数')
            onChange('','taxRate')
        }
    }
    
    render() {
        const { link_type } = this.state;
        const { onChange,skuName,taxCode,taxRate } = this.props
       
        return (
            <div>
                <Row gutter={10}>
                    <Col span={7} style={{display:'flex'}}>
                        <div style={{paddingTop:"5px",flex:'130px'}}><span style={{color:"#FF2929"}}>*</span>商品税务编码:</div>
                        <Input value={taxCode} placeholder="请输入商品税务编码" onChange={(e)=>{onChange(e.target.value,'taxCode')}} />
                    </Col>
                    <Col span={7} style={{display:'flex'}}>
                        <span style={{paddingTop:"5px",flex:'60px'}}><span style={{color:"#FF2929"}}>*</span>税率:</span>
                        <Input onBlur={(e)=>{this.checkRate(e.target.value)}} value={taxRate} placeholder="请输入税率,如13%" onChange={(e)=>{onChange(e.target.value,'taxRate')}} />
                    </Col>
                    <Col span={1}>
                        <Button type="text" onClick={this.search}>查询</Button>
                    </Col>
                </Row>
    
                <SldSelGoodsSingleDiy
                    link_type={link_type}
                    seleSku={this.seleSku}
                    sldHandleCancle={this.sldHandleLinkCancle}
                    skuName={skuName}
                />
            </div>
        )

    }
    
}