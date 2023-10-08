
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Modal,Radio,Icon 
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { isEmpty,failTip } from '@/utils/utils';
import styles from './index.less';

@connect(({ pc_home, project }) => ({
    pc_home,
    project
}))
export default class CategoryModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            category1:[],
            category2:[],
            category3:[],
            category4:[],
            categoryPath:[],
            checkItem:{},
            checkPath:[]

        };
    }

    componentDidMount() {
        // this.initData()
    }

    componentWillReceiveProps(nextProps) {
        const { categoryData,categoryVOList } = nextProps

        if(categoryData&&categoryData.length>0){
            this.initData(categoryData)
        }
        if(categoryVOList&&categoryVOList.length>0){
            this.initCategory(categoryData,categoryVOList)
        }
    }

    componentWillUnmount() {
    }

    initCategory = (categoryData,categoryVOList) => {
        let category1 = categoryData
        let category2 = []
        let category3 = []
        let checkPath = []
        // let categoryPath=[]
        let checkItem={}
        //获取一级目录树
        console.log("categoryVOList",categoryVOList)
        console.log("category1",category1)
        
        console.log("1",categoryVOList[0].categoryId1)
        if(categoryVOList[0].categoryId1){
            let index = category1.findIndex((item) => item.categoryId == categoryVOList[0].categoryId1)
            console.log("index",index)
            if(index!=-1){
                category2 = category1[index].children
                checkPath.push(category1[index])
                checkItem = {
                    categoryId:category1[index].categoryId,
                    categoryName:category1[index].categoryName,
                    grade:1
                }
            }
        }
        //获取二级目录树
        console.log("1",categoryVOList[0].categoryId2)
        if(categoryVOList[0].categoryId2){
            let index = category2.findIndex((item) => item.categoryId == categoryVOList[0].categoryId2)
            if(index!=-1){
                category3 = category2[index].children
                checkPath.push(category2[index])
                checkItem = {
                    categoryId:category2[index].categoryId,
                    categoryName:category2[index].categoryName,
                    grade:2
                }
            }
        }
        //获取三级目录树
        console.log("1",categoryVOList[0].categoryId3)
        if(categoryVOList[0].categoryId3){
            let index = category3.findIndex((item) => item.categoryId == categoryVOList[0].categoryId3)
            if(index!=-1){
                checkPath.push(category3[index])
                checkItem = {
                    categoryId:category3[index].categoryId,
                    categoryName:category3[index].categoryName,
                    grade:3
                }
            }
        }
        this.setState({
            category1,
            category2,
            category3,
            checkPath,
            checkItem
        })
        console.log("checkPath",checkPath,category1,category2,category3,checkItem)
    }

    initData = (categoryData)=>{
        if(!categoryData){
            return 
        }
        if(categoryData.length==0){
            return 
        }
        let category1 = categoryData
        let category2 = category1[0].children
        let category3 = category2[0].children
        this.setState({
            category1,
            category2,
            category3
        })
    }

    onChange = (e)=>{
        const {category1,category2,category3} = this.state
        let categoryAll = [...category1,...category2,...category3]
        const item = categoryAll.find((el)=>el.categoryId==e.target.value)
        if(item){
            const {categoryId,categoryName,grade,pid} = item
            let checkPath = []
            checkPath.unshift(item)
            let copy = {pid}
            while(copy.pid != 0){
                let ele = categoryAll.find((el)=> el.categoryId == copy.pid)
                if(ele){
                    checkPath.unshift(ele)
                    copy = {pid:ele.pid}
                }else{
                    copy = {pid:0}
                }
               
            }
            this.setState({
                checkItem:{
                    categoryId,
                    categoryName,
                    grade
                },
                checkPath
            })
        }
    }

    expread = (item)=>{
        const { categoryPath } = this.state
        const {children , grade} = item
        // 获取前n项
        let categoryPathCopy = categoryPath.splice(0,grade)
        categoryPathCopy[grade-1] = item
        if(grade==1){
            this.setState({
                category2:children || [],
                category3:[],
                categoryPath:categoryPathCopy
            }) 
        }
        else if(grade==2){
            this.setState({
                category3:children || [],
                categoryPath:categoryPathCopy
            })
        }else if(grade==3){
            this.setState({
                categoryPath:categoryPathCopy
            })
        }
    }

    sldConfirm = ()=>{
        const { checkItem ,checkPath} = this.state
        if(isEmpty(checkItem)){
            failTip('请选择数据')
            return false
        }
        const fullPath = this.haveCheckedPath(checkPath)
        this.props.confirmCategory(checkItem,fullPath)
    }

    sldCancle = ()=>{
        this.props.cancleCategory();
    }

    haveCheckedPath = (checkPath)=>{
        let path = ''
        let LEN = checkPath.length
        checkPath.forEach((item,index)=>{
            if(index+1 == LEN){
                path += (`${item.categoryName }`)
            }else{
                path += (`${item.categoryName } / `)
            }
            
        })
        return path
    }

    render() {
        const { modalVisible } = this.props;
        const { category1,category2,category3,categoryPath,checkItem,checkPath } = this.state;
        const [ Path1,Path2,Path3 ] = categoryPath
        const radioStyle = {
            height: '44px',
            lineHeight: '44px'
        };
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                onCancel={this.sldCancle}
                visible={modalVisible}
                width='1000px'
                title='选择分类'
            >
                <div className={`${styles.category}`}>
                    <div className={`${styles.des}`}>仅能选择某一级别下的一个类别已选：{this.haveCheckedPath(checkPath)}</div>
                    <Radio.Group style={{display:'block'}} onChange={this.onChange} value={checkItem.categoryId}>
                        <div className={`${styles.content}`}>
                            <div className={`${styles.col}`}>
                                <div className={`${styles.range_name}`}>一级分类</div>
                                <div className={`${styles.range_category}`}>
                                    <Scrollbars
                                        autoHeight
                                        autoHeightMin={564}
                                    >
                                        {
                                            category1.map((item)=>(
                                                <div className={`${styles.range_item}`}>
                                                    <Radio value={item.categoryId} style={radioStyle}></Radio>
                                                    <div className={`${styles.label} ${(Path1 && Path1.categoryId==item.categoryId)?styles.current:''}`} onClick={()=>{this.expread(item,'grade1')}}>
                                                        <span>{item.categoryName}</span>
                                                        <Icon type="right" className={`${styles.icon}`} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={`${styles.col}`}>
                                <div className={`${styles.range_name}`}>二级分类</div>
                                <div className={`${styles.range_category}`}>
                                    <Scrollbars
                                        autoHeight
                                        autoHeightMin={564}
                                    >
                                        {
                                            category2.map((item)=>(
                                                <div className={`${styles.range_item}`}>
                                                    <Radio value={item.categoryId} style={radioStyle}></Radio>
                                                    <div className={`${styles.label} ${(Path2 && Path2.categoryId==item.categoryId)?styles.current:''}`} onClick={()=>{this.expread(item,'grade2')}}>
                                                        <span>{item.categoryName}</span>
                                                        <Icon type="right" className={`${styles.icon}`} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={`${styles.col}`}>
                                <div className={`${styles.range_name}`}>三级分类</div>
                                <div className={`${styles.range_category}`}>
                                    <Scrollbars
                                        autoHeight
                                        autoHeightMin={564}
                                    >
                                        {
                                            category3.map((item)=>(
                                                <div className={`${styles.range_item}`}>
                                                    <Radio value={item.categoryId} style={radioStyle}></Radio>
                                                    <div className={`${styles.label} ${(Path3 && Path3.categoryId==item.categoryId)?styles.current:''}`} onClick={()=>{this.expread(item,'grade3')}}>
                                                        <span>{item.categoryName}</span>
                                                        <Icon type="right" className={`${styles.icon}`} />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className={`${styles.col}`}>
                                <div className={`${styles.range_name}`}>四级分类</div>
                                <div className={`${styles.range_category}`}>

                                </div>
                            </div>
                        </div>
                    </Radio.Group>
                </div>
            </Modal>
        );
    }
}
