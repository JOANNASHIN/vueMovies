// const path = require("path");

// module.exports = {
//     lintOnSave: false,

//     css: {
//         loaderOptions: {
//             scss: {
//                 data: `@import "~@/styles/app.scss";`,
//             }
//         }
//     },

//     configureWebpack: {
//         module: {
//             rules: [
//                 {
//                   test: /\.(png|jpg|gif|jpeg|svg)$/i,
//                   use: [
//                     {
//                       loader: 'file-loader',
//                     //   include: path.resolve(__dirname, '../'),
//                     //path::: src/assets/images/guide/test.svg
//                     // publicPath
//                       options: {
//                         limit: -1,
//                         // name: '[path][name].[ext]',
//                         // publicPath: '/',
//                         // outputPath: '/',
//                       },
//                     },
//                   ],
//                 },
//                 {
//                     test: /\.(eot|ttf|woff|woff2)$/i,
//                     use: [
//                       {
//                         loader: 'file-loader',
//                         options: {
//                           limit: -1,
//                           name: '/assets/font/[name].[ext]'
//                         },
//                       },
//                     ],
//                   },
//             ],
//         }
//     }
// }