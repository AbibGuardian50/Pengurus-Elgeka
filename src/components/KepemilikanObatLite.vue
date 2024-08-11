<script>
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
        } catch (error) {
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
            console.error(error);
        }
    },
    data() {
        return {
            DataOwnershipMedicine: [], // Full data
            stockFilter: '', // Stock filter value
            dateFilter: '', // Date filter value
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc' // Sort direction
        }
    },
    methods: {
        formatDate(dateString) {
            return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: id });
        },
        applyFilters() {
            let filteredData = this.DataOwnershipMedicine.map(patient => {
                const filteredMedicines = patient.ListMedicine.filter(medicine => {
                    let matchesStock = true;
                    let matchesDate = true;
                    
                    if (this.stockFilter) {
                        matchesStock = medicine.Stock <= this.stockFilter;
                    }
                    
                    if (this.dateFilter) {
                        matchesDate = new Date(medicine.Date) <= new Date(this.dateFilter);
                    }
                    
                    return matchesStock && matchesDate;
                });
                
                if (filteredMedicines.length > 0) {
                    return {
                        ...patient,
                        ListMedicine: filteredMedicines
                    };
                } else {
                    return null;
                }
            }).filter(patient => patient !== null);

            // Limit to 5 items
        return filteredData.slice(0, 5);
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
        },
    }
}
</script>

<template>
    <div class="flex">

        <div class="ml-8 max-sm:ml-2 pt-4 w-full">

            <div class="my-4">
                <div class="flex gap-4 items-center">
                    <div>
                        <label for="max stock">Batas Maksimum Obat : </label>
                        <input type="number" v-model="stockFilter" placeholder="Max Stock" min="1" class="px-2 py-1 border rounded" />
                        
                    </div>

                    <div>&</div>
                    
                    <div>
                        <label for="datefilter">Batas Tanggal pengambilan obat :  </label>
                        <input type="date" v-model="dateFilter" class="px-2 py-1 border rounded" />
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto max-w-full max-[700px]:max-w-[85%]">
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-teal">
                            <th scope="col" class="px-3 py-3 text-left font-bold font-poppins text-black text-base">
                                Nama Pasien
                            </th>
                            <th scope="col" class="px-3 py-3 text-left font-bold font-poppins text-black text-base">
                                Obat
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="(data, index) in applyFilters()" :key="index"
                        class="divide-y divide-gray-200">
                        <tr>
                            <td class="td-general">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class="td-text-general">
                                            {{ data.Name || 'Tidak Diketahui' }}
                                        </div>
                                    </div>
                                </div>
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

                        </tr>
                    </tbody>

                </table>
            </div>
        </div>
    </div>
</template>
