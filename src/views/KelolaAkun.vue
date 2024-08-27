<script>
import axios from "axios";
import Sidebar from "../components/Sidebar.vue";
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

export default {
    components: {
        Sidebar
    },
    async created() {
        try {
            const tokenlogin = VueCookies.get('TokenAuthorization');
            if (tokenlogin) {
                const response = await this.fetchPengurusData(tokenlogin);
                if (response && response.data && response.data.result && response.data.result.data) {
                    this.initializePengurusData(response);
                    if (response.data.message === "Get All Pengurus Successfully") {
                        const toast = useToast();
                        toast.success('Data Admin berhasil dimuat!');
                    }
                } else {
                    this.error = 'Failed to load pengurus data';
                }
            } else {
                this.error = 'dilarang akses halaman ini';
            }
        } catch (error) {
            console.error(error);
            this.error = 'An error occurred while fetching pengurus data';
        }
    },

    data() {
        return {
            daftarpengurus: [],
            showcreatepengurus: false,
            error: '',
            form: {
                full_name: '',
                username: '',
                password: '',
                superUser: '',
            },
            formErrors: {
                username: '',
                password: '',
                superUser: '',
            },
            currentPage: 1,
            perPage: 10,
            totalPages: 0,
            paginatedData: [],
            sortColumn: 'no',
            sortDirection: 'asc',
            getRoles: false,
            currentAdminId: '',
        };
    },

    methods: {
        async fetchPengurusData(token) {
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/pengurus';
            return await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        },

        initializePengurusData(response) {
            this.daftarpengurus = response.data.result.data || [];
            this.sortPengurusData();
            this.updatePaginatedData();
            const superAdmin = VueCookies.get('superAdmin');
            this.currentAdminId = VueCookies.get('id_user');
            this.getRoles = superAdmin;
        },

        sortPengurusData() {
            this.daftarpengurus.sort((x, y) => x.id - y.id);
            this.daftarpengurus.forEach((item, index) => {
                item.no = index + 1;
            });
            this.totalPages = Math.ceil(this.daftarpengurus.length / this.perPage);
        },

        toggleModalCreatePengurus() {
            this.showcreatepengurus = !this.showcreatepengurus;
        },

        validateForm() {
            let valid = true;
            this.clearFormErrors();

            if (this.isInvalidUsername(this.form.username)) {
                valid = false;
            }

            if (this.isInvalidPassword(this.form.password)) {
                valid = false;
            }

            if (!this.form.superUser) {
                this.formErrors.superUser = 'Role harus dipilih.';
                valid = false;
            }

            return valid;
        },

        clearFormErrors() {
            this.formErrors.username = '';
            this.formErrors.password = '';
            this.formErrors.superUser = '';
        },

        isInvalidUsername(username) {
            const toast = useToast();
            if (username.length < 6 || username.length > 16) {
                toast.warning('Username harus memiliki panjang antara 6 dan 16 karakter');
                this.formErrors.username = 'Username harus memiliki panjang antara 6 dan 16 karakter.';
                return true;
            } else if (/[A-Z]/.test(username)) {
                toast.warning('Username tidak boleh mengandung huruf kapital');
                this.formErrors.username = 'Username tidak boleh mengandung huruf kapital.';
                return true;
            }
            return false;
        },

        isInvalidPassword(password) {
            const toast = useToast();
            const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
            if (password.length < 8 || !passwordRegex.test(password)) {
                toast.warning('Password harus memiliki minimal 8 karakter dan mengandung setidaknya satu angka dan satu karakter spesial.');
                this.formErrors.password = 'Password harus memiliki minimal 8 karakter dan mengandung setidaknya satu angka dan satu karakter spesial.';
                return true;
            }
            return false;
        },

        createpengurus() {
            if (this.validateForm()) {
                const toast = useToast();
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/create';
                axios.post(url, this.form, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data);
                        if (response.data.message === 'Create New Pengurus Success') {
                            toast.success('Pengurus baru berhasil ditambahkan ');
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);

                        } else if (response.data.message === 'Error Creating New Pengurus: Username already exists') {
                            toast.error('Nama pengurus yang akan ditambahkan sudah ada, mohon untuk mengganti dengan nama yang lain');
                        }

                    })
                    .catch(error => {
                        toast.error('Terdapat Kesalahan pada sistem, mohon coba lagi');
                        console.log(error);
                    });
            }
        },

        deletepengurus(id) {
            if (confirm('Apakah kamu yakin untuk menghapus akun pengurus ini?')) {
                const tokenlogin = VueCookies.get('TokenAuthorization');
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/${id}`;
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

        updatePaginatedData() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = this.currentPage * this.perPage;
            this.paginatedData = this.daftarpengurus.slice(start, end);
        },

        goToPage(pageNumber) {
            this.currentPage = pageNumber;
            this.updatePaginatedData();
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updatePaginatedData();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updatePaginatedData();
            }
        },
        sortData(column) {
            if (this.sortColumn === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortColumn = column;
                this.sortDirection = 'asc';
            }
            this.daftarpengurus.sort((a, b) => {
                let compareA, compareB;
                if (column === 'no') {
                    compareA = a.no;
                    compareB = b.no;
                } else if (column === 'Date') {
                    compareA = new Date(a.Date);
                    compareB = new Date(b.Date);
                } else if (column === 'Status') {
                    compareA = a.is_active ? 1 : 0;
                    compareB = b.is_active ? 1 : 0;
                } else if (column === 'Roles') {
                    compareA = a.superUser ? 1 : 0;
                    compareB = b.superUser ? 1 : 0;
                }
                if (this.sortDirection === 'asc') {
                    return compareA > compareB ? 1 : -1;
                } else {
                    return compareA < compareB ? 1 : -1;
                }
            });
            this.updatePaginatedData();
        },

        canEditOrDelete(data) {
            const superAdmin = this.getRoles === 'true';
            const currentUserId = this.currentAdminId;
            if (superAdmin) {
                return (data.is_active || !data.is_active) && (data.superUser === false || data.id === currentUserId);
            } else {
                return data.id === currentUserId;
            }
        },
        sortNoColumn() {
            if (this.sortOrder === 'asc') {
                this.daftarpengurus.sort((a, b) => a.no - b.no);
                this.sortOrder = 'desc';
            } else {
                this.daftarpengurus.sort((a, b) => b.no - a.no);
                this.sortOrder = 'asc';
            }
            this.updatePaginatedData();
        },

    },
};
</script>


<template>
    <div class="flex min-h-screen">
        <Sidebar />
        <div class="pl-8 max-sm:pl-2 pt-4 w-full bg-offwhite">
            <p class="text-[30px] text-teal font-poppins font-bold">Kelola Akun Pengurus</p>
            <hr>
            <div class="container-table-general max-[700px]:max-w-[85%] bg-offwhite">
                <table class="table-general ">
                    <thead>
                        <tr class="border-b-[0.5px]">
                            <th scope="col"
                                class="cursor-pointer max-md:px-1 px-3 max-sm:pl-0 pt-5 flex items-center max-w-[50px] text-left font-bold font-poppins text-black text-base"
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
                            <th scope="col" class="th-general max-md:px-1 ">
                                Name
                            </th>
                            <th scope="col" class="th-general max-md:px-1 ">
                                Username
                            </th>
                            <th @click="sortData('Status')" scope="col" class="cursor-pointer th-general max-md:px-1 ">
                                Status
                                <span v-if="sortColumn === 'Status'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                <span v-else>
                                    <svg fill="none" height="16" viewBox="0 0 512 512" width="16"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M476.843 57.6L326.333 274.77L326.182 274.99C320.698 282.603 317.745 291.747 317.743 301.13V407.39C317.746 410.792 316.882 414.138 315.232 417.113C313.582 420.088 311.201 422.592 308.313 424.39L212.483 484C204.823 488.77 193.723 487.19 193.773 478.17V301.13C193.77 291.747 190.818 282.603 185.333 274.99L185.183 274.77L34.6728 57.6C28.7267 48.5695 35.1696 36.1 46.4405 36.1H465.554C476.824 36.1 483.266 48.5695 477.32 57.6H476.843Z"
                                            fill="#000000" />
                                    </svg>
                                </span>
                            </th>
                            <th @click="sortData('Roles')" scope="col" class="cursor-pointer th-general max-md:px-1 ">
                                Roles
                                <span v-if="sortColumn === 'Roles'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                                <span v-else>
                                    <svg fill="none" height="16" viewBox="0 0 512 512" width="16"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M476.843 57.6L326.333 274.77L326.182 274.99C320.698 282.603 317.745 291.747 317.743 301.13V407.39C317.746 410.792 316.882 414.138 315.232 417.113C313.582 420.088 311.201 422.592 308.313 424.39L212.483 484C204.823 488.77 193.723 487.19 193.773 478.17V301.13C193.77 291.747 190.818 282.603 185.333 274.99L185.183 274.77L34.6728 57.6C28.7267 48.5695 35.1696 36.1 46.4405 36.1H465.554C476.824 36.1 483.266 48.5695 477.32 57.6H476.843Z"
                                            fill="#000000" />
                                    </svg>
                                </span>
                            </th>
                            <th v-if="getRoles === 'true'" scope="col" class="">
                                <button @click="toggleModalCreatePengurus"
                                    class="bg-teal px-4 py-1 rounded-md text-left font-inter font-semibold text-white text-base">Tambah</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="data in paginatedData" :key="data.id" class="">
                            <td class="td-general td-text-general">
                                {{ data.no }}</td>
                            <td class="td-general">
                                <div class="flex items-center">
                                    <div class="td-text-general">{{ data.full_name }}
                                    </div>
                                </div>
                            </td>
                            <td class="td-general">
                                <p class="td-text-general underline">{{ data.username }}
                                </p>
                            </td>
                            <td class="td-general">
                                <span v-if="data.is_active"
                                    class="inline-flex font-inter text-base text-[#52FF00] leading-5 font-extrabold rounded-md">Aktif</span>
                                <span v-else
                                    class="inline-flex font-inter text-base text-red leading-5 font-extrabold rounded-md">Nonaktif</span>
                            </td>
                            <td class="td-general">
                                <span v-if="data.superUser"
                                    class="inline-flex font-inter text-base leading-5 font-bold rounded-md">Super
                                    Admin</span>
                                <span v-else
                                    class="inline-flex font-inter text-base leading-5 font-bold rounded-md">Admin</span>
                            </td>
                            <td v-if="canEditOrDelete(data)"
                                class="td-general text-sm font-medium max-[1050px]:flex max-md:flex-col max-md:items-center max-md:gap-2">
                                <a :href="'editpengurus/' + data.id">
                                    <button
                                        class="py-1 px-8 rounded-[5px] bg-teal font-inter font-bold text-base text-white">Edit</button>
                                </a>
                                <button @click="deletepengurus(data.id)"
                                    class="py-1 px-8 rounded-[5px] bg-semitransparentwhite ml-2 shadow-xl  bg-opacity-64 text-teal font-inter font-bold text-base">Hapus</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="flex justify-center my-8">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="px-4 py-2 mr-2 bg-teal text-white rounded-md">Previous</button>
                    <button v-for="pageNumber in totalPages" :key="pageNumber" @click="goToPage(pageNumber)"
                        :class="{ 'bg-teal text-white rounded-md': pageNumber === currentPage, ' text-blue-500 border border-blue-500 rounded-md': pageNumber !== currentPage }"
                        class="px-4 py-2 mr-2">{{ pageNumber }}</button>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-teal text-white rounded-md">Next</button>
                </div>

                <div v-if="showcreatepengurus"
                    class="fixed inset-0 flex items-center justify-center max-md:justify-start max-md:items-start max-md:pt-4 max-md:pl-6 bg-black bg-opacity-50 max-md:z-50">
                    <div
                        class=" p-8 rounded-md min-w-[700px] max-md:min-w-[75%] max-w-[750px] bg-white min-h-[500px]  max-h-[520px]">
                        <h2 class="text-2xl text-teal font-poppins font-semibold mb-4">Tambah Pengurus</h2>
                        <form @submit.prevent="createpengurus">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-teal">Nama Lengkap</label>
                                <input type="text" v-model="form.full_name"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required />
                            </div>
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-teal">Username</label>
                                <input type="text" v-model="form.username"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required />
                                <p v-if="formErrors.username" class="text-red text-sm mt-1">{{ formErrors.username }}</p>
                            </div>
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-teal">Password</label>
                                <input type="password" v-model="form.password"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required />
                                <p v-if="formErrors.password" class="text-red text-sm mt-1">{{ formErrors.password }}</p>
                            </div>
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-teal">Roles</label>
                                <select v-model="form.superUser"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required>
                                    <option value="">Select Role</option>
                                    <option value="true">Super Admin</option>
                                    <option value="false">Admin</option>
                                </select>
                                <p v-if="formErrors.superUser" class="text-red text-sm mt-1">{{ formErrors.superUser }}</p>
                            </div>
                            <div class="flex justify-end gap-2">
                                <button type="submit" class="px-4 py-2 bg-teal text-white rounded-md">Simpan</button>
                                <button @click="toggleModalCreatePengurus" type="button"
                                    class="mr-4 px-4 py-2  border border-teal text-teal rounded-md">Batal</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
