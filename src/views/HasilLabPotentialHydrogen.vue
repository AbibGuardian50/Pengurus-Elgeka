<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useToast } from 'vue-toastification';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    async created() {
        await this.fetchData(); // Load data initially when the component is created
    },
    components: {
        Sidebar,
        Bar,
    },
    data() {
        return {
            startDate: '',
            endDate: '',
            loaded: false,
            allData: [], // Store all data
            DataLabPotentialHydrogen: null, // Set to null initially to indicate data not loaded
            HasilLabPotentialHydrogenOptions: {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539', // Change font color on x-axis
                            font: {
                                size: 14 // Change font size on x-axis
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
                            color: '#222539', // Change font color on y-axis
                            font: {
                                size: 14 // Change font size on y-axis
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
    methods: {
        async fetchData() {
            try {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/potential_hydrogen';
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                });
                const responseData = response.data.Data;
                const toast = useToast();
                if (response.data.Message === "Success to Get Potential Hydrogen Data") {
                    toast.success('Data Hasil Lab Potential Hydrogen Berhasil Dimuat');
                }
                if (response.data.ErrorMessage === 'Failed to parse token') {
                    toast.error('Token invalid, mohon untuk login kembali');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }

                // Save all data
                this.allData = responseData;
                this.filterData(); // Filter data based on date

            } catch (error) {
                const toast = useToast();
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                }
                console.error(error);
            }
        },
        filterData() {
            // Filter data based on date
            const filteredData = this.allData.filter(item => {
                const itemDate = new Date(item.Date); // Change to the appropriate date field
                const start = this.startDate ? new Date(this.startDate) : null;
                const end = this.endDate ? new Date(this.endDate) : null;

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

            // Count occurrences of each Data value
            const DataLabPotentialHydrogenCounts = {
                '< 7.35': 0,
                '7.35 - 7.45': 0,
                '> 7.45': 0,
            };
            filteredData.forEach(item => {
                const DataLabPotentialHydrogen = item.Data;
                if (DataLabPotentialHydrogen !== 0 && DataLabPotentialHydrogen !== null) {
                    if (DataLabPotentialHydrogen < 7.35) {
                        DataLabPotentialHydrogenCounts['< 7.35']++;
                    } else if (DataLabPotentialHydrogen <= 7.45) {
                        DataLabPotentialHydrogenCounts['7.35 - 7.45']++;
                    } else if (DataLabPotentialHydrogen > 7.45) {
                        DataLabPotentialHydrogenCounts['> 7.45']++;
                    }
                }
            });

            // Prepare data for the chart
            const chartData = {
                labels: Object.keys(DataLabPotentialHydrogenCounts),
                datasets: [{
                    label: 'Jumlah Orang',
                    backgroundColor: [
                        '#FFD700', 
                        '#008000', 
                        '#FF0000'
                    ],
                    borderWidth: 1,
                    data: Object.values(DataLabPotentialHydrogenCounts),
                }],
            };

            this.DataLabPotentialHydrogen = chartData;
            this.loaded = true; // After data is successfully loaded
        }
    },
    name: 'BarChart',
}
</script>

<template>
    <div class="flex bg-offwhite h-screen">
        <Sidebar />

        <div class="flex flex-col gap-4 pt-4 pl-4 w-full">
            <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 w-full md:w-2/3">
                    <p
                        class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 border-b border-[#3347E6]">
                        GRAFIK DATA POTENTIAL HYDROGEN</p>
                    <div class="flex items-center gap-4 mb-4">
                        <label for="startDate" class="text-sm font-semibold text-gray-700">Mulai Tanggal:</label>
                        <input type="date" id="startDate" v-model="startDate"
                            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <label for="endDate" class="text-sm font-semibold text-gray-700">Akhir Tanggal:</label>
                        <input type="date" id="endDate" v-model="endDate"
                            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <button @click="filterData"
                            class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Terapkan</button>
                    </div>
                    <Bar v-if="loaded" :data="DataLabPotentialHydrogen" :options="HasilLabPotentialHydrogenOptions" class="w-full h-64 md:h-96" />
                </div>

                <div
                    class="flex flex-col justify-between p-4 bg-work bg-no-repeat bg-center bg-cover h-full rounded-md w-full md:w-1/3">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA POTENTIAL HYDROGEN KESELURUHAN</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data Potential Hydrogen</p>
                    </div>
                    <div class="">
                        <a href="/DetailHasilLabPotentialHydrogen">
                            <button class="font-opensans text-white flex items-center gap-2 pb-4">
                                Read more
                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45593 9.96851 7.707 9.70856L11.707 5.70856C11.8951 5.52095 12.0008 5.26621 12.0008 5.00056C12.0008 4.7349 11.8951 4.48017 11.707 4.29256L7.707 0.292558C7.51898 0.101684 7.2653 -0.000183105 7 3.98266e-06C6.7347 0.00019007 6.4811 0.102223 6.293 0.293558C6.10489 0.48117 5.99922 0.735902 5.99922 1.00156C5.99922 1.26721 6.10489 1.52194 6.293 1.70956L8.586 4.00156H1C0.734784 4.00156 0.48043 4.10715 0.292893 4.29468C0.105357 4.48222 0 4.73658 0 5.00156C0 5.26655 0.105357 5.5209 0.292893 5.70844C0.48043 5.89597 0.734784 6.00156 1 6.00156Z"
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
