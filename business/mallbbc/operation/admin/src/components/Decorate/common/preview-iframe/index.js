/* eslint-disable react/react-in-jsx-scope */
import { Component } from 'react';
import { sldTsvg} from '@/utils/utils';

// eslint-disable-next-line no-unused-vars


//装修组件预览iframe
export default class PreviewIframe extends Component {
    constructor(props){
        super(props)
        this.state={
            iframeUrl:'', //与此iframe通信的地址
            dragStartFlag:false, //鼠标是否按下了
            startX:0, //鼠标按下时的位置x
            startY:0, //鼠标按下时的位置y
            left:1300, //预览弹框的left
            top:156, //预览弹框的top
            listX:[1300], //记录x轴每次移动的位移集合
            listY:[156], //记录y轴每次移动的位移集合
            dragMoveFlag:false //鼠标是否移动
        }
    }

    componentWillMount() {
        this.getIframeUrl()
    }

    componentDidMount(){
        const {decoParams,decoType} = this.props
        document.getElementsByClassName('myFrame')[0].onload = () => {
            setTimeout(() => {
                this.postIframeData(decoParams,decoType)
            }, 1000)
        }
        
    }

    componentWillReceiveProps (nextProps){
        const {decoParams,decoType} = nextProps
        this.postIframeData(decoParams,decoType)
    }
    
    getIframeUrl = () => {
        let url = window.location.href
        const reg = new RegExp('https://(.+?).sinosun.com')
        const http = {
            'bplusdev': 'https://bplusdev.sinosun.com:18180/',
            'bplussit': 'https://bplussit.sinosun.com:18380/',
            'bplus-uat': 'https://bplus-uat.sinosun.com/',
            'cloud': 'https://cloud.sinosun.com/'
        }
        let newHref = ''
        url.replace(reg, (_, l1) => {
            let index = url.indexOf('mallbbcg2bank')
            newHref = `${http[l1]}${index === -1 ? 'mallbbcg2' : 'mallbbcg2bank'}/static/mobile/index.html#/pages/preview`
        })
        this.setState({iframeUrl:`${newHref}`})
    }

    postIframeData = (data,type) => {
        const {iframeUrl} = this.state
        document.getElementsByClassName('myFrame')[0].contentWindow.postMessage({ decoParams: data,decoType:type }, iframeUrl);
    }

    delIframe = () => {
        this.props.changeIframe(false)
    }

    handleMouseDown = (event) => {
        event.persist();
        event.preventDefault()
        this.setState({
            dragStartFlag:true,
            startX:event.clientX,
            startY:event.clientY
            
        })
    }

    handleMouseMove = (event) => {
        const {dragStartFlag, startX, startY,listX,listY} = this.state
        event.persist();
        if (dragStartFlag) {
            this.setState({
                left:(event.clientX - startX + listX.reduce((sum,currentValue)=>sum += currentValue,0)),
                top:(event.clientY - startY + listY.reduce((sum,currentValue)=>sum += currentValue,0)),
                dragMoveFlag:true
            })
        }
    }

    handleMouseUp = (event) => {
        const {startX,startY,listX,listY,dragMoveFlag} = this.state
        if (dragMoveFlag) {
            listX.push(event.clientX - startX)
            listY.push(event.clientY - startY)
        }
        
        this.setState({
            dragStartFlag:false,
            dragMoveFlag:false,
            listX:listX,
            listY:listY,
            left:listX.reduce((sum,currentValue)=>sum += currentValue,0),
            top:listY.reduce((sum,currentValue)=>sum += currentValue,0)
        })
    }

    render() {
        const {iframeUrl, top, left} = this.state
        document.addEventListener("mouseup", this.handleMouseUp)
        return <div style={{padding:'10px',border:'1px solid rgb(247, 233, 222)',background:'rgb(220, 220, 220)',position:'fixed',zIndex:10,height:'695px',top:top,left:left}}>
            <div
                style={{width:'375px',height:'50px',lineHeight:'50px',textAlign:'center',cursor:'move',fontSize:'16px',background:'rgb(247, 233, 222)'}}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
            >可拖动区域</div>
            <div
                style={{position:'absolute',right:'-8px',top:'-8px',zIndex:10}}
                onClick={() => this.delIframe()}
            >
                {sldTsvg('qingchu', '#666', 16, 16)}
            </div>
            <iframe title="iframe" className='myFrame' allowFullScreen scrolling="yes" src={iframeUrl} style={{ width: 375, border: 0, height: 621 }} />
        </div>
    }

}