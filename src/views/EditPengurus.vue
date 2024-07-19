<script>
import axios from 'axios'
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
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
                console.log(this.daftarpengurus)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        toggleModalEditPengurus: function () {
            this.showeditpengurus = !this.showeditpengurus;
        },
        editpengurus(id) {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            this.daftarpengurus.is_active = this.daftarpengurus.is_active.toString();
            // Hapus properti superUser dari objek daftarpengurus
            delete this.daftarpengurus.superUser;
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/${id}`
            axios.patch(url, this.daftarpengurus, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.resulterror = response.data
                    if (response.data.code === 200) {
                        toast.success('Berhasil edit pengurus')
                        setTimeout(() => {
                            this.$router.push('/kelolaakun');
                        }, 1000);
                    } else if (response.data.message === 'Error Update Admin by ID: Username already exists') {
                        toast.error('Nama pengurus yang akan diubah sudah ada, mohon untuk mengganti dengan nama yang lain')
                        setTimeout(() => {
                            this.$router.push('/kelolaakun');
                        }, 2000);
                    } else {
                        toast.error('Terdapat kesalahan, mohon coba lagi')
                    }
                })
                .catch(error => {
                    console.log(error)
                    toast.error('Terdapat kesalahan, mohon coba lagi')
                })
        },
    },
    data() {
        return {
            showeditadmin: false,
            getRoles: false,
            resulterror: '',
            daftarpengurus: '',
            daftarpengurus: {
                full_name: '',
                username: '',
                is_active: '',
            }
        }
    },

}
</script>

<template>
    <div>
        <form v-if="daftarpengurus" @submit.prevent="editpengurus(daftarpengurus.id)"
            class="fixed inset-0 flex justify-center items-center max-md:items-start max-md:justify-start overflow-y-auto overflow-x-hidden">
            <div class="relative w-full max-w-6xl mx-auto my-6 max-md:my-0 flex flex-col">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-2xl md:text-3xl lg:text-[40px] text-teal font-semibold font-poppins">
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
                    <div class="flex flex-col gap-4 md:gap-6 lg:gap-8 relative p-6">
                        <div class="flex flex-col gap-2">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-teal">Nama
                                Lengkap</label>
                            <input
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                type="text" required v-model="daftarpengurus.full_name" name="nama lengkap" id="">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="username" class="font-poppins font-bold text-base text-teal">Username</label>
                            <input
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                type="text" required name="username" v-model="daftarpengurus.username" id="">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Status" class="font-poppins font-bold text-base text-teal">Status Aktif</label>
                            <select required
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                name="Status" id="" v-model="daftarpengurus.is_active">
                                <option value="false">Nonaktif</option>
                                <option value="true">Aktif</option>
                            </select>
                        </div>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 md:px-10 md:py-4 lg:px-12 lg:py-4 rounded outline-none focus:outline-none mr-1 mb-1"
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/kelolaakun">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 md:px-10 md:py-4 lg:px-6 lg:py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                Batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
        <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div></template>
