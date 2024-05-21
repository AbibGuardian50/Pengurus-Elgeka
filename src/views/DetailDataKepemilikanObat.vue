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
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list_patient/website';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (response.data.Message === "Success to Get Patient Medicine List Website") {
                toast.success('Data pasien berhasil dimuat!')
            }
            console.log(response);
            this.DataOwnershipMedicine = response.data.Data;
            this.DataOwnershipMedicine.sort((x, y) => x.id - y.id)
            this.DataOwnershipMedicine.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.DataOwnershipMedicine.length / this.perPage); // Calculate total pages
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
            perPage: 10, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedDataOwnershipMedicine: [],
            DataOwnershipMedicine: [], // Paginated data
        }
    },
    methods: {
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedDataOwnershipMedicine = this.DataOwnershipMedicine.slice(startIndex, endIndex);
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
    <div class="flex">
        <Sidebar />

        <div class="w-full bg-offwhite">
            <div class="ml-8 flex items-center justify-between border-b border-lightgray">
                <p class=" font-bold text-[30px] mt-4 py-4 leading-6 text-blueblack">Data Kepemilikan Obat</p>
                <a href="/DataKepemilikanObat" class="mt-4 flex items-center gap-2 font-inter font-medium text-[20px] leading-5 text-blueblack"><span><svg width="18" height="15" viewBox="0 0 18 15" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.5001 6.01013L5.12185 6.01013L8.56112 2.5754C8.95103 2.19931 9.1074 1.64237 8.97014 1.11866C8.83287 0.594938 8.42333 0.185938 7.89892 0.0488548C7.37451 -0.0882282 6.81685 0.0679398 6.44026 0.457335L0.440653 6.44903C0.158546 6.73005 0 7.11162 0 7.50955C0 7.90748 0.158546 8.28906 0.440653 8.57008L6.44026 14.5618C7.02675 15.1467 7.97696 15.146 8.56262 14.5603C9.14828 13.9746 9.14761 13.0256 8.56112 12.4407L5.12185 9.00598L16.5001 9.00598C17.3285 9.00598 18 8.33534 18 7.50806C18 6.68078 17.3285 6.01013 16.5001 6.01013Z"
                                fill="#1E1E1E" />
                        </svg>
                    </span> Kembali ke Grafik</a>
                    <!-- <form class="relative w-max flex flex-row rounded-md pl-4 mt-4 py-4">
                    <input type="search" placeholder="Quick Find"
                        class="peer cursor-pointer border relative z-10 h-12 w-12 rounded-md bg-transparent pl-2 outline-none w-full cursor-text pr-4" />
                    <div class="flex items-center justify-center pr-4">
                        <img class="w-[19px] h-[19px]" src="../assets/union-1.png" alt="">
                    </div>
                </form> -->
            </div>

            <p class="ml-8 font-normal text-[20px] leading-7 text-blueblack mt-4">Biodata Pasien</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                <thead>
                    <tr class="border-b-[0.5px] border-b-teal">
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            No
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Nama
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Handphone
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Obat yang dimiliki
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Stok Obat
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(data, index) in DataOwnershipMedicine" :key="index"
                    class="divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap  font-normal  text-sulfurblack text-base">
                            {{ data.no }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="">
                                    <div class=" font-normal text-sulfurblack text-base">
                                        {{ data.Name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">{{ data.PhoneNumber }}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">{{ data.Email }}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div v-for="(medicine, mIndex) in data.ListMedicine" :key="mIndex">
                                <p class="font-normal text-sulfurblack text-base" v-if="mIndex !== 0">- {{ medicine.Name }}
                                </p>
                            </div>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <div v-for="(medicine, mIndex) in data.ListMedicine" :key="mIndex" >
                                <p class="font-bold font-assistant text-black text-[16px]" v-if="mIndex !== 0">{{ medicine.Stock }}
                                </p>
                            </div>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base "></p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">

                        </td>
                    </tr>

                </tbody>
            </table>

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