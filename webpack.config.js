const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
    },
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
