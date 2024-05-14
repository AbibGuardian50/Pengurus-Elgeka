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
      path: '/dataumumpasien',
      name: 'dataumumpasien',
      component: () => import('../views/DataUmumPasien.vue'),
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
      path: '/detaildataumumpasien',
      name: 'detaildataumumpasien',
      component: () => import('../views/DetailDataUmumPasien.vue'),
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
      path: '/dataumumdokter',
      name: 'dataumumdokter',
      component: () => import('../views/DataUmumDokter.vue'),
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
      path: '/detaildataumumdokter',
      name: 'detaildataumumdokter',
      component: () => import('../views/DetailDataUmumDokter.vue'),
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
      path: '/DetailDataUmumKepemilikanObat',
      name: 'DetailDataKepemilikanObat',
      component: () => import('../views/DetailDataKepemilikanObat.vue'),
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
      path: '/DetailHasilLabBCRABL',
      name: 'DetailHasilLabBCRABL',
      component: () => import('../views/DetailHasilLabBCR-ABL.vue'),
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
      path: '/DetailHasilLabBloodPressure',
      name: 'DetailHasilLabBloodPressure',
      component: () => import('../views/DetailHasilLabBloodPressure.vue'),
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
      path: '/DetailHasilLabLeukocytes',
      name: 'DetailHasilLabLeukocytes',
      component: () => import('../views/DetailHasilLabLeukocytes.vue'),
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
      path: '/EditDataRumahSakit/:id',
      name: 'EditDataRumahSakit',
      component: () => import('../views/EditDataRumahSakit.vue'),
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
      path: '/HasilLabBCRABL',
      name: 'HasilLabBCRABL',
      component: () => import('../views/HasilLabBCR-ABL.vue'),
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
      path: '/HasilLabBloodPressure',
      name: 'HasilLabBloodPressure',
      component: () => import('../views/HasilLabBloodPressure.vue'),
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
      path: '/HasilLabLeukocytes',
      name: 'HasilLabLeukocytes',
      component: () => import('../views/HasilLabLeukocytes.vue'),
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
