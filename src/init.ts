import Elysia from "elysia";
import type {ValidationError} from 'elysia'
import { RouteDescriptor } from "./internal/route-based/route-descriptor";
import { PrismaClient } from '@prisma/client'

export async function initializeElysiaApp(app: Elysia){
    const prisma = new PrismaClient()
    await prisma.$connect() // wait for prisma to connect

    app.get("/health", () => `i'm fine`) // will be deployed to render.com, this path will be triggered by cron-job.org to keep this 24/7 awake
    app.state({prisma})

    await RouteDescriptor.start(app)

    app.listen(process.env.PORT ?? 3000)
}