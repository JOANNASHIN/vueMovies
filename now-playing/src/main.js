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
const bodyDoc = document.querySelector("body");
let enSizing = false;
Vue.prototype.deviceType = "MOBILE";

function setFontSize() {
    if (window.innerWidth > window.innerHeight || window.innerWidth > 1100) {
        htmlDoc.style.fontSize = "";
        bodyDoc.setAttribute("type", "pc");
        Vue.prototype.deviceType = "PC";

       return ;
    }
    htmlDoc.style.fontSize = parseInt(htmlDoc.offsetWidth / 360 * 100) + '%';

    bodyDoc.setAttribute("type", "mobile");
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
