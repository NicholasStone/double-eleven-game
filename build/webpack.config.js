const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressPlugin = require('compression-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

const SOURCE_DIR = path.resolve(__dirname, '../src')
const DIST_DIR = path.resolve(__dirname, '../dist')

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: !isProd && 'cheap-source-map',
  entry: {
    app: path.resolve(__dirname, '../src/main.ts')
  },
  output: {
    filename: 'index.[contenthash:8].js',
    path: DIST_DIR
  },
  externals: {
    phaser: 'Phaser',
  },
  devServer: {
    inline: true,
    hot: true,
    stats: 'minimal',
    contentBase: DIST_DIR,
    overlay: true,
    watchOptions: {
      ignored: [
        DIST_DIR,
        path.resolve(__dirname, '../node_modules')
      ]
    }
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 5,
          sourceMap: false,
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        use: 'babel-loader',
        exclude: /node_module/
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ],
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]'),
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'double eleven game',
      cdn: {
        js: ['https://cdn.bootcdn.net/ajax/libs/phaser/3.54.0/phaser.min.js'],
        css: ['https://cdn.bootcdn.net/ajax/libs/modern-normalize/1.0.0/modern-normalize.min.css']
      },
      template: path.resolve(__dirname, '../index.html'),
      minify: true
    }),
    new CompressPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html)$/,
      threshold: 10000,
      deleteOriginalAssets: false,
      minRatio: 0.8
    })
  ]
}
