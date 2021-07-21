import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js';
import { User } from '../models/user.js'
import { Reviews } from '../models/review.js'

export {
    topBoardGames,
    details,
    showSearch,
    createReview,
}

function createReview(req, res) {
    Reviews.create(req.body, function(err) {
        res.redirect(`/boardgames/${req.params.id}`)
    })
}

async function showSearch(req, res) {
    let searchResult;
    if (req.query.query) {
        searchResult = [];
        await fetch(`https://www.boardgamegeek.com/xmlapi2/search?type=boardgame&query=${req.query.query}`)
            .then(response => response.text())
            .then(responsexml => parseStringPromise(responsexml))
            .then(responseJson => {
                const games = responseJson.items.item;
                if (games) {
                    games.forEach(game => {
                        const gameName = game.name[0].$.value;
                        const gameId = game.$.id;
                        const gamePublished = game.yearpublished?.[0].$.value;
                        searchResult.push(
                            {
                                name: gameName,
                                gameId: gameId,
                                gamePublished: gamePublished,
                            }
                        )
                    });
                    
                } 
            })
    }
    
    User.findById(req.user._id, function(err, user) {
        res.render('boardgames/search', {
            title: 'Search',
            err: err,
            history: user.viewsHistory,   
            searchResult: searchResult,
            input: req.query.query,
        })
    })
}

function topBoardGames(req, res) {
    fetch("https://www.boardgamegeek.com/xmlapi2/hot?type=boardgame")
        .then(response => response.text())
        .then(responsexml => parseStringPromise(responsexml))
        .then(responseJson => res.render('boardgames/top', 
            {
                'title': 'Top', 
                'games': responseJson.items.item.slice(0, 20)
            }
        ))
}

function convertStr(input) {
    if (typeof input !== 'string') {
        return input;
    } 
    return input.replaceAll('&#10;', '\n').replaceAll('&mdash;', '-').replaceAll('&quot;', '\'');
}

function details(req, res) {
    const gameId = req.params.id;
    fetch(`https://www.boardgamegeek.com/xmlapi2/thing?type=boardgame&id=${gameId}`)
        .then(response => response.text())
        .then(responsexml => parseStringPromise(responsexml))
        .then(async function(responseJson) {
            const game = responseJson.items.item?.[0];
            if (game) {
                const reviews = await Reviews.find({gameId: gameId}).exec()
                User.findById(req.user._id, function(err, user) {
                    const gameName = game.name[0].$.value;
                    const gameThumbnail = game.thumbnail[0];
                    const gameImg = game.image[0];
                    const viewHistory = {
                        name: gameName,
                        image: gameThumbnail,
                        gameId: gameId,
                    }
                    user.viewsHistory.push(viewHistory)


                    console.log(game)
                    console.log(game.description?.[0])
                    console.log(`This is test:  ${convertStr(game.description?.[0])}`)

                    user.save(function(err) {
                        res.render(`boardgames/details`, 
                            {
                                'user': req.user._id,
                                'title': 'Details',
                                'id': gameId, 
                                'name': gameName,
                                'image' : gameImg,
                                'description' : convertStr(game.description?.[0]),
                                'yearpublished' : game.yearpublished[0].$.value,
                                'designers' : game.link.filter(l => l.$.type === 'boardgamedesigner'),
                                'categories' : game.link.filter(l => l.$.type === 'boardgamecategory'),
                                'reviews' : reviews,
                            }
                        )
                    })
                })
            } else {
                console.log('No game detail found');
                res.redirect('back');
            }
        })
}

