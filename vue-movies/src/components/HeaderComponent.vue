<template>
    <header class="fb__header">
        <form action="" class="fb__search" @submit.prevent="searchInit($event)">
            <fieldset class="fb__search__wrapper">
                <legend>검색하기</legend>
                <input type="search" class="fb__search__input" placeholder="Search" v-model.trim="searchWord" @keyup.stop="searchInit($event)">
            </fieldset>
        </form>

        <!-- <nav class="fb__header__floating" :class="isFold ? 'active' : ''">
            <button class="fb__header__menu filter" @click="openFilterLayer($event)">필터 버튼</button>
            <button class="fb__header__fold" @click="isFold = !isFold">접기 버튼</button>
        </nav> -->
    </header>
</template>

<script>
import eventBus from "../utils/bus";

export default {
    name: "Header",
    data() {
        return {
            searchWord: "",
            isFilterShow: false,
            isFold: false,
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
            // if (!this.searchWord) return ;
            eventBus.$emit("search:tv", this.searchWord);
        },
    }
}
</script>