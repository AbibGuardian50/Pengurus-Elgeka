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
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/infoRS/${id}`
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                this.DataHospital = response.data.result.data
                // const superAdmin = VueCookies.get('superAdmin')
                // this.getRoles = superAdmin
                console.log(this.DataHospital)
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
        toggleModalEditHospital: function () {
            this.showedithospital = !this.showedithospital;
        },
        edithospital(id) {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const formData = new FormData();
            formData.append('nama_rs', this.DataHospital.nama_rs);
            formData.append('lokasi_rs', this.DataHospital.lokasi_rs);
            formData.append('image', this.DataHospital.image);
            formData.append('link_maps', this.DataHospital.link_maps);
            formData.append('latlong', this.DataHospital.latlong);
            formData.append('info_kontak', this.DataHospital.info_kontak);
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/infoRS/${id}`
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.resulterror = response.data
                    if (response.data.code === 200) {
                        this.$router.push('/datarumahsakit')
                    } else if (response.data.code === 400) {
                        setTimeout(() => {
                            this.$router.push('/datarumahsakit');
                        }, 5000);
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];
            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.DataHospital.image = selectedFile;
        },
    },
    data() {
        return {
            showeditadmin: false,
            getRoles: false,
            resulterror: '',
            DataHospital: '',
            DataHospital: {
                nama_rs: [],
                lokasi_rs: [],
                image: [],
                link_maps: [],
                latlong: [],
                info_kontak: [],
            }
        }
    },

}
</script>

<template>
    <div>
        <form v-if="DataHospital" @submit.prevent="edithospital(DataHospital.id)"
            class="overflow-x-hidden overflow-y-auto inset-0 justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-6xl flex flex-col-reverse">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-[40px] text-teal font-semibold font-poppins">
                            Data RSUD bandung
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
                            <label for="Nama RS" class="font-poppins font-bold text-base text-teal">Nama</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                v-model="DataHospital.nama_rs" name="Nama RS" id="">
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Alamat" class="font-poppins font-bold text-base text-teal">Alamat</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Alamat" v-model="DataHospital.lokasi_rs" id="" >
                        </div>
                        
                        <div class="flex gap-2 flex-col">
                            <label for="Kontak" class="font-poppins font-bold text-base text-teal">Kontak</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Kontak" v-model="DataHospital.info_kontak" id="" >
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Latlong" class="font-poppins font-bold text-base text-teal">Latlong</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Latlong" v-model="DataHospital.latlong" id="" >
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Link Google" class="font-poppins font-bold text-base text-teal">Link Google Maps</label>
                            <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                name="Link Google" v-model="DataHospital.link_maps" id="" >
                        </div>

                        <div class="flex gap-2 flex-col">
                            <label for="Gambar" class="font-poppins font-bold text-base text-teal">Gambar</label>
                            <input @change="handleFileChange"
                                            class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file"
                                            name="Gambar RS" id="">
                        </div>
                    </div>

                    
                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/datarumahsakit">
                            <button
                                class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                type="button">
                                batal
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </form>
        <div v-if="showeditadmin" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>