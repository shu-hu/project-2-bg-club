import { Router } from 'express'
import * as myGamesCtrl from '../controllers/favorite.js'
import { isLoggedIn } from '../middleware/middleware.js'

export {
    router
}

const router = Router()