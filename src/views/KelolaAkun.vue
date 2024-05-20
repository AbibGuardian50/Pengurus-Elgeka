<script>
import Sidebar from "../components/Sidebar.vue"
import axios from 'axios'
import VueCookies from 'vue-cookies'
import { useToast } from 'vue-toastification';
export default {
    async created() {
        try {
            const toast = useToast()
            const tokenlogin = VueCookies.get('TokenAuthorization')
            if (tokenlogin) {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/pengurus'
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${tokenlogin}`
                    },
                })
                if (response.data.message === "Get All Pengurus Successfully") {
                    toast.success('Data Admin berhasil dimuat!')
                }
                if (response.data.code === 400) {
                    console.log('Superadmin tidak bisa edit superadmin lainnya')
                }
                // const superAdmin = VueCookies.get('superAdmin')
                // this.getRoles = superAdmin
                // this.daftarid = response.data.result.data.id
                this.daftarpengurus = response.data.result.data
                this.daftarpengurus.sort((x, y) => x.id - y.id)
                this.daftarpengurus.forEach((item, index) => {
                    item.no = index + 1;
                });
                console.log(this.daftarpengurus)
            } else {
                this.error = 'dilarang akses halaman ini'
            }
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Sidebar
    },
    data() {
        return {
            daftarpengurus: [],
            showcreatepengurus: false,
            form: {
                full_name: [],
                username: '',
                password: '',
                superUser: [],
            },
        }
    },
    methods: {
        createpengurus() {
            const tokenlogin = VueCookies.get('TokenAuthorization')
            const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/create'
            axios.post(url, this.form, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                .then(response => {
                    console.log(response.data);
                    window.location.reload();
                })
                .catch(error => {
                    console.log(error)
                })
        },
        toggleModalCreatePengurus: function () {
            this.showcreatepengurus = !this.showcreatepengurus;
        },
        deletepengurus(id) {
            if (confirm('Apakah kamu yakin untuk menghapus akun pengurus ini?')) {
                const tokenlogin = VueCookies.get('TokenAuthorization')
                const url = `https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/${id}`
                axios.delete(url, { headers: { 'Authorization': `Bearer ${tokenlogin}` } })
                    .then(response => {
                        console.log(response.data)
                        window.location.reload();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        },

    }
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div class="ml-8">
            <p class="text-[30px] text-teal font-bold pt-8">Kelola Akun</p>
            <hr>

            <p class="font-normal text-[20px] leading-5 text-blueblack pt-4">Akun Pengurus</p>
            <table class="min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                <thead>
                    <tr class="border-b-[0.5px] border-b-teal">
                        <th scope="col" class="px-6 py-3 text-left font-normal  text-sulfurblack text-base">
                            NO
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal  text-sulfurblack text-base">
                            Nama Lengkap
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal  text-sulfurblack text-base">
                            Username
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal  text-sulfurblack text-base">
                            Status
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal  text-sulfurblack text-base">
                            Roles
                        </th>
                        <th scope="col" class="">
                            <button v-on:click="toggleModalCreatePengurus()"
                                class="bg-teal px-4 py-1 rounded-md text-left  font-semibold text-white text-base">Tambah</button>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="data in daftarpengurus" :key="data.id" class=" divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap  font-normal  text-sulfurblack text-base">
                            {{ data.no }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="">
                                    <div class=" font-normal text-sulfurblack text-base">
                                        {{ data.full_name }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base underline">{{ data.username }}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="data.is_active === true"
                                class="inline-flex  text-base text-[#52FF00] leading-5 font-extrabold rounded-md">
                                Aktif
                            </span>

                            <span v-if="data.is_active === false"
                                class="inline-flex  text-base text-red leading-5 font-extrabold rounded-md">
                                Nonaktif
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span v-if="data.superUser === true"
                                class="inline-flex  text-base leading-5 font-bold rounded-md">
                                Super Admin
                            </span>

                            <span v-else class="inline-flex  text-base leading-5 font-bold rounded-md">
                                Admin
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a :href="'editpengurus/' + data.id">
                                <button class="py-1 px-8 rounded-[5px] bg-teal font-bold text-base text-white">Edit</button>
                            </a>
                            <button href="#" @click="deletepengurus(data.id)"
                                class="py-1 px-8 rounded-[5px] ml-2 shadow-xl bg-offwhite text-white bg-teal font-bold text-base ">Hapus</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal Create Pengurus -->
            <div>
                <form v-if="showcreatepengurus" @submit.prevent="createpengurus()"
                    class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
                    <div class="relative w-auto my-6 mx-auto max-w-6xl">
                        <!--content-->
                        <div
                            class="border border-red rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <!--header-->
                            <div class="flex items-start justify-between p-5 border-b-2 border-black rounded-t">
                                <h3 class="text-[40px] text-teal font-semibold font-poppins">
                                    Akun Pengurus
                                </h3>
                                <button
                                    class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    v-on:click="toggleModalCreatePengurus()">
                                    <span
                                        class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                    </span>
                                </button>
                            </div>
                            <!--body-->
                            <div class="flex flex-col gap-8 relative p-6">
                                <div class="flex gap-2 flex-col">
                                    <label for="nama lengkap" class="font-poppins font-bold text-base text-teal">Nama
                                        Lengkap</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="nama lengkap" id="" v-model="form.full_name"
                                        placeholder="Muhammad Abieb Basnuril">
                                </div>
                                <div class="flex gap-2 flex-col">
                                    <label for="username"
                                        class="font-poppins font-bold text-base text-teal">username</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="text"
                                        name="username" id="" v-model="form.username" placeholder="admin abib">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Password"
                                        class="font-poppins font-bold text-base text-teal">Password</label>
                                    <input class="border border-black py-4 min-w-[550px] pl-2 rounded-md" type="password"
                                        name="Password" id="" v-model="form.password" placeholder="Masukkan Password">
                                </div>

                                <div class="flex gap-2 flex-col">
                                    <label for="Status" class="font-poppins font-bold text-base text-teal">Status</label>
                                    <!-- <input class="border border-black py-4 min-w-[550px] pr-2 rounded-md" type="text" name="nama lengkap" id="" placeholder="  Muhammad Abieb Basnuril"> -->
                                    <select
                                        class="border bg-white border-black py-4 min-w-[550px] pl-2 rounded-md font-poppins font-medium text-base text-[#00000080]"
                                        name="Status" id="" v-model="form.superUser">
                                        <option value="true">SuperAdmin</option>
                                        <option value="false">Admin</option>
                                    </select>
                                </div>


                            </div>
                            <!--footer-->
                            <div class="flex items-center justify-center p-6 border-t-2 border-black rounded-b">
                                <button
                                    class="text-white bg-teal border hover:text-white active:bg-teal-600 font-bold uppercase text-sm px-12 py-3 rounded outline-none focus:outline-none mr-1 mb-1   "
                                    type="submit">
                                    Simpan
                                </button>
                                <button
                                    class="text-teal bg-white border active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1"
                                    type="button" v-on:click="toggleModalCreatePengurus()">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
                <div v-if="showcreatepengurus" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </div>
        </div>
    </div>
</template>