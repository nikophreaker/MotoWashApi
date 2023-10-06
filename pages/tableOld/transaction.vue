<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  DatatableColumn,
  DatatableData,
  TwButton,
  TwDatatableClient,
  TwModal,
  useDialog,
  useToast,
  TwForm,
  TwFile,
  TwInput,
  TwMultiSelect,
  TwSelect,
  TwToggle,
  TwTextarea,
  useForm,
} from "vue3-tailwind";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";


const datas = ref({
  column: [
    {
      label: "Name",
      field: "name",
      width: "400px",
      sortable: true,
    },
    {
      label: "Product",
      field: "product",
      width: "400px",
      sortable: true,
    },
    {
      label: "Date",
      field: "date",
      width: "400px",
      sortable: true,
    },
    {
      label: "Total",
      field: "total",
      width: "400px",
      sortable: true,
    },
    {
      label: "Payment Method",
      field: "paymentMethod",
      width: "400px",
      sortable: true,
    },
    {
      label: "Payment Status",
      field: "paymentStatus",
      width: "400px",
      sortable: true,
    },
    {
      label: "Action",
      field: "action",
      width: "400px",
      sortable: false,
    },
  ] as Array<DatatableColumn>,
  data: [] as Array<DatatableData>,
  limit: 5,
  offset: 0,
  search: "",
  selected: [],
  sortBy: "name",
  sortType: "asc",
  setting: {
    checkbox: true,
    limitOption: [
      {
        label: "5",
        value: 5,
      },
      {
        label: "10",
        value: 10,
      },
      {
        label: "50",
        value: 50,
      },
      {
        label: "100",
        value: 100,
      },
      {
        label: "200",
        value: 200,
      },
    ],
  },
});
var formShow = ref(false);

const filterDate = reactive({
  startDate: null,
  endDate: null,
});

const datatableHook = (arg: any) => {
  arg();
};

function renameKey(obj: any, oldKey: any, newKey: any) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

function stringifyArray(obj: any, oldKey: any, newKey: any) {
  obj[newKey] = obj[oldKey].toString();
  delete obj[oldKey];
}

// Transaction Fetch
async function getTransaction() {
  var bodyGet = new URLSearchParams();
  bodyGet.append("startDate", filterDate.startDate ? filterDate.startDate : "");
  bodyGet.append("endDate", filterDate.endDate ? filterDate.endDate : "");
  bodyGet.append("limit", datas.value.limit.toString());
  bodyGet.append("skip", datas.value.offset.toString());
  bodyGet.append("query", datas.value.search.toString());

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
            const finalResult = result;
            finalResult.forEach((obj: any) => renameKey(obj, "_id", "id"));
            // finalResult.forEach((obj: any) => stringifyArray(obj, 'licensePlates', '_licensePlates'))
            datas.value.data = finalResult as Array<DatatableData>;
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}

async function addTransaction() {
  validator.value.clearErrors();
  await validator.value.validate();
  if (validator.value.fail()) {
    toast.error({
      message: validator.value.getErrorMessage(),
    });
    isError.value = true;
    setTimeout(() => {
      isError.value = false;
    }, 1000);
    return;
  }
  var bodyPatch = new URLSearchParams();
  bodyPatch.append("userId", formData.selectCustomer);
  bodyPatch.append("productId", formData.multiSelectProduct);
  bodyPatch.append("transactionDate", formData.inputDate);
  bodyPatch.append("totalAmount", formData.inputTotal);
  bodyPatch.append("paymentMethod", formData.inputPaymentMethod);
  bodyPatch.append("paymentStatus", formData.inputPaymentStatus);
  $fetch("/api/transaction/transaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyPatch,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        submit(res);
      }
    })
    .catch((err) => {
      submit(err);
    });
}

async function updateTransaction() {
  validator.value.clearErrors();
  await validator.value.validate();
  if (validator.value.fail()) {
    toast.error({
      message: validator.value.getErrorMessage(),
    });
    isError.value = true;
    setTimeout(() => {
      isError.value = false;
    }, 1000);
    return;
  }
  var bodyPatch = new URLSearchParams();
  bodyPatch.append("id", currentData.value.id);
  bodyPatch.append("userId", formData.selectCustomer);
  bodyPatch.append("productId", formData.multiSelectProduct);
  bodyPatch.append("transactionDate", formData.inputDate);
  bodyPatch.append("totalAmount", formData.inputTotal);
  bodyPatch.append("paymentMethod", formData.inputPaymentMethod);
  bodyPatch.append("paymentStatus", formData.inputPaymentStatus);
  $fetch("/api/transaction/transaction", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyPatch,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        submit(res);
      }
    })
    .catch((err) => {
      submit(err);
    });
}

function deleteTransaction(id: any): Promise<Boolean> {
  var bodyDelete = new URLSearchParams();
  bodyDelete.append("id", id);
  const deleted = $fetch("/api/transaction/transaction", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyDelete,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        getTransaction();
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });
  return deleted;
}

onMounted(async () => {
  getTransaction();
});

onUpdated(async () => {
  if (formShow.value) {
    getCustomer();
    getProduct();
  }
});

type list = {
  label: string;
  value: string;
};

var customerList = ref<list[]>([]);

var productList = ref<list[]>([]);

//Customer fetch
async function getCustomer() {
  await fetch("/api/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        customerList.value = [];
        res.json().then((result) => {
          if (result.error == undefined) {
            result.forEach((obj: any) => {
              customerList.value.push({
                label: obj.name,
                value: obj._id,
              });
            });
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}

//Product fetch
async function getProduct() {
  await fetch("/api/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        productList.value = [];
        res.json().then((result) => {
          if (result.error == undefined) {
            result.forEach((obj: any) => {
              productList.value.push({
                label: obj.name,
                value: obj._id,
              });
            });
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}

const composableForm = useForm();
const dialog = useDialog();
const toast = useToast();

async function toggleDialog(data: any) {
  if (data != undefined) {
    const isConfirmed = await dialog.fire({
      title: `Delete ${data.name}`,
      description: `Are you sure to delete ${data.name} ?`,
      icon: "alert-triangle",
    });

    if (!isConfirmed) {
      return;
    }
    deleteTransaction(data.id).then((deleted) => {
      if (deleted) {
        toast.success({
          message: `Success Delete ${data.name}`,
        });
      } else {
        toast.error({
          message: `Failed Delete ${data.name}`,
        });
      }
    });
  }
}

//Form Setup
const formName = "formTransaction";
const isError = ref(false);
const form = computed(() => composableForm.getForm(formName));
const validator = computed(() => form.value.validator);

async function submit(data: any) {
  // const isConfirmed = await dialog.fire({
  //   title: "Are you sure to submit?",
  //   description: currentData != undefined ? `You will update ${currentData.value.name}` : `Add data to table`,
  // });
  // if (!isConfirmed) return;
  if (data.error != undefined) {
    toast.error({
      message: data.message,
    });
  } else {
    getData(undefined);
    toggleForm();
    getTransaction();
    clear();
  }
}

const formData: {
  [key: string]: any;
} = reactive({
  selectCustomer: null,
  multiSelectProduct: null,
  inputDate: null,
  inputTotal: null,
  inputPaymentMethod: null,
  inputPaymentStatus: null,
});

const formRules = {
  selectCustomer: ["required"],
  multiSelectProduct: ["required"],
  inputDate: ["required", "string"],
  inputTotal: ["required"],
  inputPaymentMethod: ["required", "string"],
  inputPaymentStatus: ["required", "string"],
};

function clear() {
  formData.selectCustomer = null;
  formData.multiSelectProduct = null;
  formData.inputDate = null;
  formData.inputTotal = null;
  formData.inputPaymentMethod = null;
  formData.inputPaymentStatus = null;

  validator.value.clearErrors();
}

var currentData = ref();
function getData(data: any) {
  currentData.value = data;
  if (data != undefined) {
    formData.selectCustomer = data.detail_user[0]._id;
    formData.multiSelectProduct = data.detail_product.map(
      (obj: any) => obj._id
    );
    formData.inputDate = data.transactionDate;
    formData.inputTotal = data.totalAmount;
    formData.inputPaymentMethod = data.paymentMethod;
    formData.inputPaymentStatus = data.paymentStatus;
  }
}

function toggleForm() {
  validator.value.clearErrors();
  formShow.value = !formShow.value;
  if (formShow.value) {
    getCustomer();
    getProduct();
  }
}

watch(formData, (value) => {
  if (value.inputDate != undefined && value.inputDate != null) {
    formData.inputDate = value.inputDate.toString();
  }
});

//Filter Date
watch(filterDate, (value) => {
  getTransaction();
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Datatable Transaction</h2>
    <hr class="my-2 border dark:border-gray-700" />
    <div v-show="!formShow">
      <div class="col-span-12 flex justify-start gap-1">
        <TwButton variant="primary" icon="file-plus" class="border border-gray-900 my-2" @click="toggleForm()">
          Add Data
        </TwButton>
      </div>
      <div class="col-span-12 flex justify-start gap-1 my-2">
        <VueDatePicker class="dp" label="Start Date" name="startDate" v-model="filterDate.startDate"
          placeholder="Input Start Date" type="text" />
        <VueDatePicker class="dp" label="End Date" name="endDate" v-model="filterDate.endDate"
          placeholder="Input End Date" type="text" />
      </div>
      <TwDatatableClient class="!dark:text-gray-200" v-model:search="datas.search" v-model:limit="datas.limit"
        v-model:selected="datas.selected" v-model:sort-by="datas.sortBy" v-model:sort-type="datas.sortType"
        :column="datas.column" :data="datas.data" :setting="datas.setting" @datatable:column-hook="datatableHook">
        <template #row="{ column, data }">
          <template v-if="column.field === 'name'">
            {{ data.detail_user.map((obj: any) => obj.name).toString() }}
          </template>
          <template v-if="column.field === 'product'">
            {{ data.detail_product.map((obj: any) => obj.name).toString() }}
          </template>
          <template v-if="column.field === 'date'">
            {{
              new Date(data.transactionDate).toLocaleDateString("id-ID", {
                hour12: false,
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }}
          </template>
          <template v-if="column.field === 'total'">
            {{ data.totalAmount }}
          </template>
          <template v-if="column.field === 'paymentMethod'">
            {{ data.paymentMethod }}
          </template>
          <template v-if="column.field === 'paymentStatus'">
            {{ data.paymentStatus }}
          </template>
          <template v-if="column.field === 'action'">
            <div class="flex gap-2 justify-center">
              <TwButton variant="primary" class="border border-gray-900" @click="
                toggleForm();
              getData(data);
              ">
                Edit
              </TwButton>
              <TwButton variant="danger" @click="toggleDialog(data)">
                Delete
              </TwButton>
            </div>
          </template>
        </template>
        <template #empty>
          <div class="p-2 rounded">Sorry, No Data Available</div>
        </template>
      </TwDatatableClient>
      <hr class="my-2 dark:border-gray-700" />
      <div>
        <div class="flex gap-2">
          <div class="w-32">Selected Data</div>
          <div>: {{ datas.selected }}</div>
        </div>
        <div class="flex gap-2">
          <div class="w-32">Order By</div>
          <div>: {{ datas.sortBy }}</div>
        </div>
        <div class="flex gap-2">
          <div class="w-32">Order Type</div>
          <div>: {{ datas.sortType }}</div>
        </div>
        <div class="flex gap-2">
          <div class="w-32">Search</div>
          <div>: {{ datas.search }}</div>
        </div>
      </div>
    </div>
    <div v-show="formShow">
      <h1 class="font-bold">
        {{
          currentData != undefined
          ? `Update Data ${currentData.name}`
          : "Tambah Data"
        }}
      </h1>
      <TwForm :name="formName"
        class="grid grid-cols-12 gap-2 bg-white dark:bg-gray-900 dark:border dark:border-gray-700 rounded-lg p-2 shadow"
        :class="{
          'tw-shake': isError,
        }" :rules="formRules" @submit="
  currentData != undefined ? updateTransaction() : addTransaction()
  " :custom-field-name="{
    inputDate: 'Input',
    inputTotal: 'Input',
    inputPaymentMethod: 'Input',
    inputPaymentStatus: 'Input',
  }">
        <div class="col-span-12">
          <TwSelect label="Name Customer" name="selectCustomer" v-model="formData.selectCustomer" :items="customerList"
            placeholder="Choose Customer" />
          <CustomErrorMessage name="selectCustomer" />
        </div>
        <div class="col-span-12">
          <TwMultiSelect label="Select Product" name="multiSelectProduct" v-model="formData.multiSelectProduct"
            :items="productList" placeholder="Choose Product" />
          <CustomErrorMessage name="multiSelectProduct" />
        </div>
        <div class="col-span-12">
          <TwInput label="Transaction Date" name="inputDate" v-model="formData.inputDate" placeholder="Transaction Date"
            type="text" disabled />
          <VueDatePicker class="dp" label="Transaction Date" name="inputDate" v-model="formData.inputDate"
            placeholder="Input Date" type="text" />
          <CustomErrorMessage name="inputDate" />
        </div>
        <div class="col-span-12">
          <TwInput label="Total Amount" name="inputTotal" v-model="formData.inputTotal" placeholder="Input Total"
            type="text" />
          <CustomErrorMessage name="inputTotal" />
        </div>
        <div class="col-span-12">
          <TwInput label="Payment Method" name="inputPaymentMethod" v-model="formData.inputPaymentMethod"
            placeholder="Input Method" type="text" />
          <CustomErrorMessage name="inputPaymentMethod" />
        </div>
        <div class="col-span-12">
          <TwInput label="Payment Status" name="inputPaymentStatus" v-model="formData.inputPaymentStatus"
            placeholder="Input Status" type="text" />
          <CustomErrorMessage name="inputPaymentStatus" />
        </div>
        <div class="col-span-12 flex justify-end gap-1">
          <TwButton variant="primary" type="button" class="border border-gray-900" @click="
            clear();
          toggleForm();
          getData(undefined);
          ">
            Close
          </TwButton>
          <TwButton ripple variant="secondary" type="button" class="dark:text-gray-200 dark:!border-gray-800 dark:border"
            @click="clear()">
            Reset
          </TwButton>
          <TwButton variant="primary"> Submit </TwButton>
        </div>
      </TwForm>
    </div>
  </div>
</template>
