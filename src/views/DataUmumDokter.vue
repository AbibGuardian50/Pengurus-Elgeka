<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { useToast } from 'vue-toastification';
import { Bar, Pie, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement,)

export default {
    async created() {
        this.loaded = false
        const toast = useToast();
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list_patient/website'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });

            const responseData = response.data.Data;
            this.DataDoctorGeneral = responseData;
            console.log(response);
            this.TotalDoctor = responseData.length;
            if (response.data.Message === "Success to Get Patient Doctor List") {
                toast.success('Data Pasien Dokter Berhasil Dimuat');
            }

            const ListDoctorurl = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list/website'
            const ListDoctorresponse = await axios.get(ListDoctorurl, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            const responseListDoctor = ListDoctorresponse.data.Data
            console.log(ListDoctorresponse)
            if (ListDoctorresponse.data.Message === "Success to Get Doctor List") {
                toast.success('Data Daftar Dokter Berhasil Dimuat');
            }

            // const TotalPatient = response.data.Data.PatientData
            // this.TotalPatientDoctorGeneral = TotalPatient.length
            // console.log(TotalPatient.length);

            // Data Pasien Dokter
            const DoctorPatientData = responseData.map(item => item.PatientData ? item.PatientData.length : 0);
            const DoctorData = responseData.map(item => item.DoctorName);
            const DoctorPatientDataCounts = {}
            const backgroundColors = DoctorData.map(() => this.generateRandomColor());

            this.doctorData = {
                labels: DoctorData,
                datasets: [
                    {
                        label: 'Jumlah Pasien',
                        color: '#FF6384',
                        backgroundColor: backgroundColors,
                        data: Object.values(DoctorPatientData)
                    },

                ]
            };
            this.loaded = true

            //Data Dokter berdasarkan RS
            const HospitalPerDoctorCount = {};
            responseListDoctor.forEach(doctor => {
                const hospitalName = doctor.HospitalName;
                if (HospitalPerDoctorCount[hospitalName]) {
                    HospitalPerDoctorCount[hospitalName]++;
                } else {
                    HospitalPerDoctorCount[hospitalName] = 1;
                }
            });
            const labels = Object.keys(HospitalPerDoctorCount);
            const data = Object.values(HospitalPerDoctorCount);
            // const backgroundColorsHospitalPerDoctor = labels.map(() => this.generateRandomColor());

            this.HospitalPerDoctorData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Jumlah Dokter',
                        backgroundColor: '#0A6B77',
                        data: data
                    }
                ]
            };
            this.loaded = true;
            this.doctorCount = HospitalPerDoctorCount;
            this.TotalHospitalDoctor = responseListDoctor.length;

            //Data Dokter berdasarkan Poli
            const PoliPerDoctorCount = {};
            responseListDoctor.forEach(doctor => {
                const polyName = doctor.PolyName;
                if (PoliPerDoctorCount[polyName]) {
                    PoliPerDoctorCount[polyName]++;
                } else {
                    PoliPerDoctorCount[polyName] = 1;
                }
            });
            const labelspoli = Object.keys(PoliPerDoctorCount);
            const datapoli = Object.values(PoliPerDoctorCount);
            // const backgroundColorsHospitalPerDoctor = labels.map(() => this.generateRandomColor());

            this.PoliPerDoctorData = {
                labels: labelspoli,
                datasets: [
                    {
                        label: 'Jumlah Dokter',
                        backgroundColor: '#0A6B77',
                        data: datapoli
                    }
                ]
            };
            this.loaded = true;
            this.poliCount = PoliPerDoctorCount;
            this.TotalPoliDoctor = responseListDoctor.length;


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
        Pie,
        Doughnut,
    },
    computed: {

    },
    data() {
        return {
            loaded: false,
            doctorData: [],
            TotalDoctor: [],
            DataDoctorGeneral: [],
            TotalPatientDoctorGeneral: [],
            HospitalPerDoctorData: [],
            PoliPerDoctorData: [],
            HospitalPerDoctorCount: {},
            PoliPerDoctorCount: {},
            TotalHospitalDoctor: 0,
            TotalPoliDoctor: 0,
            TotalDoctorOptions: {
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: {
                            size: 18,
                        },
                        bodyFont: {
                            size: 18,
                        }
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: {
                                size: 18,
                                weight: 'bold',
                            }
                        }
                    }
                }
            },
            HospitalOptions: {
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
                            text: 'Nama Rumah Sakit',
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
            PoliDoctorOptions: {
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
                            text: 'Jenis Poli',
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
    methods: {
        generateRandomColor() {
            // Generate random color in hexadecimal format
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        },
        setBackgroundColors() {
            // Generate random background colors for each data point
            this.backgroundColor = this.doctorData.map(() => this.generateRandomColor());
        }
    },

    computed: {
        filteredDoctors() {
            return this.DataDoctorGeneral.filter(doctor => doctor.PatientData && doctor.PatientData.length > 0);
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
                <div class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg ">
                    <p
                        class="font-opensans text-[18px] font-bold leading-5 text-midnightblue w-full px-8 pt-4 pb-8 border-b border-teal">
                        Grafik Dokter Berdasarkan Rumah Sakit</p>
                    <Bar v-if="loaded" :data="HospitalPerDoctorData" :options="HospitalOptions"
                        class="w-full rounded-lg p-4 max-w-[700px] min-h-[340px] max-h-[350px] text-white mx-4" />
                </div>

                <div
                    class="flex flex-col justify-between pl-4 bg-work bg-no-repeat bg-center bg-cover h-full max-h-[282px] min-w-[509px] max-w-[510px]">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA UMUM DOKTER</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            umum Dokter</p>
                    </div>
                    <div class="">
                        <a href="/detaildataumumdokter"><button
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

                <div class="flex flex-col">
                    <p class="font-bebasneue font-normal text-[24px] text-charcoalgray">Statistik Dokter</p>
                    <div
                        class="bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.04)] pl-2 pt-2 pr-8 items-start flex flex-col">
                        <p class="font-opensans text-black font-bold text-[16px] leading-[18px] pb-4">Total Dokter: {{
                            TotalDoctor }}</p>
                    </div>
                </div>
            </div>



            <div class="flex gap-4 pb-4">
                <div
                    class="bg-gradient-to-r from-azurebreeze to-deepseateal flex flex-col items-center justify-center gap-4 bg-white rounded-lg pl-4 pr-8">
                    <p class="font-bebasneue text-[24px] font-normal leading-5 text-charcoalgray w-full pt-4 pl-8">Grafik
                        Dokter</p>
                    <div class="flex">
                        <Doughnut v-if="loaded" :data="doctorData" :options="TotalDoctorOptions"
                            class="w-full rounded-lg p-4 max-w-[600px] min-h-[340px] max-h-[350px] text-white mx-4" />
                        <div>
                            <table class="rounded-lg w-full border-collapse overflow-hidden shadow-lg">
                                <thead>
                                    <tr class="bg-gray-200">
                                        <th scope="col"
                                            class="px-4 py-3 text-left font-bold font-hindsiliguri text-[16px] text-black text-base">
                                            Dokter
                                        </th>
                                        <th scope="col"
                                            class="px-4 py-3 text-left font-bold font-hindsiliguri text-[16px] text-black text-base">
                                            Pasien
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="data in filteredDoctors" :key="data.id" class="hover:bg-gray-100">
                                        <td class="px-4 py-4 bg-white font-hindsiliguri text-[16px] border-b">
                                            {{ data.DoctorName }}
                                        </td>
                                        <td class="px-4 py-4 bg-white font-hindsiliguri text-[16px] border-b">
                                            {{ data.PatientData ? data.PatientData.length : 0 }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>

                    <div class="pb-4">
                    </div>
                </div>

                <div class="flex flex-col items-center gap-4 bg-white rounded-lg ">
                    <p
                        class="font-opensans text-[18px] font-bold leading-5 text-midnightblue w-full px-8 pt-4 pb-8 border-b border-teal">
                        Grafik Dokter Berdasarkan Poli</p>
                    <Bar v-if="loaded" :data="PoliPerDoctorData" :options="PoliDoctorOptions"
                        class="w-full rounded-lg p-4 max-w-[700px] min-h-[340px] max-h-[350px] text-white mx-4" />
                </div>

            </div>



        </div>
    </div>
</template>

<style>
table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

th,
td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

thead {
    background-color: #f8f8f8;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

tr:hover {
    background-color: #f1f1f1;
}

th {
    background-color: #f0f0f0;
    font-weight: bold;
}

td {
    font-size: 14px;
}
</style>
