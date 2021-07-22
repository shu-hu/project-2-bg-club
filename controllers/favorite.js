import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js';
import { User } from '../models/user.js'

export {
    create,
    index,
    deleteFavorite as delete,
}

function deleteFavorite(req, res) {
    User.findById(req.user._id, function(err, user) {
        user.favorite.remove({_id: req.params.gameId})
        user.save(function(err) {
            // res.redirect("/favorite")
            res.redirect(req.body.next);
        })
    })
}

function index(req, res) {
    User.findById(req.user._id, function(err, user) {
        res.render('favorite/index', {
            title: 'Favorite',
            err: err,
            favorite: user.favorite,
        })
    })
}

function create(req, res) {
    User.findById(req.user._id, function(err, user) {
        if(user.favorite.some(game => 
            game.gameId == req.body.gameId)
        ) {
            res.redirect('back');
        } else {
            const game = {
                name: req.body.gameName,
                image: req.body.gameImg,
                gameId: req.body.gameId,
            }
            user.favorite.push(game)
            user.save()
            res.redirect('back');
        }
    })
}