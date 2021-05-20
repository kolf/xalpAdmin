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
};

// 'component-background':'#0B223F'
