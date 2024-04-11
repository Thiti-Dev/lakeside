import Elysia from "elysia";
import fs from 'fs'
import path from "path";
import { RouteBasedReflectedKey } from "./types";
import { ControllerProps } from "./decors/define-controller";
import { ApiProps } from "./decors/define-api";

export class RouteDescriptor{
    public static async start(app: Elysia){
        return new Promise(async (resolve,_) => {
            const SERVICE_PATH = "./src/services"
            const services = fs.readdirSync(SERVICE_PATH)
        
            for(const service of services){
                const isApiDirExisted = fs.existsSync(`${SERVICE_PATH}/${service}/api`)
                if(!isApiDirExisted) continue
    
                const controllers = fs.readdirSync(`${SERVICE_PATH}/${service}/api`)
    
                    
                for(const controller of controllers){
                    const isControllerExisted = fs.existsSync(`${SERVICE_PATH}/${service}/api/${controller}/controller.ts`)
                    if(!isControllerExisted) continue
    
                    let filePath = path.relative(__dirname, `${SERVICE_PATH}/${service}/api/${controller}/controller`);
                    const dynImp = await import(filePath)
                    if(!dynImp.default) continue // no default exportation found
                    const controllerMetadata = Reflect.get(dynImp.default, RouteBasedReflectedKey.CONTROLLER_METADATA) as ControllerProps
                    let controllerPrefix = controllerMetadata.name ?? controller
                    const functionNames = Reflect.ownKeys(dynImp.default.prototype).filter((n) => n!== 'constructor')
                    for(const func of functionNames){
                        const fn = dynImp.default.prototype[func]
                        const apiMetadata = Reflect.get(fn, RouteBasedReflectedKey.API_METADATA) as ApiProps
                        if(!apiMetadata) continue
                        const apiPath = apiMetadata.path.startsWith("/") ? apiMetadata.path.slice(1) : apiMetadata.path
                        const elysiaHook = {...(apiMetadata.validationSchema ?? {})}

                        const args = [`service/${service}/${controllerPrefix}/${apiPath}`, fn, elysiaHook] as Parameters<typeof app.get> // could be .get .post .any because they use the same args
                        const elysiaMethod = apiMetadata.method.toLowerCase() as "get" | "post" | "patch" | "put" | "delete"
                        // patching via dynamic method with casted type like -> app[method](...args) because of the type strictness from elysia won't allow union accessing key so we'd have to cast app to any
                        (app as any)[elysiaMethod](...args) // enforce  app.get(...args) | app.post(...args) | app.patch(...args) | app.put(...args) | app.delete(...args)
                    }
                }
    
            }
            resolve(true)
        })
    }
}