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
        await this.fetchData(); // Memuat data pertama kali saat komponen dibuat
    },
    components: {
        Sidebar,
        Bar,
    },
    data() {
        return {
            startDateMale: '',  // Filter tanggal untuk male
            endDateMale: '',
            startDateFemale: '', // Filter tanggal untuk female
            endDateFemale: '',
            loaded: false,
            allData: [], // Menyimpan semua data
            DataLabHemoglobinMale: null, // Data chart hemoglobin male
            DataLabHemoglobinFemale: null, // Data chart hemoglobin female
            HasilLabHemoglobinOptionsMale: {
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
                        labels: false,
                    }
                }
            },
            HasilLabHemoglobinOptionsFemale: {
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
                        labels: false,
                    }
                }
            },
        }
    },
    methods: {
        async fetchData() {
            try {
                const toast = useToast();
                const tokenlogin = VueCookies.get('TokenAuthorization')
                const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/hemoglobin'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                });
                const responseData = response.data.Data;
                console.log(response);
                if (response.data.Message === "Success to Get Hemoglobin Data") {
                    toast.success('Data Hasil Lab Hemoglobin Berhasil Dimuat');
                }

                // Simpan semua data
                this.allData = responseData;
                this.filterData(); // Filter data berdasarkan tanggal

            } catch (error) {
                const toast = useToast()
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali')
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
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir untuk data male');
                return;
            }

            // Validasi tanggal untuk female
            const startDateFemaleObj = new Date(this.startDateFemale);
            const endDateFemaleObj = new Date(this.endDateFemale);
            if (startDateFemaleObj > endDateFemaleObj) {
                toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir untuk data female');
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
            const DataLabHemoglobinCountsMale = {
                '< 13': 0,
                '13 - 17': 0,
                '> 17': 0,
            };
            filteredDataMale.forEach(item => {
                const DataLabHemoglobin = item.Data;
                if (DataLabHemoglobin !== 0 && DataLabHemoglobin !== null) {
                    if (DataLabHemoglobin < 13) {
                        DataLabHemoglobinCountsMale['< 13']++;
                    } else if (DataLabHemoglobin <= 17) {
                        DataLabHemoglobinCountsMale['13 - 17']++;
                    } else if (DataLabHemoglobin > 17) {
                        DataLabHemoglobinCountsMale['> 17']++;
                    }
                }
            });

            // Menghitung jumlah kemunculan setiap nilai Data untuk female
            const DataLabHemoglobinCountsFemale = {
                '< 9': 0,
                '9 - 15': 0,
                '> 15': 0,
            };
            filteredDataFemale.forEach(item => {
                const DataLabHemoglobin = item.Data;
                if (DataLabHemoglobin !== 0 && DataLabHemoglobin !== null) {
                    if (DataLabHemoglobin < 9) {
                        DataLabHemoglobinCountsFemale['< 9']++;
                    } else if (DataLabHemoglobin <= 15) {
                        DataLabHemoglobinCountsFemale['12 - 15']++;
                    } else if (DataLabHemoglobin > 15) {
                        DataLabHemoglobinCountsFemale['> 15']++;
                    }
                }
            });

            // Persiapkan data untuk chart male
            const chartDataMale = {
                labels: Object.keys(DataLabHemoglobinCountsMale),
                datasets: [{
                    label: 'Jumlah Pasien',
                    backgroundColor: [
                            '#FFD700', // Kuning
                            '#008000', // Hijau
                            '#FF0000', // Merah
                        ],
                    borderWidth: 1,
                    data: Object.values(DataLabHemoglobinCountsMale),
                }],
            };

            // Persiapkan data untuk chart female
            const chartDataFemale = {
                labels: Object.keys(DataLabHemoglobinCountsFemale),
                datasets: [{
                    label: 'Jumlah Pasien',
                    backgroundColor: [
                            '#FFD700', // Kuning
                            '#008000', // Hijau
                            '#FF0000', // Merah
                        ],
                    borderWidth: 1,
                    data: Object.values(DataLabHemoglobinCountsFemale),
                }],
            };

            this.DataLabHemoglobinMale = chartDataMale;
            this.DataLabHemoglobinFemale = chartDataFemale;
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
                    <p
                        class="font-assistant text-[18px] leading-6 font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                        GRAFIK DATA HEMOGLOBIN LAKI-LAKI
                    </p>
                    <div class="flex flex-col md:flex-row items-center gap-4 mb-4 w-full">
                        <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                            <label for="startDateMale" class="text-sm font-semibold font-poppins text-gray-700">Mulai
                                Tanggal:</label>
                            <input type="date" id="startDateMale" v-model="startDateMale"
                                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                        </div>
                        <div class="flex flex-col md:flex-row items-center gap-4 w-full">
                            <label for="endDateMale" class="text-sm font-semibold font-poppins text-gray-700">Akhir Tanggal
                            :</label>
                            <input type="date" id="endDateMale" v-model="endDateMale"
                                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm w-full md:w-auto">
                        </div>
                        <button @click="filterData"
                            class="px-4 py-2 bg-teal text-white rounded-md shadow-sm font-poppins focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto">
                            Terapkan
                        </button>
                    </div>
                    <div class="w-full h-auto">
                        <Bar v-if="loaded" :data="DataLabHemoglobinMale" :options="HasilLabHemoglobinOptionsMale"
                                class="w-full mb-8" />
                    </div>
                    
                    <div class="w-full h-auto mb-8">
                        <p
                            class="font-assistant text-[18px] leading-6 font-semibold text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">
                            GRAFIK DATA HEMOGLOBIN PEREMPUAN
                        </p>
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
                        <div class="w-full h-auto">
                            
                            <Bar v-if="loaded" :data="DataLabHemoglobinFemale" :options="HasilLabHemoglobinOptionsFemale"
                                class="w-full" />
                        </div>
                    </div>
                </div>
                <div
                    class="flex flex-col justify-between p-4 bg-cover bg-center bg-work rounded-md h-full w-full md:w-1/3 lg:w-1/2 mt-4 md:mt-0">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA HEMOGLOBIN KESELURUHAN
                        </p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            HEMOGLOBIN</p>
                </div>
                <div class="flex items-center justify-end">
                    <a href="/DetailHasilLabhemoglobin" target="_blank">
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
</div></template>

