<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';

export default {
    async created() {
        try {
            const toast = useToast();
            const response = await axios.get('https://elgeka-web-api-production.up.railway.app/api/v1/dataSpesialis');
            if (response.data.message === "Get Info RS Successfully") {
                toast.success('Data Rumah Sakit Berhasil Dimuat');
            }
            this.specialist = response.data.result.data;
            this.specialist.sort((x, y) => x.id - y.id)
            this.specialist.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.specialist.length / this.perPage); // Calculate total pages
            this.updatePaginatedData(); // Update paginated data
            console.log(response)
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            specialist: [],
            showcreatespecialist: false,
            url: 'https://elgeka-web-api-production.up.railway.app/',
            form: {
                id: null,
                nama_spesialis: '',
                deskripsi: '',
            },
            formErrors: {
                image: '',
            },
            errorMessage: '',
            perPage: 5, // Number of items per page
            currentPage: 1, // Current page
            totalPages: 0, // Total pages
            paginatedspecialist: [], // Paginated data
            sortColumn: 'no', // Column to sort by
            sortDirection: 'asc', // Sort direction
            isEditing: false // Flag for edit mode
        }
    },
    methods: {
        updatePaginatedData() {
            const startIndex = (this.currentPage - 1) * this.perPage;
            const endIndex = startIndex + this.perPage;
            this.paginatedspecialist = this.specialist.slice(startIndex, endIndex);
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
        createspecialist() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/dataSpesialis';
            // Convert this.form to a JSON string
            const dataToSend = JSON.stringify(this.form);
            axios.post(url, dataToSend, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'application/json' } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Create Data Spesialis Successfully") {
                        toast.success('Data Spesialis Baru Berhasil Ditambahkan');
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    } else if (response.data.message === "Error Creating Data Spesialis: Data Spesialis already exists") {
                        toast.error('Nama Spesialis yang akan ditambahkan sudah ada, mohon untuk menggantinya dengan nama lain')
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali')
                    }
                })
                .catch(error => {
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error);
                });
        },
        deletespecialist(id) {
            if (confirm('Apakah kamu yakin untuk menghapus data spesialis ini?')) {
                const toast = useToast();
                const tokenlogin = VueCookies.get('TokenAuthorization')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataSpesialis/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        if (response.status.message === "Delete Data Spesialis by ID Successfully") {
                            console.log(response.data);
                            window.location.reload();
                        } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                            toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali')
                        }

                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        },
        toggleModalcreatespecialist() {
            this.showcreatespecialist = !this.showcreatespecialist;
            if (!this.showcreatespecialist) {
                this.resetForm();
            }
        },
        resetForm() {
            this.form.id = null;
            this.form.nama_spesialis = '';
            this.form.deskripsi = '';
            this.isEditing = false;
        },
        editSpecialist(data) {
            this.form.id = data.id;
            this.form.nama_spesialis = data.nama_spesialis;
            this.form.deskripsi = data.deskripsi;
            this.isEditing = true;
            this.showcreatespecialist = true;
        },
        updateSpecialist() {
            const toast = useToast();
            const tokenlogin = VueCookies.get('TokenAuthorization');
            const url = `https://elgeka-web-api-production.up.railway.app/api/v1/dataSpesialis/${this.form.id}`;

            // Convert this.form to a JSON string
            const dataToSend = JSON.stringify(this.form);

            axios.patch(url, dataToSend, { headers: { 'Authorization': `Bearer ${tokenlogin}`, 'Content-Type': 'application/json' } })
                .then(response => {
                    console.log(response);
                    if (response.data.message === "Update Data Spesialis by ID Successfully") {
                        toast.success('Data Spesialis Berhasil Diperbarui');
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    } else if (response.data.message === "Error Update Data Kategori Obat by ID: Data Kategori Obat already exists") {
                        toast.success('Data Spesialis yang akan diperbarui sudah memiliki nama yang sama, mohon untuk menggantinya dengan nama lain');
                    } else if (response.data.message === "Your admin status is not active, authorization denied!") {
                        toast.error('Status akun masih nonaktif, mohon untuk diaktifkan kembali')
                    }
                })
                .catch(error => {
                    toast.error('Terdapat kesalahan pada sistem, mohon coba lagi');
                    console.log(error);
                });
        },
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            this.specialist.sort((a, b) => {
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
                    return compareA < compareB ? 1 : -1;
                }
            });
            this.updatePaginatedData();
        },
        sortNoColumn() {
            if (this.sortOrder === 'asc') {
                this.specialist.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.specialist.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },
    }
}
</script>

<template>
    <div class="flex min-h-screen">
        <Sidebar />

        <div class="pl-8 max-sm:pl-2 pt-4 w-full bg-offwhite">
            <div class="heading-div-general">
                <p class="title-heading-general">Data Spesialis</p>
            </div>

            <div class="container-table-general bg-offwhite">
                <table class="table-general">
                    <thead class="">
                        <tr class="border-b-[0.5px] border-b-lightgray">
                            <th scope="col"
                                class="px-3 py-3 max-[1300px]:pb-0 max-[1200px]:pl-0 max-w-[50px] flex items-center gap-1 text-left font-bold font-poppins text-black text-base cursor-pointer"
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
                            <th scope="col" class="th-general">
                                Nama Spesialis
                            </th>
                            <th scope="col" class="th-general">
                                Deskripsi
                            </th>
                            <th scope="col" class="">
                                <button v-on:click="toggleModalcreatespecialist"
                                    class="bg-teal px-4 py-1 rounded-md text-left font-semibold text-white text-base">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="data in paginatedspecialist" :key="data.id" class="divide-y divide-gray-200">
                        <tr>
                            <td class="td-general">
                                {{ data.no }}
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ data.nama_spesialis }}</p>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general">{{ data.deskripsi }}</p>
                            </td>
                            <td
                                class="px-3 max-[1075px]:px-2 py-4 flex flex-col gap-2 justify-center items-center whitespace-nowrap text-sm font-medium">
                                <button @click="editSpecialist(data)"
                                    class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] bg-white font-bold text-base text-teal shadow-s">Edit</button>
                                <button @click="deletespecialist(data.id)"
                                    class="py-1 px-8 max-[1075px]:px-0 rounded-[5px] w-[110px] shadow-s bg-white bg-opacity-64 text-teal font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination navigation -->
            <div class="ml-8 my-8 flex justify-center">
                <button @click="prevPage" :disabled="currentPage === 1"
                    class="px-4 py-2 mr-2 bg-teal text-white rounded-md">Previous</button>
                <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                    :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, 'bg-white text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                    class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="px-4 py-2 bg-teal text-white rounded-md">Next</button>
            </div>

            <!-- Modal Create/Edit Specialist -->
            <div>
                <form v-if="showcreatespecialist" @submit.prevent="isEditing ? updateSpecialist() : createspecialist()"
                    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center max-[600px]:justify-start max-[600px]:items-start items-center flex">
                    <div class="relative w-auto my-6 max-[600px]:my-0 mx-auto max-w-6xl">
                        <!--content-->
                        <div
                            class="border border-red rounded-lg shadow-lg relative flex flex-col w-full max-[600px]:w-[85%] bg-white outline-none focus:outline-none">
                            <!--header-->
                            <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                <h3 class="text-[40px] text-teal font-semibold font-poppins">
                                    {{ isEditing ? 'Edit Data Spesialis' : 'Data Spesialis' }}
                                </h3>
                                <button
                                    class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    v-on:click="toggleModalcreatespecialist">
                                    <span
                                        class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    </span>
                                </button>
                            </div>
                            <!--body-->
                            <div class="flex flex-col gap-8 relative p-6">
                                <div class="flex gap-2 flex-col">
                                    <label for="nama_spesialis" class="font-poppins font-bold text-base text-teal">Nama
                                        Spesialis</label>
                                    <input class="border border-black py-4 min-w-[550px] max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="nama_spesialis" id="nama_spesialis"
                                        v-model="form.nama_spesialis" placeholder="Contoh: SP1, SP2 dll">
                                </div>
                                <div class="flex gap-2 flex-col">
                                    <label for="deskripsi"
                                        class="font-poppins font-bold text-base text-teal">Deskripsi</label>
                                    <input class="border border-black py-4 min-w-[550px] max-md:min-w-full pl-2 rounded-md"
                                        type="text" required name="deskripsi" id="deskripsi" v-model="form.deskripsi"
                                        placeholder="Penjelasan">
                                </div>
                            </div>
                            <!--footer-->
                            <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                <button
                                    class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                    type="submit">
                                    {{ isEditing ? 'Simpan' : 'Simpan' }}
                                </button>
                                <button
                                    class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                    type="button" v-on:click="toggleModalcreatespecialist">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div v-if="showcreatespecialist" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </div>
        </div>
    </div>
</template>

