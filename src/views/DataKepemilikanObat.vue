<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { Bar, Pie, Doughnut } from 'vue-chartjs'
import { useToast } from 'vue-toastification';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
    data() {
        return {
            loaded: false,
            allData: [], // Data asli tanpa filter
            MedicineData: [],
            TotalPatientWithMedicine: 0,
            HospitalPerMedicineData: [],
            StatisticsPatientData: [],
            MedicineOptions: this.getMedicineOptions(),
            startDate: '',
            endDate: '',
            categories: [],
            selectedCategory: '',
            selectedStock: '',
        }
    },
    async created() {
        this.loaded = false
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization');
            await this.fetchCategories(tokenlogin);
            const patientDataPromise = this.fetchPatientData(tokenlogin);
            const medicineDataPromise = this.fetchMedicineData(tokenlogin);
            const [patientData, medicineData] = await Promise.all([patientDataPromise, medicineDataPromise]);
            this.StatisticsPatientData = this.getRandomFilteredPatients(patientData, 3)

            // Save fetched patient data to allData
            this.allData = patientData;
            this.totalPatientCount = this.allData.length;

            this.filterData(); // Apply initial filtering

            this.loaded = true;
        } catch (error) {
            console.error(error.message)
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
        }

        window.addEventListener('resize', this.updateChartFontSizes);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateChartFontSizes);
    },
    components: {
        Sidebar,
        Bar,
        Pie,
        Doughnut,
    },
    computed: {
        filteredPatients() {
            return this.getRandomFilteredPatients(this.StatisticsPatientData, 100); // Adjust the count as needed
        },
        filteredPatientData() {
            const today = new Date();
            const cutoffDate = new Date(today.setDate(today.getDate() - 7));

            return this.StatisticsPatientData.filter(patient => {
                return patient.ListMedicine.some(medicine =>
                    new Date(medicine.Date) <= cutoffDate
                );
            });
        }
    },
    methods: {
        filterData() {
            const startDateObj = this.startDate ? new Date(this.startDate) : null;
            const endDateObj = this.endDate ? new Date(this.endDate) : null;

            if (startDateObj && endDateObj && startDateObj > endDateObj) {
                const toast = useToast();
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
                return;
            }

            const filteredData = this.allData.reduce((acc, patient) => {
                const patientFilteredMedicines = patient.ListMedicine.filter(medicine => {
                    const itemDate = new Date(medicine.Date);
                    const dateInRange = (!startDateObj || itemDate >= startDateObj) && (!endDateObj || itemDate <= endDateObj);
                    const categoryMatches = !this.selectedCategory || medicine.Category === this.selectedCategory;
                    return dateInRange && categoryMatches;
                });

                if (patientFilteredMedicines.length > 0) {
                    acc.push({
                        ...patient,
                        ListMedicine: patientFilteredMedicines
                    });
                }

                return acc;
            }, []);

            this.updateData(filteredData);
        },


        getRandomFilteredPatients(patients, count) {
            const today = new Date();
            const cutoffDate = new Date(today.setDate(today.getDate() - 8));

            const filteredPatients = patients.filter(patient => {
                return patient.ListMedicine.some(medicine => medicine.Stock < 10 && new Date(medicine.Date) > cutoffDate);
            });

            return filteredPatients.sort(() => Math.random() - 0.5).slice(0, count);
        },

        // Method to fetch filtered medicine data based on category
        async fetchFilteredMedicineData() {
            // Call filterData to apply the selected category
            this.filterData();
        },

        // Methods to fetch data remain unchanged
        updateData(filteredData) {
            this.TotalPatientWithMedicine = this.totalPatientCount;
            this.MedicineData = this.processMedicineData(filteredData);
            this.HospitalPerMedicineData = this.processHospitalData(filteredData);
        },
        getResponsiveFontSize() {
            const width = window.innerWidth;
            if (width < 640) return 10;
            if (width < 1024) return 14;
            return 20;
        },
        getMedicineOptions() {
            const fontSize = this.getResponsiveFontSize();
            return {
                indexAxis: 'y',
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: {
                                size: fontSize
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: {
                                size: fontSize + 2,
                                weight: 'bold'
                            }
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: {
                                size: fontSize
                            }
                        },
                        title: {
                            display: true,
                            text: 'Nama Obat',
                            font: {
                                size: fontSize + 2,
                                weight: 'bold'
                            }
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: {
                            size: fontSize + 2,
                        },
                        bodyFont: {
                            size: fontSize + 2,
                        }
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: {
                                size: fontSize + 2,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        },
        updateChartFontSizes() {
            const fontSize = this.getResponsiveFontSize();
            this.MedicineOptions.scales.x.ticks.font.size = fontSize;
            this.MedicineOptions.scales.y.ticks.font.size = fontSize;
            this.MedicineOptions.scales.x.title.font.size = fontSize + 2;
            this.MedicineOptions.scales.y.title.font.size = fontSize + 2;
            this.MedicineOptions.plugins.tooltip.titleFont.size = fontSize + 2;
            this.MedicineOptions.plugins.tooltip.bodyFont.size = fontSize + 2;
            this.MedicineOptions.plugins.legend.labels.font.size = fontSize + 2;
        },
        async fetchPatientData(token) {
            const toast = useToast();
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list_patient/website';
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                if (response.data.Message === "Success to Get Patient Medicine List Website") {
                    toast.success('Data pasien berhasil dimuat!');
                }
                console.log(response);
                return response.data.Data;
            } catch (error) {
                console.error(error.message);
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                }
            }
        },

        async fetchMedicineData(token) {
            const toast = useToast();
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list/website';
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.data.Message === "Success to Get Medicine List Website") {
                    toast.success('Data obat Pasien berhasil dimuat!');
                    setTimeout(() => {
                        toast.info('Zoom out apabila data di grafik tidak lengkap');
                    }, 500);
                }
                console.log(response);
                const data = response.data.Data;
                return {
                    TotalPatientWithMedicine: data.Total_Patient_Have_Medicine,
                    MedicineList: data.Medicine
                };
            } catch (error) {
                console.error(error.message);
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                }
            }
        },
        async fetchCategories(token) {
            try {
                const response = await axios.get('https://elgeka-mobile-production.up.railway.app/api/user/medicine/list_patient/website', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const medicineList = response.data.Data.flatMap(patient => patient.ListMedicine);
                const categoriesSet = new Set(medicineList.map(medicine => medicine.Category));
                this.categories = Array.from(categoriesSet);
            } catch (error) {
                console.error(error.message);
                const toast = useToast();
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                }
            }
        },
        processMedicineData(patientData) {
            const medicineList = patientData.flatMap(patient => patient.ListMedicine);
            const medicineCount = medicineList.reduce((acc, item) => {
                acc[item.Name] = (acc[item.Name] || 0) + 1;
                return acc;
            }, {});
            const labels = Object.keys(medicineCount);
            const data = Object.values(medicineCount);

            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Jumlah Pasien',
                        backgroundColor: '#0A6B77',
                        data: data
                    }
                ]
            };
        },
        processHospitalData(patientData) {
            const hospitalData = patientData.flatMap(patient => patient.ListMedicine.map(medicine => ({
                medicineName: medicine.Name,
                hospitalName: patient.Hospital
            })));
            const hospitalGroupedData = hospitalData.reduce((acc, { medicineName, hospitalName }) => {
                if (!acc[medicineName]) {
                    acc[medicineName] = {};
                }
                acc[medicineName][hospitalName] = (acc[medicineName][hospitalName] || 0) + 1;
                return acc;
            }, {});

            return Object.entries(hospitalGroupedData).map(([medicineName, hospitalCounts]) => ({
                labels: Object.keys(hospitalCounts),
                datasets: [
                    {
                        label: `Jumlah Pasien untuk ${medicineName}`,
                        backgroundColor: '#0A6B77',
                        data: Object.values(hospitalCounts)
                    }
                ]
            }));
        },
        calculateTotalPatientWithMedicine(patients) {
            return patients.length;
        },
    }
}
</script>


<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="flex flex-col max-md:w-[90%] lg:w-4/5 w-full">
            <div class="border-b border-lightgray pt-12 pb-4 ml-4">
                <p class="font-gotham font-bold text-blueblack text-[30px] leading-5">Data Kepemilikan Obat</p>
            </div>

            <div class="flex flex-col lg:flex-row gap-4 py-4 pl-4 max-md:max-w-[90%]">
                <div class="flex flex-col gap-4 lg:w-2/3">
                    <div class="flex flex-col items-center gap-4 bg-white rounded-lg">
                        <div class="border-b border-teal w-full pb-4">
                            <p class="font-assistant text-[24px] font-bold leading-5 text-teal w-full pt-4 pl-8">
                                Grafik Jenis Obat</p>
                            <p class="font-assistant text-[16px] font-normal leading-5 text-charcoalblue w-full pt-2 pl-8">
                                Total Pasien: {{ TotalPatientWithMedicine }}</p>
                        </div>

                        <!-- Date Filter -->
                        <div class="flex justify-center py-4">
                            <div class="flex max-md:flex-col items-center gap-4">
                                <label for="startDate" class="font-bold">Start Date:</label>
                                <input type="date" v-model="startDate" @change="filterData" class="border rounded p-2" />

                                <label for="endDate" class="font-bold">End Date:</label>
                                <input type="date" v-model="endDate" @change="filterData" class="border rounded p-2" />

                                &
                                <label for="category" class="font-bold">Category:</label>
                                <select v-model="selectedCategory" @change="fetchFilteredMedicineData"
                                    class="border rounded p-2">
                                    <option value="">All Categories</option>
                                    <option v-for="(category, index) in categories" :key="index" :value="category">
                                        {{ category }}
                                    </option>
                                </select>

                            </div>
                        </div>
                        <div class="flex w-full max-md:min-w-[90%] overflow-x-auto">
                            <Bar v-if="loaded" :data="MedicineData" :options="MedicineOptions"
                                class="w-full  p-4 max-sm:p-1 min-w-[300px] min-h-[300px] text-white" />
                            <div class="ml-4" v-else>
                                Tabel Sedang Dimuat.....
                            </div>
                        </div>

                        <div class="pb-4"></div>
                    </div>
                    <div class="flex flex-col">
                        <p class="font-bebasneue font-normal text-[24px] text-charcoalgray">Statistik Pasien</p>
                        <div
                            class="bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.04)] px-2 pt-2 items-start flex flex-col">
                            <div class="border-b border-teal w-full pl-2 max-md:max-w-[90%]">
                                <p class="font-hindsiliguri text-teal font-medium text-[12px] leading-[18px] pb-4">Total
                                    Pasien:</p>
                                <p class="font-hindsiliguri text-charcoalgray font-bold text-[32px] leading-[18px] pb-4">{{
                                    TotalPatientWithMedicine }}</p>
                            </div>

                            <div class="my-4">
                                <label for="stockFilter"
                                    class="font-hindsiliguri text-teal font-medium text-[14px] leading-[18px]">Filter batas maksimum obat:</label>
                                <input id="stockFilter" type="number" v-model.number="selectedStock" class="bg-white border border-gray-300 rounded-md py-2 px-3"
                                    placeholder="Masukkan batas maksimum" />
                            </div>

                            <div class="w-full max-md:px-0 px-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr class="hover:bg-[#ddd]">
                                            <th class="th-general">PASIEN</th>
                                            <th class="th-general">OBAT</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">


                                        <!-- Conditionally render the message if no patient data is available -->
                                        <tr v-for="patient in filteredPatientData" :key="patient.id"
                                            class="hover:bg-[#ddd]">
                                            <td class="td-general max-md:pl-3 td-text-general">
                                                {{ patient.Name }}
                                            </td>
                                            <td class="td-general max-md:pl-3">
                                                <div v-for="(medicine, mIndex) in patient.ListMedicine.filter(med => {
                                                    let stockCondition = true;
                                                    if (selectedStock !== null) {
                                                        stockCondition = med.Stock <= selectedStock;
                                                    }
                                                    return stockCondition && new Date(med.Date) <= new Date(new Date().setDate(new Date().getDate() - 7));
                                                })" :key="mIndex" class="flex">
                                                    <p class="td-text-general">- {{ medicine.Name }} ({{ medicine.Stock }})</p>
                                                </div>
                                            </td>
                                        </tr>



                                    </tbody>
                                </table>
                                <div class="mt-4">
                                    <a href="/detaildataumumkepemilikanobat">
                                        <button class="font-opensans text-black flex items-center gap-2 pl-4 pb-4">
                                            Read more
                                            <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45593 9.96851 7.707 9.70856L11.707 5.70856C11.8951 5.52095 12.0008 5.26621 12.0008 5.00056C12.0008 4.7349 11.8951 4.48017 11.707 4.29256L7.707 0.292556C7.31598 -0.097909 6.68247 -0.0974613 6.292 0.293556C5.90153 0.684574 5.90198 1.31809 6.293 1.70856L8.586 4.00156H1C0.447715 4.00156 0 4.44927 0 5.00156C0 5.55384 0.447715 6.00156 1 6.00156Z"
                                                    fill="black" />
                                            </svg>
                                        </button>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col justify-between p-4 bg-seeingstatistics bg-no-repeat bg-center bg-cover rounded-md h-full max-h-[1000px] w-full lg:w-1/3">
                    <div class="flex flex-col gap-4 max-lg:pb-8">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA UMUM KEPEMILIKAN
                            OBAT</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang
                            data umum kepemilikan obat</p>
                    </div>
                    <div>
                        <a href="/detaildataumumkepemilikanobat">
                            <button class="font-opensans text-white flex items-center gap-2 pb-4">
                                Read more
                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45593 9.96851 7.707 9.70856L11.707 5.70856C11.8951 5.52095 12.0008 5.26621 12.0008 5.00056C12.0008 4.7349 11.8951 4.48017 11.707 4.29256L7.707 0.292556C7.31598 -0.097909 6.68247 -0.0974613 6.292 0.293556C5.90153 0.684574 5.90198 1.31809 6.293 1.70856L8.586 4.00156H1C0.447715 4.00156 0 4.44927 0 5.00156C0 5.55384 0.447715 6.00156 1 6.00156Z"
                                        fill="white" />
                                </svg>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>