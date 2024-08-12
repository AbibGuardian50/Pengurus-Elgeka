<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { format } from 'date-fns';
import id from 'date-fns/locale/id';
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
            this.DataOwnershipMedicine = response.data.Data;
            this.DataOwnershipMedicine.sort((x, y) => x.id - y.id);
            this.DataOwnershipMedicine.forEach((item, index) => {
                item.no = index + 1;
            });
            this.updatePaginatedData(); // Initialize pagination
        } catch (error) {
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
            console.error(error);
        }

        // Fetching medicine names for the dropdown filter
        try {
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/dataObat');
            this.medicineNames = response.data.result.data;
            console.log(this.medicineNames);
        } catch (error) {
            console.error('Error fetching medicine names:', error);
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
            DataOwnershipMedicine: [], // Full data
            medicineNames: [], // List of medicine names
            medicineFilter: '', // Medicine name filter value
            stockFilter: '', // Stock filter value
            dateFilter: '', // Date filter value
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc' // Sort direction
        }
    },
    methods: {
        formatDateDefault(dateString) {
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        formatDate(dateString) {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
        },
        applyFilters() {
        let filteredData = this.DataOwnershipMedicine.map(patient => {
            // Filter the medicines for the current patient
            const filteredMedicines = patient.ListMedicine.filter(medicine => {
                let matchesStock = true;
                let matchesDate = true;
                let matchesMedicineName = true;
                
                if (this.stockFilter) {
                    matchesStock = medicine.Stock <= this.stockFilter;
                }
                
                if (this.dateFilter) {
                    matchesDate = new Date(medicine.Date) <= new Date(this.dateFilter);
                }

                // Apply medicine name filter
                if (this.medicineFilter !== '') {
                    matchesMedicineName = medicine.Name === this.medicineFilter;
                }
                
                return matchesStock && matchesDate && matchesMedicineName;
            });
            
            // Only return the patient if they have any medicines that meet the filter criteria
            if (filteredMedicines.length > 0) {
                return {
                    ...patient,
                    ListMedicine: filteredMedicines
                };
            } else {
                return null;
            }
        }).filter(patient => patient !== null); // Remove patients without filtered medicines

        // Sort the filtered medicines by the nearest pickup date
        filteredData.forEach(patient => {
            patient.ListMedicine.sort((a, b) => {
                const dayDifferenceA = Math.ceil((new Date(a.Date) - new Date()) / (1000 * 60 * 60 * 24));
                const dayDifferenceB = Math.ceil((new Date(b.Date) - new Date()) / (1000 * 60 * 60 * 24));
                return dayDifferenceA - dayDifferenceB;
            });
        });

        return filteredData;
        },
        calculateNextPickup(medicineDate) {
        const medicineDateObj = new Date(medicineDate);
        medicineDateObj.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const nextPickupDate = new Date(medicineDateObj);
        nextPickupDate.setDate(medicineDateObj.getDate() + 30);
        nextPickupDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const dayDifference = Math.ceil((nextPickupDate - today) / (1000 * 60 * 60 * 24));

        let displayMessage;
        if (dayDifference > 0) {
            displayMessage = `${dayDifference} hari lagi`;
        } else if (dayDifference === 0) {
            displayMessage = "Hari ini";
        } else {
            displayMessage = `${Math.abs(dayDifference)} hari yang lalu`;
        }

        return {
            nextPickupDateFormatted: this.formatDate(nextPickupDate),
            displayMessage: displayMessage
        };
    },
        updatePaginatedData() {
            const filteredData = this.applyFilters();
            this.totalPages = Math.ceil(filteredData.length / this.perPage); // Recalculate total pages based on filtered data
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedDataOwnershipMedicine = filteredData.slice(startIndex, endIndex);
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
            this.DataOwnershipMedicine.sort((a, b) => {
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
    }
}
</script>

<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="ml-8 max-sm:ml-2 pt-4 w-full bg-offwhite">
            <div class="heading-div-general max-[1400px]:justify-start max-[1400px]:gap-4 max-md:gap-2">
                <p class="title-heading-general">Data Kepemilikan Obat</p>
                <a href="/DataKepemilikanObat"
                    class="mt-4 flex items-center gap-2 font-inter font-medium text-[20px] leading-5 text-blueblack"><span><svg
                            width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.5001 6.01013L5.12185 6.01013L8.56112 2.5754C8.95103 2.19931 9.1074 1.64237 8.97014 1.11866C8.83287 0.594938 8.42333 0.185938 7.89892 0.0488548C7.37451 -0.0882282 6.81685 0.0679398 6.44026 0.457335L0.440653 6.44903C0.158546 6.73005 0 7.11162 0 7.50955C0 7.90748 0.158546 8.28906 0.440653 8.57008L6.44026 14.5618C7.02675 15.1467 7.97696 15.146 8.56262 14.5603C9.14828 13.9746 9.14761 13.0256 8.56112 12.4407L5.12185 9.00598L16.5001 9.00598C17.3285 9.00598 18 8.33534 18 7.50806C18 6.68078 17.3285 6.01013 16.5001 6.01013Z"
                                fill="#1E1E1E" />
                        </svg>
                    </span> Kembali ke Grafik</a>
            </div>

            <p class="font-normal text-[20px] leading-7 text-blueblack mt-4">Biodata Pasien</p>

            <div class="my-4">
                <div class="flex gap-4 items-center max-sm:flex-col max-sm:gap-2 max-sm:items-start">
                    <div class="max-sm:flex max-sm:flex-col max-sm:gap-2">
                        <label for="max stock">Batas Maksimum Obat : </label>
                        <input type="number" v-model="stockFilter" placeholder="Max Stock" class="px-2 py-1 border border-teal rounded" />
                        
                    </div>

                    <div>&</div>
                    
                    <div class="max-sm:flex max-sm:flex-col max-sm:gap-2">
                        <label for="datefilter">Batas Tanggal pengambilan obat :  </label>
                        <input type="date" v-model="dateFilter" class="px-2 py-1 border border-teal rounded" />
                    </div>

                    <div>&</div>

                    <div>
                        <label for="medicineFilter">Nama Obat: </label>
                        <select v-model="medicineFilter" class="px-2 py-1 border rounded border-teal">
                            <option selected value="">Semua Obat</option>
                            <option v-for="medicine in medicineNames" :key="medicine.nama_obat" :value="medicine.nama_obat">
                                {{ medicine.nama_obat }}
                            </option>
                        </select>
                    </div>

                    <button @click="updatePaginatedData" class="px-4 py-2 bg-teal text-white rounded-md">Filter</button>
                </div>
            </div>

            <div class="overflow-x-auto max-w-full max-[700px]:max-w-[85%]">
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-teal">
                            <th scope="col"
                                class="px-3 py-3 max-[1300px]:pb-0 max-[1100px]:pt-6 max-[1200px]:pl-0 max-w-[50px] flex items-center gap-1 text-left font-bold font-poppins text-black text-base cursor-pointer"
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
                                Handphone
                            </th>
                            <th scope="col" class="th-general">
                                Email
                            </th>
                            <th scope="col" class="th-general">
                                Obat yang dimiliki
                            </th>
                            <th scope="col" class="th-general">
                                Pengambilan Obat Sebelumnya
                            </th>
                            <th scope="col" class="th-general">
                                Tanggal Pengambilan Obat
                            </th>
                        </tr>
                    </thead>

                    <tbody v-for="(data, index) in paginatedDataOwnershipMedicine" :key="index"
                        class="divide-y divide-gray-200">
                        <tr>
                            <td class="td-general td-text-general">
                                {{ data.no }}
                            </td>
                            <td class="td-general">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="td-text-general">
                                            {{ data.Name || 'Tidak Diketahui' }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ data.PhoneNumber || 'Tidak Diketahui' }}</p>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ data.Email || 'Tidak Diketahui' }}</p>
                            </td>
                            <td class="td-general max-[1000px]:min-w-[8rem]">
                                <div v-if="data.ListMedicine && data.ListMedicine.length > 0">
                                    <div v-for="(medicine, mIndex) in data.ListMedicine" :key="mIndex">
                                        <p class="td-text-general leading-6">
                                            - {{ medicine.Name || 'Tidak Diketahui' }} ({{ medicine.Stock || 'Tidak Diketahui' }})
                                        </p>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="td-text-general">Tidak Diketahui</p>
                                </div>
                            </td>
                            <td class="td-general">
                                <div v-if="data.ListMedicine && data.ListMedicine.length > 0">
                                    <div v-for="(medicine, mIndex) in data.ListMedicine" :key="mIndex">
                                        <p class="td-text-general leading-6">
                                            {{ formatDateDefault(medicine.Date) }}
                                        </p>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="td-text-general">Tidak Diketahui</p>
                                </div>
                            </td>

                            <td class="td-general">
                                <div v-if="data.ListMedicine && data.ListMedicine.length > 0">
                                    <div v-for="(medicine, mIndex) in data.ListMedicine" :key="mIndex">
                                        <p class="td-text-general leading-6">
                                            {{ calculateNextPickup(medicine.Date).nextPickupDateFormatted || 'Tidak Diketahui' }}
                                            - {{ calculateNextPickup(medicine.Date).displayMessage }}
                                        </p>
                                    </div>
                                </div>
                                <div v-else>
                                    <p class="td-text-general">Tidak Diketahui</p>
                                </div>
                            </td>

                            

                        </tr>
                    </tbody>

                </table>
            </div>


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