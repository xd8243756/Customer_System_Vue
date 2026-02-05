import { createApp } from "vue";
import { createRouter, createWebHistory } from 'vue-router'

import App from "./App.vue";
import router from './router'

import Antd from "ant-design-vue";


// 引入 Bootstrap 核心樣式
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 引入 bootstrap-vue-next 的樣式
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'


//引入 bootstrap-icons
import 'bootstrap-icons/font/bootstrap-icons.css';


//引入ant-design-vue 樣式
import "ant-design-vue/dist/reset.css";
// import router from "vue-router";




const app = createApp(App);
app.use(router);
app.use(Antd).mount("#app");
