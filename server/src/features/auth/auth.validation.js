import { z } from "zod";

export const signupSchema = z.object({
    username: z.string().min(3, "Username must be atleast 3 characters").max(15),
    email: z.email("Invalid email").transform(email => email.toLowerCase()),
    password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, "Weak password")
});
