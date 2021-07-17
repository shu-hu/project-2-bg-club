import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js';

export {
    topBoardGames,
    details,
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
        // .then(json => console.log(json.items.item[0].name))
        // .then(responseJson => responseJson.items.item[0])
        .then(responseJson => {
            const game = responseJson.items.item?.[0];
            if (game) {
                res.render(`boardgames/details`, 
                    {
                        'user': null,
                        'title': 'Details', 
                        'name': game.name[0].$.value,
                        'image' : game.image,
                        'description' : game.description[0].replaceAll('&#10;', '\n').replaceAll('&mdash;', '-').replaceAll("&quot;", "'"),
                        'yearpublished' : game.yearpublished[0].$.value,
                        'designers' : game.link.filter(l => l.$.type === 'boardgamedesigner'),
                    }
                )
            } else {
                console.log('No game detail found');
                res.redirect('/boardgames/top')
            }
        })
}

