import { Router } from 'express'
import createError from 'http-errors'
import GameModel from '../_models/game/index.js'
import ProviderModel from '../_models/provider/index.js'
// import { JWTAuthMiddleware } from "../../../auth/middlewares.js"
import { WilliamHillUtils } from '../utils/william_hill.js'
import { BetclicUtils } from '../utils/betclic.js'
import { WilliamHillScraper } from '../services/scrapers/william_hill.js'
import { BetclicScraper } from '../services/scrapers/betclic.js'
import { ProviderService } from '../services/providers/index.js'

const gamesRouter = Router()

gamesRouter.post('/williamhill', async (req, res, next) => {
	try {
		const week_games = []
		for (const url of WilliamHillUtils.url_set) {
			const day_games = await WilliamHillScraper.getDayData(url)
			week_games.push(...day_games)
		}
		console.info(`William Hill total week games - ${week_games.length}`)

		const provider = await ProviderModel.findOne({ name: WilliamHillUtils.provider_name }) // possibly in services
		const provider_id = provider._id
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

gamesRouter.post('/betclic', async (req, res, next) => {
	try {
		const week_games = []
		for (const btn of BetclicUtils.week_btns) {
			const day_games = await BetclicScraper.getDayData(BetclicUtils.url, btn)
			week_games.push(...day_games)
		}
		console.info(`Betclic total week games - ${week_games.length}`)

		const provider = await ProviderModel.findOne({ name: BetclicUtils.provider_name })
		const provider_id = provider._id
		week_games.forEach((game) => {
			game.teams.provider = provider_id
			game.odds.provider = provider_id
		})

		const saved_games = await GameModel.find()
		const [games_to_add, games_to_update] = ProviderService.determineGames(week_games, saved_games)

		await ProviderService.addTeamsandOdds(games_to_update)

		await GameModel.insertMany(games_to_add)
		console.info(`${games_to_add.length} games added in db`)

		res.status(201).send(`Saved ${week_games.length} games`)
	} catch (error) {
		console.log(error)
		next(createError(500, 'An error occurred while saving new game'))
	}
})

export default gamesRouter
