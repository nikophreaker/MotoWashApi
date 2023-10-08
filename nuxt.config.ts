// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: false },
  runtimeConfig: {
    dbUrl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    user: process.env.DBUSERNAME,
    pass: process.env.DBPASSWORD,
    authSource: process.env.DBAUTHSOURCE,
    mysql: {
      host: process.env.HOST,
      user: process.env.DBUSERNAME,
      password: process.env.DBPASSWORD,
      database: process.env.DBNAME,
      connectionLimit: 10,
    },
    secretKey: process.env.SECRET_TOKEN
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  imports: {
    dirs: ["store"],
  },
  routeRules: {
    "/api/**": { swr: false, cache: false },
    "/**": { swr: true },
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
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@kevinmarrec/nuxt-pwa",
    "@sidebase/nuxt-auth"
  ],
  css: ["~/assets/css/main.css"],
  mongoose: {
    uri: process.env.DATABASE_URL,
    options: {
      dbName: process.env.DBNAME,
      user: process.env.MONGODBUSERNAME,
      pass: process.env.MONGODBPASSWORD,
    },
    modelsDir: "./models",
    devtools: false,
  },
  auth: {
    // The module is enabled. Change this to disable the module
    isEnabled: true,
    // The origin is set to the development origin. Change this when deploying to production by setting `origin` in this config before build-time or by exporting `AUTH_ORIGIN` by running `export AUTH_ORIGIN=...`
    baseURL: `${process.env.ORIGIN_URL}/api/auth`,
    // The base path to the authentication endpoints. Change this if you want to add your auth-endpoints at a non-default location
    // baseURL: '/api/auth',
    session: {
      // Whether to periodically refresh the session. Change this to `true` for a refresh every seconds or set this to a number like `5000` for a refresh every 5000 milliseconds (aka: 5 seconds)
      enableRefreshPeriodically: false,
      // Whether to refresh the session whenever a window focus event happens, i.e, when your user refocuses the window. Set this to `false` to turn this off
      enableRefreshOnWindowFocus: true,
    },
    // Select the default-provider to use when `signIn` is called. Setting this here will also effect the global middleware behavior: E.g., when you set it to `github` and the user is unauthorized, they will be directly forwarded to the Github OAuth page instead of seeing the app-login page
    provider: undefined,
    // Configuration of the global auth-middleware (only applies if you set `globalAppMiddleware: true` above!)
    globalAppMiddleware: {
      isEnabled: true,
      // Whether to allow access to 404 pages without authentication. Set this to `false` to force users to sign-in before seeing `404` pages. Setting this to false may lead to vue-router problems (as the target page does not exist)
      allow404WithoutAuth: true,
      // Whether to automatically set the callback url to the page the user tried to visit when the middleware stopped them. This is useful to disable this when using the credentials provider, as it does not allow a `callbackUrl`. Setting this to a string-value will result in that being used as the callbackUrl path. Note: You also need to set the global `addDefaultCallbackUrl` setting to `false` if you want to fully disable this for the global middleware.
      addDefaultCallbackUrl: true
    }
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
