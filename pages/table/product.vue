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

definePageMeta({
  middleware: "auth",
});

const datas = ref({
  column: [
    {
      label: "Name",
      field: "name",
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
      label: "Stock",
      field: "stock",
      width: "400px",
      sortable: true,
    },
    {
      label: "Price",
      field: "price",
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

async function getProduct() {
  await fetch("/api/product", {
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
            datas.value.data = finalResult as Array<DatatableData>;
          }
        });
      } else {
      }
    })
    .catch((err) => {});
}

async function addProduct() {
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
  bodyPatch.append("description", formData.textAreaDescription);
  bodyPatch.append("stockQuantity", formData.inputStock);
  bodyPatch.append("price", formData.inputPrice);
  $fetch("/api/product/product", {
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

async function updateProduct() {
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
  bodyPatch.append("description", formData.textAreaDescription);
  bodyPatch.append("stockQuantity", formData.inputStock);
  bodyPatch.append("price", formData.inputPrice);
  $fetch("/api/product/product", {
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

function deleteProduct(id: any): Promise<Boolean> {
  var bodyDelete = new URLSearchParams();
  bodyDelete.append("id", id);
  const deleted = $fetch("/api/product/product", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyDelete,
    redirect: "follow",
  })
    .then((res) => {
      if (res != undefined) {
        getProduct();
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

onMounted(async () => getProduct());

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
const formName = "formProduct";
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
    getProduct();
    clear();
  }
}

const formData: {
  [key: string]: any;
} = reactive({
  inputName: null,
  inputStock: null,
  inputPrice: null,
  textAreaDescription: null,
});

const formRules = {
  inputName: ["required", "string"],
  inputStock: ["required", "numeric"],
  inputPrice: ["required", "string"],
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
  formData.inputName = null;
  formData.inputStock = null;
  formData.inputPrice = null;
  formData.textAreaDescription = null;

  validator.value.clearErrors();
}

var currentData = ref();
function getData(data: any) {
  currentData.value = data;
  if (data != undefined) {
    formData.inputName = data.name;
    formData.textAreaDescription = data.description;
    formData.inputStock = data.stockQuantity;
    formData.inputPrice = data.price;
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
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Datatable Product</h2>
    <hr class="my-2 border dark:border-gray-700" />
    <div v-show="!formShow">
      <div class="col-span-12 flex justify-start gap-1">
        <TwButton
          variant="primary"
          icon="plus-square"
          class="border border-gray-900 my-2"
          @click="toggleForm()"
        >
          Add Data
        </TwButton>
      </div>
      <TwDatatableClient
        class="!dark:text-gray-200"
        v-model:search="datas.search"
        v-model:limit="datas.limit"
        v-model:selected="datas.selected"
        v-model:sort-by="datas.sortBy"
        v-model:sort-type="datas.sortType"
        :column="datas.column"
        :data="datas.data"
        :setting="datas.setting"
        @datatable:column-hook="datatableHook"
      >
        <template #row="{ column, data }">
          <template v-if="column.field === 'name'">
            {{ data.name }}
          </template>
          <template v-if="column.field === 'description'">
            {{ data.description }}
          </template>
          <template v-if="column.field === 'stock'">
            {{ Number(data.stockQuantity) }}
          </template>
          <template v-if="column.field === 'price'">
            {{ formatRupiah(data.price.toString(), "Rp. ") }}
          </template>
          <template v-if="column.field === 'action'">
            <div class="flex gap-2 justify-center">
              <TwButton
                variant="primary"
                class="border border-gray-900"
                @click="
                  toggleForm();
                  getData(data);
                "
              >
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
      <TwForm
        :name="formName"
        class="grid grid-cols-12 gap-2 bg-white dark:bg-gray-900 dark:border dark:border-gray-700 rounded-lg p-2 shadow"
        :class="{
          'tw-shake': isError,
        }"
        :rules="formRules"
        @submit="currentData != undefined ? updateProduct() : addProduct()"
        :custom-field-name="{
          inputName: 'Input',
          textAreaExample: 'Text Area',
          inputStock: 'Input',
          inputPrice: 'Input',
        }"
      >
        <div class="col-span-12">
          <TwInput
            label="Name"
            name="inputName"
            v-model="formData.inputName"
            placeholder="Input Name"
            type="text"
          />
          <CustomErrorMessage name="inputName" />
        </div>
        <div class="col-span-12">
          <TwTextarea
            label="Description"
            name="textAreaDescription"
            v-model="formData.textAreaDescription"
            placeholder="Description"
            type="text"
          />
          <CustomErrorMessage name="textAreaDescription" />
        </div>
        <div class="col-span-12">
          <TwInput
            label="Stock"
            name="inputStock"
            v-model="formData.inputStock"
            placeholder="Input Stock"
            type="number"
          />
          <CustomErrorMessage name="inputStock" />
        </div>
        <div class="col-span-12">
          <TwInput
            label="Price"
            name="inputPrice"
            v-model="formData.inputPrice"
            placeholder="Input Price"
            type="text"
          />
          <CustomErrorMessage name="inputPrice" />
        </div>
        <div class="col-span-12 flex justify-end gap-1">
          <TwButton
            variant="primary"
            type="button"
            class="border border-gray-900"
            @click="
              clear();
              toggleForm();
              getData(undefined);
            "
          >
            Close
          </TwButton>
          <TwButton
            ripple
            variant="secondary"
            type="button"
            class="dark:text-gray-200 dark:!border-gray-800 dark:border"
            @click="clear()"
          >
            Reset
          </TwButton>
          <TwButton variant="primary"> Submit </TwButton>
        </div>
      </TwForm>
    </div>
  </div>
</template>
