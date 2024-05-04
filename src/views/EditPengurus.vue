<script>
import axios from 'axios'
import VueCookies from 'vue-cookies';
// import { useToast } from 'vue-toastification';
// import { toast } from 'vue3-toastify';
// import 'vue3-toastify/dist/index.css';

export default {
    async created() {
        try {
            const id = this.$route.params.id
            const tokenlogin = VueCookies.get('TokenAuthorization')
            if (tokenlogin) {
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.daftarpengurus = response.data.result.data
                // const superAdmin = VueCookies.get('superAdmin')
                // this.getRoles = superAdmin
                console.log(this.getRoles)
                console.log(this.daftaradmin)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        // showToatWarning(){
        //     toast.warning('Wow warning!',{
        //         autoClose: 1000,
        //     });   
        // },
        toggleModalEditPengurus: function () {
            this.showeditpengurus = !this.showeditpengurus;
        },
        editpengurus(id) {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            // const toast = useToast();
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/${id}`
            axios.patch(url, this.edited, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.resulterror = response.data
                    if (response.data.code === 200) {
                        this.$router.push('/kelolaakun')
                    } else if (response.data.code === 400) {
                        setTimeout(() => {
                            this.$router.push('/kelolaakun');
                        }, 5000);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
    },
    data() {
        return {
            showeditadmin: false,
            getRoles: false,
            resulterror: '',
            daftaradmin: '',
            edited: {
                full_name: '',
                username: ''
            }
        }
    },

}
</script>

<template>
    <div>
        <form v-if="daftaradmin" @submit.prevent="editadmin(daftaradmin.id)"
            class="overflow-x-hidden overflow-y-auto inset-0 justify-center items-center flex">
            <div v-if="getRoles === 'true'" class="relative w-auto my-6 mx-auto max-w-6xl flex flex-col-reverse">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-orange font-semibold font-poppins">
                            Edit Akun Pengurus
                        </h3>
                        <button
                            class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                            v-on:click="toggleModalCreateAdmin()">
                            <span
                                class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            </span>
                        </button>
                    </div>
                    <!--body-->
                    <div class="flex flex-col gap-8 relative p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-orange">Nama
                                Lengkap</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="edited.full_name" name="nama lengkap" id="" :placeholder="daftaradmin.full_name">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="username" class="font-poppins font-bold text-base text-orange">Username</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="username" v-model="edited.username" id="" :placeholder="daftaradmin.username">
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kelolaakun">
                            <button
                                class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                batal
                            </button>
                        </router-link>
                    </div>
                </div>
                <div v-if="resulterror.message === 'Error Update Admin by ID: Unauthorized, Superadmins cannot update other superadmins'"
                    class="px-2 mt-4">
                    <!-- Alert Error -->
                    <div class="bg-[#fecdd3] px-6 py-4 mx-2 my-4 rounded-md text-lg flex items-center mx-auto max-w-lg">
                        <svg viewBox="0 0 24 24" class="text-[#dc2626] w-5 h-5 sm:w-5 sm:h-5 mr-3">
                            <path fill="currentColor"
                                d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207,11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47,1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z">
                            </path>
                        </svg>
                        <span class="text-[#991b1b]">Error, superadmin tidak bisa edit superadmin lainnya</span>
                    </div>
                    <!-- End Alert Error -->
                </div>
            </div>
            <div v-else>
                <p class="font-bold font-poppins text-5xl">Dilarang Akses Halaman Ini</p>
                <a href="/kelolaakun" class="hover:text-orange hover:underline font-bold font-poppins text-5xl">Klik Disini
                    Untuk Kembali ke Halaman Sebelumnya</a>
            </div>
        </form>
        <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>