<template>
    <header class="fb__header">
        <!-- <router-link to="/">Home</router-link> -->
<!-- 
        <nav id="nav" class="fb__nav">
            <ul class="fb__nav__wrapper">
                <li class="fb__nav__menu" v-for="(menu, index) in menus" :key="index" :class="$route.params.id == menu.id ? 'active' : ''">
                    <router-link :to="`/detail/${menu.id}`">
                        <span>{{ menu.name }}</span>
                    </router-link>
                </li>
            </ul>
        </nav> -->

        <form action="" class="fb__search" @submit.prevent="searchInit($event)">
            <fieldset class="fb__search__wrapper">
                <legend>검색하기</legend>
                <input type="search" class="fb__search__input" placeholder="Search" v-model.trim="searchWord" @keyup.stop="searchInit($event)">
                <button type="submit" class="fb__search__button">Search</button>
            </fieldset>
        </form>
    </header>
</template>

<script>
import eventBus from "../utils/bus";
export default {
    name: "Header",
    data() {
        return {
            menus: [],
            searchWord: ""
        }
    },
    created() {
        this.requestMenus();
    },

    methods: {
        async requestMenus() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/genre/movie/list",
                })

                if (response) this.menus = response.genres;
            }

            catch(ex) {
                console.error(ex);
            }
        },

        searchInit() {
            if (!this.searchWord) return ;
            eventBus.$emit("search:tv", this.searchWord);
        }
    }
}
</script>