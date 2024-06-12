const path = require("path");

module.exports = {
  entry: "./App.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/, // Add this rule if you also have JSX files
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
