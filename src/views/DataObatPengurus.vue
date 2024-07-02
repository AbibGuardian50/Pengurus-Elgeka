<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/dataObat';
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            if (response.data.message === "Get Data Obat Successfully" && response.data.result.totalItems > 0) {
                toast.success('Data obat pengurus berhasil dimuat!');
            } else if (response.data.message === "Get Data Obat Successfully" && response.data.result.totalItems === 0) {
                toast.warning('Data obat pengurus sedang kosong');
            }
            console.log(response);
            this.DataMedicine = response.data.result.data;
            this.DataMedicine.sort((x, y) => x.id - y.id);
            this.DataMedicine.forEach((item, index) => {
                item.no = index + 1;
                // Convert list_dosis to a string if it is an array
                if (Array.isArray(item.list_dosis)) {
                    item.list_dosis = item.list_dosis.join(', ');
                }
            });
            this.totalPages = Math.ceil(this.DataMedicine.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
        } catch (error) {
            const toast = useToast();
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali');
            } else {
                toast.error ('Sedang terjadi gangguan, mohon coba lagi')
            }
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            medicines: [],
            form: {
                nama_obat: '',
                list_dosis: [''],
                kategori: '',
            },
            showcreatemedicine: false,
            perPage: 10, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedDataMedicine: [],
            DataMedicine: [], // Paginated data
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc' // Sort direction
        }
    },
    methods: {
        createmedicine() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/dataObat';
            const dataToSend = {
                ...this.form,
                list_dosis: this.form.list_dosis.join(', ') // Convert list_dosis array to string
            };
            axios.post(url, dataToSend, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Create Data Obat Successfully") {
                        toast.success('Data Rumah Sakit Baru Berhasil Ditambahkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch(error => {
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error);
                });
        },
        deletehospital(id) {
            if (confirm('Apakah kamu yakin untuk menghapus data obat pengurus ini?')) {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataObat/${id}`;
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data);
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        toggleModalCreateMedicine() {
            this.showcreatemedicine = !this.showcreatemedicine;
        },
        addDosisInput() {
            this.form.list_dosis.push('');
        },
        removeDosisInput(index) {
            this.form.list_dosis.splice(index, 1);
        },
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedDataMedicine = this.DataMedicine.slice(startIndex, endIndex);
        },
        goToPage(pageNumber) {
            this.currentPage = pageNumber; // Set current page to the selected page number
            this.updatePaginatedData(); // Update paginated data for the selected page
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updatePaginatedData(); // Update paginated data when navigating to next page
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePaginatedData(); // Update paginated data when navigating to previous page
            }
        },
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            this.DataMedicine.sort((a, b) => {
                let compareA, compareB;
                if (column === 'no') {
                    compareA = a.no;
                    compareB = b.no;
                } else if (column === 'Date') {
                    compareA = new Date(a.Date);
                    compareB = new Date(b.Date);
                }
                if (this.sortDirection === 'asc') {
                    return compareA > compareB ? 1 : -1;
                } else {
                    return compareA < compareB ? -1 : 1;
                }
            });
            this.updatePaginatedData();
        },
        sortNoColumn() {
            if (this.sortOrder === 'asc') {
                this.DataMedicine.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.DataMedicine.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },
    }
}
</script>


<template>
    <div class="flex bg-offwhite h-full">
        <Sidebar />

        <div class="ml-8 max-sm:ml-2 pt-4 w-full bg-offwhite">
            <div class="heading-div-general max-[1400px]:justify-start max-[1400px]:gap-4 max-md:gap-2">
                <p class="title-heading-general">Data Obat (Pengurus)</p>
            </div>

            <div class="overflow-x-auto max-w-full max-[700px]:max-w-[85%]">
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-teal">
                            <th scope="col"
                                class="th-general max-lg:pl-1 flex items-center cursor-pointer"
                                @click="sortNoColumn">
                                No
                                <span v-if="sortOrder === 'asc'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M12 19V6M5 12l7-7 7 7" />
                                    </svg>
                                </span>
                                <span v-else>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M12 5v13M5 12l7 7 7-7" />
                                    </svg>
                                </span>
                            </th>
                            <th scope="col" class="th-general max-lg:pl-1">
                                Nama
                            </th>
                            <th scope="col" class="th-general max-lg:pl-1">
                                Dosis
                            </th>
                            <th scope="col" class="th-general max-lg:pl-1">
                                Kategori
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateMedicine()"
                                    class="bg-teal px-4 py-1 rounded-md text-left  font-semibold text-white text-base">Tambah</button>
                            </th>
                        </tr>
                    </thead>

                    <tbody v-for="(data, index) in DataMedicine" :key="index" class="divide-y divide-gray-200">
                        <tr>
                            <td class="td-general td-text-general">
                                {{ data.no }}
                            </td>
                            <td class="td-general">
                                <div class="flex items-center">
                                    <div class="">
                                        <div class=" td-text-general">
                                            {{ data.nama_obat }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="td-general">
                                <p class=" td-text-general ">{{ data.list_dosis }}</p>
                            </td>
                            <td class="td-general">
                                <p class=" td-text-general ">{{ data.kategori }}</p>
                            </td>
                            <td
                                class="px-3 max-[1075px]:px-2 py-4 flex flex-col gap-2 justify-center items-center whitespace-nowrap text-sm font-medium">
                                <a :href="'EditDataObatPengurus/' + data.id">
                                    <button
                                        class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] bg-white font-bold text-base text-teal shadow-s">Edit</button>
                                </a>
                                <button href="#" @click="deletehospital(data.id)"
                                    class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] shadow-s bg-white bg-opacity-64 text-teal font-bold text-base ">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>


            <div class="ml-8 my-8 flex justify-center">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 mr-2 bg-teal  text-white rounded-md">Previous</button>
                <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                    :class="{ 'bg-teal  text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                    class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-teal  text-white rounded-md">Next</button>
            </div>

            <!-- Modal for Creating Medicine -->
            <div v-if="showcreatemedicine" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div class="bg-white p-8 rounded-lg shadow-lg w-96">
                    <h2 class="text-xl font-bold mb-4 text-teal">Tambah Obat</h2>
                    <form @submit.prevent="createmedicine">
                        <div class="mb-4">
                            <label for="nama_obat" class="block text-gray-700">Nama Obat:</label>
                            <input type="text" v-model="form.nama_obat" id="nama_obat" placeholder="Nama obat, misal Parasetamol"
                                class="w-full px-3 py-2 border rounded">
                        </div>

                        <div class="mb-4">
                            <label for="kategori" class="block text-gray-700">Kategori:</label>
                            <select v-model="form.kategori" class="w-full px-3 py-2 border rounded" required>
                                <option value="">Select Role</option>
                                <option value="CML">CML</option>
                                <option value="Pendukung">Pendukung</option>
                            </select>
                        </div>

                        <div class="mb-4">
                            <label class="block text-gray-700">Dosis:</label>
                            <div v-for="(dosis, index) in form.list_dosis" :key="index" class="flex items-center mb-2">
                                <input type="text" v-model="form.list_dosis[index]" placeholder="Isi dosis obat, contoh : 300MG"
                                    class="w-full px-3 py-2 border rounded mr-2">
                                <button type="button" @click="removeDosisInput(index)"
                                    class="bg-teal text-white px-3 py-2 rounded">Hapus</button>
                            </div>
                            <button type="button" @click="addDosisInput" class="bg-teal text-white px-4 py-2 rounded">Tambah
                                Dosis</button>
                        </div>

                        <div class="flex justify-end">
                            <button type="button" @click="toggleModalCreateMedicine"
                                class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Batal</button>
                            <button type="submit" class="bg-teal text-white px-4 py-2 rounded">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
