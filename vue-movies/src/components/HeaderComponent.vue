<template>
    <header class="fb__header">
        <!-- <router-link to="/">Home</router-link> -->

        <nav id="nav" class="fb__nav">
            <ul class="fb__nav__wrapper">
                <li class="fb__nav__menu" v-for="(menu, index) in menus" :key="index" :class="$route.params.id == menu.id ? 'active' : ''">
                    <router-link :to="`/detail/${menu.id}`">
                        <span>{{ menu.name }}</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            menus: []
        }
    },
    created() {
        this.requestMenus();
    },

    methods: {
        async requestMenus() {
            try {
                const response = await this.$store.dispatch("network/request", {
                    method: "get",
                    url: "/genre/movie/list",
                    data: {
                        language: "en-US"
                    }
                })

                if (response) this.menus = response.genres;
            }

            catch(ex) {
                console.error(ex);
            }
        }
    }
}
</script>

<style lang="scss">
    .fb {
        &__header {
        }

        &__nav {
            &__wrapper {
                width: 100%;
                @extend %scroll;
            }

            &__menu {
                display: inline-block;
                margin-right: rem(10px);
                @include fontcss($medium, 200, rem(20px), 1.5);

                &.active {
                    color: $black;
                    font-weight: bold;
                }
            }
        }


    }
</style>