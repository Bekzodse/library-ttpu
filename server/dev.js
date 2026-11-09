import { spawn } from "node:child_process";
import "./index.js";

const vite = spawn("npm", ["run", "dev:vite"], { stdio: "inherit", shell: true });
process.on("SIGINT", () => vite.kill("SIGINT"));
process.on("SIGTERM", () => vite.kill("SIGTERM"));
