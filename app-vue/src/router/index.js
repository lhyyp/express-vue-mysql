import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/admin/login'
import register from '@/components/admin/register'
import admin from '@/components/admin/index'
import Jurisdiction from '@/components/admin/Bamboo/Jurisdiction'
import group from '@/components/admin/Bamboo/group'
import rule from '@/components/admin/Bamboo/rule'
import store from '@/vuex/store'
import modifyMember from '@/temp/modifyMember'
Vue.use(Router)

const router=new Router({
  mode: 'history',
  routes: [
    {path: '/',name: 'HelloWorld',component: HelloWorld},
    {path: '/modifyMember',name: 'modifyMember',component: modifyMember},
    {path: '/login',name: 'login',component:login},
    {path: '/register',name: 'register',component:register},
    {path: '/admin',name:'admin',component:admin, meta: { requireAuth: true},children:[
       {path:'/',name:'Jurisdiction',meta: { requireAuth: true},component:Jurisdiction},
       {path:'/admin/group',name:'group',meta: { requireAuth: true},component:group},
       {path:'/admin/rule',name:'rule',meta: { requireAuth: true},component:rule}
      ]
    },
    {path: '/admin/user',name:'user',component:admin, meta: { requireAuth: true},children:[
       {path:'/',name:'rule',meta: { requireAuth: true},component:rule}
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    	store.dispatch('loginmess').then(()=>{
	        if (store.getters.getmess) {  // 通过vuex state获取当前的token是否存在
	            next();
	        }
	        else {
	            next({
	                path: '/login',
	                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
	            })
	        }
    	})
    	
    }else {
        next();
    }
})
export default router
