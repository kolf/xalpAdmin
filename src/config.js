const isDevEnv = process.env.NODE_ENV === "development";
const config = {
  app: {
    code: "ENTERPARKnL4gX4cG8tJ2zW4r",
    domain: process.env.APP_DOMAIN,
    redirectDomain: "",
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
