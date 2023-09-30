// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    dbUrl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    user: process.env.DBUSERNAME,
    pass: process.env.DBPASSWORD,
    authSource: process.env.DBAUTHSOURCE,
  },
  imports: {
    dirs: ["store"],
  },
  routeRules: {
    "/api/**": { swr: false, cache: false },
    '/**': { swr: true },
  },
  typescript: {
    shim: false,
    strict: true,
  },
  // vue: {  
  //   compilerOptions: {
  //     isCustomElement: (tag) => ['TwToast'].includes(tag),
  //   },
  // },
  modules: [
    "nuxt-mongoose",
    "nuxt-security",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@kevinmarrec/nuxt-pwa",
  ],
  css: ["~/assets/css/main.css"],
  mongoose: {
    uri: process.env.DATABASE_URL,
    options: {
      dbName: process.env.DBNAME,
      user: process.env.DBUSERNAME,
      pass: process.env.DBPASSWORD,
    },
    modelsDir: "./models",
    devtools: true,
  },
  security: {
    basicAuth: {
      exclude: ["/"],
      name: "admin",
      pass: "admin",
      enabled: true,
      message: "admin",
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  tailwindcss: {
    configPath: "tailwind.config",
    exposeConfig: false,
    exposeLevel: 2,
    config: {},
    injectPosition: "first",
    viewer: true,
    // theme: {
    //   colors: {
    //     primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","610":"#8eaef5","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
    //   },
    //   variables: {
    //     'navbar-height': '100px',
    //   },
    // },
  },
  pwa: {
    workbox: {
      enabled: false,
    },
  },
});
