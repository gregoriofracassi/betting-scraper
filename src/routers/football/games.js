import { Router } from 'express'
import createError from 'http-errors'
import GameModel from '../../_models/football/game/index.js'
import ProviderModel from '../../_models/provider/index.js'
// import { JWTAuthMiddleware } from "../../../auth/middlewares.js"
import { ProviderService } from '../../services/providers/index.js'
import { CommonUtils } from '../../utils/common.js'

const footballRouter = Router()

footballRouter.post('/games', async (req, res, next) => {
	try {
		const { provider_id, provider_name } = req.body
		const games = await ProviderService.getFootballGames(provider_name)

		games.forEach((game) => {
			game.teams.provider = provider_id
			game.odds.provider = provider_id
		})

		const saved_games = await GameModel.find()
		const [games_to_add, games_to_update] = ProviderService.determineGames(games, saved_games)

		await ProviderService.addTeamsandOdds(games_to_update)

		await GameModel.insertMany(games_to_add)
		console.info(`${games_to_add.length} games added in db`)

		res.status(201).send('Games correctly saved and updated')
	} catch (error) {
		console.log(error)
		next(createError(500, 'An error occurred while saving games'))
	}
})

export default footballRouter
