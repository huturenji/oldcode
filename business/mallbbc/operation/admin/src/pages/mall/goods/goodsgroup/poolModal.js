/* eslint-disable no-shadow */

import { connect } from 'dva/index';
import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Modal,Input,Button
} from 'antd';
import { isEmpty,isNotEmpty,failTip,sucTip,guid,sldtbaleOpeBtnText,sldPopConfirmDiy } from '@/utils/utils';
import _styles from './css/product.less';

@connect(({ goodsgroup }) => ({
    goodsgroup
}))
export default class PoolModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productPoolName:'',
            productPoolId:'',
            groupData:[
                {
                    key: guid(),
                    groupName:''
                }
            ]
        };
    }

    componentDidMount() {
      
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        const {productPoolId,modalVisible} = nextProps
        if(isNotEmpty(productPoolId)&&modalVisible){
            this.getGroupList(productPoolId)
        }
    }

    //根据商品池id查询分组信息
	getGroupList = (productPoolId) => {
	    this.setState({ loading: true });
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'goodsgroup/productpool_getDetail',
	        payload: {productPoolId},
	        callback: (res) => {
	            this.setState({ loading: false });
	            if (res.state == 200) {
	                // eslint-disable-next-line no-shadow
	                const {productPoolName,productPoolId,groupResponses} = res.data
	                groupResponses.forEach((item)=>{
	                    item.key = guid()
	                })
	                this.setState({
	                    productPoolName,
	                    productPoolId,
	                    groupData:groupResponses
	                })
	            }
	        }
	    });
	};

    // 新增商品池
    productpool_add =()=>{
        const { dispatch } = this.props
        const { productPoolId,productPoolName,groupData } = this.state;
        this.setState({
            loading:true
        })
        let _groupList = []
        let error = []
        groupData.forEach((item,index)=>{
            if(isEmpty(item.groupName)){
                error.push(`第${index+1}项分组名称为空`)
            }
            let _param = {
                groupName:item.groupName,
                sort:index+1
            }
            if(item.groupId){
                _param.groupId = item.groupId
            }
            _groupList.push(_param)
        })
        if(error.length>0){
            const rdom = (<p style={{whiteSpace:'pre-line'}}>{`${error.join('\n')}`}</p>)
            failTip(rdom,6);
            error = [];
            this.setState({ loading: false });
            return false;
        }
        let param = {productPoolName,groupList:_groupList}
        let type = 'goodsgroup/productpool_add'
        if(isNotEmpty(productPoolId)){
            param.productPoolId = productPoolId
            type = 'goodsgroup/productpool_edit'
        }
        dispatch({
            type,
            payload:param,
            callback:(res)=>{
                if(res.state == 200){
                    sucTip(res.msg)
                    // eslint-disable-next-line no-shadow
                    const { productPoolId } = res.data
                    this.setState({
                        loading:false
                    })
                    this.props.confirm(productPoolId)
                }else{
                    failTip(res.msg)
                    this.setState({
                        loading:false
                    })
                }
            }
        })
    };

  poolNameChange = (e)=>{
      this.setState({ 
          productPoolName:e.target.value
      });
  }

   // 新增分组
   addGroup = ()=>{
       let { groupData } = this.state;
       if(groupData.length>=30){
           failTip('最多添加30个分类！')
           return
       }
       groupData.push({
           key: guid(),
           groupName:''
       });
       this.setState({ groupData });
   }

   // 删除
   delete = (key)=>{
       let { groupData } = this.state;
       groupData = groupData.filter(item => item.key != key);
       this.setState({ groupData }); 
   }

   groupNameChange = (e,record)=>{
       const { groupData } = this.state;
       const target = groupData.find(item=>item.key==record.key)
       if(target){
           target.groupName = e
           this.setState({
               groupData
           })
       }
   }

    sldConfirm = ()=>{
        const { productPoolName,groupData } = this.state;
        if(isEmpty(productPoolName)){
            failTip('请填写商品池名称！')
            return
        }
        if(isEmpty(groupData)){
            failTip('请填写分组信息！')
            return
        }
        if(groupData.length>30){
            failTip('最多添加30个分类！')
            return
        }
        this.productpool_add()
    }

    sldCancle = ()=>{
        this.props.cancle();
    }

    handleOnDragEnd = (result) => {
        if (!result.destination) {return;}
        const { groupData } = this.state
        const itemsCopy = [...groupData];
        const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
        itemsCopy.splice(result.destination.index, 0, reorderedItem);
        this.setState({
            groupData:itemsCopy
        })
    };

    render() {
        const { modalVisible } = this.props;
        console.log('modalVisible',modalVisible)
        const { productPoolName,groupData } = this.state;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                onCancel={this.sldCancle}
                visible={modalVisible}
                width='800px'
                title='商品池管理'
            >
                <div className={`${_styles['pool']}`}>
                    <div className={`${_styles['pool_name']}`}>
                        <span className={`${_styles['lable']}`}>商品池名称</span>
                        <Input 
                            maxLength={30}
                            style={{ width: 260 }}
                            placeholder="请输入商品池名称" 
                            value={productPoolName}
                            onChange={(e)=>{this.poolNameChange(e)}} 
                        />
                    </div>
                    <div className={`${_styles['pool_name']}`}>
                        
                        <DragDropContext onDragEnd={this.handleOnDragEnd}>
                            <Droppable droppableId="table">
                                {(provided) => (
                                    <table {...provided.droppableProps} ref={provided.innerRef} className={`${_styles['table']}`}>
                                        <thead>
                                            <tr>
                                                <th>序号</th>
                                                <th>分组名称</th>
                                                <th>操作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupData.map(({ key, groupName }, index) => (
                                                <Draggable key={key} draggableId={key} index={index}>
                                                    {(provided) => (
                                                        <tr
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            ref={provided.innerRef}
                                                        >
                                                            <td>{index+1}</td>
                                                            <td>
                                                                <Input
                                                                    defaultValue={groupName}
                                                                    style={{ width: '100%' }}
                                                                    maxLength={6}
                                                                    onBlur={e => this.groupNameChange(e.target.value,{key})}
                                                                />
                                                            </td>
                                                            <td>
                                                                {sldPopConfirmDiy('leftBottom', '删除后该分类下的商品会一并删除，是否确定删除', () => this.delete(key), '确定', '取消',
                                                                    sldtbaleOpeBtnText('删除', () => null))}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </tbody>
                                    </table>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Button style={{marginTop:'6px'}} onClick={this.addGroup}>新增分组</Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
