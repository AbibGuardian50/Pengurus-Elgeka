<script>
import Sidebar from "../components/Sidebar.vue"; // Import komponen Sidebar
import Loading from "../components/Loading.vue"; // Import komponen Loading
import ChartDataLabels from 'chartjs-plugin-datalabels';

import axios from 'axios'; // Import axios untuk melakukan HTTP requests
import VueCookies from 'vue-cookies'; // Import VueCookies untuk mengelola cookies
import { Bar, Pie } from 'vue-chartjs'; // Import komponen Bar dan Pie dari vue-chartjs
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'; // Import elemen-elemen yang diperlukan dari Chart.js
import { useToast } from 'vue-toastification'; // Import useToast untuk menampilkan notifikasi

ChartJS.register(ChartDataLabels, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement); // Registrasi elemen-elemen yang diperlukan dari Chart.js

export default {
    components: {
        Sidebar, // Menambahkan Sidebar sebagai komponen yang digunakan
        Bar,
        Pie,
        Loading
    },
    data() {
        return {
            allData: [], // Array untuk menyimpan semua data dari API
            TotalGeneralPatient: 0, // Total jumlah pasien umum
            BloodData: {}, // Data untuk chart golongan darah
            ageData: {}, // Data untuk chart umur
            DistrictData: {}, // Data untuk chart kabupaten
            loaded: false, // Status apakah data sudah dimuat atau belum
            ageOptions: {}, // Setelan atau pengaturan untuk chart umur
            BloodOptions: {}, // Setelan atau pengaturan untuk chart golongan darah
            DistrictOptions: {}, // Setelan atau pengaturan untuk chart kabupaten
        };
    },
    async created() {
        await this.fetchData(); // Panggil method fetchData()
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateOptions); // Hapus event listener saat komponen akan dihancurkan
    },
    methods: {
        async fetchData() {
            this.loaded = false; // Set status loading data
            try {
                const toast = useToast(); // Gunakan useToast untuk menampilkan notifikasi
                const tokenlogin = VueCookies.get('TokenAuthorization'); // Ambil token dari cookies
                const url = 'https://elgeka-mobile-production.up.railway.app/api/user/list/website'; // URL endpoint API
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}` // Set header Authorization dengan token
                    },
                });
                const responseData = response.data.Data; // Ambil data dari respons API
                this.allData = responseData; // Simpan semua data dari API
                console.log(response); // Log respons API untuk keperluan debugging

                // Tampilkan notifikasi jika pengambilan data berhasil
                if (response.data.Message === "Success to Get Patient List") {
                    toast.success('Data Pasien Berhasil Dimuat');
                }
                this.TotalGeneralPatient = responseData.length; // Hitung jumlah total pasien umum

                // Hitung data pasien berdasarkan umur
                const ageCounts = {
                    '1-20': 0,
                    '21-40': 0,
                    '41-60': 0,
                    '61-80': 0,
                    '81+': 0
                };
                responseData.forEach(item => {
                    const age = item.Age; // Ambil usia dari setiap data pasien
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
                    }],
                };

                // Hitung data pasien berdasarkan kabupaten di provinsi dengan ID 32 (contoh: Jawa Barat)
                const districtCounts = {};
                responseData.forEach(item => {
                    const district = item.District; // Ambil nama kabupaten dari setiap data pasien
                    const province = item.Province; // Ambil ID provinsi dari setiap data pasien
                    if (province === "32" && district !== "") { // Filter hanya data yang berada di provinsi dengan ID 32
                        districtCounts[district] = (districtCounts[district] || 0) + 1;
                    }
                });

                // Ambil nama-nama kabupaten dari API wilayah Indonesia
                const provinceId = '32'; // ID provinsi yang diinginkan (contoh: Jawa Barat)
                const districtUrl = `https://abibguardian50.github.io/api-wilayah-indonesia/api/regencies/${provinceId}.json`;
                const districtResponse = await axios.get(districtUrl);
                const districts = districtResponse.data;
                const districtMapping = {};
                districts.forEach(district => {
                    districtMapping[district.id] = district.name; // Membuat mapping antara ID kabupaten dan nama kabupaten
                });

                // Membuat objek data untuk chart berdasarkan kabupaten
                const mappedDistrictCounts = {};
                Object.keys(districtCounts).forEach(districtId => {
                    const districtName = districtMapping[districtId];
                    if (districtName) {
                        mappedDistrictCounts[districtName] = districtCounts[districtId];
                    }
                });

                const DistrictData = {
                    labels: Object.keys(mappedDistrictCounts),
                    datasets: [{
                        label: 'Kabupaten',
                        backgroundColor: '#0A6B77',
                        borderWidth: 1,
                        data: Object.values(mappedDistrictCounts),
                    }],
                };

                this.DistrictData = DistrictData; // Simpan data kabupaten ke dalam variabel komponen

                // Hitung data golongan darah dari semua pasien
                const labels = ['A-', 'AB-', 'B-', 'O-', 'A+', 'AB+', 'B+', 'O+']; // Label untuk golongan darah
                const BloodGroups = responseData.map(item => item.BloodGroup); // Ambil data golongan darah dari setiap pasien
                const BloodGroupCounts = {};
                labels.forEach(label => {
                    BloodGroupCounts[label] = BloodGroups.filter(group => group === label && group !== null).length; // Hitung jumlah kemunculan setiap golongan darah
                });
                const backgroundColors = { // Warna latar belakang untuk setiap golongan darah
                    'A-': '#009E73',
                    'AB-': '#CC79A7',
                    'B-': '#56B4E9',
                    'O-': '#E69F00',
                    'A+': '#D32F2F',
                    'AB+': '#7B1FA2',
                    'B+': '#1976D2',
                    'O+': '#388E3C'
                };

                this.BloodData = {
                    labels: Object.keys(BloodGroupCounts),
                    datasets: [{
                        label: 'Golongan Darah',
                        backgroundColor: Object.keys(BloodGroupCounts).map(label => backgroundColors[label]), // Atur warna latar belakang berdasarkan golongan darah
                        data: Object.values(BloodGroupCounts) // Atur data jumlah pasien berdasarkan golongan darah
                    }],
                };

                this.loaded = true; // Set status bahwa data sudah dimuat
                this.updateOptions(); // Panggil method untuk memperbarui opsi chart
                window.addEventListener('resize', this.updateOptions); // Tambahkan event listener untuk merespons perubahan ukuran layar
            } catch (error) {
                const toast = useToast(); // Gunakan useToast untuk menampilkan notifikasi
                if (error.message === "Request failed with status code 401") {
                    toast.error('Error code 401, Mohon untuk logout lalu login kembali'); // Tampilkan notifikasi error jika terjadi error 401 (Unauthorized)
                }
                console.error(error); // Log error ke konsol
            }
        },
        updateOptions() {
            const width = window.innerWidth; // Ambil lebar layar browser
            let fontSize;
            if (width >= 1200) {
                fontSize = 18; // Atur ukuran font untuk layar dengan lebar ≥ 1200px
            } else if (width >= 768) {
                fontSize = 16; // Atur ukuran font untuk layar dengan lebar antara 768px dan 1199px
            } else {
                fontSize = 12; // Atur ukuran font untuk layar dengan lebar < 768px
            }
            this.ageOptions = this.getChartOptions(fontSize); // Update opsi untuk chart umur
            this.BloodOptions = this.getBloodOptions(fontSize); // Update opsi untuk chart golongan darah
            this.DistrictOptions = this.getChartOptions(fontSize, true); // Update opsi untuk chart kabupaten
        },
        getBloodOptions(fontSize) {
            // Opsi untuk chart golongan darah
            const options = {
                responsive: true,
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20,
                    }
                },
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
                        position: 'bottom', // Ubah posisi legend ke bawah
                        labels: {
                            color: "#222539",
                            font: {
                                size: fontSize + 1,
                                weight: 'bold'
                            },
                            padding: 20,
                        }
                    },
                    datalabels: {
                        anchor: 'end',
                        align: 'end',
                        offset: 5,
                        formatter: (value, context) => {
                            if (value === 0) {
                                return ''; // Tidak menampilkan label jika nilai datanya adalah 0
                            }
                            let sum = 0;
                            const dataArr = context.chart.data.datasets[0].data;
                            dataArr.forEach(data => {
                                sum += data;
                            });
                            const percentage = ((value / sum) * 100).toFixed(2) + '%';
                            return percentage;
                        },
                        font: {
                            weight: 'bold',
                        }
                    }
                }
            };
            return options;
        },

        getChartOptions(fontSize, isHorizontal = false) {
            // Opsi untuk chart umur dan kabupaten
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
                options.indexAxis = 'y'; // Jika chart horizontal, atur indexAxis ke 'y'
            }
            return options;
        },
    },
    computed: {
        // Menghitung total jumlah pasien berdasarkan golongan darah
        TotalGolonganDarah() {
            // Jika datasets BloodData tidak ada, kembalikan nilai 0
            if (!this.BloodData.datasets) return 'error';

            // Ambil data jumlah golongan darah dari dataset pertama
            const BloodGroupCounts = this.BloodData.datasets[0].data;

            // pengurangan array BloodGroupCounts untuk menghitung total jumlah pasien
            return BloodGroupCounts.reduce((total, count) => total + count, 0);
        },

        // Menentukan golongan darah dengan jumlah pasien terbanyak
        golonganDarahTerbanyak() {
            // Jika datasets BloodData tidak ada, kembalikan string kosong
            if (!this.BloodData.datasets) return 'error';

            // Ambil data jumlah golongan darah dan labelnya
            const BloodGroupCounts = this.BloodData.datasets[0].data;
            const labels = this.BloodData.labels;

            // Temukan nilai maksimum dari BloodGroupCounts
            const maxCount = Math.max(...BloodGroupCounts);

            // Temukan indeks dari nilai maksimum tersebut
            const indexOfMaxCount = BloodGroupCounts.indexOf(maxCount);

            // Ambil label dari golongan darah dengan jumlah terbanyak
            const golonganDarahTerbanyak = labels[indexOfMaxCount];

            // Ambil jumlah orang dengan golongan darah terbanyak
            const jumlahOrangTerbanyak = maxCount;

            // Buat teks untuk golongan darah terbanyak
            const teksGolonganDarahTerbanyak = `${golonganDarahTerbanyak} (${jumlahOrangTerbanyak} Orang)`;

            // Filter label yang memiliki jumlah pasien sama dengan nilai maksimum
            const duplicates = labels.filter(label => BloodGroupCounts[label] === maxCount);

            // Jika terdapat lebih dari satu label dengan jumlah terbanyak, ambil yang pertama setelah diurutkan
            if (duplicates.length > 1) {
                return duplicates.sort()[0];
            }

            // Kembalikan teks golongan darah terbanyak
            return teksGolonganDarahTerbanyak;
        },

        // Menentukan golongan darah dengan jumlah pasien terlangka
        golonganDarahTerlangka() {
            // Jika datasets BloodData tidak ada, kembalikan string kosong
            if (!this.BloodData.datasets) return '';

            // Ambil data jumlah golongan darah dan labelnya
            const BloodGroupCounts = this.BloodData.datasets[0].data;
            const labels = this.BloodData.labels;

            // Temukan nilai minimum dari BloodGroupCounts
            const minCount = Math.min(...BloodGroupCounts);

            // Temukan indeks dari nilai minimum tersebut
            const indexOfMinCount = BloodGroupCounts.indexOf(minCount);

            // Ambil label dari golongan darah dengan jumlah terlangka
            const golonganDarahTerlangka = labels[indexOfMinCount];

            // Ambil jumlah orang dengan golongan darah terlangka
            const jumlahOrangTerlangka = minCount;

            // Buat teks untuk golongan darah terlangka
            const teksGolonganDarahTerlangka = `${golonganDarahTerlangka} (${jumlahOrangTerlangka} Orang)`;

            // Filter label yang memiliki jumlah pasien sama dengan nilai minimum
            const duplicates = labels.filter(label => BloodGroupCounts[label] === minCount);

            // Jika terdapat lebih dari satu label dengan jumlah terlangka, ambil yang pertama setelah diurutkan
            if (duplicates.length > 1) {
                return duplicates.sort()[0];
            }

            // Kembalikan teks golongan darah terlangka
            return teksGolonganDarahTerlangka;
        },
    },

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
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <Loading v-if="!loaded" /> <!-- Tampilkan loading jika data belum dimuat -->

        <div v-else class="flex flex-col gap-4 pt-4 pl-4 w-full lg:w-auto max-md:w-[95%]">
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
                    class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg p-4 w-full lg:w-auto max-md:w-[95%]">
                    <p class="font-assistant text-[18px] font-bold leading-5 text-midnightblue w-full pt-4 lg:pl-8">Grafik
                        Pasien
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
                            Pasien berdasarkan Umur</p>
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

