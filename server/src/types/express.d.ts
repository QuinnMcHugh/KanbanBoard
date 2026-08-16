// Augments Express's per-response `res.locals` bag (otherwise typed `Record<string, any>`)
// with the fields this app actually stores there.
declare namespace Express {
    interface Locals {
        cspNonce: string;
    }
}
