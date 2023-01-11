import GameModel from '../../_models/football/game/index.js'
import { compareTwoStrings } from 'string-similarity'
import { WilliamHillFootballUtils } from '../../utils/football/william_hill.js'
import { WilliamHillScraper } from '../scrapers/william_hill.js'
import { BetclicFootballUtils } from '../../utils/football/betclic.js'
import { BetclicScraper } from '../scrapers/betclic.js'
import { OddscheckerScraper } from '../scrapers/oddschecker.js'
import { OddscheckerFootballUtils } from '../../utils/football/oddschecker.js'

const getFootballGames = async (provider) => {
	const games_list = []

	switch (provider) {
		case 'williamhill':
			for (const url of WilliamHillFootballUtils.url_set) {
				const day_games = await WilliamHillScraper.getDayData(url)
				games_list.push(...day_games)
			}
			console.info(`William Hill total week games - ${games_list.length}`)
			break
		case 'betclic':
			for (const btn of BetclicFootballUtils.week_btns) {
				const day_games = await BetclicScraper.getDayData(BetclicFootballUtils.url, btn)
				games_list.push(...day_games)
			}
			console.info(`Betclic total week games - ${games_list.length}`)
			break
		// case 'oddschecker':
		// 	const urls = await OddscheckerScraper.getUrls(OddscheckerFootballUtils.urls.football)
		// 	for (const url of urls) {
		// 		const game_odds = await OddscheckerScraper.getGameData(url)
		// 		games_list.push(...game_odds)
		// 	}
		// 	console.log(games_list)
		// 	console.info(`Oddschecker total games - ${games_list.length}`)
		// 	break
		default:
			console.warn('Unknown provider')
	}
	return games_list
}

// week_game param structure: [
// 	{
// 		teams: {
// 			team_1: String
// 			team_2: String
// 		},
// 		odds: {
// 			one: Number,
// 			x: Number,
// 			two: Number,
// 		}
// 	}
// ]
const determineGames = (week_games, saved_games) => {
	const add_games = []
	const update_games = []
	week_games.forEach((scraped_game) => {
		const same_game = saved_games.find((saved_game) => {
			return saved_game.teams.some((teams) => {
				// add check on strings present
				const team_1_score = compareTwoStrings(scraped_game.teams.team_1, teams.team_1)
				const team_2_score = compareTwoStrings(scraped_game.teams.team_2, teams.team_2)
				const similarity = team_1_score + team_2_score
				if (
					scraped_game.teams.team_1.startsWith('guang') ||
					scraped_game.teams.team_1.startsWith('shan') ||
					scraped_game.teams.team_2.startsWith('guang') ||
					scraped_game.teams.team_2.startsWith('shan')
				) {
					return similarity > 1.6
				} else {
					return similarity > 1.35
				}
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
	getFootballGames,
}
