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
        target: "http://114.67.250.8",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/topark": "" },
      },
      "/topark/api": {
        target: "http://xalby-api.facevisitor.com",
        changeOrigin: true,
        secure: false,
        pathRewrite: { "^/topark": "" },
      },
    },
  },
};
