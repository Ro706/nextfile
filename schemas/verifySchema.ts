import {z} from 'zod'

export const verifySchema = z.object({
    verifyCode: z.string()
        .length(6, {message: 'Verify code must be exactly 6 characters long'})
})