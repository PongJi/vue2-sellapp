<template>
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li v-for="(item,index) in goods" class="menu-item" ref="menuList" :class="{'current':currentIndex===index}">
						<span class="text">
							<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
							{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
				<ul>
					<li v-for="item in goods" class="food-list" ref="foodList">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li class="food-item" v-for="food in item.foods"  @click="selectFood(food,$event)">
								<div class="icon">
									<img width="57" height="57" :src="food.icon">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<cartcontrol :food="food"></cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		</div>
		<food :food="selectedFood" ref="food"></food>
	</div>	
</template>

<script type="text/ecmascript-6">
    // 引入滚动插件
	import BScroll from 'better-scroll'
	import shopcart from '../shopcart/shopcart'
	import cartcontrol from '../cartcontrol/cartcontrol'
	import food from '../food/food'
    const ERR_OK = 0

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
           return {
             goods: [],
             listHeight: [],
             scrollY: 0,
             selectedFood: {}
           }
		},
		computed: {
          currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
               let height1 = this.listHeight[i]
               let height2 = this.listHeight[i + 1]
               if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                 return i
               }
            }
            return 0
           },
           // 选择foods,购物车数量改变
           selectFoods () {
             let foods = []
                 this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                       if (food.count) {
                          foods.push(food)
                       }
                    })
                })
              return foods
             }
		},
		created () {
			this.classMap = ['decrease', 'discount', 'special', 'invocicel', 'gurantee']
              this.$http.get('/api/goods').then((response) => {
              response = response.body // 获取数据对象
              if (response.errno === ERR_OK) {
                this.goods = response.data
                this.$nextTick(() => {
                // 初始化better-scroll
                   this._initScroll()
                 // 初始化计算滚屏的高度
                   this._calculateHeight()
                })
              }
             })
         },
         methods: {
           selectFood(food, event) {
             if (!event._constructed) {
               return
             }
             this.selectedFood = food
             this.$refs.food.show()
           },
           // 定义better-scroll
           _initScroll() {
              this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                 click: true
              })
              this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                 click: true,
                 // 实时监测滚动位置属性
                 probeType: 3
              })
              // 监测滚动的高度
              this.foodsScroll.on('scroll', (pos) => {
                if (pos.y <= 0) {
                  this.scrollY = Math.abs(Math.round(pos.y))
                }
              })
           },
           // 定义滑动的高度
           _calculateHeight() {
              // 获取ref=foodList
              let foodList = this.$refs.foodList
              let height = 0
              // 第一个高度push进去
              this.listHeight.push(height)
              // 遍历foodList的高度
              for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i]
                height += item.clientHeight
                this.listHeight.push(height)
              }
           }
         },
          // 注册购物车组件
          components: {
            shopcart,
            cartcontrol,
            food
           }
	}
</script>

<style type="text/css">
	.goods{
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		width: 100%;
		overflow: hidden;
	}
	.goods .menu-wrapper{
		flex: 0 0 80px;
		width: 80px;
		background: #f3f5f7;
	}
	.goods .menu-wrapper .current{
		position: relative;
		z-index: 10;
		margin-top: -1px;
		background: #fff;
		font-weight: 700;
	}
	.goods .menu-wrapper .current .text{
		border: 0;
	}
	.goods .menu-wrapper .menu-item{
		display: table;
		height: 54px;
		width: 56px;
		line-height: 14px;
		padding: 0 12px;
	}
	.goods .menu-wrapper .menu-item .text{
		display: table-cell;
		width: 56px;
		vertical-align: middle;
		font-size: 12px;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	.goods .menu-wrapper .menu-item .icon{
		vertical-align: top;
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-right: 2px;
	}
	/* 给不同的活动添加不同的icon */
	.goods .menu-wrapper .menu-item .decrease{
		background: url('decrease_3@3x.png') no-repeat center;
		background-size: 12px 12px;	
	}
	.goods .menu-wrapper .menu-item .discount{
		background: url('discount_3@3x.png') no-repeat center;
		background-size: 12px 12px;
	}
	.goods .menu-wrapper .menu-item .gurantee{
		background: url('guarantee_3@3x.png') no-repeat center;
		background-size: 12px 12px;
	}
	.goods .menu-wrapper .menu-item .special{
		background: url('special_3@3x.png') no-repeat center;
		background-size: 12px 12px;
	}
	.goods .menu-wrapper .menu-item .invocicel{
		background: url('invoice_3@3x.png') no-repeat center;
		background-size: 12px 12px;
	}

	.goods .foods-wrapper{
		flex: 1;
	}
	.goods .foods-wrapper .title{
		padding-left: 14px;
		height: 26px;
		line-height: 26px;
		border-left: 2px solid #d9ded1;
		font-size: 12px;
		color: rgb(147, 153, 159);
		background: #f3f5f9;
	}
	.goods .foods-wrapper .food-item{
		position: relative;
		display: flex;
		margin: 18px;
		padding-bottom: 18px;
		border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	}
	.goods .foods-wrapper .food-item:last-child{
		border-bottom: 0;
		margin-bottom: 0;
	}
	.goods .foods-wrapper .food-item .icon{
		flex: 0 0 57px;
		margin-right: 10px;
	}
	.goods .foods-wrapper .food-item .content{
		flex: 1;
	}
	.goods .foods-wrapper .food-item .content .name{
		margin: 2px 0 8px 0;
		height: 14px;
		line-height: 14px;
		font-size: 14px;
		color: rgb(7, 17, 27);
	}
	.goods .foods-wrapper .food-item .content .desc,.goods .foods-wrapper .food-item .content .extra{
		line-height: 10px;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.goods .foods-wrapper .food-item .content .desc{
		margin-bottom: 8px;
		line-height: 12px;
	}
	.goods .foods-wrapper .food-item .content .extra .count{
		margin-right: 12px;
	}
	.goods .foods-wrapper .food-item .content .price{
		font-weight: 700;
		line-height: 24px;
	}
	.goods .foods-wrapper .food-item .content .cartcontrol-wrapper{
		position: absolute;
		right: 0;
		bottom: 12px;
	}
	.goods .foods-wrapper .food-item .content .price .now{
		margin-right: 8px;
		font-size: 14px;
		color: rgb(240, 20, 20);
	}
	.goods .foods-wrapper .food-item .content .price .old{
		text-decoration: line-through;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
</style>