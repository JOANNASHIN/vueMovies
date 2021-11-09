module.exports = {
    lintOnSave: false,

    css: {
        loaderOptions: {
            scss: {
                data: `@import "~@/styles/app.scss";`, //VUE CLI에서 @는 SRC 바라봄
            }
        }
    },
 
}