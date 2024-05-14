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
            const url = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list_inactive';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            this.InfoDoctor = response.data.Data;
            this.InfoDoctor.sort((x, y) => x.id - y.id)
            this.InfoDoctor.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.InfoDoctor.length / this.perPage); // Calculate total pages
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
            InfoDoctor: [],
            perPage: 10, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedInfoDoctor: [] // Paginated data

        }
    },
    methods: {
        editstatusdoctor(id) {
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
                        console.log(response.data);
                        window.location.reload();
                    })
                    .catch(error => {
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
                <form class="relative w-max flex flex-row rounded-md pl-4 mt-4 py-4">
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
                </form>
            </div>

            <p class="ml-8 font-light font-gotham text-[20px] leading-7 text-blueblack mt-4">Biodata Dokter</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                <thead>
                    <tr class="border-b-[0.5px] border-b-teal">
                        <th scope="col" class="px-3 py-3 max-w-[50px] text-left font-bold font-gotham text-black text-base">
                            No
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
                <tbody>
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
                                <select class="bg-teal py-2 px-4 rounded-lg text-white font-gotham">
                                    <option>Verified</option>
                                    <option selected>Not Verified</option>
                                </select>
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
