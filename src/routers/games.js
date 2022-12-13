import { Router } from 'express'
import createError from 'http-errors'
import GameModel from '../_models/game/index.js'
import ProviderModel from '../_models/provider/index.js'
// import { JWTAuthMiddleware } from "../../../auth/middlewares.js"
import { ProviderService } from '../services/providers/index.js'
import { CommonUtils } from '../utils/common.js'

const footballRouter = Router()

footballRouter.post('/games', async (req, res, next) => {
	try {
		const { provider } = req.body
		const week_games = await ProviderService.getWeekGames(provider)

		const provider_name = CommonUtils.provider_names.find((prov) => prov.key === provider)
		const provider_entity = await ProviderModel.findOne({ name: provider_name.label })
		const provider_id = provider_entity._id
		week_games.forEach((game) => {
			game.teams.provider = provider_id
			game.odds.provider = provider_id
		})

		const saved_games = await GameModel.find()
		const [games_to_add, games_to_update] = ProviderService.determineGames(week_games, saved_games)

		await ProviderService.addTeamsandOdds(games_to_update)

		await GameModel.insertMany(games_to_add)
		console.info(`${games_to_add.length} games added in db`)

		res.status(201).send('done')
	} catch (error) {
		console.log(error)
		next(createError(500, 'An error occurred while saving new game'))
	}
})

export default footballRouter
