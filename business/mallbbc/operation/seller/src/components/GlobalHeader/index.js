import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { sldComLanguage, getSldImgSet,loginOut,getStorage } from '@/utils/utils';
import { specialFlag,imUrl } from '@/utils/sldconfig';

//设置顶部logo
let main_admin_top_logo = require('../../assets/bizcloud.png');

let main_admin_top_logo_local = main_admin_top_logo;
let com_img_info = getSldImgSet('com_img_info');
if (com_img_info != '') {
    main_admin_top_logo = com_img_info.filter(item => item.name == 'main_seller_center_logo')[0].imageUrl || main_admin_top_logo;
}
export default class GlobalHeader extends PureComponent {
    state = {
        seleTitle: 'sysset'
    };

    componentDidMount() {

    }

    componentWillReceiveProps() {
        const { history } = this.props
        let sld_clear_xiegang = history.location.pathname.split('/');
        if (sld_clear_xiegang.length > 0) {
            let sldCurSeleTopArray = sld_clear_xiegang[1].split('_');
            if (sldCurSeleTopArray.length > 0) {
                this.setState({
                    seleTitle: sldCurSeleTopArray[0]
                });
            }
        }
    }

    componentWillUnmount() {
        this.triggerResizeEvent.cancel();
    }

    seleType = (val) => {
        let {path} = val;
        const { history } = this.props
        this.setState({
            seleTitle: val.top_nav
        });
        if(val.top_nav == 'im'){
            if(getStorage('token')){
                window.open(`${imUrl}?token=${getStorage('token')}&storeId=${getStorage('storeId')}&vendorId=${getStorage('vendorId')}&isStoreAdmin=${getStorage('isStoreAdmin')}`,"_blank");
            }else{
                loginOut();
            }
        }else{
            history.replace(path);
        }
    };

    /* eslint-disable*/
    @Debounce(600)
    triggerResizeEvent() {
        // eslint-disable-line
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, false);
        window.dispatchEvent(event);
    }

    toggle = () => {
        const { collapsed, onCollapse } = this.props;
        onCollapse(!collapsed);
        this.triggerResizeEvent();
    };

    //进入每个账号的第一个页面
    goHome = () => {
      let tar_path = JSON.parse(getStorage('cur_top_nav_info'))[0].path;
      router.replace(tar_path);
    }

    render() {
        const { collapsed, isMobile, logo } = this.props;
        const { seleTitle } = this.state;
        const cur_top_nav_info = getStorage('cur_top_nav_info') != null ? JSON.parse(getStorage('cur_top_nav_info')) : '';
        return (
            <div className={styles.header}>
                
                <div className={styles.header_logo} onClick={() => this.goHome()}>
                    <img src={main_admin_top_logo} onError={(e) => {e.target.onerror = null;e.target.src=main_admin_top_logo_local}}/>
                </div>
                <div className={styles.trigger} onClick={this.toggle}>
                    <Icon style={{ color: '#fff', fontSize: 16 }} type={collapsed ? 'menu-unfold' : 'menu-fold'} />
                </div>
                {/*{document.URL.indexOf('/apply/') == -1 &&*/}
                    <div className={styles.wraptype}>
                        {cur_top_nav_info && cur_top_nav_info.map((item, index) => {
                            return <span key={index}
                                style={seleTitle == item.top_nav ? { background: 'rgba(255,255,255,0.2)',cursor:'pointer' } : {cursor:'pointer'}}
                                onClick={() => this.seleType(item)}>
                              {specialFlag>-3&&(item.top_nav == 'spreader'||item.top_nav == 'statistics')&&
                                <img src={require('../../assets/must_add.png')} style={{width:32,marginTop:-3,marginRight:3}}/>
                              }
                              {sldComLanguage(item.name)}
                              
                            </span>;
                        })
                        }

                    </div>
                {/*}*/}
                <RightContent {...this.props} />
            </div>
        );
    }
}
