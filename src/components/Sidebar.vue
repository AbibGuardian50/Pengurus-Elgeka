<script>
import VueCookies from 'vue-cookies';
export default {
    methods: {
        logout() {
            // Hapus token dari localStorage atau dari state aplikasi
            // VueCookies.remove('tokenlogin'); // Contoh jika token disimpan di localStorage atau cookies
            // VueCookies.remove('superAdmin');
            // VueCookies.remove('email');
            // VueCookies.remove('fullname');
            VueCookies.remove('TokenAuthorization');
            // Lakukan langkah lain yang diperlukan saat logout
        },

    }
}
</script>

<template>
    <div class="flex">
        <div class="bg-teal flex flex-col items-center pt-8 w-[310px] max-[1800px]:h-full h-screen">
            <div>
                <div class="flex justify-center items-center">
                    <img class="mb-8 rounded-md" src="../assets/logoElgekaPutih1.png" alt="">
                </div>

                <form action="" class="relative w-max flex flex-row bg-white rounded-md pl-4 mb-4">
                    <input type="search" placeholder="Quick Find"
                        class="peer cursor-pointer relative z-10 h-12 w-12 rounded-md bg-transparent pl-2 outline-none w-full cursor-text pr-4" />
                    <div class="flex items-center justify-center pr-4">
                        <img class="w-[19px] h-[19px]" src="../assets/union-1.png" alt="">
                    </div>

                    <!-- <svg xmlns="http://www.w3.org/2000/svg"
                        class="absolute inset-y-0 my-auto h-8 w-12 border-r border-transparent stroke-black px-3.5 peer-border-lime-300 peer-stroke-lime-500"
                        fill="black" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> -->
                    <!-- </svg> -->
                </form>

                <div class="flex flex-col items-start mr-32">
                    <p class="text-left font-gotham font-semibold text-white mr-12">General</p>
                </div>

                <div>
                    <div class="flex flex-col gap-2 pt-4">
                        <ul class="flex flex-col gap-2">
                            <li>
                                <details class="group">
                                    <summary
                                        class="flex gap-2 items-center justify-between font-medium marker:content-none hover:text-midnightshadow py-2  hover:cursor-pointer ">
                                        <span class="flex gap-2 hover:text-midnightshadow hover:bg-white focus:text-midnightshadow">
                                            <span
                                                class="w-full hover:text-midnightshadow focus:text-midnightshadow focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter">
                                                Data Umum
                                            </span>
                                        </span>
                                        <svg class="w-5 h-5 text-gray-500 transition group-open:rotate-90" width="8" height="8" viewBox="0 0 15 15" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                                stroke="#111111" stroke-width="2" stroke-linecap="round" />
                                        </svg>

                                    </summary>
                                    <article class="px-4 pb-4 bg-whisperingsilver rounded-lg">
                                        <ul class="flex flex-col gap-4 pl-2 mt-4 pt-2">
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumpasien">
                                                    Data Pasien
                                                </a>
                                            </li>
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumdokter">
                                                    Data Dokter
                                                </a>
                                            </li>
                                        </ul>
                                    </article>
                                </details>
                            </li>
                        </ul>
                        <router-link to="/datakesehatan">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Data
                                Kesehatan</button>
                        </router-link>

                        <ul class="flex flex-col gap-2">
                            <li>
                                <details class="group">
                                    <summary
                                        class="flex gap-2 items-center justify-between font-medium marker:content-none hover:text-midnightshadow py-2  hover:cursor-pointer ">
                                        <span class="flex gap-2 hover:text-midnightshadow hover:bg-white focus:text-midnightshadow">
                                            <span
                                                class="w-full hover:text-midnightshadow focus:text-midnightshadow focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter">
                                                Data Hasil Lab
                                            </span>
                                        </span>
                                        <svg class="w-5 h-5 text-gray-500 transition group-open:rotate-90" width="8" height="8" viewBox="0 0 15 15" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                                                stroke="#111111" stroke-width="2" stroke-linecap="round" />
                                        </svg>

                                    </summary>
                                    <article class="px-4 pb-4 bg-whisperingsilver rounded-lg">
                                        <ul class="flex flex-col gap-4 pl-2 mt-4 pt-2">
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabBCRABL">
                                                    BCR-ABL
                                                </a>
                                            </li>
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabLeukocytes">
                                                    Leukosit
                                                </a>
                                            </li>
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumpasien">
                                                    Potential Hydrogen
                                                </a>
                                            </li>
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumpasien">
                                                    Hemoglobin
                                                </a>
                                            </li>
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumpasien">
                                                    Heart Rate
                                                </a>
                                            </li>
                                            <li class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabBloodPressure">
                                                    Blood Pressure
                                                </a>
                                            </li>
                                        </ul>
                                    </article>
                                </details>
                            </li>
                        </ul>

                        <router-link to="/datatreatment">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Data
                                Treatment</button>
                        </router-link>

                        <router-link to="/DataKepemilikanObat">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Kepemilikan
                                Obat</button>
                        </router-link>

                        <router-link to="/datarumahsakit">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Data
                                Rumah Sakit</button>
                        </router-link>

                        <router-link to="/kelolaakun">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Kelola
                                Akun</button>
                        </router-link>

                        <router-link to="/verifikasidokter">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Verifikasi
                                Dokter</button>
                        </router-link>

                    </div>
                </div>
            </div>

            <div class="flex justify-start mt-auto max-[1800px]:pt-12 items-start pb-8">
                <router-link to="/">
                    <div class="flex justify-start gap-2">
                        <img src="../assets/logout-logo.png" alt="Logo Logout">
                        <p @click="logout" class="text-white font-bold text-base">Keluar</p>
                    </div>
                </router-link>
        </div>
    </div>
</div></template>