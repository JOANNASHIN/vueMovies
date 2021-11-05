<template>
    <section class="fb__main">
        <h2 class="fb__main__title fb__title">NOW NETFLEX</h2>
        <list-component :listData="tvList" :fetches="fetches.list"></list-component>
    </section>
</template>

<script>
import eventBus from "../utils/bus";
import ListComponent from "../components/ListComponent";

export default {
    name: "Home",
    components: {
        ListComponent
    },
    
    data() {
        return {
            fetches: {
                list: false,
            },
            movieList: [],
            tvList: [],
        }
    },

    created() {
        this.requestMovieList();
        this.requestTvList();
        eventBus.$on("search:tv", this.searchInit);
    },

    methods: {
        async requestMovieList() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/discover/movie",
                    data: {
                        language: "en-US",
                    }
                })

                if (response) this.movieList = response.results;
                this.fetches.list = true;
            }

            catch(ex) {
                console.error(ex);
                this.fetches.list = 'error';
            }
        },

        async requestTvList() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/discover/tv",
                    data: {
                        with_ott_providers: 8,
                        ott_region: "KR"
                    }
                })

                if (response) this.tvList = response.results;
            }

            catch(ex) {
                console.error(ex);
            }
        },
        
        async requestSearchTvList(keyword) {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/search/tv",
                    data: {
                        with_ott_providers: 8,
                        ott_region: "KR",
                        query: keyword
                    }
                })

                if (response) this.tvList = response.results;
            }

            catch(ex) {
                console.error(ex);
            }
        },

        searchInit(keyword) {
            this.requestSearchTvList(keyword);
        }
    }
};
</script>