import "@fastify/jwt";
import { FastifyRequest, FastifyReply } from "fastify";
import { Role } from "../generated/prisma/enums";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      username: string;
      role: Role;
    };
    user: {
      sub: string;
      username: string;
      role: Role;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    requireAdmin: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
