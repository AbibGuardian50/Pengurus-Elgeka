<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');

            const statusAkun = VueCookies.get('status_akun'); // Mendapatkan status akun dari cookies
            this.statusAkunAktif = statusAkun === 'true'; // Simpan status akun sebagai boolean

            const activeDoctorsUrl = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list/website';
            const inactiveDoctorsUrl = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list/deactive/website';
            // Fetch active doctors
            const activeResponse = await axios.get(activeDoctorsUrl, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });

            // Fetch inactive doctors
            const inactiveResponse = await axios.get(inactiveDoctorsUrl, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });

            if (activeResponse.data.Message === "Success to Get Doctor List" &&
                inactiveResponse.data.Message === "Success to Get Deactive Doctor List") {
                toast.success('Data Dokter Berhasil Dimuat');
            }

            // Combine active and inactive doctors
            const combinedDoctors = [
                ...activeResponse.data.Data.map(doctor => ({ ...doctor, status: 'aktif' })),
                ...inactiveResponse.data.Data.map(doctor => ({ ...doctor, status: 'nonaktif' }))
            ];


            this.originalInfoPatient = combinedDoctors; // Save original data
            this.InfoPatient = [...this.originalInfoPatient];
            this.InfoPatient.sort((x, y) => x.id - y.id);
            this.InfoPatient.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoPatient.length / this.perPage);
            this.updatePaginatedData();
            this.getHospitalNames();
        } catch (error) {
            const toast = useToast();
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali');
            }
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            originalInfoPatient: [], // Store the original data
            InfoPatient: [],
            perPage: 10,
            currentPage: 1,
            totalPages: 0,
            paginatedInfoPatient: [],
            hospitalNames: [], // To store unique hospital names
            selectedHospital: '', // Selected hospital for sorting
            isConfirmationModalOpen: false,
            doctorIdToDeactivate: null,
            searchQuery: '',
            statusAkunAktif: false, // Default nilai dari status akun
            sortOrder: 'asc' // Default sort order
        }
    },
    methods: {
        async DeactivateDoctor(id) {
            const toast = useToast();
            if (confirm('Apakah kamu yakin untuk mengubah status dokter ini menjadi nonaktif?')) {
                try {
                    const tokenlogin = VueCookies.get('TokenAuthorization');
                    console.log('Token:', tokenlogin); // Log token untuk debugging
                    if (!tokenlogin) {
                        toast.error('Token tidak ditemukan, mohon login kembali');
                        return;
                    }
                    const url = `https://elgeka-mobile-production.up.railway.app/api/doctor/deactivate/account/website/${id}`;
                    const response = await axios.post(url, null, {
                        headers: {
                            Authorization: `Bearer ${tokenlogin}`
                        }
                    });
                    console.log(response);
                    if (response.data.Message === "Success to Deactivate Doctor Account") {
                        toast.success('Dokter berhasil dinonaktifkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        toast.error('Gagal menonaktifkan dokter, coba lagi nanti');
                    }
                } catch (error) {
                    toast.error('Terdapat kesalahan, mohon coba lagi');
                    console.error(error);
                }
            }
        },
        async ActivateDoctor(id) {
            const toast = useToast();
            if (confirm('Apakah kamu yakin untuk mengubah status dokter ini menjadi Aktif?')) {
                try {
                    const tokenlogin = VueCookies.get('TokenAuthorization');
                    console.log('Token:', tokenlogin); // Log token untuk debugging
                    if (!tokenlogin) {
                        toast.error('Token tidak ditemukan, mohon login kembali');
                        return;
                    }
                    const url = `https://elgeka-mobile-production.up.railway.app/api/doctor/activate/account/website/${id}`;
                    const response = await axios.post(url, null, {
                        headers: {
                            Authorization: `Bearer ${tokenlogin}`
                        }
                    });
                    console.log(response);
                    if (response.data.Message === "Success to Activate Doctor Account") {
                        toast.success('Dokter berhasil diaktifkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        toast.error('Gagal mengaktifkan dokter, coba lagi nanti');
                    }
                } catch (error) {
                    toast.error('Terdapat kesalahan, mohon coba lagi');
                    console.error(error);
                }
            }
        },
        applyFilters() {
            // Filter berdasarkan rumah sakit
            let filteredData = this.originalInfoPatient.filter(item => {
                const hospitalList = item.HospitalName.split(',').map(name => name.trim());
                return this.selectedHospital === '' || hospitalList.includes(this.selectedHospital);
            });

            // Filter berdasarkan pencarian nama dokter
            if (this.searchQuery) {
                filteredData = filteredData.filter(patient =>
                    patient.Name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            // Update InfoPatient dengan hasil filter
            this.InfoPatient = filteredData;

            // Update nomor urut
            this.InfoPatient.forEach((item, index) => {
                item.no = index + 1;
            });

            // Update pagination
            this.totalPages = Math.ceil(this.InfoPatient.length / this.perPage);
            this.currentPage = 1;
            this.updatePaginatedData();
        },
        showInactiveToast() {
            const toast = useToast();
            toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali');
        },
        sortNoColumn() {
            if (this.sortOrder === 'asc') {
                this.InfoPatient.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.InfoPatient.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },
        formatDate(dateString) {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: idLocale });
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedInfoPatient = this.InfoPatient.slice(startIndex, endIndex);
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
        sortDataByHospital(event) {
            this.selectedHospital = event.target.value;
            this.applyFilters();  // Gunakan satu metode untuk menerapkan semua filter
        },

        updateSearch() {
            this.applyFilters();  // Panggil metode yang sama ketika pencarian diperbarui
        },

        async getHospitalNames() {
            const hospitalSet = new Set(); // Use a Set to maintain unique hospital names

            this.originalInfoPatient.forEach(item => {
                const hospitalList = item.HospitalName.split(',').map(name => name.trim());
                hospitalList.forEach(name => {
                    hospitalSet.add(name); // Add each hospital name to the Set
                });
            });

            this.hospitalNames = Array.from(hospitalSet); // Convert Set to Array
        },
    }
}
</script>


<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="ml-8 max-sm:ml-2 pt-4 w-full bg-offwhite">
            <!-- Your content -->
            <div class="heading-div-general max-[1400px]:justify-start max-[1400px]:gap-4 max-md:gap-2">
                <p class="title-heading-general">Data Umum Dokter</p>
                <a href="/dataumumdokter"
                    class="flex items-center gap-2 font-inter font-medium text-[20px] leading-5 text-blueblack"><span><svg
                            width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.5001 6.01013L5.12185 6.01013L8.56112 2.5754C8.95103 2.19931 9.1074 1.64237 8.97014 1.11866C8.83287 0.594938 8.42333 0.185938 7.89892 0.0488548C7.37451 -0.0882282 6.81685 0.0679398 6.44026 0.457335L0.440653 6.44903C0.158546 6.73005 0 7.11162 0 7.50955C0 7.90748 0.158546 8.28906 0.440653 8.57008L6.44026 14.5618C7.02675 15.1467 7.97696 15.146 8.56262 14.5603C9.14828 13.9746 9.14761 13.0256 8.56112 12.4407L5.12185 9.00598L16.5001 9.00598C17.3285 9.00598 18 8.33534 18 7.50806C18 6.68078 17.3285 6.01013 16.5001 6.01013Z"
                                fill="#1E1E1E" />
                        </svg>
                    </span> Kembali ke Grafik</a>
            </div>
            <p class="font-light font-poppins text-[20px] leading-7 text-blueblack mt-4">Biodata Dokter</p>
            <!-- Fitur Sortir -->
            <div class="my-4">
                <label for="sortHospital" class="font-bold font-poppins text-blueblack">Sortir Berdasarkan Rumah
                    Sakit:</label>
                <select id="sortHospital" @change="sortDataByHospital" class="ml-2 border border-gray-300 p-2 rounded">
                    <option value="">Pilih Rumah Sakit</option>
                    <option v-for="hospital in hospitalNames" :key="hospital" :value="hospital">{{ hospital }}</option>
                </select>
            </div>

            <div class=" my-4">
                <label for="searchDoctor" class="font-bold font-poppins text-blueblack">Cari Nama Dokter:</label>
                <input type="text" id="searchDoctor" v-model="searchQuery" @input="updateSearch"
                    class="ml-2 border border-gray-300 p-2 rounded">
            </div>


            <div class="overflow-x-auto max-w-full max-[700px]:max-w-[85%]">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr class="bg-offwhite border-b-[0.5px] border-b-lightgray">
                            <th scope="col"
                                class="px-3 py-3 max-[1300px]:pb-0 max-[1300px]:pt-6 max-[1200px]:pl-0 max-w-[50px] flex items-center gap-1 text-left font-bold font-poppins text-black text-base cursor-pointer"
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
                            <th scope="col" class="th-general max-lg:px-1">
                                Nama
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Gender
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Nomor HP
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Email
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Spesialis
                            </th>

                            <th scope="col" class="th-general max-lg:px-1">
                                Rumah Sakit
                            </th>

                            <th scope="col" class="th-general max-lg:px-1">
                                Status Dokter
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in paginatedInfoPatient" :key="data.ID"
                            class="bg-offwhite divide-y divide-gray-200">
                            <td class="td-general">
                                {{ data.no }}
                            </td>
                            <td class="td-general">
                                <div class="flex items-center">
                                    <div>
                                        <div class="td-text-general">
                                            {{ data.Name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-general">
                                <p v-if="data.Gender === 'female'" class="td-text-general">Perempuan</p>
                                <p v-else-if="data.Gender === 'male'" class="td-text-general">Laki-Laki</p>
                                <p v-else class="td-text-general">Tidak Diketahui</p>
                            </td>
                            <td class="td-general">
                                <p v-if="data.PhoneNumber" class="td-text-general">{{
                                    data.PhoneNumber }}</p>
                                <p v-else class="td-text-general">Tidak Diketahui</p>
                            </td>
                            <td class="td-general break-words">
                                <p class="td-text-general">{{ data.Email }}</p>
                            </td>

                            <td class="td-general">
                                <div class="relative">
                                    <button
                                        class="flex max-lg:gap-0 max-lg:px-0 gap-2 bg-teal items-center justify-between py-2 px-1 rounded-md cursor-default">
                                        <span class="flex gap-2">
                                            <span
                                                class="w-full focus:bg-teal px-4 focus:text-black text-white font-semibold font-poppins cursor-default">
                                                {{ data.Specialist }}
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </td>

                            <td class="td-general">
                                <p class="td-text-general">{{ data.HospitalName }}</p>
                            </td>
                            <td class="td-general">
                                <div class="relative" v-if="statusAkunAktif">
                                    <div v-if="data.status === 'aktif'" class="relative">
                                        <button @click="DeactivateDoctor(data.ID)"
                                            class="flex cursor-pointer gap-2 bg-teal text-white font-semibold font-poppins items-center justify-between py-2 px-4 rounded-md">
                                            <span>Aktif</span>
                                            <img src="../assets/arrow-down.svg" class="w-4 h-4">
                                        </button>
                                    </div>


                                    <button v-else-if="data.status === 'nonaktif'" @click="ActivateDoctor(data.ID)"
                                        class="flex cursor-pointer max-lg:gap-0 cursor-default max-lg:px-0 gap-2 bg-teal items-center justify-between py-2 px-1 rounded-md">
                                        <span class="flex gap-1 items-center">
                                            <span
                                                class="w-full focus:bg-teal px-4 focus:text-black text-white font-semibold font-poppins">
                                                Non-aktif
                                            </span>
                                            <img src="../assets/arrow-down.svg" class="w-4 h-4 mr-4">
                                        </span>
                                    </button>
                                </div>

                                <div v-else>
                                    <div v-if="data.status === 'aktif'" class="relative">
                                        <button @click="showInactiveToast()"
                                            class="flex cursor-pointer gap-2 bg-teal text-white font-semibold font-poppins items-center justify-between py-2 px-4 rounded-md">
                                            <span>Aktif</span>
                                            <img src="../assets/arrow-down.svg" class="w-4 h-4">
                                        </button>
                                    </div>


                                    <button v-else-if="data.status === 'nonaktif'"
                                        class="flex max-lg:gap-0 cursor-default max-lg:px-0 gap-2 bg-teal items-center justify-between py-2 px-1 rounded-md">
                                        <span class="flex gap-2">
                                            <span @click="showInactiveToast()"
                                                class="w-full focus:bg-teal px-4 focus:text-black text-white font-semibold font-poppins">
                                                Non-aktif
                                            </span>
                                        </span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination navigation -->
            <div class="flex justify-center mt-8">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 mr-2 bg-teal text-white font-poppins font-normal rounded-md">Previous</button>
                <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                    :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-teal rounded-md': pageNumber !== currentPage }"
                    class="px-4 py-2 mr-2 font-poppins font-normal">{{ pageNumber }}</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-teal text-white font-poppins font-normal rounded-md">Next</button>
            </div>

        </div>
    </div>
</template>