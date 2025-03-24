import { z } from 'zod'
import { zEnvNonemptyTrimmed } from './zod'

declare global {
    const webappEnvFromBackend: Record<string, string> | undefined
}
const windowEnv = typeof webappEnvFromBackend !== 'undefined' ? webappEnvFromBackend : {}
const getSharedEnvVariable = (key: string) =>
    windowEnv[`VITE_${key}`] || windowEnv[key] || process.env[`VITE_${key}`] || process.env[key]

const sharedEnvRaw = {
    CLOUDINARY_CLOUD_NAME: getSharedEnvVariable('CLOUDINARY_CLOUD_NAME'),
    WEBAPP_URL: getSharedEnvVariable('WEBAPP_URL'),
    BACKEND_URL: getSharedEnvVariable('BACKEND_URL'),
}

const zEnv = z.object({
    CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
    WEBAPP_URL: zEnvNonemptyTrimmed,
    BACKEND_URL: zEnvNonemptyTrimmed,
})

export const sharedEnv = zEnv.parse(sharedEnvRaw)
