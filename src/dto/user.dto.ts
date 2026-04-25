import { User } from "../generated/prisma/client";
import { UserResponse } from "../models/user.model";

export function toUserResponse(user: User): UserResponse {
  const { password, ...safe } = user;
  return safe;
}
