import { Elysia } from "elysia";
import { initializeElysiaApp } from "./init";
import { addErrorInterceptor } from "./elysia-miscs/error-handler.elysia";

async function main() {
  const app = new Elysia()
  addErrorInterceptor(app)
  await initializeElysiaApp(app)
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}


await main()