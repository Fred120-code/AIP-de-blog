import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";

/*
import  errorMiddleware  from "./middlewares/error.middleware";

import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import adminRoutes from "./routes/admin.routes";
*/
import authRoutes from "./routes/auth.routes";

dotenv.config();

//middlewares globaux
const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routs de l'api
/*
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/admin", adminRoutes)

//middleware d egestion des erreurs
app.use(errorMiddleware);
*/
app.use("/api/auth", authRoutes);
export default app;