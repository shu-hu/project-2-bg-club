import { Router } from 'express'
import * as boardGamesCtrl from '../controllers/boardgames.js'

export {
    router
}

const router = Router()

// router.get('/', boardGamesCtrl.index)
router.get('/top', boardGamesCtrl.topBoardGames)