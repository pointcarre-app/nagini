const path = require('path');

module.exports = {
  mode: 'production',
  entry: './worker.js',
  output: {
    filename: 'worker-dist.js',
    path: path.resolve(__dirname),
    globalObject: 'self', // Important for web workers
  },
  target: 'webworker', // Optimize for web worker environment
  resolve: {
    extensions: ['.js'],
    alias: {
      '@python': path.resolve(__dirname, '../python')
    }
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
      },
      {
        test: /\.py$/,
        type: 'asset/source', // Load Python files as raw text
      }
    ]
  },
  optimization: {
    minimize: false, // Keep readable for debugging
  }
}; 