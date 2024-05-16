<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export default {
    async created() {
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/list/website';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            this.InfoPatient = response.data.Data;
            this.InfoPatient.sort((x, y) => x.id - y.id)
            this.InfoPatient.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoPatient.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
        } catch (error) {
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

        <div>
            <!-- Your content -->
            <div class="ml-8 flex items-center justify-between border-b border-lightgray">
                <p class="font-bold font-gotham text-[30px] mt-4 py-4 leading-6 text-blueblack">Data Umum Pasien</p>
                <a href="/dataumumpasien" class="flex items-center gap-2 font-inter font-medium text-[20px] leading-5 text-blueblack"><span><svg width="18" height="15" viewBox="0 0 18 15" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.5001 6.01013L5.12185 6.01013L8.56112 2.5754C8.95103 2.19931 9.1074 1.64237 8.97014 1.11866C8.83287 0.594938 8.42333 0.185938 7.89892 0.0488548C7.37451 -0.0882282 6.81685 0.0679398 6.44026 0.457335L0.440653 6.44903C0.158546 6.73005 0 7.11162 0 7.50955C0 7.90748 0.158546 8.28906 0.440653 8.57008L6.44026 14.5618C7.02675 15.1467 7.97696 15.146 8.56262 14.5603C9.14828 13.9746 9.14761 13.0256 8.56112 12.4407L5.12185 9.00598L16.5001 9.00598C17.3285 9.00598 18 8.33534 18 7.50806C18 6.68078 17.3285 6.01013 16.5001 6.01013Z"
                                fill="#1E1E1E" />
                        </svg>
                    </span> Kembali ke Grafik</a>
                <!-- <form class="relative w-max flex flex-row rounded-md pl-4 mt-4 py-4">
                    <div>
                        <form action="" class="max-w-[480px] w-full px-4">
                            <div class="relative">
                                <input type="text" name="q" class="w-full border h-12 shadow py-2 px-4 rounded-lg"
                                    placeholder="Quick Find">
                                <button type="submit">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        class="text-gray-400 h-5 w-5 absolute top-3.5 right-3 fill-current"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M4.64286 7.92857C4.64286 3.82588 7.96874 0.5 12.0714 0.5C16.1741 0.5 19.5 3.82588 19.5 7.92857C19.5 12.0313 16.1741 15.3571 12.0714 15.3571C10.3811 15.3571 8.82147 14.7917 7.57333 13.8409L2.20711 19.2071C1.81658 19.5976 1.18342 19.5976 0.792893 19.2071C0.402369 18.8166 0.402369 18.1834 0.792893 17.7929L6.15912 12.4267C5.20834 11.1785 4.64286 9.61894 4.64286 7.92857ZM12.0714 2.5C9.07331 2.5 6.64286 4.93045 6.64286 7.92857C6.64286 9.42791 7.24938 10.7837 8.23285 11.7672C9.21632 12.7506 10.5721 13.3571 12.0714 13.3571C15.0695 13.3571 17.5 10.9267 17.5 7.92857C17.5 4.93045 15.0695 2.5 12.0714 2.5Z"
                                            fill="black" />
                                    </svg>

                                </button>
                            </div>
                        </form>
                    </div>
                </form> -->
            </div>

            <p class="ml-8 font-light font-gotham text-[20px] leading-7 text-blueblack mt-4">Biodata Pasien</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                <thead>
                    <tr class="border-b-[0.5px] border-b-lightgray">
                        <th scope="col" class="px-3 py-3 max-w-[50px] text-left font-bold font-gotham text-black text-base">
                            No
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Nama
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[300px] text-left font-bold font-gotham text-black text-base">
                            Alamat
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Gender
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Tanggal Lahir
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Umur
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Golongan Darah
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Nomor HP
                        </th>
                        <th scope="col"
                            class="px-3 py-3 max-w-[250px] text-left font-bold font-gotham text-black text-base">
                            Email
                        </th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in paginatedInfoPatient" :key="index" class="divide-y divide-gray-200">
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
                        <td class="px-3 py-4 min-w-[250px] max-w-[251px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ data.Address }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p v-if="data.Gender === 'female'"
                                class="font-gotham font-light leading-4 text-black text-base">Perempuan</p>
                            <p v-else-if="data.Gender === 'male'"
                                class="font-gotham font-light leading-4 text-black text-base">Laki-Laki</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ formatDate(data.BirthDate)
                            }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[50px] max-w-[101px]">
                            <p v-if="data.Age" class="font-gotham font-light leading-4 text-black text-base">{{ data.Age }}
                            </p>
                            <p v-else-if="!data.Age" class="font-gotham font-light leading-4 text-black text-base">Tidak
                                diketahui</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p v-if="data.BloodGroup" class="font-gotham font-light leading-4 text-black text-base">{{
                                data.BloodGroup }}
                            </p>
                            <p v-else class="font-gotham font-light leading-4 text-black text-base">Tidak diketahui</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ data.PhoneNumber }}</p>
                        </td>
                        <td class="px-3 py-4 min-w-[200px] max-w-[201px]">
                            <p class="font-gotham font-light leading-4 text-black text-base">{{ data.Email }}</p>
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
</div></template>
