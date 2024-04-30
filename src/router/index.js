import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },

    {
      path: '/dataumum',
      name: 'dataumum',
      component: () => import('../views/DataUmum.vue')
    },

    {
      path: '/DataKepemilikanObat',
      name: 'DataKepemilikanObat',
      component: () => import('../views/DataKepemilikanObat.vue')
    },

    {
      path: '/DataKesehatan',
      name: 'DataKesehatan',
      component: () => import('../views/DataKesehatan.vue')
    },

    {
      path: '/DataRumahSakit',
      name: 'DataRumahSakit',
      component: () => import('../views/DataRumahSakit.vue')
    },

    {
      path: '/DataTreatment',
      name: 'DataTreatment',
      component: () => import('../views/DataTreatment.vue')
    },

    {
      path: '/KelolaAkun',
      name: 'KelolaAkun',
      component: () => import('../views/KelolaAkun.vue')
    },

    {
      path: '/VerifikasiDokter',
      name: 'VerifikasiDokter',
      component: () => import('../views/VerifikasiDokter.vue')
    },
  ]
})

export default router
