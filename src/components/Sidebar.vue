<script>
import VueCookies from 'vue-cookies';
export default {
    data() {
        return {
            open: false,
            dimmer: true,
            right: false
        };
    },
    methods: {
        toggle() {
            this.open = !this.open;
        },
        logout() {
            // Hapus token dari localStorage atau dari state aplikasi
            // VueCookies.remove('tokenlogin'); // Contoh jika token disimpan di localStorage atau cookies
            // VueCookies.remove('superAdmin');
            // VueCookies.remove('email');
            // VueCookies.remove('fullname');
            VueCookies.remove('TokenAuthorization');
            VueCookies.remove('superAdmin');
            VueCookies.remove('id_user');
            // Lakukan langkah lain yang diperlukan saat logout
        },

    }
}
</script>

<template>
    <!-- > 768 px screen and laptop screen -->
    <div class="flex max-[520px]:max-w-[230px] max-[520px]:min-w-[25%] max-md:hidden">
        <div
            class="bg-teal flex flex-col items-center pt-8 md:w-full max-[520px]:min-w-[70px] min-w-[70px] max-[1800px]:h-full h-screen">
            <div class="flex flex-col items-center">
                <img class="mb-8 rounded-md flex items-center justify-center max-md:w-[60px] max-md:h-[60px]"
                    src="../assets/logoElgekaPutih1.png" alt="">
                <svg xmlns="http://www.w3.org/2000/svg" id="menu-button" @click="toggleHamburgerMenu"
                    class="h-6 w-6 cursor-pointer min-[965px]:hidden block border border-white w-[40px] rounded-md h-[40px]"
                    fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div class="flex flex-col items-start ml-4 mr-32 max-[420px]:mr-4 max-[420px]:text-[14px] max-[420px]:mt-4">
                    <p class="text-left font-poppins font-semibold  text-white mr-12 hidden min-[965px]:block"
                        id="menu">General</p>
                </div>

                <div class="hidden min-[965px]:block" id="menu-sidebar">
                    <div class="flex flex-col gap-2 pt-4 max-[420px]:text-[12px]">
                        <ul class="flex flex-col gap-2">
                            <li>
                                <details class="group">
                                    <summary
                                        class="flex gap-2 items-center justify-between font-medium marker:content-none hover:text-midnightshadow py-2  hover:cursor-pointer ">
                                        <span
                                            class="flex gap-2 hover:text-midnightshadow hover:bg-white focus:text-midnightshadow">
                                            <span
                                                class="w-full hover:text-midnightshadow focus:text-midnightshadow focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter">
                                                Data Umum
                                            </span>
                                        </span>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M18.75 10L13.2366 15.2929C12.8298 15.6834 12.1702 15.6834 11.7634 15.2929L6.25 10"
                                                stroke="white" stroke-width="2" stroke-linecap="round" />
                                        </svg>

                                    </summary>
                                    <article class="px-4 pb-4 bg-whisperingsilver rounded-lg">
                                        <ul class="flex flex-col gap-4 pl-2 mt-4 pt-2">
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumpasien">
                                                    Data Pasien
                                                </a>
                                            </li>
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/dataumumdokter">
                                                    Data Dokter
                                                </a>
                                            </li>
                                        </ul>
                                    </article>
                                </details>
                            </li>
                        </ul>

                        <ul class="flex flex-col gap-2">
                            <li>
                                <details class="group">
                                    <summary
                                        class="flex gap-2 items-center justify-between font-medium marker:content-none hover:text-midnightshadow py-2  hover:cursor-pointer ">
                                        <span
                                            class="flex gap-2 hover:text-midnightshadow hover:bg-white focus:text-midnightshadow">
                                            <span
                                                class="w-full hover:text-midnightshadow focus:text-midnightshadow focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter">
                                                Data Hasil Lab
                                            </span>
                                        </span>
                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M18.75 10L13.2366 15.2929C12.8298 15.6834 12.1702 15.6834 11.7634 15.2929L6.25 10"
                                                stroke="white" stroke-width="2" stroke-linecap="round" />
                                        </svg>

                                    </summary>
                                    <article class="px-4 pb-4 bg-whisperingsilver rounded-lg">
                                        <ul class="flex flex-col gap-4 pl-2 mt-4 pt-2">
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabBCRABL">
                                                    BCR-ABL
                                                </a>
                                            </li>
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabLeukocytes">
                                                    Leukosit
                                                </a>
                                            </li>
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabPotentialHydrogen">
                                                    Potential Hydrogen
                                                </a>
                                            </li>
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabHemoglobin">
                                                    Hemoglobin
                                                </a>
                                            </li>
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabHeartRate">
                                                    Heart Rate
                                                </a>
                                            </li>
                                            <li
                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                <a href="/HasilLabBloodPressure">
                                                    Blood Pressure
                                                </a>
                                            </li>
                                        </ul>
                                    </article>
                                </details>
                            </li>
                        </ul>

                        <router-link to="/DataKepemilikanObat">
                            <button
                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Kepemilikan
                                Obat</button>
                        </router-link>

                        <router-link to="/datarumahsakit">
                            <button
                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Data
                                Rumah Sakit</button>
                        </router-link>

                        <router-link to="/kelolaakun">
                            <button
                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Kelola
                                Akun</button>
                        </router-link>

                        <router-link to="/verifikasidokter">
                            <button
                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Verifikasi
                                Dokter</button>
                        </router-link>

                    </div>
                </div>
            </div>

            <div class="flex justify-start mt-auto max-[1800px]:pt-12 items-start pb-8">
                <router-link to="/">
                    <div @click="logout" class="flex justify-start gap-2">
                        <img src="../assets/logout-logo.png" alt="Logo Logout">
                        <p class="text-white font-inter font-bold text-base max-[965px]:hidden">Keluar</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>

    <!-- 768 px screen < and mobile -->
    <div class="flex md:hidden">
        <!-- Sidebar -->
        <div class="flex top-0 h-screen z-20 bg-teal" :class="[right ? 'right-0 flex-row' : 'left-0 flex-row-reverse']">
            <!--Drawer -->
            <span class="block transform origin-center font-bold flex flex-col items-center w-[60px]">
                <img class="mb-8 rounded-md flex items-center justify-center max-md:w-[50px] max-md:h-[50px]"
                    src="../assets/logoElgekaPutih1.png" alt="">
                <svg xmlns="http://www.w3.org/2000/svg" id="menu-button" @click.prevent="toggle()"
                    class="h-6 w-6 cursor-pointer min-[965px]:hidden block border border-white w-[35px] rounded-md h-[35px]"
                    fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>

                <div class="flex justify-start mt-auto max-[1800px]:pt-12 items-start pb-8">
                    <router-link to="/">
                        <div @click="logout" class="flex justify-start gap-2">
                            <img src="../assets/logout-logo.png" alt="Logo Logout">
                            <p class="text-white font-inter font-bold text-base max-[965px]:hidden">Keluar</p>
                        </div>
                    </router-link>
                </div>
            </span>
            <!-- Sidebar Content -->
            <div ref="content" class="transition-all duration-700 overflow-hidden" :class="[open ? 'max-w-lg' : 'max-w-0']">
                <div class="w-48 text-center font-bold text-xl">
                    <div class="">
                        <div
                            class="bg-teal flex flex-col items-center md:w-full max-[520px]:min-w-[70px] min-w-[70px] max-[1800px]:h-full h-screen">
                            <div class="flex flex-col items-center">
                                <div
                                    class="flex flex-col items-start ml-4 max-[420px]:mr-4 max-[420px]:text-[14px] max-[420px]:mt-4">
                                    <p class="text-center font-poppins font-semibold  text-white block" id="menu">
                                        General</p>
                                </div>

                                <div class="block" id="menu-sidebar">
                                    <div class="flex flex-col gap-2 pt-4 max-[420px]:text-[12px] max-md:text-[14px]">
                                        <ul class="flex flex-col gap-2">
                                            <li>
                                                <details class="group">
                                                    <summary
                                                        class="flex gap-2 items-center justify-between font-medium marker:content-none hover:text-midnightshadow py-2  hover:cursor-pointer ">
                                                        <span
                                                            class="flex gap-2 hover:text-midnightshadow hover:bg-white focus:text-midnightshadow">
                                                            <span
                                                                class="w-full hover:text-midnightshadow focus:text-midnightshadow focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter">
                                                                Data Umum
                                                            </span>
                                                        </span>
                                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M18.75 10L13.2366 15.2929C12.8298 15.6834 12.1702 15.6834 11.7634 15.2929L6.25 10"
                                                                stroke="white" stroke-width="2" stroke-linecap="round" />
                                                        </svg>

                                                    </summary>
                                                    <article class="px-4 pb-4 bg-whisperingsilver rounded-lg">
                                                        <ul class="flex flex-col gap-4 pl-2 mt-4 pt-2">
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/dataumumpasien">
                                                                    Data Pasien
                                                                </a>
                                                            </li>
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/dataumumdokter">
                                                                    Data Dokter
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </article>
                                                </details>
                                            </li>
                                        </ul>

                                        <ul class="flex flex-col gap-2">
                                            <li>
                                                <details class="group">
                                                    <summary
                                                        class="flex gap-2 items-center justify-between font-medium marker:content-none hover:text-midnightshadow py-2  hover:cursor-pointer ">
                                                        <span
                                                            class="flex gap-2 hover:text-midnightshadow hover:bg-white focus:text-midnightshadow">
                                                            <span
                                                                class="w-full hover:text-midnightshadow focus:text-midnightshadow focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter">
                                                                Data Hasil Lab
                                                            </span>
                                                        </span>
                                                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M18.75 10L13.2366 15.2929C12.8298 15.6834 12.1702 15.6834 11.7634 15.2929L6.25 10"
                                                                stroke="white" stroke-width="2" stroke-linecap="round" />
                                                        </svg>

                                                    </summary>
                                                    <article class="px-4 pb-4 bg-whisperingsilver rounded-lg">
                                                        <ul class="flex flex-col gap-4 pl-2 mt-4 pt-2">
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/HasilLabBCRABL">
                                                                    BCR-ABL
                                                                </a>
                                                            </li>
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/HasilLabLeukocytes">
                                                                    Leukosit
                                                                </a>
                                                            </li>
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/HasilLabPotentialHydrogen">
                                                                    Potential Hydrogen
                                                                </a>
                                                            </li>
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/HasilLabHemoglobin">
                                                                    Hemoglobin
                                                                </a>
                                                            </li>
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/HasilLabHeartRate">
                                                                    Heart Rate
                                                                </a>
                                                            </li>
                                                            <li
                                                                class="flex gap-2 font-bold font-inter text-[16px] leading-5 text-midnightshadow">
                                                                <a href="/HasilLabBloodPressure">
                                                                    Blood Pressure
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </article>
                                                </details>
                                            </li>
                                        </ul>

                                        <router-link to="/DataKepemilikanObat">
                                            <button
                                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Kepemilikan
                                                Obat</button>
                                        </router-link>

                                        <router-link to="/datarumahsakit">
                                            <button
                                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Data
                                                Rumah Sakit</button>
                                        </router-link>

                                        <router-link to="/kelolaakun">
                                            <button
                                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Kelola
                                                Akun</button>
                                        </router-link>

                                        <router-link to="/verifikasidokter">
                                            <button
                                                class="focus:bg-verylightgray px-4 focus:text-black  focus:font-bold font-bold text-white font-inter ">Verifikasi
                                                Dokter</button>
                                        </router-link>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <slot></slot>
            </div>
        </div>

        <transition name="fade">
            <!-- Dimmer -->
            <div v-if="dimmer && open" @click="toggle()"
                class="flex-1 bg-gray-400 bg-opacity-75 active:outline-none z-10" />
        </transition>
    </div>
</template>