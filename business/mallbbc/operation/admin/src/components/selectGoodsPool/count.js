import React, { Component } from 'react';
import { Input,Icon } from 'antd';
import styles from './index.less';

export default class Count extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count:this.props.value||1
        };
    }

    componentDidMount() {
       
    }

    minus = ()=>{
        let {count} = this.state
        count = count -1
        this.setState({
            count
        },()=>{
            this.onPropsChange()
        })
    }

    add = ()=>{
        let {count} = this.state
        count = count + 1
        this.setState({
            count
        },()=>{
            this.onPropsChange()
        })
    }

    onChangeNum=(e)=>{
        let value = e.target.value
        // let reg = /^[1-9]\d*$/
        // if(reg.test(value)){

        // }else{
        //     value = 1
        // }
        this.setState({
            count:value
        },()=>{
            this.onPropsChange()
        })
    }

    onBlur=(e)=>{
        let value = e.target.value
        let reg = /^[1-9]\d*$/
        if(reg.test(value)){
            value = parseInt(value)
        }else{
            try {
                value = this._isNaN(parseInt(value))?1:(parseInt(value)>1?parseInt(value):1)
            } catch (error) {
                value = 1
            }
        }
        this.setState({
            count:value
        },()=>{
            this.onPropsChange()
        })
    }

    _isNaN = (value)=>{
        // eslint-disable-next-line no-self-compare
        if(value!==value){
            return true
        }
        return false
    }

    onPropsChange=()=>{
        const {onChange} = this.props
        let {count} = this.state
        onChange && onChange(count)
    }


    render() {
        const { count } = this.state;
        const { min,disabled } = this.props
        console.log(min) 
        return (
            <div style={{width:'120px'}}>
                <Input 
                    addonBefore={<Icon type="minus" onClick={this.minus} style={{pointerEvents:`${count==min?'none':''}`}} className={`${disabled?styles._disabled:''}`} />} 
                    addonAfter={<Icon type="plus" onClick={this.add} className={`${disabled?styles._disabled:''}`} />} 
                    value={count}
                    onChange={this.onChangeNum}
                    onBlur={this.onBlur}
                    disabled={disabled}
                />
            </div>
        );
    }
}
