import app from "./app";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma";
import { log } from "console";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer(){
    try{
        await prisma.$connect();
        console.log('Connexion à la base de donées réeussie');

        // Démarrage du serveur
        app.listen(PORT, () =>{
            console.log(`Serveur lancé sur http://localhost:${PORT}`);
        });
    }catch (error) {
        console.log(`Erreur lors du lancement du serveur : ${error}`);
        process.exit(1);
    }
}

startServer()
