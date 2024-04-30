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
            // VueCookies.remove('id_user');
            // Lakukan langkah lain yang diperlukan saat logout
        },

    }
}
</script>

<template>
    <div class="flex">
        <div class="bg-orange flex flex-col items-center pt-8 w-[310px] max-[1800px]:h-full h-screen">
            <div>
                <div class="flex justify-center items-center">
                    <img class="bg-white mb-8 rounded-md" src="../assets/logo.png" alt="">
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
                    <p class="text-left font-gotham font-semibold text-warmgray mr-12">General</p>
                </div>

                <div>
                    <div class="flex flex-col gap-2 pt-4">
                        <router-link to="/dataumum">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Data Umum</button>
                        </router-link>
                            
                        <router-link to="/datakesehatan">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Data Kesehatan</button>
                        </router-link>

                        <router-link to="/datatreatment">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Data Treatment</button>
                        </router-link>

                        <router-link to="/DataKepemilikanObat">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Kepemilikan Obat</button>
                        </router-link>

                        <router-link to="/datarumahsakit">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Data Rumah Sakit</button>
                        </router-link>

                        <router-link to="/kelolaakun">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Kelola Akun</button>
                        </router-link>

                        <router-link to="/verifikasidokter">
                            <button
                                class="focus:bg-[#EEEEED] px-4 focus:text-black focus:opacity-100 focus:font-bold font-bold text-deepnavyblue opacity-70">Verifikasi Dokter</button>
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
    </div>
</template>