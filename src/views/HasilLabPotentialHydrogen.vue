<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { useToast } from 'vue-toastification';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    async created() {
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-mobile-production.up.railway.app/api/user/health_status/list_website/potential_hydrogen'
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            const responseData = response.data.Data;
            const toast = useToast();
            if (response.data.ErrorMessage === 'Failed to parse token') {
                        toast.error('Token invalid, mohon untuk login kembali');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }

            // Menghitung jumlah kemunculan setiap nilai Data
            const DataLabPotentialHydrogenCounts = {
                '14': 0,
                '11-13': 0,
                '9-11': 0,
                '7-9': 0,
                '5-7': 0,
                '3-5': 0,
                '1-3': 0,
                '< 1': 0,
            };
            responseData.forEach(item => {
                const DataLabPotentialHydrogen = item.Data;
                if (DataLabPotentialHydrogen !== 0 && DataLabPotentialHydrogen !== null) {
                    if (DataLabPotentialHydrogen < 1) {
                        DataLabPotentialHydrogenCounts['< 1']++;
                    } else if (DataLabPotentialHydrogen <= 3) {
                        DataLabPotentialHydrogenCounts['1-3']++;
                    } else if (DataLabPotentialHydrogen <= 5) {
                        DataLabPotentialHydrogenCounts['3-5']++;
                    } else if (DataLabPotentialHydrogen <= 7) {
                        DataLabPotentialHydrogenCounts['5-7']++;
                    } else if (DataLabPotentialHydrogen <= 9) {
                        DataLabPotentialHydrogenCounts['7-9']++;
                    } else if (DataLabPotentialHydrogen <= 11) {
                        DataLabPotentialHydrogenCounts['9-11']++;
                    } else if (DataLabPotentialHydrogen <= 13) {
                        DataLabPotentialHydrogenCounts['11-13']++;
                    } else if (DataLabPotentialHydrogen <= 14) {
                        DataLabPotentialHydrogenCounts['14']++;
                    }
                }
            });

            // Persiapkan data untuk chart
            const chartData = {
                labels: Object.keys(DataLabPotentialHydrogenCounts),
                datasets: [{
                    label: 'Jumlah Orang',
                    backgroundColor: '#56B4E9',
                    borderWidth: 1,
                    data: Object.values(DataLabPotentialHydrogenCounts),
                }],
            };

            this.DataLabPotentialHydrogen = chartData;
            this.loaded = true; // Setelah data dimuat berhasil
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar,
        Bar,
    },
    data() {
        return {
            loaded: false,
            DataLabPotentialHydrogen: null, // Ganti menjadi null untuk menunjukkan bahwa data belum dimuat
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
                    <p class="font-assistant text-[18px] leading-6 font-semibold leading-5 text-midnightblue w-full py-4 pl-8 border-b border-[#3347E6]">GRAFIK DATA POTENTIAL HYDROGEN</p>
                    <Bar v-if="loaded" :data="DataLabPotentialHydrogen"
                        class="min-w-[700px] max-w-[1000px] min-h-[350px] max-h-[650px] text-white ml-8" />
                </div>

                <div
                    class="flex flex-col justify-between pl-4 bg-work bg-no-repeat bg-center bg-cover h-full rounded-md max-h-[900px] min-w-[509px] max-w-[700px]">
                    <div class="flex flex-col gap-4">
                        <p class="pt-8 font-opensans text-white font-bold text-[16px] leading-4">DATA POTENTIAL HYDROGEN KESELURUHAN</p>
                        <p class="font-opensans text-white font-normal text-[16px] leading-4">Baca lebih lanjut tentang data
                            Potential Hydrogen</p>
                    </div>
                    <div class="">
                        <a href="/DetailHasilLabPotentialHydrogen"><button class="font-opensans text-white flex items-center gap-2 pb-4">Read
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
</template>
