<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { useToast } from 'vue-toastification';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    async created() {
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/heart_rate'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            console.log(response)
            if (response.data.Message === "Success to Get Heart Rate Data") {
                toast.success('Data Hasil Lab Heart Rate Berhasil Dimuat');
            }
            const responseData = response.data.Data;

            // Menghitung jumlah kemunculan setiap nilai Data
            const DataLabHeartRateCounts = {
                '60-80': 0,
                '81-100': 0,
                '101-120': 0,
                '121-140': 0,
                '141-160': 0,
                '161-180': 0,
                '180 >': 0,
            };
            responseData.forEach(item => {
                const DataLabHeartRate = item.Data;
                if (DataLabHeartRate !== 0 && DataLabHeartRate !== null) {
                    if (DataLabHeartRate < 80) {
                        DataLabHeartRateCounts['60-80']++;
                    } else if (DataLabHeartRate <= 100) {
                        DataLabHeartRateCounts['81-100']++;
                    } else if (DataLabHeartRate <= 120) {
                        DataLabHeartRateCounts['101-120']++;
                    } else if (DataLabHeartRate <= 140) {
                        DataLabHeartRateCounts['121-140']++;
                    } else if (DataLabHeartRate <= 160) {
                        DataLabHeartRateCounts['141-160']++;
                    } else if (DataLabHeartRate <= 180) {
                        DataLabHeartRateCounts['161-180']++;
                    } else if (DataLabHeartRate > 180) {
                        DataLabHeartRateCounts['180 >']++;
                    }
                }
            });

            // Persiapkan data untuk chart
            const chartData = {
                labels: Object.keys(DataLabHeartRateCounts),
                datasets: [{
                    label: 'Jumlah Orang',
                    backgroundColor: '#0A6B77',
                    borderWidth: 1,
                    data: Object.values(DataLabHeartRateCounts),
                }],
            };

            this.DataLabHeartRate = chartData;
            this.loaded = true; // Setelah data dimuat berhasil
        } catch (error) {
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
            console.error(error);
        }
    },
    components: {
        Sidebar,
        Bar,
    },
    data() {
        return {
            loaded: false,
            DataLabHeartRate: null, // Ganti menjadi null untuk menunjukkan bahwa data belum dimuat
            HasilLabHeartRateOptions: {
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
                        labels: {
                            color: "#222539",
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 40, 12), 20),
                                weight: 'bold'
                            })
                        }
                    }
                }
            },
        }
    },
    name: 'BarChart',
}
</script>

<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />
        <div class="flex flex-col flex-grow p-4">
            <div class="flex flex-col md:flex-row md:gap-4 items-center justify-between">
                <div
                    class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 w-full md:w-2/3 lg:w-1/2">
                    <p
                        class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                        GRAFIK DATA HEART RATE</p>
                    <Bar v-if="loaded" :data="DataLabHeartRate" :options="HasilLabHeartRateOptions" class="w-full h-auto" />
                </div>
                <div
                    class="flex flex-col justify-between p-4 bg-cover bg-center bg-work rounded-md h-auto w-full md:w-1/3 lg:w-1/2">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA HEART RATE KESELURUHAN
                        </p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            Heart Rate</p>
                    </div>
                    <div class="flex items-center justify-end">
                        <a href="/DetailHasilLabHeartRate">
                            <button class="font-opensans text-white flex items-center gap-2 pb-4">Read more
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
</div></template>

<style>/* Custom Tailwind CSS styles can go here if needed */</style>
