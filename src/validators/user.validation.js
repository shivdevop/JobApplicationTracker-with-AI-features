import {z} from "zod"

export const userRegisterSchema=z.object({
    username:z.string().min(8),
    email:z.email("invalid email format").toLowerCase(),
    password:z.string().min(8)
})