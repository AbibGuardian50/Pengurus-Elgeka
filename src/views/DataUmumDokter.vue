<script>
import Sidebar from "../components/Sidebar.vue";
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

export default {
    async created() {
        this.loaded = false;
        const toast = useToast();
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list_patient/website';
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

            const ListDoctorurl = 'https://elgeka-mobile-production.up.railway.app/api/doctor/list/website';
            const ListDoctorresponse = await axios.get(ListDoctorurl, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            const responseListDoctor = ListDoctorresponse.data.Data;
            console.log(ListDoctorresponse);
            if (ListDoctorresponse.data.Message === "Success to Get Doctor List") {
                toast.success('Data Daftar Dokter Berhasil Dimuat');
            }

            const DoctorPatientData = responseData.map(item => item.PatientData ? item.PatientData.length : 0);
            const DoctorData = responseData.map(item => item.DoctorName);


            this.doctorData = {
                labels: DoctorData.map(label => this.trimLabel(label)),
                datasets: [
                    {
                        label: 'Jumlah Pasien',
                        color: '#FF6384',
                        backgroundColor: '#0A6B77',
                        data: DoctorPatientData
                    },
                ]
            };
            this.loaded = true;

            const HospitalPerDoctorCount = {};
            responseListDoctor.forEach(doctor => {
                const hospitals = doctor.HospitalName.split(','); // Assuming multiple hospitals are comma-separated
                hospitals.forEach(hospital => {
                    hospital = hospital.trim();
                    if (HospitalPerDoctorCount[hospital]) {
                        HospitalPerDoctorCount[hospital]++;
                    } else {
                        HospitalPerDoctorCount[hospital] = 1;
                    }
                });
            });
            // Prepare hospital data for chart
            const consolidatedHospitalCount = {};
            Object.keys(HospitalPerDoctorCount).forEach(hospitalName => {
                const baseName = this.trimLabel(hospitalName);
                if (consolidatedHospitalCount[baseName]) {
                    consolidatedHospitalCount[baseName] += HospitalPerDoctorCount[hospitalName];
                } else {
                    consolidatedHospitalCount[baseName] = HospitalPerDoctorCount[hospitalName];
                }
            });

            const labels = Object.keys(consolidatedHospitalCount).map(label => this.trimLabel(label));
            const data = Object.values(consolidatedHospitalCount);

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

            const SpecialistDoctorCount = {};
            responseListDoctor.forEach(doctor => {
                const Specialist = doctor.Specialist;
                if (SpecialistDoctorCount[Specialist]) {
                    SpecialistDoctorCount[Specialist]++;
                } else {
                    SpecialistDoctorCount[Specialist] = 1;
                }
            });
            const labelspoli = Object.keys(SpecialistDoctorCount).map(label => this.trimLabel(label));
            const datapoli = Object.values(SpecialistDoctorCount);

            this.SpecialistPerDoctorData = {
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
            this.SpecialistCount = SpecialistDoctorCount;
            this.TotalPoliDoctor = responseListDoctor.length;

        } catch (error) {
            const toast = useToast();
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali');
            }
            console.error(error);
        }
    },
    components: {
        Sidebar,
        Bar,
        Doughnut,
    },
    data() {
        return {
            loaded: false,
            doctorData: [],
            TotalDoctor: [],
            DataDoctorGeneral: [],
            TotalPatientDoctorGeneral: [],
            HospitalPerDoctorData: [],
            SpecialistPerDoctorData: [],
            HospitalPerDoctorCount: {},
            SpecialistDoctorCount: {},
            TotalHospitalDoctor: 0,
            TotalPoliDoctor: 0,
            TotalDoctorOptions: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Nama',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 25, 14), 22),
                                weight: 'bold'
                            })
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 25, 14), 22),
                                weight: 'bold'
                            })
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 25, 14), 22)
                        }),
                        bodyFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                        })
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20),
                                weight: 'bold'
                            })
                        }
                    }
                }
            },
            HospitalOptions: {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Nama',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 25, 14), 22),
                                weight: 'bold'
                            })
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 25, 14), 22),
                                weight: 'bold'
                            })
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 25, 14), 22)
                        }),
                        bodyFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                        })
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20),
                                weight: 'bold'
                            })
                        }
                    }
                }
            },
            SpecialistDoctorOptions: {
                scales: {
                    x: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Nama',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 25, 14), 22),
                                weight: 'bold'
                            })
                        },
                    },
                    y: {
                        ticks: {
                            color: '#222539',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                            })
                        },
                        title: {
                            display: true,
                            text: 'Jumlah',
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 25, 14), 22),
                                weight: 'bold'
                            })
                        }
                    },
                },
                responsive: true,
                plugins: {
                    tooltip: {
                        titleFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 25, 14), 22)
                        }),
                        bodyFont: (context) => ({
                            size: Math.min(Math.max(context.chart.width / 30, 12), 20)
                        })
                    },
                    legend: {
                        labels: {
                            color: "#222539",
                            font: (context) => ({
                                size: Math.min(Math.max(context.chart.width / 30, 12), 20),
                                weight: 'bold'
                            })
                        }
                    }
                }
            }
        };
    },
    methods: {
        trimLabel(label) {
            return label.length > 10 ? label.substring(0, 10) + '...' : label;
        }
        // generateRandomColor() {
        //     const letters = '0123456789ABCDEF';
        //     let color = '#';
        //     for (let i = 0; i < 6; i++) {
        //         color += letters[Math.floor(Math.random() * 16)];
        //     }
        //     return color;
        // }
    },
}
</script>

<template>
    <div class="flex min-h-screen">
        <Sidebar></Sidebar>
        <div class="flex-1 bg-offwhite max-w-full p-4">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">Data Dokter</h1>
            <div v-if="loaded">
                <div class="flex gap-4 max-w-[80%] max-md:flex-col mb-8">
                    <div class="bg-white shadow-md rounded-lg min-w-[50%] max-w-[85%] max-md:min-w-[100%] p-6 max-sm:p-1">
                        <h2 class="max-sm:text-[16px] max-sm:text-center sm:text-2xl font-bold font-opensans mb-4">Grafik Jumlah Pasien per Dokter Aktif</h2>
                        <Bar :data="doctorData" :options="TotalDoctorOptions"></Bar>
                    </div>
                    <div class="flex flex-col p-4 bg-work bg-no-repeat bg-center bg-cover rounded-md w-full">
                        <div class="flex flex-col justify-between">
                            <div class="flex flex-col gap-4 mb-8">
                                <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA UMUM DOKTER</p>
                                <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data umum Dokter</p>
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


                    </div>
                </div>

                <div class="flex gap-4 max-w-[80%] max-md:flex-col">
                    <div
                        class="bg-white max-sm:text-[16px] max-sm:text-center min-w-[50%]  max-[1000px]:max-w-[50%] max-md:min-w-[100%] shadow-md rounded-lg p-6 max-sm:p-1 mb-8">
                        <h2 class="sm:text-2xl font-bold mb-4">Grafik Jumlah Dokter Aktif per Rumah Sakit</h2>
                        <Bar :data="HospitalPerDoctorData" :options="HospitalOptions"></Bar>
                    </div>
                    <div
                        class="bg-white max-sm:text-[16px] max-sm:text-center min-w-[50%] max-[1000px]:max-w-[50%] max-md:min-w-[100%] shadow-md rounded-lg p-6 max-sm:p-1 mb-8">
                        <h2 class="sm:text-2xl font-bold mb-4">Grafik Jumlah Dokter Aktif per Spesialis</h2>
                        <Bar :data="SpecialistPerDoctorData" :options="SpecialistDoctorOptions"></Bar>
                    </div>
                </div>

            </div>
            <div v-else class="flex justify-center items-center h-full">
                <div class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.loader {
    border-top-color: #3498db;
    animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}</style>
