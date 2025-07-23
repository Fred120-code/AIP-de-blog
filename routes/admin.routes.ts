import express from "express"
import { authenticateToken } from "../middlewares/auth.middleware"
import { checkRole } from "../middlewares/roles.middleware"

const router = express.Router()

router.get("/profile", authenticateToken, checkRole("ADMIN"), 
    (req, res)=>{
        res.json({msg:"Listee des utilsateur réservée au admins."})
    })

    export default router;