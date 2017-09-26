// The Vue build version to htmload with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 1. 引入插件/组件
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.productionTip = false

// 2. 定义路由
const routes = [
  {path: '/', component: goods}, // 起始路径
  {path: '/goods', component: goods}, // 商品路径
  {path: '/ratings', component: ratings}, // 品论路径
  {path: '/seller', component: seller} // 商家路径
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes, // （缩写）相当于 routes: routes
  linkActiveClass: 'active' // 添加当前router-link的文字状态
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

// 现在，应用已经启动了！
