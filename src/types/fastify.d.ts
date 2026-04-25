import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string; // user id
      username: string;
      role: "ADMIN" | "USER";
    };
    user: {
      sub: string;
      username: string;
      role: "ADMIN" | "USER";
    };
  }
}
