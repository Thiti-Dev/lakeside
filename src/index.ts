import { Elysia } from "elysia";
import { initializeElysiaApp } from "./init";
import { addErrorInterceptor } from "./elysia-miscs/error-handler.elysia";
import { cors } from '@elysiajs/cors'

async function main() {
  const app = new Elysia().use(cors())
  addErrorInterceptor(app)
  await initializeElysiaApp(app)
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}


await main()