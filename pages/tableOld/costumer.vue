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


const datas = ref({
  column: [
    {
      label: "Name",
      field: "name",
      width: "400px",
      sortable: true,
    },
    {
      label: "Email",
      field: "email",
      width: "400px",
      sortable: true,
    },
    {
      label: "Phone",
      field: "phone",
      width: "400px",
      sortable: true,
    },
    {
      label: "License",
      field: "licensePlates",
      width: "400px",
      sortable: true,
    },
    {
      label: "Points",
      field: "loyaltyPoints",
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

function renameKey(obj: any, oldKey: any, newKey: any) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
}

function stringifyArray(obj: any, oldKey: any, newKey: any) {
  obj[newKey] = obj[oldKey].toString();
  delete obj[oldKey];
}

async function getCustomer() {
  await fetch("/api/customer", {
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
            finalResult.forEach((obj: any) =>
              stringifyArray(obj, "licensePlates", "_licensePlates")
            );
            datas.value.data = finalResult as Array<DatatableData>;
            datas.value.setting.limitOption;
          }
        });
      } else {
      }
    })
    .catch((err) => { });
}

async function addCustomer() {
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
  bodyPatch.append("name", formData.inputName);
  bodyPatch.append("email", formData.inputEmail);
  bodyPatch.append("phone", formData.inputPhone);
  bodyPatch.append("licensePlates", arrLicense.value.toString());
  bodyPatch.append("loyaltyPoints", formData.inputPoint);
  $fetch("/api/customer/customer", {
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

async function updateCustomer() {
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
  bodyPatch.append("name", formData.inputName);
  bodyPatch.append("email", formData.inputEmail);
  bodyPatch.append("phone", formData.inputPhone);
  bodyPatch.append("licensePlates", arrLicense.value.toString());
  bodyPatch.append("loyaltyPoints", formData.inputPoint);
  $fetch("/api/customer/customer", {
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

function deleteCustomer(id: any): Promise<Boolean> {
  var bodyDelete = new URLSearchParams();
  bodyDelete.append("id", id);
  const deleted = $fetch("/api/customer/customer", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyDelete,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        getCustomer();
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

onMounted(async () => getCustomer());

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
    deleteCustomer(data.id).then((deleted) => {
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
const formName = "formCustomer";
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
    getCustomer();
    clear();
  }
}

const formData: {
  [key: string]: any;
} = reactive({
  inputName: null,
  inputEmail: null,
  inputPhone: null,
  inputLicense: [],
  inputPoint: null,
});

const formRules = {
  inputName: ["required", "string"],
  inputEmail: ["required", "string", "email"],
  inputPhone: ["required", "string"],
  inputLicense: ["required", "string"],
  inputPoint: ["required"],
};

function clear() {
  formData.inputName = null;
  formData.inputEmail = null;
  formData.inputPhone = null;
  formData.inputLicense = [];
  formData.inputPoint = null;
  arrLicense.value = [];

  validator.value.clearErrors();
}

var currentData = ref();
var arrLicense = ref([""]);
function getData(data: any) {
  currentData.value = data;
  if (data != undefined) {
    formData.inputName = data.name;
    formData.inputEmail = data.email;
    formData.inputPhone = data.phone;
    formData.inputLicense = data._licensePlates.split(",");
    formData.inputPoint = data.loyaltyPoints;
    arrLicense.value.pop();
    formData.inputLicense.forEach((obj: any) => arrLicense.value.push(obj));
  } else {
    arrLicense.value.push("");
  }
}

function toggleForm() {
  validator.value.clearErrors();
  formShow.value = !formShow.value;
}

function addLicense() {
  arrLicense.value.push("");
}
async function deleteLicense(index: any) {
  arrLicense.value.splice(index, 1);
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Datatable Customer</h2>
    <hr class="my-2 border dark:border-gray-700" />
    <div v-show="!formShow">
      <div class="col-span-12 flex justify-start gap-1">
        <TwButton variant="primary" icon="user-plus" class="border border-gray-900 my-2" @click="toggleForm()">
          Add Data
        </TwButton>
      </div>
      <TwDatatableClient class="!dark:text-gray-200" v-model:search="datas.search" v-model:limit="datas.limit"
        v-model:selected="datas.selected" v-model:sort-by="datas.sortBy" v-model:sort-type="datas.sortType"
        :column="datas.column" :data="datas.data" :setting="datas.setting" @datatable:column-hook="datatableHook">
        <template #row="{ column, data }">
          <template v-if="column.field === 'name'">
            {{ data.name }}
          </template>
          <template v-if="column.field === 'email'">
            {{ data.email }}
          </template>
          <template v-if="column.field === 'phone'">
            {{ data.phone }}
          </template>
          <template v-if="column.field === 'licensePlates'">
            {{ data._licensePlates }}
          </template>
          <template v-if="column.field === 'loyaltyPoints'">
            {{ data.loyaltyPoints }}
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
        }" :rules="formRules" @submit="currentData != undefined ? updateCustomer() : addCustomer()" :custom-field-name="{
  inputName: 'Input',
  inputEmail: 'Input',
  inputPhone: 'Input',
  inputPoint: 'Input',
}">
        <div class="col-span-12">
          <TwInput label="Name" name="inputName" v-model="formData.inputName" placeholder="Input Name" type="text" />
          <CustomErrorMessage name="inputName" />
        </div>
        <div class="col-span-12">
          <TwInput label="Email" name="inputEmail" v-model="formData.inputEmail" placeholder="Input Email" type="text" />
          <CustomErrorMessage name="inputEmail" />
        </div>
        <div class="col-span-12">
          <TwInput label="Phone" name="inputPhone" v-model="formData.inputPhone" placeholder="Input Phone" type="text" />
          <CustomErrorMessage name="inputPhone" />
        </div>
        <div class="col-span-12">
          <div v-for="(input, index) in arrLicense.length" class="input wrapper flex items-center">
            <div>
              <TwInput :label="index <= 0 ? `License Plates` : ``" name="inputLicense" v-model="arrLicense[index]"
                placeholder="Input License" type="text" />
              <CustomErrorMessage name="inputLicense" />
            </div>
            <div v-if="arrLicense.length <= 1"></div>
            <div v-else class="input wrapper flex items-center">
              <TwButton variant="danger" type="button" @click="deleteLicense(index)"
                class="border border-gray-900 bg-red-800">
                Delete
              </TwButton>
            </div>
          </div>
          <TwButton variant="primary" type="button" class="border border-gray-900 bg-gray-800 my-3" @click="addLicense()">
            Add License Plate
          </TwButton>
        </div>
        <div class="col-span-12">
          <TwInput label="Loyalty Point" name="inputPoint" v-model="formData.inputPoint" placeholder="Input Point"
            type="number" />
          <CustomErrorMessage name="inputPoint" />
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
