<template>
    <article class="fb__filter js__searchFilter" :class="isFilterShow ? 'active' : ''">
        <div class="fb__filter__wrapper">
            <form class="fb__filter__bg"  @submit.prevent="filterFormSubmit($event)">
                <div class=fb__filter__top>
                    <h2 class="fb__filter__title">FILTER</h2>
                    <nav class="fb__filter__nav">
                        <button type="button" class="fb__filter__reset" @click="resetFilter($event)">초기화</button>
                        <button type="submit" class="fb__filter__apply">
                            <span>APPLY</span>
                        </button>
                    </nav>
                </div>

                <div class="fb__filter__scroll">
                    <fieldset>
                        <legend>상세 필터 선택 영역</legend>

                        <div class="fb__filter__cont">
                            <!-- WHERE TO WATCH -->
                            <section class="fb__filter__section fb__filter__providers" v-if="providers && providers.length">
                                <h3 class="fb__filter__name">WHERE TO WATCH</h3>
                
                                <div class="fb__filter__box">
                                    <div class="fb__filter__flex">
                                        <template v-for="(provider, index) in providers">
                                            <label class="providers__list" :key="`providers${index}`">
                                                <input type="radio" v-model="filter.provider" :value="provider" :checked="provider.provider_id == 8 ? true : false">
                                                
                                                <figure class="providers__logo">
                                                    <img :src="`${baseImageUrl}${provider.logo_path}`" alt="">
                                                </figure>

                                                <div class="providers__info">
                                                    <span class="providers__name">{{ provider.provider_name }}</span>
                                                </div>
                                            </label>
                                        </template>
                                    </div>
                                </div>
                            </section>

                            <section class="fb__filter__section fb__filter__sort">
                                <h3 class="fb__filter__name">SORT BY</h3>
                
                                <div class="fb__filter__box">
                                    <select v-model="filter.sort_by">
                                        <option value="popularity.desc">Popularity</option>
                                        <option value="vote_average.desc">Rating</option>
                                        <option value="primary_release_date.desc">Release Date</option>
                                        <option value="title.asc">Title</option>
                                    </select>
                                </div>
                            </section>

                            <!-- GENRES -->
                            <section class="fb__filter__section fb__filter__genre">
                                <h3 class="fb__filter__name">GENRES</h3>
                
                                <div class="fb__filter__box">
                                    <div class="fb__filter__flex">
                                        <template v-if="genres && genres.length">
                                            <label v-for="(menu, index) in genres" :key="index">
                                                <input type="checkbox" v-model="filter.genres" :value="menu.id">
                                                <span>{{ menu.name }}</span>
                                            </label>
                                        </template>
                                        <template v-else>
                                            <label v-for="(menu, index) in genres" :key="index">
                                            <input type="checkbox" v-model="filter.genres" value="all" checked>
                                                <span>전체</span>
                                            </label>
                                        </template>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </fieldset>
                </div>
            </form>
            
            <button type="button" class="fb__filter__close" @click="isFilterShow = !isFilterShow">
                <span class="fb__title--hidden">닫기버튼</span>
            </button>
        </div>
    </article>
</template>

<script>
import eventBus from "../utils/bus";

export default {
    data() {
        return {
            requests: {
                with_genres: null,
                with_ott_providers: null,
                sort_by: null
            },

            filter: {
                provider: {},
                genres: [],
                sort_by: "popularity.desc"
            },

            genres: [],

            isFilterShow: false,

            providers: null,
        }
    },

    created() {
        eventBus.$on("filter:close", this.closeFilterLayer)
        this.requestFilterData();
    },

    methods: {
        findProvider(_id) {
            return this.providers.find(v => v.provider_id == _id)
        },

        requestProviders() {
            return new Promise( async(resolve, reject) => {
                try {
                    const response = await this.$store.dispatch("network/request", {
                        method: "get",
                        url: "/watch/providers/tv",
                        data: {
                            watch_region: "KR"
                        }
                    })
    
                    if (response) this.providers = response.results;

                    resolve(response.results)
                }
    
                catch(ex) {
                    reject(ex);
                }
            });
        },

        requestGenres() {
            return new Promise( async(resolve, reject) => {
                try {
                    const response = await this.$store.dispatch("network/request", {
                        method: "get",
                        url: "/genre/movie/list",
                    })
    
                    if (response) this.genres = response.genres;
                    resolve(response.genres)
                }
    
                catch(ex) {
                    reject(ex);
                }
            });
        },

        importData() {
            const _localStorage = JSON.parse(window.localStorage.getItem("filter"))

            if (_localStorage) {
                //장르
                this.filter.genres = _localStorage.with_genres.split("|");

                //제작사
                const _provider = this.findProvider(_localStorage.with_ott_providers);
                this.filter.provider = _provider;

                //정렬타입
                this.filter.sort_by = _localStorage.sort_by;
            }
        },

        async requestFilterData() {
            const detailData = await this.requestProviders();
            const videosData = await this.requestGenres();

            if (detailData && videosData) this.importData();
        },

        filterFormSubmit(e) {
            const _filter = this.filter;
            const parameter = this.requests;
            const provider = _filter.provider;

            const _genres = this.getMultiParams(_filter.genres);

            //validation
            if (!provider || Object.keys(provider).length == 0) {
                alert("Please select 'WHERE TO WATCH'.")

                return ;
            }

            Object.assign(parameter, {
                provider_name: provider.provider_name,
                with_ott_providers: provider.provider_id,
                with_genres: _genres,
                sort_by: _filter.sort_by
            })

            eventBus.$emit("filter:apply", parameter)
            this.isFilterShow = false;
        },

        resetFilter() {
            const _provider = this.findProvider(8); //넷플릭스

            this.filter = {
                provider: _provider,
                genres: [],
                sort_by: "popularity.desc"
            };
        },

        closeFilterLayer() {
            this.isFilterShow = false;
        }
    }
}
</script>