<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    async created() {
        await this.fetchData(); // Memuat data pertama kali saat komponen dibuat
    },
    components: {
        Sidebar,
        Bar,
    },
    data() {
        return {
            startDateMale: '', // Tanggal mulai untuk data male
            endDateMale: '',   // Tanggal akhir untuk data male
            startDateFemale: '', // Tanggal mulai untuk data female
            endDateFemale: '',   // Tanggal akhir untuk data female
            loaded: false,
            allData: [], // Menyimpan semua data
            DataLabLeukocytesMale: null,
            DataLabLeukocytesFemale: null,
            HasilLabLeukocytesMaleOptions: {
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
            HasilLabLeukocytesFemaleOptions: {
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
    methods: {
        async fetchData() {
            try {
                const toast = useToast();
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/leukocytes';
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    }
                });
                const responseData = response.data.Data;
                console.log(response);
                if (response.data.Message === "Success to Get Leukocytes Data") {
                    toast.success('Data Hasil Lab Leukosit Berhasil Dimuat');
                }

                // Simpan semua data
                this.allData = responseData;
                this.allData.forEach((item, index) => {
                    item.Data = parseFloat(item.Data) * 1000; // Mengalikan dengan 10 pangkat 3
                    item.no = index + 1;
                });
                this.filterData(); // Filter data berdasarkan tanggal

            } catch (error) {
                const toast = useToast();
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali');
                } else {
                    toast.error('Sedang ada gangguan, Mohon coba lagi');
                }
                console.error(error);
            }
        },
        filterData() {
            const toast = useToast();
            // Validasi tanggal untuk male
            const startDateMaleObj = new Date(this.startDateMale);
            const endDateMaleObj = new Date(this.endDateMale);
            if (startDateMaleObj > endDateMaleObj) {
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
                return;
            }

            // Validasi tanggal untuk female
            const startDateFemaleObj = new Date(this.startDateFemale);
            const endDateFemaleObj = new Date(this.endDateFemale);
            if (startDateFemaleObj > endDateFemaleObj) {
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
                return;
            }

            // Filter data berdasarkan tanggal untuk male
            const filteredDataMale = this.allData.filter(item => {
                const itemDate = new Date(item.Date); // Ganti dengan field tanggal yang sesuai
                const start = this.startDateMale ? new Date(this.startDateMale) : null;
                const end = this.endDateMale ? new Date(this.endDateMale) : null;
                if (start && end) {
                    return itemDate >= start && itemDate <= end && item.Gender === 'male';
                } else if (start) {
                    return itemDate >= start && item.Gender === 'male';
                } else if (end) {
                    return itemDate <= end && item.Gender === 'male';
                } else {
                    return item.Gender === 'male';
                }
            });

            // Filter data berdasarkan tanggal untuk female
            const filteredDataFemale = this.allData.filter(item => {
                const itemDate = new Date(item.Date); // Ganti dengan field tanggal yang sesuai
                const start = this.startDateFemale ? new Date(this.startDateFemale) : null;
                const end = this.endDateFemale ? new Date(this.endDateFemale) : null;
                if (start && end) {
                    return itemDate >= start && itemDate <= end && item.Gender === 'female';
                } else if (start) {
                    return itemDate >= start && item.Gender === 'female';
                } else if (end) {
                    return itemDate <= end && item.Gender === 'female';
                } else {
                    return item.Gender === 'female';
                }
            });


            // Menghitung jumlah kemunculan setiap nilai Data untuk male
            const DataLabLeukocytesCountsMale = {
                '< 2000': 0,
                '2000 - 3500': 0,
                '3.500 - 12.000': 0,
                '12.000 - 100.000': 0,
                '> 100.000': 0,
            };
            filteredDataMale.forEach(item => {
                const DataLabLeukocytes = item.Data;
                if (DataLabLeukocytes !== 0 && DataLabLeukocytes !== null) {
                    if (DataLabLeukocytes < 2000) {
                        DataLabLeukocytesCountsMale['< 2000']++;
                    } else if (DataLabLeukocytes >= 2000 && DataLabLeukocytes <= 3500) {
                        DataLabLeukocytesCountsMale['2000 - 3500']++;
                    } else if (DataLabLeukocytes > 3500 && DataLabLeukocytes <= 10500) {
                        DataLabLeukocytesCountsMale['3.500 - 12.000']++;
                    } else if (DataLabLeukocytes > 10500 && DataLabLeukocytes <= 100000) {
                        DataLabLeukocytesCountsMale['12.000 - 100.000']++;
                    } else if (DataLabLeukocytes > 100000) {
                        DataLabLeukocytesCountsMale['> 100.000']++;
                    }
                }
            });


            // Menghitung jumlah kemunculan setiap nilai Data untuk female
            const DataLabLeukocytesCountsFemale = {
                '< 2000': 0,
                '2000 - 3500': 0,
                '3.500 - 12.000': 0,
                '12.000 - 100.000': 0,
                '> 100.000': 0,
            };
            filteredDataFemale.forEach(item => {
                const DataLabLeukocytes = item.Data;
                if (DataLabLeukocytes !== 0 && DataLabLeukocytes !== null) {
                    if (DataLabLeukocytes < 2000) {
                        DataLabLeukocytesCountsFemale['< 2000']++;
                    } else if (DataLabLeukocytes >= 2000 && DataLabLeukocytes <= 3500) {
                        DataLabLeukocytesCountsFemale['2000 - 3500']++;
                    } else if (DataLabLeukocytes > 3500 && DataLabLeukocytes <= 10500) {
                        DataLabLeukocytesCountsFemale['3.500 - 12.000']++;
                    } else if (DataLabLeukocytes > 10500 && DataLabLeukocytes <= 100000) {
                        DataLabLeukocytesCountsFemale['12.000 - 100.000']++;
                    } else if (DataLabLeukocytes > 100000) {
                        DataLabLeukocytesCountsFemale['> 100.000']++;
                    }
                }
            });

            // Persiapkan data untuk chart
            const chartDataMale = {
                labels: Object.keys(DataLabLeukocytesCountsMale),
                datasets: [{
                    label: 'Jumlah Pasien',
                    backgroundColor: [
                        '#FF0000', // merah
                        '#FFD700', // kuning
                        '#008000', // Hijau
                        '#FFD700', // kuning
                        '#FF0000' // Merah
                    ],
                    borderWidth: 1,
                    data: Object.values(DataLabLeukocytesCountsMale),
                }],
            };

            const chartDataFemale = {
                labels: Object.keys(DataLabLeukocytesCountsFemale),
                datasets: [{
                    label: 'Jumlah Pasien',
                    backgroundColor: [
                        '#FF0000', // merah
                        '#FFD700', // kuning
                        '#008000', // Hijau
                        '#FFD700', // kuning
                        '#FF0000' // Merah
                    ],
                    borderWidth: 1,
                    data: Object.values(DataLabLeukocytesCountsFemale),
                }],
            };

            this.DataLabLeukocytesMale = chartDataMale;
            this.DataLabLeukocytesFemale = chartDataFemale;
            this.loaded = true; // Setelah data dimuat berhasil
        }
    },
    name: 'BarChart',
}
</script>


<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />
        <div class="flex flex-col flex-grow p-4">
            <div class="flex flex-col md:flex-row md:gap-4 items-center justify-between max-[600px]:w-full">
                <div
                    class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 max-sm:p-2 w-full md:w-2/3 lg:w-[53%]">
                    <div class="w-full h-auto">
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            Data Leukosit Laki-Laki</p>
                        <div class="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="startDateMale" class="text-sm font-semibold font-poppins text-gray-700">Mulai
                                    Tanggal:</label>
                                <input type="date" id="startDateMale" v-model="startDateMale"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="endDateMale" class="text-sm font-semibold font-poppins text-gray-700">Akhir
                                    Tanggal:</label>
                                <input type="date" id="endDateMale" v-model="endDateMale"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <button @click="filterData"
                                class="px-4 py-2 bg-teal text-white rounded-md shadow-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto">
                                Terapkan
                            </button>
                        </div>
                        <Bar v-if="loaded && DataLabLeukocytesMale" :data="DataLabLeukocytesMale"
                            :options="HasilLabLeukocytesMaleOptions" class="w-full" />
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6] mt-4">
                            Data Leukosit Perempuan</p>
                        <div class="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="startDateFemale" class="text-sm font-semibold font-poppins text-gray-700">Mulai
                                    Tanggal:</label>
                                <input type="date" id="startDateFemale" v-model="startDateFemale"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                                <label for="endDateFemale" class="text-sm font-semibold font-poppins text-gray-700">Akhir
                                    Tanggal:</label>
                                <input type="date" id="endDateFemale" v-model="endDateFemale"
                                    class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                            </div>
                            <button @click="filterData"
                                class="px-4 py-2 bg-teal text-white rounded-md shadow-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto">
                                Terapkan
                            </button>
                        </div>
                        <Bar v-if="loaded && DataLabLeukocytesFemale" :data="DataLabLeukocytesFemale"
                            :options="HasilLabLeukocytesFemaleOptions" class="w-full" />
                    </div>
                </div>
                <div
                    class="flex flex-col justify-between p-4 bg-cover bg-center bg-work rounded-md h-full w-full md:w-1/3 lg:w-1/2 mt-4 md:mt-0">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA LEUKOSIT KESELURUHAN
                        </p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            Leukosit</p>
                    </div>
                    <div class="flex items-center justify-end">
                        <a href="/DetailHasilLableukocytes" target="_blank">
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
