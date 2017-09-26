<template>
  <div>
	  <div class="shopcart">
	  	<div class="content" @click="toggleList">
	  		<div class="content-left">
	  			<div class="logo-wrapper">
	  				<div class="logo" :class="{'heightlight':totalCount>0}">
	  					<i class="icon-shopping_cart" :class="{'heightlight':totalCount>0}"></i>
	  				</div>
	  				<div class="num" v-show="totalCount>0">{{totalCount}}</div>
	  			</div>
	  			<div class="price" :class="{'heightlight':totalPrice>0}">￥{{totalPrice}}</div>
	  			<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
	  		</div>
	  		<div class="content-right" @click.stop.prevent="pay">
	  			<div class="pay" :class="payClass">
	  				{{payDsec}}
	  			</div>
	  		</div>
	  	</div>
	  	<transition name="fold">
		  	<div class="shopcart-list" v-show="listShow">
	  			<div class="list-header">
	  				<h1 class="title">购物车</h1>
	  				<span class="empty" @click="empty">清空</span>
	  			</div>
	  			<div class="list-content" ref="listContent">
	  				<ul>
	  					<li class="food" v-for="food in selectFoods">
	  						<span class="name">{{food.name}}</span>
	  						<div class="price">
	  							<span>￥{{food.price*food.count}}</span>
	  						</div>
	  						<div class="cartcontronl-wrapper">
	  							<cartcontrol :food="food"></cartcontrol>
	  						</div>
	  					</li>
	  				</ul>
	  			</div>
		  	</div>
		</transition>
	  </div>
	  <div class="listMask" @click="hideList">
		  <transition name="fade">
		 	<div class="list-mask" v-show="listShow"></div>
		  </transition>
	  </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'
    import cartcontrol from '../cartcontrol/cartcontrol'

	export default {
		props: {
          selectFoods: {
              type: Array,
              default() {
                  return [{
                     price: 1,
                     count: 1
                  }]
               }
           },
           deliveryPrice: {
             type: Number,
             default: 0
           },
            minPrice: {
              type: Number,
              default: 0
            }
        },
        data() {
           return {
            fold: true
           }
        },
        computed: {
           totalPrice() {
              let total = 0
              this.selectFoods.forEach((food) => {
                  total += food.price * food.count
               })
               return total
            },
            totalCount() {
                let count = 0
                this.selectFoods.forEach((food) => {
                   count += food.count
                })
                return count
            },
            payDsec() {
                if (this.totalPrice === 0) {
                   return `￥${this.minPrice}元起送`
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice
                    return `还差${diff}元起送`
                } else {
                    return `去结算`
                }
            },
            payClass () {
                if (this.totalPrice < this.minPrice) {
                   return 'not-enough'
                } else {
                 return 'enough'
                }
         },
         listShow () {
            if (!this.totalCount > 0) {
               this.fold = true
               return false
            }
            let show = !this.fold
            if (show) {
                   this.$nextTick(() => {
                     if (!(this).scroll) {
                      this.scroll = new BScroll(this.$refs.listContent, {
                         click: true
                      })
                  } else {
                    this.scroll.refresh()
                   }
                 })
             }
            return show
         }
    },
    methods: {
    	// 点击购物车切换出现购买列表
    	toggleList () {
    		if (!this.totalCount) {
    			return
    		}
    		this.fold = !this.fold
    	},
        // 点击弹出的购买列表上方，隐藏购买列表
    	hideList() {
    		this.fold = true
    	},
    	// 清空购物车
       empty () {
         this.selectFoods.forEach((food) => {
            food.count = 0
         })
       },
        // 结算
        pay () {
          if (this.totalPrice < this.minPrice) {
            return
        }
           window.alert(`需支付${this.totalPrice}元，但暂时无法使用支付功能`)
        }
    },
    // 注册购物车组件
     components: {
        cartcontrol
      }
}
</script>

<style>
	/* 引入font样式表 */
	@import "../../common/css/style.css";
	.shopcart{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 50;
		width: 100%;
		height: 48px;
	}
	.shopcart .content{
		display: flex;
		background: #141d27;
		font-size: 0;
		color: rgba(255, 255, 255, 0.4);
	}
	.shopcart .content .content-left{
		flex: 1;

	}
	.shopcart .content .content-left .logo-wrapper{
		display: inline-block;
		vertical-align: top;
		position: relative;
		top: -10px;
		margin:0 12px;
		padding: 6px; 
		width: 56px;
		height: 56px;
		box-sizing: border-box;
		border-radius: 50%;
		background: #141d27;
	}
	.shopcart .content .content-left .logo-wrapper .logo{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		text-align: center;
		background: #2b343c;
	}
	.shopcart .content .content-left .logo-wrapper .heightlight{
		background: rgb(0, 160, 220);
	}
	.shopcart .content .content-left .logo-wrapper .logo .icon-shopping_cart{
		font-size: 24px;
		line-height: 44px;
		color: #80858a;
	}
	.shopcart .content .content-left .logo-wrapper .logo .heightlight{
		color: #fff;
	}
	.shopcart .content .content-left .logo-wrapper .num{
		position: absolute;
		top: 0;
		right: 0;
		width: 24px;
		height: 16px;
		line-height: 16px;
		text-align: center;
		border-radius: 16px;
		font-size: 9px;
		font-weight: 400;
		color: #fff;
		background: rgb(240, 20, 20);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
	}
	.shopcart .content .content-left .price{
		display: inline-block;
		vertical-align: top;
		margin-top: 12px;
		line-height: 24px;
		box-sizing: border-box;
		padding-right: 12px;
		border-right: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 16px;
		font-weight: 700;
	}
	.shopcart .content .content-left .heightlight{
		color: #fff;
	}
	.shopcart .content .content-left .desc{
		display: inline-block;
		vertical-align: top;
		line-height: 24px;
		margin: 12px 0 0 12px;
		font-size: 10px; 
	}
	.shopcart .content .content-right{
		flex: 0 0 105px;
		width: 105px;
	}
	.shopcart .content .content-right .pay{
		height: 48px;
		line-height: 48px;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		background: #2b333b;
	}
	.shopcart .content .content-right .not-enough{
		background: #2b333b;
	}
	.shopcart .content .content-right .enough{
		background: #00b43c;
		color: #fff;
	}

	.shopcart .shopcart-list{
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		width: 100%;
		transform: translate3d(0, -100%, 0);
	}
	.shopcart .fold-enter-active, .fold-leave-active{
	 	transition: all 0.5s;
	}
	.shopcart .fold-enter, .shopcart .fold-leave-to{
		transform: translate3d(0, 0, 0);
	}
	.shopcart .shopcart-list .list-header{
		height: 40px;
		line-height: 40px;
		padding: 0 18px;
		background: #f5f7f9;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	.shopcart .shopcart-list .list-header .title{
		float: left;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.shopcart .shopcart-list .list-header .empty{
		float: right;
		font-size: 12px;
		color: rgb(0, 160, 220);
	}
	.shopcart .shopcart-list .list-content{
		padding: 0 18px;
		max-height: 217px;
		background: #fff;
		overflow: hidden;
	}
	.shopcart .shopcart-list .list-content .food{
		position: relative;
		padding: 12px 0;
		box-sizing: border-box;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	.shopcart .shopcart-list .list-content .food .name{
		line-height: 24px;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.shopcart .shopcart-list .list-content .food .price{
		position: absolute;
		right: 90px;
		bottom: 12px;
		line-height: 24px;
		font-size: 14px;
		font-weight: 700;
		color: rgb(240, 20, 20);
	}
	.shopcart .shopcart-list .list-content .food .cartcontronl-wrapper{
		position: absolute;
		right: 0;
		bottom: 6px;
	}

	.list-mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 40;
		backdrop-filter: blur(10px);
		background: rgba(7, 17, 27, 0.6);
		opacity: 1;
	}
	.listMask .fade-enter-active, .listMask .fade-leave-active{
		transition: all 1s;
	}
	.listMask .fade-enter, .listMask .fade-leave-active{
		opacity: 0;
		background: rgba(7, 17, 27, 0);
	}
</style>
