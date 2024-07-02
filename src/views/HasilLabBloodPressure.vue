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
            loaded: false,
            DataLabSystole: { labels: [], datasets: [] },
            DataLabDiastole: { labels: [], datasets: [] },
            HasilLabBloodPressureOptions: this.getChartOptions(),
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
                const responseData = response.data.Data || [];

                const DataLabSystoleCounts = {
                    '< 90': 0,
                    '90 - 120': 0,
                    '> 120': 0
                };
                const DataLabDiastoleCounts = {
                    '< 60': 0,
                    '60 - 80': 0,
                    '> 80': 0
                };

                responseData.forEach(item => {
                    if (item.DataSys < 90) {
                        DataLabSystoleCounts['< 90']++;
                    } else if (item.DataSys <= 120) {
                        DataLabSystoleCounts['90 - 120']++;
                    } else {
                        DataLabSystoleCounts['> 120']++;
                    }

                    if (item.DataDia < 60) {
                        DataLabDiastoleCounts['< 60']++;
                    } else if (item.DataDia <= 80) {
                        DataLabDiastoleCounts['60 - 80']++;
                    } else {
                        DataLabDiastoleCounts['> 80']++;
                    }
                });

                const chartDataSys = {
                    labels: Object.keys(DataLabSystoleCounts),
                    datasets: [{
                        label: 'Data Sys',
                        backgroundColor: [
                        '#FFD700', // kuning untuk < 0.001
                        '#008000', // hijau untuk 0.001 - 10
                        '#FF0000'  // merah untuk > 10
                    ],
                        borderWidth: 1,
                        data: Object.values(DataLabSystoleCounts),
                    }],
                };
                this.DataLabSystole = chartDataSys;

                const chartDataDia = {
                    labels: Object.keys(DataLabDiastoleCounts),
                    datasets: [{
                        label: 'Data Dia',
                        backgroundColor: [
                        '#FFD700', // kuning untuk < 0.001
                        '#008000', // hijau untuk 0.001 - 10
                        '#FF0000'  // merah untuk > 10
                    ],
                        borderWidth: 1,
                        data: Object.values(DataLabDiastoleCounts),
                    }],
                };
                this.DataLabDiastole = chartDataDia;

                this.loaded = true;
                this.updateChartFontSize();
            } catch (error) {
                const toast = useToast();
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                }
                console.error(error);
            }
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
                            size: this.getFontSize() + 2,
                        },
                        bodyFont: {
                            size: this.getFontSize(),
                        }
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: {
                                size: this.getFontSize() + 2,
                                weight: 'bold'
                            }
                        }
                    }
                }
            };
        },
        getFontSize() {
            const width = window.innerWidth;
            if (width < 640) {
                return 12; // mobile
            } else if (width < 1024) {
                return 16; // tablet
            } else {
                return 20; // desktop
            }
        },
        updateChartFontSize() {
            this.HasilLabBloodPressureOptions = this.getChartOptions();
        }
    },
    components: {
        Sidebar,
        Bar,
    },
    name: 'BarChart',
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar class="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 bg-white" />
        <div class="flex flex-col flex-grow p-4">
            <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="flex flex-col items-center justify-center gap-4 w-full md:w-3/4 lg:w-4/5">
                    <div class="mb-4 bg-white w-full">
                        <p
                            class="font-assistant text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA TEKANAN DARAH (DataSys)
                        </p>
                        <Bar v-if="loaded" :data="DataLabSystole" :options="HasilLabBloodPressureOptions"
                            class="w-full h-96 md:h-[450px] lg:h-[550px] text-white sm:ml-2" />
                    </div>

                    <div class="bg-white w-full">
                        <p
                            class="font-assistant text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA TEKANAN DARAH (DataDia)
                        </p>
                        <Bar v-if="loaded" :data="DataLabDiastole" :options="HasilLabBloodPressureOptions"
                            class="w-full h-96 md:h-[450px] lg:h-[550px] text-white sm:ml-2" />
                    </div>
                </div>

                <div
                    class="flex flex-col justify-between p-4 bg-work bg-no-repeat bg-center bg-cover rounded-md w-full md:w-1/4 lg:w-1/5 min-h-full max-md:min-h-[200px] max-h-[1000px]">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-sm sm:text-base md:text-lg">DATA BLOOD
                            PRESSURE KESELURUHAN</p>
                        <p class="font-opensans text-white font-normal text-sm sm:text-base md:text-lg">Baca lebih lanjut
                            tentang data Blood Pressure</p>
                    </div>
                    <div>
                        <a href="/DetailHasilLabBloodPressure">
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
