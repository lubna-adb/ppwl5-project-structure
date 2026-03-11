import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { env } from "./src/config/env";
import { db, initDB } from "./src/config/db";

/* =========================
   TYPES (Issue: Langsung di index)
   Tugas: 
    1. Pindahkan ke file khusus (user.type), dalam folder yang sesuai 
    2. gunakan export interface ...
    3. jadika id opsional -> id?: number
   ========================= */
interface User {
  id: number;
  name: string;
  role: string;
}

/* =========================
   MODEL (Issue: Langsung di index)
   Tugas:
    1. Pindahkan ke file khusus (user.model), dalam folder yang sesuai 
    2. gunakan export class ...
    3. Property id jadikan opsional
========================= */
class UserModel implements User {
  id: number;
  name: string;
  role: string;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.role = data.role;
  }

  get displayName() {
    return `${this.name} (${this.role})`;
  }
}

/* =========================
   REPOSITORY (SQLite)
   Tugas:
    1. Pindahkan ke file khusus (user.repository), dalam folder yang sesuai
    2. gunakan export const ...
    3. tambahkan delete(id: number) dengan query "DELETE FROM users WHERE id = ?"
========================= */
const userRepository = {
  findAll(): UserModel[] {
    const rows = db.query("SELECT id, name, role FROM users").all() as User[];

    return rows.map(user => new UserModel(user));
  },
  create(user: User) {
    db.query("INSERT INTO users (name, role) VALUES (?, ?)")
      .run(user.name, user.role);
  },

  update(id: number, user: User) {
    db.query("UPDATE users SET name = ?, role = ? WHERE id = ?")
      .run(user.name, user.role, id);
  }
};

/* =========================
   SERVICE
   Tugas:
   1. pindahkan ke file khusus (user.service), dalam folder yang sesuai
   2. import user.repository, user.model, & user.type
   3. tambahkan delete(id: number) yang memanggil delete() dari userRepository
========================= */
const userService = {
  getAllUsers(): UserModel[] {
    return userRepository.findAll();
  },

  create(user: User) {
    if (!user.name || !user.role) {
      throw new Error("Name and role required");
    }
    userRepository.create(user);
  },

  update(id: number, user: User) {
    userRepository.update(id, user);
  }
};

/* =========================
   VIEW (SSR)
   Tugas:
    1. Letakkan di file khusus, dalam folder yang sesuai
    2. Build Tailwind ke style.css, pastikan path benar.
    3. Import UserModel
    3. Ganti elemen dalam <body> jadi:
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-blue-600 mb-6">
        User Management (Clean Structure)
      </h1>

      <form method="POST" action="/create" class="mb-6 flex gap-2">
        <input name="name" placeholder="Name" class="border p-2 rounded w-full"/>
        <input name="role" placeholder="Role" class="border p-2 rounded w-full"/>
        <button class="bg-blue-500 text-white px-4 rounded">Add</button>
      </form>

      <div class="grid gap-4">
        ${users.map(user => `
          <div class="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <p class="font-semibold">${user.displayName}</p>
            </div>
            <div class="flex gap-2">
              <form method="POST" action="/delete/${user.id}">
                <button class="bg-red-500 text-white px-3 rounded">Delete</button>
              </form>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
========================= */
const userView = (users: UserModel[]) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>User List</title>
  <link href="/css/style.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen p-10">

  <div class="max-w-3xl mx-auto">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">
      User Management (SQLite + SSR)
    </h1>

    <div class="grid gap-4">
      ${users.map(user => `
        <div class="bg-white shadow-md rounded-xl p-4">
          <h2 class="text-lg font-semibold">${user.displayName}</h2>
          <p class="text-sm text-gray-500">ID: ${user.id}</p>
        </div>
      `).join("")}
    </div>
  </div>

</body>
</html>
`;

/* =========================
   UTILS
   Tugas:
    1. Letakkan di file khusus (response.ts), dalam folder yang sesuai
    2. Gunakan export const ...
========================= */
const htmlResponse = (html: string, status = 200) => {
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html"
    }
  });
};

const redirect = (url: string) => 
  new Response(null, {
    status: 302,
    headers: { Location: url }
  });

/* =========================
   ROUTE + APP + SERVER
   Tugas:
    1. Pisahkan jadi file `user.route.ts`, `app.ts`, & `server.ts`
    
    # User Route
    2. user.route.ts menjalankan elysia `const userRoutes = new Elysia()`
    3. Gunakan kode ini di user.route.ts (import user.service, user.view, & response.ts):
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
        // jalankan return redirect ke root
      });

    # App
    4. app.ts menjalankan `const app = new Elysia().use(userRoutes);` (jangan lupa export app)
    
    # Server
    3. Fungsi initDB diletakkan dalam config/db.ts
    4. server.ts mengimport app, env, & initDB
    5. server.ts menjalankan `app.listen(env.PORT)`, initDB(), & console.log(`🚀 Server running ...`)
========================= */

const app = new Elysia()
  .use( // agarr css dapat dipanggil lewat SSR
    staticPlugin({
      assets: "public",
      prefix: "/"
    })
  )
  .get("/", () => {
    try {
      const users = userService.getAllUsers();
      return htmlResponse(userView(users));
    } catch (error) {
      return htmlResponse("<h1>Database Error</h1>", 500);
    }
  });

console.log("Running in:", env.NODE_ENV);

app.listen(env.PORT);

console.log(`🚀 Server running at http://localhost:${env.PORT}`);

initDB();


/* =========================
   Struktur Folder final harus seperti ini:
    src/
    │
    ├── app.ts
    ├── server.ts -> (entry point)
    ├── config/
    │   └── db.ts
    │   └── env.ts 
    ├── routes/
    │   └── user.route.ts -> (/create, /update, /delete)
    ├── services/
    │   └── user.service.ts -> (business logic)
    ├── repositories/
    │   └── user.repository.ts -> (query DB)
    ├── models/ -> (Object Relational Model)
    │   └── user.model.ts
    ├── types/ -> (Tailwind data types)
    │   └── user.type.ts
    ├── views/ -> (Server-Size Rendering)
    │ └── user.view.ts
    └── utils/ -> (Fungsi repetitif)
        └── response.ts
    public/
    └── css/
========================= */