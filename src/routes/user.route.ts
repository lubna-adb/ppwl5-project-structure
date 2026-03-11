import { Elysia } from "elysia";
import { userService } from "../services/user.service";
import { userView } from "../views/user.view";
import { htmlResponse, redirect } from "../utils/response";

export const userRoutes = new Elysia()

  .get("/", () => {
    const users = userService.getAll();
    return htmlResponse(userView(users));
  })

  .post("/create", async ({ body }) => {
    const data = body as any;
    userService.create({ name: data.name, role: data.role });
    return redirect("/");
  })

  .post("/delete/:id", ({ params }) => {
    userService.delete(Number(params.id));
    return redirect("/");
  });
