import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    
    {
      path: '/',
      name: 'cesium',
      component: () => import('./views/Cesium.vue')
    }
  ]
})
