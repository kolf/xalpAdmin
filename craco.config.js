const CracoLessPlugin = require("craco-less");
const darkTheme = require("antd/dist/dark-theme");
const theme = require("./theme");
console.log(darkTheme, "darkTheme");
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
      "/auth": {
        target: "http://114.67.250.8",
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://xalby-api.facevisitor.com",
        changeOrigin: true,
        secure: false,
        // pathRewrite: { "^/api": "" },
      },
    },
  },
};

// 'component-background':'#0B223F'
