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
            MedicineData: [],
            TotalPatientWithMedicine: 0,
            HospitalPerMedicineData: [],
            StatisticsPatientData: [],
            MedicineOptions: this.getMedicineOptions(),
            startDate: '',
            endDate: '',
            categories: [], // Add this line
            selectedCategory: '' // Add this line
        }
    },
    async created() {
        this.loaded = false
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            await this.fetchCategories(tokenlogin) // Fetch categories on creation
            const patientDataPromise = this.fetchPatientData(tokenlogin)
            const medicineDataPromise = this.fetchMedicineData(tokenlogin)
            const [patientData, medicineData] = await Promise.all([patientDataPromise, medicineDataPromise])
            this.StatisticsPatientData = this.getRandomFilteredPatients(patientData, 3)
            this.TotalPatientWithMedicine = this.calculateTotalPatientWithMedicine(patientData)
            this.MedicineData = this.processMedicineData(patientData)
            this.HospitalPerMedicineData = this.processHospitalData(patientData)

            this.loaded = true
        } catch (error) {
            console.error(error.message)
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
        }

        // Add resize event listener to update chart font sizes on window resize
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
    methods: {
        async fetchFilteredMedicineData() {
            const startDateObj = new Date(this.startDate);
            const endDateObj = new Date(this.endDate);

            if (startDateObj > endDateObj) {
                const toast = useToast();
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
                return;
            }

            if (this.startDate && this.endDate) {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                try {
                    const params = {
                        startDate: this.startDate,
                        endDate: this.endDate,
                        category: this.selectedCategory || '' // Pastikan parameter ini dikirim
                    };
                    const patientData = await this.fetchPatientData(tokenlogin, params);
                    this.TotalPatientWithMedicine = this.calculateTotalPatientWithMedicine(patientData);
                    this.MedicineData = this.processMedicineData(patientData);
                    this.HospitalPerMedicineData = this.processHospitalData(patientData);
                } catch (error) {
                    console.error(error.message);
                    const toast = useToast();
                    if (error.message === "Request failed with status code 401") {
                        toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                    }
                }
            }
        },
        getResponsiveFontSize() {
            const width = window.innerWidth;
            if (width < 640) return 10;  // Font size for small screens (mobile)
            if (width < 1024) return 14; // Font size for medium screens (tablet)
            return 20;                   // Font size for large screens (desktop)
        },
        getMedicineOptions() {
            const fontSize = this.getResponsiveFontSize();
            return {
                indexAxis: 'y',
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',  // Mengubah warna font pada sumbu X
                            font: {
                                size: fontSize  // Menggunakan ukuran font responsif
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
                            color: '#222539',  // Mengubah warna font pada sumbu Y
                            font: {
                                size: fontSize  // Menggunakan ukuran font responsif
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
            const toast = useToast()
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list_patient/website'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.Message === "Success to Get Patient Medicine List Website") {
                toast.success('Data pasien berhasil dimuat!')
            }
            console.log(response)
            return response.data.Data
        },
        async fetchMedicineData(token, params = {}) {
            const toast = useToast();
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list/website';
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params
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
                const toast = useToast();
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

        processMedicineData(patientData) { // data sudah disesuaikan kembali namun filter dropdown dan tanggal masih berantakan
        const medicineList = patientData.flatMap(patient => patient.ListMedicine);

        // Hitung jumlah kemunculan setiap nama obat
        const medicineCount = medicineList.reduce((acc, item) => {
            acc[item.Name] = (acc[item.Name] || 0) + 1;
            return acc;
        }, {});

        // Siapkan data untuk chart
        const labels = Object.keys(medicineCount);
        const data = Object.values(medicineCount);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Jumlah Pasien',
                    color: '#0A6B77',
                    backgroundColor: '#0A6B77',
                    data: data
                }
            ]
        };
    },

        processHospitalData(patientData) {
            const medicineList = patientData.flatMap(patient => patient.ListMedicine);
            const HospitalPerDoctorCount = medicineList.reduce((acc, medicine) => {
                const hospitalName = medicine.Category; // Adjusted based on response
                acc[hospitalName] = (acc[hospitalName] || 0) + 1
                return acc
            }, {})
            const labels = Object.keys(HospitalPerDoctorCount)
            const data = Object.values(HospitalPerDoctorCount)
            return {
                labels: labels,
                datasets: [
                    {
                        label: 'Jumlah Dokter',
                        backgroundColor: '#0A6B77',
                        data: data
                    }
                ]
            }
        },
        generateRandomColor() {
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 50) + 50; // Saturation between 50% and 100%
            const lightness = Math.floor(Math.random() * 30) + 50; // Lightness between 50% and 80%
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        },
        calculateTotalPatientWithMedicine(patientData) {
            const medicineList = patientData.flatMap(patient => patient.ListMedicine);
            return medicineList.reduce((total, medicine) => total + medicine.Stock, 0);
        },
        getRandomFilteredPatients(patientData, maxPatients) {
            // Get today's date and subtract 30 days
            const today = new Date();
            const dateLimit = new Date(today.setDate(today.getDate() - 30));

            // Function to convert "YYYY-MM-DD HH:MM:SS" to a JavaScript Date object
            const parseDateString = (dateString) => {
                const [datePart, timePart] = dateString.split(' ');
                const [year, month, day] = datePart.split('-').map(Number);
                const [hour, minute, second] = timePart.split(':').map(Number);
                return new Date(year, month - 1, day, hour, minute, second);
            };

            // Filter patients who have at least one medicine with stock below 10
            // and the date is more than 30 days old
            const filteredPatients = patientData.filter(patient =>
                patient.ListMedicine.some(medicine =>
                    medicine.Stock < 10 && parseDateString(medicine.Date) <= dateLimit
                )
            );

            // Shuffle the filtered patients
            for (let i = filteredPatients.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filteredPatients[i], filteredPatients[j]] = [filteredPatients[j], filteredPatients[i]];
            }

            // Return up to maxPatients
            return filteredPatients.slice(0, maxPatients);
        }
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
                                <input type="date" v-model="startDate" @change="fetchFilteredMedicineData"
                                    class="border rounded p-2" />

                                <label for="endDate" class="font-bold">End Date:</label>
                                <input type="date" v-model="endDate" @change="fetchFilteredMedicineData"
                                    class="border rounded p-2" />

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

                            <div class="w-full max-md:px-0 px-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr class="hover:bg-[#ddd]">
                                            <th class="th-general">
                                                PASIEN</th>
                                            <th class="th-general">
                                                OBAT</th>
                                            <th class="th-general">
                                                JUMLAH</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <!-- Conditionally render the message if no patient data is available -->
                                        <tr v-if="StatisticsPatientData.length === 0" class="hover:bg-[#ddd]">
                                            <td colspan="3" class="text-center text-[20px] py-4">Belum ada pasien yang
                                                kekurangan obat
                                            </td>
                                        </tr>
                                        <tr v-for="patient in StatisticsPatientData" :key="patient.id"
                                            class="hover:bg-[#ddd]">
                                            <td class="td-general max-md:pl-3 td-text-general">
                                                {{ patient.Name }}</td>
                                            <td class="td-general max-md:pl-3">
                                                <div v-for="(medicine, mIndex) in patient.ListMedicine.filter(med => med.Stock < 10)"
                                                    :key="mIndex" class="flex">
                                                    <p class="td-text-general">- {{
                                                        medicine.Name }}</p>
                                                </div>
                                            </td>
                                            <td class="td-general max-md:pl-3">
                                                <div v-for="(medicine, mIndex) in patient.ListMedicine.filter(med => med.Stock < 10)"
                                                    :key="mIndex" class="flex py-[0.2rem]">
                                                    <p class="td-text-general">{{
                                                        medicine.Stock }}</p>
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