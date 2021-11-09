<template>
    <div ref="detailLayer" class="fb__detail" v-show="detail && detailActive">
        
        <div class="fb__detail__mainVisual">
            <button class="fb__detail__close" @click="closeDetailLayer()">close</button>

            <figure class="fb__list__thumb mainVisual__thumb swiper-item">
                <img :src="`https://image.tmdb.org/t/p/w500${detail.mainPosterPath}`" alt="">
            </figure>
        </div>

        <div class="fb__list__summary">
            <!-- NAME -->
            <strong class="fb__list__name">
                {{ detail.original_name }} <span v-show="detail.name != detail.original_name">[{{detail.name}}]</span>
            </strong>

            <!-- GENRE -->
            <p class="fb__list__genre">
                <span v-for="(genre, index) in detail.genres" :key="`genre${index}`">
                    {{genre.name}}
                    <template v-if="index != detail.genres.length - 1">,&nbsp;</template>
                </span>
            </p>
          
            <!-- BASIC INFORMATION -->
            <span class="fb__list__basic">
                <span v-for="(country, index) in detail.origin_country" :key="`country${index}`">
                    {{country}}&nbsp;&nbsp;|&nbsp;
                </span>
                <span>{{detail.first_air_date}}</span>
            </span>

            <!-- STORY OVERVIEW -->
            <dl class="fb__detail__section">
                <dt class="fb__detail__title">Story Overview</dt>
                <dd class="fb__list__overview">{{detail.overview}}</dd>
                <dd class="fb__list__overview fb__list__overview--korean">{{detail.koreanOverview}}</dd>
            </dl>

            <!-- Cast -->
            <template v-if="detail.cast && detail.cast.length">
                <dl class="fb__detail__section fb__detail__cast">
                    <dt class="fb__detail__title">Cast</dt>
                    <dd class="cast__cont">
                        <ul class="cast__list">
                            <li class="cast__card" v-for="(person, index) in detail.cast" :key="`cast${index}`">
                                <figure class="cast__card__thumb">
                                    <img :src="`https://image.tmdb.org/t/p/w500${person.profile_path}`" alt="">
                                </figure>

                                <span class="cast__card__name">{{ person.name }}</span>
                            </li>
                        </ul>
                    </dd>
                </dl>
            </template>

            <!-- TRAILER -->
            <template v-if="detail.trailerVideos && detail.trailerVideos.length">
                <dl class="fb__detail__section fb__detail__video">
                    <dt class="fb__detail__title">Trailers</dt>
                    <dd class="video__wrapper">
                        <figure class="video__figure" v-for="(video, index) in detail.trailerVideos" :key="`video${index}`">
                            <iframe width="560" height="315" :src="`https://www.youtube.com/embed/${video.key}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </figure>
                    </dd>
                </dl>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "DetailLayer",
    props: {
        detail: {
            default: null,
            type: Object
        },

        detailActive: {
            type: Boolean
        }
    },

    data() {
        return {
        }
    },

    watch: {
         detailActive(open) {
            setTimeout(() => {
                if (open) {
                    this.$refs.detailLayer.classList.add("active")
                } 
                else {
                    this.$refs.detailLayer.classList.remove("active")
                }
            }, 10)
        }
    },

    created() {
    },

    methods: {
        closeDetailLayer() {
            this.$emit("closeDetailLayer")
        },
    }
}
</script>

<style lang="scss">
    $layerAnimationTime: 0.4s;
    %scrollCss {
        overflow: auto;
        margin: rem(0 -20px);
        padding: rem(0 20px);
        white-space: nowrap;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .fb {
        &__detail {
            overflow-y: auto; 
            position: fixed;
            top: rem(-10px);
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            height: 100%;
            padding-bottom: rem(32px);
            transition: all $layerAnimationTime ease-in-out;
           
            &.active {
                top: 0;
                // background: $bright;
                background: $black;

                .fb__list__thumb {
                    width: 100%;
                    margin: 0;

                    border-top: {
                        left-radius: 0;
                        right-radius: 0;
                    }

                    transition: all $layerAnimationTime ease-in-out;

                    img {
                        border-top: {
                            left-radius: 0;
                            right-radius: 0;
                        }

                        transition: all $layerAnimationTime ease-in-out;
                    }
                }    
                
                .fb__detail__close {
                    opacity: 1;
                    transition: all 0.8s ease-in-out;
                }
            }
            
            .fb {
                &__list {
                    &__summary {
                        display: block;
                        padding: rem(0 20px);
                        // padding-left: rem(24px);
                    }

                    &__name {
                        @include line(0);
                    }

                    &__thumb {
                        width: rem(300px);
                        height: auto;
                        // margin: rem(80px 0 0 12px);
                        margin: rem(180px 0 0 12px);

                        img {
                            height: auto;
                        }
                    }
                }
            }
         
            &__close {
                position: absolute;
                top: rem(20px);
                right: rem(20px);
                width: rem(30px);
                height: rem(30px);
                background: rgba(255, 255, 255, 0.4) url("/assets/images/guide/ico-header-close-white.svg") no-repeat center center / rem(15px 15px);
                border-radius: 50%;
                font-size: 0;
                opacity: 0;
            }

            &__section {
                margin-top: rem(24px);
            }

            &__title {
                display: block;
                margin-bottom: rem(12px);
                @include fontcss($white, 600, rem(20px), 1.5);
            }        

            &__cast {
                .cast {
                    &__list {
                        @extend %scrollCss;
                    }

                    &__card {
                        display: inline-block;
                        width: rem(120px);
                        margin-right: rem(20px);
                        vertical-align: top;

                        &:last-child {
                            margin-right: 0;
                        }

                        &__thumb {
                            
                            img {
                                overflow: hidden;
                                border-radius: rem(6px);
                            }
                        }

                        &__name {
                            display: block;
                            margin-top: rem(4px);
                            @include fontcss($dark, 400, rem(12px), 1.5);
                            text-align: center;
                        }
                    }

                }
            }

            &__video {
                .video {
                    &__wrapper {
                        @extend %scrollCss;
                    }

                    &__figure {
                        display: inline-block;
                        vertical-align: top;
                        margin-right: rem(12px);

                        &:last-child {
                            margin-right: 0;
                        }

                        iframe {
                            //208 117 176 99 192 108
                            width: rem(208px);
                            height: rem(117px);
                            border-radius: rem(6px);
                        }
                    }
                }
            }
        }
    }
</style>

this.$store.state