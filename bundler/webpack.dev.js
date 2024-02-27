const { merge } = require("webpack-merge");
const commonConfiguration = require("./webpack.common");
const portFinderSync = require("portfinder-sync");

module.exports = merge(commonConfiguration, {
  mode: "development",
  devServer: {
    host: "0.0.0.0",
    port: portFinderSync.getPort(8080),
    static: {
      directory: "./dist",
      publicPath: "/",
      watch: true,
    },
    client: {
      overlay: true,
    },
    hot: true,
    open: true,
    compress: true,
    https: false,
    allowedHosts: "all",
  },
});
