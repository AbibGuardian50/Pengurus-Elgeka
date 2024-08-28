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

            const categorymedicineurl = 'https://elgeka-web-api-production.up.railway.app/api/v1/dataKategoriObat'
            const responsecategory = await axios.get(categorymedicineurl, {
                headers: {
                    Authorization: `Bearer ${tokenlogin}`
                },
            });
            this.DataCategoryMedicine = responsecategory.data.result.data

            if (response.data.message === "Get Data Obat Successfully" && response.data.result.totalItems > 0) {
                toast.success('Data obat pengurus berhasil dimuat!');
            } else if (response.data.message === "Get Data Obat Successfully" && response.data.result.totalItems === 0) {
                toast.warning('Data obat pengurus sedang kosong');
            }
            console.log(response);
            this.DataMedicine = response.data.result.data;
            this.originalInfoMedicine = [...this.DataMedicine];
            this.DataMedicine.sort((x, y) => x.id - y.id);
            this.DataMedicine.forEach((item, index) => {
                item.no = index + 1;
                // Convert list_dosis to a string if it is an array
                if (Array.isArray(item.list_dosis)) {
                    item.list_dosis = item.list_dosis.map(dosis => `${dosis.amount}${dosis.unit}`).join(', ');
                }
            });
            this.totalPages = Math.ceil(this.DataMedicine.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
        } catch (error) {
            const toast = useToast();
            if (error.message === "Request failed with status code 401") {
                toast.error('Error code 401, Mohon untuk logout lalu login kembali');
            } else {
                toast.error('Sedang terjadi gangguan, mohon coba lagi')
            }
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            DataCategoryMedicine: [],
            originalInfoMedicine: [],
            medicines: [],
            form: {
                nama_obat: '',
                list_dosis: [{ amount: '', unit: 'mg' }],
                kategori: '',
            },
            showcreatemedicine: false,
            showEditMedicine: false,
            editMedicineId: null,
            perPage: 10,
            currentPage: 1,
            totalPages: 0,
            paginatedDataMedicine: [],
            DataMedicine: [],
            sortColumn: 'no',
            sortDirection: 'asc',
            dosis: {
                amount: ''
            },
            selectedCategory: '', // Added selectedCategory for filter
            searchQuery: '',
        }
    },
    methods: {
        createmedicine() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/dataObat';
            const dataToSend = {
                ...this.form,
                list_dosis: this.form.list_dosis.map(dosis => `${dosis.amount}${dosis.unit}`).join(', ')
            };
            axios.post(url, dataToSend, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Create Data Obat Successfully") {
                        toast.success('Data Obat Baru Berhasil Ditambahkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else if (response.data.message === "Error Creating Data Obat: Data Obat already exists") {
                        toast.error('Nama obat yang akan ditambahkan sudah ada, mohon untuk menggantinya dengan nama lain');
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali')
                    }
                })
                .catch(error => {
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error);
                });
        },
        deletehospital(id) {
            if (confirm('Apakah kamu yakin untuk menghapus data obat pengurus ini?')) {
                const toast = useToast();
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataObat/${id}`;
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        if (response.status.message === 'Delete Data Obat by ID Successfully') {
                            console.log(response.data);
                            window.location.reload();
                        } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                            toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali')
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        editmedicine() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataObat/${this.editMedicineId}`;
            const dataToSend = {
                ...this.form,
                list_dosis: this.form.list_dosis.map(dosis => `${dosis.amount}${dosis.unit}`).join(', ')
            };
            axios.patch(url, dataToSend, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Update Data Obat by ID Successfully") {
                        toast.success('Data Obat Berhasil Diperbarui');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else if (response.data.message === "Error Update Data Obat by ID: Data Obat already exists") {
                        toast.error('Data obat yang akan diperbarui sudah memiliki nama yang sama, mohon untuk menggantinya dengan nama lain');
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali')
                    }
                })
                .catch(error => {
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error);
                });
        },
        filterMedicineByCategory() {
            if (this.selectedCategory === '') {
                // If no category is selected, show all data
                this.updatePaginatedData();
            } else {
                // Filter data by selected category
                this.paginatedDataMedicine = this.DataMedicine.filter(medicine => medicine.kategori === this.selectedCategory);
            }
        },
        isValidAmount() {
            // Regular expression to match only digits
            const regex = /^[0-9]*$/;
            return regex.test(this.dosis.amount);
        },
        toggleModalCreateMedicine() {
            this.showcreatemedicine = !this.showcreatemedicine;
            if (this.showcreatemedicine) {
                // Reset the form when opening the "Tambah Data Obat" modal
                this.form = {
                    nama_obat: '',
                    list_dosis: [{ amount: '', unit: 'mg' }],
                    kategori: '',
                };
            }
        },
        toggleModalEditMedicine(medicine) {
            this.showEditMedicine = !this.showEditMedicine;
            if (medicine) {
                this.editMedicineId = medicine.id;
                this.form = {
                    nama_obat: medicine.nama_obat,
                    list_dosis: medicine.list_dosis.split(', ').map(dosis => {
                        const match = dosis.match(/(\d+)(mg|ml|pcs)/);
                        return { amount: match[1], unit: match[2] };
                    }),
                    kategori: medicine.kategori,
                };
            } else {
                // Reset form data when closing modal without a medicine object
                this.form = {
                    nama_obat: '',
                    list_dosis: [{ amount: '', unit: 'mg' }],
                    kategori: '',
                };
            }
        },
        addDosisInput() {
            this.form.list_dosis.push({ amount: '', unit: 'mg' });
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
                } else if (column === 'kategori') {
                    compareA = a.kategori;
                    compareB = b.kategori;
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
        updateSearch() {
            if (this.searchQuery === '') {
                // Reset to original data if search query is empty
                this.DataMedicine = [...this.originalInfoMedicine];
            } else {
                // Filter data based on search query
                this.DataMedicine = this.originalInfoMedicine.filter(medicine =>
                    medicine.nama_obat.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            this.sortData(this.sortColumn); // Add this line to sort data after search
            this.currentPage = 1; // Reset pagination to first page
            this.totalPages = Math.ceil(this.DataMedicine.length / this.perPage); // Update total pages
            this.updatePaginatedData(); // Update paginated data
        },
    },
    watch: {
        selectedCategory() {
            this.filterMedicineByCategory();
        }
    },
}
</script>


<template>
    <div class="flex bg-offwhite min-h-screen">
        <Sidebar />

        <div class="ml-8 max-sm:ml-2 pt-4 w-full bg-offwhite">
            <div class="heading-div-general max-[1400px]:justify-start max-[1400px]:gap-4 max-md:gap-2 bg-offwhite">
                <p class="title-heading-general">Data Obat (Pengurus)</p>
                <div class="mr-4">
                    <label for="filterCategory"
                        class="font-poppins font-semibold text-[16px] text-teal leading-7 mr-2">Filter Kategori:</label>
                    <select v-model="selectedCategory" class="px-3 py-2 bg-white border rounded text-teal font-semibold">
                        <option value="">Semua</option>
                        <option v-for="category in DataCategoryMedicine" :value="category.nama_kategori_obat">
                            {{ category.nama_kategori_obat }}</option>

                    </select>
                </div>
            </div>

            <div class="mt-4">
                <label for="searchQuery" class="font-poppins font-semibold text-[16px] text-teal leading-7 mr-2">Cari Nama
                    Obat:</label>
                <input v-model="searchQuery" @input="updateSearch"
                    class="px-3 py-2 bg-white border rounded text-teal font-semibold" type="text" id="searchQuery"
                    placeholder="Cari nama obat...">
            </div>

            <div class="overflow-x-auto max-w-full max-[700px]:max-w-[85%]">
                <table class="min-w-full divide-y divide-gray-200 overflow-x-auto">
                    <thead>
                        <tr class="border-b-[0.5px] border-b-teal">
                            <th scope="col" class="th-general  flex items-center cursor-pointer" @click="sortNoColumn">
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
                            <th scope="col" class="th-general ">
                                Nama
                            </th>
                            <th scope="col" class="th-general ">
                                Dosis
                            </th>
                            <th scope="col" class="th-general ">
                                Kategori
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalCreateMedicine()"
                                    class="bg-teal px-4 py-1 rounded-md text-left  font-semibold text-white text-base">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray">
                        <tr class="" v-for="medicine in paginatedDataMedicine" :key="medicine.id">
                            <td class="td-general td-text-general">{{ medicine.no }}</td>
                            <td class="td-general td-text-general">{{ medicine.nama_obat }}</td>
                            <td class="td-general td-text-general">{{ medicine.list_dosis }}</td>
                            <td class="td-general td-text-general">{{ medicine.kategori }}</td>
                            <td
                                class="px-3 max-[1075px]:px-2 py-4 flex flex-col gap-2 justify-center items-center whitespace-nowrap text-sm font-medium">
                                <button @click="toggleModalEditMedicine(medicine)"
                                    class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] bg-white font-bold text-base text-teal shadow-s">Edit</button>
                                <button @click="deletehospital(medicine.id)"
                                    class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] shadow-s bg-white bg-opacity-64 text-teal font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="ml-8 my-8 flex justify-center">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 mr-2 bg-teal  text-white rounded-md">Previous</button>
                    <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                        :class="{ 'bg-teal  text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                        class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-teal  text-white rounded-md">Next</button>
                </div>

            </div>

            <div v-if="showcreatemedicine" class="fixed inset-0 flex max-h-[38rem] max-sm:items-start justify-center z-50">
                <div class="modal-overlay fixed inset-0 bg-gray-900 opacity-50"></div>
                <div
                    class="modal-container bg-white w-11/12 max-sm:w-9/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6">
                        <div class="flex justify-between items-center mb-3 border-b border-teal">
                            <p
                                class="font-poppins font-semibold text-[35px] max-lg:text-[30px] max-md:text-[20px] text-teal">
                                Tambah Data Obat</p>
                            <div class="modal-close cursor-pointer z-50" @click="toggleModalCreateMedicine">
                                <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18"
                                    height="18" viewBox="0 0 18 18">
                                    <path
                                        d="M14.53 3.47a.75.75 0 00-1.06 0L9 7.94 4.53 3.47a.75.75 0 10-1.06 1.06L7.94 9l-4.47 4.47a.75.75 0 101.06 1.06L9 10.06l4.47 4.47a.75.75 0 101.06-1.06L10.06 9l4.47-4.47a.75.75 0 000-1.06z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <form @submit.prevent="createmedicine">
                            <div class="mb-4">
                                <label class="font-poppins font-semibold text-[16px] text-teal leading-7" for="nama_obat">
                                    Nama Obat
                                </label>
                                <input v-model="form.nama_obat" type="text" placeholder="Masukkan Nama Obat"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight ">
                            </div>
                            <div class="mb-4">
                                <label class="font-poppins font-semibold text-[16px] text-teal leading-7">
                                    Dosis
                                </label>
                                <div v-for="(dosis, index) in form.list_dosis" :key="index" class="flex mb-2">
                                    <input v-model="dosis.amount" type="text" inputmode="numeric" pattern="[0-9]*" min="0"
                                        placeholder="Masukkan angka"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight mr-2">
                                    <span v-if="!isValidAmount" class="text-teal text-xs">Hanya ketikkan angka
                                        saja</span>
                                    <select v-model="dosis.unit" class="px-2 py-2 border rounded">
                                        <option value="mg">mg</option>
                                        <option value="ml">ml</option>
                                        <option value="pcs">pcs</option>
                                    </select>
                                    <button @click="removeDosisInput(index)"
                                        class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded ml-2">Hapus</button>
                                </div>
                                <button type="button" @click="addDosisInput"
                                    class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded">Tambah
                                    Dosis</button>

                            </div>
                            <div class="mb-4">
                                <label class="font-poppins font-semibold text-[16px] text-teal leading-7" for="kategori">
                                    Kategori
                                </label>
                                <select v-model="form.kategori" class="w-full px-3 py-2 bg-white border rounded" required>
                                    <option selected value="">Pilih Kategori</option>
                                    <option v-for="category in DataCategoryMedicine" :value="category.nama_kategori_obat">
                                        {{ category.nama_kategori_obat }}</option>
                                </select>
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


            <div v-if="showEditMedicine" class="fixed inset-0 flex max-sm:items-start max-h-[38rem] justify-center z-50">
                <div class="modal-overlay fixed inset-0 bg-gray-900 opacity-50"></div>
                <div
                    class="modal-container bg-white w-11/12 max-sm:w-9/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto ">
                    <div class="modal-content py-4 text-left px-6">
                        <div class="flex justify-between items-center mb-3 border-b border-teal">
                            <p
                                class="font-poppins font-semibold text-[40px] max-lg:text-[30px] max-md:text-[20px] text-teal">
                                Edit Data Obat</p>
                        </div>
                        <form @submit.prevent="editmedicine">
                            <div class="mb-4">
                                <label class="font-poppins font-semibold text-[16px] text-teal leading-7" for="nama_obat">
                                    Nama Obat
                                </label>
                                <input v-model="form.nama_obat" type="text" placeholder="Masukkan Nama Obat"
                                    class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight ">
                            </div>
                            <div class="mb-4">
                                <label class="font-poppins font-semibold text-[16px] text-teal leading-7">
                                    Dosis
                                </label>
                                <div v-for="(dosis, index) in form.list_dosis" :key="index" class="flex mb-2">
                                    <input v-model="dosis.amount" type="text" inputmode="numeric" pattern="[0-9]*" min="0"
                                        placeholder="Masukkan angka saja"
                                        class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight  mr-2">
                                    <span v-if="!isValidAmount" class="text-teal text-xs">Hanya ketikkan angka
                                        saja</span>
                                    <select v-model="dosis.unit" class="px-2 py-2 border rounded">
                                        <option value="mg">mg</option>
                                        <option value="ml">ml</option>
                                        <option value="pcs">pcs</option>
                                    </select>
                                    <button @click="removeDosisInput(index)"
                                        class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded  ml-2">Hapus</button>
                                </div>
                                <button type="button" @click="addDosisInput"
                                    class="bg-teal text-white font-bold font-poppins py-2 px-4 rounded">Tambah
                                    Dosis</button>

                            </div>
                            <div class="mb-4">
                                <label class="font-poppins font-semibold text-[16px] text-teal leading-7" for="kategori">
                                    Kategori
                                </label>
                                <select v-model="form.kategori" class="w-full px-3 py-2 bg-white border rounded" required>
                                    <option value="">Pilih Kategori</option>
                                    <option v-for="category in DataCategoryMedicine" :value="category.nama_kategori_obat">
                                        {{ category.nama_kategori_obat }}</option>
                                </select>
                            </div>
                            <div class="flex justify-end">
                                <button type="button" @click="toggleModalEditMedicine"
                                    class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Batal</button>
                                <button type="submit" class="bg-teal text-white px-4 py-2 rounded">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.modal-container {
    z-index: 9999;
}

.modal-content {
    z-index: 10000;
}

.modal-close {
    cursor: pointer;
}
</style>
