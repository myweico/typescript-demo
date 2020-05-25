const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");

const common = require("./webpack.common");

const rootPath = path.resolve(__dirname, "../");

module.exports = merge(common, {
  mode: "development", // 设置为开发模式，使用 webpack 内置专为开发配置的设置
  devtool: "cheap-source-map",
  module: {
    rules: [
      {
        // 对于module。scss或者 module.css后缀的文件，开启 css 模块化，并设定指定生成class的格式
        test: /\.module\.s?css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: {
                mode: "local",
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        // 除了带有module结尾的scss文件或者css文件，不使用css模块化，否则将会导致antd的样式失效
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "url-loader",
        options: {
          limit: 4096, // 小于 10kb 的图片转化为 url 数据引入，否则调用 file-loader 引入文件
          name: "static/img/[path][name].[ext]", // 图片放置在 static/img 目录下
        },
      },
      {
        test: /\.(svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 4096, // 与图片loader类似
          name: "static/fonts/[path][name].[ext]", // 字体文件放置在 static/fonts 文件下
        },
      },
    ],
  },

  devServer: {
    contentBase: path.resolve(rootPath, "dist"), // 服务器的根目录
    compress: true, // 启用 gzip 压缩
    overlay: true, // 错误在浮层显示
    open: true, // 服务器开启后，自动在浏览器打开
    hot: true, // 启用热加载
    host: "0.0.0.0", // 服务启动的ip，可以让在局域网内的用户都可以访问
    port: 9000, // 开启的端口
    proxy: [
      // 代理配置
      {
        context: "/api/geoskincare/",
        target: "http://47.96.113.94:1131",
        // target: 'https://storeservice.zero-w.cn', // 转发到url
        changeOrigin: true, // 是否改变转发的域名
        secure: false, // 关闭安全的设定
      },
      {
        context: [
          "/api/v2",
          "/api/v3",
          "/api/orderproduct",
          "/api/member",
          "/api/user",
          "/api/channel",
          "/api/store2",
          "/api/white",
          "/api/taobao",
          "/api/tool",
          "/api/brand",
          "/api/order",
        ],
        // store-service-php
        // target: 'http://47.96.113.94:10010',
        // target: 'http://47.96.113.94:11300',
        target: "http://127.0.0.1:9502",
        // target: 'https://storeservice.zero-w.cn', // 转发到url
        changeOrigin: true, // 是否改变转发的域名
        secure: false, // 关闭安全的设定
      },
      {
        context: ["/api/store_access", "/api/storeAccess"],
        target: "http://localhost:9507",
      },
      {
        context: "/api",
        // store-service-go
        target: "http://47.96.113.94:11299", // 测试服的 Go
        changeOrigin: true, // 是否改变转发的域名
        secure: false, // 关闭安全的设定
      },
    ],
    historyApiFallback: true, // 404的时候重定向回 index.html
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],
});
