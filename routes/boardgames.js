import { Router } from 'express'
import * as boardGamesCtrl from '../controllers/boardgames.js'
import { isLoggedIn } from '../middleware/middleware.js'

export {
    router
}

const router = Router()


router.get('/top', isLoggedIn, boardGamesCtrl.topBoardGames)
router.get('/search', isLoggedIn, boardGamesCtrl.showSearch)
router.get('/:id', isLoggedIn, boardGamesCtrl.details)
router.post('/:id/reviews', boardGamesCtrl.createReview)
