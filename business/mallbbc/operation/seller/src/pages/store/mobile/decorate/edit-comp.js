import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select, Button, Switch} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const AddItemModal = ({ mdecorate, dispatch,upMenuList, form: { getFieldDecorator, validateFieldsAndScroll, resetFields} }) => {
    const {
        modalType,
        records,
        addItemModalVisible
    } = mdecorate

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 5 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 }
        }
    }
    let initApplyList = []
    if(records?.apply){
        const arr = records.apply.split(',')
        arr.shift()
        initApplyList = arr
    }

    const handleSubmit = () => {
        validateFieldsAndScroll((err, values) => {
            values.apply = `,${values.apply.join(',')}`
            values.isUse = values.isUse?1:0
            if(modalType==1){
                // 新增
                dispatch({
                    type: 'mdecorate/addTplMobile',
                    payload: {callBack:upMenuList, ...values }
                })
            }else{
                // 编辑
                dispatch({
                    type: 'mdecorate/updateTplMobile',
                    payload: {callBack:upMenuList,tplId:records.tplId, ...values }
                })
            }
            dispatch({
                type: 'mdecorate/setParams',
                payload: {
                    addItemModalVisible: false
                }
            })
        });
    }


    const cancelClick = () => {
        dispatch({
            type: 'mdecorate/setParams',
            payload: {
                addItemModalVisible: false
            }
        })
        resetFields();
    }

    const deleteTplMobile = ()=>{
        dispatch({
            type: 'mdecorate/deleteTplMobile',
            payload: {
                tplId:records.tplId,
                callBack:upMenuList
            }
        })
        dispatch({
            type: 'mdecorate/setParams',
            payload: {
                addItemModalVisible: false
            }
        })
        resetFields();
    }

    const addData = {
        title: modalType==1 ? '新增' : '编辑',
        // okText: '确定',
        width: 600,
        visible: addItemModalVisible,
        onOk: () => handleSubmit(),
        onCancel: () => cancelClick(),
        footer:[
            <Button key='close' onClick={() => cancelClick()}>取消</Button>,
            <Button key='delete' onClick={() => deleteTplMobile()}>删除</Button>,
            <Button key='submit' onClick={() => handleSubmit()}>确定</Button>
        ]
    }

   
    return (
        <Modal {...addData}>
            <Form onSubmit={handleSubmit} style={{marginTop:'20px'}}>

                <FormItem {...formItemLayout} label="应用页面">
                    {getFieldDecorator('apply', {
                        initialValue: records ? initApplyList : []
                    })(
                        <Select mode="multiple" placeholder='请选择应用页面'>
                            <Option value="home">首页装修</Option>
                            <Option value="topic">专题装修</Option>
                            <Option value="integral">积分</Option>
                            <Option value="seller">商家</Option>
                            <Option value="spreader">推手</Option>
                        </Select>
                    )}
                </FormItem>
                
                <FormItem {...formItemLayout} label="图标名称">
                    {getFieldDecorator('icon', {
                        // rules: [
                        //     { max: 20, message: '图标名称最大长度为20个字符' }
                        // ],
                        initialValue: records ?records.icon : ''
                    })(
                        <Input placeholder="请输入图标名称" />
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="项目显示名称">
                    {getFieldDecorator('showName', {
                        rules: [
                            { max:6, message: '项目显示名称最大长度为6个字符' }
                        ],
                        initialValue:records ?records.showName : ''
                    })(
                        <Input placeholder="请输入项目显示名称" />
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="项目名称">
                    {getFieldDecorator('name', {
                        initialValue:records ?records.name : ''
                    })(
                        <Input placeholder="请输入项目名称" />
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="项目类型">
                    {getFieldDecorator('type', {
                        rules: [
                            // { max: 10, message: '项目类型最大长度为10个字符' },
                        ],
                        initialValue: records ?records.type : ''
                    })(
                        <Input placeholder="请输入项目类型" />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="启用">
                    {getFieldDecorator('isUse', {
                        rules: [

                        ],
                        initialValue: records&&records.isUse==1?true:false,
                        valuePropName: 'checked'
                    })(
                        <Switch />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="排序">
                    {getFieldDecorator('sort', {
                        rules: [
                            { max: 10, message: '项目类型最大长度为10个字符' }
                        ],
                        initialValue: records ?records.sort : ''
                    })(
                        <Input placeholder="请输入排序" />
                    )}
                </FormItem>

            </Form>
        </Modal>
    );
};

AddItemModal.propTypes = {};

export default connect((mdecorate) => (mdecorate))(Form.create()(AddItemModal));
