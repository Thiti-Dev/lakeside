import { DefineApi, DefineController } from "../../../../internal";
import type {Context, RouteSchema, SingletonBase} from 'elysia'
import  {t} from 'elysia'
import { extractPrismaInstanceFromElysiaStore } from "../../../../utils/elysia/prisma.utils";
import { CreateEnvelopInput } from "../../types/envelops.input";
import snakecaseKeys from "snakecase-keys"
import Stream from "@elysiajs/stream";
import { ENVELOP_EVENTS, EnvelopEventSource, createEnvelopStream } from "../../events/envelops.events";
import { randomUUID } from "crypto";
@DefineController({name: "envelops"})
export default class EnvelopController{
    @DefineApi({path:"/create",method:"POST",validationSchema:{
        body: t.Object<Record<keyof CreateEnvelopInput, any>>({
            message: t.String({minLength:2}),
            from_who: t.String(),
            pos_x: t.Number(),
            pos_y: t.Number()
        })
    }})
    public async createEnvelop(props:Context){
        const {store,body} = props
        const prisma = extractPrismaInstanceFromElysiaStore(store)!
        const {from_who,message,pos_x,pos_y} = (body as CreateEnvelopInput)
        const envelop = await prisma.envelop.create({
          data: {
            fromWho: from_who,
            message,
            posX: pos_x,
            posY: pos_y
          },
        })
        EnvelopEventSource.emit(ENVELOP_EVENTS.BROADCAST_ENVELOP, envelop)
        return snakecaseKeys(envelop)
    }

    @DefineApi({path:"/",method:"GET"})
    public async getEnvelops(props:Context){
        const {store} = props
        const prisma = extractPrismaInstanceFromElysiaStore(store)!
        const envelops = await prisma.envelop.findMany()
        return snakecaseKeys(envelops)
    }

    @DefineApi({path:"/subscribe",method:"GET"})
    public async subscribeToEnvelops(props:Context){
        const {request} = props
        return createEnvelopStream(request)
    }
}