const CracoLessPlugin = require("craco-less");
const darkTheme = require("antd/dist/dark-theme");
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: darkTheme,
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
