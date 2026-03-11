import { userRepository } from "../repositories/user.repository";
import { UserModel } from "../models/user.model";
import type { CreateUserDTO } from "../types/user.type";

export const userService = {
  getAll(): UserModel[] {
    return userRepository.findAll().map((u) => new UserModel(u));
  },

  create(data: CreateUserDTO): void {
    if (!data.name || data.name.trim() === "") {
      throw new Error("Name is required");
    }
    if (!data.role || data.role.trim() === "") {
      throw new Error("Role is required");
    }
    userRepository.create(data);
  },

  update(id: number, data: Partial<CreateUserDTO>): void {
    userRepository.update(id, data);
  },

  delete(id: number): void {
    userRepository.delete(id);
  },
};