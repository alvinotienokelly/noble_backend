const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API Documentation", // Title of the API
    version: "1.0.0", // Version of the API
    description: "This is the API documentation for the project.", // Description of the API
  },
  servers: [
    {
      url: "http://localhost:3030", // Replace with your server URL
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./Routes/*.js"], // Path to the API docs (adjust based on your project structure)
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
