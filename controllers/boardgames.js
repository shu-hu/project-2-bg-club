import fetch from 'node-fetch'
import { parseStringPromise } from 'xml2js';

export {
    topBoardGames,
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