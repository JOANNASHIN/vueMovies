<template>
    <div ref="detailLayer" class="fb__detail" v-show="detail && detailActive">
        <figure class="fb__list__thumb" @click="closeDetailLayer()">
            <img :src="`https://image.tmdb.org/t/p/w500${detail.mainPosterPath}`" alt="">
        </figure>

        <div class="fb__list__summary">
            <strong class="fb__list__name">
                {{ detail.original_name }} <span v-show="detail.name != detail.original_name">[{{detail.name}}]</span>
            </strong>

            <!-- 장르 -->
            <p class="fb__list__genre">
                <span v-for="(genre, index) in detail.genres" :key="`genre${index}`">
                    {{genre.name}}
                    <template v-if="index != detail.genres.length - 1">,&nbsp;</template>
                </span>
            </p>
          
            <span class="fb__list__basic">
                <span v-for="(country, index) in detail.origin_country" :key="`country${index}`">
                    {{country}}&nbsp;&nbsp;|&nbsp;
                </span>
                <span>{{detail.first_air_date}}</span>
            </span>

            <dl class="fb__detail__section">
                <dt class="fb__detail__title">Story Overview</dt>
                <dd class="fb__list__overview">{{detail.koreanOverview}}</dd>
                <dd class="fb__list__overview">{{detail.overview}}</dd>
            </dl>

            <dl class="fb__detail__section">
                <dt class="fb__detail__title">Cast</dt>
                <dd>
                    <figure>
                        <img src="" alt="">
                    </figure>

                    <span>이름</span>
                </dd>
            </dl>

            <dl class="fb__detail__section">
                <dt class="fb__detail__title">Thumbnail</dt>
                <dd>
                    <figure>
                        <img src="" alt="">
                    </figure>
                </dd>
            </dl>

            <dl class="fb__detail__section fb__detail__video">
                <dt class="fb__detail__title">Trailers</dt>
                <dd class="video__wrapper">
                    <figure class="video__figure" v-for="(video, index) in detail.trailerVideos" :key="`video${index}`">
                        <iframe width="560" height="315" :src="`https://www.youtube.com/embed/${video.key}`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </figure>
                </dd>
            </dl>
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
                    //@todo
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

            &__section {
                margin-top: rem(24px);
            }

            &__title {
                display: block;
                margin-bottom: rem(12px);
                @include fontcss($white, 600, rem(20px), 1.5);
            }        

            &__cast {
                .video {
                    &__wrapper {
                        display: block;
                        overflow: auto;
                        white-space: nowrap;
                    }

                    &__figure {
                        display: inline-block;
                        vertical-align: top;

                        iframe {
                            width: rem(320px);
                            height: rem(180px);
                        }
                    }
                }
            }

            &__video {
                .video {
                    &__wrapper {
                        display: block;
                        overflow: auto;
                        margin: rem(0 -20px);
                        padding: rem(0 20px);
                        white-space: nowrap;

                        &::-webkit-scrollbar {
                            display: none;
                        }
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