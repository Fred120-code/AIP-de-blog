import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "../generated/prisma";
import { when } from "joi";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"; 
// Enregistre un nouvel utilisateur
export const register = async (req: Request, res:Response) => {
    const {name, email, password} = req.body;
    try {
        // Vérification des champs requis
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
        }

        // Vérification si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
             res.status(400).json({ msg: "Email déjà utilisé" });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            msg: "Utilisateur créé avec succès"
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ msg: "Erreur interne du serveur" });
    }
}

// Connecte un utilisateur existant
export const login = async (req:Request, res:Response) => {
    const {email, password} = req.body;
    try{
        //verification des champs requis
        if(!email || !password) {
             res.status(400).json({ msg: "Veuillez remplir tous les champs" });
        }

        // Recherche de l'utilisateur
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user){
            return res.status(404).json({ msg: "Utilisateur non trouvé" });
        }

        // Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            return res.status(401).json({ msg: "Mot de passe incorrect" });
        }

        // Création du token JWT
        const token = jwt.sign({ id:user.id}, JWT_SECRET,{
            expiresIn: "1h"
        })

        res.status(200).json({
            msg:"Connexion réussie",
            token
        })
    }catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ msg: "Erreur interne du serveur" });
    }
}

// afficher les informations de l'utilisateur connecté

export const getProfile = async (req:Request, res:Response) => {
    const userId = (req as any).userId; 

    if (!userId) {
        return res.status(401).json({ msg: "Utilisateur non authentifié" });
    }
    try{
        const user = await prisma.user.findUnique({
            where:{id:userId},
            select:{id: true, name: true, email: true}
        })

        if(!user){
            return res.status(404).json({ msg: "Utilisateur non trouvé" });
        }
            return res.status(200).json(user);

    }catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        return res.status(500).json({ msg: "Erreur interne du serveur" });
    }
}

/**
 * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2ZiYjJhOTk3OWI4Y2IwNmE0MzMwMCIsImVtYWlsIjoiam9yYW5AZ21haWwuY29tIiwiaWF0IjoxNzUzMjAxNTI3LCJleHAiOjE3NTMyMDUxMjd9.UWzFQkaMd2NCqB6zJmElCQc5xV721vF9sE1IsHuj2JM
 */