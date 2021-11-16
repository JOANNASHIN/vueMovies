<template>
    <div class="fb__list" :class="detailActive == true ? 'detailOpen' : ''">
        <template v-if="false === fetches">
            <div class="fb__skeleton">
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
                            <!-- 썸네일 -->
                            <figure class="fb__list__thumb" @click="openDetailLayer($event, list)">
                                <img :src="`${baseImageUrl}${list.poster_path}`" alt="">
                                <!-- <div class="pie-chart pie-chart1"><span class="center">{{list.}}</span></div> -->
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
                            <template v-if="true === fromSearch">
                                No items were found that<br> 
                                match with your keyword.<br>
                                <!-- <br> -->
                                <!-- Please note that<br> spacing is also classified.<br> -->
                                <br>
                                Please try again with a different keyword. : )
                            </template>
                            <template v-else>
                                No items were found that<br> 
                                match with your filter.<br>

                                <br>
                                Please try again with a different filter. :)
                            </template>
                        </li>
                    </template>
                </ul>
            </div>
        </template>

        <template v-else-if="'error' === fetches">
            <p class="fb__error">
                An error has occurred.<br>
                Please try again later.
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
        fetches: {
            default: false,
            type: Boolean
        },

        listData: {
            default: [],
            type: Array
        },
        
        fromSearch: {
            default: false,
            type: Boolean
        },
    },

    data() {
        return {
            detailActive: false,
            detail: {},
            genres: [],
            targetId: null,
            listSlideObj: null
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
                    this.draw();
                })
            }
        },
    },

    mounted() {
    },

    methods: {
        draw() {
            // var i=1;

            // var func1 = setInterval(function(){
            //     if(i < 80){
            //         color1(i);
            //         i++;
            //     } else{
            //         clearInterval(func1);
            //     }
            // },10);


            // function color1(i, classname,colorname){
            //     const test = document.querySelector(".pie-chart1");
            //     test.style.background = `conic-gradient(red 0% ${i}%, #ffffff ${i}% 100%)`;
            // }
        },
      
        listSlider() {
            if (this.listSlideObj) {
                this.listSlideObj.destroy();
                this.listSlideObj = null;
            }
            this.listSlideObj = new Swiper(this.$refs.listSlider, {
                loop: false,
                slidesPerView: "auto",
                initialSlide: 0
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