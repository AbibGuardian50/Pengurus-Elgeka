<script>
import Sidebar from "../components/Sidebar.vue"

export default {
    components: {
        Sidebar
    }
}
</script>

<template>
    <div class="flex">
        <Sidebar />

        <div>
            <div class="ml-8 flex items-center justify-between border-b border-lightgray">
                <p class=" font-bold text-[30px]  mt-4 py-4 leading-6 text-blueblack">Data Rumah Sakit</p>
                <form class="relative w-max flex flex-row bg-white rounded-md pl-4 mt-4 py-4">
                    <input type="search" placeholder="Quick Find"
                        class="peer cursor-pointer border relative z-10 h-12 w-12 rounded-md bg-transparent pl-2 outline-none w-full cursor-text pr-4" />
                    <div class="flex items-center justify-center pr-4">
                        <img class="w-[19px] h-[19px]" src="../assets/union-1.png" alt="">
                    </div>
                </form>
            </div>

            <p class="ml-8 font-normal text-[20px] leading-7 text-blueblack mt-4">Data Rumah Sakit</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                <thead class="bg-gray-50">
                    <tr class="border-b-[0.5px] border-b-orange">
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            No
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Nama
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Alamat
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Kontak
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Link Google
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Gambar
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap  font-normal  text-sulfurblack text-base">
                            1
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="">
                                    <div class=" font-normal text-sulfurblack text-base">
                                        RS Bandung
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 min-w-[300px] max-w-[301px]">
                            <p class=" font-normal text-sulfurblack text-base ">Jl. Pasteur No.38, Pasteur, Kec. Sukajadi, Kota Bandung, Jawa Barat 40161</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">rsudbandung@gmail.com</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">081234214944</p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">https://www.google.com/maps</p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <img src="../assets/example.png" alt="foto rumah sakit">
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>