import * as express from "express";

// Proširujemo postojeći Request interfejs kako bismo dodali userId
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Dodajemo korisnički ID kao opcionalni parametar
      role?: string;
    }
  }
}