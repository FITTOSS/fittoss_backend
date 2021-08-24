/* eslint-disable import/no-extraneous-dependencies */
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "FITTOSS API",
      version: "1.0.0",
      description: "FITTOSS API with express",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./swagger/*", "./routers/*.js"],
};

const specs = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
