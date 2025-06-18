import webpack from "webpack";
import path from "path";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const SOURCE = path.join(__dirname, "src");
const DESTINATION = path.join(__dirname, "dist");
const ENV = process.env.NODE_ENV;
const isDebug = ENV === "development";
const mode = isDebug ? "development" : "production";

export default {
  context: __dirname,
  entry: {
    index: "./index.js",
  },
  mode: mode,
  output: {
    path: DESTINATION,
    publicPath: ".",
    filename: "[name].js",
    chunkFilename: "[name]-[chunkhash].js",
    libraryTarget: "umd",
  },
  performance: {
    hints: isDebug ? false : "warning",
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  module: {
    rules: [
      {
        test: SOURCE,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.dat$/,
        use: "binary-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: isDebug ? "inline-sourcemap" : false,
  optimization: {
    usedExports: true,
    sideEffects: false,
    minimize: !isDebug,
  },
  plugins: isDebug
    ? []
    : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
          reportFilename: "bundle-report.html",
        }),
      ],
};
