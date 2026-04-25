import { FastifyInstance } from "fastify";
import { userRepository } from "../repositories/user.repository";
import { hashPassword, verifyPassword } from "../utils/password";
import { toUserResponse } from "../dto/user.dto";
import { RegisterInput, LoginInput } from "../models/user.model";

export const authService = {
  async register(input: RegisterInput) {
    const existingEmail = await userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw Object.assign(new Error("Email already in use"), {
        statusCode: 409,
      });
    }

    const existingUsername = await userRepository.findByUsername(
      input.username,
    );
    if (existingUsername) {
      throw Object.assign(new Error("Username already taken"), {
        statusCode: 409,
      });
    }

    const hashed = await hashPassword(input.password);
    const user = await userRepository.create({
      fullName: input.fullName,
      username: input.username,
      email: input.email,
      password: hashed,
    });

    return toUserResponse(user);
  },

  async login(app: FastifyInstance, input: LoginInput) {
    const user = await userRepository.findByIdentifier(input.identifier);
    if (!user) {
      throw Object.assign(new Error("Invalid credentials"), {
        statusCode: 401,
      });
    }

    const ok = await verifyPassword(input.password, user.password);
    if (!ok) {
      throw Object.assign(new Error("Invalid credentials"), {
        statusCode: 401,
      });
    }

    const token = app.jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return { token, user: toUserResponse(user) };
  },

  async getSession(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    return toUserResponse(user);
  },
};
