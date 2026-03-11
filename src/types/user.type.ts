export type User = {
  id: number;
  name: string;
  role: string;
};

export type CreateUserDTO = {
  name: string;
  role: string;
};