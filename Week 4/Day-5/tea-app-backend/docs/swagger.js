// ./docs/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "API docs for my project",
    },
    servers: [
      {
        url: "http://localhost:3010",
      },
    ],
  },
  apis: ["./routes/*.js"], // scan route files for Swagger comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
