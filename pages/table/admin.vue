<script setup lang="ts">
import { onMounted, ref } from "vue";
import { DatatableColumn, DatatableData, TwButton, TwDatatableClient, TwModal } from "vue3-tailwind";

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
      label: "Role",
      field: "role",
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
  sortBy: "status",
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

// const { data, error, execute, refresh } = await useFetch('/api/admin', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//   },
//   body: bodyGet,
//   redirect: 'follow'
// })

// const finalResult = data.value || [];
// finalResult.forEach((obj: any) => renameKey(obj, '_id', 'id'));
// datas.value.data = finalResult as Array<DatatableData>

async function getAdmin() {
  await fetch('/api/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyGet,
    redirect: 'follow'
  }).then((res) => {
    if (res != undefined) {
      res.json().then((result) => {
        const finalResult = result;
        finalResult.forEach((obj: any) => renameKey(obj, '_id', 'id'));
        datas.value.data = finalResult as Array<DatatableData>;
      })
    } else {
    }
  }).catch((err) => {
  })
}

onMounted(async () => getAdmin());

var modal = ref()
const deleteAdmin = (id: any) => {
  var bodyDelete = new URLSearchParams();
  bodyDelete.append("id", id);

  $fetch('/api/admin/admin', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: bodyDelete,
    redirect: 'follow'
  }).then((res) => {
    if (res != undefined) {
      getAdmin()
    } else {
    }
  }).catch((err) => {
  })
}

var currentData = ref()
function getData(data: any) {
  currentData.value = data
}

</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">Datatable Admin</h2>
    <hr class="my-2 border dark:border-gray-700" />
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
        <template v-if="column.field === 'role'">
          {{ data.role }}
        </template>
        <template v-if="column.field === 'description'">
          {{ data.description }}
        </template>
        <template v-if="column.field === 'action'">
          <div class="flex gap-2 justify-center">
            <TwButton variant="primary" class="border border-gray-900">
              Edit
            </TwButton>
            <TwButton variant="danger" @click="modal.toggleModal(); getData(data);"> Delete </TwButton>
          </div>
        </template>
      </template>
      <template #empty>
        <div class="p-2 rounded">Sorry, No Data Available</div>
      </template>
    </TwDatatableClient>
    <TwModal ref="modal" backdrop="static" :full-height="false">
      <template #header>
        <div>Delete {{ currentData.name }}</div>
      </template>
      <template #body>
        <div>
          Are you sure to delete {{ currentData.name }} ?
        </div>
      </template>
      <template #footer>
        <div class="absolute right-0">
          <TwButton variant="danger" @click="deleteAdmin(currentData.id); modal.closeModal();"> Delete </TwButton>
          <TwButton variant="primary" class="border border-gray-900 mx-5" @click="modal.closeModal()">
            No
          </TwButton>
        </div>
      </template>
    </TwModal>
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
</template>