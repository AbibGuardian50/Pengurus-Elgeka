<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { Bar, Pie, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { useToast } from 'vue-toastification';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
    async created() {
        this.loaded = false
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/list/website'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            const responseData = response.data.Data;
            console.log(response)
            if (response.data.Message === "Success to Get Patient List") {
                toast.success('Data Pasien Berhasil Dimuat');
            }
            // Hitung total pasien
            this.TotalGeneralPatient = responseData.length;

            // Sekarang TotalPasienUmum berisi jumlah total pasien dari respons API
            console.log('Total Pasien:', this.TotalGeneralPatient);
            // Data Pengelompokan Umur
            // const ageCounts = {};

            const ageCounts = {
                '1-20': 0,
                '21-40': 0,
                '41-60': 0,
                '61-80': 0,
                '81+': 0
            };
            responseData.forEach(item => {
                const age = item.Age;
                if (age !== 0 && age !== null) {
                    if (age <= 20) {
                        ageCounts['1-20']++;
                    } else if (age <= 40) {
                        ageCounts['21-40']++;
                    } else if (age <= 60) {
                        ageCounts['41-60']++;
                    } else if (age <= 80) {
                        ageCounts['61-80']++;
                    } else {
                        ageCounts['81+']++;
                    }
                }
            });
            this.ageData = {
                labels: Object.keys(ageCounts),
                datasets: [{
                    label: 'Umur',
                    backgroundColor: 'rgba(123, 228, 241, 1)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: Object.values(ageCounts),
                    color: 'yellow',
                }],
            };

            // Data Kabupaten
            const districtCounts = {};
            responseData.forEach(item => {
                const district = item.District;
                const province = item.Province;
                if (province === "Jawa Barat" && district !== "") { // Tambahkan kondisi disini
                    districtCounts[district] = (districtCounts[district] || 0) + 1;
                }
            });
            this.DistrictData = {
                labels: Object.keys(districtCounts),
                datasets: [{
                    label: 'Kabupaten',
                    backgroundColor: '#F0E442',
                    borderWidth: 1,
                    data: Object.values(districtCounts),
                    color: 'yellow',
                }],
            };

            // Data Golongan Darah
            const labels = ['A', 'AB', 'B', 'O'];
            const BloodGroups = responseData.map(item => item.BloodGroup);
            const BloodGroupCounts = {}
            labels.forEach(label => {
                // Counting non-null values only
                BloodGroupCounts[label] = BloodGroups.filter(group => group === label && group !== null).length;
            });
            const backgroundColors = {
                'A': '#009E73',
                'AB': '#CC79A7',
                'B': '#56B4E9',
                'O': '#E69F00'
            };
            console.log(BloodGroups)
            this.BloodData = {
                labels: Object.keys(BloodGroupCounts),
                datasets: [
                    {
                        label: 'Golongan Darah',
                        color: '#FF6384',
                        backgroundColor: Object.keys(BloodGroupCounts).map(label => backgroundColors[label]),
                        data: Object.values(BloodGroupCounts)
                    },

                ]
            };
            this.loaded = true;

            // Call updateOptions to set the initial options based on the screen width
            this.updateOptions();
            // Add event listener to update options on window resize
            window.addEventListener('resize', this.updateOptions);

        } catch (error) {
            const toast = useToast()
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali')
            }
            console.error(error);
        }
    },
    beforeDestroy() {
        // Remove event listener when component is destroyed
        window.removeEventListener('resize', this.updateOptions);
    },
    methods: {
        updateOptions() {
            const width = window.innerWidth;
            let fontSize;
            if (width >= 1200) {
                fontSize = 18;
            } else if (width >= 768) {
                fontSize = 16;
            } else {
                fontSize = 12;
            }
            this.ageOptions = this.getChartOptions(fontSize);
            this.BloodOptions = this.getChartOptions(fontSize);
            this.DistrictOptions = this.getChartOptions(fontSize, true);
        },
        getChartOptions(fontSize, isHorizontal = false) {
            const options = {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: {
                                size: fontSize
                            }
                        },
                        title: {
                            display: true,
                            text: isHorizontal ? 'Nama Kota' : 'Range Umur',
                            font: {
                                size: fontSize + 2,
                                weight: 'bold'
                            }
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: {
                                size: fontSize
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
                            size: fontSize + 1,
                        }
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: {
                                size: fontSize + 1,
                                weight: 'bold'
                            }
                        }
                    }
                }
            };
            if (isHorizontal) {
                options.indexAxis = 'y';
            }
            return options;
        }
    },
    components: {
        Sidebar,
        Bar,
        Pie,
        Doughnut,
    },
    computed: {
        TotalGolonganDarah() {
            if (!this.BloodData.datasets) return 0;
            const BloodGroupCounts = this.BloodData.datasets[0].data;
            return BloodGroupCounts.reduce((total, count) => total + count, 0);
        },
        golonganDarahTerbanyak() {
            if (!this.BloodData.datasets) return '';
            const BloodGroupCounts = this.BloodData.datasets[0].data;
            const labels = this.BloodData.labels;
            const maxCount = Math.max(...BloodGroupCounts);
            const indexOfMaxCount = BloodGroupCounts.indexOf(maxCount);
            const golonganDarahTerbanyak = labels[indexOfMaxCount];

            // Menghitung jumlah orang dengan golongan darah terbanyak
            const jumlahOrangTerbanyak = maxCount;
            const teksGolonganDarahTerbanyak = `${golonganDarahTerbanyak} (${jumlahOrangTerbanyak} Orang)`;

            // Cek jika ada lebih dari satu golongan darah dengan nilai yang sama
            const duplicates = labels.filter(label => BloodGroupCounts[label] === maxCount);
            if (duplicates.length > 1) {
                // Jika ada lebih dari satu, ambil yang pertama secara alfabetis
                return duplicates.sort()[0];
            }
            return teksGolonganDarahTerbanyak;
        },
        golonganDarahTerlangka() {
            if (!this.BloodData.datasets) return '';
            const BloodGroupCounts = this.BloodData.datasets[0].data;
            const labels = this.BloodData.labels;
            const minCount = Math.min(...BloodGroupCounts);
            const indexOfMinCount = BloodGroupCounts.indexOf(minCount);
            const golonganDarahTerlangka = labels[indexOfMinCount];

            // Menghitung jumlah orang dengan golongan darah terlangka
            const jumlahOrangTerlangka = minCount;
            // Format teks yang menampilkan golongan darah dan jumlah orang
            const teksGolonganDarahTerlangka = `${golonganDarahTerlangka} (${jumlahOrangTerlangka} Orang)`;

            // Cek jika ada lebih dari satu golongan darah dengan nilai yang sama
            const duplicates = labels.filter(label => BloodGroupCounts[label] === minCount);
            if (duplicates.length > 1) {
                // Jika ada lebih dari satu, ambil yang pertama secara alfabetis
                return duplicates.sort()[0];
            }
            return teksGolonganDarahTerlangka;
        },
    },
    data() {
        return {
            TotalGeneralPatient: 0,
            BloodData: {},
            ageData: {},
            DistrictData: {},
            loaded: false,
            ageOptions: {},
            BloodOptions: {},
            DistrictOptions: {},
        }
    }
}
</script>


<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="flex flex-col gap-4 pt-4 pl-4 w-full lg:w-auto max-md:w-[95%]">
            <div class="flex flex-col gap-4 min-[1400px]:flex-row">
                <div
                    class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 max-sm:p-1 w-full max-[1400px]:w-[800px] max-[1000px]:max-w-[600px] max-md:w-[95%] lg:pl-8 lg:py-4 lg:pr-8">
                    <p class="font-assistant text-[18px] font-bold leading-5 text-midnightblue w-full pt-4 lg:pl-8">Grafik
                        Pasien berdasarkan Kabupaten</p>
                    <Bar v-if="loaded" :data="DistrictData" :options="DistrictOptions"
                        class="border border-lightsilver rounded-md w-full lg:max-w-[900px] lg:min-h-[400px] lg:max-h-[450px] text-white max-sm:p-0 p-4" />
                </div>

                <div
                    class="flex flex-col justify-between p-4 bg-work bg-no-repeat bg-center bg-cover rounded-md h-full max-h-[900px] w-full max-md:w-[95%] lg:w-auto lg:max-w-[700px]">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA UMUM PASIEN</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            umum pasien</p>
                    </div>
                    <div class="pt-4">
                        <a href="/detaildataumumpasien">
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

            <div class="flex flex-col gap-4 lg:flex-row pb-8">
                <div
                    class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 w-full lg:w-auto lg:pr-8 max-md:w-[95%]">
                    <p class="font-assistant text-[18px] font-semibold leading-5 text-midnightblue pt-4">Grafik Pasien
                        berdasarkan Golongan Darah</p>
                    <Pie v-if="loaded" :data="BloodData" :options="BloodOptions"
                        class="border border-lightsilver rounded-lg w-full max-w-[350px] h-full max-h-[350px] text-white" />
                    <div class="pb-4">
                        <p class="font-opensans font-bold text-black text-[20px]">Golongan Darah Terbanyak: {{
                            golonganDarahTerbanyak }}</p>
                        <p class="font-opensans font-bold text-black text-[20px]">Golongan Darah Terlangka: {{
                            golonganDarahTerlangka }}</p>
                        <p class="font-opensans font-bold text-black text-[20px]">Total : {{ TotalGeneralPatient }}</p>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center gap-4 w-full lg:w-[] lg:pr-8 max-md:w-[95%]">
                    <div
                        class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 max-sm:p-1 w-full max-[1400px]:w-[800px] max-[1000px]:max-w-[600px] max-md:w-[100%] lg:pl-8 lg:py-4 lg:pr-8">
                        <p class="font-assistant text-[18px] font-bold leading-5 text-midnightblue w-full pt-4 lg:pl-8">
                            Grafik
                            Pasien berdasarkan Kabupaten</p>
                        <Bar v-if="loaded" :data="ageData" :options="DistrictOptions"
                            class="border border-lightsilver rounded-md w-full lg:max-w-[900px] lg:min-h-[400px] lg:max-h-[450px] text-white max-sm:p-0 p-4" />
                    </div>
                    <div class="flex flex-col py-4 w-full">
                        <div class="bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.04)] p-4 flex flex-col">
                            <p class="font-opensans text-black font-semibold text-[16px] leading-[52px]">Total Pasien: {{
                                TotalGeneralPatient }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

