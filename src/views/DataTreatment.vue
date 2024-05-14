<script>
import Sidebar from "../components/Sidebar.vue"

export default {
    components: {
        Sidebar
    }
}
</script>

<template>
    <div class="flex bg-offwhite">
        <Sidebar />

        <div>
            <div class="ml-8 flex items-center justify-between border-b border-lightgray">
                <p class=" font-bold text-[30px]  mt-4 py-4 leading-6 text-blueblack">Data Treatment Pasien</p>
                <form class="relative w-max flex flex-row rounded-md pl-4 mt-4 py-4">
                    <input type="search" placeholder="Quick Find"
                        class="peer cursor-pointer border relative z-10 h-12 w-12 rounded-md bg-transparent pl-2 outline-none w-full cursor-text pr-4" />
                    <div class="flex items-center justify-center pr-4">
                        <img class="w-[19px] h-[19px]" src="../assets/union-1.png" alt="">
                    </div>
                </form>
            </div>

            <p class="ml-8 font-normal text-[20px] leading-7 text-blueblack mt-4">Biodata Pasien</p>

            <table class="ml-8 min-w-full divide-y divide-gray-200 overflow-x-auto w-[1200px]">
                <thead class="bg-offwhite">
                    <tr class="border-b-[0.5px] border-b-teal">
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            No
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Nama
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Handphone
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Alamat
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Dokter
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Treatment
                        </th>
                    </tr>
                </thead>
                <tbody class=" divide-y divide-gray-200">
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
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base "></p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base "></p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base "></p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base "></p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>