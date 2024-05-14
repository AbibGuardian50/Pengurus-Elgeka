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
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list_patient/website'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            const responseData = response.data.Data;
            // Data Statistik Pasien (Pasien, Obat dan Dosis)
            this.StatisticsPatientData = responseData

            const ListMedicineURL = 'https://elgeka-mobile-production.up.railway.app/api/user/medicine/list/website'
            const ListMedicineResponse = await axios.get(ListMedicineURL, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            this.TotalPatientWithMedicine = ListMedicineResponse.data.Data.Total_Patient_Have_Medicine
            const responseListMedicine = ListMedicineResponse.data.Data.Medicine
            console.log(ListMedicineResponse.data.Data.Total_Patient_Have_Medicine)
            // Data Jenis Obat dan jumlahnya
            const MedicineNameData = responseListMedicine.map(item => item.Medicine_Name);
            const TotalPatientData = responseListMedicine.map(item => item.Total_Patient);
            console.log(responseListMedicine);
            const backgroundColors = responseListMedicine.map(() => this.generateRandomColor());

            this.MedicineData = {
                labels: MedicineNameData,
                datasets: [
                    {
                        label: 'Jumlah Pasien',
                        color: '#FF6384',
                        backgroundColor: backgroundColors,
                        data: Object.values(TotalPatientData)
                    },

                ]
            };
            this.loaded = true

            //Data Dokter berdasarkan RS
            const HospitalPerDoctorCount = {};
            responseListMedicine.forEach(doctor => {
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

            this.HospitalPerMedicineData = {
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
            this.TotalHospitalDoctor = responseListMedicine.length;

            //Data Dokter berdasarkan Poli
            const PoliPerDoctorCount = {};
            responseListMedicine.forEach(doctor => {
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

            this.PoliPerMedicineData = {
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
            this.TotalPoliDoctor = responseListMedicine.length;


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
            MedicineData: [],
            TotalPatientWithMedicine: [],
            DataDoctorGeneral: [],
            TotalPatientDoctorGeneral: [],
            HospitalPerMedicineData: [],
            PoliPerMedicineData: [],
            HospitalPerDoctorCount: {},
            PoliPerDoctorCount: {},
            TotalHospitalDoctor: 0,
            TotalPoliDoctor: 0,
            StatisticsPatientData: [],

        }
    },
    methods: {
        generateRandomColor() {
            // Generate random color in hexadecimal format
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        },
        setBackgroundColors() {
            // Generate random background colors for each data point
            this.backgroundColor = this.MedicineData.map(() => this.generateRandomColor());
        }
    },

    name: 'BarChart',
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="flex flex-col">
            <div class="border-b border-lightgray pt-12 ml-4 pb-4">
                <p class="font-gotham font-bold text-blueblack text-[30px] leading-5 ">Data Kepemilikan Obat</p>
            </div>
        
            <div class="flex gap-4 py-4 pl-4">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col items-center justify-center gap-4 bg-white rounded-lg pl-4 pr-8">
                        <div>
                            <p class="font-bebasneue text-[24px] font-normal leading-5 text-charcoalgray w-full pt-4 pl-8">
                                Grafik
                                Jenis Obat</p>
                            <p class="font-bebasneue text-[24px] font-normal leading-5 text-charcoalgray w-full pt-4 pl-8">
                                Total
                                Pasien : {{ TotalPatientWithMedicine }}</p>
                        </div>

                        <div class="flex">
                            <Doughnut v-if="loaded" :data="MedicineData"
                                class="w-full rounded-lg p-4 max-w-[700px] min-h-[340px] max-h-[350px] text-white mx-4" />
                        </div>

                        <div class="pb-4">
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <p class="font-bebasneue font-normal text-[24px] text-charcoalgray">Statistik Pasien</p>
                        <div
                            class="bg-white rounded-lg shadow-[0_0_12px_0_rgba(0,0,0,0.04)] px-2 pt-2 items-start flex flex-col">
                            <div class="border-b border-teal w-full pl-2">
                                <p class="font-hindsiliguri text-teal font-medium text-[12px] leading-[18px] pb-4">Total
                                    Pasien:
                                </p>
                                <p class="font-hindsiliguri text-charcoalgray font-bold text-[32px] leading-[18px] pb-4">
                                    {{ TotalPatientWithMedicine }}</p>
                            </div>

                            <div>
                                <table>
                                    <tr>
                                        <th class="px-6 py-3">PASIEN</th>
                                        <th class="px-6 py-3">OBAT</th>
                                        <th class="px-6 py-3">JUMLAH</th>
                                    </tr>

                                    <tr v-for="patient in StatisticsPatientData" :key="patient.id">
                                        <td class="px-6 py-1 font-normal font-assistant text-black text-[15px]">{{
                                            patient.Name
                                        }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div v-for="(medicine, mIndex) in patient.ListMedicine" :key="mIndex">
                                                <p class="font-normal font-assistant text-black text-[20px]"
                                                    v-if="mIndex !== 0">- {{ medicine.Name }}
                                                </p>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div v-for="(medicine, mIndex) in patient.ListMedicine" :key="mIndex">
                                                <p class="font-bold font-assistant text-black text-[16px]"
                                                    v-if="mIndex !== 0">-
                                                    {{ medicine.Stock }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <a href="/detaildataumumkepemilikanobat"><button
                                                class="font-opensans text-black flex items-center gap-2 pl-4 pb-4">Read
                                                more <svg width="12" height="11" viewBox="0 0 12 11" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M1 6.00156H8.586L6.293 8.29456C6.03304 8.54563 5.92879 8.91743 6.0203 9.26706C6.11182 9.61669 6.38486 9.88974 6.73449 9.98125C7.08412 10.0728 7.45593 9.96851 7.707 9.70856L11.707 5.70856C11.8951 5.52095 12.0008 5.26621 12.0008 5.00056C12.0008 4.7349 11.8951 4.48017 11.707 4.29256L7.707 0.292556C7.31598 -0.097909 6.68247 -0.0974613 6.292 0.293556C5.90153 0.684574 5.90198 1.31809 6.293 1.70856L8.586 4.00156H1C0.447715 4.00156 0 4.44927 0 5.00156C0 5.55384 0.447715 6.00156 1 6.00156Z"
                                                        fill="black" />
                                                </svg>
                                            </button></a>
                                    </tr>
                                </table>
                            </div>

                        </div>
                    </div>

                </div>

                <div class="flex gap-4 items-center">
                    <div
                        class="flex flex-col justify-between pl-4 bg-seeingstatistics bg-no-repeat bg-center bg-cover h-full max-h-[1000px] min-w-[509px] max-w-[510px]">
                        <div class="flex flex-col gap-4">
                            <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA UMUM KEPEMILIKAN
                                OBAT
                            </p>
                            <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang
                                data
                                umum kepemilikan obat</p>
                        </div>
                        <div class="">
                            <a href="/detaildataumumkepemilikanobat"><button
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
    </div>

</div></template>
