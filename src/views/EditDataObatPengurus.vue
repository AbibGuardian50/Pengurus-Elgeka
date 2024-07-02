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
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataObat/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.DataMedicine = response.data.result.data
                console.log(this.DataMedicine)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        toggleModalEditHospital: function () {
            this.showedithospital = !this.showedithospital;
        },
        editmedicine(id) {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataObat/${id}`
            axios.patch(url, this.DataMedicine, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.resulterror = response.data
                    if (response.data.code === 200) {
                        toast.success('Edit data rumah sakit berhasil');

                    } else if (response.data.code === 400) {
                        setTimeout(() => {
                            toast.error('Edit data rumah sakit gagal!');

                        }, 5000);
                    }
                })
                .catch(error => {
                    const toast = useToast()
                    if (error.message === "Request failed with status code 401") {
                        toast.error('Error code 401, Mohon untuk logout lalu login kembali')
                    }
                    console.log(error)
                })
        },
    },
    data() {
        return {
            showeditadmin: false,
            getRoles: false,
            resulterror: '',
            DataMedicine: '',
            DataMedicine: {
                nama_obat: [],
                list_dosis: [],
                kategori: [],
            }
        }
    },

}
</script>

<template>
    <div>
        <form v-if="DataMedicine" @submit.prevent="editmedicine(DataMedicine.id)"
            class="fixed inset-0 flex justify-center max-md:justify-start items-center max-md:items-start overflow-y-auto overflow-x-hidden">
            <div class="relative w-full max-w-6xl mx-auto my-6 max-md:my-0 flex flex-col">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-2xl md:text-3xl lg:text-[40px] text-teal font-semibold font-poppins">
                            Data Obat (Pengurus)
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
                    <div class="flex flex-col gap-4 md:gap-6 lg:gap-8 p-6">
                        <div class="flex gap-2 flex-col">
                            <label for="nama lengkap" class="font-poppins font-bold text-base text-teal">Nama</label>
                            <input class="border border-black py-4 min-w-[550px] max-md:min-w-full pl-2 rounded-md"
                                type="text" required name="nama lengkap" id="" v-model="DataMedicine.nama_obat"
                                placeholder="Nama Obat">
                        </div>
                        <div class="flex gap-2 flex-col">
                            <label for="Dosis" class="font-poppins font-bold text-base text-teal">Dosis</label>
                            <input class="border border-black py-4 min-w-[550px] max-md:min-w-full pl-2 rounded-md"
                                type="text" required name="Dosis" id="" v-model="DataMedicine.list_dosis"
                                placeholder="Dosis Obat">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Kontak" class="font-poppins font-bold text-base text-teal">Kategori</label>
                            <select v-model="DataMedicine.kategori"
                                class="border border-black py-4 min-w-[550px] max-md:min-w-full pl-2 rounded-md"
                                required>
                                <option value="">Select Role</option>
                                <option value="CML">CML</option>
                                <option value="Pendukung">Pendukung</option>
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
                        <router-link to="/DataObatPengurus">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 md:px-10 md:py-4 lg:px-12 lg:py-4 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                Batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
        <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>
