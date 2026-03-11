import type { UserModel } from "../models/user.model";

export const userView = (users: UserModel[]): string => {
  const items = users
    .map(
      (user) => `
      <div class="flex items-center justify-between bg-white border border-gray-200 rounded px-4 py-3">
        <span class="font-medium text-gray-800">${user.name} (${user.role})</span>
        <form method="POST" action="/delete/${user.id}">
          <button type="submit"
            class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium">
            Delete
          </button>
        </form>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>User Management</title>
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
<div class="bg-red-500 text-white p-4">
TEST TAILWIND
</div>
  <div class="max-w-2xl mx-auto">

    <h1 class="text-2xl font-bold text-blue-600 mb-6">User Management (Clean Structure)</h1>

    <!-- Form Create -->
    <form method="POST" action="/create" class="flex gap-2 mb-4">
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      />
      <input
        type="text"
        name="role"
        placeholder="Role"
        required
        class="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
      />
      <button
        type="submit"
        class="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Add
      </button>
    </form>

    <!-- User List -->
    <div class="flex flex-col gap-2">
      ${items.length > 0 ? items : `
      <div class="text-center text-gray-400 py-8">No users found. Add one above!</div>`}
    </div>

  </div>
</body>
</html>`;
};