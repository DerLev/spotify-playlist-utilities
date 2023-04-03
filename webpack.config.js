import webpack from 'webpack'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const returnAbsolutePath = (path) => {
  const url = new URL(path, import.meta.url).toString()
  
  const removeFile = url.replace(/^file:\/\//, "")
  
  return removeFile.match(/^\/\w\:/) ?
    removeFile.substring(1, removeFile.length) :
    removeFile
}

export default {
  target: 'node18',
  mode: 'production',
  entry: './server/server.ts',
  module: {
    rules: [
      {
        test: /\.([cm]?ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.server.json'
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: returnAbsolutePath('dist-server'),
    module: true
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.NODE_ENV == 'development' ? 'static' : 'disabled',
      reportFilename: returnAbsolutePath('bundle-report.html')
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
}
