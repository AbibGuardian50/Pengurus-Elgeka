<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies';

export default {
    async created() {
        try {
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/infoRS');
            this.InfoRS = response.data.result.data;
            this.InfoRS.sort((x, y) => x.id - y.id)
            this.InfoRS.forEach((item, index) => {
                item.no = index + 1;
            });
            console.log(this.InfoRS)
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            InfoRS: [],
            showcreatehospital: [],
            url: 'https://elgeka-web-api-production.up.railway.app/',
            form: {
                image: '',
                nama_rs: [],
                lokasi_rs: [],
                link_maps: [],
                latlong: [],
                info_kontak: []
            },
            showcreatehospital: false,
        }
    },
    methods: {
        createhospital() {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/infoRS'
            const formData = new FormData();
            formData.append('image', this.form.image);
            formData.append('nama_rs', this.form.nama_rs);
            formData.append('lokasi_rs', this.form.lokasi_rs);
            formData.append('link_maps', this.form.link_maps);
            formData.append('latlong', this.form.latlong);
            formData.append('info_kontak', this.form.info_kontak);
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data);
                    
                })
                .catch(error => {
                    console.log(error)
                })
        },
        toggleModalCreateHospital: function () {
            this.showcreatehospital = !this.showcreatehospital;
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];
            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.form.image = selectedFile;
        },
    }
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div>
            <div class="ml-4 flex items-center justify-between border-b border-lightgray ">
                <p class=" font-bold text-[30px]  mt-4 py-4 leading-6 text-blueblack">Data Rumah Sakit</p>
            </div>

            <p class="ml-4 font-normal text-[20px] leading-7 text-blueblack mt-4 mb-8">Data Rumah Sakit</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px] bg-offwhite">
                <thead class="bg-offwhite">
                    <tr class="border-b-[0.5px] border-b-lightgray">
                        <th scope="col" class="px-3 py-3 text-left font-gotham font-normal text-sulfurblack text-base">
                            No
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-gotham font-bold text-blueblack text-base">
                            Nama
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-gotham font-bold text-blueblack text-base">
                            Alamat
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-gotham font-bold text-blueblack text-base">
                            Kontak
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-gotham font-bold text-blueblack text-base">
                            Link Google Maps
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-gotham font-bold text-blueblack text-base">
                            Gambar
                        </th>
                        <th scope="col" class="">
                            <button v-on:click="toggleModalCreateHospital()"
                                class="bg-orange px-4 py-1 rounded-md text-left  font-semibold text-white text-base">Tambah</button>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="data in InfoRS" :key="data.id" class=" divide-y divide-gray-200">
                    <tr>
                        <td class="px-3 py-4 whitespace-nowrap font-normal text-sulfurblack text-base">
                            {{ data.no }}
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">{{ data.nama_rs }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class=" font-normal text-sulfurblack text-base ">{{ data.lokasi_rs }}</p>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">{{ data.info_kontak }}</p>
                        </td>

                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <a :href="data.link_maps" target="_blank" class="hover:text-warmgray font-normal text-sulfurblack text-base ">{{ data.link_maps }}</a>
                        </td>

                        <td class="px-3 py-4 whitespace-nowrap min-w-[200px] max-w-[201px]">
                            <img class="bg-hospital bg-cover bg-center w-[160px] h-[160px]" :src="url + data.image_url">
                        </td>

                        <td class="px-3 py-4 flex flex-col gap-2 justify-center items-center whitespace-nowrap text-sm font-medium">
                            <a :href="'editpengurus/' + data.id">
                                <button
                                    class="py-1 px-8 rounded-[5px] w-[110px] bg-white font-bold text-base text-orange shadow-s">Edit</button>
                            </a>
                            <a href=""><button href="#" @click="deletepengurus(data.id)"
                                    class="py-1 px-8 rounded-[5px] w-[110px] shadow-s bg-white bg-opacity-64 text-orange font-bold text-base ">Hapus</button></a>
                        </td>
                    </tr>

                </tbody>
            </table>
            <!-- Modal Create Rumah Sakit -->
            <div>
                <form v-if="showcreatehospital" @submit.prevent="createhospital()"
                    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                    <div class="relative w-auto my-6 mx-auto max-w-6xl">
                        <!--content-->
                        <div
                            class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <!--header-->
                            <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                <h3 class="text-[40px] text-orange font-semibold font-poppins">
                                    Data RSUD Bandung
                                </h3>
                                <button
                                    class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    v-on:click="toggleModalCreateHospital()">
                                    <span
                                        class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    </span>
                                </button>
                            </div>
                            <!--body-->
                            <div class="flex flex-col gap-8 relative p-6">
                                <div class="flex gap-2 flex-col">
                                    <label for="nama lengkap"
                                        class="font-poppins font-bold text-base text-orange">Nama</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="nama lengkap" id="" v-model="form.nama_rs" placeholder="Nama Rumah Sakit">
                                </div>
                                <div class="flex gap-2 flex-col">
                                    <label for="alamat" class="font-poppins font-bold text-base text-orange">Alamat</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="alamat" id="" v-model="form.lokasi_rs" placeholder="Contoh format: Jatiwaringin, Kota Bekasi">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Kontak" class="font-poppins font-bold text-base text-orange">Kontak</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="Kontak" id="" v-model="form.info_kontak"
                                        placeholder="Nomor Telepon Rumah Sakit">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Google Maps" class="font-poppins font-bold text-base text-orange">Link
                                        Google Maps</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="Google Maps" id="" v-model="form.link_maps"
                                        placeholder="Link/URL Google Maps">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Latlong" class="font-poppins font-bold text-base text-orange">Latitude
                                        Longitude</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="Google Maps" id="" v-model="form.latlong"
                                        placeholder="Latitude Longitude Google Maps">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Foto Profil" class="font-poppins font-bold text-base text-orange">Gambar
                                        Lengkap</label>
                                    <input @change="handleFileChange"
                                        class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file"
                                        name="Foto Profil" id="">
                                </div>


                            </div>
                            <!--footer-->
                            <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                <button
                                    class="text-white bg-orange border hover:text-white active:bg-orange-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                    type="submit">
                                    Simpan
                                </button>
                                <button
                                    class="text-orange bg-white border active:bg-orange-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                    type="button" v-on:click="toggleModalCreateHospital()">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div v-if="showcreatehospital" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </div>
        </div>
    </div>
</template>