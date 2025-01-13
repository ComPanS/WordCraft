import { z } from 'zod'

export const zEnvNonemptyTrimmed = z.string().trim().min(1)
export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed
    .optional()
    .refine((val) => `${process.env.HOST_ENV}` === 'local' || !!val, 'Required on not local host')
export const zEnvHost = z.enum(['local', 'production'])

export const zStringRequired = z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it')
export const zStringOptional = z.string().optional()
export const zEmailRequired = zStringRequired.email()
export const zStringMin = (min: number) => zStringRequired.min(min, `Text should be at least ${min} characters long`)
export const zPasswordMustBeTheSame =
    (passwordFiledName: string, passwordAgainFieldName: string) => (val: any, ctx: z.RefinementCtx) => {
        if (val[passwordFiledName] !== val[passwordAgainFieldName]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Passwords must be the same',
                path: [passwordAgainFieldName],
            })
        }
    }
