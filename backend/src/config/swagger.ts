import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Barber API",
    version: "1.0.0",
    description: "API documentation for the Barber booking backend",
  },
  servers: [
    { url: "http://localhost:5180", description: "Local" },
    {
      url: process.env.PUBLIC_BASE_URL || "https://barber-backend-b77j.onrender.com",
      description: "Production",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const options = {
  // ✅ dôležité: swagger-jsdoc používa "definition"
  definition: swaggerDefinition,

  // ✅ lokálne TS, na Render buildnuté JS
  apis: [
    path.join(process.cwd(), "src/routes/**/*.ts"),
    path.join(process.cwd(), "dist/routes/**/*.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);