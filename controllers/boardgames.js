import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js';
import { User } from '../models/user.js'

export {
    topBoardGames,
    details,
    showSearch,
}

async function showSearch(req, res) {
    let searchResult;
    if (req.query.query) {
        searchResult = [];
        console.log("helloooooooo")
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
            title: 'View History',
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
        // .then(json => console.log(json.items.item[0]))
        .then(responseJson => res.render('boardgames/top', 
            {
                'user': null,
                'title': 'Top', 
                'games': responseJson.items.item.slice(0, 10)
            }
        ))
}

function details(req, res) {
    const gameId = req.params.id;
    fetch(`https://www.boardgamegeek.com/xmlapi2/thing?type=boardgame&id=${gameId}`)
        .then(response => response.text())
        .then(responsexml => parseStringPromise(responsexml))
        .then(responseJson => {
            const game = responseJson.items.item?.[0];
            if (game) {
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
                    user.save(function(err) {
                        res.render(`boardgames/details`, 
                            {
                                'user': null,
                                'title': 'Details',
                                'id': gameId, 
                                'name': gameName,
                                'image' : gameImg,
                                'description' : game.description[0].replaceAll('&#10;', '\n').replaceAll('&mdash;', '-').replaceAll("&quot;", "'"),
                                'yearpublished' : game.yearpublished[0].$.value,
                                'designers' : game.link.filter(l => l.$.type === 'boardgamedesigner'),
                                'categories' : game.link.filter(l => l.$.type === 'boardgamecategory'),
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

