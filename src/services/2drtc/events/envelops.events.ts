import Stream from '@elysiajs/stream'
import { Envelop } from '@prisma/client'
import { randomUUID } from 'crypto'
import EventEmiiter from 'eventemitter3'

export const ENVELOP_EVENTS = {
    ADD_SUBSCRIBER: "ADD_SUBSCRIBER",
    REMOVE_SUBSCRIBER: "REMOVE_SUBSCRIBER",
    BROADCAST_ENVELOP: "BROADCAST_EVELOP"
}

const envelopSSESubscribers: Record<string, Stream<string | number | boolean | object>> = {}

var EnvelopEventSource = new EventEmiiter()

export function createEnvelopStream(req:Request){
    const uuid = randomUUID()
    const st = new Stream(async (stream) => {
        // registering stream to subscription
        stream.send({newly_added_envelop: null}) // initial
        EnvelopEventSource.emit(ENVELOP_EVENTS.ADD_SUBSCRIBER, uuid,stream)
    })
    req.signal.addEventListener("abort", () => {
        EnvelopEventSource.emit(ENVELOP_EVENTS.REMOVE_SUBSCRIBER, uuid)
    })
    return st
}

EnvelopEventSource.on(ENVELOP_EVENTS.ADD_SUBSCRIBER, (uuid: string,stream: Stream<string | number | boolean | object>) => {
    envelopSSESubscribers[uuid] = stream // add stream to subscription-list
})

EnvelopEventSource.on(ENVELOP_EVENTS.BROADCAST_ENVELOP, (envelop: Envelop) => {
    for(const [_,stream] of Object.entries(envelopSSESubscribers)){
        stream.send({newly_added_envelop: envelop})
    }
})

EnvelopEventSource.on(ENVELOP_EVENTS.REMOVE_SUBSCRIBER, (uuid:string) => {
    delete envelopSSESubscribers[uuid]
})

export {
    EnvelopEventSource
}