import { Router } from 'express'
import createError from 'http-errors'
import ArbModel from '../_models/arb/index.js'
import GameModel from '../_models/game/index.js'
import { ArbService } from '../services/abrs/index.js'

const arbsRouter = Router()

arbsRouter.post('/football', async (req, res, next) => {
	try {
        const all_games = await GameModel.find({ 'odds.1': { $exists: true } })
        console.info(`Found ${all_games.length} games with more than one provider`)
        
        // const arbs = await ArbService.findGameArbs(odds)
        const arbs = []
        for (const game of all_games) {
            const game_arbs = await ArbService.findGameArbs(game.odds)
            game_arbs.forEach((arb) => {
                arb.game = game._id
            })
            arbs.push(...game_arbs)
        }

        res.status(201).send(arbs)
	} catch (error) {
        console.log(error)
		next(createError(500, 'An error occurred calculating arbs'))
	}
})

export default arbsRouter
