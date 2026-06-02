import jwt from 'jsonwebtoken'
import { UserRole } from '../entities/User';

// Ključ za potpisivanje i verifikaciju JWT tokena
const JWT_SECRET = "supertajnikljuc";

// Funkcija za generisanje JWT tokena
export const generateToken = (userId: string, role: UserRole, name: string) => {
  return jwt.sign({ userId, role, name }, JWT_SECRET);
};

// Funkcija za verifikaciju JWT tokena
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET); // Proverava validnost i dekodira token
};