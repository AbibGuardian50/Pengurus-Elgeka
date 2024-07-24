<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    data() {
        return {
            startDateSystole: '',
            endDateSystole: '',
            startDateDiastole: '',
            endDateDiastole: '',
            loaded: false,
            allData: [], // To store all data
            DataLabSystole: { labels: [], datasets: [] },
            DataLabDiastole: { labels: [], datasets: [] },
            HasilLabBloodPressureOptions: {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 40, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Nilai',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 14), 22),
                                weight: 'bold'
                            })
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 40, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 14), 22),
                                weight: 'bold'
                            })
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 30, 14), 22)
                        }),
                        bodyFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 40, 12), 20)
                        })
                    },
                    legend: {
                        labels: false,
                    }
                }
            },
        }
    },
    created() {
        this.loadData();
        window.addEventListener('resize', this.updateChartFontSize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateChartFontSize);
    },
    methods: {
        async loadData() {
            try {
                const toast = useToast();
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/blood_pressure';
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                });
                if (response.data.Message === "Success to Get Blood Pressure Data") {
                    toast.success('Data Hasil Lab Blood Pressure Berhasil Dimuat');
                }
                this.allData = response.data.Data || [];
                this.filterData(); // Filter data based on the date range

            } catch (error) {
                const toast = useToast();
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                }
                console.error(error);
            }
        },
        filterData() {
            const toast = useToast();

            // Validation for date
            const startDateSystoleObj = new Date(this.startDateSystole);
            const endDateSystoleObj = new Date(this.endDateSystole);
            if (this.startDateSystole && this.endDateSystole && startDateSystoleObj > endDateSystoleObj) {
                toast.error('Tanggal mulai systole tidak boleh lebih besar dari tanggal akhir systole');
                return;
            }

            // Filter for DataLabSystole
            const filteredDataSystole = this.allData.filter(item => {
                const itemDate = new Date(item.Date); // Replace with the correct date field
                const start = this.startDateSystole ? new Date(this.startDateSystole) : null;
                const end = this.endDateSystole ? new Date(this.endDateSystole) : null;

                if (start && end) {
                    return itemDate >= start && itemDate <= end;
                } else if (start) {
                    return itemDate >= start;
                } else if (end) {
                    return itemDate <= end;
                } else {
                    return true;
                }
            });

            const DataLabSystoleCounts = {
                '< 90': 0,
                '90 - 120': 0,
                '> 120': 0
            };

            filteredDataSystole.forEach(item => {
                if (item.DataSys < 90) {
                    DataLabSystoleCounts['< 90']++;
                } else if (item.DataSys <= 120) {
                    DataLabSystoleCounts['90 - 120']++;
                } else {
                    DataLabSystoleCounts['> 120']++;
                }
            });

            const chartDataSys = {
                labels: Object.keys(DataLabSystoleCounts),
                datasets: [{
                    label: 'Systole',
                    backgroundColor: [
                        '#FFD700', // yellow for < 90
                        '#008000', // green for 90 - 120
                        '#FF0000'  // red for > 120
                    ],
                    borderWidth: 1,
                    data: Object.values(DataLabSystoleCounts),
                }],
            };
            this.DataLabSystole = chartDataSys;

            // Filter for DataLabDiastole
            const filteredDataDiastole = this.allData.filter(item => {
                const itemDate = new Date(item.Date); // Replace with the correct date field
                const start = this.startDateDiastole ? new Date(this.startDateDiastole) : null;
                const end = this.endDateDiastole ? new Date(this.endDateDiastole) : null;

                if (start && end) {
                    return itemDate >= start && itemDate <= end;
                } else if (start) {
                    return itemDate >= start;
                } else if (end) {
                    return itemDate <= end;
                } else {
                    return true;
                }
            });

            const DataLabDiastoleCounts = {
                '< 60': 0,
                '60 - 80': 0,
                '> 80': 0
            };

            filteredDataDiastole.forEach(item => {
                if (item.DataDia < 60) {
                    DataLabDiastoleCounts['< 60']++;
                } else if (item.DataDia <= 80) {
                    DataLabDiastoleCounts['60 - 80']++;
                } else if (item.DataDia > 80) {
                    DataLabDiastoleCounts['> 80']++;
                }
            });

            const chartDataDia = {
                labels: Object.keys(DataLabDiastoleCounts),
                datasets: [{
                    label: 'Diastole',
                    backgroundColor: [
                        '#FFD700', // yellow for < 60
                        '#008000', // green for 60 - 80
                        '#FF0000'  // red for > 80
                    ],
                    borderWidth: 1,
                    data: Object.values(DataLabDiastoleCounts),
                }],
            };
            this.DataLabDiastole = chartDataDia;

            this.loaded = true;
            this.updateChartFontSize();
        },
        getChartOptions() {
            return {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: {
                                size: this.getFontSize()
                            }
                        },
                        title: {
                            display: true,
                            text: 'Nilai',
                            font: {
                                size: this.getFontSize() + 2,
                                weight: 'bold'
                            }
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: {
                                size: this.getFontSize()
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: {
                                size: this.getFontSize() + 2,
                                weight: 'bold'
                            }
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: {
                            size: this.getFontSize() + 2
                        },
                        bodyFont: {
                            size: this.getFontSize()
                        }
                    },
                    legend: {
                        labels: false,
                    }
                }
            };
        },
        getFontSize() {
            const minSize = 12;
            const maxSize = 20;
            const chartWidth = window.innerWidth * 0.6;
            return Math.min(Math.max(chartWidth / 40, minSize), maxSize);
        },
        updateChartFontSize() {
            this.HasilLabBloodPressureOptions = this.getChartOptions();
        },
    },
    components: {
        Sidebar,
        Bar
    }
}
</script>


<template>
    <div class="flex bg-offwhite h-full">
        <Sidebar />
        <div class="flex flex-col flex-grow p-4">
            <div class="flex flex-col md:flex-row gap-2">
                <div class="flex gap-2 flex-col md:gap-4 max-md:items-center justify-between max-[600px]:w-full">
                    <div
                        class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 max-sm:p-2 w-full md:w-2/3 lg:w-[100%]">
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA BLOOD PRESSURE (SYSTOL)
                        </p>
                        <div class="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="startDate" class="text-sm font-semibold font-poppins text-gray-700">Mulai
                                    Tanggal:</label>
                                <input type="date" id="startDateSystole" v-model="startDateSystole"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="endDate" class="text-sm font-semibold font-poppins text-gray-700">Akhir
                                    Tanggal:</label>
                                <input type="date" id="endDateSystole" v-model="endDateSystole"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <button @click="filterData"
                                class="px-4 py-2 bg-teal text-white rounded-md shadow-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto">
                                Terapkan
                            </button>
                        </div>
                        <div class="w-full h-auto">
                            <Bar v-if="loaded" :data="DataLabSystole" :options="HasilLabBloodPressureOptions"
                                class="w-full" />
                        </div>
                    </div>
                    <div
                        class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 max-sm:p-2 w-full md:w-2/3 lg:w-[100%]">
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA BLOOD PRESSURE (DIASTOL)
                        </p>
                        <div class="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="startDate" class="text-sm font-semibold font-poppins text-gray-700">Mulai
                                    Tanggal:</label>
                                <input type="date" id="startDate" v-model="startDateDiastole"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="endDate" class="text-sm font-semibold font-poppins text-gray-700">Akhir
                                    Tanggal:</label>
                                <input type="date" id="endDate" v-model="endDateDiastole"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <button @click="filterData"
                                class="px-4 py-2 bg-teal text-white rounded-md shadow-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto">
                                Terapkan
                            </button>
                        </div>
                        <div class="w-full h-auto">
                            <Bar v-if="loaded" :data="DataLabDiastole" :options="HasilLabBloodPressureOptions"
                                class="w-full" />
                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col justify-between p-4 bg-cover bg-center bg-work rounded-md h-full w-full md:w-1/3 lg:w-1/2 mt-4 md:mt-0">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA BLOOD PRESSURE
                            KESELURUHAN</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            BLOOD PRESSURE</p>
                    </div>
                    <div class="flex items-center justify-end">
                        <a href="/DetailHasilLabbloodpressure" target="_blank">
                            <button class="font-opensans text-white flex items-center gap-2 pb-4">Read more
                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45592 9.96857 7.707 9.70856L11.707 5.70856C11.8945 5.52106 12 5.26938 12 5.00156C12 4.73375 11.8945 4.48206 11.707 4.29456L7.707 0.294563C7.45592 0.0345405 7.08412 -0.0696805 6.73449 0.0218439C6.38486 0.113368 6.11182 0.386413 6.0203 0.736036C5.92879 1.08566 6.03304 1.45746 6.293 1.70856L8.586 3.00156H1C0.447715 3.00156 0 3.44928 0 4.00156C0 4.55384 0.447715 5.00156 1 5.00156V6.00156Z"
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
