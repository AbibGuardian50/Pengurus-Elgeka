<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        await this.fetchDoctorData();
        try {
            const toast = useToast();
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/infoRS');
            if (response.data.message === "Get Info RS Successfully") {
                toast.success('Data Rumah Sakit Berhasil Dimuat');
            }
            this.InfoRS = response.data.result.data;
            this.InfoRS.sort((x, y) => x.id - y.id);
            this.InfoRS.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoRS.length / this.perPage);
            this.updatePaginatedData();
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            specializations: [],
            editHospitalId: null,
            InfoRS: [],
            showcreatehospital: false,
            showedithospital: false,
            url: 'https://elgeka-web-api-production.up.railway.app/',
            form: {
                image: '',
                nama_rs: '',
                lokasi_rs: '',
                link_maps: '',
                latlong: '',
                info_kontak: '',
                data_dokter: [{ name: '' }] // New field for data_dokter
            },
            formErrors: {
                image: '',
            },
            errorMessage: '',
            perPage: 5,
            currentPage: 1,
            totalPages: 0,
            paginatedInfoRS: [],
            sortColumn: 'no',
            sortDirection: 'asc',
            DoctorData: [],
            isLoading: false,
        };
    },
    methods: {
        async fetchDoctorData() {
            try {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const response = await axios.get('https://elgeka-mobile-production.up.railway.app/api/doctor/list/website', { headers: { 'Authorization': `Bearer ${tokenlogin}` } });
                if (response.data.Message === 'Success to Get Doctor List') {
                    this.DoctorData = response.data.Data;
                    console.log(this.DoctorData);
                } else {
                    console.error('Failed to fetch Doctor Data');
                }
            } catch (error) {
                console.error('Error fetching Doctor Data:', error);
            }
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedInfoRS = this.InfoRS.slice(startIndex, endIndex);
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.updatePaginatedData();
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updatePaginatedData();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePaginatedData();
            }
        },
        createhospital() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/infoRS';
            const formData = new FormData();
            formData.append('image', this.form.image);
            formData.append('nama_rs', this.form.nama_rs);
            formData.append('lokasi_rs', this.form.lokasi_rs);
            formData.append('link_maps', this.form.link_maps);
            formData.append('latlong', this.form.latlong);
            formData.append('info_kontak', this.form.info_kontak);
            // Format data_dokter into the desired string format
            const formattedDoctors = this.form.data_dokter.map(doctor => {
                return `${doctor.name}`;
            }).join(';  ');

            formData.append('data_dokter', formattedDoctors);
            axios.post(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Create Info RS Successfully") {
                        toast.success('Data Rumah Sakit Baru Berhasil Ditambahkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else if (response.data.message === 'Error Creating Info RS: Rumah Sakit already exists') {
                        toast.error('Nama Rumah Sakit yang sama sudah ada, mohon untuk mengganti dengan nama yang lain');
                    }
                })
                .catch(error => {
                    const toast = useToast();
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error);
                });
        },
        deletehospital(id) {
            if (confirm('Apakah kamu yakin untuk menghapus data rumah sakit ini?')) {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/infoRS/${id}`;
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data);
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        edithospital() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const formData = new FormData();
            formData.append('nama_rs', this.form.nama_rs);
            formData.append('lokasi_rs', this.form.lokasi_rs);
            formData.append('image', this.form.image);
            formData.append('link_maps', this.form.link_maps);
            formData.append('latlong', this.form.latlong);
            formData.append('info_kontak', this.form.info_kontak);
            const formattedDoctors = this.form.data_dokter.map(doctor => {
                return `${doctor.name}`;
            }).join(';  ');
            formData.append('data_dokter', formattedDoctors);
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/infoRS/${this.editHospitalId}`
            axios.patch(url, formData, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data)
                    this.resulterror = response.data
                    if (response.data.code === 200) {
                        toast.success('Edit data rumah sakit berhasil');
                        window.location.reload();
                    } else if (response.data.message === 'Error Update Info RS by ID: Rumah Sakit already exists') {
                        toast.error('Nama Rumah Sakit yang sama sudah ada, mohon untuk mengganti dengan nama yang lain')
                    } else {
                        toast.error('terdapat kesalahan, mohon coba lagi')
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
            const selectedFile = event.target.files[0];
            this.form.image = selectedFile;
            const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
            if (!allowedExtensions.exec(selectedFile.name)) {
                const toast = useToast();
                this.errorMessage = 'Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!';
                toast.warning('Hanya gambar dengan format PNG, JPEG, atau JPG yang diizinkan!');
                event.target.value = '';
            } else if (selectedFile.size > 1024 * 1024) {
                this.errorMessage = 'Ukuran gambar tidak boleh lebih dari 1MB!';
                event.target.value = '';
            } else {
                this.errorMessage = '';
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
        },
        toggleModalCreateHospital() {
            this.showcreatehospital = !this.showcreatehospital;
        },
        toggleModalEditHospital(hospital) {
            this.showedithospital = !this.showedithospital;
            if (hospital) {
                this.editHospitalId = hospital.id;
                this.form = {
                    nama_rs: hospital.nama_rs,
                    image: hospital.image,
                    lokasi_rs: hospital.lokasi_rs,
                    link_maps: hospital.link_maps,
                    latlong: hospital.latlong,
                    info_kontak: hospital.info_kontak,
                    data_dokter: hospital.data_dokter.split(';  ').map(doctorName => {
                        return { name: doctorName }; // Ensure this matches expected format
                    })
                };
            } else {
                // Reset form data when closing modal without a medicine object
                this.form = {
                    image: '',
                    nama_rs: '',
                    lokasi_rs: '',
                    link_maps: '',
                    latlong: '',
                    info_kontak: '',
                    data_dokter: [{ name: '' }] // New field for data_dokter
                };
            }
        },
        addDoctor() {
            this.form.data_dokter.push({ name: '' });
        },
        removeDoctor(index) {
            if (this.form.data_dokter.length > 1) {
                this.form.data_dokter.splice(index, 1);
            }
        },
        getFullDoctorName(doctor) {
            return `${doctor.name}`;
        },
        sortNoColumn() {
            if (this.sortOrder === 'asc') {
                this.InfoRS.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.InfoRS.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },
    },


}

</script>

<template >
    <div class="flex min-h-screen">
        <Sidebar />

        <div class="pl-8 max-sm:pl-2 pt-4 w-full bg-offwhite">
            <div class="heading-div-general">
                <p class="title-heading-general">Data Rumah Sakit</p>
            </div>

            <div class="container-table-general bg-offwhite">
                <table class="table-general">
                    <thead class="">
                        <tr class="border-b-[0.5px] border-b-lightgray">
                            <th scope="col"
                                class="px-3 py-3 max-[1300px]:pb-0 max-[1200px]:pl-0 max-w-[50px] flex items-center gap-1 text-left font-bold font-poppins text-black text-base cursor-pointer"
                                @click="sortNoColumn">
                                No
                                <span v-if="sortOrder === 'asc'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M12 19V6M5 12l7-7 7 7" />
                                    </svg>
                                </span>
                                <span v-else>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M12 5v13M5 12l7 7 7-7" />
                                    </svg>
                                </span>
                            </th>
                            <th scope="col" class="th-general">
                                Nama
                            </th>
                            <th scope="col" class="th-general">
                                Alamat
                            </th>
                            <th scope="col" class="th-general">
                                Kontak
                            </th>
                            <th scope="col" class="th-general">
                                Data Dokter
                            </th>
                            <th scope="col" class="th-general">
                                Link Google Maps
                            </th>
                            <th scope="col" class="th-general">
                                Gambar
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateHospital()"
                                    class="bg-teal px-4 py-1 rounded-md text-left  font-semibold text-white text-base">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="hospital in paginatedInfoRS" :key="hospital.id" class=" divide-y divide-gray-200">
                        <tr>
                            <td class="td-general">
                                {{ hospital.no }}
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ hospital.nama_rs }}</p>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ hospital.lokasi_rs }}</p>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ hospital.info_kontak }}</p>
                            </td>
                            <td class="td-general">
                                <p v-if="hospital.data_dokter" class="td-text-general line-clamp-4">{{ hospital.data_dokter }}</p>
                                <p v-else-if="hospital.data_dokter === null" class="td-text-general">Belum ada data dokter
                                </p>
                            </td>
                            <td
                                class="px-3 py-4 min-w-[200px] whitespace-normal break-words max-w-[201px] text-wrap underline underline-offset-1">
                                <a :href="hospital.link_maps" target="_blank" class="td-text-general hover:text-teal">{{
                                    hospital.link_maps }}</a>
                            </td>

                            <td class="td-general">
                                <img class="bg-hospital bg-cover bg-center w-full h-full object-cover"
                                    :src="url + hospital.image_url">
                            </td>

                            <td
                                class="px-3 max-[1075px]:px-2 py-4 flex flex-col gap-2 justify-center items-center whitespace-nowrap text-sm font-medium">
                                <a>
                                    <button @click="toggleModalEditHospital(hospital)"
                                        class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] bg-white font-bold text-base text-teal shadow-s">Edit</button>
                                </a>
                                <button href="#" @click="deletehospital(hospital.id)"
                                    class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] shadow-s bg-white bg-opacity-64 text-teal font-bold text-base ">Hapus</button>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>


            <!-- Pagination navigation -->
            <div class="ml-8 my-8 flex justify-center">
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
                    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center max-[600px]:justify-start max-[600px]:items-start flex">
                    <div class="relative w-auto my-6 max-[600px]:my-0 mx-auto max-w-6xl">
                        <!--content-->
                        <div
                            class="border border-red rounded-lg shadow-lg relative flex flex-col w-full max-[600px]:w-[85%] bg-white outline-none focus:outline-none">
                            <!--header-->
                            <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                <h3 class="text-[40px] text-teal font-semibold font-poppins">
                                    Data Rumah Sakit
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
                                    <input class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="nama lengkap" id="" v-model="form.nama_rs"
                                        placeholder="Nama Rumah Sakit">
                                </div>
                                <div class="flex gap-2 flex-col">
                                    <label for="alamat" class="font-poppins font-bold text-base text-teal">Alamat</label>
                                    <input class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="alamat" id="" v-model="form.lokasi_rs"
                                        placeholder="Contoh format: Jatiwaringin, Kota Bekasi">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Kontak" class="font-poppins font-bold text-base text-teal">Kontak</label>
                                    <input class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="Kontak" id="" v-model="form.info_kontak"
                                        placeholder="Nomor Telepon Rumah Sakit">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Nama Dokter" class="font-poppins font-bold text-base text-teal">Nama
                                        Dokter</label>
                                    <div v-for="(doctor, index) in form.data_dokter" :key="index" class="flex gap-2">
                                        <select v-model="form.data_dokter[index].name"
                                            class="border border-black py-4 w-[80%] max-md:min-w-[50%] pl-2 rounded-md"
                                            required>
                                            <option value="">Pilih Dokter</option>
                                            <option v-for="doc in DoctorData" :key="doc.ID" :value="doc.Name">
                                                {{ doc.Name }}
                                            </option>
                                        </select>
                                        <button class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded"
                                            type="button" @click="removeDoctor(index)">Hapus</button>
                                    </div>
                                    <button class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded"
                                        type="button" @click="addDoctor">Tambah Dokter</button>
                                </div>

                                <div class="flex gap-2 flex-col relative">
                                    <label for="Latlong" class="font-poppins font-bold text-base text-teal">Latlong</label>
                                    <div class="relative">
                                        <input class="border border-black py-4 pl-2 pr-10 rounded-md w-full" type="text"
                                            required name="Latlong" id="" v-model="form.latlong"
                                            placeholder="Masukkan Latlong">
                                        <a target="_blank"
                                            href="https://drive.google.com/file/d/1E_CxXklR2mKt91QnyOwIK-djzOxSWeCb/view?usp=sharing"><span
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
                                            required name="Google Maps" id="" v-model="form.link_maps"
                                            placeholder="Link/URL Google Maps">
                                        <a target="_blank"
                                            href="https://drive.google.com/file/d/1i5NRONlsZcNzV13tsd6Y66O3fHr1j7on/view?usp=sharing"><span
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
                                        class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="file" required name="Foto Profil" id=""
                                        accept="image/png, image/jpg, image/jpeg" />
                                    <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}
                                    </div>
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

            <!-- Modal Edit Rumah Sakit -->
            <div v-if="showedithospital">
                <form @submit.prevent="edithospital()"
                    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center max-[600px]:justify-start max-[600px]:items-start flex">
                    <div class="relative w-auto my-6 max-[600px]:my-0 mx-auto max-w-6xl">
                        <!--content-->
                        <div
                            class="border border-red rounded-lg shadow-lg relative flex flex-col w-full max-[600px]:w-[85%] bg-white outline-none focus:outline-none">
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
                                    <input class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="nama lengkap" id="" v-model="form.nama_rs"
                                        placeholder="Nama Rumah Sakit">
                                </div>
                                <div class="flex gap-2 flex-col">
                                    <label for="alamat" class="font-poppins font-bold text-base text-teal">Alamat</label>
                                    <input class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="alamat" id="" v-model="form.lokasi_rs"
                                        placeholder="Contoh format: Jatiwaringin, Kota Bekasi">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Kontak" class="font-poppins font-bold text-base text-teal">Kontak</label>
                                    <input class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="Kontak" id="" v-model="form.info_kontak"
                                        placeholder="Nomor Telepon Rumah Sakit">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Nama Dokter" class="font-poppins font-bold text-base text-teal">Nama
                                        Dokter</label>
                                    <div v-for="(doctor, index) in form.data_dokter" :key="index" class="flex gap-2">
                                        <select v-model="form.data_dokter[index].name"
                                            class="border border-black py-4 w-[80%] max-md:min-w-[50%] pl-2 rounded-md"
                                            required>
                                            <option value="">Pilih Dokter</option>
                                            <option v-for="doc in DoctorData" :value="doc.Name">
                                                {{ doc.Name }}
                                            </option>
                                        </select>
                                        <button class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded"
                                            type="button" @click="removeDoctor(index)">Hapus</button>
                                    </div>
                                    <button class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded"
                                        type="button" @click="addDoctor">Tambah Dokter</button>
                                </div>

                                <div class="flex gap-2 flex-col relative">
                                    <label for="Google Maps"
                                        class="font-poppins font-bold text-base text-teal">Latlong</label>
                                    <div class="relative">
                                        <input class="border border-black py-4 pl-2 pr-10 rounded-md w-full" type="text"
                                            required name="Google Maps" id="" v-model="form.latlong"
                                            placeholder="Masukkan Latlong">
                                        <a target="_blank"
                                            href="https://drive.google.com/file/d/1E_CxXklR2mKt91QnyOwIK-djzOxSWeCb/view?usp=sharing"><span
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
                                            required name="Google Maps" id="" v-model="form.link_maps"
                                            placeholder="Link/URL Google Maps">
                                        <a target="_blank"
                                            href="https://drive.google.com/file/d/1i5NRONlsZcNzV13tsd6Y66O3fHr1j7on/view?usp=sharing"><span
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
                                        class="border border-black py-4 w-full max-md:min-w-full pl-2 rounded-md"
                                        type="file" name="Foto Profil" id="" accept="image/png, image/jpg, image/jpeg" />
                                    <div v-if="errorMessage" class="text-red text-sm font-bold mb-4">{{ errorMessage }}
                                    </div>
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
                                    type="button" v-on:click="toggleModalEditHospital()">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div v-if="showedithospital" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </div>


        </div>
    </div>
</template>

