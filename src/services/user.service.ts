import { toUserResponse } from "../dto/user.dto";
import { userRepository } from "../repositories/user.repository";

export const userService = {
  async list(page = 1, pageSize = 50) {
    const skip = (page - 1) * pageSize;
    const [users, total] = await userRepository.findAll(skip, pageSize);
    return {
      data: users.map(toUserResponse),
      total,
    };
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }
    return toUserResponse(user);
  },

  async deleteById(id: string) {
    await userRepository.deleteById(id);
  },
};
