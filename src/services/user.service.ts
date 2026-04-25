import { toUserResponse } from "../dto/user.dto";
import { userRepository } from "../repositories/user.repository";
import { UpdateMyProfileInput } from "../models/user.model";

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

  async getMeVisits(userId: string) {
    const user = await userRepository.findMeWithVisits(userId);
    if (!user) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    const { password, visits, ...safeUser } = user;
    return {
      user: safeUser,
      visits,
    };
  },

  async updateTodoStatus(todoId: string, userId: string, status: boolean) {
    const todo = await userRepository.updateTodoStatus(todoId, userId, status);
    if (!todo) {
      throw Object.assign(new Error("Todo not found"), { statusCode: 404 });
    }

    return todo;
  },

  async getVisitDetailById(visitId: string, userId: string) {
    const visit = await userRepository.findVisitDetailById(visitId, userId);
    if (!visit) {
      throw Object.assign(new Error("Visit not found"), { statusCode: 404 });
    }

    return visit;
  },

  async updateMyProfile(userId: string, input: UpdateMyProfileInput) {
    const currentUser = await userRepository.findById(userId);
    if (!currentUser) {
      throw Object.assign(new Error("User not found"), { statusCode: 404 });
    }

    if (input.username !== currentUser.username) {
      const usernameOwner = await userRepository.findByUsername(input.username);
      if (usernameOwner) {
        throw Object.assign(new Error("Username already taken"), {
          statusCode: 409,
        });
      }
    }

    const updatedUser = await userRepository.updateMyProfile(userId, {
      fullName: input.fullName,
      username: input.username,
    });

    return toUserResponse(updatedUser);
  },
};
