<template>
    <div ref="detailLayer" class="fb__detail" v-show="detail && detailActive">
        
        <div class="fb__detail__mainVisual">
            <button class="fb__detail__close" @click="closeDetailLayer()">close</button>

            <figure class="fb__list__thumb mainVisual__thumb swiper-item">
                <img :src="`${baseImageUrl}${detail.mainPosterPath}`" alt="">
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
                                    <img :src="`${baseImageUrl}${person.profile_path}`" alt="">
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
                            <iframe width="288" height="162" :src="`https://www.youtube.com/embed/${video.key}`" frameborder="0"  allow="fullscreen; autohide; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" controls allowfullscreen></iframe>
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