import { Router } from "express";
import { usuarioRouter } from "./routes/usuario.routes";
import { authRouter } from "./routes/auth.routes";
import { rolRouter } from "./routes/rol.routes";
import { sessionRouter } from "./routes/session.routes";

export class AppRoutes {
    static get routes(): Router{

        const router = Router();

        router.use('/usuarios', usuarioRouter)
        router.use('/auth', authRouter)
        router.use('/roles', rolRouter)
        router.use('/sessions', sessionRouter)
        
        return router
    }
}