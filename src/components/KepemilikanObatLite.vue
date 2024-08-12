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

        // Fetching medicine names for the dropdown filter
        try {
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/dataObat');
            this.medicineNames = response.data.result.data;
            console.log(this.medicineNames);
        } catch (error) {
            console.error('Error fetching medicine names:', error);
        }
    },
    data() {
        return {
            DataOwnershipMedicine: [], // Full data
            stockFilter: '9', // Stock filter value
            dateFilter: '', // Date filter value
            medicineFilter: '', // Medicine name filter value
            medicineNames: [], // List of medicine names
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc' // Sort direction
        }
    },
    methods: {
        formatDate(dateString) {
            return format(new Date(dateString), 'dd MMMM yyyy', { locale: id });
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
        applyFilters() {
        let filteredData = this.DataOwnershipMedicine.map(patient => {
            const filteredMedicines = patient.ListMedicine.filter(medicine => {
                let matchesStock = true;
                let matchesDate = true;
                let matchesMedicineName = true;

                // Apply stock filter
                if (this.stockFilter !== '') {
                    matchesStock = medicine.Stock <= this.stockFilter;
                }

                // Apply date filter
                if (this.dateFilter !== '') {
                    matchesDate = new Date(medicine.Date) <= new Date(this.dateFilter);
                }

                // Apply medicine name filter
                if (this.medicineFilter !== '') {
                    matchesMedicineName = medicine.Name === this.medicineFilter;
                }

                return matchesStock && matchesDate && matchesMedicineName;
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

        // Sort the filtered medicines by the nearest pickup date
        filteredData.forEach(patient => {
            patient.ListMedicine.sort((a, b) => {
                const dayDifferenceA = Math.ceil((new Date(a.Date) - new Date()) / (1000 * 60 * 60 * 24));
                const dayDifferenceB = Math.ceil((new Date(b.Date) - new Date()) / (1000 * 60 * 60 * 24));
                return dayDifferenceA - dayDifferenceB;
            });
        });

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
                        <label for="medicineFilter">Nama Obat: </label>
                        <select v-model="medicineFilter" class="px-2 py-1 border rounded border-teal">
                            <option value="">Semua Obat</option>
                            <option v-for="medicine in medicineNames" :key="medicine.nama_obat" :value="medicine.nama_obat">
                                {{ medicine.nama_obat }}
                            </option>
                        </select>
                    </div>
                    <div>&</div>
                    <div>
                        <label for="max stock">Batas Maksimum Obat : </label>
                        <input type="number" v-model="stockFilter" placeholder="Max Stock" min="1"
                            class="px-2 py-1 border rounded border-teal" />
                    </div>
                    <!-- <div>
                        <label for="datefilter">Batas Tanggal pengambilan obat : </label>
                        <input type="date" min="1945-01-01" placeholder="dd/mm/yyyy" v-model="dateFilter"
                            class="px-2 py-1 border rounded border-teal" />
                    </div> -->
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
                            <th scope="col" class="px-3 py-3 text-left font-bold font-poppins text-black text-base">
                                Jadwal Pengambilan Selanjutnya
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="(data, index) in applyFilters()" :key="index" class="divide-y divide-gray-200">
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
        </div>

    </div>

    <div class="ml-8 pt-4">
        <a href="/detaildataumumkepemilikanobat">
            <button class="font-opensans text-black flex items-center gap-2 pb-4">
                Read more
                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45592 9.96853 7.707 9.70856L11.707 5.70856C11.8945 5.52102 12 5.26529 12 4.99956C12 4.73382 11.8945 4.4781 11.707 4.29056L7.707 0.290557C7.45447 0.0378005 7.08243 -0.0674106 6.7313 0.0240698C6.38017 0.11555 6.10685 0.388876 6.01537 0.739999C5.92389 1.09112 6.02879 1.46343 6.293 1.71356L8.586 4.00156H1C0.734784 4.00156 0.48043 4.10698 0.292893 4.29451C0.105357 4.48205 0 4.7364 0 5.00156C0 5.26673 0.105357 5.52108 0.292893 5.70862C0.48043 5.89615 0.734784 6.00156 1 6.00156Z"
                        fill="#004180" />
                </svg>
            </button>
        </a>
    </div>
</template>


