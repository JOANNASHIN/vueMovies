<template>
    <figure class="fb__loading" v-show="loading">
        <img src="/assets/images/common/loading.gif" alt="">
    </figure>
</template>

<script>
export default {
    name: "spinner",
    props: {
        loading: {
            default: false,
            type: Boolean
        }
    }
}
</script>

<style scoped lang="scss">
    .fb {
        &__loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0;
        }
    }
</style>