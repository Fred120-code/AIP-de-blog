import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

// Création du routeur pour les routes d'authentification
// Ces routes gèrent l'inscription et la connexion des utilisateurs
const router = Router();

//routes d'inscription et de connexion
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

// Exportation du routeur pour l'utiliser dans l'application principale
export default router;