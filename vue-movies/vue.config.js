const path = require("path");

module.exports = {
    lintOnSave: false,

    css: {
        loaderOptions: {
            scss: {
                data: `@import "~@/styles/app.scss";`,
            }
        }
    },

    configureWebpack: {
        module: {
            rules: [
                {
                  test: /\.(png|jpg|gif|jpeg|svg)$/i,
                  use: [
                    {
                      loader: 'file-loader',
                      options: {
                        limit: -1,
                        name: '/images/[name].[ext]'
                      },
                    },
                  ],
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                        options: {
                          limit: -1,
                          name: '/font/[name].[ext]'
                        },
                      },
                    ],
                  },
            ],
        }
    }
}