<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import { useToast } from 'vue-toastification';

export default {
    data() {
        return {
            username: '',
            password: '',
            error: '',
            rememberMe: false,
            rememberedUsername: '',
            rememberedPassword: ''
        };
    },
    methods: {
        async login() {
            try {
                axios.defaults.withCredentials = true;
                const toast = useToast();
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/login';
                const response = await axios.post(url, {
                    username: this.username,
                    password: this.password
                });

                if (response.data.message === "Login Success") {
                    VueCookies.set('TokenAuthorization', response.data.result.token);
                    toast.success('Login Berhasil!');

                    if (this.rememberMe) {
                        localStorage.setItem('rememberedUsername', this.username);
                        localStorage.setItem('rememberedPassword', this.password);
                    } else {
                        localStorage.removeItem('rememberedUsername');
                        localStorage.removeItem('rememberedPassword');
                    }

                    setTimeout(() => {
                        this.$router.push('/dataumumpasien');
                    }, 1000);
                } else if (response.data.message === "Error Login: Pengurus not found") {
                    toast.error('Login Gagal, coba lagi');
                } else if (response.data.message === "Error Login: Invalid password credentials") {
                    toast.error('Password salah, mohon coba lagi');
                }
            } catch (error) {
                this.error = 'Terjadi kesalahan, silakan coba lagi.';
            }
        }
    },
    mounted() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        if (rememberedUsername && rememberedPassword) {
            this.username = rememberedUsername;
            this.password = rememberedPassword;
            this.rememberMe = true;
        }
    }
};
</script>

<template>
    <div class="bg-gray-100 flex flex-row-reverse">
        <div class="w-1/2 hidden lg:block">
            <router-link to="/"><img src="../assets/sign.png" alt="Placeholder Image"
                    class="object-cover w-full h-full"></router-link>
        </div>
        <div class="flex flex-col lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
            <img class="w-[120px] bg-teal rounded-md shadow-[0_15px_28px_6px_rgba(0,0,0,0.25)] mb-20" src="../assets/logoElgekaPutih1.png" alt="Logo">
            <h1 class="text-2xl font-bold font-verdana text-[32px] mb-4">Dashboard Pengurus</h1>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <label for="username"
                        class="block font-verdana font-normal text-[14px] text-[#344054] mb-2">Username</label>
                    <input type="text" id="username" name="username" v-model="username"
                        class="w-full border border-lightgrayish rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 placeholder:text-bluegray placeholder:text-verdana placeholder:leading-5 placeholder:text-[14px]"
                        autocomplete="off" placeholder="Enter your Username">
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-[#344054] mb-2">Password</label>
                    <input type="password" id="password" name="password" v-model="password"
                        class="w-full border border-lightgrayish rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 placeholder:text-bluegray placeholder:text-verdana placeholder:leading-5 placeholder:text-[14px]"
                        autocomplete="off" placeholder="Enter Password">
                </div>
                <div class="mb-4 flex flex-col">
                    <div>
                        <input type="checkbox" id="remember" name="remember" v-model="rememberMe"
                            class="outline-[#D4A02C] bg-white accent-teal">
                        <label for="remember"
                            class="font-verdana text-[#344054] text-deepbluegray font-normal text-[14px] ml-2">Remember
                            Me</label>
                    </div>
                    <p class="pl-5 font-verdana font-normal text-[14px] text-bluegray">Save my login details for next
                        time.</p>
                </div>
                <div class="flex items-center flex-col">
                    <button type="submit"
                        class="bg-teal text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                </div>
                <div v-if="error" class="text-red font-gotham font-bold text-2xl pt-4">{{ error }}</div>
            </form>
        </div>
    </div>
</template>
