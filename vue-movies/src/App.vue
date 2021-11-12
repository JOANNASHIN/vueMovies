<template>
    <div id="app">
        <div class="fb__layout">
            <header-component></header-component>
    
            <div class="fb__content">

                <router-view />
            </div>

            <spinner :loading="loadingStatus"></spinner>

            <footer-component></footer-component>
        </div>
    </div>
</template>

<script>
import eventBus from './utils/bus'
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import Spinner from "./components/Spinner.vue";

export default {
    components: {
        HeaderComponent,
        FooterComponent,
        Spinner
    },

    data() {
        return {
            loadingStatus: false,
        }
    },
 
    created() {
        eventBus.$on("start:spinner", this.startSpinner);
        eventBus.$on("end:spinner", this.endSpinner);
    },

    beforeDestory() {
        eventBus.$off("start:spinner", this.startSpinner);
        eventBus.$off("end:spinner", this.endSpinner);
    },

    mounted () {
        document.body.classList.add('fb')
    },

    methods: {
        startSpinner() {
            this.loadingStatus = true;
        },

        endSpinner() {
            this.loadingStatus = false;
        },
    }
}
</script>