import React from 'react'
import global from '@/global.less';
import styles from '../common/css/index.less';


export default function GoodsShowStyle(props) {
    const { showStyle,data,saveCurSelData } = props;

    // 商品列表box的className
    function getGoodListBoxClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_good_list_wrapper;
            break;
        case 'row_list':
            className = styles.row_list_good_list_wrapper;
            break;
        case 'big_picture':
            className = styles.big_picture_good_list_wrapper;
            break;
        case 'discount_row_list':
            className = styles.discount_row_list_good_list_wrapper;
            break;
        case 'discount_half_rank':
            className = styles.discount_half_rank_good_list_wrapper;
            break;
        case 'small':
            className = styles.small_good_list_wrapper;
            break; 
        case 'bijia':
            className = styles.bijia_good_list_wrapper;
            break;
        case 'zhexianbijia':
            className = styles.zhexianbijia_good_list_wrapper;
            break;
        case 'datubijia':
            className = styles.datubijia_good_list_wrapper;
            break;                    
        default:
            break;
        }
    
        return className;
    
    }

    // 商品外部box的className
    function getGoodWrapperClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_wrapper;
            break;
        case 'row_list':
            className = styles.row_list_wrapper;
            break;
        case 'big_picture':
            className = styles.big_picture_wrapper;
            break;
        case 'discount_row_list':
            className = styles.discount_row_list_wrapper;
            break;
        case 'discount_half_rank':
            className = styles.discount_half_rank_wrapper;
            break;
        case 'small':
            className = styles.small_wrapper;
            break;
        case 'bijia':
            className = styles.bijia_wrapper;
            break;
        case 'zhexianbijia':
            className = styles.zhexianbijia_wrapper;
            break;
        case 'datubijia':
            className = styles.datubijia_wrapper;
            break;  
        default:
            break;
        }

        return className;

    }

    // 商品图片box的className
    function getGoodImageClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_good_img;
            break;
        case 'row_list':
            className = styles.row_list_good_img;
            break;
        case 'big_picture':
            className = styles.big_picture_good_img;
            break;
        case 'discount_row_list':
            className = styles.discount_row_list_good_img;
            break;
        case 'discount_half_rank':
            className = styles.discount_half_rank_good_img;
            break;
        case 'small':
            className = styles.small_good_img;
            break;
        case 'bijia':
            className = styles.bijia_good_img;
            break;
        case 'zhexianbijia':
            className = styles.zhexianbijia_good_img;
            break;
        case 'datubijia':
            className = styles.datubijia_good_img;
            break;  
        default:
            break;
        }
    
        return className;
    
    }

    // 商品名称box的className
    function getGoodNameClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_good_name;
            break;
        case 'row_list':
            className = styles.row_list_good_name;
            break;
        case 'big_picture':
            className = styles.big_picture_good_name;
            break;
        case 'discount_row_list':
            className = styles.discount_row_list_good_name;
            break;
        case 'discount_half_rank':
            className = styles.discount_half_rank_good_name;
            break;
        case 'small':
            className = styles.small_good_name;
            break;  
        case 'bijia':
            className = styles.bijia_good_name;
            break;
        case 'zhexianbijia':
            className = styles.zhexianbijia_good_name;
            break;
        case 'datubijia':
            className = styles.datubijia_good_name;
            break;
        default:
            break;
        }
        
        return className;
        
    }

    // 商品价格box的className
    function getGoodPriceClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_price;
            break;
        case 'row_list':
            className = styles.row_list_price;
            break;      
        case 'big_picture':
            className = styles.big_picture_price;
            break;
        case 'discount_row_list':
            className = styles.discount_row_list_price;
            break;
        case 'discount_half_rank':
            className = styles.discount_half_rank_price;
            break;
        case 'small':
            className = styles.small_price;
            break;
        case 'bijia':
            className = styles.bijia_price;
            break;
        case 'zhexianbijia':
            className = styles.zhexianbijia_price;
            break;
        case 'datubijia':
            className = styles.datubijia_price;
            break;
        default:
            break;
        }
                
        return className;
                
    }
    
    // 商品原价box的className
    function getOriginPriceClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_origin_price;
            break;
        case 'row_list':
            className = styles.row_list_origin_price;
            break;
        default:
            break;
        }
            
        return className;
    }

    // 商品现价box的className
    function getCurrentPriceClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_current_price;
            break;
        case 'row_list':
            className = styles.row_list_current_price;
            break;
        case 'big_picture':
            className = styles.big_picture_current_price;
            break; 
        case 'discount_row_list':
            className = styles.discount_row_list_current_price;
            break;
        case 'discount_half_rank':
            className = styles.discount_half_rank_current_price;
            break;
        case 'small':
            className = styles.small_current_price;
            break;  
        case 'bijia':
            className = styles.bijia_current_price;
            break;
        case 'zhexianbijia':
            className = styles.zhexianbijia_current_price;
            break;
        case 'datubijia':
            className = styles.datubijia_current_price;
            break;                
        default:
            break;
        }
                
        return className;
    }

    // 商品在买人数box的className
    function getCustomerNumberClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_customer_number;
            break;
        case 'row_list':
            className = styles.row_list_customer_number;
            break;
        case 'discount_row_list':
            className = styles.discount_row_list_customer_number;
            break; 
        default:
            break;
        }
            
        return className;
    }

    // 商品热销标签box的className
    function getGoodIconClassName(){
        let className;
        switch (showStyle) {
        case 'half_rank':
            className = styles.half_rank_good_icon;
            break;
           
        default:
            break;
        }
            
        return className;
            
    }
    let secondCategorySelectedIndex = data.data[data.nav_current].secondCategorySelectedIndex;
    let goodList = data.data[data.nav_current].sources=='upload'?data.data[data.nav_current].data[secondCategorySelectedIndex].info:[]
    if(goodList.length === 0){
        goodList = [
            {
                skuName:'商品名称1',
                mainImage:require('@/assets/img/decorate/empty_goods_img.png'),
                originalSalePrice:1280.00,
                salePrice:1290.00
            },
            {
                skuName:'商品名称2',
                mainImage:require('@/assets/img/decorate/empty_goods_img.png'),
                originalSalePrice:2.00,
                salePrice:1.00
            },{
                skuName:'商品名称3',
                mainImage:require('@/assets/img/decorate/empty_goods_img.png'),
                originalSalePrice:110.00,
                salePrice:100.00
            },
            {
                skuName:'商品名称4',
                mainImage:require('@/assets/img/decorate/empty_goods_img.png'),
                originalSalePrice:123.00,
                salePrice:22.00
            },{
                skuName:'商品名称5',
                mainImage:require('@/assets/img/decorate/empty_goods_img.png'),
                originalSalePrice:110.00,
                salePrice:100.00
            },
            {
                skuName:'商品名称6',
                mainImage:require('@/assets/img/decorate/empty_goods_img.png'),
                originalSalePrice:123.00,
                salePrice:22.00
            }
        ];
    }
    
    
    return (
        <div
            className='scroll_dom'
            style={{height:'563px',overflowY:'scroll'}} 
            onScroll={
                (e)=>{
                    const clientHeight = e.target.clientHeight;
                    const scrollTop = e.target.scrollTop;
                    const scrollHeight = e.target.scrollHeight;
                    // console.log('在滚动',clientHeight,scrollTop,scrollHeight);
        
                    if(clientHeight+scrollTop >= scrollHeight){
                        const navLength = data.data.length;
                        // console.log('滚动到底了',data.nav_current,navLength-1);
        
        
                        if(data.nav_current < navLength - 1){
                            // console.log('+1');
                            saveCurSelData(data.nav_current + 1,'nav_current',0,'single')
                        }

                    }
                    if(scrollTop === 0 && data.nav_current !== 0){
                        // console.log('-1');
                        saveCurSelData(data.nav_current - 1,'nav_current',0,'single')
                    }
                }
            }
        >
            <div className={getGoodListBoxClassName()}>
                {
                        
                    goodList.map(item=><div className={
                        getGoodWrapperClassName()
                    }
                    >
                        <div className={getGoodImageClassName()} style={{backgroundImage:!!item.uploadmage ? `url(${item.uploadmage})` : `url(${item.mainImage})`}}></div>
                        <p className={getGoodNameClassName()}>
                            {item.skuName}
                        </p>

                        {/* {
                                showStyle === 'big_picture' && 
                                <div className={styles.big_picture_coupon_list}>
                                
                                </div>
                            } */}

                        <div className={getGoodPriceClassName()}>
                            {
                                (showStyle === 'half_rank' || showStyle === 'row_list') && <span className={getOriginPriceClassName()}>¥{item.showPrice}</span>
                            }
                            <span className={getCurrentPriceClassName()}>
                                    ¥<span style={{fontSize:showStyle === 'big_picture' ? '20px' :showStyle === 'datubijia' ? '36px' : '14px'}}>{item.salePrice||item.showPrice}</span>
                            </span>

                            {
                                (showStyle === 'half_rank' || showStyle === 'row_list') && 
                                <span className={ 
                                    showStyle === 'row_list' ?
                                        styles.row_list_good_icon_text:
                                        styles.half_rank_good_icon_text}
                                >
                                    { data.data[data.nav_current].goodsLabelText }
                                </span>
                            }
        

                            {
                                showStyle === 'big_picture' && 
                                    <span className={styles.big_picture_button}>购买</span>
                            }

                            {
                                showStyle === 'discount_row_list' && 
                                    <span className={styles.discount_row_list_check_button}>查看</span>
                            }

                            {
                                showStyle === 'discount_half_rank' && 
                                    <span className={styles.discount_half_rank_purchase_button}>购买</span>
                            }

                            {
                                showStyle === 'half_rank' && 
                                    <span className={getCustomerNumberClassName()}>
                                        18人在买
                                    </span>
                            }

                            {
                                showStyle === 'row_list' && 
                                    <span className={styles.limited_number}>
                                        限量100件
                                    </span>
                            }

                        </div>

                        {
                            showStyle === 'discount_row_list' && 
                                    <span className={styles.discount_row_list_last_purchase_time}>
                                        最近购买 3小时前
                                    </span>
                        }

                        {
                            showStyle === 'discount_row_list' && 
                                    <span className={styles.discount_row_list_purchase_number}>
                                        3位朋友买过
                                    </span>
                        }

                        {/* {
                            showStyle === 'half_rank' && 
                                <div className={getGoodIconClassName()}></div>
                        } */}

                        {
                            showStyle === 'bijia' && 
                            <div className={`${styles.hotSale_price} ${global.flex_com_column}`}>
                                <div
                                    className={`${global.flex_com_space_between}`}
                                    style={{ width: 155, border: '1px black solid' }}
                                >
                                    <div className={`${global.flex_com_row_start_start}`}>
                                        <div className={`${styles.bijiaGoodsImg}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/offcanvas/jingdong.png')})`, width: '20px', height: '20px' }} />
                                        <div>{item.storeName}</div>
                                    </div>
                                    <div>{item.showPrice || item.salePrice ? '最低' : "￥0>"}</div>
                                </div>
                                <div
                                    className={`${styles.item} ${global.flex_com_space_between}`}
                                    style={{ width: 155, border: '1px black solid' }}
                                >
                                    <div className={`${styles.item} ${global.flex_com_row_start_start}`}>
                                        <div className={`${styles.bijiaGoodsImg}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/offcanvas/jingdong.png')})`, width: '20px', height: '20px' }} />
                                        <div>已售100</div>
                                    </div>
                                    <div>￥{item.showPrice || item.salePrice ? (item.showPrice || item.salePrice) + 10 : 0}</div>
                                </div>
                                <div
                                    className={`${styles.item} ${global.flex_com_space_between}`}
                                    style={{ width: 155, border: '1px black solid' }}
                                >
                                    <div className={`${styles.item} ${global.flex_com_row_start_start}`}>
                                        <div className={`${styles.bijiaGoodsImg}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/offcanvas/taobao.png')})`, width: '20px', height: '20px' }} />
                                        <div>已售100</div>
                                    </div>
                                    <div>￥{item.showPrice || item.salePrice ? (item.showPrice || item.salePrice) + 15 : 0}</div>
                                </div>
                            </div>
                        }

                        {
                            showStyle === 'zhexianbijia' && 
                            <div className={`${styles.hotSale_price} ${global.flex_com_column}`}>
                                <div
                                    className={`${global.flex_com_space_between}`}
                                    style={{ width: 155, border: '1px black solid' }}
                                >
                                    <div className={`${global.flex_com_row_start_start}`}>
                                        <div className={`${styles.supply_icon}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/offcanvas/jingdong.png')})`, width: '20px', height: '20px' }} />
                                        <div>{item.storeName}</div>
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            (showStyle === 'zhexianbijia' || showStyle === 'datubijia') && 
                            <div className={`${styles.bijiaGoodsImg}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/offcanvas/bijia.png')})`, width: '100%', height: '113px' }} />
                        }

                    </div>)
                }
            </div> 
        </div>
    )
}
