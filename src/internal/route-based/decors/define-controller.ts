import { RouteBasedReflectedKey } from "../types"

export type ControllerProps = {
    name?: string // will be used as route group
}

export function DefineController(props:ControllerProps) {
    return function (target: Function) {
        Reflect.set(target, RouteBasedReflectedKey.CONTROLLER_METADATA, props)
    }
}