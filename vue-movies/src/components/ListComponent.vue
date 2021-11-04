<template>
    <div class="fb__list" :class="detailActive == true ? 'detailOpen' : ''">
        <div class="fb__list__slider swiper-container js__list__slider">
            <ul class="fb__list__wrapper swiper-wrapper">
                <li class="fb__list__item swiper-slide" v-for="(list, index) in list" :key="index">
                    <a href="#" class="fb__list__link">
                        <figure class="fb__list__thumb" @click="openDetailLayer($event, 'active', list)">
                            <figcaption class="fb__title--hidden">{{ list.name }}</figcaption>
                            <img :src="`https://image.tmdb.org/t/p/w500${list.poster_path}`" alt="">
                        </figure>

                        <div class="fb__list__summary">
                            <strong class="fb__list__name">
                                {{ list.original_name }} <span v-show="list.name != list.original_name">[{{list.name}}]</span>
                            </strong>
                            <p class="fb__list__genre">
                                <span v-for="(genre, index) in list.genre_ids" :key="`genre${index}`">
                                    {{genre}}
                                </span>
                            </p>
                            <span class="fb__list__basic">국가, 년도 / 몇분짜리 / PG-18</span>
                        </div>
                    </a>
                </li>
            </ul>
        </div>

        <detail-layer :detail="detail" :detailActive="detailActive" @closeDetailLayer="closeDetailLayer($event)"></detail-layer>
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
        list: {
            default: [],
            type: Array
        }
    },

    data() {  
        return {
            detailActive: false,
            detail: {}
        }
    },

    mounted() {
        this.listSlider();
    },

    methods: {
        listSlider() {
            new Swiper(".js__list__slider", {
                loop: false,
                slidesPerView: "auto"
            })
        },

        openDetailLayer(e, type, data) {
            if (type == "active") this.detailActive = true;
            this.detail = data;   
        },

        closeDetailLayer() {
            this.detailActive = false;
            this.detail = {};
        }
    }
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

            &__item {
                width: rem(300px);
                margin-left: rem(20px);
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
            }

            &__name {
                display: block;
                margin-bottom: rem(8px);
                word-break: break-all;
                @include fontcss($black, bold, rem(18px), 1.2);
                @include line(1);
            }

            &__genre,
            &__basic {
                display: block;
                margin-bottom: rem(8px);
                @include fontcss($medium, 200, rem(14px), 1.2);
                @include line(1);
            }
        }
    }
</style>