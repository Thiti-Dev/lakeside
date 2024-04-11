import Elysia from "elysia";
import type {ValidationError} from 'elysia'
import { RouteDescriptor } from "./internal/route-based/route-descriptor";
import { PrismaClient } from '@prisma/client'

export async function initializeElysiaApp(app: Elysia){
    const prisma = new PrismaClient()
    await prisma.$connect() // wait for prisma to connect

    app.state({prisma})

    await RouteDescriptor.start(app)
    app.listen(3000)
}