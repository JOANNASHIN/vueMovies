<template>
    <div id="app">
        <div class="fb__layout">
            <header-component></header-component>
    
            <div class="fb__content">
                <router-view />
            </div>

            <footer-component></footer-component>
        </div>

        <!-- 필터 레이어 -->
        <filter-layer @closeFilterLayer="closeFilterLayer($event)"></filter-layer>

        <!-- loading spinner -->
        <spinner :loading="loadingStatus"></spinner>
    </div>
</template>

<script>
import eventBus from './utils/bus'
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import FilterLayer from "./components/FilterLayer";
import Spinner from "./components/Spinner.vue";

export default {
    components: {
        HeaderComponent,
        FooterComponent,
        FilterLayer,
        Spinner,
    },

    data() {
        return {
            loadingStatus: false,
        }
    },
 
    created() {
        //필터관련
        eventBus.$on("openFilterLayer", this.openFilterLayer);

        //spinner관련
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

         openFilterLayer() {
            this.isFilterShow = true;
        },

        closeFilterLayer() {
            this.isFilterShow = false;
        },
    }
}
</script>