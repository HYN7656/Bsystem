import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index'
import Index from '@/views/manage/index'
import Auth from '@/views/manage/auth'

import Platform from '@/views/manage/app'
import PlatformLog from '@/views/manage/log'
import PlatformMenu from '@/views/manage/menu'
import PlatformOrg from '@/views/manage/organization'
import PlatformRole from '@/views/manage/role'
import PlatformUser from '@/views/manage/user'
Vue.use(Router)

export default new Router({
  base: "/",
  // mode: 'history',
  routes: [
    {
      // base: "/login/",
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        auth: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: Platform,
      redirect: '/index',
      meta: {
        auth: true,
        hideLeft: true
      },
      children:[
        {
          path: '/index',
          name: 'platform.index',
          component: Index,
          meta: {
            auth: true
          }
        },
        {
          path: '/log',
          name: 'platform.log',
          component: PlatformLog,
          meta: {
            auth: true
          }
        },
        {
          path: '/menu',
          name: 'platform.menu',
          component: PlatformMenu,
          meta: {
            auth: true
          }
        },
        {
          path: '/org',
          name: 'platform.org',
          component: PlatformOrg,
          meta: {
            auth: true
          }
        },
        {
          path: '/role',
          name: 'platform.role',
          component: PlatformRole,
          meta: {
            auth: true
          }
        },
        {
          path: '/user',
          name: 'platform.user',
          component: PlatformUser,
          meta: {
            auth: true
          }
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth,
      meta: {
        auth: true,
      },
    },


  ]
})
