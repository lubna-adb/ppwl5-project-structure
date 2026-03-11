import type { User } from "../types/user.type";

export class UserModel {
  id: number;
  name: string;
  role: string;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
  }

  // Contoh transformasi / DTO mapping
  toDisplay() {
    return {
      id: this.id,
      name: this.name,
      role: this.role.toUpperCase(),
    };
  }
}