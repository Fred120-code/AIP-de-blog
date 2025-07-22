import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // format: "Bearer <token>"

  if (!token) return res.status(401).json({ message: "Accès non autorisé." });

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide." });

    // Injecter l'ID de l'utilisateur dans la requête
    (req as any).userId = (user as any).id;
    next();
  });
};
