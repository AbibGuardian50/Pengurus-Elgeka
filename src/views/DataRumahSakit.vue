<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const toast = useToast();
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/infoRS');
            if (response.data.message === "Get Info RS Successfully") {
                toast.success('Data Rumah Sakit Berhasil Dimuat');
            }
            this.InfoRS = response.data.result.data;
            this.InfoRS.sort((x, y) => x.id - y.id)
            this.InfoRS.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoRS.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
            console.log(response)
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
            formErrors: {
                image: '',
            },
            errorMessage: '',
            showcreatehospital: false,
            perPage: 5, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedInfoRS: [], // Paginated data
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc' // Sort direction
        }
    },
    methods: {
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedInfoRS = this.InfoRS.slice(startIndex, endIndex);
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber; // Set current page to the selected page number
            this.updatePaginatedData(); // Update paginated data for the selected page
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updatePaginatedData(); // Update paginated data when navigating to next page
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePaginatedData(); // Update paginated data when navigating to previous page
            }
        },
        createhospital() {
            const toast = useToast();
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
                    console.log(response);
                    if (response.data.message === "Create Info RS Successfully") {
                        toast.success('Data Rumah Sakit Baru Berhasil Ditambahkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch(error => {
                    const toast = useToast();
                    toast.errpr('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error)
                })
        },
        deletehospital(id) {
            if (confirm('Apakah kamu yakin untuk menghapus data rumah sakit ini?')) {
                const tokenlogin = VueCookies.get('TokenAuthorization')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/infoRS/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data);
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        },
        toggleModalCreateHospital: function () {
            this.showcreatehospital = !this.showcreatehospital;
        },
        handleFileChange(event) {
            // Mengambil file yang dipilih oleh pengguna
            const selectedFile = event.target.files[0];
            // Mengatur file yang dipilih ke dalam variabel edited.image
            this.form.image = selectedFile;
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            if (!allowedExtensions.exec(selectedFile.name)) {
                const toast = useToast();
                this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                toast.warning('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // alert('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                // Atau, Anda dapat mengatur pesan kesalahan pada variabel data untuk ditampilkan dalam template
                // this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                // Bersihkan nilai input file
                event.target.value = '';
            } else if (selectedFile.size > 1024 * 1024) { // 1024 KB * 1024 = 1MB
                this.errorMessage = 'Ukuran gambar tidak boleh lebih dari 1MB!';
                // Bersihkan nilai input file
                event.target.value = '';
            } else {
                // Lakukan proses upload file
                // this.uploadFile(file);
                this.errorMessage = ''; // Bersihkan pesan error jika file valid
            }
        },
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            this.InfoRS.sort((a, b) => {
                let compareA, compareB;
                if (column === 'no') {
                    compareA = a.no;
                    compareB = b.no;
                } else if (column === 'Date') {
                    compareA = new Date(a.Date);
                    compareB = new Date(b.Date);
                }
                if (this.sortDirection === 'asc') {
                    return compareA > compareB ? 1 : -1;
                } else {
                    return compareA < compareB ? 1 : -1;
                }
            });
            this.updatePaginatedData();
        }
    }
}
</script>

<template >
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="bg-offwhite">
            <div class="ml-4 flex items-center justify-between border-b border-lightgray bg-offwhite">
                <p class=" font-bold text-[30px]  mt-4 py-4 leading-6 text-blueblack">Data Rumah Sakit</p>
            </div>

            <p class="ml-4 font-normal text-[20px] leading-7 text-blueblack mt-4 mb-8">Data Rumah Sakit</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px] bg-offwhite">
                <thead class="bg-offwhite">
                    <tr class="border-b-[0.5px] border-b-lightgray">
                        <th @click="sortData('no')" scope="col"
                            class="cursor-pointer flex items-center gap-1 px-3 py-3 max-w-[50px] text-left font-bold font-poppins text-black text-base">
                            No
                            <span v-if="sortColumn === 'no'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                            <span v-else>
                                <svg fill="none" height="16" viewBox="0 0 512 512" width="16"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M476.843 57.6L326.333 274.77L326.182 274.99C320.698 282.603 317.745 291.747 317.743 301.13V407.39C317.746 410.792 316.882 414.138 315.232 417.113C313.582 420.088 311.201 422.592 308.313 424.39L212.483 484C204.823 488.77 193.723 487.19 193.773 478.17V301.13C193.77 291.747 190.818 282.603 185.333 274.99L185.183 274.77L34.6825 57.6C32.5751 54.5817 31.3216 51.0505 31.0541 47.379C30.7866 43.7075 31.5149 40.0319 33.1625 36.74C34.7471 33.5274 37.1963 30.8204 40.2348 28.9231C43.2732 27.0259 46.7806 26.0136 50.3627 26H127.593C129.846 26.0026 132.007 26.899 133.6 28.4925C135.193 30.086 136.09 32.2465 136.093 34.5V46C136.093 51.3043 138.2 56.3914 141.951 60.1421C145.701 63.8929 150.788 66 156.093 66H355.093C360.397 66 365.484 63.8929 369.235 60.1421C372.985 56.3914 375.093 51.3043 375.093 46V34.5C375.093 32.2457 375.988 30.0837 377.582 28.4896C379.176 26.8955 381.338 26 383.593 26L461.162 26C464.744 26.0147 468.251 27.0275 471.289 28.9246C474.328 30.8218 476.777 33.5281 478.363 36.74C480.008 40.0325 480.736 43.7077 480.468 47.3788C480.201 51.0498 478.948 54.5808 476.843 57.6V57.6Z"
                                        fill="black" />
                                </svg>
                            </span>
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-poppins font-bold text-blueblack text-base">
                            Nama
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-poppins font-bold text-blueblack text-base">
                            Alamat
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-poppins font-bold text-blueblack text-base">
                            Kontak
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-poppins font-bold text-blueblack text-base">
                            Link Google Maps
                        </th>
                        <th scope="col" class="px-3 py-3 text-left font-poppins font-bold text-blueblack text-base">
                            Gambar
                        </th>
                        <th scope="col" class="">
                            <button v-on:click="toggleModalCreateHospital()"
                                class="bg-teal px-4 py-1 rounded-md text-left  font-semibold text-white text-base">Tambah</button>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="data in paginatedInfoRS" :key="data.id" class=" divide-y divide-gray-200">
                    <tr>
                        <td class="px-3 py-4 whitespace-nowrap font-normal font-poppins text-sulfurblack text-base">
                            {{ data.no }}
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap">
                            <p class=" font-normal font-poppins text-sulfurblack text-base ">{{ data.nama_rs }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class=" font-normal font-poppins text-sulfurblack text-base ">{{ data.lokasi_rs }}</p>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap">
                            <p class=" font-normal font-poppins text-sulfurblack text-base ">{{ data.info_kontak }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] whitespace-normal break-words max-w-[201px] text-wrap">
                            <a :href="data.link_maps" target="_blank"
                                class="hover:text-warmgray font-normal font-poppins text-wrap text-sulfurblack text-base ">{{
                                    data.link_maps }}</a>
                        </td>

                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <img class="bg-hospital bg-cover bg-center w-[160px] h-[160px]" :src="url + data.image_url">
                        </td>

                        <td
                            class="px-3 py-4 flex flex-col gap-2 justify-center items-center whitespace-nowrap text-sm font-medium">
                            <a :href="'editdatarumahsakit/' + data.id">
                                <button
                                    class="py-1 px-8 rounded-[5px] w-[110px] bg-white font-bold text-base text-teal shadow-s">Edit</button>
                            </a>
                            <button href="#" @click="deletehospital(data.id)"
                                class="py-1 px-8 rounded-[5px] w-[110px] shadow-s bg-white bg-opacity-64 text-teal font-bold text-base ">Hapus</button>
                        </td>
                    </tr>

                </tbody>
            </table>

            <!-- Pagination navigation -->
            <div class="ml-8 mt-4 flex justify-center">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 mr-2 bg-teal  text-white rounded-md">Previous</button>
                <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                    :class="{ 'bg-teal  text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                    class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-teal  text-white rounded-md">Next</button>
            </div>

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
                                <h3 class="text-[40px] text-teal font-semibold font-poppins">
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
                                        class="font-poppins font-bold text-base text-teal">Nama</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        required name="nama lengkap" id="" v-model="form.nama_rs"
                                        placeholder="Nama Rumah Sakit">
                                </div>
                                <div class="flex gap-2 flex-col">
                                    <label for="alamat" class="font-poppins font-bold text-base text-teal">Alamat</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        required name="alamat" id="" v-model="form.lokasi_rs"
                                        placeholder="Contoh format: Jatiwaringin, Kota Bekasi">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Kontak" class="font-poppins font-bold text-base text-teal">Kontak</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        required name="Kontak" id="" v-model="form.info_kontak"
                                        placeholder="Nomor Telepon Rumah Sakit">
                                </div>

                                <div class="flex gap-2 flex-col relative">
                                    <label for="Google Maps"
                                        class="font-poppins font-bold text-base text-teal">Latlong</label>
                                    <div class="relative">
                                        <input class="border border-black py-4 pl-2 pr-10 rounded-md w-full" type="text"
                                            required name="Google Maps" id="" v-model="form.link_maps"
                                            placeholder="Link/URL Google Maps">
                                        <a target="_blank" href="https://imgur.com/gallery/jwZQDHN"><span
                                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_1706_972)">
                                                        <path
                                                            d="M6.06016 6.00004C6.2169 5.55449 6.52626 5.17878 6.93347 4.93946C7.34067 4.70015 7.81943 4.61267 8.28495 4.69252C8.75047 4.77236 9.17271 5.01439 9.47688 5.37573C9.78106 5.73706 9.94753 6.19439 9.94683 6.66671C9.94683 8.00004 7.94683 8.66671 7.94683 8.66671M8.00016 11.3334H8.00683M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                                            stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round"
                                                            stroke-linejoin="round" />
                                                    </g>
                                                </svg>
                                            </span></a>
                                    </div>
                                </div>


                                <div class="flex gap-2 flex-col relative">
                                    <label for="Google Maps" class="font-poppins font-bold text-base text-teal">Link Google
                                        Maps</label>
                                    <div class="relative">
                                        <input class="border border-black py-4 pl-2 pr-10 rounded-md w-full" type="text"
                                            required name="Google Maps" id="" v-model="form.latlong"
                                            placeholder="Link/URL Google Maps">
                                        <a target="_blank" href="https://imgur.com/gallery/LaDTHRq"><span
                                                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_1706_972)">
                                                        <path
                                                            d="M6.06016 6.00004C6.2169 5.55449 6.52626 5.17878 6.93347 4.93946C7.34067 4.70015 7.81943 4.61267 8.28495 4.69252C8.75047 4.77236 9.17271 5.01439 9.47688 5.37573C9.78106 5.73706 9.94753 6.19439 9.94683 6.66671C9.94683 8.00004 7.94683 8.66671 7.94683 8.66671M8.00016 11.3334H8.00683M14.6668 8.00004C14.6668 11.6819 11.6821 14.6667 8.00016 14.6667C4.31826 14.6667 1.3335 11.6819 1.3335 8.00004C1.3335 4.31814 4.31826 1.33337 8.00016 1.33337C11.6821 1.33337 14.6668 4.31814 14.6668 8.00004Z"
                                                            stroke="#98A2B3" stroke-width="1.33333" stroke-linecap="round"
                                                            stroke-linejoin="round" />
                                                    </g>
                                                </svg>
                                            </span></a>
                                    </div>
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Foto Profil" class="font-poppins font-bold text-base text-teal">Gambar
                                        Lengkap</label>
                                    <input @change="handleFileChange"
                                        class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="file" required
                                        name="Foto Profil" id="">
                                        <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}</div>
                                </div>


                            </div>
                            <!--footer-->
                            <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                <button
                                    class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                    type="submit">
                                    Simpan
                                </button>
                                <button
                                    class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
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