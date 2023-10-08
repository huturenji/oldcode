import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form ,Button,Upload,message,Checkbox,notification,Spin,Radio} from 'antd';
import JSZip from 'jszip';
import {
    failTip,
    getAuthBtn,
    list_com_page_more
} from '@/utils/utils';
import global from '@/global.less';
import promotion from '@/assets/css/promotion.less';
import msgChannelData from '@/assets/json/msg_channel.json';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
// 请求渠道信息最大条数为10000
let pageMore = list_com_page_more;
@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()
export default class ImportMsgTplList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            channelData:[],//所有的渠道信息
            selChannelData:[],//选择渠道类型后，当前渠道类型的所有渠道信息
            data:[],//模板信息
            selChannel:[],//选中得渠道信息
            selChannelAppContentList:[],//选中的最后一个渠道的所有模板内容
            contentList:[]//上传得文件信息
        };
    }

    componentDidMount() {
        this.get_list();
        this.get_operation_list()
    }

    beforeUploadFun = (file,fileList)=>{
        //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
        fileList = fileList.slice(-1);
        const isZip = file.name.split('.')[file.name.split('.').length-1] === 'zip';
        if (!isZip) {
            message.error('请上传zip文件!');
            return false
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件需小于10MB!');
            return false
        }
        const f = fileList[0];
        this.uploadData(f)
    }

    //导入模板
    uploadData = (zip)=>{
        var new_zip = new JSZip();
        let {data} = this.state
        let list = []
        new_zip.loadAsync(zip).then((e) => {
            for (let item in e.files){
                if(data.findIndex(items=>items.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,'') === item.split('.')[0]) !== -1){
                    new_zip.file(item).async("string").then(content => {
                        //得到我们需要的JSON文件内容
                        list.push({
                            tplName:item.split('.')[0],
                            appContent:content
                        })
                        this.setState({
                            contentList:list
                        })
                    });
                }else{
                    failTip(`${item.split('.')[0]}对应的服务提醒不存在，请重新上传`,5);
                    return false
                }
            }
        });   
    }

    //选择渠道
    channel_select = (e) => {
        let {data,selChannelAppContentList,selChannelData} = this.state
        selChannelAppContentList = []
        if(e.length>0){
            let selChannelId = e[e.length-1]
            data.forEach((item)=>{
                if(!!item.appNoticeList){
                    item.appNoticeList.forEach((items)=>{
                        if(items.channelId == selChannelId&&items.appContent!==''){
                            selChannelAppContentList.push({
                                tplName:item.tplName,
                                tplCode:items.tplCode,
                                appContent:items.appContent
                            })
                        }
                    })
                }
            }) 
        }
        this.setState({
            selChannelData,
            selChannelAppContentList,
            selChannel:e
        })
    }

    handleSaveAllData = ()=>{
        let {reGetList} = this.props
        let {selChannel,contentList,data,selChannelAppContentList} = this.state
        if(selChannel.length == 0){
            failTip('请选择渠道');
            return false
        }
        let list = JSON.parse(JSON.stringify(contentList))
        selChannelAppContentList.forEach((item)=>{
            if(list.findIndex(e=>e.tplName === item.tplName)===-1){
                list.push(item)
            }
        })
        let showlist = []
        list.forEach(item => {
            selChannel.forEach(items=>{
                let params = {}
                params.appNoticeList = []
                params.appSwitch = data.find(e=>e.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,'') === item.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,'')).appSwitch
                params.tplCode = data.find(e=>e.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,'') === item.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,'')).tplCode
                let descEncodeSwitch
                let selAppNoticeList = data.find(e=>e.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,'') === item.tplName.replace(/\\|\>|\:|\*|\"|\||\<|\/|\?|\s*/g,''))?.appNoticeList
                if(!!selAppNoticeList&&selAppNoticeList.length>0){
                    descEncodeSwitch = selAppNoticeList.find(l=>l.channelId==items)?.descEncodeSwitch
                }else{
                    descEncodeSwitch = 0
                }
                params.appNoticeList.push({
                    channelId:items,
                    appContent:item.appContent,
                    descEncodeSwitch:descEncodeSwitch
                })
                params.appNoticeList = JSON.stringify(params.appNoticeList)
                showlist.push(this.operateMsg(params))
            })
        });
        Promise.allSettled(showlist).then(item => {
            this.setState({ initLoading: false });
            this.uploadFn(item)
            reGetList()
            this.get_list()
        })
    }

    //消息模板操作  edit：编辑 switch：开关切换
    operateMsg = (params) => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        let {data,channelData} = this.state
        return new Promise((resolve, reject) => {
            dispatch({
                type: 'sldsetting/update_member_msg_tpl',
                payload: params,
                callback: (res) => {
                    let listItem = data.find(item=>item.tplCode === params.tplCode)
                    let appNoticeList = JSON.parse(params.appNoticeList)
                    let channelName = channelData.find(item=>item.channelId === appNoticeList[0].channelId).channelName
                    if (res.state == 200) {
                        resolve(`${listItem.tplName}下${channelName}渠道的模板数据更新成功`);
                    } else {
                        reject(`${listItem.tplName}下${channelName}渠道的模板数据更新失败`);
                    }
                }
            });
        })
    };

    uploadFn = (list) => {
        const msgDom = (
            <div style={{maxHeight: '250px', 'overflowY': 'auto'}}>
                {list.map(item => (
                    <div key={item} style={{color: item.value ? '#52c41a' : '#ff4d4f', margin: '2px 0' }}>{item.value || item.reason}</div>
                ))}
            </div>
        )
        notification.open({
            message: '导入结果',
            description: msgDom,
            onClick: () => {},
            duration: null
        })
    }

    // eslint-disable-next-line react/sort-comp
    upProps = {
        name: 'file', //发到后台的文件参数名
        // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
        headers: { Authorization: 'SID' }, // 
        showUploadList: false,
        beforeUpload: this.beforeUploadFun
    }

    //清空导入得模板
    resetContent = ()=>{
        this.setState({
            contentList:[]
        })
    }

    //获取服务提醒数据列表
    get_list = () => {
        this.setState({ initLoading: true });
        const { dispatch } = this.props;
        let { data } = this.state;
        dispatch({
            type: 'sldsetting/get_member_msg_tpl_lists',
            payload: { },
            callback: (res) => {
                this.setState({ initLoading: false });
                if (res.state == 200) {
                    data = res.data.map((item, index) => Object.assign({}, item, { index }));
                    this.setState({ data:data });
                }
            }
        });
    };

    //获取渠道信息
    get_operation_list = () => {
        const { dispatch } = this.props;
        this.setState({ initLoading: true });
        dispatch({
            type: 'sldsetting/operation_list',
            payload: { pageSize:pageMore,pageNum:1 },
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    if (res.data.channelInfos && res.data.channelInfos.length > 0) {
                        this.setState({ channelData:res.data.channelInfos })
                    } else {
                        failTip('未查询到渠道信息，请添加渠道');
                    }
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    //改变渠道类型
    changeChannelType = (e)=>{
        let {channelData} = this.state
        let list = []
        if (e.target.value === '普通渠道') {
            channelData.forEach(item => {
                let pushFlag = false
                msgChannelData.forEach(items => {
                    if (items.value.some(temp => temp === item.channelId)) {
                        pushFlag = true
                    }
                })
                if (!pushFlag) {
                    list.push(item)
                }
            })
        } else {
            msgChannelData.forEach(item => {
                if(item.key === e.target.value){
                    item.value.forEach((items)=>{
                        if(channelData.findIndex(temp=>temp.channelId===items)!==-1){
                            list.push(channelData.filter(temp=>temp.channelId===items)[0]) 
                        }
                    })
                }
            })
        }
        this.setState({
            selChannel:[],
            selChannelData:list
        })
    }

    render() {
        let {selChannelData,contentList,selChannelAppContentList,initLoading,selChannel} = this.state
        const {
            form: { getFieldDecorator }
        } = this.props;
        return (
            <div className={global.common_page} style={{maxHeight:700,overflowY:'scroll'}}>
                <Spin spinning={initLoading}>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`} style={{marginTop:30}}>
                        <div className={`${promotion.left}`} style={{width:100}}>
                            <span style={{ color: '#FF1515' }} />选择渠道
                        </div>
                        
                        <div className={`${promotion.right}`} style={{flex:1,marginLeft:50}}>
                            <div>
                                <Radio.Group size="small" onChange={(e) => this.changeChannelType(e)}>
                                    {msgChannelData.length > 0 && msgChannelData.map((val) => <div style={{padding:5, display: 'inline-block' }}>
                                        <Radio key={val.key} value={val.key}>{`${val.key}`}</Radio>
                                    </div>)}
                                </Radio.Group>
                            </div>
                            {getFieldDecorator('selChannel', {
                                initialValue: selChannel
                            })(
                                <Checkbox.Group size="small" onChange={(e) => this.channel_select(e)}>
                                    {selChannelData.length > 0 && selChannelData.map((val) => <div key={val.channelId} style={{padding:5, display: 'inline-block' }}>
                                        <Checkbox style={{}} value={val.channelId}>{`${val.channelName}(${val.channelId})`}</Checkbox>
                                    </div>)}
                                </Checkbox.Group>
                            )}
                        </div>
                    </div>

                    <div className={`${promotion.item} ${global.flex_row_start_start}`} style={{marginTop:30}}>
                        <div className={`${promotion.left}`} style={{width:100}}>
                            <span style={{ color: '#FF1515' }} />最后选中的一个渠道的所有模板:
                        </div>
                        <div className={`${promotion.right}`} style={{flex:1,marginLeft:50}}>
                            <div style={{color:'red'}}>此时若点保存则会将此套模板更新到选中的所有渠道</div>
                            <div>
                                {selChannelAppContentList.length>0&&selChannelAppContentList.map((val)=>
                                    <div key={val.tplName}>
                                        {val.tplName}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`${promotion.item} ${global.flex_row_start_start}`} style={{marginTop:50}}>
                        <div className={`${promotion.left}`} style={{width:100}}>
                            <span style={{ color: '#FF1515' }} />上传模板（.zip压缩包）
                        </div>
                        <div className={`${promotion.right}`} style={{flex:1,marginLeft:50}}>
                            <div style={{color:'red'}}>上传的压缩包内的文件名称即为服务提醒。例如需要更改‘售后提醒’和‘预约提醒’，上传的压缩包内的文件应为‘售后提醒.html’和‘预约提醒.html’</div>
                            <div style={{color:'red'}}>导入的模板会替换原有模板</div>
                            <Upload {...this.upProps}>
                                <Button>导入模板</Button>
                            </Upload>
                            <Button onClick={()=>{this.resetContent()}}>清空模板</Button>
                            <div>
                                {contentList.length>0&&contentList.map((val)=>
                                    <div key={val.tplName}>
                                        {val.tplName}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className={global.m_diy_bottom_wrap}
                        style={{ position: 'fixed', left:160 }}
                    >
                        <AuthBtn eventKey={['edit_import_tpl']} btnAuth={btnAuth}>
                            <div
                                onClick={this.handleSaveAllData}
                                className={`${global.add_goods_bottom_btn} ${global.add_goods_bottom_btn_sel}`}
                            >
                        保存
                            </div>

                        </AuthBtn>
                    </div>
                </Spin>
                
            </div>
            
        );
    }
}
