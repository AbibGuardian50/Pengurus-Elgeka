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
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/hemoglobin'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (response.data.Message === "Success to Get Hemoglobin Data") {
                toast.success('Data Hasil Lab Hemoglobin Berhasil Dimuat');
            }
            const responseData = response.data.Data;

            // Menghitung jumlah kemunculan setiap nilai Data
            const DataLabHemoglobinCounts = {
                '9 <': 0,
                '9-11': 0,
                '11-13': 0,
                '13-15': 0,
                '15-17': 0,
                '17 >': 0,
            };
            responseData.forEach(item => {
                const DataLabHemoglobin = item.Data;
                if (DataLabHemoglobin !== 0 && DataLabHemoglobin !== null) {
                    if (DataLabHemoglobin < 9) {
                        DataLabHemoglobinCounts['9 <']++;
                    } else if (DataLabHemoglobin <= 11) {
                        DataLabHemoglobinCounts['9-11']++;
                    } else if (DataLabHemoglobin <= 13) {
                        DataLabHemoglobinCounts['11-13']++;
                    } else if (DataLabHemoglobin <= 15) {
                        DataLabHemoglobinCounts['13-15']++;
                    } else if (DataLabHemoglobin <= 17) {
                        DataLabHemoglobinCounts['15-17']++;
                    } else if (DataLabHemoglobin > 17) {
                        DataLabHemoglobinCounts['17 >']++;
                    }
                }
            });

            // Persiapkan data untuk chart
            const chartData = {
                labels: Object.keys(DataLabHemoglobinCounts),
                datasets: [{
                    label: 'Jumlah Orang',
                    backgroundColor: '#0A6B77',
                    borderWidth: 1,
                    data: Object.values(DataLabHemoglobinCounts),
                }],
            };

            this.DataLabHemoglobin = chartData;
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
            DataLabHemoglobin: null, // Ganti menjadi null untuk menunjukkan bahwa data belum dimuat
            HasilLabHemoglobinOptions: {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',  // Mengubah warna font pada sumbu X
                            font: {
                                size: 14  // Mengubah ukuran font pada sumbu X
                            }
                        },
                        title: {
                            display: true,
                            text: 'Nilai',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',  // Mengubah warna font pada sumbu Y
                            font: {
                                size: 14  // Mengubah ukuran font pada sumbu Y
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: {
                            size: 16,
                        },
                        bodyFont: {
                            size: 14,
                        }
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
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
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="flex flex-col gap-4 pt-4 pl-4 w-full">
            <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 w-full md:w-2/3">
                    <p
                        class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 border-b border-[#3347E6]">
                        GRAFIK DATA HEMOGLOBIN</p>
                    <Bar v-if="loaded" :data="DataLabHemoglobin" :options="HasilLabHemoglobinOptions"
                        class="w-full h-64 md:h-96" />
                </div>

                <div
                    class="flex flex-col justify-between p-4 bg-work bg-no-repeat bg-center bg-cover h-full rounded-md w-full md:w-1/3">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA HEMOGLOBIN KESELURUHAN
                        </p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            Hemoglobin</p>
                    </div>
                    <div class="">
                        <a href="/DetailHasilLabHemoglobin">
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
