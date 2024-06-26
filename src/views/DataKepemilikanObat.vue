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
            PoliPerMedicineData: [],
            StatisticsPatientData: [],
            MedicineOptions: this.getMedicineOptions()
        }
    },
    async created() {
        this.loaded = false
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const patientDataPromise = this.fetchPatientData(tokenlogin)
            const medicineDataPromise = this.fetchMedicineData(tokenlogin)

            const [patientData, medicineData] = await Promise.all([patientDataPromise, medicineDataPromise])

            this.StatisticsPatientData = patientData
            this.TotalPatientWithMedicine = medicineData.TotalPatientWithMedicine
            this.MedicineData = this.processMedicineData(medicineData.MedicineList)
            this.HospitalPerMedicineData = this.processHospitalData(medicineData.MedicineList)
            this.PoliPerMedicineData = this.processPoliData(medicineData.MedicineList)

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
        getResponsiveFontSize() {
            const width = window.innerWidth;
            if (width < 640) return 12;  // Font size for small screens (mobile)
            if (width < 1024) return 16; // Font size for medium screens (tablet)
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
                            text: 'Nama Obat',
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
                            text: 'Jumlah',
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
            return response.data.Data
        },
        async fetchMedicineData(token) {
            const toast = useToast()
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list/website'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.Message === "Success to Get Medicine List Website") {
                toast.success('Data obat Pasien berhasil dimuat!')
            }
            console.log(response)
            const data = response.data.Data
            return {
                TotalPatientWithMedicine: data.Total_Patient_Have_Medicine,
                MedicineList: data.Medicine
            }
        },
        processMedicineData(medicineList) {
            const MedicineNameData = medicineList.map(item => item.Medicine_Name)
            const TotalPatientData = medicineList.map(item => item.Total_Patient)
            const backgroundColors = medicineList.map(() => this.generateRandomColor())

            return {
                labels: MedicineNameData,
                datasets: [
                    {
                        label: 'Jumlah Pasien',
                        color: '#FF6384',
                        backgroundColor: backgroundColors,
                        data: Object.values(TotalPatientData)
                    }
                ]
            }
        },
        processHospitalData(medicineList) {
            const HospitalPerDoctorCount = medicineList.reduce((acc, doctor) => {
                const hospitalName = doctor.HospitalName
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
        processPoliData(medicineList) {
            const PoliPerDoctorCount = medicineList.reduce((acc, doctor) => {
                const polyName = doctor.PolyName
                acc[polyName] = (acc[polyName] || 0) + 1
                return acc
            }, {})

            const labels = Object.keys(PoliPerDoctorCount)
            const data = Object.values(PoliPerDoctorCount)

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
            return '#' + Math.floor(Math.random() * 16777215).toString(16)
        }
    }
}
</script>


<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar class="lg:w-1/5" />

        <div class="flex flex-col lg:w-4/5 w-full">
            <div class="border-b border-lightgray pt-12 pb-4 ml-4">
                <p class="font-gotham font-bold text-blueblack text-[30px] leading-5">Data Kepemilikan Obat</p>
            </div>

            <div class="flex flex-col lg:flex-row gap-4 py-4 pl-4">
                <div class="flex flex-col gap-4 lg:w-2/3">
                    <div class="flex flex-col items-center gap-4 bg-white rounded-lg">
                        <div class="border-b border-teal w-full pb-4">
                            <p class="font-assistant text-[24px] font-bold leading-5 text-teal w-full pt-4 pl-8">
                                Grafik Jenis Obat</p>
                            <p class="font-assistant text-[16px] font-normal leading-5 text-charcoalblue w-full pt-2 pl-8">
                                Total Pasien: {{ TotalPatientWithMedicine }}</p>
                        </div>

                        <div class="flex w-full overflow-x-auto">
                            <Bar v-if="loaded" :data="MedicineData" :options="MedicineOptions"
                                class="w-full p-4 max-sm:p-1 min-w-[300px] min-h-[300px] max-h-[550px] text-white" />
                            <div v-else>
                                Tabel Sedang Dimuat.....
                            </div>
                        </div>

                        <div class="pb-4"></div>
                    </div>
                    <div class="flex flex-col">
                        <p class="font-bebasneue font-normal text-[24px] text-charcoalgray">Statistik Pasien</p>
                        <div
                            class="bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.04)] px-2 pt-2 items-start flex flex-col">
                            <div class="border-b border-teal w-full pl-2">
                                <p class="font-hindsiliguri text-teal font-medium text-[12px] leading-[18px] pb-4">Total
                                    Pasien:</p>
                                <p class="font-hindsiliguri text-charcoalgray font-bold text-[32px] leading-[18px] pb-4">{{
                                    TotalPatientWithMedicine }}</p>
                            </div>

                            <div class="w-full px-4 overflow-x-auto">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr class="hover:bg-[#ddd]">
                                            <th
                                                class="px-6 py-3 text-left text-[20px] font-extrabold text-black font-assistant uppercase tracking-wider">
                                                PASIEN</th>
                                            <th
                                                class="px-6 py-3 text-left text-[20px] font-extrabold text-black font-assistant uppercase tracking-wider">
                                                OBAT</th>
                                            <th
                                                class="px-6 py-3 text-left text-[20px] font-extrabold text-black font-assistant uppercase tracking-wider">
                                                JUMLAH</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        <tr v-for="patient in StatisticsPatientData" :key="patient.id"
                                            class="hover:bg-[#ddd]">
                                            <td
                                                class="px-6 py-4 whitespace-nowrap font-normal font-assistant text-black text-[20px]">
                                                {{ patient.Name }}</td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div v-for="(medicine, mIndex) in patient.ListMedicine.filter(med => med.Stock < 10)"
                                                    :key="mIndex" class="flex">
                                                    <p class="font-normal font-assistant text-black text-[20px]">- {{
                                                        medicine.Name }}</p>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 whitespace-nowrap">
                                                <div v-for="(medicine, mIndex) in patient.ListMedicine.filter(med => med.Stock < 10)"
                                                    :key="mIndex" class="flex py-[0.2rem]">
                                                    <p class="font-bold font-assistant text-black text-[20px]">{{
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
                    <div class="flex flex-col gap-4">
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

