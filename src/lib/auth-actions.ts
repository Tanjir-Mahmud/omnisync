'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from 'zod'; // Import Zod

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
});

export async function registerUser(prevState: string | undefined, formData: FormData) {
    const data = Object.fromEntries(formData.entries());

    const parsed = RegisterSchema.safeParse(data);
    if (!parsed.success) {
        return "Invalid data"
    }

    const { name, email, password } = parsed.data;

    try {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) return "User already exists";

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });
        return "Success";
    } catch (e) {
        return "Failed to register user";
    }
}
