import {
  FastifyInstance,
  FastifyError,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler(
    (
      error: FastifyError | AppError,
      request: FastifyRequest,
      reply: FastifyReply,
    ) => {
      request.log.error({ err: error }, "Request errored");

      if (error instanceof ZodError) {
        return reply.code(400).send({
          statusCode: 400,
          error: "Bad Request",
          message: "Validation failed",
          issues: error.issues,
        });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          const field = (error.meta?.target as string[])?.join(", ") ?? "field";
          return reply.code(409).send({
            statusCode: 409,
            error: "Conflict",
            message: `Duplicate value for ${field}`,
          });
        }
        if (error.code === "P2025") {
          return reply.code(404).send({
            statusCode: 404,
            error: "Not Found",
            message: "Record not found",
          });
        }
      }

      if (
        error.code?.startsWith("FAST_JWT") ||
        error.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED"
      ) {
        return reply.code(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid or expired token",
        });
      }

      const statusCode =
        (error as AppError).statusCode ?? error.statusCode ?? 500;

      if (statusCode < 500) {
        return reply.code(statusCode).send({
          statusCode,
          error: error.name || "Error",
          message: error.message,
        });
      }

      return reply.code(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Something went wrong",
      });
    },
  );
}
