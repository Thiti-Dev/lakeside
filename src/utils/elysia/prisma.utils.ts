import { PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";
import { SingletonBase } from "elysia";

export function extractPrismaInstanceFromElysiaStore(store: SingletonBase['store']): PrismaClient<PrismaClientOptions, never, DefaultArgs> | null{
    return store.prisma as PrismaClient<PrismaClientOptions, never, DefaultArgs>  ?? null
}