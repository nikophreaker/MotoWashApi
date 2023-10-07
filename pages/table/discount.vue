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
      label: "Code",
      field: "code",
      width: "400px",
      sortable: true,
    },
    {
      label: "Description",
      field: "description",
      width: "400px",
      sortable: true,
    },
    {
      label: "Type",
      field: "type",
      width: "400px",
      sortable: true,
    },
    {
      label: "Value",
      field: "value",
      width: "400px",
      sortable: true,
    },
    {
      label: "Start",
      field: "start_date",
      width: "400px",
      sortable: true,
    },
    {
      label: "End",
      field: "end_date",
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

var bodyGet = new URLSearchParams();
bodyGet.append("limit", datas.value.limit.toString());
bodyGet.append("skip", datas.value.offset.toString());
bodyGet.append("query", datas.value.search.toString());

const datatableHook = (arg: any) => {
  arg();
};

async function getDiscount() {
  await fetch("/api/discount", {
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
            datas.value.data = result.data as Array<DatatableData>;
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}

async function addDiscount() {
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
  bodyPatch.append("code", formData.inputCode);
  bodyPatch.append("description", formData.textAreaDescription);
  bodyPatch.append("type", formData.inputType);
  bodyPatch.append("value", formData.inputValue);
  bodyPatch.append("startDate", new Date(formData.inputStartDate).toISOString().replace('Z', ' ').replace('T', ' ').replace('.000', ''));
  bodyPatch.append("endDate", new Date(formData.inputEndDate).toISOString().replace('Z', ' ').replace('T', ' ').replace('.000', ''));
  $fetch("/api/discount/discount", {
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

async function updateDiscount() {
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
  bodyPatch.append("code", formData.inputCode);
  bodyPatch.append("description", formData.textAreaDescription);
  bodyPatch.append("type", formData.inputType);
  bodyPatch.append("value", formData.inputValue);
  bodyPatch.append("startDate", new Date(formData.inputStartDate).toISOString().replace('Z', ' ').replace('T', ' ').replace('.000', ''));
  bodyPatch.append("endDate", new Date(formData.inputEndDate).toISOString().replace('Z', ' ').replace('T', ' ').replace('.000', ''));
  $fetch("/api/discount/discount", {
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

function deleteDiscount(id: any): Promise<Boolean> {
  var bodyDelete = new URLSearchParams();
  bodyDelete.append("id", id);
  const deleted = $fetch("/api/discount/discount", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyDelete,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        getDiscount();
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

onMounted(async () => getDiscount());

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
    deleteProduct(data.id).then((deleted) => {
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
const formName = "formDiscount";
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
    getDiscount();
    clear();
  }
}

const formData: {
  [key: string]: any;
} = reactive({
  inputCode: null,
  inputType: null,
  inputValue: null,
  textAreaDescription: null,
  inputStartDate: null,
  inputEndDate: null,
});

const formRules = {
  inputCode: ["required", "string"],
  inputValue: ["required", "numeric"],
  inputType: ["required", "string"],
  // inputStartDate: ["required"],
  // inputEndDate: ["required"],
  textAreaDescription: [
    "required",
    "string",
    (value: string) => {
      const MIN_LENGTH = 15;
      if (!value || value.length < MIN_LENGTH) {
        return `Min length is ${MIN_LENGTH}, current length is ${value.length}`;
      }
    },
  ],
};

function clear() {
  formData.inputCode= null,
  formData.inputType= null,
  formData.inputValue= null,
  formData.textAreaDescription= null,
  formData.inputStartDate= null,
  formData.inputEndDate= null,

  validator.value.clearErrors();
}

var currentData = ref();
function getData(data: any) {
  currentData.value = data;
  if (data != undefined) {
    formData.inputCode = data.code,
    formData.inputType = data.type,
    formData.inputValue = Number(data.value),
    formData.textAreaDescription = data.description,
    formData.inputStartDate = data.start_date,
    formData.inputEndDate = data.end_date
  }
}

function toggleForm() {
  validator.value.clearErrors();
  formShow.value = !formShow.value;
}

function formatRupiah(angka: String, prefix: any) {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    var separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
}


// watch(formData, (value) => {
//   if (value.inputStartDate != undefined && value.inputStartDate != null) {
//     formData.inputStartDate = value.inputStartDate.toString();
//   }
//   if (value.inputEndDate != undefined && value.inputEndDate != null) {
//     formData.inputEndDate = value.inputEndDate.toString();
//   }
// });
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Datatable Discount</h2>
    <hr class="my-2 border dark:border-gray-700" />
    <div v-show="!formShow">
      <div class="col-span-12 flex justify-start gap-1">
        <TwButton variant="primary" icon="plus-square" class="border border-gray-900 my-2" @click="toggleForm()">
          Add Data
        </TwButton>
      </div>
      <TwDatatableClient class="!dark:text-gray-200" v-model:search="datas.search" v-model:limit="datas.limit"
        v-model:selected="datas.selected" v-model:sort-by="datas.sortBy" v-model:sort-type="datas.sortType"
        :column="datas.column" :data="datas.data" :setting="datas.setting" @datatable:column-hook="datatableHook">
        <template #row="{ column, data }">
          <template v-if="column.field === 'code'">
            {{ data.code }}
          </template>
          <template v-if="column.field === 'description'">
            {{ data.description }}
          </template>
          <template v-if="column.field === 'type'">
            {{ data.type }}
          </template>
          <template v-if="column.field === 'value'">
            {{ Number(data.value) }}
          </template>
          <template v-if="column.field === 'start_date'">
            {{
              new Date(data.start_date).toLocaleDateString("id-ID", {
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
          <template v-if="column.field === 'end_date'">
            {{
              new Date(data.end_date).toLocaleDateString("id-ID", {
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
        }" :rules="formRules" @submit="currentData != undefined ? updateDiscount() : addDiscount()" :custom-field-name="{
  inputCode: 'Input',
  textAreaDescription: 'Text Area',
  inputType: 'Input',
  inputValue: 'Input',
}">
        <div class="col-span-12">
          <TwInput label="Code" name="inputCode" v-model="formData.inputCode" placeholder="Input Code" type="text" />
          <CustomErrorMessage name="inputCode" />
        </div>
        <div class="col-span-12">
          <TwTextarea label="Description" name="textAreaDescription" v-model="formData.textAreaDescription"
            placeholder="Description" type="text" />
          <CustomErrorMessage name="textAreaDescription" />
        </div>
        <div class="col-span-12">
          <TwInput label="Type" name="inputType" v-model="formData.inputType" placeholder="Input Type" type="text" />
          <CustomErrorMessage name="inputType" />
        </div>
        <div class="col-span-12">
          <TwInput label="Value" name="inputValue" v-model="formData.inputValue" placeholder="Input Value"
            type="number" />
          <CustomErrorMessage name="inputValue" />
        </div>
        <div class="col-span-12">
          <!-- <TwInput label="Start Date" name="inputStartDate" v-model="formData.inputStartDate" placeholder="Start Date"
            type="text" disabled /> -->
          <VueDatePicker class="dp" label="Start Date" name="inputStartDate" v-model="formData.inputStartDate"
            placeholder="Start Date" type="text" />
          <CustomErrorMessage name="inputStartDate" />
        </div>
        <div class="col-span-12">
          <!-- <TwInput label="End Date" name="inputEndDate" v-model="formData.inputEndDate" placeholder="End Date"
            type="text" disabled /> -->
          <VueDatePicker class="dp" label="End Date" name="inputEndDate" v-model="formData.inputEndDate"
            placeholder="End Date" type="text" />
          <CustomErrorMessage name="inputEndDate" />
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
