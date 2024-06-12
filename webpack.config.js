const path = require("path");

module.exports = {
  entry: "./App.tsx",
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
