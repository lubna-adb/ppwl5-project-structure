import { app } from "./app";
import { env } from "./config/env";
import { initDB } from "./config/db";

// Initialize database before starting server
initDB();

app.listen(env.PORT);

console.log(`🚀 Server running at http://localhost:${env.PORT}`);