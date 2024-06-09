const path = require("path");

module.exports = {
  // Other configuration options...

  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify")
    },
  },

  // Other configuration options...
};
