import {Router} from 'express'
import {AuthController} from '../../domain/auth/auth.controller'

const authRouter = Router()
const authController = new AuthController();

authRouter.post('/login', authController.login)
authRouter.post('/logout', authController.logout)

export {authRouter}