const isDevEnv = process.env.NODE_ENV === "development";
const config = {
  app: {
    domain: process.env.APP_DOMAIN,
    baseUrl: process.env.APP_BASE_URL,
  },
  api: {
    baseUrl: isDevEnv ? "http://114.67.250.8" : "http://114.67.250.8",
  },
  data: {
    dateFormat: "Do MMM YYYY",
    pagination: {
      perpage: 20,
    },
  },
};

export default config;
