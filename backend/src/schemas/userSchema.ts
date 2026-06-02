import { z } from "zod";
import { UserRole } from "../entities/User";

// Validacija podataka za korisnike
export const userSchema = z.object({
  email: z.email("Invalid email address"), // Email mora biti validan
  first_name: z.string().min(1, "First name is required"), // Ime je obavezno
  last_name: z.string().min(1, "Last name is required"), // Prezime je obavezno
  role: z.enum(UserRole),
  status: z.boolean(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z.object({ 
    email: z.email("Invalid email address").optional(), // Email je opcionalan, ali ako se šalje, mora biti validan
    first_name: z.string().min(1, "First name is required").optional(), // Ime je obavezno
    last_name: z.string().min(1, "Last name is required").optional(), // Prezime je obavezno
    role: z.enum(UserRole).optional(),
    status: z.boolean().optional(),
});