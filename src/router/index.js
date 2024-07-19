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
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login Pengurus Sahabat CGI' }
  },
  {
    path: '/dataumumpasien',
    name: 'dataumumpasien',
    component: () => import('../views/DataUmumPasien.vue'),
    meta: { title: 'Data Umum Pasien' }
  },
  {
    path: '/detaildataumumpasien',
    name: 'detaildataumumpasien',
    component: () => import('../views/DetailDataUmumPasien.vue'),
    meta: { title: 'Detail Data Umum Pasien' }
  },
  {
    path: '/dataumumdokter',
    name: 'dataumumdokter',
    component: () => import('../views/DataUmumDokter.vue'),
    meta: { title: 'Data Umum Dokter' }
  },
  {
    path: '/detaildataumumdokter',
    name: 'detaildataumumdokter',
    component: () => import('../views/DetailDataUmumDokter.vue'),
    meta: { title: 'Detail Data Umum Dokter' }
  },
  {
    path: '/DataKepemilikanObat',
    name: 'DataKepemilikanObat',
    component: () => import('../views/DataKepemilikanObat.vue'),
    meta: { title: 'Data Kepemilikan Obat' }
  },
  {
    path: '/DetailDataUmumKepemilikanObat',
    name: 'DetailDataKepemilikanObat',
    component: () => import('../views/DetailDataKepemilikanObat.vue'),
    meta: { title: 'Detail Data Kepemilikan Obat' }
  },
  {
    path: '/DetailHasilLabBCRABL',
    name: 'DetailHasilLabBCRABL',
    component: () => import('../views/DetailHasilLabBCR-ABL.vue'),
    meta: { title: 'Detail Data Hasil Lab BCR-ABL' }
  },
  {
    path: '/DetailHasilLabBloodPressure',
    name: 'DetailHasilLabBloodPressure',
    component: () => import('../views/DetailHasilLabBloodPressure.vue'),
    meta: { title: 'Detail Data Hasil Lab Blood Pressure' }
  },
  {
    path: '/DetailHasilLabHeartRate',
    name: 'DetailHasilLabHeartRate',
    component: () => import('../views/DetailHasilLabHeartRate.vue'),
    meta: { title: 'Detail Data Hasil Lab Heart Rate' }
  },
  {
    path: '/DetailHasilLabHemoglobin',
    name: 'DetailHasilLabHemoglobin',
    component: () => import('../views/DetailHasilLabHemoglobin.vue'),
    meta: { title: 'Detail Data Hasil Lab Hemoglobin' }
  },
  {
    path: '/DetailHasilLabHematokrit',
    name: 'DetailHasilLabHematokrit',
    component: () => import('../views/DetailHasilLabHematokrit.vue'),
    meta: { title: 'Detail Data Hasil Lab Hematokrit' }
  },
  {
    path: '/DetailHasilLabLeukocytes',
    name: 'DetailHasilLabLeukocytes',
    component: () => import('../views/DetailHasilLabLeukocytes.vue'),
    meta: { title: 'Detail Data Hasil Lab Leukoytes' }
  },
  {
    path: '/DetailHasilLabPotentialHydrogen',
    name: 'DetailHasilLabPotentialHydrogen',
    component: () => import('../views/DetailHasilLabPotentialHydrogen.vue'),
    meta: { title: 'Detail Data Hasil Lab Potential Hydrogen' }
  },
  {
    path: '/DetailHasilLabTrombosit',
    name: 'DetailHasilLabTrombosit',
    component: () => import('../views/DetailHasilLabTrombosit.vue'),
    meta: { title: 'Detail Data Hasil Lab Trombosit' }
  },
  {
    path: '/DataObat',
    name: 'DataObatPengurus',
    component: () => import('../views/DataObatPengurus.vue'),
    meta: { title: 'Data Obat Pengurus' }
  },
  {
    path: '/DataSpesialis',
    name: 'DataSpesialis',
    component: () => import('../views/DataSpesialis.vue'),
    meta: { title: 'Data Spesialis' }
  },
  {
    path: '/DataKategoriObatPengurus',
    name: 'DataKategoriObatPengurus',
    component: () => import('../views/DataKategoriObatPengurus.vue'),
    meta: { title: 'Data Kategori Obat' }
  },
  {
    path: '/DataRumahSakit',
    name: 'DataRumahSakit',
    component: () => import('../views/DataRumahSakit.vue'),
    meta: { title: 'Data Rumah Sakit' }
  },
  {
    path: '/editpengurus/:id',
    name: 'EditPengurus',
    component: () => import('../views/EditPengurus.vue'),
    meta: { title: 'Edit Akun Pengurus' }
  },
  {
    path: '/EditDataObatPengurus/:id',
    name: 'EditDataObatPengurus',
    component: () => import('../views/EditDataObatPengurus.vue'),
    meta: { title: 'Edit Data Obat Pengurus' }
  },
  {
    path: '/EditDataRumahSakit/:id',
    name: 'EditDataRumahSakit',
    component: () => import('../views/EditDataRumahSakit.vue'),
    meta: { title: 'Edit Data Rumah Sakit' }
  },
  {
    path: '/HasilLabBCRABL',
    name: 'HasilLabBCRABL',
    component: () => import('../views/HasilLabBCR-ABL.vue'),
    meta: { title: 'Hasil Lab BCR-ABL' }
  },
  {
    path: '/HasilLabHeartRate',
    name: 'HasilLabHeartRate',
    component: () => import('../views/HasilLabHeartRate.vue'),
    meta: { title: 'Hasil Lab Heart Rate' }
  },

  {
    path: '/HasilLabHematokrit',
    name: 'HasilLabHematokrit',
    component: () => import('../views/HasilLabHematokrit.vue'),
    meta: { title: 'Hasil Lab Hematokrit' }
  },
  {
    path: '/HasilLabBloodPressure',
    name: 'HasilLabBloodPressure',
    component: () => import('../views/HasilLabBloodPressure.vue'),
    meta: { title: 'Hasil Lab Blood Pressure' }
  },
  {
    path: '/HasilLabTrombosit',
    name: 'HasilLabTrombosit',
    component: () => import('../views/HasilLabTrombosit.vue'),
    meta: { title: 'Hasil Lab Trombosit' }
  },
  {
    path: '/HasilLabHemoglobin',
    name: 'HasilLabHemoglobin',
    component: () => import('../views/HasilLabHemoglobin.vue'),
    meta: { title: 'Hasil Lab Hemoglobin' }
  },
  {
    path: '/HasilLabLeukocytes',
    name: 'HasilLabLeukocytes',
    component: () => import('../views/HasilLabLeukocytes.vue'),
    meta: { title: 'Hasil Lab Leukocytes' }
  },
  {
    path: '/HasilLabPotentialHydrogen',
    name: 'HasilLabPotentialHydrogen',
    component: () => import('../views/HasilLabPotentialHydrogen.vue'),
    meta: { title: 'Hasil Lab Potential Hydrogen' }
  },
  {
    path: '/KelolaAkun',
    name: 'KelolaAkun',
    component: () => import('../views/KelolaAkun.vue'),
    meta: { title: 'Kelola Akun Pengurus' }
  },
  {
    path: '/VerifikasiDokter',
    name: 'VerifikasiDokter',
    component: () => import('../views/VerifikasiDokter.vue'),
    meta: { title: 'Verifikasi Dokter' }
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
    document.title = to.meta.title || 'Dashboard Pengurus Sahabat CGI'; // Atur title berdasarkan meta title atau default jika tidak ada
    next();
  }
});

export default router;
