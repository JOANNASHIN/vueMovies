<template>
    <div id="app">
        <header-component></header-component>
        <router-view />
    </div>
</template>

<script>
// import bus from '../utils/bus'
import headerComponent from "./components/HeaderComponent.vue";
import mixin from "./mixins/mixin";

export default {
    components: {
        headerComponent
    },

    mixins: [mixin],

    mounted () {
        document.body.classList.add('fb')
    },

    data() {
        return {

        }
    }
}
</script>

<style>
</style>
