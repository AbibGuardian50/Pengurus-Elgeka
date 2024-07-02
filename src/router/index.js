// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import VueCookies from 'vue-cookies';

const routes = [
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
    component: () => import('../views/DataUmumPasien.vue')
  },
  {
    path: '/detaildataumumpasien',
    name: 'detaildataumumpasien',
    component: () => import('../views/DetailDataUmumPasien.vue')
  },
  {
    path: '/dataumumdokter',
    name: 'dataumumdokter',
    component: () => import('../views/DataUmumDokter.vue')
  },
  {
    path: '/detaildataumumdokter',
    name: 'detaildataumumdokter',
    component: () => import('../views/DetailDataUmumDokter.vue')
  },
  {
    path: '/DataKepemilikanObat',
    name: 'DataKepemilikanObat',
    component: () => import('../views/DataKepemilikanObat.vue')
  },
  {
    path: '/DetailDataUmumKepemilikanObat',
    name: 'DetailDataKepemilikanObat',
    component: () => import('../views/DetailDataKepemilikanObat.vue')
  },
  {
    path: '/DetailHasilLabBCRABL',
    name: 'DetailHasilLabBCRABL',
    component: () => import('../views/DetailHasilLabBCR-ABL.vue')
  },
  {
    path: '/DetailHasilLabBloodPressure',
    name: 'DetailHasilLabBloodPressure',
    component: () => import('../views/DetailHasilLabBloodPressure.vue')
  },
  {
    path: '/DetailHasilLabHeartRate',
    name: 'DetailHasilLabHeartRate',
    component: () => import('../views/DetailHasilLabHeartRate.vue')
  },
  {
    path: '/DetailHasilLabHemoglobin',
    name: 'DetailHasilLabHemoglobin',
    component: () => import('../views/DetailHasilLabHemoglobin.vue')
  },
  {
    path: '/DetailHasilLabLeukocytes',
    name: 'DetailHasilLabLeukocytes',
    component: () => import('../views/DetailHasilLabLeukocytes.vue')
  },
  {
    path: '/DetailHasilLabPotentialHydrogen',
    name: 'DetailHasilLabPotentialHydrogen',
    component: () => import('../views/DetailHasilLabPotentialHydrogen.vue')
  },
  {
    path: '/DataKesehatan',
    name: 'DataKesehatan',
    component: () => import('../views/DataKesehatan.vue')
  },
  {
    path: '/DataObatPengurus',
    name: 'DataObatPengurus',
    component: () => import('../views/DataObatPengurus.vue')
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
    path: '/editpengurus/:id',
    name: 'EditPengurus',
    component: () => import('../views/EditPengurus.vue')
  },
  {
    path: '/EditDataObatPengurus/:id',
    name: 'EditDataObatPengurus',
    component: () => import('../views/EditDataObatPengurus.vue')
  },
  {
    path: '/EditDataRumahSakit/:id',
    name: 'EditDataRumahSakit',
    component: () => import('../views/EditDataRumahSakit.vue')
  },
  {
    path: '/HasilLabBCRABL',
    name: 'HasilLabBCRABL',
    component: () => import('../views/HasilLabBCR-ABL.vue')
  },
  {
    path: '/HasilLabHeartRate',
    name: 'HasilLabHeartRate',
    component: () => import('../views/HasilLabHeartRate.vue')
  },
  {
    path: '/HasilLabBloodPressure',
    name: 'HasilLabBloodPressure',
    component: () => import('../views/HasilLabBloodPressure.vue')
  },
  {
    path: '/HasilLabHemoglobin',
    name: 'HasilLabHemoglobin',
    component: () => import('../views/HasilLabHemoglobin.vue')
  },
  {
    path: '/HasilLabLeukocytes',
    name: 'HasilLabLeukocytes',
    component: () => import('../views/HasilLabLeukocytes.vue')
  },
  {
    path: '/HasilLabPotentialHydrogen',
    name: 'HasilLabPotentialHydrogen',
    component: () => import('../views/HasilLabPotentialHydrogen.vue')
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const tokenlogin = VueCookies.get('TokenAuthorization');
  if (!tokenlogin && to.name !== 'Login' && to.name !== 'notfound') {
    next('/');
  } else {
    next();
  }
});

export default router;
