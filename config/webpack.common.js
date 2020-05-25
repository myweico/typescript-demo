const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootPath = path.resolve(__dirname, '../');

module.exports = {
  entry: {
    index: path.resolve(rootPath, 'src/index')    // 入口文件
  },
  output: {
    filename: 'static/js/[name].[hash:8].bundle.js',       // 将文件放置到 static/js目录下，名字格式为[name].[hash:8].bundle.js
    chunkFilename: 'static/js/[name].[hash:8].bundle.js',  // 将 bunndle 文件也放置在 static/js 目录下
    path: path.resolve(rootPath, 'dist'),         // 打包文件存放的根目录
    publicPath: '/'                               // 引入文件的根目录
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,                          // js, jsx 文件使用的 loader
        use: ['babel-loader', 'eslint-loader'],
        exclude: /node_modules/                   // 不转化 node_modules 下的文件
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 自动生成引入 bundle 文件的 html
      template: path.resolve(rootPath, 'public/index.html'),  // 使用 public 下的 index 文件作为 html 模板
      favicon: path.resolve(rootPath, 'public/favicon.ico')   // 引入 图标
    }),
    new CleanWebpackPlugin() // 清除 dist 文件夹
  ],
  resolve: {
    alias: {
      '@': path.resolve(rootPath, 'src')                      // 设置 @ 为 src 的别名
    },
    extensions: ['.js', '.ts', '.tsx']                      // 没有扩展名的时候，尝试的扩展名
  }
};
