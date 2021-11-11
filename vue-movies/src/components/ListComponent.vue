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
    },

    methods: {
        listSlider() {
            new Swiper(this.$refs.listSlider, {
                loop: false,
                slidesPerView: "auto"
            })
        },

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

            //기본 상세 정보
            this.detail = detailData;

            //리스트에서 넘길 데이터
            Object.assign(this.detail, {
                mainPosterPath: data.poster_path,
                koreanOverview: data.overview,
            });

            //트레일러 영상
            if (videosData) {
                Object.assign(this.detail, {
                    trailerVideos: videosData.results
                });
            }

            //출연진
            if (creditData) {
                  Object.assign(this.detail, {
                    cast: creditData.cast
                });
            }
            
            this.$nextTick(() => {
                this.detailActive = true;
            })
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