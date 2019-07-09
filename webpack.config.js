const path = require("path");
let env = process.env.NODE_ENV;
const entryPath = path.join(__dirname, "src", "client.js");
const outputPath = path.join(__dirname, "dist");

const cfg = {
  target: "web",
  mode: "development",
  entry: entryPath,
  output: {
    path: outputPath,
    filename: "index.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.svelte/,
        loader: "svelte-loader",
        options: { format: "cjs", hydratable: true }
      }
    ]
  },
  watch: false,
  cache: false,
  performance: {
    hints: false
  },
  stats: {
    assets: false,
    colors: false,
    errors: true,
    errorDetails: true,
    hash: false
  }
};

module.exports = cfg;
