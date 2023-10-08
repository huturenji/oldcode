/*
* 多选组件——左右布局，这样能看到更多的数据
* 用于装修商品选择
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Radio,Form,Modal,Checkbox } from 'antd';
import {
    failTip
} from '@/utils/utils';
import styles from './index.less';

@connect(({ project }) => ({
    project
}))
@Form.create()
export default class SldSelMoreLeftRightGoods extends Component {
    init_flag = true;

    loading_pagination_flag = false;//分页加载标识，防止分页重复加载

    constructor(props) {
        super(props);
        this.state = {
            selectedGoodsPool: {},//选中的商品池
            selectedGoodsGroup: [],//选中的分组
            modalVisible: false,
            loading: false,
            goodsPoolList:[
                
            ],
            boxGoodsPool:{},//商品池默认选中所需信息
            boxGoodsGroupList:[],//分组默认选中所需信息
            goodsGroupList:[
                
            ]//商品池分组
        };
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.modalVisible) {
            this.get_goodspool_list()
            this.setSelectedGoodsGroup(nextProps)
            
            this.setState({
                boxGoodsPool: nextProps.selectedGoodsPool,
                selectedGoodsPool: nextProps.selectedGoodsPool
            });
        }
    }

    componentWillUnmount() {

    }

    setSelectedGoodsGroup = async(nextProps)=>{
        let {boxGoodsGroupList} =this.state
        await this.get_goodsgroup_list(nextProps?.selectedGoodsPool?.productPoolId)
        if(nextProps.selectedGoodsGroup){
            nextProps.selectedGoodsGroup.forEach((item)=>{
                boxGoodsGroupList.push(item.groupId)
            })
        }
        this.setState({
            boxGoodsGroupList,
            selectedGoodsGroup:nextProps.selectedGoodsGroup
        });
    }

    //获取数据列表 type 为2 代表是导入的
    get_goodspool_list = () => {
        this.setState({ loading: true });
        let {goodsPoolList} = this.state
        const { dispatch } = this.props;
        let dis_type = '';
        let new_params = { pageSize:1000,pageIndex:1 };
        dis_type = 'project/get_productpool_lists';
        dispatch({
            type: dis_type,
            payload: new_params,
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    if(res.data&&res.data.list){
                        goodsPoolList = res.data.list
                    }
                }
                this.setState({
                    goodsPoolList
                })
            }
        });
    };

    //获取数据列表 type 为2 代表是导入的
    get_goodsgroup_list = (productPoolId) => {
        let {goodsGroupList} = this.state
        const { dispatch } = this.props;
        let dis_type = '';
        let new_params ={productPoolId:productPoolId}
        dis_type = 'project/get_productgroup_lists';
        dispatch({
            type: dis_type,
            payload: new_params,
            callback: (res) => {
                if (res.state == 200) {
                    if(res.data&&res.data.groupResponses){
                        goodsGroupList = res.data.groupResponses
                    }
                }
                this.setState({
                    goodsGroupList
                })
            }
        });
    };

    //取消事件
    sldCancle = () => {
        this.setState({
            selectedGoodsPool: {},
            selectedGoodsGroup: []
        });
        this.props.sldHandleSeleMoreModalCancle();
    };

    onChangeGoodsPool=(e)=>{
        let { boxGoodsPool,goodsPoolList } = this.state;
        boxGoodsPool.productPoolId = e
        boxGoodsPool.productPoolName = goodsPoolList.find(item=>item.productPoolId==e).productPoolName
        this.setState({
            boxGoodsPool,
            selectedGoodsPool:JSON.parse(JSON.stringify(boxGoodsPool))
        })
        this.get_goodsgroup_list(e)
    }

    onChangeGoodsGroup=(value)=>{
        let { selectedGoodsGroup,goodsGroupList } = this.state;
        selectedGoodsGroup = []
        value.forEach(item => {
            selectedGoodsGroup.push({
                groupId:item,
                groupName:goodsGroupList.find(items=>items.groupId==item).groupName
            })
        });
        this.setState({
            selectedGoodsGroup,
            boxGoodsGroupList:value
        })
    }

    sldConfirm = () => {
        let { selectedGoodsPool, selectedGoodsGroup } = this.state;
        if(JSON.stringify(selectedGoodsPool)==='{}'){
            failTip('请选择商品池')
            return
        }
        if(selectedGoodsGroup.length==0){
            failTip('请选择分组')
            return
        }
        this.props.seleSvideo(selectedGoodsPool,selectedGoodsGroup)
        this.setState({
            selectedGoodsPool: {},
            selectedGoodsGroup: []
        });
    };

    render() {
        const { modalVisible, width, title, height } = this.props;
        const { selectedGoodsPool, goodsGroupList,boxGoodsGroupList,goodsPoolList } = this.state;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                afterClose={this.closeReset}
                onCancel={this.sldCancle}
                visible={modalVisible}
                width={width}
                title={title}
            >
                <div style={{ padding:20 }}>商品池选择：</div>
                <div className={`${styles.component_sele_more}`} style={{ height: height }}>
                    <div className={styles.left}>
                        <div>商品池</div>
                        <Radio.Group value={selectedGoodsPool?.productPoolId} onChange={(e) => this.onChangeGoodsPool(e.target.value)}>
                            { goodsPoolList.map((item, index) => <Radio value={item.productPoolId} key={item.productPoolName + index}>{ item.productPoolName }</Radio>) }
                        </Radio.Group>
                    </div>
                    <div className={styles.right}>
                        <div>分组</div>
                        <Checkbox.Group size="small" onChange={(e) => this.onChangeGoodsGroup(e)} value={boxGoodsGroupList}>
                            {goodsGroupList.length > 0 && goodsGroupList.map((val) => <div key={val.groupId} style={{padding:5, display: 'inline-block' }}>
                                <Checkbox style={{}} value={val.groupId}>{`${val.groupName}`}</Checkbox>
                            </div>)}
                        </Checkbox.Group>
                    </div>
                </div>
            </Modal>
        );
    }
}
