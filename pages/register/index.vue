<script setup lang="ts">
import {
  useToast,
  TwButton,
  TwErrorMessage,
  TwForm,
  TwInput,
  TwSelect,
  DropdownItem,
} from "vue3-tailwind";
import { Admin } from "~/models/admin";

definePageMeta({
  layout: "front",
});

useHead({
  title: "Register",
});

const toast = useToast();
const formRegister = ref();
const formError = ref(false);
const router = useRouter();
const items: Array<DropdownItem> = [
  {
    label: "admin",
    value: "admin"
  },
  {
    label: "user",
    value: "user"
  }
]

const formData: {
  [key: string]: any;
} = reactive({
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "",
});

const toggleFormError = () => {
  formError.value = true;
  setTimeout(() => {
    formError.value = false;
  }, 1250);
};

const register = async () => {
  const validator = formRegister.value.validator();
  validator.clearErrors();
  await validator.validate();
  if (validator.fail()) {
    toast.error({
      message: validator.getErrorMessage(),
    });

    toggleFormError();
    return;
  }

  $fetch('/api/admin', {
    method: 'POST',
    body: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    }
  }
  ).then((data) => {
    toast.success({
      message: "Add admin success",
      lifetime: 1000,
    });
    setTimeout(() => {
      navigateTo("/");
    }, 1000);
    console.log(data)
  }).catch((err) => {
    console.log(err)
    toast.error({
      message: "Add admin failed",
      lifetime: 3000,
    });
    return;
  })
};
</script>

<template>
  <div class="text-white flex justify-center pt-40">
    <div class="text-gray-800 rounded-t-lg w-96 shadow-lg p-1 bg-gradient-to-b from-indigo-400 h-20" :class="{
      'tw-shake': formError,
    }">
      <div
        class="header bg-white dark:bg-gray-900 border-b dark:border-gray-700 text-indigo-900 dark:text-gray-200 p-4 rounded-t">
        <h1 class="text-2xl font-bold text-center">Welcome</h1>
      </div>
      <TwForm ref="formRegister" name="register" :rules="{
        name: ['required'],
        email: ['required', 'email'],
        phone: ['required'],
        password: ['required'],
        role: ['required'],
      }" @submit="register" class="body bg-white dark:bg-gray-900 p-4 rounded-b-lg">
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-12">
            <TwInput class="dark:text-gray-200" v-model="formData.name" name="name" label="Name" />
            <TwErrorMessage name="name"></TwErrorMessage>
          </div>
          <div class="col-span-12">
            <TwInput class="dark:text-gray-200" v-model="formData.email" name="email" label="Email" />
            <TwErrorMessage name="email"></TwErrorMessage>
          </div>
          <div class="col-span-12">
            <TwInput class="dark:text-gray-200" v-model="formData.phone" name="phone" label="Phone" />
            <TwErrorMessage name="phone"></TwErrorMessage>
          </div>
          <div class="col-span-12">
            <TwInput class="dark:text-gray-200" v-model="formData.password" name="password" label="Password"
              type="password" />
            <TwErrorMessage name="password"></TwErrorMessage>
          </div>
          <div class="col-span-12">
            <TwSelect class="dark:text-gray-200" v-model="formData.role" name="role" label="Role" v-bind:items="items" />
            <TwErrorMessage name="role"></TwErrorMessage>
          </div>
          <div class="col-span-12">
            <TwButton class="w-full text-center">
              Register
            </TwButton>
          </div>
        </div>
      </TwForm>
    </div>
  </div>
</template>
