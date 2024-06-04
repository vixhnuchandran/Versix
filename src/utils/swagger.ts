import swaggerUi from "swagger-ui-express"
import swaggerJsdoc from "swagger-jsdoc"
import { Express } from "express"
import { version } from "../../package.json"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "STORE API Docs",
      version: version ?? "1.0.0",
    },
    security: [
      {
        apiKeyAuth: [] as string[],
      },
    ],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
        },
      },
    },
    servers: [
      {
        url: "https://data.storybrain.io/api/store",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

const specs = swaggerJsdoc(options)

export default function setupSwagger(app: Express) {
  app.use("/store-docs", swaggerUi.serve, swaggerUi.setup(specs))
}
