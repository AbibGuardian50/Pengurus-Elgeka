<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { useToast } from 'vue-toastification';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
    async created() {
        this.loaded = false;
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/list/website';
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
            this.TotalGeneralPatient = responseData.length;

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
                    backgroundColor: '#0A6B77',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: Object.values(ageCounts),
                    color: 'yellow',
                }],
            };

            const districtCounts = {};
            responseData.forEach(item => {
                const district = item.District;
                const province = item.Province;
                if (province === "32" && district !== "") {
                    districtCounts[district] = (districtCounts[district] || 0) + 1;
                }
            });

            const provinceId = '32'; // Replace with actual province ID if necessary
            const districtUrl = `https://abibguardian50.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`;
            const districtResponse = await axios.get(districtUrl);
            const districts = districtResponse.data;
            const districtMapping = {};
            districts.forEach(district => {
                districtMapping[district.id] = district.name;
            });

            const mappedDistrictCounts = {};
            Object.keys(districtCounts).forEach(districtId => {
                const districtName = districtMapping[districtId];
                if (districtName) {
                    mappedDistrictCounts[districtName] = districtCounts[districtId];
                }
            });

            this.DistrictData = {
                labels: Object.keys(mappedDistrictCounts),
                datasets: [{
                    label: 'Kabupaten',
                    backgroundColor: '#0A6B77',
                    borderWidth: 1,
                    data: Object.values(mappedDistrictCounts),
                    color: 'yellow',
                }],
            };

            const labels = ['A', 'AB', 'B', 'O'];
            const BloodGroups = responseData.map(item => item.BloodGroup);
            const BloodGroupCounts = {}
            labels.forEach(label => {
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

            this.updateOptions();
            window.addEventListener('resize', this.updateOptions);

        } catch (error) {
            const toast = useToast();
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali');
            }
            console.error(error);
        }
    },
    beforeDestroy() {
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
            this.BloodOptions = this.getBloodOptions(fontSize);
            this.DistrictOptions = this.getChartOptions(fontSize, true);
        },
        getBloodOptions(fontSize) {
            const options = {
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
                    },
                }
            };
            return options;
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
            const jumlahOrangTerbanyak = maxCount;
            const teksGolonganDarahTerbanyak = `${golonganDarahTerbanyak} (${jumlahOrangTerbanyak} Orang)`;
            const duplicates = labels.filter(label => BloodGroupCounts[label] === maxCount);
            if (duplicates.length > 1) {
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
            const jumlahOrangTerlangka = minCount;
            const teksGolonganDarahTerlangka = `${golonganDarahTerlangka} (${jumlahOrangTerlangka} Orang)`;
            const duplicates = labels.filter(label => BloodGroupCounts[label] === minCount);
            if (duplicates.length > 1) {
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

<style>

.container {
    max-width: 100%;
    padding: 0;
    margin: 0;
}

.page-container {
    display: flex;
}

.main-content {
    flex-grow: 1;
    padding: 0;
}

h1 {
    font-weight: bold;
    color: #222539;
    font-size: 24px;
}

p {
    color: #767A8A;
    font-size: 14px;
}
</style>



<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="flex flex-col gap-4 pt-4 pl-4 w-full lg:w-auto max-md:w-[95%]">
            <div class="flex flex-col gap-4 min-[1400px]:flex-row max-w-[1100px]">
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

            <div class="flex flex-col gap-4 lg:flex-row pb-8 max-w-[1100px]">
                <div
                    class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-2 w-full lg:w-auto max-md:w-[95%]">
                    <p class="font-assistant text-[18px] font-semibold leading-5 text-midnightblue pt-4">Grafik Pasien
                        berdasarkan Golongan Darah</p>
                    <Pie v-if="loaded" :data="BloodData" :options="BloodOptions"
                        class="border border-lightsilver rounded-lg w-full min-w-[30%] max-w-[550px] p-2 h-full max-h-[350px] text-white" />
                    <div class="pb-4">
                        <p class="font-opensans font-bold text-black text-[16px]">Golongan Darah Terbanyak: {{
                            golonganDarahTerbanyak }}</p>
                        <p class="font-opensans font-bold text-black text-[16px]">Golongan Darah Terlangka: {{
                            golonganDarahTerlangka }}</p>
                        <p class="font-opensans font-bold text-black text-[16px]">Total : {{ TotalGeneralPatient }}</p>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-center gap-4 w-[70%] max-md:w-[95%]">
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

