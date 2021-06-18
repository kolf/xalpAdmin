const CracoLessPlugin = require("craco-less");
const darkTheme = require("antd/dist/dark-theme");
const theme = require("./theme");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { ...darkTheme, ...theme },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer: {
    proxy: {
      "/topark/auth": {
        target: "http://116.131.8.40:8888",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/topark": "" },
      },
      "/topark/api": {
        target: "http://116.131.8.38:8800",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/topark": "" },
      },
    },
  },
};
