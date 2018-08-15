// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'   //异步请求数据
import Asetes from './common/css/reset.css'
import MainScss from './common/css/common.scss'

import Mui from './common/css/mui.css'
import './common/js/common.js'

Vue.config.productionTip = false
Vue.prototype.$http= axios
window.Asetes =Asetes
window.Mui =Mui
window.MainScss = MainScss
//Vue.use(Mui)

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
})
router.afterEach((to,from,next) => {
	window.scrollTo(0,0);
});