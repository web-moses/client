const path = require ('path');

// dev, build
const {WEBPACK_ENV} = process.env;

const mode = WEBPACK_ENV === 'dev' ? 'development' : 'production';
const isDev = WEBPACK_ENV === 'dev';

module.exports = {
  entry: './src/index.tsx',

  output: {
    library: 'WebMoses',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  mode,
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  // dev server
  ...(isDev
    ? {
        devServer: {
          contentBase: path.join (__dirname, 'demo'),
          port: 9000,
        },
      }
    : {}),
};
