<template>
    <section class="fb__main">
        <!-- 타이틀 -->
        <h2 class="fb__main__title fb__title">NOW {{ provideName | toUpperCase}}</h2>

        <!-- 리스트 -->
        <list-component :listData="tvList" :fetches="fetches.list" :fromSearch="fromSearch"></list-component>
    </section>
</template>

<script>
import eventBus from "../utils/bus";
import ListComponent from "../components/ListComponent";

export default {
    name: "Main",
    components: {
        ListComponent,
    },
    
    data() {
        return {
            fetches: {
                list: false,
            },

            requests: {
                tvList: {
                    with_ott_providers: 8,
                    ott_region: "KR",
                    with_genres: "",
                },
            },

            fromSearch: false,
            provideName: "NETFLEX",
            tvList: [],
        }
    },

    created() {
        this.requestTvList();
        eventBus.$on("search:tv", this.searchInit);
        eventBus.$on("filter:apply", this.filterApply)
    },

    methods: {
        async requestTvList() {
            const _localStorage = JSON.parse(window.localStorage.getItem("filter"))
            if (_localStorage) this.provideName = _localStorage.provider_name;

            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/discover/tv",
                    data: _localStorage ? Object.assign(this.requests.tvList, _localStorage) : this.requests.tvList
                })

                if (response) this.tvList = response.results;
                this.fetches.list = true;
                this.fromSearch = false;
            }

            catch(ex) {
                console.error("requestTvList has exception...", ex);
                this.fetches.list = "error";
            }
        },
        
        async requestSearchTvList(keyword) {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/search/tv",
                    data: Object.assign(this.requests.tvList, {
                        query: keyword
                    })
                })

                if (response) this.tvList = response.results;

                this.fetches.list = true;
                this.fromSearch = true;
            }

            catch(ex) {
                console.error("requestSearchTvList has exception...", ex);
                this.fetches.list = "error";
            }
        },

        searchInit(keyword) {
            if (keyword) {
                this.requestSearchTvList(keyword);
            }
            else {
                this.requestTvList();
            }
        },

        filterApply(parameter) {
            const { provider_name, with_ott_providers, with_genres } = parameter;

            //이름 설정
            this.provideName = provider_name;

            //params
            Object.assign(this.requests.tvList, {
                with_ott_providers,
                with_genres
            })

            //localStorage
            window.localStorage.setItem("filter", JSON.stringify(parameter))
            
            //request api
            this.requestTvList();
        },
    }
};
</script>

<style lang="scss">
    .fb {
        &__main {
            width: 100%;
        }
    }
</style>