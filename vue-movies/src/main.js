import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Meta from "vue-meta";
import mixin from "./mixins/mixin";

Vue.config.productionTip = false;

Vue.use(Meta, {
    keyName: "metaInfo",
    attribute: "data-vue-meta",
    ssrAttribute: "data-vue-meta-server-rendered",
    tagIDKeyName: "vmid",
    refreshOnceOnNavigation: true
});

Vue.mixin(mixin);


/* resize */
const htmlDoc = document.documentElement;
let enSizing = false;

function setFontSize() {
    if (window.innerWidth > window.innerHeight) return ;
    htmlDoc.style.fontSize =  parseInt(htmlDoc.offsetWidth / 360 * 100) + '%';
 }
 
 window.onresize = function() {
     if (!enSizing) {
         window.requestAnimationFrame(function() {
             setFontSize();
             enSizing = false;
         });
     }
     enSizing = true;
 }
 
window.dispatchEvent(new Event('resize'));


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
