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
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/blood_pressure'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (response.data.Message === "Success to Get Blood Pressure Data") {
                toast.success('Data Hasil Lab Blood Pressure Berhasil Dimuat');
            }
            const responseData = response.data.Data;

            // Menghitung tekanan darah berdasar DataSys
            const DataLabBcrAblCountsDataSys = {};
            responseData.forEach(item => {
                const dataValue = item.DataSys.toString(); // Ubah menjadi string untuk konsistensi
                if (DataLabBcrAblCountsDataSys[dataValue]) {
                    DataLabBcrAblCountsDataSys[dataValue]++;
                } else {
                    DataLabBcrAblCountsDataSys[dataValue] = 1;
                }
            });

            const DataLabBcrAblCountsDataDia = {};
            responseData.forEach(item => {
                const dataValue = item.DataDia.toString(); // Ubah menjadi string untuk konsistensi
                if (DataLabBcrAblCountsDataDia[dataValue]) {
                    DataLabBcrAblCountsDataDia[dataValue]++;
                } else {
                    DataLabBcrAblCountsDataDia[dataValue] = 1;
                }
            });
            const chartDataDia = {
                labels: Object.keys(DataLabBcrAblCountsDataDia),
                datasets: [{
                    label: 'Data Dia',
                    backgroundColor: '#56B4E9',
                    borderWidth: 1,
                    data: Object.values(DataLabBcrAblCountsDataDia),
                }],
            };
            this.DataLabBcrAblDataDia = chartDataDia;


            // Persiapkan data untuk chart
            const chartDataSys = {
                labels: Object.keys(DataLabBcrAblCountsDataSys),
                datasets: [{
                    label: 'Data Sys',
                    backgroundColor: '#56B4E9',
                    borderWidth: 1,
                    data: Object.values(DataLabBcrAblCountsDataSys),
                }],
            };

            this.DataLabBcrAbl = chartDataSys;
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
            DataLabBcrAbl: null, // Ganti menjadi null untuk menunjukkan bahwa data belum dimuat
            DataLabBcrAblDataDia: null,
            HasilLabBloodPressureOptions: {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',  // Mengubah warna font pada sumbu X
                            font: {
                                size: 20  // Mengubah ukuran font pada sumbu X
                            }
                        },
                        title: {
                            display: true,
                            text: 'Nilai',
                            font: {
                                size: 22,
                                weight: 'bold'
                            }
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',  // Mengubah warna font pada sumbu X
                            font: {
                                size: 20  // Mengubah ukuran font pada sumbu X
                            }
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: {
                                size: 22,
                                weight: 'bold'
                            }
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: {
                            size: 22,
                        },
                        bodyFont: {
                            size: 22,
                        }
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: {
                                size: 22,
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

        <div class="flex flex-col gap-4 pt-4 pl-4">
            <div class="flex gap-4 items-center">
                <div class="flex flex-col items-center justify-center gap-4 rounded-lg pl-4 pr-8">
                    <div class="mb-4 bg-white">
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA TEKANAN DARAH (DataSys)</p>
                        <Bar v-if="loaded" :data="DataLabBcrAbl" :options="HasilLabBloodPressureOptions"
                            class="min-w-[700px] max-w-[1000px] min-h-[350px] max-h-[650px] text-white ml-8" />
                    </div>

                    <div class="bg-white">
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA TEKANAN DARAH (DataDia)</p>
                        <Bar v-if="loaded" :data="DataLabBcrAblDataDia" :options="HasilLabBloodPressureOptions"
                            class="min-w-[700px] max-w-[1000px] min-h-[350px] max-h-[650px] text-white ml-8" />
                    </div>

                </div>

                <div
                    class="flex flex-col justify-between pl-4 bg-work bg-no-repeat bg-center bg-cover rounded-md min-w-[400px] max-w-[650px] min-h-[700px] max-h-[1000px]">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA BLOOD PRESSURE KESELURUHAN
                        </p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            Blood Pressure</p>
                    </div>
                    <div class="">
                        <a href="/DetailHasilLabBloodPressure"><button
                                class="font-opensans text-white flex items-center gap-2 pb-4">Read
                                more <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45593 9.96851 7.707 9.70856L11.707 5.70856C11.8951 5.52095 12.0008 5.26621 12.0008 5.00056C12.0008 4.7349 11.8951 4.48017 11.707 4.29256L7.707 0.292556C7.31598 -0.097909 6.68247 -0.0974613 6.292 0.293556C5.90153 0.684574 5.90198 1.31809 6.293 1.70856L8.586 4.00156H1C0.447715 4.00156 0 4.44927 0 5.00156C0 5.55384 0.447715 6.00156 1 6.00156Z"
                                        fill="white" />
                                </svg>
                            </button></a>
                    </div>
                </div>
        </div>
    </div>
</div></template>
