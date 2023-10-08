import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Select, Tabs } from 'antd';
import { getAuthBtn, hasAuth, sldComLanguage } from '@/utils/utils';
import global from '@/global.less';
import mdiy from '@/pages/decorate/mobile/deco/common/mdecorate.less';
import Home from './diy_page_lists';
import Topic from '../topic/topic_diy_page_lists';
import HomeSetting from './home_setting';
import HomeNav from './nav';
import Footer from './footer'
// import Information from './information'
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const Option = Select.Option
const TabPane = Tabs.TabPane;
@connect(({ article }) => ({
    article
}))
export default class Lists extends Component {
    constructor(props) {
        super(props);

        this.state = {
            channelList: [],
            currentChannelId: undefined,
            channel: {},
            tabkey1:'view_home_deco',
            activeTabKey: 'home', // tab类型
            query: {
                type: '',
                channelId: ''
            }
        };
        this.firstChange = true
        this.tabbarRef = null
        this.homeRef = null
        this.topicRef = null
        this.informationRef = null
    }

    componentDidMount() {
        const { location } = this.props
        let { query, activeTabKey } = this.state
        if(!location.query.type) {
            this.get_operation_list()
            // 如果参数没有type 则设置上第一个tab类型
            query.type = activeTabKey
            this.setState({ query })
            this.setUrlParams()
        } else {
            this.firstChange = false
            this.get_operation_list(true)
        }
    }

    componentWillUnmount() {}

    // 设置url 参数
    setUrlParams = () => {
        let { query } = this.state
        let params = []
        for(let key in query) {
            params.push(`${key}=${query[key]}`)
        }
        let url = `${window.location.href.split('?')[0]}?${params.join('&')}`
        window.history.replaceState(null, null, url)
    }

    // 获取渠道信息
    get_operation_list = (isParams) => {
        const { dispatch, location } = this.props;
        let { query } = this.state
        const arr = []
        dispatch({
            type: 'project/operation_list',
            payload: { pageSize: 1000, pageNum: 1 },
            callback: (res) => {
                if (res.state == 200) {
                    if(res.data.channelInfos && res.data.channelInfos.length > 0) {
                        res.data.channelInfos.forEach(item => {
                            arr.push({
                                name: `${item.channelName} ( ${item.channelId} )`,
                                key: item.channelId
                            })
                        })
                    }

                    this.setState({
                        channelList: arr
                    });

                    if (!isParams) { return }
                    // 如果参数有type 则是回退的页面，将参数回填
                    query.type = location.query.type
                    query.channelId = location.query.channelId
                    this.setState({
                        activeTabKey: location.query.type,
                        query
                    })
                    this.channelChange(query.channelId)
                }
            }
        });
    }

    channelChange = (e) => {
        let { query, channelList } = this.state
        query.channelId = e
        this.setUrlParams()
        let channel = null
        channelList.forEach(item => {
            if(item.key === e) {
                channel = item
            }
        })
        // 14497458

        this.setState({ currentChannelId: e, query, channel }, () => {
            // 触发更新事件
            if(!this.firstChange) {
                this.tabbarRef && this.tabbarRef.channelChange(channel)
                this.homeRef && this.homeRef.channelChange()
                this.topicRef && this.topicRef.channelChange()
                this.informationRef && this.informationRef.channelChange()
            }
        })

        this.firstChange = false
    }

    onHandleTabClick = (e) => {
        let { query } = this.state
        query.type = e
        this.setState({ activeTabKey: e, query })
        this.setUrlParams()
    }

    // 获取子组件对象
    getChild = (type, ref) => {
        switch (type) {
        case 'home':
            this.homeRef = ref
            break;

        case 'topic':
            this.topicRef = ref
            break;

        case 'home_setting':
            this.homeSettingRef = ref
            break;

        case 'nav':
            this.navRef = ref
            break;

        case 'footer':
            this.footerRef = ref
            break;
        
        default:
            break;
        }
    }

    // 空组件
    returnEmpty = () => (
        <div style={{'fontSize': '24px', 'textAlign': 'center','marginTop': '60px', 'color': '#ff0000'}}>请先选择渠道</div>
    )

    render() {
        const { channelList, currentChannelId, channel, activeTabKey, tabkey1 } = this.state;
        return (
            <AuthBtn eventKey={[tabkey1]} btnAuth={btnAuth} showPage>
          
                <div className={global.common_page}>
                    <div style={{"marginBottom": "10px"}} className={mdiy.topContent}>
                        <Select
                            placeholder="请选择渠道"
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            showSearch
                            filterOption={(input, option) =>{
                                if (option && option.props.children) {
                                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                } 
                                return true
                            }}
                            value={currentChannelId}
                            onChange={this.channelChange}
                            style={{"width": "300px"}}
                        >
                            { channelList.map(item => (
                                <Option key={item.key}>{item.name}</Option>)
                            )} 
                        </Select>
                        {
                            currentChannelId && (
                                <div style={{'display': 'flex'}}>
                                    <div className={mdiy.topTips}>渠道全称：{channel.name ? channel.name : ''}</div>
                                    <div className={mdiy.topTips}>渠道id：{channel.key ? channel.key : ''}</div>
                                </div>
                            )
                        }
                    </div>
                    <Tabs className={mdiy.antContent} type="card" activeKey={activeTabKey} animated={false} onTabClick={this.onHandleTabClick}>
                        {hasAuth(tabkey1) &&
                        <TabPane tab={`${sldComLanguage('首页装修')}`} key="home">
                            {
                                currentChannelId
                                    ? <Home id={currentChannelId} getChild={this.getChild} />
                                    : this.returnEmpty()
                            }
                        </TabPane>
                        }        
                        {hasAuth('view_topic_deco') &&
                        <TabPane tab={`${sldComLanguage('专题装修')}`} key="topic">
                            {
                                currentChannelId === ''
                                    ? <Topic id={currentChannelId} getChild={this.getChild} />
                                    : this.returnEmpty()
                            }
                        </TabPane>
                        }
                        {hasAuth('view_home_img') &&

                        <TabPane tab={`${sldComLanguage('开屏图设置')}`} key="home_setting">
                            {
                                currentChannelId === ''
                                    ? <HomeSetting id={currentChannelId} getChild={this.getChild} />
                                    : this.returnEmpty()
                            }
                        </TabPane>
                        }
                        {hasAuth('view_home_navi') &&
                        <TabPane tab={`${sldComLanguage('首页导航')}`} key="nav">
                            {
                                currentChannelId === ''
                                    ? <HomeNav id={currentChannelId} getChild={this.getChild} />
                                    : this.returnEmpty()
                            }
                        </TabPane>
                        }
                        {hasAuth('view_footer') &&
                        <TabPane tab={`${sldComLanguage('页脚管理')}`} key="footer">
                            {
                                currentChannelId === ''
                                    ? <Footer id={currentChannelId} getChild={this.getChild} />
                                    : this.returnEmpty()
                            }
                        </TabPane>
                        }
                    </Tabs>
                </div>

            </AuthBtn>
        );
    }
}
