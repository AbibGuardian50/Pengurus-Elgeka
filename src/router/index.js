import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('../views/Notfound.vue')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },

    {
      path: '/dataumum',
      name: 'dataumum',
      component: () => import('../views/DataUmum.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/detaildataumum',
      name: 'detaildataumum',
      component: () => import('../views/DetailDataUmum.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/DataKepemilikanObat',
      name: 'DataKepemilikanObat',
      component: () => import('../views/DataKepemilikanObat.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/DataKesehatan',
      name: 'DataKesehatan',
      component: () => import('../views/DataKesehatan.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/DataRumahSakit',
      name: 'DataRumahSakit',
      component: () => import('../views/DataRumahSakit.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/DataTreatment',
      name: 'DataTreatment',
      component: () => import('../views/DataTreatment.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/editpengurus/:id',
      name: 'EditPengurus',
      component: () => import('../views/EditPengurus.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/KelolaAkun',
      name: 'KelolaAkun',
      component: () => import('../views/KelolaAkun.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },

    {
      path: '/VerifikasiDokter',
      name: 'VerifikasiDokter',
      component: () => import('../views/VerifikasiDokter.vue'),
      beforeEnter: (to, from, next) => {
        const tokenlogin = VueCookies.get('TokenAuthorization');
        if (!tokenlogin) {
          next('/')
        } else {
          next()
        }
      }
    },
  ]
})

export default router
