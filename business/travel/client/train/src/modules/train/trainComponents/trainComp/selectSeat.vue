<template>
	<div class="choose_seat" v-if="(seatLevel=='二等座'||seatLevel=='一等座'||seatLevel=='商务座')">
      <div class="seat_title">
        <span class="left">在线选座</span>
        <span class="num">已选择：<i>{{ChooseSeats.length}}</i>/{{customerList.length}}个</span>
      </div>
      <div class="seat_all">
        <div class="odd" v-for="n in seatLength" :key="n"> 
          <div class="left">
            <i class="f_i">靠窗</i>
            <span  v-if="tempLeft.name=='A'||tempLeft.name=='B'||tempLeft.name=='C'" v-for="(tempLeft,indexLeft) in chooseSeatType.content" :key="indexLeft">
              <img @click='chooseSeatFun(n,tempLeft)' :src="handleChooseSeat((n + tempLeft.name),ChooseSeats)?tempLeft.srcYes:tempLeft.srcNo">
            </span>
          </div>
          <div class="middle">走廊</div>
          <div class="right">
            <span v-if="tempRight.name=='D'||tempRight.name=='F'" v-for="(tempRight,indexRight) in chooseSeatType.content" :key="indexRight">
              <img @click='chooseSeatFun(n,tempRight)' :src="handleChooseSeat((n + tempRight.name),ChooseSeats)?tempRight.srcYes:tempRight.srcNo">
            </span>
            <i class="l_i">靠窗</i>
          </div> 
        </div>
      </div>
	  <!-- 该提示语只有在选择坐席之后才显示 -->
      <div v-if='ChooseSeats.length>0' class="seat_title_tips">
        <span>优先按指定座席出票，若指定座席无票，则转购其他座席</span>
      </div>
    </div>
</template>

<script>

    export default {
        components: {

        },
		props: {
			seatLevel:{
				type:String,
				default:''
			},
			customerList:{
				type:Array,
				default:()=>[{}]
			}
		},
        data() {
            return {
				ChooseSeats:[], //选座最后传递的进去的字符串
				allSeatTypes:{}, //选座的原始数组
				chooseSeatType:[], //渲染的坐席数据
				seatLength:1 //根据乘客的数量来确定座位显示几排
            }
		},
        created() {
			//更新allSeatTypes
			this.allSeatTypes = {
				'edz':{
					content:[
						{
							name:'A',
							srcNo:require('./img/seat_A.svg'),
							srcYes:require('./img/seat_A_checked.svg'),
						},
						{
							name:'B',
							srcNo:require('./img/seat_B.svg'),
							srcYes:require('./img/seat_B_checked.svg'),
						},
						{
							name:'C',
							srcNo:require('./img/seat_C.svg'),
							srcYes:require('./img/seat_C_checked.svg'),
						},
						{
							name:'D',
							srcNo:require('./img/seat_D.svg'),
							srcYes:require('./img/seat_D_checked.svg'),
						},
						{
							name:'F',
							srcNo:require('./img/seat_F.svg'),
							srcYes:require('./img/seat_F_checked.svg'),
						}
					]
				},
				'ydz':{
					content:[
						{
							name:'A',
							srcNo:require('./img/seat_A.svg'),
							srcYes:require('./img/seat_A_checked.svg'),
						},
						{
							name:'C',
							srcNo:require('./img/seat_C.svg'),
							srcYes:require('./img/seat_C_checked.svg'),
						},
						{
							name:'D',
							srcNo:require('./img/seat_D.svg'),
							srcYes:require('./img/seat_D_checked.svg'),
						},
						{
							name:'F',
							srcNo:require('./img/seat_F.svg'),
							srcYes:require('./img/seat_F_checked.svg'),
						}
					]
				},
				'swz':{
					content:[
						{
							name:'A',
							srcNo:require('./img/seat_A.svg'),
							srcYes:require('./img/seat_A_checked.svg'),
						},
						{
							name:'C',
							srcNo:require('./img/seat_C.svg'),
							srcYes:require('./img/seat_C_checked.svg'),
						},
						{
							name:'F',
							srcNo:require('./img/seat_F.svg'),
							srcYes:require('./img/seat_F_checked.svg'),
						}
					]
				}
			};

			//更新chooseSeatType
			this.initSeatData(this.seatLevel);
        },
        mounted() {

        },
        methods: {
			// 初始化数据
           	initSeatData(val){
			   if(val=='二等座'){
				   this.chooseSeatType = this.allSeatTypes['edz']
			   }else if(val=='一等座'){
				   this.chooseSeatType = this.allSeatTypes['ydz']
			   }else if(val=='商务座'){
				   this.chooseSeatType = this.allSeatTypes['swz']
			   }
		   	},
		    //以下两个方法都是用来处理坐席的 确认是否存在ChooseSeats数组中 判断图片坐席的选中与否状态
			handleChooseSeat(item,ChooseSeats){
				//item 1A ChooseSeats=['1A','2B']
				return ChooseSeats.indexOf(item)!=-1;//存在即显示true
			},
			//选择坐席
			chooseSeatFun(item,temp){//ChooseSeats
				let that = this;
				let length = that.customerList.length;//乘客的数量
				let name = temp.name;
				let seatCode = item + name;
				// console.log('seatCode',seatCode);
				if(that.ChooseSeats.indexOf(seatCode) != -1){//说明已经选中了
					let index = that.ChooseSeats.indexOf(seatCode);
					that.ChooseSeats.splice(index,1);
				}else{
					if(that.ChooseSeats.length>=length){
						// 清除第一个 后面push新选择的
						that.ChooseSeats.shift();
						that.ChooseSeats.push(seatCode);
					}else{
						that.ChooseSeats.push(seatCode);
					}
				} 
				
				that.$emit('chooseFun',JSON.stringify(that.ChooseSeats));
			},
		},
		watch:{
			//乘客变更同时更新seatLength
			customerList(val){
				let that = this;
				that.$nextTick(()=>{
					if(val.length >= 2){
						that.seatLength = 2;
					}else{
						that.seatLength = 1;
					}
					that.ChooseSeats=[];//每次更换乘客都要清空选择坐席
				})
			}
		},
    }
</script>
<style scoped lang="less">
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
// 在线选座样式开始
.choose_seat{
  background: @sub-background-color;
  margin-bottom: 0.2rem;
  .seat_title{
    padding: 0.4rem 0.3rem;
    display: flex;
	justify-content: space-between;
	align-items: center;
	.left{
		color: @text-color;
		font-size: .36rem;
		font-weight: 500;
		font-weight: 600;
	}
	.num{
		font-size: .22rem;
		color: @third-text-color;
	}
    i{
      font-style: normal;
      color: @warning-color;
    }
  }
  .seat_title_tips{
    height: 0.6rem;
    line-height: 0.6rem;
    padding: 0rem 0.3rem;
    font-size: 0.24rem;
	background: @info-background;
	text-align: center;
    color: #999999;
  }
  .seat_all{
    i{
      font-style: normal;
    }
    img{
      width: 0.48rem;
      height:  0.48rem;
      margin-top: 0.04rem;
      cursor: pointer;
    }
    padding: 0rem 0.3rem;
    .odd{
      padding-bottom: .4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left,.right{
        display: flex;
        justify-content: space-around;
		align-items: center;
		i{
			font-size: .22rem;
			color: #999999;
			display: inline-block;
			width: .24rem;
		}
	  }
	  .right{
		  flex: 4
	  }
      
	  .left{
		  flex: 5
	  }
      
      
      .middle{
		text-align: center;
		font-size: .22rem;
		color: #999999;
		display: inline-block;
		width: .24rem;
		margin: 0 0.2rem;
      }
    }
    
  }
}

</style>

