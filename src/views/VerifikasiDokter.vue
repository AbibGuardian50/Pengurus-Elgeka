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
        },
        sortNoColumn() {
            if (this.sortOrder === 'asc') {
                this.InfoDoctor.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.InfoDoctor.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },
    }
}
</script>

<template>
    <div class="flex">
        <Sidebar />

        <div class="pl-8 max-sm:pl-2 pt-4 w-full bg-offwhite">
            <!-- Your content -->
            <div class="heading-div-general">
                <p class="title-heading-general max-md:text-[25px]">Verifikasi Dokter</p>
            </div>

            <p class="font-light font-poppins text-[20px] leading-7 text-blueblack mt-4">Biodata Dokter</p>

            <div class="container-table-general bg-offwhite">
                <table class="table-general">
                    <thead class="border-b border-teal">
                        <tr>
                            <th scope="col"
                                class="px-3 py-3 max-[1300px]:pb-0 max-[1200px]:pl-0 max-md:pt-8 max-w-[50px] flex items-center gap-1 text-left font-bold font-poppins text-black text-base cursor-pointer"
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
                            <th scope="col" class="th-general max-md:px-1">
                                Nama
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Gender
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Nomor HP
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Email
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Poli
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Nama Rumah Sakit
                            </th>
                            <th scope="col" class="th-general max-md:px-1">
                                Status
                            </th>

                        </tr>
                    </thead>
                    <tbody v-if="InfoDoctor">
                        <tr v-for="(data, index) in paginatedInfoDoctor" :key="index" class="divide-y divide-gray-200">
                            <td
                                class="px-3 py-4 whitespace-nowrap font-poppins min-w-[50px] max-w-[51px] font-light leading-4 text-black text-base">
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
                                <p v-else-if="!data.Gender" class="td-text-general">Tidak
                                    Diketahui</p>
                            </td>
                            <td class="td-general">
                                <p v-if="data.PhoneNumber" class="td-text-general">{{
                                    data.PhoneNumber }}</p>
                                <p v-else-if="!data.PhoneNumber" class="td-text-general">
                                    Tidak Diketahui</p>
                            </td>
                            <td class="px-3 py-4 min-w-[200px] max-w-[221px]">
                                <p class="td-text-general">{{ data.Email }}</p>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ data.PolyName }}</p>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ data.HospitalName }}</p>
                            </td>
                            <td class="td-general">
                                <div class="py-1 px-2 gap-2 rounded-[5px] bg-teal font-poppins font-bold text-base text-white flex">
                                    <button @click="editstatusdoctor(data.ID)" class="">
                                        Not Verified
                                    </button>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M18 10L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6 10"
                                            stroke="white" stroke-width="2" stroke-linecap="round" />
                                    </svg>

                                </div>
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
        </div>
    </div>
</template>
