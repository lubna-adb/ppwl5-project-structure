import { db } from "../config/db";
import type { CreateUserDTO, User } from "../types/user.type";

export const userRepository = {
  findAll(): User[] {
    return db.query("SELECT id, name, role FROM users").all() as User[];
  },

  create(data: CreateUserDTO): void {
    db.run("INSERT INTO users (name, role) VALUES (?, ?)", [
      data.name,
      data.role,
    ]);
  },

  update(id: number, data: Partial<CreateUserDTO>): void {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.name !== undefined) {
      fields.push("name = ?");
      values.push(data.name);
    }
    if (data.role !== undefined) {
      fields.push("role = ?");
      values.push(data.role);
    }

    if (fields.length === 0) return;

    values.push(id);
    db.run(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  },

  delete(id: number): void {
    db.run("DELETE FROM users WHERE id = ?", [id]);
  },
};