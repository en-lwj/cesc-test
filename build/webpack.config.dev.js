const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const path = require('path');
const rootPath = path.resolve(__dirname, '../')
const getPathFromRoot = (...args) => {
  return path.resolve(rootPath, ...args)
}
const smp = new SpeedMeasurePlugin({
  // outputFormat: 'humanVerbose' // 产生人类可读输出的更详细的版本
});

const config = {
  entry: {
    'app': [
      getPathFromRoot('./src/app.js'),
    ]
  },
  resolve: {
    modules: [
      getPathFromRoot('./src'),
      'node_modules'
    ],
    alias: {
      '@':getPathFromRoot('./src'),
      services: getPathFromRoot('./src/services'),
      modules: getPathFromRoot('./src/modules'),
      components: getPathFromRoot('./src/components'),
      utils: getPathFromRoot('./src/utils'),
      lib: getPathFromRoot('./src/lib')
    }
  },
  output: {
    path: getPathFromRoot('./src'),
    publicPath: './', //TODO 填写生产环境静态文件路径
    filename: 'app.[hash:8].bundle.js',
    libraryTarget: 'umd', //类库加载方式
    umdNamedDefine: true
  },
  externals: {
    'vue': 'Vue',
  },
  module: {
    rules: [{
        test: /\.(s)?css$/,
        use: [
          'style-loader',
          getPathFromRoot('./build/loader/cssUrlLoader.js'),
          'css-loader',
          'postcss-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sourceMapContents: false
            }
          }
        ]
      },
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader'
      // },
      {
        test: /\.html$/,
        // exclude: getPathFromRoot('./src/index.html'),
        use: [{
          loader: getPathFromRoot('./build/loader/htmlRenderLoader.js'),
          options: {
            transformAssetUrls: {
              img: 'src'
            }
          }
        },
        'html-loader']
      },
      // {
      //   test: /\.html$/,
      //   exclude: getPathFromRoot('./src/index.html'),
      //   // loader: 'vue-template-loader',
      //   loader: 'vue-template-loader',
      //   options: {
      //     transformAssetUrls: {
      //       img: 'src'
      //     }
      //   }
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        // exclude: /css/,
        options: {
          limit: 8192,
          name: './_imgs/[name].[ext]',
          fallback: 'file-loader', // 指定当目标文件的大小超过limit选项中设置的限制时使用的什么laoder处理文件，默认使用file-loader
        }
      },
      {
        // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
        test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
        use: 'file-loader?name=./static/fonts/[name].[ext]',
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'RUNNING_ENV': JSON.stringify('dev'),
    }),
    new HtmlWebpackPlugin({
      filename: getPathFromRoot('./src/index.html'),
      template: getPathFromRoot('./src/index.html'),
    }),
  ],
  devtool: "cheap-source-map"
  // devtool: "cheap-module-source-map"
}


if(process.argv.includes('--report')) {
  // 观察模式--查看包大小
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = smp.wrap(config)