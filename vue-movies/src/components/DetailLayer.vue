<template>
    <div ref="detailLayer" class="fb__detail-layer" v-show="detail && detailActive">
        <figure class="fb__list__thumb" @click="closeDetailLayer()">
            <img :src="`https://image.tmdb.org/t/p/w500${detail.poster_path}`" alt="">
        </figure>

        <div class="fb__list__summary">
            <strong class="fb__list__name">
                {{ detail.original_name }} <span v-show="detail.name != detail.original_name">[{{detail.name}}]</span>
            </strong>
            <p class="fb__list__genre">
                <span v-for="(genre, index) in detail.genre_ids" :key="`genre${index}`">
                    {{genre}}
                </span>
            </p>
            <span class="fb__list__basic">국가, 년도 / 몇분짜리 / PG-18</span>
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

     watch: {
        detailActive(Boolean) {
            setTimeout(() => {
                if (Boolean) {
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
        }
    }
}
</script>

<style lang="scss">
    .fb {
        &__detail-layer {
            overflow-y: auto; 
            position: fixed;
            top: rem(-12px);
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            height: 100%;
            transition: all 0.4s ease-in-out;
           
            &.active {
                top: rem(-10px);
                padding-top: rem(10px);
                background: #f6f6f6;

                .fb__list__thumb {
                    width: 100%;
                    margin: 0;

                    border-top: {
                        left-radius: 0;
                        right-radius: 0;
                    }

                    transition: all 0.2s ease-in-out;

                    img {
                        border-top: {
                            left-radius: 0;
                            right-radius: 0;
                        }

                        transition: all 0.2s ease-in-out;
                    }

                }               
            }
            
            .fb {
                &__list {
                    &__summary {
                        display: block;
                        padding-left: rem(24px);
                    }

                    &__name {
                        @include line(0);
                    }

                    &__thumb {
                        width: rem(300px);
                        height: auto;
                        margin: rem(80px 0 0 12px);

                        img {
                            height: auto;
                        }
                    }
                }
            }
        }
    }
</style>