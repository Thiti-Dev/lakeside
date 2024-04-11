import { DefineApi, DefineController } from "../../../../internal";
import type {RouteSchema, SingletonBase} from 'elysia'
import  {t} from 'elysia'
import { extractPrismaInstanceFromElysiaStore } from "../../../../utils/elysia/prisma.utils";
import { CreateEnvelopInput } from "../../types/envelops.input";
import snakecaseKeys from "snakecase-keys"
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
    public async createEnvelop(props:RouteSchema & SingletonBase){
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
        return snakecaseKeys(envelop)
    }

    @DefineApi({path:"/",method:"GET"})
    public async getEnvelops(props:RouteSchema & SingletonBase){
        const {store} = props
        const prisma = extractPrismaInstanceFromElysiaStore(store)!
        const envelops = await prisma.envelop.findMany()
        return snakecaseKeys(envelops)
    }
}