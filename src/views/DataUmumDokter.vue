<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { Bar, Pie, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
    async created() {
        this.loaded = false
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
            console.log(responseData);
            this.TotalDoctor = responseData.length;
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
        } catch (error) {
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

    name: 'BarChart',
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="flex flex-col gap-4 pt-4 pl-4">
            <div class="flex gap-4 items-center">
                <div class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg pl-4 pr-8">
                    <p class="font-assistant text-[18px] font-bold leading-5 text-midnightblue w-full pt-4 pl-8">Grafik
                        Pasien
                        berdasarkan Kabupaten</p>

                </div>

                <div
                    class="flex flex-col justify-between pl-4 bg-work bg-no-repeat bg-center bg-cover h-full max-h-[282px] min-w-[509px] max-w-[510px]">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA UMUM PASIEN</p>
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
                        <p class="font-opensans text-black font-bold text-[16px] leading-[18px] pb-4">Total Dokter:{{
                            TotalDoctor }}</p>
                    </div>
                </div>
            </div>



            <div class="flex gap-4">
                <div
                    class="bg-gradient-to-r from-azurebreeze to-deepseateal flex flex-col items-center justify-center gap-4 bg-white rounded-lg pl-4 pr-8">
                    <p class="font-bebasneue text-[24px] font-normal leading-5 text-charcoalgray w-full pt-4 pl-8">Grafik
                        Dokter</p>
                    <div class="flex">
                        <Doughnut v-if="loaded" :data="doctorData"
                            class="w-full rounded-lg p-4 max-w-[700px] min-h-[340px] max-h-[350px] text-white mx-4" />
                            <div>
                                <table  class="bg-white rounded-lg">
                                    <tr>
                                        <th scope="col" class="px-3 py-3 max-w-[250px] text-left font-bold font-hindsiliguri text-black text-base">Dokter</th>
                                        
                                        <th scope="col" class="px-3 py-3 max-w-[250px] text-left font-bold font-hindsiliguri text-black text-base">Pasien</th>
                                    </tr>

                                    <tr v-for="data in DataDoctorGeneral" :keys="data.id">
                                        <td class="px-3 py-4 font-hindsiliguri min-w-[200px] max-w-[251px]">{{ data.DoctorName }}</td>
                                        
                                        <td class="px-3 py-4 font-hindsiliguri min-w-[200px] max-w-[251px]">{{ data.PatientData ? data.PatientData.length : 0 }}</td>
                                    </tr>
                                </table>
                            </div>
                    </div>

                    <div class="pb-4">
                    </div>
                </div>

                <div class=" flex flex-col items-center justify-center gap-4 bg-white rounded-lg pl-4 pr-8">
                    <p class="font-bebasneue text-[24px] font-normal leading-5 text-charcoalgray w-full pt-4 pl-8">Data
                        dokter</p>

                </div>

            </div>



        </div>
    </div>
</template>
