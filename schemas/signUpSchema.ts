import {z} from 'zod'

export const USernameValidation = z.string()
    .min(2, {message: 'Username must be at least 3 characters long'})
    .max(30, {message: 'Username must be at most 30 characters long'})
    .regex(/^[a-zA-Z0-9_]+$/, {message: 'Username can only contain letters, numbers, and underscores'})

export const signUpSchema = z.object({
    Username: USernameValidation,
    Email: z.string().
        email({message: 'Invalid email address'}),
    Password: z.string()
        .min(6, {message: 'Password must be at least 6 characters long'}),
    ConfirmPassword: z.string()
})
