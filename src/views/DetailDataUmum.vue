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
                <p class=" font-bold text-[30px]  mt-4 py-4 leading-6 text-blueblack">Data Umum
                    Pasien</p>
                <form class="relative w-max flex flex-row bg-white rounded-md pl-4 mt-4 py-4">
                    <div>
                        <form action="" class="max-w-[480px] w-full px-4">
                            <div class="relative">
                                <input type="text" name="q" class="w-full border h-12 shadow py-2 px-4 rounded-lg"
                                    placeholder="Quick Find">
                                <button type="submit">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                        class="text-gray-400 h-5 w-5 absolute top-3.5 right-3 fill-current"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M4.64286 7.92857C4.64286 3.82588 7.96874 0.5 12.0714 0.5C16.1741 0.5 19.5 3.82588 19.5 7.92857C19.5 12.0313 16.1741 15.3571 12.0714 15.3571C10.3811 15.3571 8.82147 14.7917 7.57333 13.8409L2.20711 19.2071C1.81658 19.5976 1.18342 19.5976 0.792893 19.2071C0.402369 18.8166 0.402369 18.1834 0.792893 17.7929L6.15912 12.4267C5.20834 11.1785 4.64286 9.61894 4.64286 7.92857ZM12.0714 2.5C9.07331 2.5 6.64286 4.93045 6.64286 7.92857C6.64286 9.42791 7.24938 10.7837 8.23285 11.7672C9.21632 12.7506 10.5721 13.3571 12.0714 13.3571C15.0695 13.3571 17.5 10.9267 17.5 7.92857C17.5 4.93045 15.0695 2.5 12.0714 2.5Z"
                                            fill="black" />
                                    </svg>

                                </button>
                            </div>
                        </form>
                    </div>
                </form>
            </div>

            <p class="ml-8 font-normal text-[20px] leading-7 text-blueblack mt-4">Biodata Pasien</p>

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
                            Gender
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Tanggal Lahir
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Golongan Darah
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Nomor HP
                        </th>
                        <th scope="col" class="px-6 py-3 text-left font-normal text-sulfurblack text-base">
                            Email
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
                                        Abib Basnuril
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 min-w-[300px] max-w-[301px]">
                            <p class=" font-normal text-sulfurblack text-base ">Desa balabala RT03/RW02,
                                kec bojong, kab bandung, prov jabar</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">Laki-Laki</p>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">11 Desember 1999</p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">AB</p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">081234214944</p>
                        </td>

                        <td class="px-6 py-4 whitespace-nowrap">
                            <p class=" font-normal text-sulfurblack text-base ">abib@gmail.com</p>
                        </td>
                    </tr>

                </tbody>
        </table>
    </div>
</div></template>