import { Router } from 'express'
import * as myGamesCtrl from '../controllers/favorite.js'
import { isLoggedIn } from '../middleware/middleware.js'

export {
    router
}

const router = Router()

router.get('/', isLoggedIn, myGamesCtrl.index)
router.post('/', isLoggedIn, myGamesCtrl.create)
router.delete('/:gameId', isLoggedIn, myGamesCtrl.delete)