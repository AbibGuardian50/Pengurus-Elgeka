<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export default {
    async created() {
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/leukocytes';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (response.data.Message === "Success to Get Leukocytes Data") {
                toast.success('Data Hasil Lab Leukosit Berhasil Dimuat');
            }
            this.InfoPatient = response.data.Data;
            this.InfoPatient.forEach((item, index) => {
                item.Data = parseFloat(item.Data) * 1000; // Mengalikan dengan 10 pangkat 3
                item.no = index + 1;
            });
            this.InfoPatient.sort((x, y) => x.id - y.id);
            this.InfoPatient.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoPatient.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
        } catch (error) {
            const toast = useToast();
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali');
            }
            console.error(error);
        }
    },
    computed: {
        filteredData() {
            let filtered = this.InfoPatient;

            // Filter by data value
            // Filter by data value
            if (this.selectedFilter) {
                filtered = filtered.filter(item => {
                    const value = parseFloat(item.Data);
                    if (this.selectedFilter === '< 2000') {
                        return value < 2000;
                    } else if (this.selectedFilter === '2000 - 3500') {
                        return value >= 2000 && value < 3500;
                    } else if (this.selectedFilter === '3500 - 12000') {
                        return value >= 3500 && value < 12000;
                    } else if (this.selectedFilter === '12000 - 100000') {
                        return value >= 12000 && value < 100000;
                    } else if (this.selectedFilter === '> 100000') {
                        return value >= 100000;
                    }
                    return true;
                });
            }

            // Filter by gender
            if (this.selectedGender) {
                filtered = filtered.filter(item => item.Gender === this.selectedGender);
            }


            // Filter by date range
            if (this.startDate && this.endDate) {
                const startDate = new Date(this.startDate);
                const endDate = new Date(this.endDate);
                filtered = filtered.filter(item => {
                    const itemDate = new Date(item.Date);
                    return itemDate >= startDate && itemDate <= endDate;
                });
            }

            return filtered;
        }
    },
    watch: {
        selectedFilter() {
            this.validateDates(); // Add date validation
            this.currentPage = 1; // Reset to first page when filter changes
            this.totalPages = Math.ceil(this.filteredData.length / this.perPage); // Recalculate total pages
            this.updatePaginatedData();
        },
        startDate() {
            this.validateDates(); // Add date validation
            this.currentPage = 1; // Reset to first page when filter changes
            this.totalPages = Math.ceil(this.filteredData.length / this.perPage); // Recalculate total pages
            this.updatePaginatedData();
        },
        endDate() {
            this.validateDates(); // Add date validation
            this.currentPage = 1; // Reset to first page when filter changes
            this.totalPages = Math.ceil(this.filteredData.length / this.perPage); // Recalculate total pages
            this.updatePaginatedData();
        }
    },
    data() {
        return {
            items: [
                // your data here...
            ],
            InfoPatient: [],
            perPage: 10, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedInfoPatient: [], // Paginated data
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc', // Sort direction
            sortOrder: 'asc',
            selectedFilter: '',  // Add selectedFilter
            selectedGender: '', // Add selectedGender
            startDate: '',
            endDate: ''
        }
    },
    methods: {
        formatNumber(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedInfoPatient = this.filteredData.slice(startIndex, endIndex);
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
        deleteItem(itemId) {
            this.items = this.items.filter(item => item.id !== itemId);
        },
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            this.InfoPatient.sort((a, b) => {
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
                this.InfoPatient.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.InfoPatient.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return format(date, "dd MMMM yyyy", { locale: idLocale });
        },
        filterData() {
            this.currentPage = 1;
            this.totalPages = Math.ceil(this.filteredData.length / this.perPage);
            this.updatePaginatedData();
        },
        validateDates() {
            const toast = useToast();
            if (this.startDate && this.endDate) {
                const startDate = new Date(this.startDate);
                const endDate = new Date(this.endDate);
                if (startDate > endDate) {
                    toast.error('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
                }
            }
        }
    },
    components: {
        Sidebar
    }
};
</script>


<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="ml-8 max-sm:ml-2 pt-4 w-full bg-offwhite">
            <!-- Your content -->
            <div class="heading-div-general max-[1400px]:justify-start max-[1400px]:gap-4 max-md:gap-2">
                <p class="title-heading-general">Data hasil Lab Leukosit</p>
                <a href="/HasilLabLeukocytes"
                    class="flex items-center gap-2 font-inter font-medium text-[20px] leading-5 text-blueblack"><span><svg
                            width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.5001 6.01013L5.12185 6.01013L8.56112 2.5754C8.95103 2.19931 9.1074 1.64237 8.97014 1.11866C8.83287 0.594938 8.42333 0.185938 7.89892 0.0488548C7.37451 -0.0882282 6.81685 0.0679398 6.44026 0.457335L0.440653 6.44903C0.158546 6.73005 0 7.11162 0 7.50955C0 7.90748 0.158546 8.28906 0.440653 8.57008L6.44026 14.5618C7.02675 15.1467 7.97696 15.146 8.56262 14.5603C9.14828 13.9746 9.14761 13.0256 8.56112 12.4407L5.12185 9.00598L16.5001 9.00598C17.3285 9.00598 18 8.33534 18 7.50806C18 6.68078 17.3285 6.01013 16.5001 6.01013Z"
                                fill="#1E1E1E" />
                        </svg>
                    </span> Kembali ke Grafik</a>
            </div>

            <p class="font-normal font-poppins text-[20px] leading-7 text-blueblack mt-4">Biodata Pasien</p>

            <!-- Filter Dropdown -->
            <div class="flex gap-4 max-sm:flex-col max-sm:gap-0">
                <div class="mb-4">
                    <label for="filter" class="font-medium font-poppins text-blueblack">Filter Data:</label>
                    <select id="filter" v-model="selectedFilter" @change="filterData"
                        class="ml-2 p-2 border rounded-md bg-white text-blueblack font-poppins">
                        <option value="">Pilih Filter</option>
                        <option value="< 2000">&lt; 2000</option>
                        <option value="2000 - 3500">2000 - 3500</option>
                        <option value="3500 - 12000">3500 - 12000</option>
                        <option value="12000 - 100000">12000 - 100000</option>
                        <option value="> 100000">&gt; 100000</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label for="filter" class="font-medium font-poppins text-blueblack">Filter Gender:</label>
                    <select id="filter" v-model="selectedGender" @change="filterData"
                        class="ml-2 p-2 border rounded-md bg-white text-blueblack font-poppins">
                        <option value="">Pilih Filter</option>
                        <option value="male">Laki-Laki</option>
                        <option value="female">Perempuan</option>
                    </select>
                </div>
            </div>


            <div class="mb-4">
                <label for="startDate" class="font-medium font-poppins text-blueblack">Tanggal Mulai:</label>
                <input type="date" id="startDate" v-model="startDate"
                    class="ml-2 p-2 border rounded-md bg-white text-blueblack font-poppins" />
                <label for="endDate" class="font-medium font-poppins text-blueblack ml-4">Tanggal Akhir:</label>
                <input type="date" id="endDate" v-model="endDate"
                    class="ml-2 p-2 border rounded-md bg-white text-blueblack font-poppins" />
            </div>

            <div class="overflow-x-auto max-w-full max-[700px]:max-w-[85%]">
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
                    <thead>
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
                            <th scope="col" class="th-general max-lg:px-1">
                                Nama
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Gender
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Email
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Nomor Telepon
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Data
                            </th>
                            <th scope="col" class="th-general max-lg:px-1">
                                Catatan
                            </th>
                            <th @click="sortData('Date')" scope="col"
                                class="cursor-pointer flex items-center gap-1 th-general max-lg:px-1">
                                Tanggal
                                <span v-if="sortColumn === 'Date'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                <span v-else>
                                    <svg fill="none" height="16" viewBox="0 0 512 512" width="16"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M476.843 57.6L326.333 274.77L326.182 274.99C320.698 282.603 317.745 291.747 317.743 301.13V407.39C317.746 410.792 316.882 414.138 315.232 417.113C313.582 420.088 311.201 422.592 308.313 424.39L212.483 484C204.823 488.77 193.723 487.19 193.773 478.17V301.13C193.77 291.747 190.818 282.603 185.333 274.99L185.183 274.77L34.6825 57.6C32.5751 54.5817 31.3216 51.0505 31.0541 47.379C30.7866 43.7075 31.5149 40.0319 33.1625 36.74C34.7471 33.5274 37.1963 30.8204 40.2348 28.9231C43.2732 27.0259 46.7806 26.0136 50.3627 26H127.593C129.846 26.0026 132.007 26.899 133.6 28.4925C135.193 30.086 136.09 32.2465 136.093 34.5V46C136.093 51.3043 138.2 56.3914 141.951 60.1421C145.701 63.8929 150.788 66 156.093 66H355.093C360.397 66 365.484 63.8929 369.235 60.1421C372.985 56.3914 375.093 51.3043 375.093 46V34.5C375.093 32.2457 375.988 30.0837 377.582 28.4896C379.176 26.8955 381.338 26 383.593 26L461.162 26C464.744 26.0147 468.251 27.0275 471.289 28.9246C474.328 30.8218 476.777 33.5281 478.363 36.74C480.008 40.0325 480.736 43.7077 480.468 47.3788C480.201 51.0498 478.948 54.5808 476.843 57.6V57.6Z"
                                            fill="black" />
                                    </svg>
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in paginatedInfoPatient" :key="data.id" class="divide-y divide-gray-200">
                            <td class="td-general max-lg:w-[5%]">
                                {{ data.no }}
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <div class="flex items-center">
                                    <div>
                                        <div class="td-text-general">
                                            {{ data.Name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <p v-if="data.Gender === 'male'" class="td-text-general">Laki-laki</p>
                                <p v-else-if="data.Gender === 'female'" class="td-text-general">Perempuan</p>
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <p class="td-text-general">{{ data.Email }}</p>
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <p class="td-text-general">{{ data.PhoneNumber }}</p>
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <p class="td-text-general">{{ formatNumber(data.Data) }}</p>
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <p class="td-text-general">{{ data.Notes }}</p>
                            </td>
                            <td class="td-general max-lg:w-[5%]">
                                <p class="td-text-general">{{ formatDate(data.Date) }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <!-- Pagination navigation -->
            <div class=" mt-4 flex justify-center">
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
