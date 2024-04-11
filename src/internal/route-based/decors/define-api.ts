import { RequestMethod, RouteBasedReflectedKey } from "../types"

export type ApiProps = {
    path: string, // will be used as route group
    method: RequestMethod,
    validationSchema?: {
        query?: any,
        param?: any,
        body?: any
    }
}

export function DefineApi(props:ApiProps) {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        Reflect.set(target[methodName], RouteBasedReflectedKey.API_METADATA, props)
    }
}