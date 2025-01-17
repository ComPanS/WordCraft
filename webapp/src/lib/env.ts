import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@wordcraft/shared/src/zod'
import { z } from 'zod'

export const zEnv = z.object({
    NODE_ENV: z.enum(['development', 'production']),
    HOST_ENV: zEnvHost,
    SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
    VITE_BACKEND_URL: zEnvNonemptyTrimmed,
    VITE_WEBAPP_URL: zEnvNonemptyTrimmed,
    //   VITE_WEBAPP_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
    //   VITE_CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
    //   VITE_MIXPANEL_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
})

// const envFromBackend = (window as any).webappEnvFromBackend
// console.log("env",envFromBackend)
// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env)
