<template>
    <article class="fb__filter js__searchFilter" :class="isFilterShow ? 'active' : ''">
        <div class="fb__filter__wrapper">
            <div class="fb__filter__bg">
                <div class=fb__filter__top>
                    <h2 class="fb__filter__title">FILTER</h2>
                    <nav class="fb__filter__nav">
                        <!-- <button type="button" class="fb__filter__reset js__filter__reset">초기화</button> -->
                        <button type="button" class="fb__filter__apply">
                            <span>APPLY</span>
                        </button>
                    </nav>
                </div>

                <form class="fb__filter__form js__filter__form">
                    <fieldset>
                        <legend>상세 필터 선택 영역</legend>

                        <div class="fb__filter__cont">

                            <!-- WHERE TO WATCH -->
                            <section class="fb__filter__list fb__filter__providers" v-if="providers && providers.length">
                                <h3 class="fb__filter__name">WHERE TO WATCH</h3>
                
                                <div class="fb__filter__box">
                                    <div class="fb__filter__flex">
                                        <template v-for="(provider, index) in providers">
                                            <label class="providers__list" :key="`providers${index}`">
                                                <input type="radio" name="filterProvider" :value="provider.provider_id" checked>
                                                <figure class="providers__logo">
                                                    <img :src="`${baseImageUrl}${provider.logo_path}`" alt="">
                                                </figure>
                                                <span class="providers__name">{{ provider.provider_name }}</span>
                                            </label>
                                        </template>
                                    </div>
                                </div>
                            </section>

                            <!-- GENRES -->
                            <section class="fb__filter__list fb__filter__genre">
                                <h3 class="fb__filter__name">GENRES</h3>
                
                                <div class="fb__filter__box">
                                    <div class="fb__filter__flex">
                                        <template v-if="menus && menus.length">
                                            <label v-for="(menu, index) in menus" :key="index">
                                                <input type="checkbox" name="filterGenre" :value="menu.id">
                                                <span>{{ menu.name }}</span>
                                            </label>
                                        </template>
                                        <template v-else>
                                            <label v-for="(menu, index) in menus" :key="index">
                                            <input type="checkbox" name="filterGenre" value="all" checked>
                                                <span>전체</span>
                                            </label>
                                        </template>
                                    </div>
                                </div>
                            </section>
                        </div>
                        
                        
                    </fieldset>
                </form>
            </div>
            
            <button type="button" class="fb__filter__close" @click="isFilterShow = !isFilterShow">
                <span class="fb__title--hidden">닫기버튼</span>
            </button>
        </div>
    </article>
</template>

<script>
export default {
    data() {
        return {
            isFilterShow: false,
            menus: [],
            providers: null,
        }
    },

    created() {
        this.requestProviders();
        this.requestMenus();
    },

    methods: {
        async requestProviders() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/watch/providers/tv",
                    data: {
                        watch_region: "KR"
                    }
                })

                if (response) {
                    this.providers = response.results;
                }
            }

            catch(ex) {
                console.error(ex);
            }
        },

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
    }
}
</script>