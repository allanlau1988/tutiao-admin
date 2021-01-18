import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Settings from '@/views/settings'
import Fans from '@/views/fans'
import Test from '@/views/test'

Vue.use(VueRouter)

//路由配置表
const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/',
        //name: 'layout',
        component: Layout,
        children: [
            {
                path: '',//path 为空 作为默认子路由渲染
                name: 'home',
                component: Home
            },
            {
                path: '/article',
                name: 'article',
                component: Article
            },
            {
                path: '/publish',
                name: 'publish',
                component: Publish
            },
            {
                path: '/image',
                name: 'image',
                component: Image
            },
            {
                path: '/comment',
                name: 'comment',
                component: Comment
            },
            {
                path: '/settings',
                name: 'settings',
                component: Settings
            },
            {
                path: '/fans',
                name: 'fans',
                component: Fans
            },
            {
                path: '/test',
                name: 'test',
                component: Test
            }


        ]
    },
    
]

const router = new VueRouter({
    routes
})

// 路由导航守卫：说白了所有页面的导航都会经过这里
// 守卫页面导航的
// to: 要去的路由信息
//from: 来自哪里的路由信息
//next: 放行的方法
router.beforeEach((to, from, next) => {
    console.log(to)
    console.log(from)
    const user =JSON.parse( window.localStorage.getItem('user'))
  if(to.path!=='/login'){
      if(user){
          //已经登录
          next()
      }else {
          //没有登录
          next('/login')
      }
  }else{
      //登录页面
      next()
  }
  
})

export default router