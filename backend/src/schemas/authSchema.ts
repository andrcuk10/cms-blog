import { z } from "zod";

// Šema za prijavu korisnika (login)
export const loginSchema = z.object({
  email: z.email("Invalid email address"), // Email mora biti validan
  password: z.string().min(6, "Password must be at least 6 characters long"), // Lozinka mora imati minimum 6 karaktera
});