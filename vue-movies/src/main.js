import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
import mixin from "./mixins/mixin";

window.VueMixins = {
    mixin
}

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
