import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// Middleware za validaciju ulaznih podataka koristeći Zod šemu
export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); // Validiramo telo zahteva prema šemi
      next(); // Nastavljamo dalje ako je validacija uspešna
    } catch (err) {
        if(err instanceof ZodError) {
            return res.status(400).json({ error: err.issues }); // Vraćamo grešku ako validacija nije uspela
        }
    }
};