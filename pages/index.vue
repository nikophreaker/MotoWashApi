<script setup lang="ts">
import { TwFeather } from "vue3-tailwind";

useSeoMeta({
  title: "Dashboard",
});

definePageMeta({
  middleware: "auth",
});
// const store = useTokenStore();
// if (store.userRole == "admin" && store.userToken != "") {
//   navigateTo("/login");
// }
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
function getRandomInt() {
  return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}
const data = ref<ChartData<"bar">>({
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
        getRandomInt(),
      ],
    },
  ],
});

async function getTransaction() {
  await fetch("/api/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        res.json().then((result) => {
          if (result.error == undefined) {
            const finalResult = result;
          }
        });
      } else {
      }
    })
    .catch((err) => {});
}

onMounted(() => {
  getTransaction();
});
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <hr class="my-2 border dark:border-gray-700" />
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div
          class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 dark:text-gray-400 font-medium">
              Today's Money
            </div>
            <div class="text-gray-700 dark:text-gray-200 font-bold text-lg">
              $53,000
              <span class="text-sm text-yellow-600">+55%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >
            <TwFeather type="dollar-sign"></TwFeather>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div
          class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 dark:text-gray-400 font-medium">
              Today's Users
            </div>
            <div class="text-gray-700 dark:text-gray-200 font-bold text-lg">
              2,300
              <span class="text-sm text-yellow-600">+3%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >
            <TwFeather type="aperture"></TwFeather>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div
          class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 dark:text-gray-400 font-medium">
              New Clients
            </div>
            <div class="text-gray-700 dark:text-gray-200 font-bold text-lg">
              +3,462
              <span class="text-sm text-red-600">+2%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >
            <TwFeather type="users"></TwFeather>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div
          class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full"
        >
          <div class="flex flex-col justify-between">
            <div class="text-gray-500 dark:text-gray-400 font-medium">
              Sales
            </div>
            <div class="text-gray-700 dark:text-gray-200 font-bold text-lg">
              $103,430
              <span class="text-sm text-yellow-600">+5%</span>
            </div>
          </div>
          <div
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4"
          >
            <TwFeather type="shopping-cart"></TwFeather>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 mt-2">
      <div
        class="col-span-12 md:col-span-7 rounded-lg p-4 shadow bg-white dark:bg-gray-800"
      >
        <div class="">
          <div class="text-gray-500 dark:text-gray-400 font-medium">
            Transaction Per Month
          </div>
          <div class="relative">
            <Bar :data="data" :options="options" />
            <!-- <canvas id="bar-chart"></canvas> -->
          </div>
        </div>
        <!-- <div class="flex gap-2 rounded-lg p-4 shadow bg-white dark:bg-gray-800">
          <div class="flex flex-col justify-between">
            <div class="">
              <div class="text-gray-500 dark:text-gray-400 font-medium">
                Built by developers
              </div>
              <div class="text-gray-700 dark:text-gray-200 font-bold text-xl">
                Nuxt 3 Admin Dashboard
              </div>
              <div class="">
                From colors, cards, typography to complex elements, you will
                find the full documentation.
              </div>
            </div>
            <div class="">Read More ...</div>
          </div>
          <div
            class="rounded-lg bg-gradient-to-tl from-gray-50 to-gray-200 dark:from-gray-700 flex items-center justify-center w-52 h-52"
          >
            <img
              class="w-32 h-32 rounded object-cover"
              src="/images/rocket.png"
              alt=""
            />
          </div>
        </div> -->
      </div>
      <div class="col-span-12 md:col-span-5">
        <div class="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <div class="flex flex-col justify-between">
            <div class="">
              <div class="text-gray-500 dark:text-gray-400 font-medium">
                Built by developers
              </div>
              <div class="text-gray-700 dark:text-gray-200 font-bold text-xl">
                Nuxt 3 Admin Dashboard
              </div>
              <div class="">
                From colors, cards, typography to complex elements, you will
                find the full documentation.
              </div>
            </div>
            <div class="">Read More ...</div>
          </div>
          <div
            class="rounded-lg bg-gradient-to-tl from-gray-50 to-gray-200 dark:from-gray-700 flex items-center justify-center w-52 h-52"
          >
            <img
              class="w-32 h-32 rounded object-cover"
              src="/images/rocket.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
