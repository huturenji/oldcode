import { connect } from 'dva';
import React, { Component } from 'react';
import { Tree } from 'antd';

@connect(({ decocoms }) => ({
    decocoms
}))

export default class SnTree extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedKeys:[],
            treeData:[]
        };
    }

    componentDidMount() {
        this.getTopSearchData()
    }

    getTopSearchData = ()=>{
        let { data, value, decocoms } = this.props;
        // console.log('data',data);       
        // console.log('decocoms',decocoms);
        
        let { checkedKeys } = this.state

        let options = data
        if (!Array.isArray(data) && data.connect) {
            options = decocoms[data.key]
        }

        options.forEach((item)=>{
            item.key = `${item.storeId}`
            item.title = item.storeName
            // if(item.supplierTypes&&item.supplierTypes.length>0){
            //     item.children = item.supplierTypes.map((e)=>({
            //         supplierType:e
            //     }))
            //     item.children.forEach((e)=>{
            //         e.key = e.supplierType
            //         e.title = e.supplierType
            //     })
            // }
        })
        let treeData = []
        treeData.push({
            key:"0",
            title:'全部',
            children:[]
        })
        treeData[0].children = options
        value && value.forEach((item)=>{
            checkedKeys.push(
                item.storeId
            )
            checkedKeys = checkedKeys.concat(item.supplierTypes)
        })
        this.setState({
            checkedKeys:checkedKeys,
            treeData:treeData
        })
    }

    //顶部搜索数据来源选择后数据处理
    onCheck = (checkedKeys, e)=>{
        let { data, onchange, decocoms } = this.props;

        let options = data
        if (!Array.isArray(data) && data.connect) {
            options = decocoms[data.key]
        }

        let supplierData = []
        e.checkedNodes.forEach((item)=>{
            if(options.filter(items => items.storeId==item.key)[0]!=undefined){
                supplierData.push(options.filter(items => items.storeId==item.key)[0])
            }
        })
        let infos = []
        supplierData.forEach((item)=>{
            // eslint-disable-next-line no-unused-vars
            let {storeName,contactPhone,key,title,vendorName,sort,state,children,...obj} = item
            infos.push(obj)
        })
        onchange(infos)
        this.setState({
            checkedKeys:checkedKeys
        })
    }

    render() {
        const { 
            style,
            label
        } = this.props
        let {checkedKeys,treeData} = this.state
        return (     
            <div style={style}>
                <div style={{marginRight:10}}>{label}</div>
                <Tree
                    checkable
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                />
            </div>
        );
    }
}
