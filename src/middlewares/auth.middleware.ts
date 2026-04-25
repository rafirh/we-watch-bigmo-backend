import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";

export async function authPlugin(app: FastifyInstance) {
  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.code(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid or missing token",
        });
      }
    },
  );

  app.decorate(
    "requireAdmin",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (request.user?.role !== "ADMIN") {
        return reply.code(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Admin access required",
        });
      }
    },
  );
}

export default fp(authPlugin, { name: "auth-plugin" });
