const isDevEnv = process.env.NODE_ENV === "development";
const config = {
  app: {
    domain: process.env.APP_DOMAIN,
    baseUrl: "/topark",
  },
  api: {
    baseUrl: "/topark",
  },
  data: {
    dateFormat: "Do MMM YYYY",
    pagination: {
      perpage: 20,
    },
  },
};

export default config;
