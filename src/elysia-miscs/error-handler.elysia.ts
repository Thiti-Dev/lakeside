import Elysia, { ValidationError } from "elysia";

export function addErrorInterceptor(app: Elysia){
    /* ------------------------ Validation error handler ------------------------ */
    app.onError(({ code, error }) => {
        if (code === 'VALIDATION'){
            const mappedErrorByKey = new Map();
            // if(error.all)
            (error.all as (ValidationError & {path: string})[]).forEach(element => {
                // First error extraction
                if(!mappedErrorByKey.has(element.path)){
                    mappedErrorByKey.set(element.path, element.message)
                }
            });
            return {
                type: "validation",
                validation_errors: Object.fromEntries(mappedErrorByKey)
            }
        }
    })
    /* -------------------------------------------------------------------------- */
}