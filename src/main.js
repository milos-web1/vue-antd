// import './assets/main.css'

import { createApp } from "vue";
import { createAuth0 } from "@auth0/auth0-vue";
import moment from 'moment';
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

import App from "./App.vue";
import { createRouter } from "./router";
import JsonExcel from "vue-json-excel3";


const app = createApp(App);
app.use(Antd);
// app.use(router);
app.use(createRouter(app));
app.component("downloadExcel", JsonExcel);

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_CLIENT_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      // redirect_uri: window.location.origin + "/model",
      redirect_uri: window.location.origin,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    },
  })
);
app.config.globalProperties.$moment = moment;

app.mount("#app");
