// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import config from './config/config'
import API from './config/APIHeader';
import LocalStorageUtils from  './utils/LocalStorageUtils'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
window.API = API;
Vue.config.productionTip = false
const storage = new LocalStorageUtils();
window.storage = storage;

//获取外部配置文件IP, 然后创建vue实例
if (storage.getJson("bsumIP")) {
  config.baseURL = storage.getJson("bsumIP");
  initVue();//创建vue实例
  console.log(router);
  console.log(router.options);
  // router.push("/");
} else {
  axios.get("config/app-config.json").then((result) => {

    config.baseURL = result.data.baseUrl;
    storage.set('bsumIP', result.data.baseUrl);
    initVue();//创建vue实例
  }).catch((error) => {
    initVue();//创建vue实例
    console.log("main请求本地出错", error);
  });
}

router.beforeEach(function (to, from, next) {
  // loadingInstance = Loading.service({ fullscreen: true,background:'rgba(0,0,0,.5)' });
  let meta = to.meta.auth;
  let name = to.name;
  let token = storage.get('Token');
  if (name == 'login') {
    next()
    return
  }
  if (meta) {
    // next()
    if (!token) {
      next({name:'login'})
      return
    }
    next()
  }else {
    next()
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
});

router.afterEach(function (to) {
  // loadingInstance.close();
  // store.commit('updateLoadingStatus', {isLoading: false})
});

function initVue(){
  new Vue({
    el: '#app',
    router,
    // store,
    template: '<App/>',
    components: { App }
  });
}
