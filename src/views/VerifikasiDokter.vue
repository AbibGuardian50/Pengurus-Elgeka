<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const toast = useToast()
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list_inactive';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (!response.data.Data || response.data.Data.length === 0) {
                toast.error('Data Dokter Kosong');
            } else {
                this.InfoDoctor = response.data.Data;
                this.InfoDoctor.sort((x, y) => x.id - y.id)
                this.InfoDoctor.forEach((item, index) => {
                    item.no = index + 1;
                });
                this.totalPages = Math.ceil(this.InfoDoctor.length / this.perPage); // Calculate total pages
                this.updatePaginatedData(); // Update paginated data
            }
        } catch (error) {
            const toast = useToast()
            if (error.response.data.ErrorMessage === "Data Empty") {
                toast.warning('Sedang tidak ada dokter yang bisa diverifikasi')
            }
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            InfoDoctor: [],
            perPage: 10, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedInfoDoctor: [], // Paginated data
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc' // Sort direction

        }
    },
    methods: {
        editstatusdoctor(id) {
            const toast = useToast();
            if (confirm('Apakah kamu yakin untuk mengaktifkan status dokter ini menjadi verified?')) {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                axios.defaults.withCredentials = true;
                const url = `https://elgeka-mobile-production.up.railway.app/api/doctor/activate_account/${id}`;
                axios.post(
                    url,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${tokenlogin}`
                        }
                    }
                )
                    .then(response => {
                        console.log(response);
                        if (response.data.Message === "Doctor Activated Successfully") {
                            toast.success('Dokter berhasil diverifikasi');
                            window.location.reload();
                        }
                        
                    })
                    .catch(error => {
                        toast.error('Dokter gagal diverifikasi, mohon coba lagi');
                        console.error(error);
                    });
            }
        },
        formatDate(dateString) {
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: idLocale });
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedInfoDoctor = this.InfoDoctor.slice(startIndex, endIndex);
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
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            this.InfoDoctor.sort((a, b) => {
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

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div>
            <!-- Your content -->
            <div class="ml-8 flex items-center justify-between border-b border-lightgray">
                <p class="font-bold font-gotham text-[30px] mt-4 py-4 leading-6 text-blueblack">Verifikasi Dokter</p>
            </div>

            <p class="ml-8 font-light font-gotham text-[20px] leading-7 text-blueblack mt-4">Biodata Dokter</p>

            <table class="ml-8 min-w-full overflow-x-auto w-[1200px]">
                <thead class="border-b border-teal">
                    <tr>
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
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Nama
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Gender
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Nomor HP
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Email
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Poli
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Nama Rumah Sakit
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Status
                        </th>

                    </tr>
                </thead>
                <tbody v-if="InfoDoctor">
                    <tr v-for="(data, index) in paginatedInfoDoctor" :key="index" class="divide-y divide-gray-200">
                        <td
                            class="px-3 py-4 whitespace-nowrap font-gotham min-w-[50px] max-w-[51px] font-light leading-4 text-black text-base">
                            {{ data.no }}
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[251px]">
                            <div class="flex items-center">
                                <div>
                                    <div class="font-gotham font-light leading-4 text-black text-base">
                                        {{ data.Name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p v-if="data.Gender === 'female'"
                                class="font-gotham font-light leading-4 text-black text-base">Perempuan</p>
                            <p v-else-if="data.Gender === 'male'"
                                class="font-gotham font-light leading-4 text-black text-base">Laki-Laki</p>
                            <p v-else-if="!data.Gender" class="font-gotham font-light leading-4 text-black text-base">Tidak
                                Diketahui</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p v-if="data.PhoneNumber" class="font-gotham font-light leading-4 text-black text-base">{{
                                data.PhoneNumber }}</p>
                            <p v-else-if="!data.PhoneNumber" class="font-gotham font-light leading-4 text-black text-base">
                                Tidak Diketahui</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[221px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ data.Email }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ data.PolyName }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ data.HospitalName }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <div>
                                <p class="bg-teal pl-2 py-2 rounded-lg text-white font-gotham">
                                    Not Verified
                                </p>
                            </div>
                        </td>
                        <td class="px-3 py-4 whitespace-nowrap  text-sm font-medium">
                            <a @click="editstatusdoctor(data.ID)">
                                <button
                                    class="py-1 px-8 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Edit</button>
                            </a>
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
        </div>
    </div>
</template>
