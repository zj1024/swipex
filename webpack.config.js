const os = require('os')
const path = require('path')
const webpack = require('webpack')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const PORT = 3000
const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
}
const { NODE_ENV = ENV.DEVELOPMENT } = process.env
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

function envHandler(type = ENV.DEVELOPMENT, callback = () => {}, isObj = false) {
  if (type === ENV.DEVELOPMENT) {
    if (NODE_ENV === ENV.DEVELOPMENT) {
      return callback
    } else {
      return isObj ? {} : () => {}
    }
  }
  if (type === ENV.PRODUCTION) {
    if (NODE_ENV === ENV.PRODUCTION) {
      return callback
    } else {
      return isObj ? {} : () => {}
    }
  }
}

/**
 * 获取本地ip地址
 * @return {string[]} [ 'localhost', '192.168.199.103' ]
 */
function getIPv4AddressList() {
  const networkInterfaces = os.networkInterfaces()
  let result = []

  Object.keys(networkInterfaces).forEach(key => {
    const ips = (networkInterfaces[key] || [])
      .filter(details => details.family === 'IPv4')
      .map(detail => detail.address.replace('127.0.0.1', 'localhost'))

    result = result.concat(ips)
  })

  return result
}

module.exports = {
  mode: NODE_ENV,
  entry: NODE_ENV === ENV.DEVELOPMENT ? './demo/index' : './src/index',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'SwipeX',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    quiet: true,
    port: PORT,
    compress: true,
    hot: true,
    open: false,
    overlay: true,
    progress: true,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.(js?|ts?)$/,
        include: [path.resolve(__dirname, './src')],
        exclude: /node_modules/,
        use: ['happypack/loader?id=babel'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    envHandler(
      ENV.DEVELOPMENT,
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './demo/index.html'),
      }),
    ),
    envHandler(
      ENV.DEVELOPMENT,
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: getIPv4AddressList().map(d => `> http://${d}:${PORT}`),
          notes: ['Some additional notes to be displayed upon successful compilation'],
        },
      }),
    ),
    new webpack.NamedModulesPlugin(),
    new HappyPack({
      id: 'babel',
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      ],
      threadPool: happyThreadPool,
    }),
  ],
}
