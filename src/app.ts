import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { env } from "./config/env";
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";
import { healthRoutes } from "./routes/health.route";
import { registerErrorHandler } from "./middlewares/error.middleware";
import { authPlugin } from "./middlewares/auth.middleware";
import { chatRoutes } from "./routes/chat.route";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.APP_ENV === "production" ? "info" : "debug",
      transport:
        env.APP_ENV === "development"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerErrorHandler(app);

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });

  await app.register(authPlugin);

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Narabuna API",
        description: "API documentation for Narabuna",
        version: "1.0.0",
      },
      servers: [{ url: `http://localhost:${env.PORT}` }, { url: 'https://hackfest.iccn.or.id' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  app.get("/", async () => ({
    name: "Narabuna API",
    env: env.APP_ENV,
    docs: "/docs",
  }));

  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: "/auth" });
  await app.register(userRoutes, { prefix: "/users" });
  await app.register(chatRoutes, { prefix: "/chat" });

  return app;
}
