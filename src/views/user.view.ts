import { UserModel } from "../models/user.model";

export const userView = (users: UserModel[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>User Management</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 p-10">

<div class="max-w-3xl mx-auto">

<h1 class="text-3xl font-bold text-blue-600 mb-6">
User Management (Clean Structure)
</h1>

<form method="POST" action="/create" class="flex gap-3 mb-6">

<input 
name="name" 
placeholder="Name"
class="border p-2 rounded w-full"
/>

<input 
name="role" 
placeholder="Role"
class="border p-2 rounded w-full"
/>

<button class="bg-blue-600 text-white px-5 py-2 rounded">
Add
</button>

</form>

<div class="space-y-3">

${
users.length === 0
? `<div class="text-center text-gray-400">
No users found. Add one above!
</div>`
: users.map(user => `
<div class="flex justify-between items-center bg-gray-100 p-4 rounded">

<span class="font-medium">
${user.name} (${user.role})
</span>

<form method="POST" action="/delete/${user.id}">
<button class="bg-red-500 text-white px-3 py-1 rounded">
Delete
</button>
</form>

</div>
`).join("")
}

</div>

</div>

</body>
</html>
`;