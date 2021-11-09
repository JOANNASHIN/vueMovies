<template>
    <div class="fb__list" :class="detailActive == true ? 'detailOpen' : ''">
        <template v-if="false === fetches">
            <div class="fb__skeleton fb__list">
                <ul class="fb__list__wrapper">
                    <li class="fb__list__item" v-for="(list, index) in 3" :key="index">
                        <div class="fb__list__thumb animate"></div>

                        <div class="fb__list__summary">
                            <!-- 프로그램명 -->
                            <strong class="fb__list__name animate"></strong>

                            <!-- 장르 -->
                            <p class="fb__list__genre animate"></p>

                            <!-- 요약 -->
                            <p class="fb__list__text animate"></p>
                            <p class="fb__list__text animate"></p>
                        </div>
                    </li>
                </ul>
            </div>
        </template>

        <template v-else-if="true === fetches">
            <div ref="listSlider" class="fb__list__slider swiper-container">
                <ul class="fb__list__wrapper swiper-wrapper">
                    <template v-if="listData && listData.length">
                        <li class="fb__list__item swiper-slide" v-for="(list, index) in listData" :key="index">
                            <figure class="fb__list__thumb" @click="openDetailLayer($event, list)">
                                <img :src="`https://image.tmdb.org/t/p/w500${list.poster_path}`" alt="">
                            </figure>

                            <div class="fb__list__summary">
                                <!-- 프로그램명 -->
                                <strong class="fb__list__name">
                                    {{ list.original_name }} <span v-show="list.name != list.original_name">[{{list.name}}]</span>
                                </strong>

                                <!-- 장르 -->
                                <p class="fb__list__genre">
                                    <span v-for="(id, index) in list.genre_ids" :key="`genre${index}`">
                                        {{genreName(id)}}
                                        <template v-if="index != list.genre_ids.length - 1">,&nbsp;</template>
                                    </span>
                                </p>

                                <!-- 기본정보 -->
                                <span class="fb__list__basic">
                                    <!-- 국가 -->
                                    <span v-for="(country, index) in list.origin_country" :key="`country${index}`">
                                        {{country}}&nbsp;&nbsp;|&nbsp;
                                    </span>

                                    <!-- 날짜 -->
                                    <span>{{list.first_air_date}}</span>
                                </span>

                                <!-- 요약 -->
                                <p class="fb__list__text">{{list.overview}}</p>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li class="fb__list__empty">
                            찾으시는 것이 없나요 ?<br />
                            띄어쓰기도 구분하니 참고 부탁드려요.<br />
                            다른단어로도 검색해보세요 !
                        </li>
                    </template>
                </ul>
            </div>
        </template>

        <template v-else-if="'error' === fetches">
            <p class="fb__error">
                오류가 발생하였습니다.<br>
                잠시 후 다시 시도해주세요.
            </p>
        </template>
        <detail-layer :detailId="detail.id" :detail="detail" :detailActive="detailActive" @closeDetailLayer="closeDetailLayer($event)"></detail-layer>
    </div>
</template>

<script>
import Swiper from "swiper";
import DetailLayer from "./DetailLayer.vue";

export default {
    name: "ListComponent",
    components: {
        DetailLayer
    },
    props: {
        listData: {
            default: [],
            type: Array
        },
        
        fetches: {
            default: false,
            type: Boolean
        }
    },

    data() {  
        return {
            detailActive: false,
            detail: {},
            genres: [],
            targetId: null
        }
    },

    created() {
        this.requestGenreName();
    },

    watch: {
        fetches(status) {   
            if (true === status) {
                this.$nextTick(() => {
                    this.listSlider();
                })
            }
        },

        // detailActive(open) {
        //     setTimeout(() => {
        //         if (false === open) {
        //             this.$refs.detailLayer.classList.remove("active")
        //         }
        //     }, 10)
        // }
    },

    methods: {
        listSlider() {
            new Swiper(this.$refs.listSlider, {
                loop: false,
                slidesPerView: "auto"
            })
        },

        // async requestTvDetail(list) {
        //     try {
        //         const response = await this.$store.dispatch("network/request", {
        //             method: "get",
        //             url: `/tv/${list.id}`,
        //         })
    
        //         if (response) {
        //             this.detail = response;
        //             this.detail.mainPosterPath = list.poster_path;
        //             this.detail.koreanOverview = list.overview;
        //         }
        //     }

        //     catch(error) {
        //         console.error("requestGenreName has exception..", error)
        //     }
        // },

        // async getTvCredits() {
        //     try {
        //         const response = await this.$store.dispatch("network/request", {
        //             method: "get",
        //             url: `/tv/${this.targetId}/credits`,
        //         })
                
        //         if (response) {
        //             Object.assign(this.detail, {
        //                 cast: response.cast
        //             });
        //         }
        //     }

        //     catch(ex) {
        //         console.error(ex);
        //     }
        // },

        // async getTvImages() {
        //     try {
        //         const response = await this.$store.dispatch("network/request", {
        //             method: "get",
        //             url: `/tv/${this.targetId}/images`,
        //             data: {}
        //         })

        //         if (response) {
        //             Object.assign(this.detail, {
        //                 images: response.results
        //             });
        //         }
        //     }

        //     catch(ex) {
        //         console.error(ex);
        //     }
        // },

        // async getTvTrailerVideos() {
        //     try {
        //         const response = await this.$store.dispatch("network/request", {
        //             method: "get",
        //             url: `/tv/${this.targetId}/videos`,
        //             data: {}
        //         })

        //         if (response) {
        //             console.log(response.results);
        //             Object.assign(this.detail, {
        //                 trailerVideos: response.results
        //             });
        //         }

        //         this.detailActive = true;
        //     }

        //     catch(ex) {
        //         console.error(ex);
        //     }
        // },

        requestTvDetail(list) {
            return new Promise( async(res, rej) => {
                try {
                    const response = await this.$store.dispatch("network/request", {
                        method: "get",
                        url: `/tv/${list.id}`,
                    })
        
                    res(response);
                }
    
                catch(error) {
                    console.error("requestGenreName has exception..", error)
                    rej(error)
                }
            });
        },

        getTvCredits() {
            return new Promise( async(res, rej) => {
                try {
                    const response = await this.$store.dispatch("network/request", {
                        method: "get",
                        url: `/tv/${this.targetId}/credits`,
                    })
                    
                    res(response);
                }

                catch(ex) {
                    console.error(ex);
                    rej(error)
                }
            });
        },

        getTvTrailerVideos() {
            return new Promise( async(res, rej) => {
                try {
                    const response = await this.$store.dispatch("network/request", {
                        method: "get",
                        url: `/tv/${this.targetId}/videos`,
                        data: {}
                    })

                    res(response);
                }

                catch(ex) {
                    console.error(ex);
                    rej(error)
                }
            });
        },

        async openDetailLayer(e, data) {
            this.targetId = data.id;
            
            const detailData = await this.requestTvDetail(data);
            const videosData = await this.getTvTrailerVideos();
            const creditData = await this.getTvCredits();

            this.detail = detailData;
            this.detail.mainPosterPath = data.poster_path;
            this.detail.koreanOverview = data.overview;

            if (videosData) {
                Object.assign(this.detail, {
                    trailerVideos: videosData.results
                });
            }

            if (creditData) {
                  Object.assign(this.detail, {
                    cast: creditData.cast
                });
            }
            
            this.detailActive = true;
        },

        closeDetailLayer() {
            this.detailActive = false;
            this.detail = {};
        },

        async requestGenreName() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/genre/tv/list",
                })
    
                if (response) this.genres = response.genres;
            }
            catch(error) {
                console.error("requestGenreName has exception..", error)
            }
        },
        
        genreName(id) {
            const target = this.genres.find(v => {
                if (v.id == id) return v;
            })

            return target ? target["name"] : "";
        },

        
    },

}
</script>

<style lang="scss">
    .fb {
        &__list {
            display: block;
            overflow: hidden;
            position: relative;

            &.detailOpen {
                .swiper-slide-active {
                    .fb__list__summary {
                        display: none !important;
                    }

                    .fb__list__thumb { 
                        display: none;
                    }
                }
            }

            &__wrapper {
                white-space: nowrap;
            }

            &__item {
                display: inline-block;
                width: rem(300px);
                margin-left: rem(20px);

                &:last-child {
                    margin-right: rem(20px);
                }
                // width: 100%;
                // transform: scale(0.88);
                
                &.swiper-slide-active {
                    // transform: scale(1);
                    transition: all 0.6s ease-in;

                    .fb__list__summary {
                        display: block;
                    }

                    img {
                        height: rem(450px);

                    }
                }
            }

            &__empty {
                width: 100%;
                padding: rem(80px 0);
                @include fontcss($white, 200, rem(16px), 1.5);
                text-align: center;

                &:before {
                    content: "";
                    display: block;
                    width: rem(40px);
                    height: rem(40px);
                    margin: 0 auto rem(12px);
                    background: url("/assets/images/guide/ico-header-search-wh.svg") no-repeat center center / 100% auto;
                }
            }

            &__thumb {
                display: flex;
                align-items: center;
                width: 100%;
                height: rem(450px);
                border-radius: rem(20px);
                font-size: 0;

                img {
                    width: 100%;
                    height: rem(380px);
                    border-radius: rem(20px);
                    box-shadow: rem(8px 20px 20px) rgba(0, 0, 0, 0.3);

                        transition: all 0.25s ease-in-out;

                }
            }

            &__summary {
                display: none;
                padding: rem(0 12px);
                margin-top: rem(30px);
                white-space: normal;
            }

            &__name {
                display: block;
                margin-bottom: rem(8px);
                word-break: break-all;
                @include fontcss($bright, bold, rem(18px), 1.2);
                @include line(1);
            }

            &__genre,
            &__basic {
                display: block;
                margin-bottom: rem(8px);
                font-size: 0;

                span {
                    @include fontcss($medium, 200, rem(14px), 1.2);
                }
            }

            &__text {
                @include fontcss($medium, 200, rem(14px), 1.4);
                @include line(2);
            }

            &__overview {
                display: block;
                margin-top: rem(12px);
                @include fontcss($medium, 200, rem(13px), 1.4);

                &--korean {
                    font-size: rem(12px);
                }
            }
        }
    }
</style>