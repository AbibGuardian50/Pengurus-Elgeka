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
        toggleModalEditHospital: function () {
            this.showedithospital = !this.showedithospital;
        },
        edithospital(id) {
            const toast = useToast();
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
                        toast.success('Edit data rumah sakit berhasil');
                        this.$router.push('/datarumahsakit')
                    } else if (response.data.code === 400) {
                        setTimeout(() => {
                            toast.error('Edit data rumah sakit gagal!');
                            this.$router.push('/datarumahsakit');
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
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];
            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.DataHospital.image = selectedFile;

            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

            if (!allowedTypes.includes(selectedFile.type)) {
                // Tampilkan pesan kesalahan kepada pengguna
                alert('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // Atau, Anda dapat mengatur pesan kesalahan pada variabel data untuk ditampilkan dalam template
                // this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                // Bersihkan nilai input file
                event.target.value = '';
            }
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
            class="fixed inset-0 flex justify-center max-md:justify-start items-center max-md:items-start overflow-y-auto overflow-x-hidden">
            <div class="relative w-full max-w-6xl mx-auto my-6 max-md:my-0 flex flex-col">
                <!--content-->
                <div
                    class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--header-->
                    <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                        <h3 class="text-2xl md:text-3xl lg:text-[40px] text-teal font-semibold font-poppins">
                            Data RSUD Bandung
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
                        <div class="flex flex-col gap-2">
                            <label for="Nama RS" class="font-poppins font-bold text-base text-teal">Nama</label>
                            <input
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                type="text" required v-model="DataHospital.nama_rs" name="Nama RS" id="">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Alamat" class="font-poppins font-bold text-base text-teal">Alamat</label>
                            <input
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                type="text" required name="Alamat" v-model="DataHospital.lokasi_rs" id="">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Kontak" class="font-poppins font-bold text-base text-teal">Kontak</label>
                            <input
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                type="text" required name="Kontak" v-model="DataHospital.info_kontak" id="">
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Google Maps" class="font-poppins font-bold text-base text-teal">Link Google
                                Maps</label>
                            <div class="relative">
                                <input class="border border-black py-2 md:py-3 lg:py-4 pl-2 pr-10 rounded-md w-full"
                                    type="text" required name="Google Maps" id="" v-model="DataHospital.link_maps"
                                    placeholder="Link/URL Google Maps">
                                <a target="_blank" href="https://imgur.com/gallery/jwZQDHN">
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_1706_972)">
                                                <path
                                                    d="M6.06016 6.00004C6.2169 5.55449 6.52626 5.17878 6.93347 4.93946C7.34067 4.70015 7.81943 4.61267 8.28495 4.69252C8.75047 4.77236 9.17271 5.01439 9.47688 5.37573C9.78106 5.73706 9.94753 6.19439 9.94683 6.66671C9.94683 8.00004 7.94683 8.66671 7.94683 8.66671M8.00016 11.3334H8.00683M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                                    stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </g>
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Latlong" class="font-poppins font-bold text-base text-teal">Latlong</label>
                            <div class="relative">
                                <input class="border border-black py-2 md:py-3 lg:py-4 pl-2 pr-10 rounded-md w-full"
                                    type="text" required name="Latlong" id="" v-model="DataHospital.latlong"
                                    placeholder="Latlong Coordinates">
                                <a target="_blank" href="https://imgur.com/gallery/LaDTHRq">
                                    <span class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_1706_972)">
                                                <path
                                                    d="M6.06016 6.00004C6.2169 5.55449 6.52626 5.17878 6.93347 4.93946C7.34067 4.70015 7.81943 4.61267 8.28495 4.69252C8.75047 4.77236 9.17271 5.01439 9.47688 5.37573C9.78106 5.73706 9.94753 6.19439 9.94683 6.66671C9.94683 8.00004 7.94683 8.66671 7.94683 8.66671M8.00016 11.3334H8.00683M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                                    stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </g>
                                        </svg>
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="Gambar" class="font-poppins font-bold text-base text-teal">Gambar</label>
                            <input @change="handleFileChange" accept="image/png, image/jpeg, image/jpg"
                                class="border border-black py-2 md:py-3 lg:py-4 w-full min-w-[250px] md:min-w-[400px] lg:min-w-[550px] pl-2 rounded-md"
                                type="file" name="Gambar RS" id="">
                        </div>
                    </div>

                    <!--footer-->
                    <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                        <button
                            class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 md:px-10 md:py-4 lg:px-12 lg:py-4 rounded outline-none focus:outline-none mr-1 mb-1"
                            type="submit">
                            Simpan
                        </button>
                        <router-link to="/datarumahsakit">
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
</div></template>
