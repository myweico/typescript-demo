const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");
const common = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin"); // 压缩 css, 好像有没有也可以~

const rootPath = path.resolve(__dirname, "../");

module.exports = merge(common, {
  mode: "production", // 启动生产模式，使用webpack默认设置的生产模式的设定
  devtool: "none",
  module: {
    rules: [
      {
        // module.scss 或者 module.css 结尾的文件启动css module，并提取到单独的文件夹
        test: /\.module\.s?css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader // 提取到单独的文件
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                mode: "local",
                localIdentName: "[hash:base64:8]"
              }
            }
          },
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        // 除了module的scss或css文件，都不启动 css module 并且提取到单独的文件
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 2
            }
          },
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        // 图片的loader，小于10Kb就使用base64编码,否则则调用file-loader引入文件，文件名使用由内容哈希组成的文件
        test: /\.(png|jpe?g|gif)$/i,
        loader: "url-loader",
        options: {
          limit: 4096,
          name: "static/img/[hash:16].[ext]"
        }
      },
      {
        // 字体文件loader，小于4kb的字体使用base64格式引入，否则使用file-loader引入，字体文件名为内容哈希组成的文件
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 4096,
          name: "static/fonts/[hash:16].[ext]"
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production") // 将文件中的process.env.NODE_ENV 设置为 production，以优化某些库中的代码
    }),
    // 提取 css 到单独的文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash:8].css", // 将css文件都提取到 static/css 目录下
      chunkFilename: "static/css/[id].[hash:8].css"
    }),
    // 压缩 css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"), //用于优化\最小化 CSS 的 CSS处理器，默认为 cssnano
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true } }, //传递给 cssProcessor 的选项，默认为{}
      canPrint: true //布尔值，指示插件是否可以将消息打印到控制台，默认为 true
    })
  ]
});
