<template>
  <div class="cartcontrol">
  	<transition  name="move">
		<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
			<i class="icon-remove_circle_outline"></i>
		</div>
	</transition>
	<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
	<div class="cart-add" @click.stop.prevent="addCart">
		<i class="icon-add_circle"></i>
	</div>
  </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue'

	export default{
		props: {
			food: {
				type: Object
			}
		},
		methods: {
			addCart (event) {
               // 阻止默认行为
               if (!event._constructed){
                 return
               }
               if (!this.food.count) {
                 Vue.set(this.food, 'count', 1)
                  // this.food.count = 1
               } else {
                   this.food.count ++
               }
			},
			decreaseCart (event) {
				// 阻止默认行为
               if (!event._constructed){
                 return
               }
               if (this.food.count) {
                 this.food.count --
               }
			}
		}
	}
</script>

<style>
	.cartcontrol{
		font-size: 0;
	}
	.cartcontrol i{
		display: block;
	}
	.cartcontrol .cart-decrease, .cartcontrol .cart-count, .cartcontrol .cart-add{
		display: inline-block;
	}
	.cartcontrol .move-enter-active, .move-leave-active{
	 	opacity: 1;
		transition: all 0.4s linear;
		transform: translate3d(0,0,0);
		transform: rotate(0);
	}
	.cartcontrol .move-enter, .move-leave-to{
		opacity: 0;
		transform: translate3d(24px, 0, 0);
	}
	.cartcontrol .move-enter .inner, .move-leave-to .inner{
		transform: rotate(180deg);
	}
	.cartcontrol .cart-count{
		vertical-align: top;
		width: 12px;
		padding-top: 6px;
		line-height: 24px;
		text-align: center;
		font-size: 10px;
		color: rgb(147, 153, 159);
	}
	.icon-remove_circle_outline, .icon-add_circle{
		padding: 6px;
		line-height: 24px;
		font-size: 24px;
		color: rgb(0, 160, 220);
	}
	
</style>
