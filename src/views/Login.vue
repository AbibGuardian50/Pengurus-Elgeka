<script>
import axios from 'axios'
import VueCookies from 'vue-cookies'
export default {
    data() { 
        return {
            username: [],
            password: [],
            error: '',
            rememberMe: false,
            rememberedUsername: '',
            rememberedPassword: ''
        }
    },
    methods: {
        async login() {
            try {
                const url = 'https://elgeka-web-api-production.up.railway.app/api/v1/pengurus/login'
                const response = await axios.post(url, {
                    username: this.username,
                    password: this.password
                },
                )
                if (response.data.message === "Login Success") {
                    // console.log(response)
                    // // VueCookies.set('Authentication',response.data.Token)
                    // VueCookies.set('Name', response.data.Data[0].Name)
                    // VueCookies.set('Message', response.data.Message)
                    // const token = ('Authentication', response.data.Token);
                    // this.setTokenCookie(token);
                    VueCookies.set('TokenAuthorization',response.data.result.token)
                    this.$router.push('/dataumum')
                    console.log(response)
                }
                else if (response.data.code === 400) {
                    // console.log(response)
                    // // VueCookies.set('Authentication',response.data.Token)
                    // VueCookies.set('Name', response.data.Data[0].Name)
                    // VueCookies.set('Message', response.data.Message)
                    // const token = ('Authentication', response.data.Token);
                    // this.setTokenCookie(token);
                    console.log(response)
                    this.error = 'ada kesalahan dari sistem, mohon coba lagi'
                }
            } catch (error) {
                this.error = 'ada kesalahan dari sistem, mohon coba lagi'
            }
        },
        // setTokenCookie(token) {
        //     const expirationDate = new Date();
        //     expirationDate.setDate(expirationDate.getDate() + 30);
        //     // Mengatur cookie dengan nama "token" dan nilai token yang diberikan bersama dengan tanggal kedaluwarsa 30 hari dari saat ini
        //     Cookies.set('token', token, { expires: expirationDate });
        // }
    },
    mounted() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        if (rememberedUsername && rememberedPassword) {
            this.username = rememberedUsername; // Perbaikan disini
            this.password = rememberedPassword;
            this.rememberMe = true;
        }
    }
}
</script>

<template>
    <!-- component -->
    <div class="bg-gray-100 flex flex-row-reverse">
        <!-- Left: Image -->
        <div class="w-1/2 h-screen hidden lg:block">
            <router-link to="/"><img src="../assets/sign.png" alt="Placeholder Image"
                    class="object-cover w-full h-full"></router-link>
        </div>
        <!-- Right: Login Form -->
        <div class="flex flex-col lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
            <img class="w-[120px] shadow-[0_15px_28px_6px_rgba(0,0,0,0.25)] mb-20" src="../assets/logo.png" alt="Logo">
            <h1 class="text-2xl font-bold font-verdana text-[32px] mb-4">Dashboard Pengurus</h1>
            <form @submit.prevent="login">
                <!-- Email Input -->
                <div class="mb-4">
                    <label for="username"
                        class="block font-verdana font-normal text-[14px] text-[#344054] mb-2">Username</label>
                    <input type="text" id="username" name="username" v-model="username"
                        class="w-full border border-lightgrayish rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 placeholder:text-bluegray placeholder:text-verdana placeholder:leading-5 placeholder:text-[14px]"
                        autocomplete="off" placeholder="Enter your Username">
                </div>
                <!-- Password Input -->
                <div class="mb-4">
                    <label for="password" class="block text-[#344054] mb-2">Password</label>
                    <input type="password" id="password" name="password" v-model="password"
                        class="w-full border border-lightgrayish rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 placeholder:text-bluegray placeholder:text-verdana placeholder:leading-5 placeholder:text-[14px]"
                        autocomplete="off" placeholder="Enter Password">
                </div>
                <!-- Remember Me Checkbox -->
                <div class="mb-4 flex flex-col">
                    <div>
                        <input type="checkbox" id="remember" name="remember" class="outline-[#D4A02C] bg-white accent-orange">
                        <label for="remember" class="font-verdana text-[#344054] text-deepbluegray font-normal text-[14px] ml-2">Remember
                            Me</label>
                    </div>
                    <p class="pl-5 font-verdana font-normal text-[14px] text-bluegray">Save my login details for next
                        time.</p>
                </div>
                <!-- Login Button -->
                <div class="flex items-center flex-col">
                    <button type="submit"
                        class="bg-orange text-white font-semibold rounded-md py-2 px-4 w-full">Login</button>
                    <!-- <div class="mt-6 text-blue-500">
                        <router-link>
                            <a target="_blank"
                                class="hover:underline font-verdana font-normal text-[14px] text-[#4D4D4F]">Forgot
                                Password?</a>
                        </router-link>
                    </div> -->
                </div>

                <!-- Error Message, hanya muncul jika ada kesalahan dari user atau sistem -->
                <div v-if="error" class="text-red font-gotham font-bold text-2xl pt-4">{{ error }}</div>
            </form>
            <!-- Forgot Password Link -->
        </div>
    </div>
</template>