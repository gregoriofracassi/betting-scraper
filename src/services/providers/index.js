import GameModel from '../../_models/game/index.js'
import { compareTwoStrings } from 'string-similarity'
import { WilliamHillUtils } from '../../utils/william_hill.js'
import { WilliamHillScraper } from '../scrapers/william_hill.js'
import { BetclicUtils } from '../../utils/betclic.js'
import { BetclicScraper } from '../scrapers/betclic.js'

const getWeekGames = async (provider) => {
	const week_games = []

	switch (provider) {
		case 'williamhill':
			for (const url of WilliamHillUtils.url_set) {
				const day_games = await WilliamHillScraper.getDayData(url)
				week_games.push(...day_games)
			}
			console.info(`William Hill total week games - ${week_games.length}`)
			break
		case 'betclic':
			for (const btn of BetclicUtils.week_btns) {
				const day_games = await BetclicScraper.getDayData(BetclicUtils.url, btn)
				week_games.push(...day_games)
			}
			console.info(`Betclic total week games - ${week_games.length}`)
			break
		default:
			console.warn('Unknown provider')
	}

	return week_games
}

const determineGames = (week_games, saved_games) => {
	const add_games = []
	const update_games = []
	week_games.forEach((scraped_game) => {
		const same_game = saved_games.find((saved_game) => {
			return saved_game.teams.some((teams) => {
				const similarity = compareTwoStrings(scraped_game.teams.team_2, teams.team_2) + compareTwoStrings(scraped_game.teams.team_1, teams.team_1)
				return similarity > 1.4
				// return (
				// 	scraped_game.teams.team_1.slice(0,3) === teams.team_1.slice(0,3) &&
				// 	scraped_game.teams.team_2.slice(0,3) === teams.team_2.slice(0,3)
				// )
				// const teams_1s = compareTwoStrings(scraped_game.teams.teams_1, teams.team_1)
				// const teams_2s = compareTwoStrings(scraped_game.teams.teams_2, teams.team_2)
				// return (teams_1s + teams_2s) / 2 > 0.75
			})
		})
		if (same_game) {
			same_game.teams = scraped_game.teams
			same_game.odds = scraped_game.odds
			update_games.push(same_game)
		} else {
			add_games.push(scraped_game)
		}
	})
	return [add_games, update_games]
}

const addTeamsandOdds = async (games_to_update) => {
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
	console.info(`${updated_games.length} games updated in db`)
}

export const ProviderService = {
	determineGames,
	addTeamsandOdds,
	getWeekGames,
}
