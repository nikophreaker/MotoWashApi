<script setup lang="ts">
import { TwDropdownMenu, TwFeather, TwButton } from "vue3-tailwind";

useSeoMeta({
  title: "Dashboard",
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
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartData,
} from "chart.js";
import { Bar, Doughnut } from "vue-chartjs";
import { rand } from "@vueuse/core";
import { useMidtrans } from "../composables/testmidtrans";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
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
const dataBar = ref<ChartData<"bar">>({
  labels: [],
  datasets: [
    {
      label: "",
      backgroundColor: "",
      data: [],
    },
  ],
});

const dataDoughnut = ref<ChartData<"doughnut">>({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
});

function yearLabel() {
  var year = [];
  const nowYear = new Date().getFullYear();
  for (var i = nowYear - 5; i <= nowYear; i++) {
    year.push(i);
  }
  return year;
}

const filterTransaction = reactive({
  transaction: "month",
});

async function getTransaction() {
  var bodyGet = new URLSearchParams();
  bodyGet.append("transaction", filterTransaction.transaction);
  await fetch("/api/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyGet,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        res.json().then((result) => {
          if (result.error == undefined) {
            var dataTable = {
              labels: [] as String[],
              datasets: [] as any[],
            };
            var datasets = {
              label: "Transaction",
              backgroundColor: "#f87979",
              data: [] as Number[],
            };
            if (filterTransaction.transaction == "year") {
              yearLabel().forEach((value) => {
                dataTable.labels.push(value.toString());
                const filtered = result.filter(
                  (obj: any) => obj._id.year == value
                );
                datasets.data.push(
                  filtered[0] ? filtered[0].numberoftransactions : 0
                );
              });
              dataTable.datasets.push(datasets);
              dataBar.value = dataTable;
            } else if (filterTransaction.transaction == "month") {
              const month = [
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
              ];
              month.forEach((val, idx) => {
                dataTable.labels.push(val);
                const filtered = result.filter(
                  (obj: any) => obj._id.month == idx + 1
                );
                datasets.data.push(
                  filtered[0] ? filtered[0].numberoftransactions : 0
                );
              });
              dataTable.datasets.push(datasets);
              dataBar.value = dataTable;
            } else {
              const dateToday = new Date();
              const arrDay = Array.from(
                {
                  length: new Date(
                    dateToday.getFullYear(),
                    dateToday.getMonth(),
                    0
                  ).getDate(),
                },
                (_, i) => i + 1
              );
              for (var i = 1; i <= arrDay.length; i++) {
                dataTable.labels.push("Tgl " + i.toString());
                const filtered = result.filter((obj: any) => obj._id.day == i);
                datasets.data.push(
                  filtered[0] ? filtered[0].numberoftransactions : 0
                );
              }
              dataTable.datasets.push(datasets);
              dataBar.value = dataTable;
            }
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}
async function getProductTransaction() {
  var bodyGet = new URLSearchParams();
  bodyGet.append("chart", "true");
  await fetch("/api/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyGet,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        res.json().then((result) => {
          if (result.error == undefined) {
            var dataTable = {
              labels: [] as String[],
              datasets: [] as any[],
            };
            var datasets = {
              backgroundColor: [] as String[],
              data: [] as Number[],
            };
            result.forEach((obj: any) => {
              datasets.backgroundColor.push(
                `hsla(${~~(360 * Math.random())}, 70%,  72%, 0.8)`
              );
              datasets.data.push(obj.numberoftransactions);
              dataTable.labels.push(obj._id.productName);
            });
            dataTable.datasets.push(datasets);
            dataDoughnut.value = dataTable;
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}

onMounted(() => {
  getTransaction();
  getProductTransaction();
});

watch(filterTransaction, (value) => {
  getTransaction();
});

function setFilterDate(type: any) {
  filterTransaction.transaction = type;
}

async function getCharge() {
  try {
    const data = await useMidtrans();
    console.log(data);
    return {
      user: data,
    };
  } catch (e) {
    console.log({
      statusCode: 503,
      message: "We cannot find the user",
    });
  }
  // const url = "https://api.sandbox.midtrans.com/v2/charge";
  // const optionss = {
  //   method: "POST",
  //   headers: {
  //     accept: "application/json",
  //     "content-type": "application/json",
  //     authorization: "Basic ZnVud2FzaDU4QGdtYWlsLmNvbTpQYW5na2FsYW44",
  //     mode: "no-cors",
  //   },
  //   body: JSON.stringify({
  //     payment_type: "qris",
  //     transaction_details: { order_id: "order_id-0123", gross_amount: 100000 },
  //     // qris: { acquirer: "gopay" },
  //   }),
  // };
  // fetch(url, optionss)
  //   .then((res) => res.json())
  //   .then((json) => console.log(json))
  //   .catch((err) => console.error("error:" + err));
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold">Dashboard</h1>
    <hr class="my-2 border dark:border-gray-700" />
    <div class="col-span-12 flex justify-start gap-1">
      <TwButton variant="primary" icon="user-plus" class="border border-gray-900 my-2" @click="getCharge()">
        Get Charge Midtrans
      </TwButton>
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full">
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
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4">
            <TwFeather type="dollar-sign"></TwFeather>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full">
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
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4">
            <TwFeather type="aperture"></TwFeather>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full">
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
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4">
            <TwFeather type="users"></TwFeather>
          </div>
        </div>
      </div>
      <div class="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3">
        <div class="p-2 rounded-lg bg-white dark:bg-gray-800 shadow flex justify-between gap-2 h-full">
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
            class="bg-gradient-to-tl from-gray-600 to-gray-900 rounded-lg text-white p-2 flex items-center justify-center px-4">
            <TwFeather type="shopping-cart"></TwFeather>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 mt-2">
      <div class="col-span-12 md:col-span-7 rounded-lg p-4 shadow bg-white dark:bg-gray-800">
        <div class="">
          <div class="text-gray-500 dark:text-gray-400 font-medium">
            Transaction Per
            <TwDropdownMenu align="left" width="48">
              <template #trigger>
                <TwButton variant="light">
                  {{ filterTransaction.transaction + " ▼" }}
                </TwButton>
              </template>
              <template #content>
                <div
                  class="block w-full px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-200 text-left hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition">
                  <div class="flex gap-2 items-center" @click="setFilterDate('day')">
                    <div class="">Day</div>
                  </div>
                </div>
                <div
                  class="block w-full px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-200 text-left hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition">
                  <div class="flex gap-2 items-center" @click="setFilterDate('month')">
                    <div class="">Month</div>
                  </div>
                </div>
                <div
                  class="block w-full px-4 py-2 text-sm leading-5 text-gray-700 dark:text-gray-200 text-left hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition">
                  <div class="flex gap-2 items-center" @click="setFilterDate('year')">
                    <div class="">Year</div>
                  </div>
                </div>
              </template>
            </TwDropdownMenu>
          </div>
          <div class="relative">
            <Bar :data="dataBar" :options="options" />
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-5 rounded-lg p-4 shadow bg-white dark:bg-gray-800">
        <div class="">
          <div class="text-gray-500 dark:text-gray-400 font-medium">
            Sales volume
          </div>
          <div class="relative">
            <Doughnut :data="dataDoughnut" :options="options" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
