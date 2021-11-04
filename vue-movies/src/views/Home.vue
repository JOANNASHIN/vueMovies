<template>
    <section class="fb__main">
        <h2 class="fb__title">NOW NETFLEX</h2>
        <list-component :list="tvList"></list-component>
    </section>
</template>

<script>
import ListComponent from "../components/ListComponent";

export default {
    name: "Home",
    components: {
        ListComponent
    },
    
    data() {
        return {
            movieList: [],
            tvList: [],
        }
    },

    created() {
        this.requestMovieList();
        this.requestTvList();
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
            }

            catch(ex) {
                console.error(ex);
            }
        },

        async requestTvList() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/discover/tv",
                    data: {
                        language: "ko-KR|en-US",
                        with_ott_providers: 8,
                        ott_region: "KR"
                    }
                })

                if (response) this.tvList = response.results;
            }

            catch(ex) {
                console.error(ex);
            }
        }
    }
};
</script>

<style scoped lang="scss">
    .fb {
        &__main {
            // padding-left: rem(12px);
        }
        
        &__title {
            padding: rem(24px 0);
            font-family: "SpoqaHanSansNeo";
            @include fontcss($black, 600, rem(28px), 1.2);
        }
    }

</style>