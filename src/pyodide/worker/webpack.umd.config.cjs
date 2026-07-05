const path = require('path');
const webpack = require('webpack');

// Builds src/nagini.umd.js from src/nagini.js (single self-contained file:
// managers and utils are bundled, dynamic imports inlined)
module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../../nagini.js'),
  output: {
    filename: 'nagini.umd.js',
    path: path.resolve(__dirname, '../..'),
    globalObject: 'self',
    library: {
      name: 'Nagini',
      type: 'umd',
      export: 'Nagini',
    },
  },
  target: 'web',
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions']
                }
              }]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
  optimization: {
    minimize: false, // Keep readable for debugging
  },
};
