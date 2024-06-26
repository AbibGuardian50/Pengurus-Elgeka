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
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/list/website';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (response.data.Message === "Success to Get Patient List") {
                toast.success('Detail Data Pasien Berhasil Dimuat');
            }
            this.InfoPatient = response.data.Data;
            this.InfoPatient.sort((x, y) => x.id - y.id)
            this.InfoPatient.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoPatient.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
        } catch (error) {
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            InfoPatient: [],
            perPage: 10, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedInfoPatient: [] // Paginated data
        }
    },
    methods: {
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
            // Ubah format tanggal
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: idLocale });
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedInfoPatient = this.InfoPatient.slice(startIndex, endIndex);
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

    }
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="ml-8 max-sm:ml-2 pt-4 w-full bg-offwhite">
            <div class="heading-div-general max-[1400px]:justify-start max-[1400px]:gap-4 max-md:gap-2">
                <p class="title-heading-general">Data Umum Pasien</p>
                <a href="/dataumumpasien"
                    class="flex items-center gap-2 font-inter font-medium text-lg leading-5 text-blueblack"><span><svg
                            width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.5001 6.01013L5.12185 6.01013L8.56112 2.5754C8.95103 2.19931 9.1074 1.64237 8.97014 1.11866C8.83287 0.594938 8.42333 0.185938 7.89892 0.0488548C7.37451 -0.0882282 6.81685 0.0679398 6.44026 0.457335L0.440653 6.44903C0.158546 6.73005 0 7.11162 0 7.50955C0 7.90748 0.158546 8.28906 0.440653 8.57008L6.44026 14.5618C7.02675 15.1467 7.97696 15.146 8.56262 14.5603C9.14828 13.9746 9.14761 13.0256 8.56112 12.4407L5.12185 9.00598L16.5001 9.00598C17.3285 9.00598 18 8.33534 18 7.50806C18 6.68078 17.3285 6.01013 16.5001 6.01013Z"
                                fill="#1E1E1E" />
                        </svg>
                    </span> Kembali ke Grafik</a>
            </div>

            <p class="font-normal font-poppins text-xl leading-7 text-blueblack mt-4">Biodata Pasien</p>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-lightgray">
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
                            <th scope="col" class="th-general">
                                Nama
                            </th>
                            <th scope="col" class="th-general">
                                Alamat
                            </th>
                            <th scope="col" class="th-general">
                                Gender
                            </th>
                            <th scope="col" class="th-general">
                                Tanggal Lahir
                            </th>
                            <th scope="col" class="th-general">
                                Umur
                            </th>
                            <th scope="col" class="th-general">
                                Golongan Darah
                            </th>
                            <th scope="col" class="th-general">
                                Nomor HP
                            </th>
                            <th scope="col" class="th-general">
                                Email
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in paginatedInfoPatient" :key="index" class="divide-y divide-gray-200">
                            <td class="px-3 py-4 whitespace-nowrap td-text-general">
                                {{ data.no }}
                            </td>
                            <td class="px-3 py-4">
                                <div class="flex items-center">
                                    <div class="td-text-general">
                                        {{ data.Name }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-3 py-4">
                                <p class="td-text-general">{{ data.Address }}</p>
                            </td>
                            <td class="px-3 py-4">
                                <p v-if="data.Gender === 'female'" class="td-text-general">Perempuan</p>
                                <p v-else-if="data.Gender === 'male'" class="td-text-general">Laki-Laki</p>
                            </td>
                            <td class="px-3 py-4">
                                <p class="td-text-general">{{
                                    formatDate(data.BirthDate) }}</p>
                            </td>
                            <td class="px-3 py-4">
                                <p v-if="data.Age" class="td-text-general">{{
                                    data.Age }}</p>
                                <p v-else-if="!data.Age" class="td-text-general">
                                    Tidak diketahui</p>
                            </td>
                            <td class="px-3 py-4">
                                <p v-if="data.BloodGroup" class="td-text-general">{{
                                    data.BloodGroup }}</p>
                                <p v-else class="td-text-general">Tidak diketahui
                                </p>
                            </td>
                            <td class="px-3 py-4">
                                <p class="td-text-general">{{ data.PhoneNumber }}
                                </p>
                            </td>
                            <td class="px-3 py-4">
                                <p class="td-text-general">{{ data.Email }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination navigation -->
            <div class="ml-8 my-8 flex justify-center">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 mr-2 bg-teal text-white rounded-md disabled:opacity-50">Previous</button>
                <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                    :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                    class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-teal text-white rounded-md disabled:opacity-50">Next</button>
            </div>
        </div>
    </div>
</template>

<style>
@media (max-width: 768px) {

    th,
    td {
        padding: 0.5rem;
        font-size: 0.875rem;
    }
}

@media (max-width: 640px) {

    th,
    td {
        padding: 0.25rem;
        font-size: 0.75rem;
    }
}
</style>
