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
            const toast = useToast();
            // Validasi tanggal
            const startDateObj = new Date(this.startDate);
            const endDateObj = new Date(this.endDate);

            if (startDateObj > endDateObj) {
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
                return;
            }
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
    <div class="flex bg-offwhite h-full">
        <Sidebar />
        <div class="flex flex-col flex-grow p-4">
            <div class="flex flex-col md:flex-row md:gap-4 items-center justify-between">
                <div class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 w-full md:w-2/3 lg:w-[53%]">
                    <p class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">GRAFIK DATA POTENTIAL HYDROGEN</p>
                    <div class="flex items-center gap-4 mb-4">
                        <label for="startDate" class="text-sm font-semibold font-poppins text-gray-700">Mulai Tanggal:</label>
                        <input type="date" id="startDate" v-model="startDate" class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <label for="endDate" class="text-sm font-semibold font-poppins text-gray-700">Akhir Tanggal:</label>
                        <input type="date" id="endDate" v-model="endDate" class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <button @click="filterData" class="px-4 py-2 bg-teal text-white rounded-md shadow-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Terapkan</button>
                    </div>
                    <Bar v-if="loaded" :data="DataLabPotentialHydrogen" :options="HasilLabPotentialHydrogenOptions" class="w-full h-auto" />
                </div>
                <div class="flex flex-col justify-between p-4 bg-cover bg-center bg-work rounded-md h-full w-full md:w-1/3 lg:w-1/2">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA POTENTIAL HYDROGEN KESELURUHAN</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data POTENTIAL HYDROGEN</p>
                    </div>
                    <div class="flex items-center justify-end">
                        <a href="/DetailHasilLabpotentialhydrogen" target="_blank">
                            <button class="font-opensans text-white flex items-center gap-2 pb-4">Read more
                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45592 9.96857 7.707 9.70856L11.707 5.70856C11.8945 5.52106 12 5.26938 12 5.00156C12 4.73375 11.8945 4.48206 11.707 4.29456L7.707 0.294563C7.45592 0.0345405 7.08412 -0.0696805 6.73449 0.0218439C6.38486 0.113368 6.11182 0.386413 6.0203 0.736036C5.92879 1.08566 6.03304 1.45746 6.293 1.70856L8.586 3.00156H1C0.447715 3.00156 0 3.44928 0 4.00156C0 4.55384 0.447715 5.00156 1 5.00156V6.00156Z" fill="white"/>
                                </svg>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>