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
            from_who: t.String()
        })
    }})
    public async createEnvelop(props:RouteSchema & SingletonBase){
        const {store,body} = props
        const prisma = extractPrismaInstanceFromElysiaStore(store)!
        const envelop = await prisma.envelop.create({
          data: {
            fromWho: (body as CreateEnvelopInput).from_who,
            message: (body as CreateEnvelopInput).message,
          },
        })
        return snakecaseKeys(envelop)
    }
}