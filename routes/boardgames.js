import { Router } from 'express'
import * as boardGamesCtrl from '../controllers/boardgames.js'
import { isLoggedIn } from '../middleware/middleware.js'

export {
    router
}

const router = Router()


router.get('/top', boardGamesCtrl.topBoardGames)
router.get('/:id', boardGamesCtrl.details)