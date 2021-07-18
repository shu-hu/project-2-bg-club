import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js';
import { User } from '../models/user.js'

export {
    create,
}

function create(req, res) {
    User.findById(req.user._id, function(err, user) {
        const game = {
            name: req.body.gameName,
            image: req.body.gameImg,
            gameId: req.body.gameId,
        }
        user.favorite.push(game)
        user.save()
        res.redirect('back');
        
    })
}