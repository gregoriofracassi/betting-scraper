import { Router } from 'express'
import createError from 'http-errors'
import GameModel from '../../../_models/game/index.js'
// import { JWTAuthMiddleware } from "../../../auth/middlewares.js"
import { URL_SET, PROVIDER_NAME_WILLIAM_HILL } from '../../../utils/william_hill.js'
import { URL, WEEK_BTNS, PROVIDER_NAME_BETCLIC } from '../../../utils/betclic.js'
import { getWilliamHillDayData } from '../../scrapers/william_hill.js'
import { getBetclicDayData } from '../../scrapers/betclic.js'
import { determineGames } from '../../providers/index.js'
import ProviderModel from '../../../_models/provider/index.js'

const gamesRouter = Router()

gamesRouter.post('/williamhill', async (req, res, next) => {
	try {
		const week_games = []
		for (const url of URL_SET) {
			const day_games = await getWilliamHillDayData(url)
			week_games.push(...day_games)
		}
		console.info(`William Hill total week games - ${week_games.length}`)

		const provider = await ProviderModel.findOne({ name: PROVIDER_NAME_WILLIAM_HILL }) // possibly in services
		const provider_id = provider._id
		week_games.forEach((game) => {
			game.teams.provider = provider_id
			game.odds.provider = provider_id
		})

		const saved_games = await GameModel.find()
		const [games_to_add, games_to_update] = determineGames(week_games, saved_games)

		const updated_games = []
		for (const game of games_to_update) {
			const updated = await GameModel.findByIdAndUpdate(
				game._id,
				{
					$push: { teams: game.teams, odds: game.odds },
				},
				{
					runValidators: true,
					new: true,
				}
			)
			updated_games.push(updated)
		}
		console.info(`${games_to_update.length} games updated in db`)

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
		for (const btn of WEEK_BTNS) {
			const day_games = await getBetclicDayData(URL, btn)
			week_games.push(...day_games)
		}
		console.info(`Betclic total week games - ${week_games.length}`)

		const provider = await ProviderModel.findOne({ name: PROVIDER_NAME_BETCLIC })
		const provider_id = provider._id
		week_games.forEach((game) => {
			;(game.teams.provider = provider_id), (game.odds.provider = provider_id)
		})

		await GameModel.insertMany(week_games)
		console.info('Games saved in db')
		res.status(201).send(`Saved ${week_games.length} games`)
	} catch (error) {
		console.log(error)
		next(createError(500, 'An error occurred while saving new game'))
	}
})

export default gamesRouter
