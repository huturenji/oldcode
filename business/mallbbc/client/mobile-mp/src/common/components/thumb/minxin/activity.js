// 该混入文件用于存放thumb系列组件显示满减内容、秒杀计时功能的公共逻辑
import saleState from '@/common/lib/enum/saleState.js';
export default {
    props: {
        // 是否显示imgThumb的tips遮罩
        showThumbTips: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            timer: '',// 定时器对象
            ifStarted: false,// 秒杀是否开始
            remainingTime: '00:00:00' // 剩余时间
        }
    },
    methods: {
        //判断商品是否可售
        judgeNoSale(goodsItem){
            let flag = false;
            if (!goodsItem.state) {
                flag = true;
            } else if (!saleState[goodsItem.state].onSale || !goodsItem.salePrice || !goodsItem.hasStock || !goodsItem.canPurchase){
                flag = true;
            }
            return flag;
        },
        // 判断活动商品是否可售
        promotionNoSale(goodsItem) {
            let flag = false;
            // 活动已结束不显示 "暂不可售"
            if (goodsItem.state === 3) {
                flag = false;
            } else if (!goodsItem.salePrice || !goodsItem.hasStock || !goodsItem.canPurchase){
                flag = true;
            }
            return flag;
        },
        /*
         * 该商品是否参与秒杀活动
         * activityList：活动list
         */
        ifAttendSckillAcitivity(activityList) {
            let result = false;
            if (activityList) {
                result = activityList.some(item => item.promotionType === 104)
            }
            return result;
        },
        /*
         * 获得满优惠内容
         * promotionType：优惠类型
         * descriptionList：优惠描述
         */
        getDiscountContent(promotionType, descriptionList) {
            if (descriptionList && descriptionList.length){
                const content = descriptionList[0].promotionDescription;
                const firstLeftBrackets = content.indexOf('<');
                const lastLeftBrackets = content.lastIndexOf('<');
                const firstRightBrackets = content.indexOf('>');
                const lastRightBrackets = content.lastIndexOf('>');
                const fullPrice = content.substring(firstLeftBrackets + 1, firstRightBrackets);
                const discount = content.substring(lastLeftBrackets + 1, lastRightBrackets);
                if (promotionType === 201) {
                    return `满${fullPrice}减${discount}`
                }
                if (promotionType === 202) {
                    return `每满${fullPrice}减${discount}`
                }
                if (promotionType === 203) {
                    return `满${fullPrice}元${parseFloat(discount).toFixed(1)}折`
                }
                if (promotionType === 204) {
                    return `满${fullPrice}件${parseFloat(discount).toFixed(1)}折`
                }
            }
            return ``
        },
        acitivityType(activityList) {
            let promotionType = null;
            if (activityList && activityList.length) {
                activityList.forEach(item => {
                    if ([104, 106, 107].includes(item.promotionType)) {
                        promotionType = item.promotionType
                    }
                })
            }
            return promotionType;
        },
        /*
         * 格式化满优惠数据
         * promotionType：优惠类型
         * descriptionList：优惠描述集合
         */
        formateFullPreferentialList(promotionType, descriptionList) {
            // 先格式化数据
            let fullPreferentialList = descriptionList.map(item => {
                const content = item.promotionDescription;
            
                const firstLeftBrackets = content.indexOf('<');
                const lastLeftBrackets = content.lastIndexOf('<');
                const firstRightBrackets = content.indexOf('>');
                const lastRightBrackets = content.lastIndexOf('>');
                const fullPrice = content.substring(firstLeftBrackets + 1, firstRightBrackets);
                const discount = content.substring(lastLeftBrackets + 1, lastRightBrackets);
                let preferentialContent = '';
                if (promotionType === 201) {
                    preferentialContent = `满${fullPrice}减${discount}`
                }
                if (promotionType === 202) {
                    preferentialContent = `每满${fullPrice}减${discount}`
                }
                if (promotionType === 203) {
                    preferentialContent = `满${fullPrice}元${parseFloat(discount).toFixed(1)}折`
                }
                if (promotionType === 204) {
                    preferentialContent = `满${fullPrice}件${parseFloat(discount).toFixed(1)}折`
                }
                return { type: 'full_preferential',fullPrice, discount, preferentialContent }
            })
            
            // 冒泡倒序排列优惠
            for (let i = 0; i < fullPreferentialList.length; i++) {
                for (let j = i + 1; j < fullPreferentialList.length; j++) {
                    let item;
                    const first = fullPreferentialList[i].discount;
                    const second = fullPreferentialList[j].discount;
                    if (first < second) {
                        item = fullPreferentialList[i];
                        descriptionList[i] = fullPreferentialList[j];
                        fullPreferentialList[j] = item;
                    }
                }  
            }
            return fullPreferentialList;

        },
        // /*
        //  * 获得额度最大且指定数量的满优惠内容
        //  * promotionType：优惠类型
        //  * descriptionList：优惠描述
        //  */
        // getPreferentialByQuota(promotionType, descriptionList) {
        //     for (let i = 0; i < descriptionList.length; i++) {
        //         for (let j = i + 1; j < descriptionList.length; j++) {
        //             let item;
        //             const first = getQuota(descriptionList[i]);
        //             const second = getQuota(descriptionList[j]);
        //             if (first < second) {
        //                 item = first;
        //                 descriptionList[i]
        //             }
        //         }
                
        //     }
        //     function getQuota(preferentialItem){
        //         const content = preferentialItem.promotionDescription;
        //         const lastLeftBrackets = content.lastIndexOf('<');
        //         const lastRightBrackets = content.lastIndexOf('>');
        //         return content.substring(lastLeftBrackets + 1, lastRightBrackets);
        //     }
        //     const content = descriptionList[0].promotionDescription;
        //     const firstLeftBrackets = content.indexOf('<');
        //     const lastLeftBrackets = content.lastIndexOf('<');
        //     const firstRightBrackets = content.indexOf('>');
        //     const lastRightBrackets = content.lastIndexOf('>');
        //     const fullPrice = content.substring(firstLeftBrackets + 1, firstRightBrackets);
            
        //     if (promotionType === 201) {
        //         return `满${fullPrice}减${discount}`
        //     }
        //     if (promotionType === 202) {
        //         return `每满${fullPrice}减${discount}`
        //     }
        //     if (promotionType === 203) {
        //         return `满${fullPrice}元${parseFloat(discount).toFixed(1)}折`
        //     }
        //     if (promotionType === 204) {
        //         return `满${fullPrice}件${parseFloat(discount).toFixed(1)}折`
        //     }
        // },
        /*
         * 场次开始倒计时处理
         * totalSeconds：倒计时总秒数
         */
        getSeckillTimeNotice(totalSeconds) {

            let hours = parseInt(totalSeconds / 60 / 60);
            let minutes = parseInt(totalSeconds / 60 % 60);
            let seconds = parseInt(totalSeconds % 60);

            this.remainingTime = `${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
        },/*
        * 计算秒杀剩余时间
        * activityStartTime 活动开始时间
        * activityEndTime 活动结束时间
        */
        calcRemainingSeconds(activityStartTime, activityEndTime) {
            let seckillSeconds;
            // eslint-disable-next-line prefer-regex-literals
            const timeReg = new RegExp("-", "gm");
            let startTime = activityStartTime.replace(timeReg, "/");
            let endTime = activityEndTime.replace(timeReg, "/");
            const nowTimeSeconds = new Date().getTime();
            const startTimeSeconds = new Date(startTime).getTime();
            const endTimeSeconds = new Date(endTime).getTime();

            if (nowTimeSeconds > startTimeSeconds) {
                this.ifStarted = true;
                seckillSeconds = endTimeSeconds - nowTimeSeconds;
            } else {
                seckillSeconds = startTimeSeconds - nowTimeSeconds;
            }
            // console.log('seckillSeconds1',seckillSeconds);
            
            seckillSeconds = parseInt(seckillSeconds / 1000);
            return seckillSeconds;
        }
    }
}