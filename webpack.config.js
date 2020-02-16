const path = require('path');

module.exports = {
  entry: './src/brainjs/index.ts',
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'brain.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
